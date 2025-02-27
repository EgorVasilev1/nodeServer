"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
class Routes {
    router;
    authController;
    rolesController;
    usersController;
    middleware;
    constructor(authController, rolesController, usersController, middleware) {
        this.router = express_1.default.Router();
        this.authController = authController;
        this.rolesController = rolesController;
        this.usersController = usersController;
        this.middleware = middleware;
        this.setupRoutes();
    }
    setupRoutes() {
        // Роут аутентификации
        this.router.post('/auth', (req, res) => this.authController.registerUser(req, res));
        this.router.post('/login', this.middleware.authMiddleware.bind(this.middleware), (req, res) => this.authController.loginUser(req, res));
        this.router.post('/refresh', (req, res) => this.authController.refreshTokens(req, res));
        this.router.patch('/password', this.middleware.authMiddleware, (req, res) => this.usersController.updatePassword(req, res));
        this.router.patch('/username', this.middleware.authMiddleware, (req, res) => this.usersController.updateUsername(req, res));
        this.router.delete('/logout', (req, res) => this.usersController.deleteUser(req, res));
        // Роуты для управления ролями
        this.router.get('/users', (req, res) => this.usersController.getUsers(req, res));
        this.router.get('/users/:id', (req, res) => this.usersController.getUserById(req, res));
        this.router.get('/users/username/:username', (req, res) => this.usersController.getUserByUsername(req, res));
        this.router.patch('/users/:id/username', this.middleware.authMiddleware, (req, res) => this.usersController.updateUsername(req, res));
        this.router.patch('/users/:id/password', this.middleware.authMiddleware, (req, res) => this.usersController.updatePassword(req, res));
        // Роуты для управления пользователями
        this.router.get('/roles', (req, res) => this.rolesController.getRoles(req, res));
        this.router.get('/roles/:id', (req, res) => this.rolesController.getUserRoles(req, res));
        this.router.post('/roles', (req, res) => this.rolesController.addRoles(req, res));
        this.router.post('/roles/:id', this.middleware.authMiddleware, (req, res) => this.rolesController.assignUserRoles(req, res));
        this.router.delete('/roles/:id', this.middleware.authMiddleware, (req, res) => this.rolesController.removeRolesUser(req, res));
        this.router.delete('/roles', this.middleware.authMiddleware, (req, res) => this.rolesController.deleteRoles(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.Routes = Routes;
