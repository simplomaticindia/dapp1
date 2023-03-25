const bodyParser = require("body-parser");
const session = require("express-session");
//const EventEmitter = require("events");
//const emitter = new EventEmitter();
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
  //console.log(metaMaskId);
  //var sessionId = generateSessionId()
  //let account = "mukesh";
  // emitter.on("logined", function () {
  //   console.log("this is the login panel");
  // });
  // emitter.emit("logined");
  var sqlQuery =
    "SELECT wallet_id,tokenized,monetize FROM `user_profile` WHERE `wallet_id`='" +
    metaMaskId +
    "'";
  db.query(sqlQuery, function (err, results) {
    //const results = result?.length || 0;
    if (!!results.length) {
      req.session.metaUser = results[0].wallet_id;
      req.session.userLanguage = results[0].language;
      req.session.tokenized = results[0].tokenized;
      req.session.monetize = results[0].monetize;
      req.session.save();
    } else {
      var language = "english";
      if (req.cookies.tokenizValue) {
        var tokenized = "Y";
      } else {
        var tokenized = "N";
      }

      var monetize = "N";
      var sql =
        "INSERT INTO `user_profile`(`wallet_id`,`language`,`tokenized`,`monetize`) VALUES ('" +
        metaMaskId +
        "','" +
        language +
        "','" +
        tokenized +
        "','" +
        monetize +
        "')";
      var query = db.query(sql);
      req.session.metaUser = metaMaskId;
      req.session.userLanguage = language;
      req.session.tokenized = "N";
      req.session.monetize = "N";
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
//insert search term data into table..
const getSearchData = function (req, res) {
  message = "";
  urlLink = "";
  // category search

  //end the category search
  if (req.method == "POST") {
    var post = req.body;
    //console.log(req.body);

    var searchtermtext = post.searchtermtext;
    var encryptSearchValueData = encryptDecrypt.encrypt(searchtermtext);
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
    var wallet_id = req.session.metaUser;
    if (wallet_id) {
      var wallet_id = req.session.metaUser;
      var tokenized = req.session.tokenized;
      var monetize = req.session.monetize;
    } else {
      var wallet_id = "guest";
      var tokenized = "N";
      var monetize = "N";
    }

    var session_id = req.session.id;

    // Extract category and subcategory information based on the search term entered by the user
    var category = "";
    var subcategory = "";
    if (
      searchtermtext.includes("mystery") ||
      searchtermtext.includes("romance") ||
      searchtermtext.includes("sci-fi") ||
      searchtermtext.includes("fantasy") ||
      searchtermtext.includes("thriller")
    ) {
      category = "Books";
      subcategory = "Fiction";
    } else if (
      searchtermtext.includes("history") ||
      searchtermtext.includes("biography") ||
      searchtermtext.includes("self-help") ||
      searchtermtext.includes("memoir") ||
      searchtermtext.includes("business")
    ) {
      category = "Books";
      subcategory = "Non-fiction";
    } else if (
      searchtermtext.includes("picture books") ||
      searchtermtext.includes("chapter books") ||
      searchtermtext.includes("activity books") ||
      searchtermtext.includes("educational books") ||
      searchtermtext.includes("board books")
    ) {
      category = "Books";
      subcategory = "Children's Books";
    } else if (
      searchtermtext.includes("moisturizer") ||
      searchtermtext.includes("cleanser") ||
      searchtermtext.includes("sunscreen") ||
      searchtermtext.includes("serum") ||
      searchtermtext.includes("toner")
    ) {
      category = "Beauty & Personal Care";
      subcategory = "Skincare";
    } else if (
      searchtermtext.includes("foundation") ||
      searchtermtext.includes("mascara") ||
      searchtermtext.includes("lipstick") ||
      searchtermtext.includes("eyeshadow") ||
      searchtermtext.includes("blush")
    ) {
      category = "Beauty & Personal Care";
      subcategory = "Makeup";
    } else if (
      searchtermtext.includes("perfume") ||
      searchtermtext.includes("cologne") ||
      searchtermtext.includes("bodyspray") ||
      searchtermtext.includes("deodorant") ||
      searchtermtext.includes("aftershave")
    ) {
      category = "Beauty & Personal Care";
      subcategory = "Fragrance";
    } else if (
      searchtermtext.includes("laptop") ||
      searchtermtext.includes("desktop") ||
      searchtermtext.includes("gaming PC") ||
      searchtermtext.includes("2-in-1") ||
      searchtermtext.includes("all-in-one")
    ) {
      category = "Electronics";
      subcategory = "Computers";
    } else if (
      searchtermtext.includes("iPhone") ||
      searchtermtext.includes("Samsung") ||
      searchtermtext.includes("OnePlus") ||
      searchtermtext.includes("Google Pixel") ||
      searchtermtext.includes("Motorola")
    ) {
      category = "Electronics";
      subcategory = "Smartphones";
    } else if (
      searchtermtext.includes("headphones") ||
      searchtermtext.includes("Bluetooth speakers") ||
      searchtermtext.includes("soundbars") ||
      searchtermtext.includes("home theater") ||
      searchtermtext.includes("receivers")
    ) {
      category = "Electronics";
      subcategory = "Audio & Sound";
    } else if (
      searchtermtext.includes("treadmill") ||
      searchtermtext.includes("stationary bike") ||
      searchtermtext.includes("dumbbells") ||
      searchtermtext.includes("resistance bands") ||
      searchtermtext.includes("yoga mat")
    ) {
      category = "Sports & Fitness";
      subcategory = "Exercise Equipment";
    } else if (
      searchtermtext.includes("workout leggings") ||
      searchtermtext.includes("running shorts") ||
      searchtermtext.includes("sports bras") ||
      searchtermtext.includes("tank tops") ||
      searchtermtext.includes("compression socks")
    ) {
      category = "Sports & Fitness";
      subcategory = "Apparel";
    } else if (
      searchtermtext.includes("water bottle") ||
      searchtermtext.includes("fitness tracker") ||
      searchtermtext.includes("running shoes") ||
      searchtermtext.includes("gym bag") ||
      searchtermtext.includes("jump rope")
    ) {
      category = "Sports & Fitness";
      subcategory = "Gear & Accessories";
    } else if (
      searchtermtext.includes("sofa") ||
      searchtermtext.includes("bed") ||
      searchtermtext.includes("dining table") ||
      searchtermtext.includes("bookshelf") ||
      searchtermtext.includes("office chair")
    ) {
      category = "Home & Kitchen";
      subcategory = "Furniture";
    } else if (
      searchtermtext.includes("refrigerator") ||
      searchtermtext.includes("washing machine") ||
      searchtermtext.includes("microwave") ||
      searchtermtext.includes("dishwasher") ||
      searchtermtext.includes("air purifier")
    ) {
      category = "Home & Kitchen";
      subcategory = "Appliances";
    } else if (
      searchtermtext.includes("pots and pans") ||
      searchtermtext.includes("plates and bowls") ||
      searchtermtext.includes("cutlery") ||
      searchtermtext.includes("glasses") ||
      searchtermtext.includes("coffee makers")
    ) {
      category = "Home & Kitchen";
      subcategory = "Cookware & Dining";
    } else if (
      searchtermtext.includes("t-shirt") ||
      searchtermtext.includes("jeans") ||
      searchtermtext.includes("dress") ||
      searchtermtext.includes("jacket") ||
      searchtermtext.includes("sweatshirt")
    ) {
      category = "Fashion";
      subcategory = "Clothing";
    } else if (
      searchtermtext.includes("sneakers") ||
      searchtermtext.includes("boots") ||
      searchtermtext.includes("sandals") ||
      searchtermtext.includes("loafers") ||
      searchtermtext.includes("slippers")
    ) {
      category = "Fashion";
      subcategory = "Footwear";
    } else if (
      searchtermtext.includes("sunglasses") ||
      searchtermtext.includes("watches") ||
      searchtermtext.includes("hats") ||
      searchtermtext.includes("bags") ||
      searchtermtext.includes("belts")
    ) {
      category = "Fashion";
      subcategory = "Accessories";
    } else if (
      searchtermtext.includes("beach") ||
      searchtermtext.includes("mountain") ||
      searchtermtext.includes("city") ||
      searchtermtext.includes("countryside") ||
      searchtermtext.includes("theme park")
    ) {
      category = "Travels";
      subcategory = "Destinations";
    } else if (
      searchtermtext.includes("hotel") ||
      searchtermtext.includes("hostel") ||
      searchtermtext.includes("resort") ||
      searchtermtext.includes("Airbnb") ||
      searchtermtext.includes("vacation rental")
    ) {
      category = "Travels";
      subcategory = "Accommodation";
    } else if (
      searchtermtext.includes("sightseeing") ||
      searchtermtext.includes("adventure") ||
      searchtermtext.includes("cultural experience") ||
      searchtermtext.includes("theme park") ||
      searchtermtext.includes("water park")
    ) {
      category = "Travels";
      subcategory = "Activities & Attractions";
    }
    //tokenize values code
    var tokenValues = {
      Books: 0.25,
      "Beauty & Personal Care": 0.5,
      Electronics: 0.9,
      "Sports & Fitness": 0.9,
      "Home & Kitchen": 0.5,
      Fashion: 0.9,
      Travels: 0.9,
    };

    var categoryTokenValue = tokenValues[category];
    var tokenizedValue = monetize === "Y" ? categoryTokenValue : 0;
    //end the tokenize value code
    // Insert search term data into the search_history table
    var sql =
      "INSERT INTO `search_history`(`session_id`,`session_start`,`search_term`,`user_id`,`tokenized`,`monetize`,`category`,`sub_category`,`tokenvalue`,`link`,`created_date`,`updated_date` ) VALUES ('" +
      session_id +
      "','" +
      dateTimeVaues +
      "','" +
      encryptSearchValueData +
      "','" +
      wallet_id +
      "','" +
      tokenized +
      "','" +
      monetize +
      "','" +
      category +
      "','" +
      subcategory +
      "','" +
      tokenizedValue +
      "','" +
      urlLink +
      "','" +
      dateTimeVaues +
      "','" +
      dateTimeVaues +
      "')";
    //console.log(sql);
    var query = db.query(sql, function (err, result) {
      message = "Succesfully! Your account has been created.";
      urlLink =
        req.headers.host + "" + req.url + "?searchtermtext=" + searchtermtext;
      res.render("../views/pages/search", {
        message: message,
        searchtermtext: searchtermtext,
        urlLink: urlLink,
      });
    });
  } else {
    res.redirect("/");
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
    } else {
      var user_id = "";
    }
    if (post.firstName) {
      var first_name = encryptDecrypt.encrypt(post.firstName);
    } else {
      var first_name = "";
    }
    if (post.lastName) {
      var last_name = encryptDecrypt.encrypt(post.lastName);
    } else {
      var last_name = "";
    }
    if (post.emailId) {
      var email_id = encryptDecrypt.encrypt(post.emailId);
    } else {
      var email_id = "";
    }
    if (post.mobileNo) {
      var phone_no = encryptDecrypt.encrypt(post.mobileNo);
    } else {
      var phone_no = "";
    }
    if (post.address1) {
      var address_line1 = encryptDecrypt.encrypt(post.address1);
    } else {
      var address_line1 = "";
    }
    if (post.address2) {
      var address_line2 = encryptDecrypt.encrypt(post.address2);
    } else {
      var address_line2 = "";
    }

    var country = post.country;
    if (country) {
      var arrayDatac = country.split("_");
      var country_name = encryptDecrypt.encrypt(arrayDatac[1]);
    } else {
      var country_name = "";
    }

    var state = post.state;
    if (state) {
      var arrayDataState = state.split("_");
      var state_name = encryptDecrypt.encrypt(arrayDataState[2]);
    } else {
      var state_name = "";
    }
    if (post.city) {
      var city_name = encryptDecrypt.encrypt(post.city);
    } else {
      var city_name = "";
    }
    if (post.city) {
      var zip_code = encryptDecrypt.encrypt(post.zipCode);
    } else {
      var zip_code = "";
    }
    if (post.language) {
      var language = encryptDecrypt.encrypt(post.language);
    } else {
      var language = "";
    }
    if (post.interest) {
      var interest = encryptDecrypt.encrypt(post.interest);
    } else {
      var interest = "";
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
  var wallet_id = req.session.metaUser;
  message = "";
  var sql =
    "SELECT * FROM `search_history` WHERE user_id='" +
    wallet_id +
    "' ORDER BY id DESC";
  //console.log(req.session.metaUser);
  //var sessuser = req.session.metaUser;
  //console.log(sessuser);
  //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
  var query = db.query(sql, function (err, results, fields) {
    var arrayData = [];
    let sr = 1;
    var searchCount = results.length;
    //console.log(searchCount);
    let arrayValues = results.map((arrayData) => {
      var starttime = new Date(arrayData.session_start);
      var hours = starttime.getHours();
      var getdate = starttime.getDate();
      var getMonth = starttime.getMonth();
      var getFullYear = starttime.getFullYear();
      var minutes = ("0" + starttime.getMinutes()).slice(-2);
      var seconds = ("0" + starttime.getSeconds()).slice(-2);
      var searchtime =
        getdate +
        "-" +
        getMonth +
        "-" +
        getFullYear +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      //const myDate = new Date("11 May 2021 18:30:01 UTC");

      return {
        srNo: sr++,
        id: arrayData.id,
        session_id: arrayData.session_id,
        search_term: encryptDecrypt.decrypt(arrayData.search_term),
        session_start: searchtime,
        link: encryptDecrypt.decrypt(arrayData.link),
        tokenized: arrayData.tokenized,
        monetize: arrayData.monetize,
        category: arrayData.category,
        tokenvalue: arrayData.tokenvalue,
        searchDate: arrayData.created_date,
      };
    });
    //console.log(arrayValues);
    res.render("../views/pages/search-data", {
      data: arrayValues,
      searchCount: searchCount,
    });
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
      if (arrayData.user_id) {
        var encrpteuserid = encryptDecrypt.decrypt(arrayData.user_id);
      } else {
        var encrpteuserid = " ";
      }
      if (arrayData.first_name) {
        var encrpteFirstName = encryptDecrypt.decrypt(arrayData.first_name);
      } else {
        var encrpteFirstName = " ";
      }
      if (arrayData.last_name) {
        var encrpteLasttName = encryptDecrypt.decrypt(arrayData.last_name);
      } else {
        var encrpteLasttName = " ";
      }
      if (arrayData.phone_no) {
        var encrptePhoneNo = encryptDecrypt.decrypt(arrayData.phone_no);
      } else {
        var encrptePhoneNo = " ";
      }
      if (arrayData.email_id) {
        var encrpteEmailId = encryptDecrypt.decrypt(arrayData.email_id);
      } else {
        var encrpteEmailId = " ";
      }
      if (arrayData.address_line1) {
        var encrpteAddress1 = encryptDecrypt.decrypt(arrayData.address_line1);
      } else {
        var encrpteAddress1 = " ";
      }
      if (arrayData.address_line2) {
        var encrpteAddress2 = encryptDecrypt.decrypt(arrayData.address_line2);
      } else {
        var encrpteAddress2 = " ";
      }
      if (arrayData.zip_code) {
        var encrpteZipcode = encryptDecrypt.decrypt(arrayData.zip_code);
      } else {
        var encrpteZipcode = " ";
      }
      if (arrayData.city_name) {
        var encrpteCity = encryptDecrypt.decrypt(arrayData.city_name);
      } else {
        var encrpteCity = " ";
      }
      if (arrayData.state_name) {
        var encrpteState = encryptDecrypt.decrypt(arrayData.state_name);
      } else {
        var encrpteState = " ";
      }
      if (arrayData.country_name) {
        var encrpteCountry = encryptDecrypt.decrypt(arrayData.country_name);
      } else {
        var encrpteCountry = " ";
      }
      return {
        user_id: encrpteuserid,
        wallet_id: arrayData.wallet_id,
        first_name: encrpteFirstName,
        last_name: encrpteLasttName,
        phone_no: encrptePhoneNo,
        email_id: encrpteEmailId,
        address_line1: encrpteAddress1,
        address_line2: encrpteAddress2,
        zip_code: encrpteZipcode,
        city_name: encrpteCity,
        state_name: encrpteState,
        country_name: encrpteCountry,
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
      if (arrayData.user_id) {
        var encrpteuserid = encryptDecrypt.decrypt(arrayData.user_id);
      } else {
        var encrpteuserid = " ";
      }
      if (arrayData.first_name) {
        var encrpteFirstName = encryptDecrypt.decrypt(arrayData.first_name);
      } else {
        var encrpteFirstName = " ";
      }
      if (arrayData.last_name) {
        var encrpteLasttName = encryptDecrypt.decrypt(arrayData.last_name);
      } else {
        var encrpteLasttName = " ";
      }
      if (arrayData.phone_no) {
        var encrptePhoneNo = encryptDecrypt.decrypt(arrayData.phone_no);
      } else {
        var encrptePhoneNo = " ";
      }
      if (arrayData.email_id) {
        var encrpteEmailId = encryptDecrypt.decrypt(arrayData.email_id);
      } else {
        var encrpteEmailId = " ";
      }
      if (arrayData.address_line1) {
        var encrpteAddress1 = encryptDecrypt.decrypt(arrayData.address_line1);
      } else {
        var encrpteAddress1 = " ";
      }
      if (arrayData.address_line2) {
        var encrpteAddress2 = encryptDecrypt.decrypt(arrayData.address_line2);
      } else {
        var encrpteAddress2 = " ";
      }
      if (arrayData.zip_code) {
        var encrpteZipcode = encryptDecrypt.decrypt(arrayData.zip_code);
      } else {
        var encrpteZipcode = " ";
      }
      if (arrayData.city_name) {
        var encrpteCity = encryptDecrypt.decrypt(arrayData.city_name);
      } else {
        var encrpteCity = " ";
      }
      if (arrayData.state_name) {
        var encrpteState = encryptDecrypt.decrypt(arrayData.state_name);
      } else {
        var encrpteState = " ";
      }
      if (arrayData.country_name) {
        var encrpteCountry = encryptDecrypt.decrypt(arrayData.country_name);
      } else {
        var encrpteCountry = " ";
      }
      return {
        user_id: encrpteuserid,
        wallet_id: arrayData.wallet_id,
        first_name: encrpteFirstName,
        last_name: encrpteLasttName,
        phone_no: encrptePhoneNo,
        email_id: encrpteEmailId,
        address_line1: encrpteAddress1,
        address_line2: encrpteAddress2,
        zip_code: encrpteZipcode,
        city_name: encrpteCity,
        state_name: encrpteState,
        country_name: encrpteCountry,
        language: arrayData.language,
      };
    });
    //console.log(arrayValues);
    //var message = "Succesfully! updated your details.";
    //console.log(message);
    res.render("../views/pages/user-profile", {
      data: arrayValues,
      countryList: countryList,
    });
    //});
  });

  // });
};
const countryStateCity = (req, res) => {
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
const tokenizedMonetize = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    //console.log(req.body);
    var wallet_id = req.session.metaUser;
    //console.log(wallet_id);
    if (post.tokenizeEnabled == true) {
      var tokenized = "Y";
    } else {
      var tokenized = "N";
    }
    if (post.actionbutton == "tokenize") {
      var sql = `update user_profile set tokenized='${tokenized}' WHERE wallet_id='${wallet_id}'`;
    } else {
      var sql = `update user_profile set monetize='${tokenized}' WHERE wallet_id='${wallet_id}'`;
    }
    var query = db.query(sql, function (err, result) {
      if (err) throw err;
      //console.log(result.affectedRows + " record(s) updated");
    });
    var sqlQuery =
      "SELECT wallet_id,tokenized,monetize FROM `user_profile` WHERE `wallet_id`='" +
      wallet_id +
      "'";
    db.query(sqlQuery, function (err, results) {
      //const results = result.length || 0;
      if (results.length > 0) {
        req.session.userLanguage = results[0].language;
        req.session.tokenized = results[0].tokenized;
        req.session.monetize = results[0].monetize;
        req.session.save();
      }
    });
  }
  res.end();
};
const tokenizedMonetizeSingle = function (req, res) {
  //message = "";
  //console.log(req.body);
  //console.log(req.body);
  if (req.method == "POST") {
    var post = req.body;
    console.log(req.body);
    var tokenizeMonetized = post.tokenizeEnabled;
    var arrayTokenize = tokenizeMonetized.split("_");
    var tokenized = arrayTokenize[0];
    var rowId = arrayTokenize[1];
    if (tokenized == "Y") {
      var tokenizedvalue = "N";
    } else {
      var tokenizedvalue = "Y";
    }
    if (post.actionbutton == "tokenized") {
      var sql = `update search_history set tokenized='${tokenizedvalue}' WHERE id='${rowId}'`;
    } else {
      var sql = `update search_history set monetize='${tokenizedvalue}' WHERE id='${rowId}'`;
    }
    // var sql = `update user_profile set monetize='${tokenized}' WHERE id='${rowId}'`;
    console.log(sql);
    var query = db.query(sql, function (err, result) {
      if (err) throw err;
      //console.log(result.affectedRows + " record(s) updated");
    });
    //console.log(wallet_id);
    // if (post.tokenizeEnabled == true) {
    //   var tokenized = "Y";
    // } else {
    //   var tokenized = "N";
    // }
    // if (post.actionbutton == "tokenize") {
    //   var sql = `update user_profile set tokenized='${tokenized}' WHERE wallet_id='${wallet_id}'`;
    // } else {
    //   var sql = `update user_profile set monetize='${tokenized}' WHERE wallet_id='${wallet_id}'`;
    // }
    // var query = db.query(sql, function (err, result) {
    //   if (err) throw err;
    //   //console.log(result.affectedRows + " record(s) updated");
    // });
    // var sqlQuery =
    //   "SELECT wallet_id,tokenized,monetize FROM `user_profile` WHERE `wallet_id`='" +
    //   wallet_id +
    //   "'";
    // db.query(sqlQuery, function (err, results) {
    //   //const results = result.length || 0;
    //   if (results.length > 0) {
    //     req.session.userLanguage = results[0].language;
    //     req.session.tokenized = results[0].tokenized;
    //     req.session.monetize = results[0].monetize;
    //     req.session.save();
    //   }
    // });
  }
  res.end();
};
const deleteSearchTerm = function (req, res) {
  var id = req.params.id;
  //console.log("mukesh");
  message = "";
  var sql = "DELETE FROM search_history WHERE id = ?";
  db.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
    message = "Succesfully deleted your record..";
  });
  res.redirect("/searchHistory");
};
const setCookies = function (req, res) {
  var post = req.body;
  //console.log(req.body);
  var tokenizValue = post.tokenizeEnabled;
  var cookieConsent = req.session.id;
  if (tokenizValue == "Y") {
    res.cookie("cookieConsent", cookieConsent, { maxAge: 2500000 });
    res.cookie("tokenizValue", tokenizValue, { maxAge: 2500000 });
  } else {
    res.cookie("cookieConsent", cookieConsent, { maxAge: 2500000 });
  }
  //consosle.log(req.cookies.tokenizValue);
  res.end();
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
  tokenizedMonetize,
  deleteSearchTerm,
  setCookies,
  tokenizedMonetizeSingle,
};
// aoeorofsleDala,onsent);
//  =getPrtfneeretai.ss
//   tk  =onsent);
//  =vaa =honeto
// ,, cookirConsent, { mdxAge: 50000 });
// Mel({sSo=hTk m ("usekiooki"",Ssa =hT.no,
// o
// tProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };aoeorofsleDala,onsent);
//  =getPrtfneeretai.ss
//   tk  =onsent);
//  =vaa =honeto
// ,, cookirConsent, { mdxAge: 50000 });
// Mel({sSo=hTk m ("usekiooki"",Ssa =hT.no,
// o
// tProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
// aoeorofsleDala,onsent);
//  =getPrtfneeretai.ss
//   tk  =onsent);
//  =vaa =honeto
// ,, cookirConsent, { mdxAge: 50000 });
// Mel({sSo=hTk m ("usekiooki"",Ssa =hT.no,
// o
// tProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
// aoeorofsleDala,onsent);
//  =getPrtfneeretai.ss
//   tk  =onsent);
//  =vaa =honeto
// ,, cookirConsent, { mdxAge: 50000 });
// Mel({sSo=hTk m ("usekiooki"",Ssa =hT.no,
// o
// tProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
// aoeorofsleDala,onsent);
//  =getPrtfneeretai.ss
//   tk  =onsent);
//  =vaa =honeto
// ,, cookirConsent, { mdxAge: 50000 });
// Mel({sSo=hTk m ("usekiooki"",Ssa =hT.no,
// o
// tProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//t, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//t, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//t, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//t, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//t, { moxAn : 50000 });here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//here, such as disabling certain features of the site
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
//    res.redirect("/"); // redirect to the homepage or any other desired page
// ofileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };  res.cookie("cookieConsent", cookieConsent, { maxAge: 50000 });
//   }
//   res.redirect("/");
// };
// module.exports = {
//   searchIndex,
//   login,
//   logout,
//   getSearchData,
//   getSearchHistory,
//   dashboard,
//   profile,
//   countryStateCity,
//   updateProfileData,
//   getProfileDetails,
//   tokenizedMonetize,
//   deleteSearchTerm,
//   setCookies,
// };
