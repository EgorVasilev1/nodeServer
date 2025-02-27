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
  
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      console.log(`Токен перед проверкой: "${token}"`);
  
      try {
          console.log(`Проверяю токен в Redis...`);
          const cachedUser = await this.redis.get(token);
          console.log(`Найдено в Redis:`, cachedUser);
  
          if (!cachedUser) {
              return res.status(401).json({ error: 'Пользователь не найден' });
          }
  
          console.log(`SECRET_KEY загружен: ${!!SECRET_KEY}`);
          const decoded = jwt.verify(token, SECRET_KEY);
  
          try {
              req.user = JSON.parse(cachedUser);
          } catch (error) {
              console.error("Ошибка парсинга JSON из Redis:", cachedUser);
              return res.status(500).json({ error: "Ошибка сервера" });
          }
  
          next();
      } catch (err) {
          console.error("Ошибка проверки токена:", err);
          return res.status(401).json({ error: 'Недействительный токен' });
      }
  }  
}