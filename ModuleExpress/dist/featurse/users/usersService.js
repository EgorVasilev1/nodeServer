"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const errors_js_1 = require("../../config/errors.js");
class UsersService {
    userModel;
    connectorRedis;
    constructor(userModel, connectorRedis) {
        this.userModel = userModel;
        this.connectorRedis = connectorRedis;
    }
    async getUsers() {
        try {
            return await this.userModel.getUsers();
        }
        catch (error) {
            return new errors_js_1.Errors("Ошибка при получении списка пользователей", 400);
        }
    }
    async getUserById(id) {
        try {
            return await this.userModel.getUserById(id);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при получении пользователя", 400);
        }
    }
    async getUserByUsername(username) {
        try {
            return await this.userModel.getUserByUsername(username);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при получении пользователя", 400);
        }
    }
    async updateUsername(id, username) {
        try {
            return await this.userModel.updateUsername(id, username);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при обновлении пользователя", 400);
        }
    }
    async updatePassword(id, password) {
        try {
            return await this.userModel.updatePassword(id, password);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при обновлении пароля пользователя", 400);
        }
    }
    async deleteUser(id, accessToken, refreshToken) {
        try {
            this.connectorRedis.del(accessToken, refreshToken);
            return await this.userModel.deleteUser(id);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при удалении пользователя", 400);
        }
    }
}
exports.UsersService = UsersService;
