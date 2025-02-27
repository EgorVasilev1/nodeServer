"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorRedisAuth = void 0;
const redis_js_1 = require("../../../config/redis.js");
class ConnectorRedisAuth {
    redis;
    constructor(redis) {
        this.redis = new redis_js_1.RedisClient();
    }
    async set(key, value, expire) {
        await this.redis.set(key, value, expire);
    }
    async get(key) {
        await this.redis.get(key);
    }
    async del(key, key2) {
        await this.redis.del(key);
    }
}
exports.ConnectorRedisAuth = ConnectorRedisAuth;
