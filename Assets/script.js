var currentDate = document.querySelector('.current-date-time');
var cityNameInput = document.querySelector('#city-srch');
var searchBtn = document.querySelector('#city-button');
var historyLog = document.querySelector('.search-history');
var weatherData = document.querySelector('.weather-info-container');
var fiveDayTitle = document.querySelector('.five-forecast-title');
var fiveDayForecast = document.querySelector('.five-day-forecast-container');

//functionality for city name entry/input
var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityNameInput.value;
 
    if (cityName) {
        getCityWeather(cityName);
        weatherData.textContent = '';
        cityNameInput.value = '';
    } else {
        alert('Please enter a city name');
    }
};

//functionality for saving city searches into local storage & printing search history
var saveHistory = document.getElementById('city-srch').value = localStorage.setItem('c-search', cityNameInput.value);
console.log(localStorage);

var getHistory = document.getElementById('city-srch').value = localStorage.getItem('c-search', cityNameInput.value);
console.log(getHistory);

var displayHistory = function(getHistory) {
    var cityHistory = getHistory
    var cityHistoryEl = document.createElement('button');
    cityHistoryEl.setAttribute('class', 'historyStyling')
    cityHistoryEl.textContent = cityHistory
    historyLog.append(cityHistoryEl)
}
//event listeners for search button
searchBtn.addEventListener('click', function() {
    saveHistory();
    displayHistory();
    console.log(cityNameInput.value)
})
    
//functionality for displaying weather API data 
var renderInfo = function(response) {
    //functionality for name display
    var name = response.name;
    var nameEl = document.createElement('h1');
    nameEl.setAttribute('class', 'nameStyling')
    nameEl.textContent = name  
    weatherData.append(nameEl)
    //functionality for icon display
    var icon = response.weather[0].icon;
    var iconEl = document.createElement('img');
    var iconSource = 'http://openweathermap.org/img/w/' + icon + '.png'
    iconEl.setAttribute('src', iconSource)
    iconEl.setAttribute('class', 'iconStyling')
    nameEl.append(iconEl)
    //functionality for temperature display converted to fahrenheit
    var newTemp = parseInt((response.main.temp - 273.15) * (9/5) + 32);
    var tempEl = document.createElement('div');
    tempEl.setAttribute('class', 'tempStyling')
    tempEl.textContent = 'Current Temperature: ' + newTemp + ' ° Fahrenheit'
    weatherData.append(tempEl)
    //functionality for humidity display
    var humidity = response.main.humidity;
    var humidityEl = document.createElement('div');
    humidityEl.setAttribute('class', 'humidityStyling')
    humidityEl.textContent = 'Humidity: ' + humidity + ' %'
    weatherData.append(humidityEl)
    //functionality for wind speed display 
    var windSpeed = response.wind.speed;
    var windEl = document.createElement('div');
    windEl.setAttribute('class', 'windStyling')
    windEl.textContent = 'Wind Speed: ' + windSpeed + ' MPH'
    weatherData.append(windEl)
}

//functionality for fetching per city data with weather & one call API
var getCityWeather = function (cityName) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' 
    var apiFetch = apiUrl + cityName + '&appid=f418636e440eb4ee212eff9d9e946a98'
  
    fetch(apiFetch)
        .then(function(response) {
            return response.json();
        }).then(function(response) {
            console.log(response)
            lat = response.coord.lat
            lon = response.coord.lon
            renderInfo(response) 

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=f418636e440eb4ee212eff9d9e946a98`)
                .then(function(response) {
                    return response.json();
                }).then(oneCall => {
                console.log(oneCall)
                renderFiveDay(oneCall)
            })
        }) 
    };

//functionality for displaying uv-index & five day forecast API data
var renderFiveDay = function(oneCall) {
    fiveDayForecast.innerHTML = ''
    //functionality for uv-index display 
    var uvIndex = oneCall.current.uvi;
    var uvIndexEl = document.createElement('div');
    uvIndexEl.setAttribute('class', 'uviStyling')
    uvIndexEl.textContent = 'UV Index: ' + uvIndex
    weatherData.append(uvIndexEl)
    //functionality for color-coding uv-index based on scale & risk 
    if (uvIndex <= 4) {
        uvIndexEl.classList.add('low-risk');
    } else if (uvIndex >= 5 && uvIndex < 7 ) {
        uvIndexEl.classList.add('mod-risk');
    } else {
        uvIndexEl.classList.add('high-risk')
    }
    //creating title for five day forecast cards
    var forecastTitle = document.createElement('h2')
    forecastTitle.textContent = "5 Day Weather Conditions"
    fiveDayTitle.innerHTML = ''
    fiveDayTitle.append(forecastTitle)
    //functionality for displaying five day forecast cards
    //for loop to print items on each card
    for (var i = 1; i < 6; i++) {
        //creating daily card element 
        var dailyWeatherCard = document.createElement('div');
        dailyWeatherCard.setAttribute('class', 'daily-card')
        fiveDayForecast.append(dailyWeatherCard)
        //functionality for date display
        var dayDate = moment.unix(oneCall.daily[i].dt).format('MMMM Do, YYYY')
        var dayDateEl = document.createElement('h3');
        dayDateEl.setAttribute('class', 'date-styling')
        dayDateEl.textContent = dayDate
        dailyWeatherCard.append(dayDateEl)
        //functionality for icon display
        var dayIcon = oneCall.daily[i].weather[0].icon;
        var dayIconEl = document.createElement('img');
        var dayIconSource = 'http://openweathermap.org/img/w/' + dayIcon + '.png'
        dayIconEl.setAttribute('src', dayIconSource)
        dayIconEl.setAttribute('class', 'icon-styling')
        dailyWeatherCard.append(dayIconEl)
        //functionality for temperature display
        var dayTemp = parseInt((oneCall.daily[i].temp.day - 273.15) * (9/5) + 32);
        var dayTempEl = document.createElement('div');
        dayTempEl.setAttribute('class', 'temp-styling')
        dayTempEl.textContent = 'Temp: ' + dayTemp + ' ° F'
        dailyWeatherCard.append(dayTempEl)
        //functionality for humidity display 
        var dayHumidity = oneCall.daily[i].humidity;
        var dayHumidityEl = document.createElement('div');
        dayHumidityEl.setAttribute('class', 'humidity-styling')
        dayHumidityEl.textContent = 'Humidity: ' + dayHumidity + ' %'
        dailyWeatherCard.append(dayHumidityEl)
        //functionality for wind speed display
        var dayWind = oneCall.daily[i].wind_speed; 
        var dayWindEl = document.createElement('div');
        dayWindEl.setAttribute('class', 'wind-styling')
        dayWindEl.textContent = 'Wind Spd: ' + dayWind + ' MPH'
        dailyWeatherCard.append(dayWindEl)
    }
}

//functionality for current date & time w/ moment 
var date = moment().format('MMMM Do, YYYY')
var dateEl = document.createElement('h3');
dateEl.setAttribute('class', 'dateStyling')
dateEl.textContent = date 
currentDate.append(dateEl)
// console.log(date)

var time = moment().format('h:mm a')
var timeEl = document.createElement('h3');
timeEl.setAttribute('class', 'timeStyling')
timeEl.textContent = time
currentDate.append(timeEl)

//functionality for button click, click for displaying weather data and saving to local storage 
  searchBtn.onclick = formSubmitHandler;
