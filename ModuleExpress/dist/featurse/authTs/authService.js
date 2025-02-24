"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
class AuthService {
    model;
    redis;
    constructor(model, redis) {
        this.model = model;
        this.redis = redis;
    }
    // Генерация обычного и refresh токенов
    generateTokens(username) {
        const accessToken = jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        return { accessToken, refreshToken };
        ;
    }
    // Регистрация пользователя(хэширование пароля и создание обычного и refresh токенов)
    async register(username, password) {
        try {
            const hashedPassword = await this.hashPassword(password);
            await this.model.saveUser(username, hashedPassword);
            const { accessToken, refreshToken } = this.generateTokens(username);
            await this.redis.set(`access:${accessToken}`, username, 3600);
            await this.redis.set(`refresh:${refreshToken}`, username, 604800);
            return { accessToken, refreshToken, username, hashedPassword };
        }
        catch (error) {
            console.error('Registration error:', error);
            throw { error: "Ошибка регистрации", details: error };
        }
    }
    // Вход пользователя
    async login(username, password) {
        try {
            const user = await this.model.getUsername(username);
            if (!user) {
                throw { error: "Пользователь не найден", code: 404 };
            }
            const isPasswordCorrect = await this.checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                throw { error: "Неверный пароль", code: 401 };
            }
            return user;
        }
        catch (error) {
            throw { error: "Ошибка входа", details: error };
        }
    }
    // Обновление токена пользователя
    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error("Refresh token отсутствует");
            }
            const decoding = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET_KEY);
            const username = decoding.username;
            return this.generateTokens(username);
        }
        catch (error) {
            console.error("Ошибка в refresh():", error);
            throw new Error("Ошибка обновления токена");
        }
    }
    ;
    // Проверка пароля пользователя(сравнение введённого пользователем пароля с хэшем и возвращает true/false)
    async checkPassword(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
    ;
    // Метод для хэширования пароля
    async hashPassword(password) {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        return hashedPassword;
    }
    ;
}
exports.AuthService = AuthService;
