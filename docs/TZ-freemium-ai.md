# ТЗ: Freemium модель ИИ-учителя в Arabic App

## Цель
Ввести freemium-модель: бесплатные пользователи получают ограниченное количество запросов к ИИ-учителю (Gemini Flash Lite), Pro-подписчики — безлимит на топовой модели (Claude Opus 4.6 или GPT-4o).

---

## 1. Изменения в базе данных (Prisma)

### 1.1 Обновить модель User

Файл: `apps/backend/prisma/schema.prisma`

Добавить поля в модель `User`:

```prisma
plan            String   @default("free")    // "free" | "pro"
planExpiresAt   DateTime?                     // null = бессрочно (для free)
dailyAiRequests Int      @default(0)          // счётчик запросов за сегодня
lastAiRequestDate DateTime?                   // дата последнего запроса (для сброса счётчика)
```

### 1.2 Создать модель Payment

```prisma
model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Int                            // сумма в тийинах (1 UZS = 1 тийин × 100? нет, хранить в минимальных единицах)
  currency    String   @default("UZS")       // UZS | USD
  provider    String                         // "payme" | "click" | "stripe"
  status      String   @default("pending")   // "pending" | "completed" | "failed" | "refunded"
  externalId  String?                        // ID транзакции в платёжной системе
  planDays    Int      @default(30)          // на сколько дней продлевается подписка
  createdAt   DateTime @default(now())
  completedAt DateTime?
}
```

Добавить relation в User:
```prisma
payments Payment[]
```

### 1.3 Миграция
```bash
pnpm db:migrate
```

---

## 2. Backend: Лимиты ИИ-запросов

### 2.1 Конфигурация лимитов

Файл: `apps/backend/src/config/aiLimits.ts` (новый)

```typescript
export const AI_LIMITS = {
  free: {
    dailyRequests: 10,
    model: 'gemini',           // gemini-2.0-flash-lite (бесплатный/дешёвый)
    maxTokens: 300,
  },
  pro: {
    dailyRequests: Infinity,
    model: 'anthropic',        // claude-opus-4-6 (или claude-sonnet-4-6)
    maxTokens: 1000,
  },
};
```

### 2.2 Middleware проверки лимита

Файл: `apps/backend/src/middleware/aiRateLimit.ts` (новый)

Логика:
1. Получить userId из req (через requireAuth)
2. Загрузить user из БД (plan, dailyAiRequests, lastAiRequestDate)
3. Если `lastAiRequestDate` не сегодня → сбросить `dailyAiRequests` в 0
4. Если `plan === "free"` и `dailyAiRequests >= AI_LIMITS.free.dailyRequests` → вернуть ошибку:
   ```json
   { "ok": false, "error": "daily_limit_reached", "limit": 10, "plan": "free", "upgradeUrl": "/settings/pro" }
   ```
5. Если `plan === "pro"` и `planExpiresAt < now()` → откатить plan на "free", проверить лимит заново
6. Инкрементировать `dailyAiRequests` и обновить `lastAiRequestDate`
7. Записать в `req.aiModel` какую модель использовать (gemini / anthropic)

### 2.3 Обновить route `/api/chat`

Файл: `apps/backend/src/routes/chat.ts`

Изменения:
1. Добавить middleware `aiRateLimit` перед обработчиком
2. Использовать `req.aiModel` для выбора модели:
   - `gemini` → текущая логика callGemini()
   - `anthropic` → новая функция callAnthropic()
3. Добавить функцию `callAnthropic()`:
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - Model: `claude-opus-4-6` (или `claude-sonnet-4-6` для экономии)
   - Header: `x-api-key`, `anthropic-version: 2023-06-01`
   - Системный промпт: тот же что для Gemini (из текущего кода)
   - Max tokens: 1000 (для Pro)
4. В ответ добавить информацию о лимитах:
   ```json
   {
     "ok": true,
     "data": {
       "reply": "...",
       "usage": {
         "dailyUsed": 3,
         "dailyLimit": 10,    // или null для pro
         "plan": "free"
       }
     }
   }
   ```

### 2.4 Новый endpoint: статус лимитов

`GET /api/chat/status` (requireAuth)

Ответ:
```json
{
  "plan": "free",
  "dailyUsed": 7,
  "dailyLimit": 10,
  "model": "gemini",
  "planExpiresAt": null
}
```

---

## 3. Backend: Платежи и подписка

### 3.1 Роуты подписки

Файл: `apps/backend/src/routes/subscription.ts` (новый)

#### `GET /api/subscription`
Текущий статус подписки пользователя:
```json
{
  "plan": "free",
  "expiresAt": null,
  "prices": {
    "monthly": { "UZS": 30000, "USD": 3 },
    "yearly":  { "UZS": 250000, "USD": 25 }
  }
}
```

#### `POST /api/subscription/create`
Создать платёж:
```json
// Request
{ "period": "monthly", "provider": "payme" }

// Response
{ "paymentId": "xxx", "redirectUrl": "https://payme.uz/..." }
```

#### `POST /api/subscription/webhook/:provider`
Webhook от платёжной системы (Payme/Click/Stripe):
1. Валидировать подпись webhook
2. Найти Payment по externalId
3. Обновить Payment.status = "completed"
4. Обновить User.plan = "pro"
5. Установить User.planExpiresAt = now + planDays

#### `POST /api/subscription/cancel`
Отменить автопродление (plan остаётся pro до planExpiresAt)

### 3.2 Платёжные провайдеры

Для Узбекистана (приоритет):
- **Payme** — самый популярный
- **Click** — второй по популярности

Для международных:
- **Stripe** — карты Visa/MC

Реализовать адаптер:
```typescript
interface PaymentProvider {
  createPayment(amount: number, currency: string, orderId: string): Promise<{ redirectUrl: string }>;
  verifyWebhook(body: any, headers: any): boolean;
  getPaymentStatus(externalId: string): Promise<'pending' | 'completed' | 'failed'>;
}
```

Начать с **одного провайдера** (Payme), остальные добавить позже.

---

## 4. Frontend: UI лимитов

### 4.1 Счётчик в чате

Файл: `apps/frontend/src/components/Chat.tsx` (или аналог)

Над полем ввода показывать:
```
[||||||||--] 8/10 бесплатных запросов
```

Когда лимит исчерпан:
```
┌──────────────────────────────────────┐
│  ⚡ Лимит запросов на сегодня        │
│  исчерпан                            │
│                                      │
│  С Pro-подпиской:                    │
│  ✓ Безлимитные запросы               │
│  ✓ Топовая ИИ-модель (Claude)       │
│  ✓ Подробные объяснения              │
│                                      │
│  [Попробовать Pro — 30,000 сум/мес]  │
│                                      │
│  Или подождите до завтра             │
└──────────────────────────────────────┘
```

### 4.2 Бейдж Pro

В header/navbar рядом с аватаром:
- Free: ничего
- Pro: бейдж "PRO" (золотой)

### 4.3 Страница подписки

Файл: `apps/frontend/src/pages/ProPage.tsx` (новый)
Роут: `/pro`

Содержание:
```
┌──────────────────────────────────────────────────┐
│             ⚡ Arabic App Pro                     │
│                                                  │
│  ┌──────────────┐    ┌──────────────┐           │
│  │   Ежемесячно │    │   Ежегодно   │           │
│  │              │    │              │           │
│  │  30,000 сум  │    │ 250,000 сум  │           │
│  │    $3/мес    │    │   $25/год    │           │
│  │              │    │  экономия 30%│           │
│  │  [Выбрать]   │    │  [Выбрать]   │           │
│  └──────────────┘    └──────────────┘           │
│                                                  │
│  Что включено:                                   │
│  ✓ Безлимитные запросы к ИИ-учителю             │
│  ✓ Топовая модель Claude Opus 4.6              │
│  ✓ Подробные объяснения до 1000 слов           │
│  ✓ Без рекламы                                  │
│  ✓ Приоритетная поддержка                       │
│                                                  │
│  Методы оплаты:                                  │
│  [Payme]  [Click]  [Visa/MC]                    │
└──────────────────────────────────────────────────┘
```

### 4.4 Страница настроек — секция подписки

Файл: `apps/frontend/src/pages/SettingsPage.tsx`

Добавить секцию:
```
Подписка: Free / Pro (до 15.05.2026)
[Управить подпиской]
```

---

## 5. Frontend: Локализация (i18n)

Добавить ключи в каждый язык (`common.json`):

```json
{
  "pro": {
    "badge": "PRO",
    "title": "Arabic App Pro",
    "monthly": "Ежемесячно",
    "yearly": "Ежегодно",
    "perMonth": "/мес",
    "perYear": "/год",
    "savings": "экономия {{percent}}%",
    "features": {
      "unlimited": "Безлимитные запросы к ИИ-учителю",
      "topModel": "Топовая модель Claude Opus",
      "detailed": "Подробные объяснения",
      "noAds": "Без рекламы",
      "support": "Приоритетная поддержка"
    },
    "limitReached": "Лимит запросов на сегодня исчерпан",
    "upgradePrompt": "Попробовать Pro",
    "waitTomorrow": "Или подождите до завтра",
    "requestsLeft": "{{used}}/{{limit}} запросов",
    "unlimited": "Безлимит",
    "currentPlan": "Текущий план",
    "expiresAt": "Действует до {{date}}",
    "subscribe": "Оформить подписку",
    "cancel": "Отменить подписку",
    "manage": "Управить подпиской"
  }
}
```

Аналогично для `uz` и `en`.

---

## 6. Переменные окружения

Добавить в `.env`:

```env
# Pro AI model
ANTHROPIC_API_KEY=sk-ant-...

# Payment providers
PAYME_MERCHANT_ID=...
PAYME_MERCHANT_KEY=...
CLICK_MERCHANT_ID=...
CLICK_SERVICE_ID=...
CLICK_SECRET_KEY=...
STRIPE_SECRET_KEY=...         # опционально
STRIPE_WEBHOOK_SECRET=...     # опционально

# Plan config
PRO_MONTHLY_PRICE_UZS=30000
PRO_YEARLY_PRICE_UZS=250000
PRO_MONTHLY_PRICE_USD=3
PRO_YEARLY_PRICE_USD=25
FREE_DAILY_AI_LIMIT=10
```

---

## 7. Порядок реализации

### Фаза 1 — MVP (3-5 дней)
1. Миграция БД (новые поля User + модель Payment)
2. Middleware `aiRateLimit`
3. Обновить `/api/chat` — выбор модели по плану
4. Endpoint `GET /api/chat/status`
5. Frontend: счётчик запросов в чате
6. Frontend: экран "лимит исчерпан" с кнопкой апгрейда

### Фаза 2 — Оплата (5-7 дней)
7. Интеграция Payme (основной для UZ)
8. Роуты `/api/subscription/*`
9. Frontend: страница `/pro`
10. Frontend: секция подписки в настройках
11. Webhook обработка

### Фаза 3 — Полировка (2-3 дня)
12. Добавить Click как второй провайдер
13. Stripe для международных карт
14. Email уведомления (подписка истекает через 3 дня)
15. Аналитика: конверсия free→pro, retention
16. A/B тест: 5 vs 10 vs 15 бесплатных запросов

---

## 8. Метрики успеха

- **Конверсия free → pro**: цель 2-5%
- **Retention Pro**: цель >70% на 2й месяц
- **ARPU**: цель $1-2 (с учётом бесплатных)
- **Расход на API**: <30% от дохода

---

## 9. Риски

| Риск | Решение |
|------|---------|
| Мало кто конвертируется | A/B тест лимитов (5/10/15), улучшить качество Pro-ответов |
| Anthropic API дорого | Начать с Claude Sonnet 4.6 ($3/$15 вместо $15/$75) |
| Payme интеграция сложная | Начать со Stripe (проще API), добавить Payme позже |
| Юзеры создают новые аккаунты для обхода лимита | Привязка по device fingerprint / IP (фаза 3) |
