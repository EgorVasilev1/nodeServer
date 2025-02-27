"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
class UsersController {
    usersService;
    success;
    errors;
    constructor(usersService, success, errors) {
        this.usersService = usersService;
        this.success = success;
        this.errors = errors;
    }
    async getUsers(req, res) {
        try {
            const users = await this.usersService.getUsers();
            return this.success.send(res, { users });
        }
        catch (error) {
            return this.errors.send(res, `error: ${error}`, 400);
        }
    }
    async getUserById(req, res) {
        try {
            const user = await this.usersService.getUserById(req.params.id);
            return this.success.send(res, { user });
        }
        catch (error) {
            return this.errors.send(res, `error: ${error}`, 400);
        }
    }
    async getUserByUsername(req, res) {
        try {
            const user = await this.usersService.getUserByUsername(req.params.username);
            return this.success.send(res, { user });
        }
        catch (error) {
            return this.errors.send(res, `error: ${{ error }}`, 400);
        }
    }
    async updateUsername(req, res) {
        try {
            const user = await this.usersService.updateUsername(req.params.id, req.body.username);
            return this.success.send(res, `Имя пользователя: ${req.body.username} изменено на ${{ user }}`);
        }
        catch (error) {
            return this.errors.send(res, `error: ${{ error }}`, 400);
        }
    }
    async updatePassword(req, res) {
        try {
            const user = await this.usersService.updatePassword(req.params.id, req.body.password);
            return this.success.send(res, `Пароль пользователя: ${req.body.password} изменен на ${{ user }}`);
        }
        catch (error) {
            return this.errors.send(res, `error: ${{ error }}`, 400);
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await this.usersService.deleteUser(req.params.id, req.params.accessToken, req.params.refreshToken);
            return this.success.send(res, `Пользователь ${{ user }} удален`);
        }
        catch (error) {
            return this.errors.send(res, `error: ${{ error }}`, 400);
        }
    }
}
exports.UsersController = UsersController;
