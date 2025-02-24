"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorDBRoles = void 0;
class ConnectorDBRoles {
    db;
    constructor(db) {
        this.db = db;
    }
    async query(query, values = []) {
        return await this.db.query(query);
    }
    async getPool() {
        return await this.db.getPool();
    }
}
exports.ConnectorDBRoles = ConnectorDBRoles;
