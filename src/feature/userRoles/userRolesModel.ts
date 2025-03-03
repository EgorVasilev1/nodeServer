import { NotFoundError } from "../../config/404NotFoundError";
import { ConflictError } from "../../config/409ConflictError";
import { InternalServerError } from "../../config/500InternalServerError";
import {ConnectorDB} from "../../databasePoolService/connectDB";
import { RolesModel } from "../roles/rolesModel";

export class UserRolesModel {
    private db: ConnectorDB;
    private roles: RolesModel;

    constructor(db: ConnectorDB, roles: RolesModel){
        this.db = db;
        this.roles = roles;
    }

    async assingRolesUser(userId: string, roleId: string) {
        const roles = await this.roles.getUserRoles(userId);
        if (roles.includes(roleId)) {
            throw new Error('Пользователь уже имеет эту роль');
        }
        await this.assingRolesUser(userId, roleId);
    }

    async removeRolesUser(userId: string, roleId: string) {
        try {
            const userRoles = await this.db.query(`SELECT role_id FROM user_roles WHERE user_id = $1`, [userId]);
            const userRoleId = userRoles.map((row: { role_id: number }) => row.role_id);
            if (!userRoleId.includes(roleId)) {
                throw new ConflictError('Пользователь не имеет эту роль');
            }
            if (userRoleId.length === 1) {
                throw new NotFoundError('Пользователь не может быть без ролей');
            }
            await this.db.query(`DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`, [userId, roleId]);
    
            console.log(`Роль ${roleId} успешно удалена у пользователя ${userId}`);
        } catch (error) {
            throw new InternalServerError('Ошибка при удалении роли у пользователя');
        }
    }
}