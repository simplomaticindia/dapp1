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
  var message = "";
  res.render("../views/pages/search", { metaUser: metaUser, message: message });
};
const login = (req, res) => {
  var post = req.body;
  var metaMaskId = post.metaMaskId;
  console.log(metaMaskId);
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
      req.session.save();
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

      res.render("../views/pages/search", { message: message });
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
    if (post.userId) {
      var user_id = encryptDecrypt.encrypt(post.userId);
    }
    else {
      var user_id="";
    }
    if (post.firstName) {
      var first_name = encryptDecrypt.encrypt(post.firstName);
    }
    else {
      var first_name="";
    }
    if (post.lastName) {
      var last_name = encryptDecrypt.encrypt(post.lastName);
    }
    else {
      var last_name="";
    }
    if (post.emailId) {
      var email_id = encryptDecrypt.encrypt(post.emailId);
    }
    else {
      var email_id="";
    }
    if (post.mobileNo) {
      var phone_no = encryptDecrypt.encrypt(post.mobileNo);
    }
    else {
      var phone_no="";
    }
    if (post.address1) {
      var address_line1 = encryptDecrypt.encrypt(post.address1);
    }
    else {
      var address_line1="";
    }
    if (post.address2) {
      var address_line2 = encryptDecrypt.encrypt(post.address2);
    }
    else {
      var address_line2="";
    }
   
    
    
    var country = post.country;
    if (country) {
      var arrayDatac = country.split("_");
      var country_name = encryptDecrypt.encrypt(arrayDatac[1]);
    }
    else {
      var country_name="";
    }

    var state = post.state;
    if (state) {
      var arrayDataState = state.split("_");
      var state_name = encryptDecrypt.encrypt(arrayDataState[2]);
    }
    else {
      var state_name="";
    }
    if (post.city) {
      var city_name = encryptDecrypt.encrypt(post.city);
    }
    else {
      var city_name="";
    }
    if (post.city) {
      var zip_code = encryptDecrypt.encrypt(post.zipCode);
    }
    else {
      var zip_code="";
    }
    if (post.language) {
      var language = encryptDecrypt.encrypt(post.language);
    }
    else {
      var language="";
    }
    if (post.interest) {
      var interest = encryptDecrypt.encrypt(post.interest);
    }
    else {
      var interest="";
    }
    var sql = `update user_profile set user_id='${user_id}',first_name='${first_name}',last_name='${last_name}',phone_no='${phone_no}',email_id='${email_id}',address_line1='${address_line1}',address_line2='${address_line2}',zip_code='${zip_code}',city_name='${city_name}',state_name='${state_name}',country_name='${country_name}',language='${language}',interest='${interest}' WHERE wallet_id='${wallet_id}'`;

    var query = db.query(sql, function (err, result) {
      if (err) throw err;
      //console.log(result.affectedRows + " record(s) updated");

      //message = "Succesfully! updated your details.";
      //res.render('signup.ejs',{message: message});
      //console.log(encryptDecrypt.decrypt(encryptSearchValue));
      //console.log(sql);
      res.redirect("/profileDetails");
      //res.render("../views/pages/profile-details", { message: message });
    });
  }
};
// end the profile data
const getSearchHistory = (req, res) => {
  var sql = "SELECT * FROM `search_history` ORDER BY id DESC";
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
  var sql =
    "SELECT * FROM `user_profile` WHERE `wallet_id`='" + wallet_id + "'";
  //console.log(req.session.metaUser);
  //var sessuser = req.session.metaUser;
  //console.log(sql);
  //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
  var query = db.query(sql, function (err, results, fields) {
    var arrayData = [];
    var arrayValues = results.map((arrayData) => {
      if(arrayData.user_id)
      {
        var encrpteuserid=encryptDecrypt.decrypt(arrayData.user_id);
      }
      else{
        var encrpteuserid=" ";
      }
      if(arrayData.first_name)
      {
        var encrpteFirstName=encryptDecrypt.decrypt(arrayData.first_name);
      }
      else{
        var encrpteFirstName=" ";
      }
      if(arrayData.last_name)
      {
        var encrpteLasttName=encryptDecrypt.decrypt(arrayData.last_name);
      }
      else{
        var encrpteLasttName=" ";
      }
      if(arrayData.phone_no)
      {
        var encrptePhoneNo=encryptDecrypt.decrypt(arrayData.phone_no);
      }
      else{
        var encrptePhoneNo=" ";
      }
      if(arrayData.email_id)
      {
        var encrpteEmailId=encryptDecrypt.decrypt(arrayData.email_id);
      }
      else{
        var encrpteEmailId=" ";
      }
      if(arrayData.address_line1)
      {
        var encrpteAddress1=encryptDecrypt.decrypt(arrayData.address_line1);
      }
      else{
        var encrpteAddress1=" ";
      }
      if(arrayData.address_line2)
      {
        var encrpteAddress2=encryptDecrypt.decrypt(arrayData.address_line2);
      }
      else{
        var encrpteAddress2=" ";
      }
      if(arrayData.zip_code)
      {
        var encrpteZipcode=encryptDecrypt.decrypt(arrayData.zip_code);
      }
      else{
        var encrpteZipcode=" ";
      }
      if(arrayData.city_name)
      {
        var encrpteCity=encryptDecrypt.decrypt(arrayData.city_name);
      }
      else{
        var encrpteCity=" ";
      }
      if(arrayData.state_name)
      {
        var encrpteState=encryptDecrypt.decrypt(arrayData.state_name);
      }
      else{
        var encrpteState=" ";
      }
      if(arrayData.country_name)
      {
        var encrpteCountry=encryptDecrypt.decrypt(arrayData.country_name);
      }
      else{
        var encrpteCountry=" ";
      }
      return {
        user_id: encrpteuserid,
        wallet_id: arrayData.wallet_id,
        first_name: encrpteFirstName,
        last_name: encrpteLasttName,
        phone_no: encrptePhoneNo,
        email_id: encrpteEmailId,
        address_line1:encrpteAddress1,
        address_line2: encrpteAddress2,
        zip_code:encrpteZipcode,
        city_name:encrpteCity,
        state_name:encrpteState,
        country_name:encrpteCountry,
        language: arrayData.language,
      };
    });
    //console.log(arrayValues);
    //var message = "Succesfully! updated your details.";
    //console.log(message);
    res.render("../views/pages/profileDetails", { data: arrayValues });
    //});
  });
};
const dashboard = (req, res) => {
  //req.session.metaUser = "mukesh kumar";
  res.render("../views/pages/dashboard");
};
const profile = (req, res) => {
  let countryList = Country.getAllCountries();
  var wallet_id = req.session.metaUser;
  var sql =
    "SELECT * FROM `user_profile` WHERE `wallet_id`='" + wallet_id + "'";
  //console.log(req.session.metaUser);
  //var sessuser = req.session.metaUser;
  //console.log(sql);
  //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
  var query = db.query(sql, function (err, results, fields) {
    var arrayData = [];
    var arrayValues = results.map((arrayData) => {
      if(arrayData.user_id)
      {
        var encrpteuserid=encryptDecrypt.decrypt(arrayData.user_id);
      }
      else{
        var encrpteuserid=" ";
      }
      if(arrayData.first_name)
      {
        var encrpteFirstName=encryptDecrypt.decrypt(arrayData.first_name);
      }
      else{
        var encrpteFirstName=" ";
      }
      if(arrayData.last_name)
      {
        var encrpteLasttName=encryptDecrypt.decrypt(arrayData.last_name);
      }
      else{
        var encrpteLasttName=" ";
      }
      if(arrayData.phone_no)
      {
        var encrptePhoneNo=encryptDecrypt.decrypt(arrayData.phone_no);
      }
      else{
        var encrptePhoneNo=" ";
      }
      if(arrayData.email_id)
      {
        var encrpteEmailId=encryptDecrypt.decrypt(arrayData.email_id);
      }
      else{
        var encrpteEmailId=" ";
      }
      if(arrayData.address_line1)
      {
        var encrpteAddress1=encryptDecrypt.decrypt(arrayData.address_line1);
      }
      else{
        var encrpteAddress1=" ";
      }
      if(arrayData.address_line2)
      {
        var encrpteAddress2=encryptDecrypt.decrypt(arrayData.address_line2);
      }
      else{
        var encrpteAddress2=" ";
      }
      if(arrayData.zip_code)
      {
        var encrpteZipcode=encryptDecrypt.decrypt(arrayData.zip_code);
      }
      else{
        var encrpteZipcode=" ";
      }
      if(arrayData.city_name)
      {
        var encrpteCity=encryptDecrypt.decrypt(arrayData.city_name);
      }
      else{
        var encrpteCity=" ";
      }
      if(arrayData.state_name)
      {
        var encrpteState=encryptDecrypt.decrypt(arrayData.state_name);
      }
      else{
        var encrpteState=" ";
      }
      if(arrayData.country_name)
      {
        var encrpteCountry=encryptDecrypt.decrypt(arrayData.country_name);
      }
      else{
        var encrpteCountry=" ";
      }
      return {
        user_id: encrpteuserid,
        wallet_id: arrayData.wallet_id,
        first_name: encrpteFirstName,
        last_name: encrpteLasttName,
        phone_no: encrptePhoneNo,
        email_id: encrpteEmailId,
        address_line1:encrpteAddress1,
        address_line2: encrpteAddress2,
        zip_code:encrpteZipcode,
        city_name:encrpteCity,
        state_name:encrpteState,
        country_name:encrpteCountry,
        language: arrayData.language,
      };
    });
    //console.log(arrayValues);
    //var message = "Succesfully! updated your details.";
    //console.log(message);
    res.render("../views/pages/user-profile", { data: arrayValues });
    //});
  });
 
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
