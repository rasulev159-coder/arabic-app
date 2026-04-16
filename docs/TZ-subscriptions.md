# ТЗ: Подписки и платежи — Arabic App Pro

## Текущее состояние
- ✅ Prisma: User.plan, User.planExpiresAt, User.dailyAiRequests, модель Payment — уже есть
- ✅ ProPage.tsx — UI с ценами, кнопки "Coming soon" (disabled)
- ❌ Backend routes для подписок — нет
- ❌ Интеграция Payme/Click — нет
- ❌ Middleware лимитов ИИ — нет
- ❌ Управление подпиской — нет

## Важно: Stripe НЕ работает в Узбекистане
Используем **Payme** + **Click** — два основных платёжных шлюза в UZ.
Рекомендуется библиотека **PayTechUZ** (`@paytechuz/core`) — унифицированный SDK для обоих провайдеров.

---

## 1. Установка зависимостей

### Backend (`apps/backend/package.json`)

```bash
cd apps/backend
pnpm add @paytechuz/core
```

Если `@paytechuz/core` недоступен в npm, установить вручную:
```bash
pnpm add crypto   # для HMAC подписей (встроен в Node.js)
```

---

## 2. Переменные окружения

### Файл: `.env` (backend)

```env
# === Payme ===
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key
PAYME_TEST_MODE=true                    # true для тестового режима
PAYME_CHECKOUT_URL=https://checkout.paycom.uz

# === Click ===
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SERVICE_ID=your_service_id
CLICK_MERCHANT_USER_ID=your_merchant_user_id
CLICK_SECRET_KEY=your_secret_key
CLICK_TEST_MODE=true

# === Подписка ===
PRO_MONTHLY_PRICE_UZS=30000
PRO_YEARLY_PRICE_UZS=250000
PRO_MONTHLY_DAYS=30
PRO_YEARLY_DAYS=365

# === ИИ ===
ANTHROPIC_API_KEY=sk-ant-...            # для Pro юзеров
FREE_DAILY_AI_LIMIT=10

# === App ===
APP_URL=https://arabic-app.vercel.app   # для callback URL
```

---

## 3. Обновление Prisma схемы

### Файл: `apps/backend/prisma/schema.prisma`

Проверить и обновить модель Payment (если нужно):

```prisma
model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Сумма
  amount      Int                           // сумма в тийинах (Payme) или сумах (Click)
  currency    String   @default("UZS")
  
  // Провайдер
  provider    String                        // "payme" | "click"
  
  // Статус
  status      String   @default("pending")  // "pending" | "completed" | "failed" | "cancelled" | "refunded"
  
  // Внешние ID
  externalId  String?                       // ID транзакции в платёжной системе
  orderId     String   @unique              // Наш внутренний номер заказа (для webhook)
  
  // План
  planType    String                        // "monthly" | "yearly"
  planDays    Int      @default(30)
  
  // Метаданные
  metadata    String?                       // JSON — доп. данные от провайдера
  errorMessage String?                      // Текст ошибки если failed
  
  // Даты
  createdAt   DateTime @default(now())
  completedAt DateTime?
  
  @@index([userId])
  @@index([orderId])
  @@index([externalId])
  @@index([status])
}
```

### Миграция:
```bash
pnpm db:migrate
```

---

## 4. Backend: Конфигурация подписок

### Файл: `apps/backend/src/config/subscription.ts` (новый)

```typescript
export const PLANS = {
  monthly: {
    key: 'monthly',
    days: Number(process.env.PRO_MONTHLY_DAYS) || 30,
    price: {
      UZS: Number(process.env.PRO_MONTHLY_PRICE_UZS) || 30000,
    },
  },
  yearly: {
    key: 'yearly',
    days: Number(process.env.PRO_YEARLY_DAYS) || 365,
    price: {
      UZS: Number(process.env.PRO_YEARLY_PRICE_UZS) || 250000,
    },
  },
} as const;

export const AI_LIMITS = {
  free: {
    dailyRequests: Number(process.env.FREE_DAILY_AI_LIMIT) || 10,
    model: 'gemini',            // gemini-2.0-flash-lite
    maxTokens: 300,
  },
  pro: {
    dailyRequests: Infinity,
    model: 'anthropic',         // claude-sonnet-4-6 (или opus)
    maxTokens: 1000,
  },
} as const;

export type PlanType = keyof typeof PLANS;
```

---

## 5. Backend: Payme интеграция

### Файл: `apps/backend/src/services/payme.ts` (новый)

### Payme использует Merchant API (JSON-RPC поверх HTTP):

```
Эндпоинт Payme: https://checkout.paycom.uz/api
Авторизация: Basic base64(Paycom:MERCHANT_KEY)
Формат: JSON-RPC 2.0
```

### Методы которые Payme вызывает на НАШЕМ сервере (webhook):

Payme отправляет POST запросы на наш endpoint `/api/payments/payme/webhook`.
Мы должны реализовать обработку следующих JSON-RPC методов:

1. **CheckPerformTransaction** — Payme проверяет, можно ли выполнить платёж
   - Проверяем: существует ли заказ, правильная ли сумма, не оплачен ли уже
   - Ответ: `{ allow: true }` или ошибка

2. **CreateTransaction** — Payme создаёт транзакцию
   - Сохраняем `payme_transaction_id` в нашу базу
   - Обновляем Payment.externalId

3. **PerformTransaction** — Payme подтверждает успешную оплату
   - Обновляем Payment.status = "completed"
   - Активируем подписку пользователю (User.plan = "pro", User.planExpiresAt)

4. **CancelTransaction** — Payme отменяет транзакцию
   - Обновляем Payment.status = "cancelled"
   - Если подписка была активирована — откатываем (или нет, по бизнес-логике)

5. **CheckTransaction** — Payme проверяет статус транзакции
   - Возвращаем текущий статус из нашей базы

6. **GetStatement** — Payme запрашивает отчёт за период
   - Возвращаем список транзакций за указанный период

### Авторизация входящих запросов от Payme:
- Header: `Authorization: Basic <base64(Paycom:<key>)>`
- В тестовом режиме ключ: `PAYME_SECRET_KEY` из .env (тестовый)
- В продакшене: другой ключ (выдаётся Payme)

### Формат запроса от Payme:
```json
{
  "id": 123,
  "method": "CheckPerformTransaction",
  "params": {
    "amount": 3000000,
    "account": {
      "order_id": "payment_cuid123"
    }
  }
}
```

### Формат ответа:
```json
{
  "id": 123,
  "result": {
    "allow": true
  }
}
```

### Формат ошибки:
```json
{
  "id": 123,
  "error": {
    "code": -31050,
    "message": { "ru": "Заказ не найден", "uz": "Buyurtma topilmadi", "en": "Order not found" }
  }
}
```

### Коды ошибок Payme:
- `-31001` — Неверная сумма
- `-31050` — Заказ не найден
- `-31051` — Заказ уже оплачен
- `-31052` — Заказ отменён
- `-31008` — Невозможно выполнить операцию

### ВАЖНО: Суммы в Payme указываются в ТИЙИНАХ (1 сум = 100 тийин)
- 30,000 сум = 3,000,000 тийин
- 250,000 сум = 25,000,000 тийин

---

## 6. Backend: Click интеграция

### Файл: `apps/backend/src/services/click.ts` (новый)

### Click использует два endpoint:

#### 6.1 Prepare (предварительная проверка)
Click отправляет POST на `/api/payments/click/prepare`

```
Параметры:
- click_trans_id: ID транзакции в Click
- service_id: ID сервиса
- click_paydoc_id: номер платёжного документа
- merchant_trans_id: наш order_id
- amount: сумма
- action: 0 (prepare)
- error: 0 (нет ошибки)
- error_note: описание
- sign_time: время подписи (YYYY-MM-DD HH:mm:ss)
- sign_string: MD5(click_trans_id + service_id + secret_key + merchant_trans_id + amount + action + sign_time)
```

Ответ:
```json
{
  "click_trans_id": 123456,
  "merchant_trans_id": "payment_cuid123",
  "merchant_prepare_id": 1,
  "error": 0,
  "error_note": "Success"
}
```

#### 6.2 Complete (подтверждение оплаты)
Click отправляет POST на `/api/payments/click/complete`

```
Параметры: те же + action: 1 (complete) + merchant_prepare_id
sign_string: MD5(click_trans_id + service_id + secret_key + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)
```

Ответ:
```json
{
  "click_trans_id": 123456,
  "merchant_trans_id": "payment_cuid123",
  "merchant_confirm_id": 1,
  "error": 0,
  "error_note": "Success"
}
```

### Верификация подписи Click:
```typescript
import crypto from 'crypto';

function verifyClickSign(params: ClickParams, secretKey: string): boolean {
  const signString = `${params.click_trans_id}${params.service_id}${secretKey}${params.merchant_trans_id}${params.amount}${params.action}${params.sign_time}`;
  const expectedSign = crypto.createHash('md5').update(signString).digest('hex');
  return expectedSign === params.sign_string;
}
```

### Коды ошибок Click:
- `0` — Успех
- `-1` — SIGN CHECK FAILED
- `-2` — Неверная сумма
- `-3` — Action не найден
- `-4` — Заказ уже оплачен
- `-5` — Заказ не найден
- `-6` — Транзакция не найдена
- `-7` — Ошибка обновления
- `-8` — Заказ отменён
- `-9` — Ошибка применения

---

## 7. Backend: Роуты подписки

### Файл: `apps/backend/src/routes/subscription.ts` (новый)

### 7.1 `GET /api/subscription` (requireAuth)

Текущий статус подписки пользователя:

```typescript
// Response:
{
  "ok": true,
  "data": {
    "plan": "free" | "pro",
    "expiresAt": "2026-05-16T00:00:00Z" | null,
    "daysLeft": 30 | null,
    "aiUsage": {
      "used": 7,
      "limit": 10,       // null для pro
      "model": "gemini"  // или "anthropic"
    },
    "prices": {
      "monthly": { "UZS": 30000 },
      "yearly":  { "UZS": 250000, "savings": "30%" }
    },
    "history": [
      { "id": "...", "date": "...", "amount": 30000, "provider": "payme", "planType": "monthly", "status": "completed" }
    ]
  }
}
```

### 7.2 `POST /api/subscription/create` (requireAuth)

Создать платёж и получить ссылку на оплату:

```typescript
// Request:
{ "planType": "monthly" | "yearly", "provider": "payme" | "click" }

// Response:
{
  "ok": true,
  "data": {
    "paymentId": "payment_cuid123",
    "orderId": "ORD-20260416-abc123",
    "provider": "payme",
    "redirectUrl": "https://checkout.paycom.uz/..."  // для Payme
    // или для Click: "https://my.click.uz/services/pay?..."
  }
}
```

**Логика:**
1. Создать запись Payment в БД (status: "pending")
2. Сформировать orderId (уникальный)
3. Для Payme: сформировать URL чекаута:
   ```
   https://checkout.paycom.uz/<BASE64_ENCODED_PARAMS>
   
   Params (до base64):
   m=MERCHANT_ID;ac.order_id=ORD-123;a=3000000;c=https://arabic-app.vercel.app/profile?tab=subscription
   ```
4. Для Click: сформировать URL:
   ```
   https://my.click.uz/services/pay?service_id=XXX&merchant_id=XXX&amount=30000&transaction_param=ORD-123&return_url=https://arabic-app.vercel.app/profile?tab=subscription
   ```
5. Вернуть redirectUrl клиенту

### 7.3 `POST /api/payments/payme/webhook` (без auth — вызывается Payme)

Обработка JSON-RPC запросов от Payme:

```typescript
// 1. Проверить Authorization header (Basic auth с ключом Payme)
// 2. Распарсить JSON-RPC: method + params
// 3. Обработать по method:
//    - CheckPerformTransaction → проверить заказ
//    - CreateTransaction → создать транзакцию
//    - PerformTransaction → подтвердить оплату → АКТИВИРОВАТЬ ПОДПИСКУ
//    - CancelTransaction → отменить
//    - CheckTransaction → статус
//    - GetStatement → отчёт
// 4. Вернуть JSON-RPC ответ
```

### 7.4 `POST /api/payments/click/prepare` (без auth — вызывается Click)

```typescript
// 1. Верифицировать sign_string (MD5)
// 2. Найти Payment по merchant_trans_id
// 3. Проверить сумму
// 4. Обновить Payment (сохранить click_trans_id)
// 5. Вернуть merchant_prepare_id
```

### 7.5 `POST /api/payments/click/complete` (без auth — вызывается Click)

```typescript
// 1. Верифицировать sign_string (MD5)
// 2. Найти Payment по merchant_trans_id + merchant_prepare_id
// 3. Если error === 0 → АКТИВИРОВАТЬ ПОДПИСКУ
// 4. Обновить Payment.status = "completed"
// 5. Вернуть merchant_confirm_id
```

---

## 8. Функция активации подписки

### Файл: `apps/backend/src/services/subscription.ts` (новый)

```typescript
async function activateSubscription(userId: string, planType: 'monthly' | 'yearly'): Promise<void> {
  const plan = PLANS[planType];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // Если уже Pro и не истёк — продлить от текущей даты окончания
  // Если Free или Pro истёк — начать от сейчас
  const startDate = (user.plan === 'pro' && user.planExpiresAt && user.planExpiresAt > new Date())
    ? user.planExpiresAt
    : new Date();
  
  const expiresAt = new Date(startDate);
  expiresAt.setDate(expiresAt.getDate() + plan.days);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'pro',
      planExpiresAt: expiresAt,
    },
  });
}

async function deactivateExpiredSubscriptions(): Promise<void> {
  // Вызывается cron-задачей раз в час
  await prisma.user.updateMany({
    where: {
      plan: 'pro',
      planExpiresAt: { lt: new Date() },
    },
    data: {
      plan: 'free',
    },
  });
}
```

---

## 9. Backend: Middleware лимитов ИИ

### Файл: `apps/backend/src/middleware/aiRateLimit.ts` (новый)

```typescript
// Подключить к роуту POST /api/chat ПЕРЕД основным хэндлером

async function aiRateLimit(req: AuthRequest, res: Response, next: NextFunction) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  
  // 1. Проверить истечение Pro
  if (user.plan === 'pro' && user.planExpiresAt && user.planExpiresAt < new Date()) {
    await prisma.user.update({ where: { id: user.id }, data: { plan: 'free' } });
    user.plan = 'free';
  }
  
  // 2. Сбросить дневной счётчик если новый день
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = user.lastAiRequestDate?.toISOString().slice(0, 10);
  if (lastDate !== today) {
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyAiRequests: 0, lastAiRequestDate: new Date() },
    });
    user.dailyAiRequests = 0;
  }
  
  // 3. Проверить лимит для free
  const limits = AI_LIMITS[user.plan as 'free' | 'pro'];
  if (user.plan === 'free' && user.dailyAiRequests >= limits.dailyRequests) {
    return res.status(429).json({
      ok: false,
      error: 'daily_limit_reached',
      data: {
        used: user.dailyAiRequests,
        limit: limits.dailyRequests,
        plan: 'free',
        upgradeUrl: '/pro',
      },
    });
  }
  
  // 4. Инкрементировать счётчик
  await prisma.user.update({
    where: { id: user.id },
    data: {
      dailyAiRequests: { increment: 1 },
      lastAiRequestDate: new Date(),
    },
  });
  
  // 5. Передать модель в req
  (req as any).aiModel = limits.model;
  (req as any).aiMaxTokens = limits.maxTokens;
  (req as any).aiUsage = {
    used: user.dailyAiRequests + 1,
    limit: user.plan === 'pro' ? null : limits.dailyRequests,
    plan: user.plan,
  };
  
  next();
}
```

### Обновить `/api/chat`:
1. Добавить `aiRateLimit` middleware
2. Использовать `req.aiModel` для выбора: callGemini() или callAnthropic()
3. Добавить `callAnthropic()` функцию
4. Вернуть `usage` в ответе

---

## 10. Backend: callAnthropic()

### Файл: `apps/backend/src/routes/chat.ts` — добавить функцию

```typescript
async function callAnthropic(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',  // или claude-opus-4-6
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}
```

---

## 11. Frontend: Обновить ProPage

### Файл: `apps/frontend/src/pages/ProPage.tsx`

Изменения:
1. Убрать "Coming soon" — сделать кнопки активными
2. При клике на "Payme" / "Click":
   ```typescript
   const handlePayment = async (provider: 'payme' | 'click', planType: 'monthly' | 'yearly') => {
     setLoading(true);
     const { data } = await api.post('/subscription/create', { planType, provider });
     window.location.href = data.data.redirectUrl;  // редирект на Payme/Click
   };
   ```
3. После оплаты пользователь вернётся на `/profile?tab=subscription` (callback URL)

---

## 12. Frontend: Управление подпиской

### Файл: `apps/frontend/src/pages/ProfilePage.tsx` (или SettingsPage.tsx)

Секция "Подписка":

```
┌──────────────────────────────────────────────────┐
│  💎 Подписка                                     │
│                                                  │
│  Текущий план: Pro                               │
│  Действует до: 16.05.2026 (30 дней)             │
│  ████████████████████░░░ 80%                     │
│                                                  │
│  [Продлить подписку]                             │
│                                                  │
│  История платежей:                               │
│  ┌────────────────────────────────────────────┐  │
│  │ 16.04.2026 | 30,000 сум | Payme | ✅      │  │
│  │ 16.03.2026 | 30,000 сум | Click | ✅      │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

Для Free:
```
┌──────────────────────────────────────────────────┐
│  Текущий план: Free                              │
│  ИИ-запросов сегодня: 7/10                       │
│                                                  │
│  [Перейти на Pro — от 30,000 сум/мес]           │
└──────────────────────────────────────────────────┘
```

---

## 13. Frontend: Счётчик ИИ-запросов в чате

### Файл: компонент TeacherChat (или ChatPage)

После каждого ответа ИИ показывать:
```
Запросов: 7/10 | Free план
[Безлимит с Pro →]
```

Когда лимит исчерпан — вместо поля ввода:
```
┌──────────────────────────────────────────────────┐
│  Лимит на сегодня исчерпан (10/10)              │
│                                                  │
│  С Pro: безлимитные запросы + Claude AI          │
│  [Перейти на Pro]                                │
│                                                  │
│  Обновится завтра в 00:00                        │
└──────────────────────────────────────────────────┘
```

---

## 14. Cron: Истечение подписок

### Файл: `apps/backend/src/cron/subscriptionExpiry.ts` (новый)

Раз в час проверять и деактивировать истёкшие подписки:

```typescript
// Вызывать через setInterval или Vercel Cron
// Или через эндпоинт GET /api/cron/check-subscriptions (вызывается Vercel Cron)

async function checkExpiredSubscriptions() {
  const expired = await prisma.user.updateMany({
    where: {
      plan: 'pro',
      planExpiresAt: { lt: new Date() },
    },
    data: { plan: 'free' },
  });
  
  console.log(`Deactivated ${expired.count} expired subscriptions`);
}
```

### Vercel Cron (vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/check-subscriptions",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## 15. Регистрация мерчанта (что нужно от тебя)

### Payme:
1. Зайти на **business.payme.uz**
2. Зарегистрироваться как мерчант
3. Указать webhook URL: `https://arabic-app.vercel.app/api/payments/payme/webhook`
4. Получить: `MERCHANT_ID`, `SECRET_KEY` (тестовый и продакшн)
5. Начать в тестовом режиме

### Click:
1. Зайти на **merchant.click.uz**
2. Зарегистрироваться
3. Указать:
   - Prepare URL: `https://arabic-app.vercel.app/api/payments/click/prepare`
   - Complete URL: `https://arabic-app.vercel.app/api/payments/click/complete`
4. Получить: `MERCHANT_ID`, `SERVICE_ID`, `MERCHANT_USER_ID`, `SECRET_KEY`
5. Начать в тестовом режиме

---

## 16. Порядок реализации

### Фаза 1 — Инфраструктура (2-3 часа)
1. Обновить Prisma schema (если нужно) + миграция
2. Создать `config/subscription.ts`
3. Создать `services/subscription.ts` (активация/деактивация)
4. Создать `middleware/aiRateLimit.ts`
5. Подключить aiRateLimit к `/api/chat`

### Фаза 2 — Payme (3-4 часа)
6. Создать `services/payme.ts` — обработка JSON-RPC
7. Роут `POST /api/payments/payme/webhook`
8. Роут `POST /api/subscription/create` (Payme часть)
9. Тестирование с Payme Sandbox

### Фаза 3 — Click (2-3 часа)
10. Создать `services/click.ts` — prepare/complete
11. Роуты `POST /api/payments/click/prepare` и `/complete`
12. Обновить `POST /api/subscription/create` (Click часть)
13. Тестирование с Click Sandbox

### Фаза 4 — Frontend (2-3 часа)
14. Активировать кнопки в ProPage.tsx
15. Секция подписки в профиле (статус, история, продление)
16. Счётчик ИИ-запросов в чате
17. Экран "лимит исчерпан"

### Фаза 5 — Cron и продакшн (1-2 часа)
18. Cron для проверки истёкших подписок
19. Добавить callAnthropic() в chat.ts
20. Тестирование end-to-end
21. Переключение на продакшн ключи

---

## 17. Безопасность

- Webhook endpoints НЕ требуют JWT auth (вызываются платёжными системами)
- НО обязательна верификация подписи (HMAC/MD5) для каждого webhook
- Хранить secret keys ТОЛЬКО в env variables, НИКОГДА в коде
- Логировать ВСЕ платёжные операции (создание, webhook, статус)
- Idempotency: повторный webhook с тем же ID не должен дублировать оплату
- Rate limit на `POST /api/subscription/create` — максимум 5 запросов/мин на юзера
