$(document).ready(function () {
  //
  //
  //? Global Variables

  var key = "2c227a7f49d0a229e5a38ad3634b45c9";
  // var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;
  // var urlQuery2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${key}`;
  var cityName = "";
  var cities = [];

  pageLoad();

  function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  $("#button-submit").click((event) => {
    event.preventDefault();

    cityName = $("#location-input").val().trim();

    if (cityName === "") {
      alert("Please enter a search location");
      return;
    }
    cities.push(cityName);
    $("#location-input").val("");

    if (cities.length >= 6) {
      cities.shift();
    }

    storeCities();
    renderCities();
    getWeather(cityName);
    // getFiveDay(cityName);
  });

  function pageLoad() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    if (savedCities !== null) {
      cities = savedCities;
    }
    renderCities();
    getWeather(cities[cities.length - 1]);
  }

  function renderCities() {
    $("#cities-list").empty();
    for (var i = 0; i < cities.length; i++) {
      var li = $("<li>");
      li.addClass("li-item list-group-item");
      li.attr("data-index", i);
      li.text(cities[i]);
      $("#cities-list").prepend(li);
    }
  }

  $(document).on("click", ".li-item", function () {
    var location = $(this).attr("data-index");
    getWeather(location);
  });

  /*---- ajax call for current weather ----*/
  function getWeather(location) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        location +
        "&units=imperial&appid=" +
        key,
      method: "GET",
    }).then(function (response) {
      //console.log(response);

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

      getFiveDay(lat, lon);
      getUvIndex(lat, lon);
      //console.log(getFiveDay(lat, lon));
    });
  }

  //
  /*---- ajax call for UV index ----*/
  //

  function getUvIndex(lat, lon) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        key,
      method: "GET",
    }).then((r) => {
      //console.log(r);
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
  }

  //
  /*---- ajax call for 5-day forecast ----*/
  //
  function getFiveDay(lat, lon) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`,
      method: "GET",
    }).then((res) => {
      //console.log(res);

      $("#forecast-cards").empty();

      for (var i = 1; i < 6; i++) {
        // console.log(moment(res.daily[i].dt * 1000).format("M/D/YY"));

        var forDate = moment(res.daily[i].dt * 1000).format("M/D/YY");
        var forTemp = res.daily[i].temp.max;
        var forHumid = res.daily[i].humidity;
        var imgIcon = res.daily[i].weather[0].icon;
        var forIcon = "https://openweathermap.org/img/w/" + imgIcon + ".png";

        var html = `
          <div class="card">
            <div class="card-body">
              <p class="for-date">${forDate}</p>
              <img src="${forIcon}" alt="weather icon" class="forecast-icon" />
              <p class="for-temp">Temp: ${forTemp}</p>
              <p class="for-humid"> Humidity: ${forHumid}</p>
            </div>
          </div>`;

        $("#forecast-cards").append(html);
      }
    });
  }
});
