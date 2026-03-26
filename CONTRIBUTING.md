# Contributing Guide

## Setup

```bash
./setup.sh   # one-command setup
pnpm dev     # start dev servers
```

## Project Structure

```
packages/shared/   — shared TypeScript types and letter data
apps/backend/      — Express + Prisma + WebSocket API
apps/frontend/     — React + Vite + Tailwind SPA
```

## Development Workflow

### Adding a new learn mode

1. Create `apps/frontend/src/pages/learn/YourMode.tsx`
2. Export it from `apps/frontend/src/pages/learn/index.ts`
3. Add route in `App.tsx`
4. Add mode card in `Dashboard.tsx`
5. Add translations to all three locale files (`ru/uz/en` → `learn.json`)
6. Add `StudyMode` type to `packages/shared/src/index.ts`

### Adding a new achievement

1. Add to `ACHIEVEMENTS_SEED` in `packages/shared/src/index.ts`
2. Add handler in `apps/backend/src/services/achievements.ts`
3. Add translations in all locale `achievements.json` files
4. Run `pnpm db:seed` to insert into database

### Adding a new API route

1. Create `apps/backend/src/routes/yourRoute.ts`
2. Register in `apps/backend/src/index.ts`
3. Add TypeScript types to `packages/shared/src/index.ts`
4. Create corresponding hook in `apps/frontend/src/hooks/`
5. Write tests in `apps/backend/src/__tests__/yourRoute.test.ts`

## Code Style

- **TypeScript strict mode** — no `any` except in justified edge cases
- **Zod validation** — all API inputs validated on both client and server
- **i18n** — all user-visible strings go through `t()`, never hardcoded
- **Tailwind** — no inline `style` objects except for dynamic values
- **Framer Motion** — use `motion.*` components for all page-level animations

## Testing

```bash
pnpm test              # run all tests
pnpm test:backend      # backend only
pnpm test:shared       # shared package only
pnpm --filter=backend test:watch   # watch mode
```

## Database changes

```bash
# Create a new migration
pnpm --filter=backend prisma migrate dev --name your_change_name

# Apply to production
pnpm --filter=backend prisma migrate deploy

# Inspect DB visually
pnpm db:studio
```

## Pull Request Guidelines

1. Branch from `develop`
2. Name branch: `feat/your-feature`, `fix/bug-name`, `chore/task`
3. All tests must pass
4. TypeScript must compile without errors
5. Add translations for all three languages if adding UI text
6. Update `README.md` if adding a new mode or major feature
