import { ConnectorDBUsers } from "./connector/connectDB";

export class UsersModel {
    private db: ConnectorDBUsers;

    constructor(db: ConnectorDBUsers) {
        this.db = db;
    }

    async getUsers() {
        try{
            return await this.db.query(`SELECT * FROM users`);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    async getUserById(id: number) {
        try {
            return await this.db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    async getUserByUsername(username: string) {
        try{
            return await this.db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
    
    async updatePassword(id: number, password: string) {
        try {
            return await this.db.query(`UPDATE users SET password = $1 WHERE id = $2`, [password, id]);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    async updateUsername(id: number, username: string) {
        try{
            return await this.db.query(`UPDATE users SET username = $1 WHERE id = $2`, [username, id]);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }

    async deleteUser(id: number) {
        try {
            return await this.db.query(`DELETE FROM users WHERE id = $1`, [id]);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}