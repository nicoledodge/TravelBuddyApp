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

//Global Variables 
let placeName; 
let countryCode;
let flagUrl;
let start;
let end;
let currentWeatherData;
let pixabayImg;
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
    cityEl.textContent = placeName;
    pixEl.setAttribute('src',pixabayImg);
    flagEl.setAttribute('src',flagUrl);
    dateEl.innerHTML = `
    <p>${start} - ${end}</p>
    `;
    // weatherEl.
    weatherEl.innerHTML =  `<p class="temp">Temp: ${temp} &#8457;</p>`

    databoxEl.classList.remove('hide');
}

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
    start = formEl.startDate.value;
    end = formEl.endDate.value;
    callGeoNamesAPI();
});

//API Call Sequence 

//call geonamesAPI which set the flag url calls PixaBay api which calls current weather API which calls render function. 

//watch out for spaces 