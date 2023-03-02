const Country = require('country-state-city').Country;
const State = require('country-state-city').State;
const City = require('country-state-city').City;

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
}
}