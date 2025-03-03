import { NotFoundError } from "../../config/404NotFoundError";
import { InternalServerError } from "../../config/500InternalServerError";
import { ConnectorDB } from "../../databasePoolService/connectDB"

export class UsersModel {
    private db: ConnectorDB;

    constructor(db: ConnectorDB) {
        this.db = db;
    }

    async getUsers() {
        try{
            return await this.db.query(`SELECT * FROM users`);
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getUserById(id: number) {
        try {
            const result = await this.db.query(`SELECT * FROM users WHERE id = $1`, [id]);
            return result.rows[0];
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getUserByUsername(username: string) {
        try {
            const result = await this.db.query(
                `SELECT * FROM users WHERE username=$1`, 
                [username]
            );
            if (result.rows.length === 0) {
                throw new NotFoundError("Пользователь не найден");
            }

            console.log(result);
            return result.rows[0];
            

        } catch (error) {
            console.error('Ошибка при запросе пользователя:', error);
            throw new InternalServerError('Ошибка базы данных');
        }
    }
    
    async updatePassword(id: number, password: string) {
        try {
            return await this.db.query(`UPDATE users SET password = $1 WHERE id = $2`, [password, id]);
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateUsername(id: number, username: string) {
        try{
            return await this.db.query(`UPDATE users SET username = $1 WHERE id = $2`, [username, id]);
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async deleteUser(id: number) {
        try {
            return await this.db.query(`DELETE FROM users WHERE id = $1`, [id]);
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async saveUser(username: string, hashedPassword: string) {
        const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
        const params = [username, hashedPassword];
    
        try {
            const result = await this.db.query(sql, params);
            if (result.rowCount > 0) {
                return result.rows[0]; // Возвращаем id нового пользователя
            } else {
                throw new InternalServerError('Не удалось создать пользователя');
            }
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
            throw new InternalServerError('Ошибка при сохранении пользователя');
        }
    }    
}