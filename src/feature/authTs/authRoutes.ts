import { Router } from "express";
import { AuthController } from "./authController";
import { authMiddleware } from "../../middleware/middleware";

export const authRoutes = (authController: AuthController, authMiddleware) => {
    const router = Router();
    router.post("/register", (req, res) => authController.registerUser(req, res));
    router.post("/login", authMiddleware, (req, res) => authController.loginUser(req, res));
    router.post("/refresh", (req, res) => authController.refreshTokens(req, res));
    return router;
};