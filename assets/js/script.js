var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector('#city');
var pastCityBtnEl = document.querySelector('#previous-cities')
var cityTitleEl = document.querySelector('#current-city');
var weatherDisplayEl = document.querySelector('#weather-container');
var forecastDisplayEl = document.querySelector('#forecast');
var forecastTitleEl = document.querySelector('#forecast-title');
var previousCityEl = document.querySelector('#previous-cities');
var currentWeatherEl = document.querySelector('#current-weather');
var fiveDayEl = document.querySelector('#five-day');
var cities = [];
var apiKey = "4e58e97fdd4f6e5374486a7e4a85fd81";
document.querySelector('#city').style.height="35px";


var searchedCity = function(event){
    event.preventDefault();
    var currentCity = cityInputEl.value.trim();
    //console.log(currentCity);

    if (currentCity) {
        getCurrentWeather(currentCity);
        cityInputEl.value = "";
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
    pastCityEl.classList = "d-flex w-100 btn-light border p-2";
    pastCityEl.setAttribute("data-city", pastCity);
    pastCityEl.setAttribute("type", "submit");

    pastCityBtnEl.prepend(pastCityEl);
};

var getCurrentWeather = function(city) {
    var apiSite = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiSite)
    .then(function(response){
        if (response.ok){
            response.json().then(function (data) {
                loadWeather(data, city);
                saveCity(city);
            });  
        }
        else {
            alert("Error: " + response.statusText);
            return;
        }
    });
};

var loadWeather = function(weather, currentCity) {
    weatherDisplayEl.textContent = "";
    cityTitleEl.textContent = currentCity;
    currentWeatherEl.classList.add('border', 'p-2');
    //console.log(weather);

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

    var latitude = weather.coord.lat;
    var longitude = weather.coord.lon;
    getUvIndex(latitude, longitude);
    getForecast(latitude, longitude);
};

var getUvIndex = function(latitude, longitude) {
    var apiSite = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`;
    fetch(apiSite)
    .then(function(response) {
        response.json().then(function(data){
            loadUV(data);
        });
    });
};

var loadUV = function(data) {
    var uvEl = document.createElement('div');
    uvEl.textContent = "UV Index: ";
    uvEl.classList = "list-group-item";

    uvValue = document.createElement('span');
    uvValue.textContent = data.value;

    if (data.value <= 2) {
        uvValue.classList = "favorable";
    } else if (data.value > 2 && data.value <= 8) {
        uvValue.classList = "moderate";
    }
    else if (data.value > 8) {
        uvValue.classList = "severe";
    };

    uvEl.appendChild(uvValue);
    weatherDisplayEl.appendChild(uvEl);
};

var getForecast = function(lat, lon) {
    var apiSite = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`;

    fetch(apiSite)
    .then(function(response){
        response.json().then(function(data){
            loadForecast(data);
        });
    });
};

var loadForecast = function(weather){
    forecastTitleEl.textContent = "5-Day Forecast:"
    forecastDisplayEl.textContent = "";
    fiveDayEl.classList.add('border', 'p-2');

    for (i=1; i < 6; i++) {
        var dayWeather = (weather.daily[i]);

        var weatherForecastEl = document.createElement('div');
        weatherForecastEl.classList = "card bg-primary text-light m-2 col-sm"

        var dayDate = document.createElement('h5');
        dayDate.textContent = moment.unix(dayWeather.dt).format('M/DD/YYYY');
        dayDate.classList = "card-header text-center";
        weatherForecastEl.appendChild(dayDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dayWeather.weather[0].icon}@2x.png`);  
        weatherForecastEl.appendChild(weatherIcon);

        var tempEl = document.createElement('span');
        tempEl.textContent = "Temp: " + dayWeather.temp.day + " °F";
        tempEl.classList = "card-body text-center";
        weatherForecastEl.appendChild(tempEl);

        var humidityEl = document.createElement('span');
        humidityEl.textContent = "Humidity: " + dayWeather.humidity + "%";
        humidityEl.classList = "card-body text-center";
        weatherForecastEl.appendChild(humidityEl);

        forecastDisplayEl.appendChild(weatherForecastEl);
    }
};

var previousSearchHandler = function(event) {
    var city = event.target.getAttribute('data-city');
    if (city) {
        getCurrentWeather(city);
    }
};

userFormEl.addEventListener("submit", searchedCity);
previousCityEl.addEventListener("click", previousSearchHandler);
loadPrevious();