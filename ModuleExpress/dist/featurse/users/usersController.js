"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const success_js_1 = require("../../config/success.js");
const errors_js_1 = require("../../config/errors.js");
class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUsers(req, res) {
        try {
            const users = await this.usersService.getUsers();
            return new success_js_1.Success(`users: ${users}`);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
    async getUserById(req, res) {
        try {
            const user = await this.usersService.getUserById(req.params.id);
            return new success_js_1.Success(`user: ${user}`);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
    async getUserByUsername(req, res) {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username);
            return new success_js_1.Success(`user: ${user}`);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
    async updateUsername(req, res) {
        try {
            const user = await this.usersService.updateUsername(req.params.id, req.body.username);
            return new success_js_1.Success(`Имя пользователя: ${req.body.username} изменено на ${user}`);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
    async updatePassword(req, res) {
        try {
            const user = await this.usersService.updatePassword(req.params.id, req.body.password);
            return new success_js_1.Success(`Пароль пользователя: ${req.body.password} изменен на ${user}`);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await this.usersService.deleteUser(req.params.id, req.params.accessToken, req.params.refreshToken);
        }
        catch (error) {
            return new errors_js_1.Errors(`error: ${error}`, 400);
        }
    }
}
exports.UsersController = UsersController;
