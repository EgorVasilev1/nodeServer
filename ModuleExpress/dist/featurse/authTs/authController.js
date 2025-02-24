"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const success_js_1 = require("../../config/success.js");
const errors_js_1 = require("../../config/errors.js");
class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    async registerUser(req, res) {
        try {
            const { username, password } = req.body;
            const registerUser = await this.service.register(username, password);
            new success_js_1.Success(`${registerUser}`, 200);
        }
        catch (error) {
            console.error('Registration error:', error);
            new errors_js_1.Errors('Registration error', 500);
        }
    }
    async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const logUser = await this.service.login(username, password);
            new success_js_1.Success(logUser, 200);
        }
        catch (error) {
            new errors_js_1.Errors('Login error', 500);
        }
    }
    async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return new errors_js_1.Errors("Refresh token not found", 400);
            }
            const { accessToken, refreshToken: newRefreshToken } = await this.service.refresh(refreshToken);
            new success_js_1.Success(`accessToken: ${accessToken} \nrefreshToken: ${newRefreshToken}`, 200);
        }
        catch (error) {
            new errors_js_1.Errors('Refresh token error', 500);
        }
    }
}
exports.AuthController = AuthController;
