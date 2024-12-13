const mysql = require("mysql2/promise");
const connection = mysql.createConnection({
  host: "IP_ADDRESS_DATABASE",
  user: "root",
  database: "DATABASE_NAME",
  password: "root_password",
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

module.exports = connection;
