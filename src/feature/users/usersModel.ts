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
            return await this.db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getUserByUsername(username: string) {
        try{
            return await this.db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        } catch(error) {
            console.log(error);
            throw error;
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

    async saveUser(username: string, password: string) {
        try{
            return await this.db.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, password]);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}