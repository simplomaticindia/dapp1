const express = require('express');
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const connection = require('./config/connection');

//console.log(Country.getAllCountries());
//console.log(State.getAllStates())
//console.log(City.getAllCities())
const app = express();
//connection.connect(); 
global.db = connection;
const PORT = process.env.PORT || 3000; 
const router=require("./routes/users");
//console.log(router);
//console.log("mukesh");
//let vpath=app.set('views', path.join(__dirname, 'views'));
//console.log(vpath);
//app.use('/public',express.static(__dirname + '/public'));
//app.use('/public', express.static(path.join(__dirname, 'public')))
app.use("/public", express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/', router);
app.post('/searchTerm',router);
app.get('/searchHistory',router);
app.get('/dashboard',router);
app.get('/profile',router);


//console.log(hours+':'+minutes+':'+seconds);
// Start the server

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});