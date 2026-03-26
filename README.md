# 🕌 Arabic Alphabet — Full-Stack Learning App

Полноценное веб-приложение для изучения арабского алфавита с геймификацией, мультиязычностью (RU/UZ/EN) и соревнованиями в реальном времени.

## 🏗 Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind + Framer Motion |
| State | Zustand + React Query |
| i18n | i18next (ru / uz / en) |
| Backend | Node.js + Express + TypeScript + WebSocket |
| Auth | JWT (access + refresh) + Google OAuth |
| ORM | Prisma |
| DB | PostgreSQL + Redis |
| Deploy | Docker + docker-compose |

## 🚀 Быстрый старт

### 1. Установка
```bash
git clone <repo>
cd arabic-app
cp .env.example .env
# Заполни .env (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID)
```

### 2. Запуск через Docker
```bash
docker-compose up -d        # запустит postgres + redis + backend + frontend
```

### 3. Локальная разработка
```bash
# Убедись что postgres и redis запущены (через docker-compose или локально)
pnpm install                # установка всех зависимостей монорепо
pnpm db:migrate             # применить миграции Prisma
pnpm db:seed                # заполнить достижениями
pnpm dev                    # запустить frontend (5173) + backend (4000)
```

## 📁 Структура проекта

```
arabic-app/
├── packages/
│   └── shared/src/index.ts       ← типы, LETTERS[28], ACHIEVEMENTS_SEED
├── apps/
│   ├── backend/
│   │   ├── prisma/schema.prisma  ← схема БД
│   │   ├── prisma/seed.ts
│   │   └── src/
│   │       ├── index.ts          ← Express + WebSocket
│   │       ├── lib/              ← auth, prisma, redis, ws
│   │       ├── middleware/       ← requireAuth, errorHandler
│   │       ├── routes/           ← auth, user, progress, achievements, leaderboard, challenges
│   │       └── services/         ← achievements checker, streak
│   └── frontend/
│       └── src/
│           ├── i18n/locales/     ← ru / uz / en (3×3 файла)
│           ├── lib/api.ts        ← axios + auto token refresh
│           ├── store/            ← authStore, toastStore
│           ├── hooks/            ← useProgress, useAchievements, useChallenge
│           ├── components/       ← UI, layout, learn, progress
│           └── pages/            ← все страницы + 8 режимов обучения
```

## 🎮 Режимы обучения

| Режим | Описание |
|-------|----------|
| 📇 Карточки | Flip-карточки, "знаю/не знаю", карточка уходит в конец при ошибке |
| 🎯 Квиз | 3 типа вопросов в перемешку: ISO → имя, форма в слове → имя, имя → форма |
| ⚡ Скорость | 60 секунд, 4 варианта ответа, рекорды в таблице |
| 🌩️ Молния | Без подсказки, измеряется среднее время ответа |
| 🧠 Память | Сетка пар буква↔название, найди все 28 пар |
| 🔊 На слух | Web Speech API читает имя, выбери гляф |
| 🔍 Найди | Строка из 9 букв, нажми на нужную |
| ✍️ Написание | Canvas рисование + сравнение с полупрозрачным шаблоном |

## 🏆 Геймификация

- **4 уровня**: Новичок (0-6) → Ученик (7-13) → Знаток (14-21) → Мастер (22-28)
- **13 достижений**: от «Первой буквы» до «30 дней подряд»
- **Streak**: ежедневная полоса, хранится в БД
- **Таблица рекордов**: по скорости, молнии, памяти, стрику

## 🌐 API

```
POST   /api/auth/register|login|refresh|google
DELETE /api/auth/logout
GET|PATCH /api/user/me
PATCH  /api/user/language
GET    /api/progress          → все буквы + статус
POST   /api/progress/session  → сохранить результаты
GET    /api/progress/stats|chart
GET    /api/achievements
GET    /api/leaderboard/speed?mode=speed|lightning|memory
GET    /api/leaderboard/streak
POST   /api/challenges
GET    /api/challenges/:token
POST   /api/challenges/:token/accept|result
WS     ws://host?token=JWT&challengeId=ID
```

## 🔐 Переменные окружения

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_ACCESS_SECRET=...      # openssl rand -base64 64
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:5173
PORT=4000
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
```
