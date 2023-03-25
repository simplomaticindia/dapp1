const bodyParser = require("body-parser");
const session = require("express-session");
const Country = require("country-state-city").Country;
const State = require("country-state-city").State;
const City = require("country-state-city").City;
//const events = require('events');
const encryptDecrypt = require("../config/encrypt-decrypt");
const countryModels = require("../models/countryModels");

// const getStateList = (req, res) => {

//     console.log(req.body.countryCode)
//     //console.log('SELECT * FROM all_states WHERE country_code = "' + req.body.countryCode + '"')
//     var sql='SELECT * FROM all_states WHERE country_code = "' + req.body.countryCode + '"';

//   var query = db.query(sql, function (err, results, fields) {
//     var arrayData = [];
//     let arrayValues = results.map((arrayData) => {
//       return {
//         name: encryptDecrypt.decrypt(arrayData.name),
//         iso_code: encryptDecrypt.decrypt(arrayData.iso_code)
//       };
//   });
//   console.log(arrayValues);
// });
// }
const getStateList = (req, res) => {
  var countryCode = req.body.countryCode;
  //console.log(stateCode);
  var arrayCountryData = countryCode.split("_");
  //console.log(arrayData[0]);
  //console.log(arrayData[1]);
  var sepCountryCode = arrayCountryData[0];
  var data = State.getStatesOfCountry(sepCountryCode);
  //console.log(data);
  var rows = res.json({
    msg: "success",
    states: data,
  });
  return rows;
};
const getCityList = (req, res) => {
  var stateCode = req.body.state_id;
  //console.log(stateCode);
  var arrayData = stateCode.split("_");
  //console.log(arrayData[0]);
  //console.log(arrayData[1]);
  var sepStateCode = arrayData[0];
  var sepCountryCode = arrayData[1];
  // var data=State.getStatesOfCountry(req.body.countryCode);
  var data = City.getCitiesOfState(sepCountryCode, sepStateCode);
  //console.log(data);
  var rows = res.json({
    msg: "success",
    cities: data,
  });
  return rows;
};

module.exports = {
  getStateList,
  getCityList,
};
