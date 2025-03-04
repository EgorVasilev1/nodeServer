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
    try {
        const roleIdQuery = `SELECT role_id FROM user_roles WHERE user_id = $1`;
        const roleIdResult = await this.db.query(roleIdQuery, [userId]);
        
        if (roleIdResult.rows.length === 0) {
            return [];
        }
        
        const roleId = roleIdResult.rows[0].role_id;
        const getRoleName = `SELECT * FROM roles WHERE id = $1`;
        const roleResult = await this.db.query(getRoleName, [roleId]);
        
        return roleResult.rows[0];
    } catch (err) {
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