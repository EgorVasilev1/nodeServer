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
        return await this.rolesModel.addRoles(name);
    }

    async assignUserRoles(userId: string, role: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (roles.includes(role)) {
            throw new Error("Роль уже назначена пользователю");
        }
        return await this.rolesModel.assingRolesUser(userId, role);
    }

    async removeRolesUser(userId: string, role: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (!roles.includes(role)) {
            throw new Error("Роль не назначена пользователю");
        }
        return await this.rolesModel.removeRolesUser(userId, role);
    }

    async deleteRoles(role: string) {
        const deleted = await this.rolesModel.deleteRoles(role);
        if (!deleted) {
            throw new Error(`Роль "${role}" не найдена`);
        }
        return `Роль "${role}" успешно удалена`;
    }

    
}
