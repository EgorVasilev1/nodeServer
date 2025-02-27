const http = require('http');
const hostname = '127.0.0.1';
const port = 8084;
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const RedisClient = require('./cache');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();
exports.app = app;
const listEndpoints = require('express-list-endpoints');
const morgan = require('morgan');

require('dotenv').config();
const SECRET_KEY = 'bbd435df0e29ffa3fb3297067360bdf22aa8061edb0a068bcf24170e548678e1'
const REFRESH_SECRET_KEY = 'f2a3b4c5d6e7f8g9h0i1j7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j4e5f6a7b8c9d0e1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключено логирование
app.use(morgan('combined'));
app.use(morgan('dev'));

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'egor',
  password: '12345',
  database: 'my_database',
  ssl: false
});

async function fillingDB() {
  const table = `
    CREATE TABLE IF NOT EXISTS my_database (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `;

  await client.query(table);
  console.log('Database checked/created!');
}

async function data() {
  const allDBData = await client.query('SELECT username FROM my_database;');
  console.log(allDBData.rows)
  return await allDBData.rows;

}

// middleware
async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

  const token = authHeader.split(' ')[1];
  const cachedUser = await RedisClient.get(token);
  if (!cachedUser) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return JSON.parse(cachedUser);
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

// хеширование пароля
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
// Проверка пароля
const checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
// Генерация обычного и refresh токенов
const generateTokens = (username, password) => {
  const accessToken = jwt.sign({ username, password }, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ username, password }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

app.get('/', (req, res) => {
  res.status(200).json('Server started!')
});

app.get('/data', async (req, res) => {
  if (client.query('SELECT * FROM my_database;') === null) {
    res.status(404).json({ error: 'Database is empty!' });
  }
  const names = await data();
  const listItems = names.map(item => `<li>${item.username} - ${item.password}</li>`).join('');
  const htmlResponse = `
        <html>
      <head>
      <meta charset="UTF-8">
      <title>Users List</title>
      </head>
          <body>
      <h2>Users:</h2>
            <ul>${listItems}</ul>
      </body>
        </html>`;
  res.status(200).send(htmlResponse);
});

// Регистрация
app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  console.log(username, hashedPassword);
  if (await client.query(`SELECT * FROM my_database WHERE username = $1 AND password = $2`, [username, hashedPassword])) { }
  else {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  const { accessToken, refreshToken } = generateTokens(username, hashedPassword);
  await RedisClient.set(accessToken, JSON.stringify(username, hashedPassword), { EX: 3600 });
  await RedisClient.set(refreshToken, JSON.stringify(username, hashedPassword), { EX: 604800 });
  await client.query(`INSERT INTO my_database (username, password) VALUES ($1, $2)`, [username, hashedPassword]);
  res.status(200).json({ accessToken, refreshToken });
});

// Вход
app.post('/login', authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  if (res.writableEnded) return;
  const userData = await client.query(`SELECT * FROM my_database WHERE username = $1`, [username]);

  if (!user || user.error || userData.rows[0]?.username === undefined) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  if (await checkPassword(password, userData.rows[0]?.password) === false) {
    return res.status(404).json({ message: 'Неверный пароль' });

  }
  return res.status(200).json({ message: 'Вход успешен', user: userData.rows[0] });

});

app.delete('/logout', authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Токен отсутствует' });
  }

})

// Обновление токена пользователя(работает по вызову)
app.post('/refresh', async (req, res) => {
  const { refreshToken } = JSON.parse(body);

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token отсутствуе' });
  }
  const decoding = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
  const username = decoding.username;
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(username, decoding.password);
  await RedisClient.set(accessToken, JSON.stringify({ username, password: decoding.password }), { EX: 3600 });
  await RedisClient.set(newRefreshToken, JSON.stringify({ username, password: decoding.password }), { EX: 604800 });
  return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
})

//Вывод всех эндпоинтов
app.get('/endpoints', (req, res) => {
  const endpoints = listEndpoints(app);
  
  const htmlResponse = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>API Endpoints</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h2 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f4f4f4; }
      </style>
    </head>
    <body>
      <h2>Эндпоинты</h2>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          ${endpoints.map(ep => 
            ep.methods.map(method => 
              `<tr><td>${method}</td><td>${ep.path}</td></tr>`
            ).join('')
          ).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  res.send(htmlResponse);
});

client.connect().then(() => {
  console.log('Успешное подключение к PostgreSQL!');
  fillingDB();
  console.log('Эндпоинты: ', listEndpoints(app));
  app.listen(port, () => console.log(`Сервер запущен на http://${hostname}:${port}/`));

}).catch(err => {
  console.error('Ошибка подключения к PostgreSQL:', err.stack);
});