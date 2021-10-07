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
const sidebarEl = document.getElementById('sidebar');
const shareBtn = document.getElementById('share');
const historyBtn = document.getElementById('history-button');
const historyEl = document.getElementById('history');
const exitBtn = document.getElementById('exit-history');
const historyUl = document.getElementById('historyUl');
const historyExitBtn = document.getElementById('exit-history');



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
let eventDateTime;
let temp;
let trips = tripData()

function tripData (){
    const data = JSON.parse(localStorage.getItem('trips'))
    console.log(data)
if(data){
    return data.slice(-10);
} else {
    return [];
};
};
//declare GeoNamesAPI API function



function callGeoNamesAPI() {

    const geoNamesUsername = 'matmll12';
    const apiUrl = `http://api.geonames.org/searchJSON?q=&name_equals=${placeName}&maxRows=10&username=${geoNamesUsername}`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
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

function callCurrentWeatherDataAPI(cityName) {

    const apiKey = 'f2d872dec206d66d9deec95927164a7b';
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                currentWeatherData = data;
                temp = Math.round(currentWeatherData.main.temp);
                // renderDatabox();
                callTicketMasterAPI();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        };
    })
};

//declare renderDatabox function

function renderDatabox() {
    cityEl.textContent = placeNameDisp;
    pixEl.setAttribute('src', pixabayImg);
    flagEl.setAttribute('src', flagUrl);
    let countdown = daysRemaining();
    start = moment(start).format('dddd, MMMM Do YYYY');
    end = moment(end).format('dddd, MMMM Do YYYY');
    dateEl.innerHTML = `<p> Arrival: ${start} <br/> Departure: ${end}</p>`;
    // weatherEl.
    countdownEl.innerHTML = `<p>Days until trip: ${countdown}</p>`
    weatherEl.innerHTML = `<p class="temp">Temp: ${temp} &#8457;</p>`
    sidebarEl.classList.remove('hide');
    databoxEl.classList.remove('hide');
}
// countdown timer - days until
function daysRemaining() {
    var eventdate = moment(start);
    var todaysdate = moment();
    return eventdate.diff(todaysdate, 'days') + 1;
}
// alert(daysRemaining());



function callTicketMasterAPI() {

    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?countrycode=${countryCode}&city=${placeName}&startDateTime=${start}T00:00:00Z&endDateTime=${end}T23:59:59Z&apikey=BB0un6jhuIJmxoe1h6b5V9OOjpVPoXYw`
    console.log(apiUrl);
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                sidebarEl.innerHTML = '';
                var num = data._embedded.events.length > 4 ? 5 : data._embedded.events.length;
                for (let i = 0; i < num; i++) {
                    // console.log(data);
                    eventName = data._embedded.events[i].name;
                    eventDte = data._embedded.events[i].dates.start.localDate;
                    eventTime = data._embedded.events[i].dates.start.localTime || '';
                    // eventTime = eventDte+eventTime
                    // eventTime = eventTime.slice(0,eventTime.length-3)
                    console.log(eventTime + ' = eventTime');
                    eventUrl = data._embedded.events[i].url;
                    eventImg = data._embedded.events[i].images[5].url;
                    //let html = `<div><img src="${eventImg}"><p> ${eventName} <br/> ${eventDte} <br/> ${eventTime}</p><a href="${eventUrl}">Link</a></div>`
                    if (eventTime) {
                        console.log('hit the date IF');
                        console.log(typeof eventTime)
                        //eventTime = eventTime.substring(0,eventTime.length-3)
                        eventDateTime = eventDte + ' ' + eventTime;
                        console.log(eventTime + ' = date and time');
                        eventTime = moment(eventDateTime).format('LT');
                        eventDte = moment(eventDateTime).format('LL')
                    } else {
                        // console.log('hit the else because eventTime = '+ eventTime);
                        eventTime = '';
                        eventDte = moment(eventDte).format('LL');
                    }
                    let html = ` <div class="card"><div class="card-image">  <img src="${eventImg}"> </div><div class="card-content"><span class="card-title">${eventName}</span>
                <p>${eventDte} <br/>${eventTime}</p></div><div class="card-action"><a href="${eventUrl}">See more</a> `

                    sidebarEl.innerHTML += html;
                    console.log(sidebarEl);
                }
                console.log("callTicketMasterAPI");
                renderDatabox();
                // console.log(data.hits[0].largeImageURL);
                // for loop

                //console.log 

            });
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })

};

// help via https://flexiple.com/javascript-capitalize-first-letter/
function capitalizeFirstLetter(str) {
    const arr = str.split(' ');
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    };

    return arr.join(' ');

};

//call this via submit button and previous search button
function submitFormHandler() {
    // from https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
    //weather app needs hyphen
    
    placeNameDisp = capitalizeFirstLetter(placeName);
    placeName = placeName.replace(/\s/g, '-');

    
    if (placeName && start && end){

        const trip = { placeName, start, end }
        trips.push(trip);
        trips = trips.slice(-10);

        localStorage.setItem("trips", JSON.stringify(trips));
        
        callGeoNamesAPI();
        } else {
            M.toast({html: 'Please enter a city and start and end dates!', classes: 'rounded'});
        }
}
//eventSidebar.classList .remove('hide');
// eventBtn.addEventListener('click', callTicketMasterAPI)



//add event listeners 
//for history button
historyBtn.addEventListener('click', function (event) {
    var num = trips.length > 4 ? 5 : trips.length;

    for (let i = 0; i < num; i++) {
        let html = `<li><button class="waves-effect waves-light btn-large blue-grey darken-2" data-place="${trips[i].placeName}" data-start="${trips[i].start}" data-end="${trips[i].end}">${trips[i].placeName}: ${trips[i].start} - ${trips[i].end}<i class="material-icons right">history</i></button></li>`;
        historyUl.innerHTML += html;
    }
    historyEl.classList.remove('hide');
    databoxEl.classList.add('hide');
    sidebarEl.classList.add('hide');

})

exitBtn.addEventListener('click', function (event) {
    databoxEl.classList.remove('hide');
    sidebarEl.classList.remove('hide');
    historyEl.classList.add('hide');
})

//for modal 
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, "");
});
// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.carousel');
//     var instances = M.Carousel.init(elems, options);
//   });


//form submit listener 
formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    placeName = formEl.placename.value.trim();
    start = formEl.startDate.value;
    end = formEl.endDate.value;
    submitFormHandler();

});

//copy link to clipboard when click share icon
// https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
shareBtn.addEventListener('click', function(event){
    
        const appUrl = document.URL;
        console.log(appUrl);
        navigator.clipboard.writeText(appUrl);
        M.toast({html: 'Link copied!', classes: 'rounded'});
        
});

// click on history and bring that search back up
//event listener on ul id historyUl, then check matches button and grab data values
historyUl.addEventListener('click', function(event){
    if (event.target.matches('button')) {
        // console.log('this is ' +event.target)
        // console.log('this.data-place = ' + event.target.getAttribute('data-place'))
        placeName = event.target.getAttribute('data-place');
        start = event.target.getAttribute('data-start');
        end = event.target.getAttribute('data-end');

        submitFormHandler();
    };
});


//history exit button
historyExitBtn.addEventListener('click',function(){

})

//API Call Sequence 

//call geonamesAPI which set the flag url calls PixaBay api which calls current weather API which calls render function. 

//watch out for spaces

//for events sidebar

// console.log(eventSidebar);