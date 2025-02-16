const { createClient } = require('redis');
require('dotenv').config();

const RedisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

RedisClient.on('error', err => console.error('Ошибка Redis:', err));

(async () => {
  await RedisClient.connect();
  console.log('Соединение c Redis установлено');
})();

module.exports = RedisClient;
