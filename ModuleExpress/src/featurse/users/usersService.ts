import { UsersModel } from "./usersModel.js";
import { Errors } from "../../config/errors.js";
import { Success } from "../../config/success.js";
import { ConnectorRedisUsers } from "./connector/connectorRedis";

export class UsersService {
    private userModel: UsersModel;
    private connectorRedis: ConnectorRedisUsers
    

    constructor(userModel: UsersModel, connectorRedis: ConnectorRedisUsers) {
        this.userModel = userModel;
        this.connectorRedis = connectorRedis;
    }

    async getUsers() {
        try {
            return await this.userModel.getUsers();
        } catch (error) {
            return new Errors("Ошибка при получении списка пользователей", 400);
        }
    }

    async getUserById(id: number) {
        try{
            return await this.userModel.getUserById(id);
        } catch (error) {
            new Errors("Ошибка при получении пользователя", 400);
        }
    }

    async getUserByUsername(username: string) {
        try{
            return await this.userModel.getUserByUsername(username);
        } catch (error) {
            new Errors("Ошибка при получении пользователя", 400);
        }
    }

    async updateUsername(id: number, username: string) {
        try {
            return await this.userModel.updateUsername(id, username);
        } catch (error) {
            new Errors("Ошибка при обновлении пользователя", 400);
        }
    }

    async updatePassword(id: number, password: string) {
        try {
            return await this.userModel.updatePassword(id, password);
        } catch(error) {
            new Errors("Ошибка при обновлении пароля пользователя", 400);
        }
    }

    async deleteUser(id: number, accessToken: string, refreshToken: string) {
        try {
            this.connectorRedis.del(accessToken, refreshToken);
            return await this.userModel.deleteUser(id);
        } catch (error) {
            new Errors("Ошибка при удалении пользователя", 400);
        }
    }
}