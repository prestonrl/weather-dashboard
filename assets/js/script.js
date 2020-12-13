var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector('#city');
var pastCityBtnEl = document.querySelector('#previous-cities')
var cityTitleEl = document.querySelector('#current-city');
var weatherDisplayEl = document.querySelector('#weather-container');
var cities = [];
var apiKey = "4e58e97fdd4f6e5374486a7e4a85fd81";


var searchedCity = function(event){
    event.preventDefault();
    var currentCity = cityInputEl.value.trim();
    //console.log(currentCity);

    if (currentCity) {
        getCurrentWeather(currentCity);
        cityInputEl.value = "";
        saveCity(currentCity);
    }
    else {
        alert("Please enter a city before searching");
    }
};

var saveCity = function (currentCity) {
    if (cities.indexOf(currentCity) !== -1) {
        return;
    } else {
        cities.push(currentCity);
        localStorage.setItem("cities", JSON.stringify(cities));
        previousSearch(currentCity);
    }   
};

var loadPrevious = function() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    for (i = 0; i < cities.length; i++) {
        previousSearch(cities[i]);
    }
};

var previousSearch = function(pastCity) {
    //console.log(pastCity);
    pastCityEl = document.createElement("button");
    pastCityEl.textContent = pastCity;
    pastCityEl.classList = "d-flex w-100 btn-light barder p-2";
    pastCityEl.setAttribute("data-city", pastCity);
    pastCityEl.setAttribute("type", "submit");

    pastCityBtnEl.prepend(pastCityEl);
};

var getCurrentWeather = function(city) {
    var apiSite = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiSite)
    .then(function(response){
        response.json().then(function(data){
            loadWeather(data, city);
        });
    });
};

var loadWeather = function(weather, currentCity) {
    weatherDisplayEl.textContent = "";
    cityTitleEl.textContent = currentCity;
    console.log(weather);

    var theDate = document.createElement('span');
    theDate.textContent = " (" + moment().format('M/DD/YYYY') + ") ";
    //console.log(theDate);
    cityTitleEl.appendChild(theDate);

    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    cityTitleEl.appendChild(weatherIcon);

    var tempEl = document.createElement('span');
    tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    tempEl.classList = "list-group-item";

    var humidityEl = document.createElement('span');
    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item";

    var windEl = document.createElement('span');
    windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windEl.classList = "list-group-item";

    weatherDisplayEl.appendChild(tempEl);
    weatherDisplayEl.appendChild(humidityEl);
    weatherDisplayEl.appendChild(windEl);
};


userFormEl.addEventListener("submit", searchedCity);
loadPrevious();