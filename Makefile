.PHONY: all help install 

help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-\\.]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

all: help

install: ## Install Node.js dependencies
	$(info Installing dependencies...)
	npm install



db-start: ## Start PostgreSQL in Docker
	$(info Starting PostgreSQL...)
	docker run -d --name postgres \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=postgres \
		-v postgres_data:/var/lib/postgresql/data \
		postgres:13-alpine

