.PHONY: up down migrate api web test tidy

up:
	docker compose up

down:
	docker compose down

migrate:
	cd apps/api && go run cmd/migrate/main.go

api:
	cd apps/api && go run cmd/server/main.go

web:
	cd apps/web && npm run dev

test:
	cd apps/api && go test ./...

tidy:
	cd apps/api && go mod tidy