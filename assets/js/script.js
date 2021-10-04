//DOM Queries 




//Global Variables 
const placeName = 'austin';
const geoNamesUsername = 'matmll12';
let countryCode;
let flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`



//make first API call

const callGeoNamesAPI = function(){
    
    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                countryCode = data.geonames[0].countryCode;
                flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`
                callPixabayAPI() 
               console.log(flagUrl);
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
}

//country name 

function callPixabayAPI() {

    const apiUrl = `https://pixabay.com/api/?key=23699081-1c7d96634df54c3a4261e64ca&q=${countryCode}`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                console.log(data.hits[0].largeImageURL)
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
}

callGeoNamesAPI()

// Search for - country/city- start date 
// show name of country, PLACE NAME, flag, Population, current weather, countdown to departure(number of days) add image Pixabay

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems,"");
  });