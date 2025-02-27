import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export class RedisClient {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });

        this.client.on('connect', () => console.log("Redis подключён"));
        this.client.on('error', (err) => console.error("Ошибка Redis:", err));
    }

    async connect() {
        if (this.client.status !== "ready") {
            try {
                // Явное подключение только если статус не 'ready'
                await this.client.connect();
                console.log(
                    `Соединение с Redis установлено(http://${process.env.REDIS_HOST}:${Number(process.env.REDIS_PORT)})`
                );
            } catch (err) {
                console.error("Ошибка при подключении к Redis:", err);
            }
        }
    }

    async set(key: string, value: string, expirationInSeconds?: number) {
        try {
            console.log("Redis status:", this.client.status);
            console.log(`Сохраняю в Redis: ${key} → ${value}`);
            if (expirationInSeconds) {
                await this.client.set(key, value, "EX", expirationInSeconds);
            } else {
                await this.client.set(key, value);
            }
        } catch (err) {
            console.error(`Ошибка при установке ключа ${key}:`, err);
            throw err;
        }
    }

    async get(key: string) {
        try {
            console.log(`Запрашиваю из Redis: ${key}`);
            return await this.client.get(key);
        } catch (err) {
            console.error(`Ошибка при получении ключа ${key}:`, err);
            throw err;
        }
    }

    async del(key: string) {
        try {
            await this.client.del(key);
        } catch (err) {
            console.error(`Ошибка при удалении ключа ${key}:`, err);
            throw err;
        }
    }

    async disconnect() {
        try {
            await this.client.quit();
            console.log("Отключение от Redis");
        } catch (err) {
            console.error("Ошибка при отключении от Redis:", err);
        }
    }
}