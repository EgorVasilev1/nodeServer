const express = require('express');
const morgan = require('morgan');
const { registerUser, loginUser, logoutUser, updatePasswordUser, updateUsernameUser, refreshTokens } = require('./src/auth/authController');
const listEndpoints = require('express-list-endpoints');
const { client } = require('./src/config/db');
const metric = require('prom-client');
const { authMiddleware } = require('./src/auth/authMiddleware');

require('dotenv').config();
const app = express();
const register = new metric.Registry();
metric.collectDefaultMetrics({ register });

const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(morgan('dev'));

app.post('/auth', registerUser);
app.post('/login', authMiddleware, loginUser);
app.delete('/logout', authMiddleware, logoutUser);
app.post('/refresh', refreshTokens);
app.patch('/password', authMiddleware, updatePasswordUser);
app.patch('/username', authMiddleware, updateUsernameUser);
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
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

client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
    })
    .then(() => { console.log('Соединение с PostgreSQL установлено') })
    .catch(err => {
        console.error('Ошибка подключения к базе данных:', err);
    });