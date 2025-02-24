"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const db_js_1 = require("../../config/db.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthModel {
    pool;
    constructor(pool) {
        this.pool = new db_js_1.DatabasePool();
    }
    // Получение пользователя по username
    async getUsername(username) {
        return await this.pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    }
    // Добавление пользователя
    async saveUser(username, password) {
        return await this.pool.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, password]);
    }
}
exports.AuthModel = AuthModel;
