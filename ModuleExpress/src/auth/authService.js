const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { saveUser, getUsername, deleteUser, changeUserPassword, changeUsername } = require('./authModel');
const RedisClient = require('../config/redis.js');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// Генерация обычного и refresh токенов
const generateTokens = (username, password) => {
  const accessToken = jwt.sign({ username, password }, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ username, password }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  return { accessToken, refreshToken };

};

// Регистрация пользователя(хэширование пароля и создание обычного и refresh токенов)
async function register(username, password) {
  try {
    const hashedPassword = await hashPassword(password);
    await saveUser(username, hashedPassword);
    const { accessToken, refreshToken } = generateTokens(username, hashedPassword);
    return { accessToken, refreshToken, username, hashedPassword };
  } catch (error) {
    console.error('Registration error:', error);
    throw { error: "Ошибка регистрации", details: error.message };
  }
}

// Вход пользователя
async function login(username, password) {
  try {
    const user = await getUsername(username);
    if (!user) {
      throw { error: "Пользователь не найден", code: 404 };
    }
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw { error: "Неверный пароль", code: 401 };
    }
    return user;
  } catch (error) {
    throw { error: "Ошибка входа", details: error.message };
  }
}

// Удаление пользователя(удаление токенов и самого пользователя)
async function logout(username, accessToken, refreshToken) {
  try {
    await RedisClient.del(accessToken, refreshToken);
    await deleteUser(username);
  } catch (error) {
    throw { error: "Ошибка выхода", details: error.message };
  }
}

// Изменение пароля пользователя
async function updatePassword(username, newPassword) {
  try {
    const hashedPassword = await hashPassword(newPassword);
    await changeUserPassword(username, hashedPassword);
  } catch (error) {
    throw { error: "Ошибка обновления пароля", details: error.message };
  }
}

// Изменение имени пользователя
async function updateUsername(username, newUsername) {
  try {
    await changeUsername(username, newUsername);
  } catch (error) {
    throw { error: "Ошибка обновления имени пользователя", details: error.message };
  }
}

// Обновление токена пользователя
const refresh = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error("Refresh token отсутствует");
    }
    const decoding = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const username = decoding.username;

    return generateTokens(username, decoding.password);
  } catch (error) {
    console.error("Ошибка в refresh():", error); 
    throw new Error(error.message || "Ошибка обновления токена");
  }
};

// Проверка пароля пользователя(сравнение введённого пользователем пароля с хэшем и возвращает true/false)
const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Метод для хэширования пароля
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = { refresh, register, login, logout, updatePassword, updateUsername, checkPassword, hashPassword };