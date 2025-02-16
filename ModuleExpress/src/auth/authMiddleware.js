const jwt = require('jsonwebtoken');
const RedisClient = require('../config/redis');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Проверка токена юзера на валидность
async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const cachedUser = await RedisClient.get(token);
    if (!cachedUser) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = JSON.parse(cachedUser);

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

module.exports = { authMiddleware };
