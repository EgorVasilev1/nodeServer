import { Request, Response } from 'express';
import { UsersService } from './usersService.js';
import { Success } from '../../config/success.js';
import { Errors } from '../../config/errors.js';

export class UsersController {
    private usersService: UsersService;
    private success: Success;
    private errors: Errors;

    constructor(usersService: UsersService, success: Success, errors: Errors) {
        this.usersService = usersService;
        this.success = success;
        this.errors = errors;
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.usersService.getUsers();
            return this.success.send(res, {users});
        } catch (error) {
            return this.errors.send(res, `error: ${error}`, 400);
        }
    }

    async getUserById(req: Request, res: Response) {
        try{
            const user = await this.usersService.getUserById(req.params.id);
            return this.success.send(res, {user});

        } catch (error) {
            return this.errors.send(res, `error: ${error}`, 400);
        }
    }

    async getUserByUsername(req: Request, res: Response) {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username);
            return this.success.send(res, {user});
        } catch (error) {
            return this.errors.send(res, `error: ${{error}}`, 400);
        }
    }

    async updateUsername(req: Request, res: Response) {
        try{
            const user = await this.usersService.updateUsername(req.params.id, req.body.username);
            return this.success.send(res, `Имя пользователя: ${req.body.username} изменено на ${{user}}`);
        } catch (error) {
            return this.errors.send(res, `error: ${{error}}`, 400);
        }
    }

    async updatePassword(req: Request, res: Response) {
        try{
            const user = await this.usersService.updatePassword(req.params.id, req.body.password);
            return this.success.send(res, `Пароль пользователя: ${req.body.password} изменен на ${{user}}`);
        } catch (error) {
            return this.errors.send(res, `error: ${{error}}`, 400);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const user = await this.usersService.deleteUser(req.params.id, req.params.accessToken, req.params.refreshToken);
            return this.success.send(res, `Пользователь ${{user}} удален`);
        } catch (error) {
            return this.errors.send(res, `error: ${{error}}`, 400);
        }
    }
}