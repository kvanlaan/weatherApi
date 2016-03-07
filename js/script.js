console.log("hello")
console.log($)

//date
var date = new Date()

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
    var htmlString = ""
    htmlString += "<h1> Current Weather </h1>"
    htmlString += "<h2> " + jsonData.currently.apparentTemperature + " &deg;C " + " </h2>"
    htmlString += "<h3> " + jsonData.currently.summary + " </h3>"
    htmlString += "<p> " + date + " </p>"
    console.log(htmlString)
    containerEl.innerHTML = htmlString
}
///daily
var dailyHtml = function(jsonData) { 
        htmlString = "<h1> 7-Day Forecast </h1>"
        var newArr = jsonData.daily.data
        for (var i = 0; i < 7; i++) { 
            var obj = newArr[i]
            htmlString += "<h2> Day " + i + " Weather </h2>"
            htmlString += "<h2>" + obj.apparentTemperatureMax + " &deg;C" + "</h2>"

        }
        containerEl.innerHTML = htmlString
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
            location.hash = query
            inputEl.value = ""
           
        }
     var searchPromise = $.getJSON(fullUrl)
     searchPromise.then(handleData)
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
var hourlyHtml = function(jsonData) { //We want to iterate over the array data, using it to build an htmlString that we will output.
        // Initializes the empty string of HTML that we will build. 
        htmlString = "<h1> Hourly Forecast </h1>"
        var newArr = jsonData.hourly.data
        for (var i = 0; i < 5; i++) { //We'll only use the first five images.
            var obj = newArr[i]
            htmlString += "<h2> Hour " + i + " Weather </h2>"
            htmlString += "<h2>" + obj.apparentTemperature + " &deg;C " + "</h2>"
        }
        htmlString += "<p> " + date + " </p>"
        containerEl.innerHTML = htmlString
    }

///promisemaker
var makePromise = function(lat,lon) { 
		var fullUrl = baseUrl + lat + "," + lon 
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
