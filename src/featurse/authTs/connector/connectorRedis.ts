import { RedisClient } from "../../../config/redis.js";

export class ConnectorRedisAuth {
    private redis: RedisClient;

    constructor(redis: RedisClient) {
        this.redis = new RedisClient();
    }

    async set(key: string, value: string, expire: number) {
        await this.redis.set(key, value, expire);
    }

    async get(key: string) {
        await this.redis.get(key);
    }

    async del(key: string, key2: string) {
        await this.redis.del(key);
    }
}