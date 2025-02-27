"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    service;
    success;
    errors;
    constructor(service, success, errors) {
        this.service = service;
        this.success = success;
        this.errors = errors;
    }
    async registerUser(req, res) {
        try {
            const { username, password } = req.body;
            const registerUser = await this.service.register(username, password);
            return this.success.send(res, { registerUser });
        }
        catch (error) {
            console.error('Registration error:', error);
            return this.errors.send(res, 'Registration error', 500);
        }
    }
    async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const logUser = await this.service.login(username, password);
            return this.success.send(res, { logUser });
        }
        catch (error) {
            return this.errors.send(res, 'Login error', 500);
        }
    }
    async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return this.errors.send(res, 'Refresh token not found', 400);
            }
            const { accessToken, refreshToken: newRefreshToken } = await this.service.refresh(refreshToken);
            return this.success.send(res, `accessToken: ${accessToken} \nrefreshToken: ${newRefreshToken}`);
        }
        catch (error) {
            return this.errors.send(res, 'Ошибка отправки refreshToken', 500);
        }
    }
}
exports.AuthController = AuthController;
