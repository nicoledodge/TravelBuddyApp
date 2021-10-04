//DOM Queries 
// const placeNameEl = document.getElementById('placename');
// const startEl = document.getElementById('startdate');
// const endEl = document.getElementById('enddate');
// const submitBtn = document.getElementById('submit')
const formEl = document.getElementById('form');

//Global Variables 
let placeName = 'austin';
const geoNamesUsername = 'matmll12';
let countryCode;
let flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`
let start;
let end;


//make first API call

const callGeoNamesAPI = function(){
    
    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`;

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                // console.log('data = ' + data);
                countryCode = data.geonames[0].countryCode;
                flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`;
                callPixabayAPI();
               console.log(flagUrl);
            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
}

//country name 

function callPixabayAPI() {

    const apiUrl = `https://pixabay.com/api/?key=23699081-1c7d96634df54c3a4261e64ca&q=${countryCode}`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                console.log(data.hits[0].largeImageURL);
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
}

// callGeoNamesAPI()

// Search for - country/city- start date 
// show name of country, PLACE NAME, flag, Population, current weather, countdown to departure(number of days) add image Pixabay


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems,"");
  });

formEl.addEventListener('submit', function (event){
    event.preventDefault();
    placeName = formEl.placename.value;
    // console.log(formEl.placename.value);
    // console.log(placeName);
    start = formEl.startDate.value;
    // console.log(start)
    end = formEl.endDate.value;
    // console.log(end)
    callGeoNamesAPI();

})

