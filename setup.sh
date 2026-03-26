#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo -e "${BLUE}   🕌  Arabic Alphabet App — Setup         ${NC}"
echo -e "${BLUE}══════════════════════════════════════════${NC}\n"

# 1. Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"
command -v node  >/dev/null || { echo "❌ Node.js not found. Install from https://nodejs.org"; exit 1; }
command -v pnpm  >/dev/null || { echo "❌ pnpm not found. Run: npm i -g pnpm"; exit 1; }
command -v docker>/dev/null || { echo "❌ Docker not found. Install from https://docker.com"; exit 1; }
echo "✅ All dependencies found"

# 2. Copy env
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}⚠️  .env created from .env.example${NC}"
  echo -e "${YELLOW}   Please fill in JWT_ACCESS_SECRET and JWT_REFRESH_SECRET before running:${NC}"
  echo -e "${YELLOW}   openssl rand -base64 64  # run twice for two secrets${NC}"
else
  echo "✅ .env already exists"
fi

# 3. Auto-generate secrets if they are placeholder
if grep -q "your_access_secret_here" .env 2>/dev/null; then
  ACCESS=$(openssl rand -base64 48)
  REFRESH=$(openssl rand -base64 48)
  sed -i.bak "s|your_access_secret_here|${ACCESS}|g" .env
  sed -i.bak "s|your_refresh_secret_here|${REFRESH}|g" .env
  rm -f .env.bak
  echo "✅ JWT secrets auto-generated"
fi

# 4. Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
pnpm install
echo "✅ Dependencies installed"

# 5. Start infrastructure
echo -e "\n${YELLOW}Starting PostgreSQL + Redis...${NC}"
docker-compose up -d postgres redis
echo "⏳ Waiting for services to be ready..."
sleep 5

# 6. Migrate & seed
echo -e "\n${YELLOW}Running database migrations...${NC}"
pnpm db:migrate

echo -e "\n${YELLOW}Seeding achievements...${NC}"
pnpm db:seed

echo -e "\n${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅  Setup complete!                      ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "\nStart the app with:\n"
echo -e "  ${BLUE}pnpm dev${NC}           # development mode"
echo -e "  ${BLUE}make docker-up${NC}     # production mode via Docker\n"
echo -e "Frontend: http://localhost:5173"
echo -e "Backend:  http://localhost:4000\n"
