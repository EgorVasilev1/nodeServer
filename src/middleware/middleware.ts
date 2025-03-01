import jwt from 'jsonwebtoken';
import { RedisClient } from '../config/redis.js'; // Assuming RedisClient is exported this way
import dotenv from 'dotenv';
import { UnauthorizedError } from '../config/401UnauthorizedError.js';
import { NotFoundError } from '../config/404NotFoundError.js';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export class Middleware {
    private redis: RedisClient
    
    constructor(redis: RedisClient) {
      this.redis = redis;
    }

    public async authMiddleware(req, res, next) {
        console.log("Middleware сработал");
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.error("Ошибка: Токен отсутствует!");
            throw new UnauthorizedError('Токен отсутствует');
        }
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        console.log("Полученный токен:", token);
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
            const username = decoded.username;
            console.log("Username из токена:", username);
            const userTokens = await this.redis.get(username);
            console.log("Данные из Redis:", userTokens);
            if (!userTokens) {
                console.error("Ошибка: Пользователь не найден в Redis!");
                throw new NotFoundError('Пользователь не найден');
            }
            const { accessToken } = JSON.parse(userTokens);
            if (token !== accessToken) {
                console.error("Ошибка: Токен не совпадает!");
                throw new UnauthorizedError('Недействительный токен');
            }
            req.user = { username };
            next();
        } catch (err) {
            console.error("Ошибка проверки токена:", err);
            throw new UnauthorizedError('Недействительный токен');
        }
    }
    
}