//User input from form
$("#button-submit").click((event) => {
  event.preventDefault();

  var cityName = $("#location-input").val();

  var key = "2c227a7f49d0a229e5a38ad3634b45c9";
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;
  var urlQuery2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;

  //
  //

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
    var currentDate = moment().format("M/D/YY");
    var currentTemp = response.main.temp;
    var currentHumid = response.main.humidity;
    var windSpd = response.wind.speed;
    var wthIcon = response.weather[0].icon;
    var icon = "https://openweathermap.org/img/w/" + wthIcon + ".png";

    //rendering text and attributes
    //of the HTML elements
    $("#location").text(currentLoc);
    $("#loc-date").text(currentDate);
    $("#icon1").attr("src", icon);
    $("#temp").text(`Temperature: ${currentTemp}`);
    $("#humid").text(`Humidity: ${currentHumid}`);
    $("#wind-spd").text(`Wind Speed: ${windSpd} MPH`);

    //variables for lat and lon
    var lat = response.coord.lat;
    var lon = response.coord.lon;

    //
    /*---- ajax call for UV index ----*/
    //

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${key}`,
      method: "GET",
    }).then((r) => {
      console.log(r);
      var uvIndex = r.value;

      //rendering the UV index text and bg color
      $(".uv").text(uvIndex);
      //
      if (uvIndex >= 0 && uvIndex <= 2) {
        $(".uv").css("background-color", "green");
        $(".uv").css("color", "white");
      } else if (uvIndex >= 3 && uvIndex <= 5) {
        $(".uv").css("background-color", "yellow");
        $(".uv").css("color", "black");
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        $(".uv").css("background-color", "orange");
        $(".uv").css("color", "black");
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        $(".uv").css("background-color", "red");
        $(".uv").css("color", "white");
      } else if (uvIndex >= 11) {
        $(".uv").css("background-color", "violet");
        $(".uv").css("color", "white");
      }
    });
  });

  //
  /*---- ajax call for 5-day forecast ----*/
  //

  $.ajax({
    url: urlQuery2,
    method: "GET",
  }).then((val) => {
    //console.log(val);

    var data = val.list;

    for (var i = 0; i < data.length; i++) {
      //local variable declared to convert
      // unix timestamp to UTC time
      var time = moment(data[i].dt * 1000).format("H a");

      if (time === "6 am") {
        //
        //local variables to populate the text of the HTML document
        //convert the date from a unix timestamp
        var forDate = moment(data[i].dt_txt).format("M/D/YY");
        var forTemp = data[i].main.temp;
        var forHumid = data[i].main.humidity;
        var imgIcon = data[i].weather[0].icon;
        var forIcon = "https://openweathermap.org/img/w/" + imgIcon + ".png";

        //variable to populate the card content
        //using template literal
        var html = `
        <div class="card">
        <div class="card-body">
          <p class="for-date">${forDate}</p>
          <img src="${forIcon}" alt="weather icon" class="forecast-icon" />
          <p class="for-temp">Temp: ${forTemp}</p>
          <p class="for-humid"> Humidity: ${forHumid}</p>
        </div>`;

        //appending card to the HTML document
        $("#forecast-cards").append(html);
      }
    }
  });
  $("#location-input").val("");
});
