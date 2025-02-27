import express, { Router } from 'express';
import { DatabasePool } from '../config/db.js';
import { Errors } from '../config/errors.js';
import { Success } from '../config/success.js';
import { AuthController } from '../featurse/authTs/authController.js'
import { Middleware } from '../middleware/middleware.js';
import { RolesController } from '../featurse/roles/rolesController.js';
import { UsersModel } from '../featurse/users/usersModel.js';
import { UsersController } from '../featurse/users/usersController.js';


export class Routes {
  private router: Router;
  private authController: AuthController;
  private rolesController: RolesController;
  private usersController: UsersController;
  private middleware: Middleware;

  constructor(authController: AuthController, rolesController: RolesController, usersController: UsersController, middleware: Middleware) {
    this.router = express.Router();
    this.authController = authController;
    this.rolesController = rolesController;
    this.usersController = usersController;
    this.middleware = middleware;
    this.setupRoutes();
  }


  private setupRoutes() { 
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

  public getRouter(): Router {
    return this.router;
  }
}