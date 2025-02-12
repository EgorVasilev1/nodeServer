# nodeServer
## Установка зависимостей
```npm
npm install
```
## Запуск ```PostgeSQL```
```docker
docker-compose up -d
```
## Запуск ```Redis```
```docker
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```
## Запуск проекта
```npm
node server.js
```
