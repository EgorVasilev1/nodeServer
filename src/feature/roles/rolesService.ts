import { BadRequestError } from '../../config/400BadRequestError.js';
import { NotFoundError } from '../../config/404NotFoundError.js';
import { RolesModel } from './rolesModel.js';

export class RolesService {
    private rolesModel: RolesModel;

    constructor(rolesModel: RolesModel) {
        this.rolesModel = rolesModel;
    }
    
    async getRoles() {
        return await this.rolesModel.getRoles();
    }
    
    async getUserRoles(userId: string) {
        return await this.rolesModel.getUserRoles(userId);
    }

    async addRoles(name: string) {
        if (!name || name.length === 0) {
            throw new BadRequestError("Не передано ни одной роли");
        }
        return await this.rolesModel.addRoles(name);
    }

    async deleteRoles(role: string) {
        const deleted = await this.rolesModel.deleteRoles(role);
        if (!deleted) {
            throw new NotFoundError(`Роль "${role}" не найдена`);
        }
        return `Роль "${role}" успешно удалена`;
    }

    
}
