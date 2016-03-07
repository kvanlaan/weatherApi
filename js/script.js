console.log("hello")
console.log($)
    ///global variables
var apiKey = "08436633d268865567452ff70c3673ea/"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey

var lat = "29.7604"
var lon = "95.3698"
var fullUrl = baseUrl + lat + "," + lon
var date = new Date()
var inputEl = document.querySelector("input"),
    containerEl = document.querySelector("#container"),
    currently = document.querySelector('#buttons button[value="currently"]'),
    daily = document.querySelector('#buttons button[value="daily"]'),
    hourly = document.querySelector('#buttons button[value="hourly"]')
    //container attachment to HTML sheet 
    // ----------- Functions -------------- //
var currentHtml = function(jsonData) { 
    var htmlString = ""
    htmlString += "Current Weather"
    htmlString += "<p>" + jsonData.currently.apparentTemperature + "C" + "</p>"
    htmlString += "<p>" + jsonData.currently.summary + "</p>"
    htmlString += "<p>" + date + "</p>"
    return htmlString
    console.log(htmlString)
}

///changview
var changeView = function(event) {
    var buttonEl = event.target, 
        currentQuery = location.hash.split('/')[1] 
    location.hash = buttonEl.value + '/' + currentQuery 
}

///daily
var dailyHtml = function(jsonData) { 
        htmlString = ""
        var newArr = jsonData.daily.data
        for (var i = 0; i < 5; i++) { 
            var obj = newArr[i]
            htmlString += "Day " + i + " Weather"
            htmlString += "<p>" + obj.apparentTemperatureMax + "C" + "</p>"

        }
        return htmlString
    }
//hourly
var hourlyHtml = function(jsonData) { //We want to iterate over the array data, using it to build an htmlString that we will output.
        // Initializes the empty string of HTML that we will build. 
        htmlString = ""
        var newArr = jsonData.hourly.data
        for (var i = 0; i < 5; i++) { //We'll only use the first five images.
            var obj = newArr[i]
            htmlString += "Hour " + i + " Weather"
            htmlString += "<p>" + obj.apparentTemperature + "C" + "</p>"
        }
        htmlString += "<p>" + date + "</p>"
        return htmlString
    }
    // geolocation
window.onload = function() {
        var startPos
        var geoSuccess = function(position) {
            startPos = position
            lat = startPos.coords.latitude
            lon = startPos.coords.longitude
        }
        navigator.geolocation.getCurrentPosition(geoSuccess)

        fullUrl
    }
    ///activate the search funciton
var handleUserInput = function(keyEvent) {
        var inputEl = document.querySelector("input")

        if (keyEvent.keyCode === 13) {
            var inputEl = keyEvent.target
            var query = inputEl.value
            location.hash = query
            inputEl.value = ""
            fullUrl = baseUrl + query
        }
        return fullUrl
    }
    ///
var hashController = function() { 
        var route = window.location.hash.substring(1) 
        var routeParts = route.split('/'),
            viewType = routeParts[0], 
            currentQuery = routeParts[1] 
        if (viewType === "currently") {
            renderCurrentView(currentQuery)
           
        }
        if (viewType === "daily") {
            renderDailyView(currentQuery)

        }
        if (viewType === "hourly") {
            renderHourlyView(currentQuery)
        }

    }
    ///
var renderCurrentView = function(query) { 

        var paramObj = { 
            q: query,
            api_key: apiKey
        }
        var weatherPromise = $.getJSON(fullUrl, paramObj)
        var handleData = function(jsonData) { 
            console.log(jsonData)
            containerEl.innerHTML = currentHtml(jsonData) 
        }
        weatherPromise.then(handleData) //Once the data has been retrieved, our promise will run our handleData function
    }
    // ----------- Event Listeners -------------- //

var renderDailyView = function(query) { 

        var paramObj = { 
            q: query,
            api_key: apiKey
        }
        var weatherPromise = $.getJSON(fullUrl, paramObj) 
        var handleData = function(jsonData) { 
            console.log(jsonData)
            containerEl.innerHTML = dailyHtml(jsonData) 
        }
        weatherPromise.then(handleData) 
    }
    ///


var renderHourlyView = function(query) { 
        var paramObj = { 
            q: query,
            api_key: apiKey
        }
        var weatherPromise = $.getJSON(fullUrl, paramObj) 
        var handleData = function(jsonData) { 
            console.log(jsonData)
            containerEl.innerHTML = hourlyHtml(jsonData)
        }
        weatherPromise.then(handleData) 
    }
    // ----------- Event Listeners -------------- //
window.addEventListener("hashchange", hashController)
currently.addEventListener("click", changeView)
daily.addEventListener("click", changeView)

hourly.addEventListener("click", changeView)
    // ----------- Kick things off! -------------- //
inputEl.addEventListener("keydown", handleUserInput)
hashController()

