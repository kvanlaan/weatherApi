//test logging to the console
console.log("hello")
console.log($)

//Getting Date
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

// Functions in alphabetical order//

///Changes the `view` segment of the route in accordance with the button clicked
var changeView = function(clickEvent) { //Function takes a clickEvent as input, as changeView will be set up as the event handler for
        // click events inside the buttons' container 
        var route = window.location.hash.substr(1), ////obtain current route, since we need to know what the old
            // lat and lng were before we rewrite the hash.
            routeParts = route.split('/'), ///split to get variables for later use// 
            lat = routeParts[1],
            lon = routeParts[2]

        var buttonEl = clickEvent.target, //Which of our three buttons was clicked? the event's target denotes the DOM node where the event took place.
            newView = buttonEl.value //Each button has a "value" attribute which mirrors the name of the intended view (see HTML)
        location.hash = newView + "/" + lat + "/" + lon //Reset location.hash to reflect newView, triggering//
            // a hashevent which will invoke the Router function//
    }

//Create Html Strings and to append to innerHtml for differnt views
//current view
var htmlCurrent = function(jsonData) { //create html string with data obtained from jsonData object//
    var htmlString = ''
    htmlString = '<div class="cityContainer"><p>Current Forecast</p></div><div class="current">' + jsonData.currently.temperature.toPrecision(2) + " &deg;F <h2> ~ " + jsonData.currently.summary + "~ <canvas id='currentSky' width='100' height='100'></canvas> </h2><h4>" + date + "</h4></div>"
    containerEl.innerHTML = htmlString //change innerHtml of container div//
    var icons = jsonData.currently.icon
    doSkyconStuff(icons)
}

///daily view
var htmlDaily = function(jsonData) { //create html string with data obtained from jsonData object//
    console.log(jsonData)
    var dayArray = jsonData.daily.data
    console.log(dayArray)
    var newHtmlString = '<div class="cityContainer"><p>7-Day Forecast</p></div>'

    for (var i = 0; i < dayArray.length - 1; i++) {  //create for loop to obtain 7 days of weather//
        if (today < 7) {
            today += 1

        } else { today = 1 }
        var day = dayArray[i]
        var iconString = day.icon
        console.log(iconString)
        newHtmlString += '<div class = "day"> <h1>' + week[today] + ' </h1> ' + day.apparentTemperatureMax.toPrecision(2) + '&deg; F <canvas class="daily" id="dailySky' + i + '"width="100" height="100" data-icon="' + iconString + '"></canvas></div>'



    }

    containerEl.innerHTML = newHtmlString //change innerHtml of container div//


    var dailyIcons = document.querySelectorAll('canvas.daily')
    for (var i = 0; i < dailyIcons.length; i++) {
        var iconStuff = dailyIcons[i].dataset.icon
        doSkyconStuff(iconStuff, i)
    }
}

//hourly view
var htmlHourly = function(jsonData) { //create html string with data obtained from jsonData object//
    var hourArray = jsonData.hourly.data
    var newHtmlString = '<div class="cityContainer"><p>Hourly Forecast</p></div>'
    for (var i = 0; i < 24; i++) { //create for loop to obtain 24 hours of weather//
        var hour = hourArray[i]
        newHtmlString += '<div class = "hour"><h1> Hour ' + (i + 1) + ' </h1> ' + hour.apparentTemperature.toPrecision(2) + '&deg; F </div>'
    }
    containerEl.innerHTML = newHtmlString //change innerHtml of container div//
}

//end of html functions

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

//Geolocation--when page is first loaded, will prompt the user for their location
var handleDefault = function() {
        var geoSuccess = function(positionObject) {
            var lat = positionObject.coords.latitude
            var lon = positionObject.coords.longitude
            location.hash = "currently/" + lat + "/" + lon

        }
        navigator.geolocation.getCurrentPosition(geoSuccess)
    }
    //handling the search input and changing the location.hash accordingly
var handleUserInput = function(keyEvent) {
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

//Router function//controls everything on page//Is activated by the Hashchange event//
var hashController = function() { // Will read the hash and invoke the proper function
    ///route is url after the hash, tells us location within app
    var route = window.location.hash.substring(1) //obtain current route// substr deletes"#" sign
    var routeParts = route.split('/'), ///split the string into an array using "/" as separator
        viewType = routeParts[0], //viewType is obtained as it comprises the first part of route, therefore index 0
        lat = routeParts[1], //latitude is obtained as it comprises the 2nd part of route, therefore index 1
        lon = routeParts[2] //longitude is obtained as it comprises the 2nd part of route, therefore index 2
        //Create a series of if statements to set up different views// 
    if (viewType === "") {
        handleDefault()
            //if there is no current route, we will create a new route, where the view is currentView
            // and where lat and long are populated by navigator.geolocator.getCurrentPosition(). the resulting hashchange
            // will trigger the controller to run again.
            // i.e., handleDefault doesn't really do anything. it just writes a new route, which will case the router to run again. 
            // that new route will always be "#current/<currentLat>/<currentLong>"

    }
    if (viewType === "currently") {
        renderCurrentView(lat, lon) //invokes function which obtains jsonData for current weather based on latitude and longitude extracted from route and renders that data to the container 

    }
    if (viewType === "daily") {
        renderDailyView(lat, lon) //invokes function which obtains jsonData for daily weather based on latitude and longitude extracted from route and renders that data to the container
    }
    if (viewType === "hourly") {
        renderHourlyView(lat, lon) //invokes function which obtains jsonData for hourly weather based on latitude and longitude extracted from route and renders that data to the container
    }
}



//creating Promise based on correctly formatted url structure
var makePromise = function(lat, lon) {
        //create the url for promise with newly procured latitude and longitude variables
        var fullUrl = baseUrl + lat + "," + lon + "?callback=?" //"?callback=?" is hack cross-origin requests to work in chrome. (e.g. github.io is a different origin than forecast.io)
        var promise = $.getJSON(fullUrl)
        return promise
    }
    ///rendering(gettingthepromise)
    //current
var renderCurrentView = function(lat, lon) {
    var promise = makePromise(lat, lon)
    promise.then(htmlCurrent)
}

var renderDailyView = function(lat, lon) {
        var promise = makePromise(lat, lon)
        promise.then(htmlDaily)
    }
    ///
var renderHourlyView = function(lat, lon) {
        var promise = makePromise(lat, lon)
        promise.then(htmlHourly)
    }
 

//queryselectors
var inputEl = document.querySelector("input"),
    containerEl = document.querySelector("#container"),
    currently = document.querySelector('#buttons button[value="currently"]'),
    daily = document.querySelector('#buttons button[value="daily"]'),
    hourly = document.querySelector('#buttons button[value="hourly"]')

       // ----------- Event Listeners -------------- //
window.addEventListener("hashchange", hashController)
    // Add hashchange event so that the router function will be invoked whenever the hash changes//
    //Hashchange events are what give the router(or controller functions in general) so much power//
currently.addEventListener("click", changeView)
daily.addEventListener("click", changeView)
hourly.addEventListener("click", changeView)
inputEl.addEventListener("keydown", handleUserInput)




//--global variables--//
var apiKey = "95dd0186251e48c64682d50d1e64004c/"
var baseUrl = "https://api.forecast.io/forecast/" + apiKey

//
// ----------- Kick things off! -------------- //
hashController()
    // navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
