#!/bin/sh
set -e

echo "🗄  Running database migrations..."
npx prisma migrate deploy

echo "🌱  Seeding database..."
node -e "
const { PrismaClient } = require('@prisma/client');
const { ACHIEVEMENTS_SEED } = require('./dist/lib/seed-data');
// Seed is handled separately; skip if already seeded
" 2>/dev/null || true

# Run the seed script if it exists compiled
if [ -f "./dist/prisma/seed.js" ]; then
  echo "🌱  Running seed..."
  node ./dist/prisma/seed.js || true
fi

echo "🚀  Starting server..."
exec node dist/index.js
