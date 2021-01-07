//Eventually chang this variable to mty string
//will take in user input
var cityName = "new orleans";
var key = "2c227a7f49d0a229e5a38ad3634b45c9";
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;
var urlQuery2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
  console.log(response.name);

  var currentLoc = response.name;
  var currentTemp = response.main.temp;
  var currentHumid = response.main.humidity;
  var windSpd = response.wind.speed;

  $("#location").text(currentLoc);
  $("#temp").text("Temperature: " + currentTemp);
  $("#humid").text("Humidity: " + currentHumid + "%");
  $("#wind-spd").text("Wind Speed: " + windSpd + " MPH");
});

$.ajax({
  url: urlQuery2,
  method: "GET",
}).then((val) => {
  console.log(val);

  var list = val.list;
  var dayArray = [];

  for (var i = 0; i < list.length; i++) {
    var converted = convertUnixTime(list[i].dt);

    if (converted === "6 AM") {
      dayArray.push(list[i]);
    }
  }

  console.log(dayArray);
});

function convertUnixTime(time) {
  var date = time * 1000;
  date = new Date(date);
  date = date.toLocaleString("en-US", { hour: "numeric" });
  return date;
}
