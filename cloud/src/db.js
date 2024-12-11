const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
  host: "localhost",
  user: "zain",
  database: "safefood",
  password: "zain",
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

module.exports = connection;
