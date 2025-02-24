import { DatabasePool } from "../../../config/db.js";

export class ConnectorDBRoles {
    private db: DatabasePool;

    constructor(db: DatabasePool) {
        this.db = db;
    }
    
    async query(query: string, values: any[] = []) {
      return await this.db.query(query);
    }
    
    async getPool() {
      return await this.db.getPool();
    }
  }
