.PHONY: setup dev build migrate seed docker-up docker-down clean

## First-time setup
setup:
	cp -n .env.example .env || true
	pnpm install
	$(MAKE) docker-infra
	sleep 3
	$(MAKE) migrate
	$(MAKE) seed
	@echo "\n✅  Setup complete! Run 'make dev' to start.\n"

## Start infrastructure only (postgres + redis)
docker-infra:
	docker-compose up -d postgres redis

## Start full stack via docker-compose
docker-up:
	docker-compose up -d

## Stop all containers
docker-down:
	docker-compose down

## Dev mode (requires postgres + redis running)
dev:
	pnpm dev

## Run DB migrations
migrate:
	pnpm db:migrate

## Seed database
seed:
	pnpm db:seed

## Open Prisma Studio
studio:
	pnpm db:studio

## Production build
build:
	pnpm build

## Clean build artifacts
clean:
	find . -name "dist" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null; true
	find . -name ".vite" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null; true

## Wipe node_modules (full reset)
reset:
	find . -name "node_modules" -exec rm -rf {} + 2>/dev/null; true
	$(MAKE) setup

## View backend logs
logs-backend:
	docker-compose logs -f backend

## View all logs
logs:
	docker-compose logs -f
