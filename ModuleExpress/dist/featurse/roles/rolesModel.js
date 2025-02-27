"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesModel = void 0;
class RolesModel {
    db;
    constructor(db) {
        this.db = db;
    }
    getRoles() {
        try {
            return this.db.query(`SELECT * FROM roles`);
        }
        catch (err) {
            console.error('Error fetching roles:', err);
            throw err;
        }
    }
    async getUserRoles(userId) {
        try {
            return await this.db.query(`SELECT * FROM roles WHERE id = ?`, [userId]);
        }
        catch (err) {
            console.error('Error fetching roles:', err);
            throw err;
        }
    }
    async addRoles(role) {
        try {
            return await this.db.query(`INSERT INTO roles VALUES (?)`, [role]);
        }
        catch (err) {
            console.error('Error adding role:', err);
            throw err;
        }
    }
    async assingRolesUser(userId, roleId) {
        const roles = await this.getUserRoles(userId);
        if (roles.includes(roleId)) {
            throw new Error('Пользователь уже имеет эту роль');
        }
        await this.assingRolesUser(userId, roleId);
    }
    async removeRolesUser(userId, roleId) {
        try {
            const userRoles = await this.db.query(`SELECT role_id FROM user_roles WHERE user_id = $1`, [userId]);
            const userRoleId = userRoles.map((row) => row.role_id);
            if (!userRoleId.includes(roleId)) {
                throw new Error('Пользователь не имеет эту роль');
            }
            if (userRoleId.length === 1) {
                throw new Error('Пользователь не может быть без ролей');
            }
            await this.db.query(`DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`, [userId, roleId]);
            console.log(`Роль ${roleId} успешно удалена у пользователя ${userId}`);
        }
        catch (error) {
            console.error('Ошибка при удалении роли у пользователя:', error);
            throw error;
        }
    }
    async deleteRoles(role) {
        try {
            return await this.db.query(`DELETE FROM roles WHERE role = ?`, [role]);
        }
        catch (err) {
            console.log('Ошибка удаления ролей:', err);
            throw err;
        }
    }
}
exports.RolesModel = RolesModel;
