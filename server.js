const http = require('http');
const hostname = '127.0.0.1';
const port = 8083;
const { Client } = require('pg');

const client = new Client({
  host: 'localhost', 
  port: 5432,  
  user: 'egor',
  password: '12345',
  database: 'my_database',
  ssl: false
});

async function fillingDB() {
  await client.query(`DROP TABLE my_database;`);
  
  
  const table = `
  
  CREATE TABLE my_database (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INTEGER NOT NULL);
  `
  
  const fillDB = `
    INSERT INTO my_database (name, email, age) VALUES
('Иван Иванов', 'ivan@example.com', 25),
('Мария Петрова', 'maria@example.com', 30),
('Алексей Смирнов', 'alexey@example.com', 28),
('Екатерина Сидорова', 'ekaterina@example.com', 22),
('Дмитрий Фёдоров', 'dmitry@example.com', 35),
('Ольга Кузнецова', 'olga@example.com', 29),
('Владимир Соколов', 'vladimir@example.com', 40),
('Анна Морозова', 'anna@example.com', 27),
('Сергей Васильев', 'sergey@example.com', 33),
('Елена Павлова', 'elena@example.com', 26);
  
  
  `
  await client.query(table);
  await client.query(fillDB);
  await console.log('Database filled!');
}

async function data() {
  const allDBData = await client.query('SELECT name FROM my_database;'); 
  console.log(allDBData.rows) 
  return await allDBData.rows;
  
}

async function add() {
  const addDBData = await client.query(`INSERT INTO my_database (name, email, age) VALUES ()`);
  console.log(addDBData.rows)
  return await addDBData.rows;
}
client.connect()
.then(() => {
  console.log('Успешное подключение к PostgreSQL!');
  fillingDB();
  
  const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    if (method === 'GET' && url === '/') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Server started!' }));
    }
    // Это позже дополню пока в кометантарии
//     if (method === 'POST' && url === '/add') {

//       const htmlResponse = `
//         <html>
// <head>
//     <meta charset="UTF-8">
//     <title>Form</title>
// </head>
// <body>
//     <form action="/submit" method="post">
//         <label for="name">Имя:</label><br>
//         <input type="text" id="name" name="name"><br>
        
//         <label for="email">Email:</label><br>
//         <input type="email" id="email" name="email"><br>
        
//         <label for="message">Сообщение:</label><br>
//         <textarea id="message" name="message"></textarea><br>
        
//         <button type="submit">Отправить</button>
//     </form>
// </body>
// </html>`;
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.end(htmlResponse);
//     }
    if (method === 'GET' && url === '/data') {
      if (client.query('SELECT * FROM my_database;') === null){
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Database is empty' }));
      }
      const names = await data();
      const listItems = names.map(item => `<li>${item.name}</li>`).join('');
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
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlResponse);
    }
  });
  
  
  server.listen(port, hostname, () => {
    console.log(`Сервер запущен на http://${hostname}:${port}/`);
  });
})
.catch(err => {
  console.error('Ошибка подключения к PostgreSQL:', err.stack);
});



