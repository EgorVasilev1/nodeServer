import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

export class RedisClient {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT)
            }
            
        });

        this.client.on("error", (err) => console.error("Ошибка Redis:", err));
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("Соединение с Redis установлено");
        } catch (err) {
            console.error("Ошибка при подключении к Redis:", err);
        }
    }

    async set(key: string, value: string, expirationInSeconds?: number) {
        try {
            if (expirationInSeconds) {
                await this.client.set(key, value, { EX: expirationInSeconds });
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
