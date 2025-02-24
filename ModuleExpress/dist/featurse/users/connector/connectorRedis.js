"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorRedisUsers = void 0;
const redis_js_1 = require("../../../config/redis.js");
class ConnectorRedisUsers {
    redis;
    constructor(redis) {
        this.redis = new redis_js_1.RedisClient();
    }
    async del(key, key2) {
        await this.redis.del(key);
    }
}
exports.ConnectorRedisUsers = ConnectorRedisUsers;
