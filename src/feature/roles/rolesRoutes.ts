import { Router } from "express";
import { RolesController } from "./rolesController";
import { Middleware } from "../../middleware/middleware";

export const rolesRoutes = (rolesController: RolesController, middleware: Middleware) => {
    const router = Router();

    router.get("/", (req, res) => rolesController.getRoles.bind(rolesController)(req, res));
    router.get("/:id", (req, res) => rolesController.getUserRoles(req, res));
    router.post("/", (req, res) => rolesController.addRoles(req, res));
    router.delete("/", middleware.authMiddleware.bind(middleware), (req, res) => rolesController.deleteRoles(req, res));

    return router;
};