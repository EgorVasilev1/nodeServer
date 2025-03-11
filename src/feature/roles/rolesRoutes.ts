import { Router } from "express";
import { RolesController } from "./rolesController";
import { authMiddleware } from "../../middleware/middleware";

export const rolesRoutes = (rolesController: RolesController, authMiddleware) => {
    const router = Router();

    router.get("/", (req, res) => rolesController.getRoles.bind(rolesController)(req, res));
    router.get("/:id", (req, res) => rolesController.getUserRoles(req, res));
    router.post("/", (req, res) => rolesController.addRoles(req, res));
    router.delete("/", authMiddleware, (req, res) => rolesController.deleteRoles(req, res));

    return router;
};