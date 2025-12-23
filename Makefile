install:
	npm ci

build:
	make -C frontend install
	make -C frontend build

start:
	npx start-server -s ./frontend/dist

lint-frontend:
	make -C frontend lint

dev:
	make -C frontend install
	npm run dev --prefix frontend