//User input from form
$("#button-submit").click((event) => {
  event.preventDefault();

  var cityName = $("#location-input").val();

  var key = "2c227a7f49d0a229e5a38ad3634b45c9";
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;
  var urlQuery2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;

  var recentSearch = [];
  var searchedLocations = {
    location: cityName,
  };

  searchList(recentSearch, cityName);

  function searchList(arr, input) {
    arr.push(input);
    for (var i = 0; i < arr.length; i++) {
      var srchLoc = arr[i];

      var p = $("<p>");
      p.addClass("src-cities");
      p.text(srchLoc);

      $("#cities-list").append(p);
    }
  }

  // Setting and getting local storage
  localStorage.setItem("location", JSON.stringify(searchedLocations));

  var recents = JSON.parse(localStorage.getItem("location"));

  //
  /*---- ajax call for current weather ----*/
  //

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var currentLoc = response.name;
    var currentTemp = response.main.temp;
    var currentHumid = response.main.humidity;
    var windSpd = response.wind.speed;
    var wthIcon = response.weather[0].icon;
    var icon = "https://openweathermap.org/img/w/" + wthIcon + ".png";

    $("#location").text(currentLoc);
    $("#icon1").attr("src", icon);
    $("#temp").text("Temperature: " + currentTemp);
    $("#humid").text("Humidity: " + currentHumid + "%");
    $("#wind-spd").text("Wind Speed: " + windSpd + " MPH");
  });

  //
  /*---- ajax call for 5-day forecast ----*/
  //

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
    //console.log(dayArray)
  });

  $("#location-input").val("");
});

function convertUnixTime(time) {
  var date = time * 1000;
  date = new Date(date);
  date = date.toLocaleString("en-US", { hour: "numeric" });
  return date;
}
