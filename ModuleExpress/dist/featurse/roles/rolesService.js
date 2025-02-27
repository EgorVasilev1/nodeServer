"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
class RolesService {
    rolesModel;
    constructor(rolesModel) {
        this.rolesModel = rolesModel;
    }
    async getRoles() {
        return await this.rolesModel.getRoles();
    }
    async getUserRoles(userId) {
        return await this.rolesModel.getUserRoles(userId);
    }
    async addRoles(name) {
        return await this.rolesModel.addRoles(name);
    }
    async assignUserRoles(userId, role) {
        const roles = await this.rolesModel.getUserRoles(userId);
        if (roles.includes(role)) {
            throw new Error("Роль уже назначена пользователю");
        }
        return await this.rolesModel.assingRolesUser(userId, role);
    }
    async removeRolesUser(userId, role) {
        const roles = await this.rolesModel.getUserRoles(userId);
        if (!roles.includes(role)) {
            throw new Error("Роль не назначена пользователю");
        }
        return await this.rolesModel.removeRolesUser(userId, role);
    }
    async deleteRoles(role) {
        const deleted = await this.rolesModel.deleteRoles(role);
        if (!deleted) {
            throw new Error(`Роль "${role}" не найдена`);
        }
        return `Роль "${role}" успешно удалена`;
    }
}
exports.RolesService = RolesService;
