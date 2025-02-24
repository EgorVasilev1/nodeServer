import { Request, Response } from 'express';
import { AuthService } from "./authService.js";
import {RedisClient} from "../../config/redis.js";
import { AuthModel } from './authModel.js';
import { Success } from '../../config/success.js';
import { Errors } from '../../config/errors.js';

export class AuthController {
    private service: AuthService;

    constructor(service: AuthService) {
        this.service = service;
    }

    async registerUser(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const registerUser = await this.service.register(username, password);
            new Success(`${registerUser}`, 200);
        } catch (error) {
            console.error('Registration error:', error);
            new Errors('Registration error', 500);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const logUser = await this.service.login(username, password);
            new Success(logUser, 200);
        } catch (error) {
            new Errors(
                'Login error', 500);
        }
    }

    async refreshTokens(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return new Errors("Refresh token not found", 400);
            }
            const { accessToken, refreshToken :newRefreshToken } = await this.service.refresh(refreshToken);
            new Success(`accessToken: ${accessToken} \nrefreshToken: ${newRefreshToken}`, 200);
        } catch (error) {
            new Errors('Refresh token error', 500);
        }
    }

}
