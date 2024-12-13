const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
  host: "34.128.98.202",
  user: "root",
  database: "safefood",
  password: "safefood123",
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

module.exports = connection;
