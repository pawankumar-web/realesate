.PHONY: up down build rebuild logs test

up:
	docker compose -f docker/docker-compose.yml up -d

down:
	docker compose -f docker/docker-compose.yml down

build:
	docker compose -f docker/docker-compose.yml build

rebuild: down build up

logs:
	docker compose -f docker/docker-compose.yml logs -f

test:
	cd frontend && npm test
