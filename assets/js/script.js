//DOM Queries 
const placeName = 'austin';
const geoNamesUsername = 'matmll12';
let countryCode;
const countryCodesApiKey = '4fe5a1c22abfdbabd905fdab3ebb1817'

//Global Variables 




//make first API call

const callGeoNamesAPI = function(){
    
    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                countryCode = data.geonames[0].countryCode;
                callCountryLayerAPI() 
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
}

//country name 

function callCountryLayerAPI() {

    const apiUrl = `https://api.countrylayer.com/v2/alpha/${countryCode}?access_key=${countryCodesApiKey}`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
}

callGeoNamesAPI()
