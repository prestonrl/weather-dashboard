var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector('#city');
var pastCityBtnEl = document.querySelector('#previous-cities')
var cities = [];


var searchedCity = function(event){
    event.preventDefault();
    var currentCity = cityInputEl.value.trim();
    //console.log(currentCity);

    if (currentCity) {
        cities.push(currentCity);
        cityInputEl.value = "";
        saveCity();
    }
    else {
        alert("Please enter a city before searching");
    }
};

var saveCity = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var loadPrevious = function() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    for (i = 0; i < cities.length; i++) {
        previousSearch(cities[i]);
    }
}

var previousSearch = function(pastCity) {
    console.log(pastCity);
    pastCityEl = document.createElement("button");
    pastCityEl.textContent = pastCity;
    pastCityEl.classList = "d-flex w-100 btn-light barder p-2";
    pastCityEl.setAttribute("data-city", pastCity);
    pastCityEl.setAttribute("type", "submit");

    pastCityBtnEl.prepend(pastCityEl);
}


userFormEl.addEventListener("submit", searchedCity);
loadPrevious();