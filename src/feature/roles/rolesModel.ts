import { BadRequestError } from '../../config/400BadRequestError';
import { InternalServerError } from '../../config/500InternalServerError';
import { ConnectorDB} from '../../databasePoolService/connectDB';

export class RolesModel {
    private db: ConnectorDB;

    constructor(db: ConnectorDB) {
        this.db = db;
    }

    public getRoles() {
        try{
            return this.db.query(`SELECT * FROM roles`);
        } catch(err){
            throw new InternalServerError(`${err}`);
        }

    }

    async getUserRoles(userId: string) {
        try{
            return await this.db.query(`SELECT * FROM roles WHERE id = $1`, [userId]);
        }
        catch(err){
            throw new InternalServerError(`${err}`);
        }
    }

    async addRoles(role: string) {
        try {
            const result = await this.db.query(
                `INSERT INTO roles (name) VALUES ($1) RETURNING id, name`, [role]);
            return {result};
        } catch (err: any) {
            if (err.code === '23505') {
                throw new BadRequestError(`Роль "${role}" уже существует`);
            }
            throw new InternalServerError(`Ошибка базы данных: ${err.message}`);
        }
    }
    
    async deleteRoles(role: string) {
        try{
            const result = await this.db.query(`DELETE FROM roles WHERE name = $1`, [role]);
            return {result};
        } catch (err){
            throw new InternalServerError(`${err}`);
        }
    }

    
}