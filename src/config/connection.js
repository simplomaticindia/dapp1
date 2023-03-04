var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql-113852-0.cloudclusters.net",
  port: 19860,
  user: "admin",
  password: "7shsRLGF",
  database: "dapp",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connnected...");
});
module.exports = connection;

//================ package details=========================///
//npm i express path express-flash express-session body-parser http-errors country-state-city url crypto mysql -save
