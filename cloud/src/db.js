const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
  host: "34.101.229.68",
  user: "root",
  database: "safefood",
  password: "bob123",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

module.exports = connection;
