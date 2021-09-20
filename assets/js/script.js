const WEATHERDASHBOARD_KEY = "weather_dashboard";
var oneCallAPIKey = '9234bf92e34e7602754600bc3607c0dc';
var googleAPIKey = 'AIzaSyCfm9Ok_M-qzamFmAAcDIVFNVKKTjpRvis';
var cityLocation;
var cityName;
var currentWeather;
var daily;
var searchCity;
var dateToday = moment().toDate()
var theDate =moment(dateToday).format('MM/DD/YYYY');
var currentCityEl = document.getElementById(cityDate);
var iconPath = "http://openweathermap.org/img/wn/";
var cities = getData();
var cityInfo;
var isNew;
var getCity;
var title =document.getElementById('cityDate');

$('#btnSubmit').click(function(ev){
    ev.preventDefault();
    $('.iconImage').remove();
    let cityNfo =(document.getElementById('search').value);
    var copies = 0
    //check for dupe
    for(let i=0; i < cities.length; i++){
        if(cities[i] == cityNfo) {
            copies++;
        }
    }
    if(copies > 0) {
        (!isNew);
    } else {
        (isNew);
    }

    getCity(document.getElementById('search').value, true);
    let newButton = $(document.createElement("button"));
    newButton.text(cityNfo);
    newButton.addClass("w3-button w3-round btnCity");
    $('#btnHolder').append(newButton);
    newButton.click(function(ev){
        $('.iconImage').remove();
        ev.preventDefault();
        getCity(newButton.text(), false);
    });

});

//Load Buttons
for(var i=0; i < cities.length; i++){
    let cityButton = $(document.createElement("button"));
    cityButton.text(cities[i]);
    cityButton.addClass("w3-button w3-round btnCity");
    $('#btnHolder').append(cityButton);
    cityButton.click(function(ev){
        $('.iconImage').remove();
        ev.preventDefault();
        getCity(cityButton.text(), false);
    });
}
function getCity(searchCity, newCity){
    //get city name for current box
    console.log(searchCity);
    cityInfo = searchCity.split(",");
    cityName = cityInfo[0];
    state = cityInfo[1];
    console.log(cityName);

    fetch('https://maps.googleapis.com/maps/api/geocode/json?key=' + googleAPIKey +'&address='+ searchCity)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(cityData) {
                cityLocation = (cityData.results[0].geometry.location);
                console.log(cityLocation);
                getWeather(newCity);
            });
        } else {
            alert("Something went wrong.  Please try again");
        }
    })
    .catch(function(error) {
        alert("Unable to complete City Search function")
    });
}

function getWeather(newCity){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLocation.lat +'&lon=' + cityLocation.lng +'&units=imperial&excludeminutely,alerts&appid=' + oneCallAPIKey)
    .then(function(response){
        console.log(response);
        return response.json();
    }).then(function(weatherData){
        currentWeather = (weatherData.current);
        daily = weatherData.daily;
        console.log(weatherData);
        console.log(currentWeather);
        console.log(currentCity);
        populate(newCity);
    })
}

function populate(newCity) {
    //Current City
    var cityProperName = cityName.toUpperCase();
    var uvIn = currentWeather.uvi;
    var iconCurrent = currentWeather.weather[0].icon;
    $('#titleInfoText').text(cityProperName + " " + theDate);
    var currentIcon = $(document.createElement('img'));
    currentIcon.attr('src', iconPath + iconCurrent + ".png");
    currentIcon.addClass("iconImage");
    $('#cityDateSpan').append(currentIcon);
    $('#currentTemp').text("Temp: " + currentWeather.temp +String.fromCharCode(176) + "F");
    $('#currentWind').text("Wind: " + currentWeather.wind_speed + " MPH");
    $('#currentHumidity').text("Humidity: " + currentWeather.humidity + "%");
    var uvEl = $('#currentUV');
    uvEl.text(uvIn);
    if(uvIn < 6) {
        uvEl.removeClass("uVModerate uVHigh").addClass("uVLow");
    } else if (uvIn <8){
        uvEl.removeClass("uVLow uVHigh").addClass("uVModerate")
        } else {
            uvEl.removeClass("uVLow uVModerate").addClass("uVHigh")
        }
    //5 Day Dates
    for(i=0; i < 5; i++){
        //Set Days Date
        var dateNfo = ("#dayDate" + [i]);
        var dateEl = moment();
        var nmbr = i;
        dateEl = dateEl.add(nmbr, "days");
        dateEl = dateEl.format("MM/DD/YY");
        $(dateNfo).text(dateEl);

        //Set Days Temp
        var tempNfo =("#dayTemp" + [i]);
        $(tempNfo).text(daily[i].temp.max +String.fromCharCode(176) + "F");

        //Set Days Wind
        var windNfo =("#dayWind" + [i]);
        $(windNfo).text(daily[i].wind_speed + " MPH");

        //Set Days Humidity
        var humidityNfo =("#dayHumidity" + [i]);
        $(humidityNfo).text(daily[i].humidity + " %");

        //set Days Icon
        var iconNfo = ("#dayIcon" + [i]);
        // var dayIcn = daily[i].weather[0].icon;
        var dayIcn ="10d";
        var dailyIcon = $(document.createElement('img'));
        dailyIcon.attr('srs', iconPath + dayIcn + ".png");
        dailyIcon.addClass("iconImage2");
        $(iconNfo).append(dailyIcon);
    }
    if(newCity) {
        saveData();
    }
    

}
function saveData() {
    cities.push(cityInfo);
    localStorage.setItem(WEATHERDASHBOARD_KEY, JSON.stringify(cities));
}

function getData() {
    var savedCity = localStorage.getItem(WEATHERDASHBOARD_KEY);
    if(!savedCity) {
        return [];
    }
    return JSON.parse(savedCity);
}














