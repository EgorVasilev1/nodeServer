const http = require('http');
const hostname = '127.0.0.1';
const port = 8083;
const { Client } = require('pg');

const client = new Client({
  host: 'localhost', 
  port: 5432,  
  user: 'user',
  password: 'password',
  database: 'my_database',
  ssl: false
});

client.connect()
  .then(() => {
    console.log('Успешное подключение к PostgreSQL!');

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Successful connection to PostgreSQL!');
    });

    server.listen(port, hostname, () => {
      console.log(`Сервер запущен на http://${hostname}:${port}/`);
    });
  })
  .catch(err => {
    console.error('Ошибка подключения к PostgreSQL:', err.stack);
  });



