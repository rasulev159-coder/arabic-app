# 🚀 Deployment Guide

## Option A — Render.com (рекомендуется, бесплатный тир)

### 1. База данных PostgreSQL
1. New → PostgreSQL
2. Скопируй `DATABASE_URL` из Dashboard

### 2. Redis (Upstash)
1. Зайди на upstash.com → New Database
2. Скопируй Redis URL

### 3. Backend (Web Service)
```
Root Directory:  apps/backend
Build Command:   pnpm install && pnpm db:migrate && pnpm build
Start Command:   node dist/index.js
```
**Environment Variables:**
```
DATABASE_URL=         (из шага 1)
REDIS_URL=            (из шага 2)
JWT_ACCESS_SECRET=    (openssl rand -base64 64)
JWT_REFRESH_SECRET=   (openssl rand -base64 64)
GOOGLE_CLIENT_ID=     (Google Cloud Console)
GOOGLE_CLIENT_SECRET= (Google Cloud Console)
FRONTEND_URL=         https://your-frontend.onrender.com
NODE_ENV=production
```

### 4. Frontend (Static Site)
```
Root Directory:  apps/frontend
Build Command:   pnpm install && pnpm build
Publish Dir:     dist
```
**Environment Variables:**
```
VITE_API_URL=  https://your-backend.onrender.com
VITE_WS_URL=   wss://your-backend.onrender.com
```

---

## Option B — Railway.app

```bash
# Установи Railway CLI
npm i -g @railway/cli
railway login
railway init

# Backend
cd apps/backend
railway up

# Frontend  
cd apps/frontend
railway up
```

Настрой переменные через Railway Dashboard.

---

## Option C — VPS (Ubuntu 22.04)

### Установка
```bash
# Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone репо
git clone <your-repo> /opt/arabic-app
cd /opt/arabic-app
cp .env.example .env
nano .env  # заполни все переменные
```

### Запуск
```bash
docker-compose --profile prod up -d

# Применить миграции
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

### SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Google OAuth Setup

1. console.cloud.google.com → New Project
2. APIs & Services → OAuth 2.0 Client IDs
3. Authorized redirect URIs:
   - `https://yourdomain.com/login`
   - `http://localhost:5173/login` (для dev)
4. Скопируй Client ID и Secret в `.env`

---

## Переменные окружения (полный список)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# JWT (generate: openssl rand -base64 64)
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# App
FRONTEND_URL=https://yourdomain.com
PORT=4000
NODE_ENV=production

# Frontend (build-time)
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```
