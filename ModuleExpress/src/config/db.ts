import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabasePool {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432', 10),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }

  public getPool() {
    return this.pool;
  }

  public async query(queryString: string, params?: any[]) {
    const result = await this.pool.query(queryString, params);
    return result.rows;
  }

  public async connect() {
    const client = await this.pool.connect();
  }

  public async initializeTables() {
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
    } catch (error) {
      console.error('Ошибка при создании таблиц:', error);
      throw error; 
    }
}

  public async dropTables() {
    await this.pool.query('DROP TABLE IF EXISTS users CASCADE');
    await this.pool.query('DROP TABLE IF EXISTS roles CASCADE');
    await this.pool.query('DROP TABLE IF EXISTS user_roles CASCADE');
  }
}


(async () => {
  const db = new DatabasePool();
  await db.initializeTables();
})();
