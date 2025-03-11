 import { Router } from "express";
import { UsersController } from "./usersController";
import { authMiddleware } from "../../middleware/middleware";

export const usersRoutes = (usersController: UsersController, authMiddleware) => {
    const router = Router();

    router.get('/', (req, res) => usersController.getUsers(req, res));
    router.get('/:id', (req, res) => usersController.getUserById(req, res));
    router.get('/username/:username', (req, res) => usersController.getUserByUsername(req, res));
    router.patch('/:id/username', authMiddleware, (req, res) => usersController.updateUsername(req, res));
    router.patch('/:id/password', authMiddleware, (req, res) => usersController.updatePassword(req, res));
    router.delete('/:id', (req, res) => usersController.deleteUser(req, res));

    return router;
};