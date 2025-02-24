"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasePool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DatabasePool {
    pool;
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT || '5432', 10),
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
            ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
        });
    }
    getPool() {
        return this.pool;
    }
    async query(queryString, params) {
        const result = await this.pool.query(queryString, params);
        return result.rows;
    }
    async connect() {
        const client = await this.pool.connect();
    }
    async initializeTables() {
        const createUsersSequence = `CREATE SEQUENCE IF NOT EXISTS users_id_seq;`;
        const createRolesSequence = `CREATE SEQUENCE IF NOT EXISTS roles_id_seq;`;
        const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY DEFAULT nextval('users_id_seq'),
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );
    `;
        const rolesTable = `
      CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY DEFAULT nextval('roles_id_seq'),
          name VARCHAR(50) UNIQUE NOT NULL
      );
    `;
        const userRolesTable = `
      CREATE TABLE IF NOT EXISTS user_roles (
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          role_id INT REFERENCES roles(id) ON DELETE CASCADE,
          PRIMARY KEY (user_id, role_id)
      );
    `;
        try {
            await this.pool.query(createUsersSequence);
            await this.pool.query(createRolesSequence);
            await this.pool.query(usersTable);
            await this.pool.query(rolesTable);
            await this.pool.query(userRolesTable);
            console.log('Таблицы успешно созданы или уже существуют.');
        }
        catch (error) {
            console.error('Ошибка при создании таблиц:', error);
            throw error;
        }
    }
    async dropTables() {
        await this.pool.query('DROP TABLE IF EXISTS users CASCADE');
        await this.pool.query('DROP TABLE IF EXISTS roles CASCADE');
        await this.pool.query('DROP TABLE IF EXISTS user_roles CASCADE');
    }
}
exports.DatabasePool = DatabasePool;
(async () => {
    const db = new DatabasePool();
    await db.initializeTables();
})();
