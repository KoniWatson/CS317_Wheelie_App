"use strict";

function loadWeatherByLocation() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var obj = JSON.parse(this.responseText);
        var currentWeather = obj.current.temperature;
        var windSpeed = obj.current.wind_speed;
        var precipitation = obj.current.precip;
        var image_source = obj.current.weather_icons;
        var longtitude = obj.location.lon;
        var latitude = obj.location.lat;
        document.getElementById("temperature").innerHTML = 'It is currently'+'\n' + currentWeather  + '\u00B0C';
        document.getElementById("windSpeed").innerHTML = 'The wind speed is'+'\n' +  windSpeed  + 'km/hr';
        document.getElementById("precipitation").innerHTML = 'The precipitation level is'+'\n' + precipitation  + 'mm';
        document.getElementById("weather_image").src = image_source;
        weatherMap.updatePosition(longtitude, latitude);
      }
      
    };

    var city = document.getElementById("city").value;
      xhttp.open("GET", "https://weatherstack-proxy.azurewebsites.net/api/weatherstack/current?access_key=ddac5332c8addd0de83308fec6527eba&query="+city, true);
      xhttp.send();
      

}

function loadCurrentLocationWeather(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(loadDetails);
    }else{
      
        var x = document.getElementById("temperature");
        x.innerHTML = "Geolocation is not supported by this browser."; //TODO: change to device?
    }
};


function loadDetails(position){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var obj = JSON.parse(this.responseText);
        var currentWeather = obj.current.temperature;
        var windSpeed = obj.current.wind_speed;
        var precipitation = obj.current.precip;
        var image_source = obj.current.weather_icons;
        document.getElementById("temperature").innerHTML = 'It is currently'+'\n' + currentWeather  + '\u00B0C';
        document.getElementById("windSpeed").innerHTML = 'The wind speed is'+'\n' +  windSpeed  + 'km/hr';
        document.getElementById("precipitation").innerHTML = 'The precipitation level is'+'\n' + precipitation  + 'mm';
        document.getElementById("weather_image").src = image_source;
      }
      
    };

   
    var latitude = position.coords.latitude;
    var longtitude = position.coords.longitude;
    xhttp.open("GET", "https://weatherstack-proxy.azurewebsites.net/api/weatherstack/current?access_key=ddac5332c8addd0de83308fec6527eba&query="+latitude +','+longtitude, true);
    xhttp.send();
    weatherMap.updatePosition(longtitude, latitude);
}

let weatherMap = new MapModel();
weatherMap.init('weather-map');

