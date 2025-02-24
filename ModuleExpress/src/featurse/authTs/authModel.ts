import {DatabasePool} from '../../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export class AuthModel {

    private pool: DatabasePool;

    constructor(pool: DatabasePool){
    this.pool = new DatabasePool();
    }
    
    // Получение пользователя по username
    async getUsername(username: string) {
        return await this.pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
    }

    // Добавление пользователя
    async saveUser(username: string, password: string) {
        return await this.pool.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, password]);
    }
}
