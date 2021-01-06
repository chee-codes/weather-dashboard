//Eventually chang this variable to mty string
//will take in user input
var cityName = "new orleans";
var key = "2c227a7f49d0a229e5a38ad3634b45c9";
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
  console.log(response.name);
  console.log(response.main.temp);

  var currentLoc = response.name;
  var currentTemp = response.main.temp;
  var currentHumid = response.main.humidity;
  var windSpd = response.wind.speed;
  console.log(windSpd);

  $("#location").text(currentLoc);
  $("#temp").text("Temperature: " + currentTemp);
  $("#humid").text("Humidity: " + currentHumid);
  $("#wind-spd").text("Wind Speed: " + windSpd);
});
