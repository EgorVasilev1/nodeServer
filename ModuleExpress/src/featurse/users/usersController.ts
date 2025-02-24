import { Request, Response } from 'express';
import { UsersService } from './usersService.js';
import { Success } from '../../config/success.js';
import { Errors } from '../../config/errors.js';

export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.usersService.getUsers();
            return new Success(`users: ${users}`);
        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }

    async getUserById(req: Request, res: Response) {
        try{
            const user = await this.usersService.getUserById(req.params.id);
            return new Success(`user: ${user}`);

        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }

    async getUserByUsername(req: Request, res: Response) {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username);
            return new Success(`user: ${user}`);
        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }

    async updateUsername(req: Request, res: Response) {
        try{
            const user = await this.usersService.updateUsername(req.params.id, req.body.username);
            return new Success(`Имя пользователя: ${req.body.username} изменено на ${user}`);
        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }

    async updatePassword(req: Request, res: Response) {
        try{
            const user = await this.usersService.updatePassword(req.params.id, req.body.password);
            return new Success(`Пароль пользователя: ${req.body.password} изменен на ${user}`);
        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const user = await this.usersService.deleteUser(req.params.id, req.params.accessToken, req.params.refreshToken);
        } catch (error) {
            return new Errors(`error: ${error}`, 400);
        }
    }
}