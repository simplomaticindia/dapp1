var connection = mysql.createConnection({
  host: "#",
  port: #,
  user: "#",
  password: "#",
  database: "#",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("connnected...");
});
module.exports = connection;

//================ package details=========================///
//npm i express path express-flash express-session body-parser http-errors country-state-city url crypto mysql -save
