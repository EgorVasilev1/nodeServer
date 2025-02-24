import jwt from 'jsonwebtoken';
import { RedisClient } from '../config/redis.js'; // Assuming RedisClient is exported this way
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export class Middleware {
    private redis: RedisClient
    
    constructor(redis: RedisClient) {
      this.redis = redis;
    }

    public async authMiddleware(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          return res.status(401).json({ error: 'Токен отсутствует' });
        }
      
        const token = authHeader.split(' ')[1];
        try {
          const cachedUser = await this.redis.get(token);
          if (!cachedUser) {
            return res.status(401).json({ error: 'Пользователь не найден' });
          }
      
          const decoded = jwt.verify(token, SECRET_KEY);
          req.user = JSON.parse(cachedUser);
      
          next();
        } catch (err) {
          return res.status(401).json({ error: 'Недействительный токен' });
        }
    }
}