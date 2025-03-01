import { Request, Response } from 'express';
import { UsersService } from './usersService.js';
import { BadRequestError } from '../../config/400BadRequestError.js';

export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.usersService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }

    async getUserById(req: Request, res: Response) {
        try{
            const user = await this.usersService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }

    async getUserByUsername(req: Request, res: Response) {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username);
            res.status(200).json(user);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }

    async updateUsername(req: Request, res: Response) {
        try{
            const user = await this.usersService.updateUsername(req.params.id, req.body.username);
            res.status(200).json(`Имя пользователя: ${req.body.username} изменено на ${{user}}`);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }

    async updatePassword(req: Request, res: Response) {
        try{
            const user = await this.usersService.updatePassword(req.params.id, req.body.password);
            res.status(200).json(`Пароль пользователя: ${req.body.password} изменен на ${{user}}`);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const user = await this.usersService.deleteUser(req.params.id, req.params.accessToken, req.params.refreshToken);
            res.status(200).json(`Пользователь ${{user}} удален`);
        } catch (error) {
            throw new BadRequestError(`error: ${error}`);
        }
    }
}