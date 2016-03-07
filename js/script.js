console.log("hello") 
console.log($) 

///

///time





//
///global variables
var apiKey = "08436633d268865567452ff70c3673ea"
var baseUrl = "https://api.forecast.io/forecast/"

var lat = "29.7604"
var lon = "95.3698"
var fullUrl = baseUrl + apiKey + "/" + lat + "," + lon
var date = new Date()

var containerEl = document.querySelector("#container"), 
	currently = document.querySelector('#buttons button[value="currently"]'), 
	daily = document.querySelector('#buttons button[value="daily"]')
	hourly = document.querySelector('#buttons button[value="hourly"]')
//container attachment to HTML sheet 
// ----------- Functions -------------- //
var currentHtml = function(jsonData) {  //We want to iterate over the array data, using it to build an htmlString that we will output.
	// Initializes the empty string of HTML that we will build. 
	var htmlString = ""
		htmlString += "Current Weather"
		htmlString += "<p>" + jsonData.currently.apparentTemperature + "C" + "</p>"
		htmlString += "<p>" + jsonData.currently.summary + "</p>"
		htmlString += "<p>" + date + "</p>"
	return htmlString
	console.log(htmlString)
}

///daily


var dailyHtml = function(jsonData) {  //We want to iterate over the array data, using it to build an htmlString that we will output.
	// Initializes the empty string of HTML that we will build. 
	htmlString = ""
	var newArr = jsonData.daily.data
		for(var i=0; i < 5; i++){ //We'll only use the first five images.
		var obj = newArr[i]
		htmlString += "Day " + i + " Weather"
		htmlString += "<p>" + obj.apparentTemperatureMax + "C" + "</p>"

}
return htmlString
}

//hourly


var hourlyHtml = function(jsonData) {  //We want to iterate over the array data, using it to build an htmlString that we will output.
	// Initializes the empty string of HTML that we will build. 
	htmlString = ""
	var newArr = jsonData.hourly.data
		for(var i=0; i < 5; i++){ //We'll only use the first five images.
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
////
var changeView = function(event) { // this function should change the hash depending on what button was clicked. we'll let the controller take it from there. 
	var buttonEl = event.target, // target = the node wherein the event occured
		currentQuery = location.hash.split('/')[1] // before we rewrite the hash, we want to make sure we preserve the query value from the pre-existing hash
		// Location.hash stores the text that comes after the # in the url. The split will separate the view type from the search term, storing the two of them in a short array. We want to locate the actual query word, which will be at index 1 in the array. Then this will be assigned to the variable currentQuery.
	location.hash = buttonEl.value + '/' + currentQuery // What we're changing is the view type, which was stored in the button's value attribute (check the html to verify this). After that, we tack on the old currentQuery that we read from the hash. 
}
var hashController = function(){ // Will read the hash and invoke the proper function
	var route = window.location.hash.substring(1) //route stores whatever comes after the # (but does not include the '#', because we substringed it out)
	var routeParts = route.split('/'), // We want to split "<view type>/<search word>" into an array, so that we can separate the view type from the search term and store them in separate variables. 
		viewType = routeParts[0], // Once we split into an array, viewType will be assigned to index 0, which is the button value/view type.
		currentQuery = routeParts[1] //Also from the array, currentQuery will now be assigned to index 1 which is the search word
	if (viewType === "currently") { 
		renderCurrentView(currentQuery)
		// this is the only one that actually does anything atm
	} 
	if (viewType === "daily") { 
		renderDailyView(currentQuery)
		// this is the only one that actually does anything atm
	} 
	if (viewType === "hourly") { 
		renderHourlyView(currentQuery)
		// this is the only one that actually does anything atm
	} 
} 	
var renderCurrentView = function(query) { //This function will run when the condition in our hashController function is met (so, when viewType === "scroll")
	
	var paramObj = { //This is what's' being passed through our url, and the url is being passed through our promise. The json library will do its thang. I.e. this object will be parsed into a parameter string of the form "?key=value&key2=value2..." and concatenated onto our baseUrl.
	    q: query,
	    api_key: apiKey
	}
	var weatherPromise = $.getJSON(fullUrl, paramObj) // Defining the promise. The baseUrl and paramObj will be passed through and json will make a request to the giphy api and return a promise that waits for that request to be fulfilled.
	var handleData = function(jsonData) { // This function will read the jsonData and use parts of it to write html into our container.
	    console.log(jsonData)
		containerEl.innerHTML = currentHtml(jsonData) //we add the .data because the array of gifs is stored on a .data property on the response object.
	}
	weatherPromise.then(handleData) //Once the data has been retrieved, our promise will run our handleData function
}
// ----------- Event Listeners -------------- //

var renderDailyView = function(query) { //This function will run when the condition in our hashController function is met (so, when viewType === "scroll")
	
	var paramObj = { //This is what's' being passed through our url, and the url is being passed through our promise. The json library will do its thang. I.e. this object will be parsed into a parameter string of the form "?key=value&key2=value2..." and concatenated onto our baseUrl.
	    q: query,
	    api_key: apiKey
	}
	var weatherPromise = $.getJSON(fullUrl, paramObj) // Defining the promise. The baseUrl and paramObj will be passed through and json will make a request to the giphy api and return a promise that waits for that request to be fulfilled.
	var handleData = function(jsonData) { // This function will read the jsonData and use parts of it to write html into our container.
	    console.log(jsonData)
		containerEl.innerHTML = dailyHtml(jsonData) //we add the .data because the array of gifs is stored on a .data property on the response object.
	}
	weatherPromise.then(handleData) //Once the data has been retrieved, our promise will run our handleData function
}
///


var renderHourlyView = function(query) { //This function will run when the condition in our hashController function is met (so, when viewType === "scroll")
	
	var paramObj = { //This is what's' being passed through our url, and the url is being passed through our promise. The json library will do its thang. I.e. this object will be parsed into a parameter string of the form "?key=value&key2=value2..." and concatenated onto our baseUrl.
	    q: query,
	    api_key: apiKey
	}
	var weatherPromise = $.getJSON(fullUrl, paramObj) // Defining the promise. The baseUrl and paramObj will be passed through and json will make a request to the giphy api and return a promise that waits for that request to be fulfilled.
	var handleData = function(jsonData) { // This function will read the jsonData and use parts of it to write html into our container.
	    console.log(jsonData)
		containerEl.innerHTML = hourlyHtml(jsonData) //we add the .data because the array of gifs is stored on a .data property on the response object.
	}
	weatherPromise.then(handleData) //Once the data has been retrieved, our promise will run our handleData function
}
// ----------- Event Listeners -------------- //
//
window.addEventListener("hashchange", hashController)
// The hashchange is a special event. The hashchange means that as soon as the words ater the # changes, the window will invoke a certain function, in this case the hashController.
currently.addEventListener("click",changeView) 
// Click is our event. When the scroll button is clicked the changeView function will be invoked. 
daily.addEventListener("click",changeView)
// Click again is our event. When the infoGrid button is clicked, the changeView function will yet again be invoked.

hourly.addEventListener("click",changeView)
// ----------- Kick things off! -------------- //
hashController() 
// If the page is being loaded for the first time, there is no hash*change* event! so, 
// in this example, we manually invoke the hashController on the first page load. this is not always
// the way things will happen.


