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
let placeName; 
let placeNameDisp;
let countryCode;
let flagUrl;
let start;
let end;
let currentWeatherData;
let pixabayImg;

let eventName; 
let eventImg;
let eventUrl;
let eventDte;
let eventTime;
let temp; 


//declare GeoNamesAPI API function

function callGeoNamesAPI() {

    const geoNamesUsername = 'matmll12';
    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //retrieves country code 
                countryCode = data.geonames[0].countryCode;
                //generates flag icon url 
                flagUrl = `https://www.countryflags.io/${countryCode}/shiny/64.png`;
                //calls pixabay api 
                callPixabayAPI();
            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
}

//declare Pixbay API function

function callPixabayAPI() {

    const apiUrl = `https://pixabay.com/api/?key=23699081-1c7d96634df54c3a4261e64ca&q=${countryCode}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //retrieve first image from pixabay array
                pixabayImg = data.hits[0].largeImageURL;
                //renders data inside databox
                callCurrentWeatherDataAPI(placeName)
            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
};

//declare Weather API function

function callCurrentWeatherDataAPI(cityName){
  
    const apiKey = 'f2d872dec206d66d9deec95927164a7b';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(apiUrl).then(function(response) {
        if(response.ok){
            response.json().then(function(data){
                currentWeatherData = data;
                temp = Math.round(currentWeatherData.main.temp);
                renderDatabox();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        };
    })
};

//declare renderDatabox function

function renderDatabox(){
    cityEl.textContent = placeNameDisp;
    pixEl.setAttribute('src',pixabayImg);
    flagEl.setAttribute('src',flagUrl);
    dateEl.innerHTML = `
    <p> Arrival: ${start} <br/> Departure: ${end}</p>
    `;
    // weatherEl.
    weatherEl.innerHTML =  `<p class="temp">Temp: ${temp} &#8457;</p>`

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


// eventBtn.addEventListener('click', callTicketMasterAPI);



//add event listeners 


//for modal 
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, "");
});

//form submit listener 
formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    placeName = formEl.placename.value.trim();
    placeNameDisp = capitalizeFirstLetter(placeName);
    // from https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
    //weather app needs hyphen
    placeName = placeName.replace(/\s/g, '-');
    start = formEl.startDate.value;
    end = formEl.endDate.value;
    callGeoNamesAPI();
});

// help via https://flexiple.com/javascript-capitalize-first-letter/
function capitalizeFirstLetter(str){
    const arr = str.split(' ');
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    
    };

    return arr.join(' ');

};

//API Call Sequence 

//call geonamesAPI which set the flag url calls PixaBay api which calls current weather API which calls render function. 

//watch out for spaces 