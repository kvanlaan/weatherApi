console.log("hello")
console.log($)

//date


var date = new Date()

var getDayOfWeek = new Date() 
var today = getDayOfWeek.getDay()

//object to be used to designate day for daily view
var week = {
        1: "Monday",
        2: "Tuesday", 
        3: "Wednesday", 
        4: "Thursday",
        5: "Friday", 
        6: "Saturday",
        7: "Sunday",
}


//queryselectors
var inputEl = document.querySelector("input"),
    containerEl = document.querySelector("#container"),
    currently = document.querySelector('#buttons button[value="currently"]'),
    daily = document.querySelector('#buttons button[value="daily"]'),
    hourly = document.querySelector('#buttons button[value="hourly"]')

// Functions in alphabetical order//

///changeview, making sure the buttons work
var changeView = function(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		lat = routeParts[1],
		lon = routeParts[2]

	var buttonEl = clickEvent.target,
	newView = buttonEl.value
	location.hash = newView + "/" + lat + "/" + lon
}
///making the different htmlstrings///
var currentHtml = function(jsonData) { 
        var htmlString = ''
        htmlString = '<div class="cityContainer"><p>Current Forecast</p></div><div class="current">' + jsonData.currently.temperature.toPrecision(2) + " &deg;F <h2> ~ " + jsonData.currently.summary + "~ <canvas id='currentSky' width='100' height='100'></canvas> </h2><h4>" + date + "</h4></div>"
        containerEl.innerHTML = htmlString
        var icons = jsonData.currently.icon
        doSkyconStuff(icons)
    }

///daily
var dailyHtml = function(jsonData) { 
            console.log(jsonData)
            var dayArray = jsonData.daily.data
            console.log(dayArray)
            var newHtmlString = '<div class="cityContainer"><p>7-Day Forecast</p></div>'

            for (var i = 0; i < dayArray.length; i++) {
                if (today < 7) {
                today += 1
                var day = dayArray[i]
                var iconString = day.icon
                console.log(iconString)
                newHtmlString += '<div class = "day"> <h1>' + week[today] + ' </h1> ' + day.apparentTemperatureMax.toPrecision(2) + '&deg; F <canvas class="daily" id="dailySky' + i + '"width="100" height="100" data-icon="' + iconString + '"></canvas></div>'

        } else { today = 0}
        
            }

            containerEl.innerHTML = newHtmlString


            var dailyIcons = document.querySelectorAll('canvas.daily')
            for (var i = 0; i < dailyIcons.length; i++) {
                var iconStuff = dailyIcons[i].dataset.icon
                doSkyconStuff(iconStuff, i)
            }
        }

//Skycons--animated weather icons corresponding to icon provided by forecast.io

var doSkyconStuff = function(iconString, iconNumber) {

    console.log(iconString)
    var formattedIcon = iconString.toUpperCase().replace(/-/g, "_")

    var skycons = new Skycons({ "color": "pink" });
    // on Android, a nasty hack is needed: {"resizeClear": true}

    // you can add a canvas by it's ID...
    skycons.add("currentSky", Skycons[formattedIcon]);
    //adding all the Daily Sky Ids
    skycons.add("dailySky" + iconNumber, Skycons[formattedIcon]);
    skycons.add("hourlySky", Skycons[formattedIcon]);

    // start animation!
    skycons.play();
}

///geolocation
var handleDefault = function() {
        var geoSuccess = function(positionObject) {
        var lat = positionObject.coords.latitude
        var lon = positionObject.coords.longitude
	location.hash = "currently/" + lat + "/" + lon

        }
        navigator.geolocation.getCurrentPosition(geoSuccess)
}
///activate the search funciton
var handleUserInput = function(keyEvent) {
        var inputEl = document.querySelector("input")
        if (keyEvent.keyCode === 13) {
            var inputEl = keyEvent.target
            var query = inputEl.value

    var route = window.location.hash.substr(1)
    var routeParts = route.split('/')
    var viewType = routeParts[0]
    var queryParts = query.split(','),
        lat = queryParts[0],
        lon = queryParts[1]
    window.location.hash = "currently/" + lat + "/" + lon 
    }
}
///
var hashController = function() { 
        var route = window.location.hash.substring(1) 
        var routeParts = route.split('/'),
            viewType = routeParts[0], 
            lat = routeParts[1], 
            lon = routeParts[2]
        if (viewType === "") {
        	handleDefault() 	
        }
        if (viewType === "currently") {
            renderCurrentView(lat, lon)
        }
        if (viewType === "daily") {
            renderDailyView(lat, lon)
        }
        if (viewType === "hourly") {
            renderHourlyView(lat,lon)
        }
    }
//hourlyhtml
var hourlyHtml = function(jsonData) {
      
        var hourArray = jsonData.hourly.data
        var newHtmlString = '<div class="cityContainer"><p>Hourly Forecast</p></div>'
        for (var i = 0; i < 24; i++) {
            var hour = hourArray[i]
            newHtmlString += '<div class = "hour"><h1> Hour ' + (i + 1) + ' </h1> ' + hour.apparentTemperature.toPrecision(2) + '&deg; F </div>'
        }
        containerEl.innerHTML = newHtmlString
    }

///promisemaker
var makePromise = function(lat,lon) { 
		var fullUrl = baseUrl + lat + "," + lon + "?callback=?"
        var promise = $.getJSON(fullUrl)
     	return promise 
    }
///rendering(gettingthepromise)
//current
var renderCurrentView = function(lat,lon) { 
      var promise = makePromise(lat,lon)
      promise.then(currentHtml)
    }

var renderDailyView = function(lat,lon) { 
     var promise = makePromise(lat,lon)
      promise.then(dailyHtml)
    }
///
var renderHourlyView = function(lat,lon) { 
      var promise = makePromise(lat,lon)
      promise.then(hourlyHtml)
    }
// ----------- Event Listeners -------------- //
window.addEventListener("hashchange", hashController)
currently.addEventListener("click", changeView)
daily.addEventListener("click", changeView)
hourly.addEventListener("click", changeView)
inputEl.addEventListener("keydown", handleUserInput)


//
var apiKey = "95dd0186251e48c64682d50d1e64004c/"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey

//
// ----------- Kick things off! -------------- //
hashController()
