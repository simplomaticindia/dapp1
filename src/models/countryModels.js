const Country = require('country-state-city').Country;
const State = require('country-state-city').State;
const City = require('country-state-city').City;
const encryptDecrypt = require("../config/encrypt-decrypt");
//console.log(State.getAllStates("in"));
module.exports={
   
    countryList:function(){
         data=Country.getAllCountries();
         return data;
    },
    stateList:function(){
        data=State.getAllStates();
        return data;
   },
   cityList:function(){
     data=City.getAllCities();
     return data;
},
getStatesByCountry:function(req, res){
     var sql = "SELECT * FROM `countries`";
     //console.log(req.session.metaUser);
     //var sessuser = req.session.metaUser;
     //console.log(sessuser);
     //var sql = "SELECT * FROM `search_history` WHERE `id`='"+userId+"'";
     var arrayData = [];
     var query = db.query(sql, function (err, results, fields) {
       let arrayValues = results.map((arrayData) => {
          return {
            name: encryptDecrypt.decrypt(arrayData.name),
            iso_code: encryptDecrypt.decrypt(arrayData.iso_code)
          };
          //return ;
          return arrayValues;  
        });
        //return arrayValues;  
        //console.log(arrayValues) ;
     });
     //
    
}

     }