import { UserManagementModel } from "./userManagementModel";
import { RolesModel } from "../roles/rolesModel";
import { ConflictError } from "../../config/409ConflictError";
import { NotFoundError } from "../../config/404NotFoundError";

export class UserManagementService {
    private model: UserManagementModel;
    private rolesModel: RolesModel;

    constructor(model: UserManagementModel,rolesModel: RolesModel) {
        this.model = model;
        this.rolesModel = rolesModel
    }

    async assignUserRoles(userId: string, role: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (roles.includes(role)) {
            throw new ConflictError("Роль уже назначена пользователю");
        }
        return await this.model.assingRolesUser(userId, role);
    }

    async removeRolesUser(userId: string, role: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (!roles.includes(role)) {
            throw new NotFoundError("Роль не назначена пользователю");
        }
        return await this.model.removeRolesUser(userId, role);
    }
}