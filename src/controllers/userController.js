const bodyParser = require("body-parser");
const session = require("express-session");
const url = require("url");
const Web3 = require("web3");
const web3 = new Web3();
const Country = require("country-state-city").Country;
const papaparse = require("papaparse");

//const events = require('events');
const encryptDecrypt = require("../config/encrypt-decrypt");
const countryModels = require("../models/countryModels");
const searchIndex = (req, res) => {
  //console.log(req.session.metaUser);
  var metaUser = req.session.metaUser;
  res.render("../views/pages/search", { metaUser: metaUser });
};
const login = (req, res) => {
  var post = req.body;
  var metaMaskId = post.metaMaskId;

  //var sessionId = generateSessionId()
  //let account = "mukesh";

  var sqlQuery =
    "SELECT wallet_id FROM `user_profile` WHERE `wallet_id`='" +
    metaMaskId +
    "'";
  db.query(sqlQuery, function (err, results) {
    if (results.length) {
      req.session.metaUser = results[0].wallet_id;
      req.session.save();
    } else {
      var sql =
        "INSERT INTO `user_profile`(`wallet_id`) VALUES ('" + metaMaskId + "')";
      var query = db.query(sql);
      req.session.metaUser = metaMaskId;
    }
  });

  res.redirect("/");
};
//logout section
const logout = function (req, res) {
  req.session.destroy((err) => {
    res.redirect("/"); // will always fire after session is destroyed
  });
};
//end logout section
const getSearchData = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;

    var searchtermtext = post.searchtermtext;
    var encryptSearchValueData = encryptDecrypt.encrypt(searchtermtext);
    //var encryptSearchValue= JSON.stringify(encryptSearchValueData);
    // var encryptSearchValue=encryptSearchValueData.encryptedData;
    //console.log(encryptDecrypt.encrypt(searchtermtext));
    //console.log(encryptDecrypt.decrypt(encryptSearchValue));
    var searchLink = searchtermtext.split(" ").join("+");
    var url = req.headers.host + "" + req.url + "?searchtermtext=" + searchLink;
    var urlLink = encryptDecrypt.encrypt(url);
    //var urlLink=urlLinkDate.encryptedData;
    var shareFlag = "no";
    var datetime = new Date();
    var date = datetime.toISOString().slice(0, 10);
    var hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    var seconds = datetime.getSeconds();
    var dateTimeVaues = date + " " + hours + ":" + minutes + ":" + seconds;
    //console.log(url);
    var sql =
      "INSERT INTO `search_history`(`search_term`,`share_flag`,`link`,`created_date`,`updated_date` ) VALUES ('" +
      encryptSearchValueData +
      "','" +
      shareFlag +
      "','" +
      urlLink +
      "','" +
      dateTimeVaues +
      "','" +
      dateTimeVaues +
      "')";
    var query = db.query(sql, function (err, result) {
      message = "Succesfully! Your account has been created.";
      //res.render('signup.ejs',{message: message});
      //console.log(encryptDecrypt.decrypt(encryptSearchValue));
      //console.log(sql);
      res.render("../views/pages/search");
    });
  } else {
    res.render("../views/pages/search");
  }
};
// For View
//update profile data
const updateProfileData = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    //console.log(post);
    var wallet_id = req.session.metaUser;
    //console.log(wallet_id);
    var user_id = encryptDecrypt.encrypt(post.userId);
    var first_name = encryptDecrypt.encrypt(post.firstName);
    var last_name = encryptDecrypt.encrypt(post.lastName);
    var email_id = encryptDecrypt.encrypt(post.emailId);
    var phone_no = encryptDecrypt.encrypt(post.mobileNo);
    var address1 = encryptDecrypt.encrypt(post.address1);
    var address2 = encryptDecrypt.encrypt(post.address2);
    var country = post.country;
    // var arrayDatac = country.split("_");
    // var encryptCountry = encryptDecrypt.encrypt(arrayDatac[1]);
    // var state = post.state;
    // var arrayDataState = state.split("_");
    // var encryptState = encryptDecrypt.encrypt(arrayDataState[2]);
    // var city = encryptDecrypt.encrypt(post.city);
    var zipCode = encryptDecrypt.encrypt(post.zipCode);
    // var datetime = new Date();
    // var date = datetime.toISOString().slice(0, 10);
    // var hours = datetime.getHours();
    // var minutes = datetime.getMinutes();
    // var seconds = datetime.getSeconds();
    // var dateTimeVaues = date + " " + hours + ":" + minutes + ":" + seconds;
    //console.log(url);
    var sql = `update user_profile set user_id='${user_id}' WHERE wallet_id=${wallet_id}`;
    // userId +
    // "', first_name='" +
    // firstName +
    // "',last_name='" +
    // lastName +
    // "', phone_no='" +
    // mobileNo +
    // "',email_id='" +
    // emailId +
    // "',address_line1='" +
    // address1 +
    // "',address_line2='" +
    // address2 +
    // "',zip_code='" +
    // zipCode +
    // "',city_name='" +
    // city +
    // "',state_name='" +
    // encryptState +
    // "',country_name='" +
    // encryptCountry +
    // "'WHERE wallet_id='" +
    // wallet_id;
    var updateData = [user_id, wallet_id];
    //     "','" +
    //     firstName +
    //     "','" +
    //     lastName +
    //     "','" +
    //     emailId +
    //     "','" +
    //     mobileNo +
    //     "','" +
    //     address1 +
    //     "','" +
    //     address2 +
    //     "','" +
    //     zipCode +
    //     "','" +
    //     city +
    //     "','" +
    //     encryptState +
    //     "','" +
    //     encryptCountry +
    //     "','" +
    //     wallet_id,
    // ];
    var query = db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(data.affectedRows + " record(s) updated");

      message = "Succesfully! updated your details.";
      //res.render('signup.ejs',{message: message});
      //console.log(encryptDecrypt.decrypt(encryptSearchValue));
      console.log(result);
      res.redirect("/profileDetails");
      //res.render("../views/pages/profile-details", { message: message });
    });
  }
};
// end the profile data
const getSearchHistory = (req, res) => {
  var sql = "SELECT * FROM `search_history`";
  //console.log(req.session.metaUser);
  //var sessuser = req.session.metaUser;
  //console.log(sessuser);
  //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
  var query = db.query(sql, function (err, results, fields) {
    var arrayData = [];
    let sr = 1;
    let arrayValues = results.map((arrayData) => {
      return {
        srNo: sr++,
        search_term: encryptDecrypt.decrypt(arrayData.search_term),
        session_start: arrayData.session_start,
        link: encryptDecrypt.decrypt(arrayData.link),
        share_flag: arrayData.share_flag,
        searchDate: arrayData.created_date,
      };
    });
    //console.log(arrayValues);
    res.render("../views/pages/search-data", { data: arrayValues });
  });
};
// end the profile data
const getProfileDetails = (req, res) => {
  var wallet_id = req.session.metaUser;
  // var sql =
  //   "SELECT * FROM `user_profile` WHERE `wallet_id`='" + wallet_id + "'";
  // //console.log(req.session.metaUser);
  // //var sessuser = req.session.metaUser;
  // //console.log(sessuser);
  // //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
  // var query = db.query(sql, function (err, results, fields) {
  //   var arrayData = [];
  //   let arrayValues = results.map((arrayData) => {
  //     return {
  //       user_id: encryptDecrypt.decrypt(arrayData.user_id),
  //       wallet_id: arrayData.wallet_id,
  //       first_name: encryptDecrypt.decrypt(arrayData.first_name),
  //       last_name: encryptDecrypt.decrypt(arrayData.last_name),
  //       phone_no: encryptDecrypt.decrypt(arrayData.phone_no),
  //       email_id: encryptDecrypt.decrypt(arrayData.email_id),
  //       address_line1: encryptDecrypt.decrypt(arrayData.address_line1),
  //       address_line1: encryptDecrypt.decrypt(arrayData.address_line2),
  //       zip_code: encryptDecrypt.decrypt(arrayData.zip_code),
  //       city_name: encryptDecrypt.decrypt(arrayData.city_name),
  //       state_name: encryptDecrypt.decrypt(arrayData.state_name),
  //       country_name: encryptDecrypt.decrypt(arrayData.country_name),

  //       language: arrayData.language,
  //     };
  //   });
  //console.log(arrayValues);
  res.render("../views/pages/profile-details");
  //});
};
const dashboard = (req, res) => {
  //req.session.metaUser = "mukesh kumar";
  res.render("../views/pages/dashboard");
};
const profile = (req, res) => {
  let countryList = Country.getAllCountries();
  // var sql = "SELECT * FROM `countries` ORDER BY name ASC";
  // var query = db.query(sql, function (err, results, fields) {
  //   var arrayData = [];
  //   let arrayValues = results.map((arrayData) => {
  //     return {
  //       name: encryptDecrypt.decrypt(arrayData.name),
  //       iso_code: arrayData.iso_code,
  //     };
  //   });
  // console.log(arrayValues);
  res.render("../views/pages/user-profile", { data: countryList });
  // });
};
const countryStateCity = (req, res) => {
  //  let countryList = await countryModels.countryList();
  //   //console.log(countryList);
  //   for(var i = 0; i< countryList.length; i++)
  //   {
  //      // countryList[i].name
  //       var sql = "INSERT INTO `countries`(`name`,`iso_code`,`phonecode`,`currency`) VALUES ('" +countryList[i].name + "','" +countryList[i].isoCode + "','" + countryList[i].phonecode + "','" +countryList[i].currency + "')";
  //      var query = await db.query(sql)
  //     //

  //   }
  // res.render("../views/pages/user-profile", { data: countryList });
  //console.log(countryArray);
  //   let stateList=countryModels.stateList();
  //  //console.log(stateList);
  //    for(var i = 0; i< stateList.length; i++)
  //    {
  //       var sql = "INSERT INTO `all_states`(`name`,`iso_code`,`country_code`) VALUES ('" +stateList[i].name+ "','" + stateList[i].isoCode+ "','" +stateList[i].countryCode+"')";
  //       var query =  db.query(sql);

  //    }
  let cityList = countryModels.cityList();
  //console.log(cityList);
  var sql = `INSERT INTO all_cities (name, country_code, state_code) VALUES ?`;
  let values = [];
  //console.log(cityList);
  for (var i = 0; i < cityList.length; i++) {
    values.push([
      cityList[i].name,
      cityList[i].countryCode,
      cityList[i].stateCode,
    ]);
  }
  var query = db.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("rows affected " + result.affectedRows);
  });
  //res.render("../views/pages/user-profile", { data: countryList });
};
module.exports = {
  searchIndex,
  login,
  logout,
  getSearchData,
  getSearchHistory,
  dashboard,
  profile,
  countryStateCity,
  updateProfileData,
  getProfileDetails,
};
