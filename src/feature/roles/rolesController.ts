import { RolesService } from './rolesService.js';
import { Request, Response } from 'express';
import { InternalServerError } from '../../errors/500InternalServerError.js';
import { BadRequestError } from '../../errors/400BadRequestError.js';

export class RolesController {
    private service: RolesService;

    constructor(service: RolesService) {
        this.service = service;
    }
    
    async getRoles(req: Request, res: Response) {
        try {
            const roles = await this.service.getRoles();
            res.status(200).json({message: roles})
        } catch (error) {
            throw new InternalServerError("Ошибка при получении");
        }
    }

    async getUserRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userRoles = await this.service.getUserRoles(id);
            if (!id) {
                throw new BadRequestError("Не указан id пользователя");
            }
            if (!userRoles) {
                throw new BadRequestError("Не указаны роли пользователя");
            }

            res.status(200).json({message: userRoles})
    } catch (error) {
        throw new InternalServerError("Ошибка при получении ролей пользователя");
        }
    }

    async addRoles(req: Request, res: Response) {
        try {
            const { roles } = req.body;
            if (!roles) {
                throw new BadRequestError("Не указаны роли");
            }
            const add = await this.service.addRoles(roles);
            res.status(200).json( {message: `Роли успешно добавлены`});
        } catch (error) {
            throw new InternalServerError("Ошибка при добавлении ролей");
        }
    }

    async deleteRoles(req: Request, res: Response) {
        try {
            const {roles} = req.body;
            if (!roles) {
                throw new BadRequestError("Не указаны роли");
            }
            const deletedRoles = await this.service.deleteRoles(roles);
            res.status(200).json({message: `Роли успешно удалены ${deletedRoles}`});
        }
        catch (error) {
            throw new InternalServerError("Ошибка при удалении ролей");
        }
    }

}
