var icon = {
    'clear-day': 'wi-day-sunny',
    'clear-night': 'wi-night-clear',
    'rain': 'wi-rain',
    'snow': 'wi-snow',
    'wind': 'wi-strong-wind',
    'fog': 'wi-fog',
    'cloudy': 'wi-cloudy',
    'partly-cloudy-day': 'wi-day-cloudy',
    'partly-cloudy-night': 'wi-night-alt-cloudy'
}
var currentData = {
    temp: 'null',
    summary: 'null'
}

function updateCurrentWeather(address) {
    var locationData = makeGoogleCall(address);
    locationData.success(function(data) {
        var Geo = [];
        Geo.push(data.results[0].geometry.location.lat);
        Geo.push(data.results[0].geometry.location.lng);
        var uri = "https://api.forecast.io/forecast/" + config.weather.apikey + "/" + Geo[0] + "," + Geo[1];
        $.getJSON(uri + "?callback=?", function(data) {
            //console.log(data);
            if (config.weather.units === "metric") {
                var currentTemp = toCelsius(data.currently.temperature);
                var units = "&#8451"
            } else {
                var currentTemp = data.currently.temperature;
                var units = "&#8457"
            }
            //console.log("From json " + data.currently.icon);
            //console.log("From table" + icon[data.currently.icon])
            if (icon[data.currently.icon] == null) {
                var iconTag = "<i class=\"wi wi-na\"></i>";
            } else {
                var iconTag = "<i class=\"wi " + icon[data.currently.icon] + "\"></i>";
            }
            if (currentData.summary.localeCompare(data.hourly.summary)!=0) {
                currentData.summary = data.hourly.summary;
                updateText(document.getElementById('daySummary'), currentData.summary)
            }
            
            if (currentData.temp.localeCompare(Math.round(currentTemp) + units) != 0) {
                currentData.temp = Math.round(currentTemp) + units;
                //console.log("currentTemp " + currentData.temp);
                updateText(document.getElementById('Temp'), Math.round(currentTemp) + units);
            }
            if (document.getElementById('wIcon').innerHTML != iconTag) {
                updateText(document.getElementById('wIcon'), iconTag);
            }
            //console.log("INNER HTML FOR TEMP" + document.getElementById('Temp').innerHTML)
                //document.getElementById('wIcon').innerHTML = iconTag;
        });
        //Geo.push(data.results[0].geometry.location.lat);
        //Geo.push(data.results[0].geometry.location.lng);
    });
}

function weather_init() {
    //console.log("IN INIT");
    updateCurrentWeather(config.weather.location)
    window.setInterval(function() {
        updateCurrentWeather(config.weather.location)
    }, (config.weather.refreshTime) * 60000 || 1800000);

}