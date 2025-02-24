import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { AuthModel } from "./authModel.js";
import { ConnectorRedisAuth } from './connector/connectorRedis';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;


export class AuthService{
    private model: AuthModel;
    private redis: ConnectorRedisAuth;

    constructor(model: AuthModel, redis: ConnectorRedisAuth) {
        this.model = model;
        this.redis = redis
    }
    // Генерация обычного и refresh токенов
    private generateTokens(username: string){
        const accessToken = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        return { accessToken, refreshToken };;

    }
    // Регистрация пользователя(хэширование пароля и создание обычного и refresh токенов)
    async register(username: string, password: string) {
    try {
        const hashedPassword = await this.hashPassword(password);
        await this.model.saveUser(username, hashedPassword);
        const { accessToken, refreshToken } = this.generateTokens(username);
        await this.redis.set(`access:${accessToken}`, username,  3600 );
        await this.redis.set(`refresh:${refreshToken}`, username, 604800 );
        return { accessToken, refreshToken, username, hashedPassword };
    } catch (error) {
        console.error('Registration error:', error);
        throw { error: "Ошибка регистрации", details: error };
    }
    }

    // Вход пользователя
    async login(username: string, password: string) {
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
    } catch (error) {
        throw { error: "Ошибка входа", details: error };
        }
    }
    
    // Обновление токена пользователя
    async refresh(refreshToken: string){
    try {
        if (!refreshToken) {
        throw new Error("Refresh token отсутствует");
        }
        const decoding = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as JwtPayload;
        const username = decoding.username;

        return this.generateTokens(username);
    } catch (error) {
        console.error("Ошибка в refresh():", error); 
        throw new Error( "Ошибка обновления токена");
        }
    };

    // Проверка пароля пользователя(сравнение введённого пользователем пароля с хэшем и возвращает true/false)
    async checkPassword(password, hash){
        return await bcrypt.compare(password, hash);
    };

    // Метод для хэширования пароля
    async hashPassword(password){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

}

