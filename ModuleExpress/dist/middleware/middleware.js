"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
class Middleware {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async authMiddleware(req, res, next) {
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
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            try {
                req.user = JSON.parse(cachedUser);
            }
            catch (error) {
                console.error("Ошибка парсинга JSON из Redis:", cachedUser);
                return res.status(500).json({ error: "Ошибка сервера" });
            }
            next();
        }
        catch (err) {
            console.error("Ошибка проверки токена:", err);
            return res.status(401).json({ error: 'Недействительный токен' });
        }
    }
}
exports.Middleware = Middleware;
