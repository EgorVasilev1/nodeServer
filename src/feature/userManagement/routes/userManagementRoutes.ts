import { Router } from "express";
import { UserManagementController } from "../userManagementController";
import { Middleware } from "../../../middleware/middleware";

export const userManagementRoutes = (userManagementController: UserManagementController, middleware: Middleware) => {
    const router = Router();

    router.post('/assign/:id', (req, res) => userManagementController.assignUserRoles(req, res));
    router.post('/remove/:id', (req, res) => userManagementController.removeRolesUser(req, res));

    return router;
};
