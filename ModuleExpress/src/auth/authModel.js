const { commandOptions } = require('redis');
const { client } = require('../config/db');
require('dotenv').config();

// Создание таблицы
const createTable = async () => {
    const table = `
    CREATE TABLE IF NOT EXISTS ${process.env.PG_DATABASE} (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `;
    await client.query(table);
    console.log('Database checked/created!');
}

// Удаление таблицы
const dropTable = async () => {
    await client.query(`DROP TABLE ${process.env.PG_DATABASE}`);
    console.log('Database dropped!');
}

// Получение пользователя из базы данных
const getUsername = async (username) => {
    const { rows } = await client.query(`SELECT * FROM ${process.env.PG_DATABASE} WHERE username = $1`, [username]);
    return rows[0];
}

//Добавление пользователя в базу данных
const saveUser = async (username, password) => {
    const { rows } = await client.query(`INSERT INTO ${process.env.PG_DATABASE} (username, password) VALUES ($1, $2)`, [username, password]);
    return rows;
};

// Удаление пользователя из базы данных
const deleteUser = async (username) => {
    await client.query('BEGIN');
    const { rows } = await client.query(`DELETE FROM ${process.env.PG_DATABASE} WHERE username = $1`, [username]);
    await client.query('COMMIT');
    return rows;
}

// Изменение пароля пользователя в базе данных
const changeUserPassword = async (username, newPassword) => {
    await client.query('BEGIN');
    const { rows } = await client.query(`UPDATE ${process.env.PG_DATABASE} SET password = $2 WHERE username = $1`, [username, newPassword]);
    await client.query('COMMIT');
    return rows;
}

// Изменение имени пользователя в базе данных
const changeUsername = async (username, newUsername) => {
    await client.query('BEGIN');
    const { rows } = await client.query(`UPDATE ${process.env.PG_DATABASE} SET username = $2 WHERE username = $1`, [username, newUsername]);
    await client.query('COMMIT');
    return rows;
}

module.exports = { getUsername, saveUser, deleteUser, changeUserPassword, changeUsername, createTable, dropTable };
