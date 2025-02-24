import { RolesService } from './rolesService.js';
import { Request, Response } from 'express';
import { Errors } from '../../config/errors.js';
import { Success } from '../../config/success.js';

export class RolesController {
    private service: RolesService;

    constructor(service: RolesService) {
        this.service = service;
    }
    
    async getRoles(req: Request, res: Response) {
        try {
            const roles = await this.service.getRoles();
            return new Success('Роли успешно получены').send(res, roles);
        } catch (error) {
            return new Errors("Ошибка получения ролей", 400).send(res);
        }
    }

    async getUserRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userRoles = await this.service.getUserRoles(id);
            if (!id) {
                return new Errors("Не указан id пользователя", 400).send(res);
            }

            if (!userRoles) {
                return new Errors("Роли пользовтеля не найдены", 404).send(res);
            }

            return new Success('Роли пользователя успешно получены').send(res, userRoles);
    } catch (error) {
        return new Errors("Ошибка получения ролей", 400).send(res);
        }
    }

    async addRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            if (!roles) {
                new Errors("Не указаны роли", 400).send(res);
            }
            const add = await this.service.addRoles(roles);
            new Success('Роли успешно добавлены').send(res, add);
        } catch (error) {
            new Errors("Ошибка при добавлении ролей", 400).send(res);
        }
    }

    async assignUserRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            const id = req.params.id;
            if (!id) {
                new Errors("Не указан id пользователя", 400).send(res);
            }
            if (!roles) {
                new Errors("Не указаны роли", 400).send(res);
            }
            const userRoles = await this.service.assignUserRoles(id, roles);
            new Success('Роли пользователя успешно назначены').send(res, userRoles);
        } catch (error) {
            new Errors("Ошибка при назначении ролей", 400).send(res);
        }
    }

    async removeRolesUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const roles = req.body;

            if (!id) {
                new Errors("Не указан id пользователя", 400).send(res);
            }
            if (!roles) {
                new Errors("Не указаны роли", 400).send(res);
            }
            const removeRolesUser = await this.service.removeRolesUser(id, roles);
            new Success('Роли пользователя успешно удалены').send(res, removeRolesUser);
        } catch (error){
            new Errors("Ошибка при удалении ролей", 400).send(res);
        }
    }

    async deleteRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            if (!roles) {
                new Errors("Не указаны роли", 400).send(res);
            }
            const deletedRoles = await this.service.deleteRoles(roles);
            new Success('Роли успешно удалены').send(res, deletedRoles);
        }
        catch (error) {
            new Errors("Ошибка при удалении ролей", 400).send(res);
        }
    }

}
