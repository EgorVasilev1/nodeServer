"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
class UsersModel {
    db;
    constructor(db) {
        this.db = db;
    }
    async getUsers() {
        try {
            return await this.db.query('SELECT * FROM users');
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async getUserById(id) {
        try {
            return await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async getUserByUsername(username) {
        try {
            return await this.db.query('SELECT * FROM users WHERE username = $1', [username]);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async updatePassword(id, password) {
        try {
            return await this.db.query('UPDATE users SET password = $1 WHERE id = $2', [password, id]);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async updateUsername(id, username) {
        try {
            return await this.db.query('UPDATE users SET username = $1 WHERE id = $2', [username, id]);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    async deleteUser(id) {
        try {
            return await this.db.query('DELETE FROM users WHERE id = $1', [id]);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}
exports.UsersModel = UsersModel;
