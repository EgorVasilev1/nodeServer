import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UsersModel } from "../users/usersModel";
import { ConnectorRedis } from '../../redisClientService/connectorRedis.js';
import { NotFoundError } from "../../config/404NotFoundError";
import { InternalServerError } from "../../config/500InternalServerError";
import { UnauthorizedError } from "../../config/401UnauthorizedError";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;


export class AuthService{
    private model: UsersModel;
    private redis: ConnectorRedis;

    constructor(model: UsersModel, redis: ConnectorRedis) {
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
            await this.redis.set(`accessToken_${username}`, accessToken, 3600);  
            await this.redis.set(`refreshToken_${username}`, refreshToken, 604800);  
            return { accessToken, refreshToken };
        } catch (error) {
            throw new InternalServerError(`Ошибка регистрации: ${error}`);
        }
    }

    // Вход пользователя
    async login(inputUsername: string, inputPassword: string) {
    try {
        const {username, password} = await this.model.getUserByUsername(inputUsername);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Найденный пользователь:', username, password);
        if (!username ) {
            throw new NotFoundError("Пользователь не найден");
        }
        const isPasswordCorrect = await this.checkPassword(inputPassword, password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedError("Неверный пароль");
        }
        return {username, password};
    } catch (error) {
        throw new InternalServerError(`Ошибка входа \n${error}`);
        }
    }
    
    // Обновление токена пользователя
    async refresh(refreshToken: string){
    try {
        if (!refreshToken) {
        throw new NotFoundError("Refresh token отсутствует");
        }
        const decoding = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as JwtPayload;
        const username = decoding.username;

        return this.generateTokens(username);
    } catch (error) {
        throw new InternalServerError( `Ошибка обновления токена \n${error}`);
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

