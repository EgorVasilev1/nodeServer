import { Router } from "express";
import { UserRolesController } from "./userRolesController";
import { Middleware } from "../../middleware/middleware";

export const userRolesRoutes = (userRolesController: UserRolesController) => {
    const router = Router();

    router.post('/assign/:id', (req, res) => userRolesController.assignUserRoles(req, res));
    router.post('/remove/:id', (req, res) => userRolesController.removeRolesUser(req, res));

    return router;
};