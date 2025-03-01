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
            return await this.db.query(`SELECT * FROM roles WHERE id = ?`, [userId]);
        }
        catch(err){
            throw new InternalServerError(`${err}`);
        }
    }

    async addRoles(role: string) {
        try{
            return await this.db.query(`INSERT INTO roles VALUES (?)`, [role]);
        } catch(err){
            throw new InternalServerError(`${err}`);
        }
    }
    
    async deleteRoles(role: string) {
        try{
            return await this.db.query(`DELETE FROM roles WHERE role = ?`, [role]);
        } catch (err){
            throw new InternalServerError(`${err}`);
        }
    }

    
}