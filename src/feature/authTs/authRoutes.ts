import { Router } from "express";
import { AuthController } from "./authController";
import { Middleware } from "../../middleware/middleware";

export const authRoutes = (authController: AuthController, middleware: Middleware) => {
    const router = Router();
    router.post("/register", (req, res) => authController.registerUser(req, res));
    router.post("/login", middleware.authMiddleware.bind(middleware), (req, res) => authController.loginUser(req, res));
    router.post("/refresh", (req, res) => authController.refreshTokens(req, res));
    return router;
};