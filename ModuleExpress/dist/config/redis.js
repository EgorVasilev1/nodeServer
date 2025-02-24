"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class RedisClient {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({
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
        }
        catch (err) {
            console.error("Ошибка при подключении к Redis:", err);
        }
    }
    async set(key, value, expirationInSeconds) {
        try {
            if (expirationInSeconds) {
                await this.client.set(key, value, { EX: expirationInSeconds });
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (err) {
            console.error(`Ошибка при установке ключа ${key}:`, err);
            throw err;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (err) {
            console.error(`Ошибка при получении ключа ${key}:`, err);
            throw err;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (err) {
            console.error(`Ошибка при удалении ключа ${key}:`, err);
            throw err;
        }
    }
    async disconnect() {
        try {
            await this.client.quit();
            console.log("Отключение от Redis");
        }
        catch (err) {
            console.error("Ошибка при отключении от Redis:", err);
        }
    }
}
exports.RedisClient = RedisClient;
