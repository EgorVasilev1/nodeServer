import { RedisClient } from "../../../config/redis.js";

export class ConnectorRedisUsers {
    private redis: RedisClient;

    constructor(redis: RedisClient) {
        this.redis = new RedisClient();
    }

    async del(key: string, key2: string) {
        await this.redis.del(key);
    }
}