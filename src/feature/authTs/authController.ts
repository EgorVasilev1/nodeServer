import { Request, Response } from 'express';
import { AuthService } from "./authService.js";
import { InternalServerError } from '../../config/500InternalServerError.js';
import { BadRequestError } from '../../config/400BadRequestError.js';
import { NotFoundError } from '../../config/404NotFoundError.js';

export class AuthController {
    private service: AuthService;

    constructor(service: AuthService){
        this.service = service;
    }

    async registerUser(req: Request, res: Response) {
        try {
            const { username, password, role_id } = req.body;
            console.log(req.body);
            console.log('username:', username, 'password:', password, 'role_id', role_id);
            const registerUser = await this.service.register(username, password, role_id);
            res.status(201).json(registerUser);
        } catch (error) {
            console.error('Registration error:', error);
            throw new InternalServerError("Ошибка при регистрации пользователя");
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const logUser = await this.service.login(username, password);
            res.status(200).json(logUser);
        } catch (error) {
            console.error('Login error:', error);
            throw new InternalServerError(`Ошибка при авторизации пользователя ${error} `);
        }
    }

    async refreshTokens(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new NotFoundError("refreshToken не найден") 
            }
            const { accessToken, refreshToken :newRefreshToken } = await this.service.refresh(refreshToken);
            res.status(200).json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {

            throw new InternalServerError("Ошибка при обновлении токенов");
        }
    }

}
