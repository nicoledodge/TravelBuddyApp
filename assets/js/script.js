//DOM Queries 
const formEl = document.getElementById('form');
const databoxEl = document.getElementById('databox');
const modalEl = document.getElementById('modal1');
const cityEl = document.getElementById('cityname');
const pixEl = document.getElementById('pixabay')
const dateEl = document.getElementById('dates');
const countdownEl = document.getElementById('countdown');
const weatherEl = document.getElementById('weather');
const flagEl = document.getElementById('flag');
const eventBtn = document.getElementById('events_button');

//Global Variables 
let placeName = 'austin';
const geoNamesUsername = 'matmll12';
let countryCode;
let flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`;
let start;
let end;
let currentWeatherData;
let pixabayImg;
let eventName; 
let eventImg;
let eventUrl;
let eventDte;
let eventTime;


//callGeoNamesAPI

const callGeoNamesAPI = function () {

    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
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

//callPixabay

function callPixabayAPI() {

    const apiUrl = `https://pixabay.com/api/?key=23699081-1c7d96634df54c3a4261e64ca&q=${countryCode}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data.hits[0].largeImageURL);
                pixabayImg = data.hits[0].largeImageURL;
                // callCurrentWeatherDataAPI();
                renderDatabox();

            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
};

//make Weather API call

const callCurrentWeatherDataAPI = function(cityName){
  
    const apiKey = 'f2d872dec206d66d9deec95927164a7b';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                currentWeatherData = data;
                console.log(data);
                renderDatabox();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        };
    })
};

function renderDatabox(){
    cityEl.textContent = placeName;
    pixEl.setAttribute('src',pixabayImg);
    flagEl.setAttribute('src',flagUrl);
    dateEl.innerHTML = `
    <p>${start} - ${end}</p>
    `;
    // weatherEl.
    databoxEl.classList.remove('hide');

}

function callTicketMasterAPI() {

    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countrycode=${countryCode}&city=${placeName}&startDateTime=${start}T00:00:00Z&endDateTime=${end}T23:59:59Z&apikey=BB0un6jhuIJmxoe1h6b5V9OOjpVPoXYw`
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                eventName = data._embedded.events[0].name;
                eventDte = data._embedded.events[0].dates.start.localDate;
                eventTime = data._embedded.events[0].dates.start.localTime;
                eventUrl = data._embedded.events[0].url;
                eventImg = data._embedded.events[0].images[5].url;
                console.log(eventName);

                // console.log(data.hits[0].largeImageURL);
               
                
                
            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
};


eventBtn.addEventListener('click', callTicketMasterAPI);




document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, "");
});

formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    placeName = formEl.placename.value.trim();
    
    console.log(formEl.placename.value);
    console.log(placeName);
    start = formEl.startDate.value;
    console.log(start)
    end = formEl.endDate.value;
    console.log(end)
    callGeoNamesAPI();
    callCurrentWeatherDataAPI(placeName);
    // renderDatabox();
    // databoxEl.classList.remove('hide');

});

