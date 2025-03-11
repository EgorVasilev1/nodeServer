import { UsersModel } from "./usersModel.js";
import { ConnectorRedis } from "../../redisClientService/connectorRedis.js";
import { BadRequestError } from "../../errors/400BadRequestError.js";

export class UsersService {
    private userModel: UsersModel;
    private connectorRedis: ConnectorRedis
    

    constructor(userModel: UsersModel, connectorRedis: ConnectorRedis) {
        this.userModel = userModel;
        this.connectorRedis = connectorRedis;
    }

    async getUsers() {
        try {
            return await this.userModel.getUsers();
        } catch (error) {
            throw new BadRequestError("Ошибка при получении пользователей");
        }
    }

    async getUserById(id: number) {
        try{
            return await this.userModel.getUserById(id);
        } catch (error) {
            throw new BadRequestError("Ошибка при получении пользователя");
        }
    }

    async getUserByUsername(username: string) {
        try{
            return await this.userModel.getUserByUsername(username);
        } catch (error) {
            throw new BadRequestError("Ошибка при получении пользователя");
        }
    }

    async updateUsername(id: number, username: string) {
        try {
            return await this.userModel.updateUsername(id, username);
        } catch (error) {
            throw new BadRequestError("Ошибка при обновлении пользователя");
        }
    }

    async updatePassword(id: number, password: string) {
        try {
            return await this.userModel.updatePassword(id, password);
        } catch(error) {
            throw new BadRequestError("Ошибка при обновлении пароля пользователя");
        }
    }

    async deleteUser(id: number, accessToken: string, refreshToken: string) {
        try {
            this.connectorRedis.del(accessToken, refreshToken);
            return await this.userModel.deleteUser(id);
        } catch (error) {
            throw new BadRequestError("Ошибка при удалении пользователя");
        }
    }
}