"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const errors_js_1 = require("../../config/errors.js");
const success_js_1 = require("../../config/success.js");
class RolesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getRoles(req, res) {
        try {
            const roles = await this.service.getRoles();
            return new success_js_1.Success('Роли успешно получены').send(res, roles);
        }
        catch (error) {
            return new errors_js_1.Errors("Ошибка получения ролей", 400).send(res);
        }
    }
    async getUserRoles(req, res) {
        try {
            const { id } = req.params;
            const userRoles = await this.service.getUserRoles(id);
            if (!id) {
                return new errors_js_1.Errors("Не указан id пользователя", 400).send(res);
            }
            if (!userRoles) {
                return new errors_js_1.Errors("Роли пользовтеля не найдены", 404).send(res);
            }
            return new success_js_1.Success('Роли пользователя успешно получены').send(res, userRoles);
        }
        catch (error) {
            return new errors_js_1.Errors("Ошибка получения ролей", 400).send(res);
        }
    }
    async addRoles(req, res) {
        try {
            const roles = req.body;
            if (!roles) {
                new errors_js_1.Errors("Не указаны роли", 400).send(res);
            }
            const add = await this.service.addRoles(roles);
            new success_js_1.Success('Роли успешно добавлены').send(res, add);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при добавлении ролей", 400).send(res);
        }
    }
    async assignUserRoles(req, res) {
        try {
            const roles = req.body;
            const id = req.params.id;
            if (!id) {
                new errors_js_1.Errors("Не указан id пользователя", 400).send(res);
            }
            if (!roles) {
                new errors_js_1.Errors("Не указаны роли", 400).send(res);
            }
            const userRoles = await this.service.assignUserRoles(id, roles);
            new success_js_1.Success('Роли пользователя успешно назначены').send(res, userRoles);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при назначении ролей", 400).send(res);
        }
    }
    async removeRolesUser(req, res) {
        try {
            const id = req.params.id;
            const roles = req.body;
            if (!id) {
                new errors_js_1.Errors("Не указан id пользователя", 400).send(res);
            }
            if (!roles) {
                new errors_js_1.Errors("Не указаны роли", 400).send(res);
            }
            const removeRolesUser = await this.service.removeRolesUser(id, roles);
            new success_js_1.Success('Роли пользователя успешно удалены').send(res, removeRolesUser);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при удалении ролей", 400).send(res);
        }
    }
    async deleteRoles(req, res) {
        try {
            const roles = req.body;
            if (!roles) {
                new errors_js_1.Errors("Не указаны роли", 400).send(res);
            }
            const deletedRoles = await this.service.deleteRoles(roles);
            new success_js_1.Success('Роли успешно удалены').send(res, deletedRoles);
        }
        catch (error) {
            new errors_js_1.Errors("Ошибка при удалении ролей", 400).send(res);
        }
    }
}
exports.RolesController = RolesController;
