
//const bodyParser = require('body-parser');
const url = require('url');
const encryptDecrypt = require('../config/encrypt-decrypt');
const countryModels = require('../models/countryModels');
const getSearchData = function(req, res){
    message = '';
    if(req.method == "POST"){
       
        var post  = req.body;
        var searchtermtext= post.searchtermtext;
        var encryptSearchValueData=encryptDecrypt.encrypt(searchtermtext);
        //var encryptSearchValue= JSON.stringify(encryptSearchValueData);
       // var encryptSearchValue=encryptSearchValueData.encryptedData;
        //console.log(encryptDecrypt.encrypt(searchtermtext));
        //console.log(encryptDecrypt.decrypt(encryptSearchValue));
        var searchLink = searchtermtext.split(' ').join('+');
        var url = req.headers.host +''+ req.url+'?searchtermtext='+searchLink;
        var urlLink=encryptDecrypt.encrypt(url);
        //var urlLink=urlLinkDate.encryptedData;
        var shareFlag="no";
        var datetime = new Date();
        var date=datetime.toISOString().slice(0,10);
        var hours = datetime.getHours()
        var minutes = datetime.getMinutes()
        var seconds = datetime.getSeconds()
        var dateTimeVaues = date+' '+hours+':'+minutes+':'+seconds;
        //console.log(url);
        var sql = "INSERT INTO `search_history`(`search_term`,`share_flag`,`link`,`created_date`,`updated_date` ) VALUES ('" + encryptSearchValueData + "','" + shareFlag + "','" + urlLink + "','" + dateTimeVaues + "','" + dateTimeVaues + "')";
        var query = db.query(sql, function(err, result) {
           message = "Succesfully! Your account has been created.";
           //res.render('signup.ejs',{message: message});
           //console.log(encryptDecrypt.decrypt(encryptSearchValue));
           //console.log(sql);
           res.render('../views/pages/search');
        });
     } else  {
       res.render('../views/pages/search');
    }
 };
// For View 
const getSearchHistory = (req, res) => {
    var sql = "SELECT * FROM `search_history`";
    //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
        var query = db.query(sql, function(err, results,fields) {
           var arrayData=[];
           results.forEach(searchData => {
            //var arrayData = new Array(searchData.search_term,searchData.share_flag);
            arrayData.push(searchData.session_start,encryptDecrypt.decrypt(searchData.search_term),searchData.share_flag,encryptDecrypt.decrypt(searchData.link),searchData.createdd_date)
            //console.log(searchData.search_term);
            //console.log(encryptDecrypt.decrypt(searchData.search_term));
            //console.log(results.search_term);
            //console.log(results);
        })
        var stringObj = JSON.stringify(arrayData);
        //console.log(stringObj);
        console.log(fields);
        for (var i = 0; i < arrayData.length; i++) {
            //console.log(arrayData[i]);
         }
         let sr=1;
         let arrayValues = results.map((arrayData) => {
    return {
      srNo:sr++,  
      search_term:encryptDecrypt.decrypt(arrayData.search_term),
      session_start:arrayData.session_start,
      link:encryptDecrypt.decrypt(arrayData.link),
      share_flag:arrayData.share_flag,
      searchDate:arrayData.created_date,
    };
  });
           //console.log(arrayValues);
           res.render('../views/pages/search-data',{data:arrayValues});
        });
};
const dashboard = (req, res) => {
    res.render('../views/pages/dashboard');
};
const profile = (req, res) => {
    let countryList=countryModels.countryList();
    
    res.render('../views/pages/user-profile',{data:countryList});
};
const countryStateCity = (req, res) => {
    let countryList=countryModels.countryList();
    for(var i = 0; i< countryList.length; i++)
    {
        countryList[i].name
        //var sql = "INSERT INTO `countries`(`name`,`iso_code`,`flag`,`phonecode`,`currency`) VALUES ('" + encryptDecrypt.encrypt(countryList[i].name) + "','" + encryptDecrypt.encrypt(countryList[i].isoCode) + "','" + encryptDecrypt.encrypt(countryList[i].flag) + "','" + encryptDecrypt.encrypt(countryList[i].phonecode) + "','" + encryptDecrypt.encrypt(countryList[i].currency) + "')";
      // var query = db.query(sql)
    
    }
    //console.log(countryArray);
    let stateList=countryModels.stateList();
    //console.log(stateList);
    // for(var i = 0; i< stateList.length; i++)
    // {
    //     var sql = "INSERT INTO `all_states`(`name`,`iso_code`,`country_code`) VALUES ('" + encryptDecrypt.encrypt(stateList[i].name) + "','" + encryptDecrypt.encrypt(stateList[i].isoCode) + "','" + encryptDecrypt.encrypt(stateList[i].countryCode) + "')";
    //     var query = db.query(sql);
    
    // }
    let cityList=countryModels.cityList();
    console.log(cityList);
    for(var i = 0; i< cityList.length; i++)
    {
        var sql = "INSERT INTO `all_cities`(`name`,`country_code`,`state_code`) VALUES ('" + encryptDecrypt.encrypt(cityList[i].name) + "','" + encryptDecrypt.encrypt(cityList[i].countryCode) + "','" + encryptDecrypt.encrypt(cityList[i].stateCode) + "')";
        var query = db.query(sql);
    
    }
    res.render('../views/pages/user-profile',{data:countryList});
};
module.exports =  {
    getSearchData,
    getSearchHistory,
    dashboard,
    profile
    
};