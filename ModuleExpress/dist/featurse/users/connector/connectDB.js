"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorDBUsers = void 0;
class ConnectorDBUsers {
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
exports.ConnectorDBUsers = ConnectorDBUsers;
