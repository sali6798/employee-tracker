var mysql = require("mysql");

// connect to database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;
