import { RolesService } from './rolesService.js';
import { Request, Response } from 'express';
import { Errors } from '../../config/errors.js';
import { Success } from '../../config/success.js';

export class RolesController {
    private service: RolesService;
    private success: Success;
    private errors: Errors;

    constructor(service: RolesService, success: Success, errors: Errors ) {
        this.service = service;
        this.success = success;
        this.errors = errors;
    }
    
    async getRoles(req: Request, res: Response) {
        try {
            const roles = await this.service.getRoles();
            return this.success.send(res, roles)
        } catch (error) {
            return this.errors.send(res, 'Ошибка получения ролей', 500);
        }
    }

    async getUserRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userRoles = await this.service.getUserRoles(id);
            if (!id) {
                return this.errors.send(res,"Не указан id пользователя", 400 );
            }

            if (!userRoles) {
                return this.errors.send(res, "Роли пользовтеля не найдены", 404);
            }

            return this.success.send(res, userRoles);
    } catch (error) {
        return this.errors.send(res, 'Ошибка получения ролей', 500);
        }
    }

    async addRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            if (!roles) {
                return this.errors.send(res, "Не указаны роли", 400);
            }
            const add = await this.service.addRoles(roles);
            return this.success.send(res, `Роли успешно добавлены ${add}`);
        } catch (error) {
            return this.errors.send(res, 'Ошибка при добавлении ролей', 500);
        }
    }

    async assignUserRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            const id = req.params.id;
            if (!id) {
                return this.errors.send(res, "Не указан id пользователя", 400);
            }
            if (!roles) {
                return this.errors.send(res, "Не указан роли пользователя", 400);;
            }
            const userRoles = await this.service.assignUserRoles(id, roles);
            return this.success.send(res, `Роли(${userRoles}) пользователя успешно назначены`);
        } catch (error) {
            return this.errors.send(res ,'Ошибка при назначении ролей', 500);
        }
    }

    async removeRolesUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const roles = req.body;

            if (!id) {
                return this.errors.send(res, "Не указан id пользователя", 400);
            }
            if (!roles) {
                return this.errors.send(res, "Не указаны роли", 400);
            }
            const removeRolesUser = await this.service.removeRolesUser(id, roles);
            return this.success.send(res, `Роли(${removeRolesUser}) пользователя успешно удалены`);
        } catch (error){
            return this.errors.send(res, 'Ошибка при удалении ролей', 500);
        }
    }

    async deleteRoles(req: Request, res: Response) {
        try {
            const roles = req.body;
            if (!roles) {
                return this.errors.send(res, "Не указаны роли", 400);
            }
            const deletedRoles = await this.service.deleteRoles(roles);
            return this.success.send(res, `Роли(${deletedRoles}) успешно удалены`);
        }
        catch (error) {
            return this.errors.send(res, 'Ошибка при удалении ролей', 500);
        }
    }

}
