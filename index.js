require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  },
  console.log('Connection successful')
);

db.query('SELECT * FROM EMPLOYEES', (error, results) => console.table(results));
