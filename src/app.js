const express = require("express");
const path = require("path");
const web3 = require("web3");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const connection = require("./config/connection");

//console.log(Country.getAllCountries());
//console.log(State.getAllStates())
//console.log(City.getAllCities())
const app = express();
//connection.connect();
global.db = connection;
const PORT = process.env.PORT || 3000;
const router = require("./routes/users");
//console.log(web3);
//console.log("mukesh");
app.use(
  session({
    secret: "dapp",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  res.locals.metaUser = req.session.metaUser;
  res.locals.tokenized = req.session.tokenized;
  res.locals.monetize = req.session.monetize;
  next();
});
const middlewareFunction = function (req, res, next) {
  if (res.locals.metaUser) next();
  else res.redirect("/");
};
app.use("/public", express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.get("/", router);
app.post("/searchTerm", router);
app.get("/searchHistory", middlewareFunction, router);
app.get("/dashboard", middlewareFunction, router);
app.get("/profile", middlewareFunction, router);
app.get("/countryStateCity", router);
app.post("/login", router);
app.get("/logout", router);
app.post("/getstateByCountry", router);
app.post("/getCityByCountry", router);
app.post("/updateProfileData", router);
app.get("/ProfileDetails", middlewareFunction, router);
// app.post('/getStatesByCountry', function(req, res) {
// //console.log(req.body.countryCode)
// console.log('SELECT * FROM all_states WHERE country_code = "' + req.body.countryCode + '"')
//   let quer=db.query('SELECT * FROM all_states WHERE country_code = "' + req.body.countryCode + '"',

//   function(err, rows, fields) {

//       if (err) {

//           res.json({

//               msg: 'error'

//           });

//       }

//       else {

//           res.json({

//               msg: 'success',

//               states: rows

//           });

//       }

//   });

// });
//console.log(hours+':'+minutes+':'+seconds);
// Start the server
//metamask code

//end metamask code
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
