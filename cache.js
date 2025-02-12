const { createClient } = require('redis');
require('dotenv').config();

const RedisClient = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

RedisClient.on('error', err => console.error('Ошибка Redis:', err));

(async () => {
  await RedisClient.connect();
  console.log('Соединение c Redis установлено');
})();



module.exports = RedisClient;
