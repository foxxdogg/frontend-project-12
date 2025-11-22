build:
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/dist

lint-frontend:
	make -C frontend lint

install:
	npm ci

dev:
	npm run dev