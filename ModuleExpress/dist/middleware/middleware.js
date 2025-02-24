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
        const token = authHeader.split(' ')[1];
        try {
            const cachedUser = await this.redis.get(token);
            if (!cachedUser) {
                return res.status(401).json({ error: 'Пользователь не найден' });
            }
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.user = JSON.parse(cachedUser);
            next();
        }
        catch (err) {
            return res.status(401).json({ error: 'Недействительный токен' });
        }
    }
}
exports.Middleware = Middleware;
