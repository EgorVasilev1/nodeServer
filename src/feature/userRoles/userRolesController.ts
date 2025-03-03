import { BadRequestError } from "../../config/400BadRequestError";
import { InternalServerError } from "../../config/500InternalServerError";
import { UserRolesService } from "./userRolesService";
import { Request, Response } from 'express';

export class UserRolesController {
    private service: UserRolesService;

    constructor(service: UserRolesService) {
        this.service = service;
    }

    async assignUserRoles(req: Request, res: Response) {
            try {
                const roles = req.body;
                const id = req.params.id;
                if (!id) {
                    throw new BadRequestError("Не указан id пользователя");
                }
                if (!roles) {
                    throw new BadRequestError("Не указаны роли");
                }
                const userRoles = await this.service.assignUserRoles(id, roles);
                res.status(200).json({message: userRoles});
            } catch (error) {
                throw new InternalServerError("Ошибка при назначении ролей");
            }
        }
    
        async removeRolesUser(req: Request, res: Response) {
            try {
                const id = req.params.id;
                const roles = req.body;
                if (!id) {
                    throw new BadRequestError("Не указан id пользователя");
                }
                if (!roles) {
                    throw new BadRequestError("Не указаны роли");
                }
                const removeRolesUser = await this.service.removeRolesUser(id, roles);
                res.status(200).json({message: removeRolesUser});
            } catch (error){
                throw new InternalServerError("Ошибка при удалении ролей");
            }
        }
    
}