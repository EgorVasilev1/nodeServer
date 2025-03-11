import { UserRolesModel } from "./userRolesModel";
import { RolesModel } from "../roles/rolesModel";
import { ConflictError } from "../../errors/409ConflictError";
import { NotFoundError } from "../../errors/404NotFoundError";

export class UserRolesService {
    private model: UserRolesModel;
    private rolesModel: RolesModel;

    constructor(model: UserRolesModel,rolesModel: RolesModel) {
        this.model = model;
        this.rolesModel = rolesModel
    }

    async assignUserRoles(userId: string, roleId: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (roles.includes(roleId)) {
            throw new ConflictError("Роль уже назначена пользователю");
        }
        return await this.model.assingRolesUser(userId, roleId);
    }

    async removeRolesUser(userId: string, role: string){
        const roles = await this.rolesModel.getUserRoles(userId);
        if (!roles) {
            throw new NotFoundError("Роль не назначена пользователю");
        }
        return await this.model.removeRolesUser(userId, role);
    }
}