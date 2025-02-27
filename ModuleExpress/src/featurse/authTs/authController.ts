import { Request, Response } from 'express';
import { AuthService } from "./authService.js";
import {RedisClient} from "../../config/redis.js";
import { AuthModel } from './authModel.js';
import { Success } from '../../config/success.js';
import { Errors } from '../../config/errors.js';

export class AuthController {
    private service: AuthService;
    private success: Success;
    private errors: Errors;

    constructor(service: AuthService, success: Success, errors: Errors){
        this.service = service;
        this.success = success;
        this.errors = errors;
    }

    async registerUser(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const registerUser = await this.service.register(username, password);
            return this.success.send(res,{registerUser});
        } catch (error) {
            console.error('Registration error:', error);
            return this.errors.send(res,'Registration error', 500);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const logUser = await this.service.login(username, password);
        return this.success.send(res, {logUser});
        } catch (error) {
            return this.errors.send(res,'Login error', 500);
        }
    }

    async refreshTokens(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return this.errors.send(res,'Refresh token not found', 400);
            }
            const { accessToken, refreshToken :newRefreshToken } = await this.service.refresh(refreshToken);
            return this.success.send(res,`accessToken: ${accessToken} \nrefreshToken: ${newRefreshToken}`);
        } catch (error) {
            return this.errors.send(res, 'Ошибка отправки refreshToken', 500);
        }
    }

}
