# Деплой Ferrum Link на сервер 89.207.255.66

## Контекст
Проект нужно развернуть на чистом сервере Ubuntu 24.04 (4GB RAM, 96GB диск). В проекте уже есть Dockerfile и docker-compose.yml. Используем Docker Compose для запуска всех сервисов.

## План

### 1. Установить Docker и Docker Compose на сервере
- Установить Docker Engine через официальный репозиторий
- Docker Compose идёт в комплекте с Docker Engine

### 2. Клонировать репозиторий на сервер
- `git clone https://github.com/uvaissov/darkhan_ferrum_link.git`

### 3. Создать .env файл
- DATABASE_URL и REDIS_URL для production

### 4. Запустить docker-compose
- `docker compose up -d --build` — собрать и запустить все сервисы (app, db, redis)
- pgadmin не нужен на production

### 5. Применить миграции и seed
- `docker compose exec app npx prisma migrate deploy`
- `docker compose exec app npx prisma db seed` (опционально)

### 6. Настроить Nginx как reverse proxy
- Установить Nginx
- Настроить проксирование с порта 80 на localhost:3000
- Это позволит обращаться к сайту по IP без указания порта

### 7. Проверка
- Открыть http://89.207.255.66 в браузере
- Проверить что сайт загружается
