const API_KEY = `d0431e363f8d1e7ff2d91e0c25487b31`;
const city = document.querySelector("#city");
const form = document.querySelector("form");
const weather = document.querySelector("#weather");
const search = document.querySelector("#submit");
const weatherDetail = document.querySelector("#weather-detail");

// Function to convert timestamp to readable  time
function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Function to convert wind direction degrees to cardinal direction
function convertWindDirection(degrees) {
  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Function to convert wind speed to specified unit
function convertWindSpeed(speed, unit = "m/s") {
  if (unit === "km/s") {
    return speed ? (speed * 0.001).toFixed(2) + " km/s" : "N/A";
  } else if (unit === "km/h") {
    return speed ? (speed * 3.6).toFixed(2) + " km/h" : "N/A";
  } else {
    return speed ? speed.toFixed(2) + " m/s" : "N/A";
  }
}

// Function to convert pressure to specified unit
function convertPressure(pressure, unit = "hPa") {
  if (unit === "kPa") {
    return pressure ? (pressure / 10).toFixed(2) + " kPa" : "N/A";
  } else if (unit === "Pa") {
    return pressure ? (pressure * 100).toFixed(2) + " Pa" : "N/A";
  } else {
    return pressure ? pressure.toFixed(2) + " hPa" : "N/A";
  }
}
//  Adding a loading spinner
function showLoading() {
  weather.innerHTML = '<div class="loading-spinner"></div>';
}

const getWeather = async (city) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  try {
    showLoading();
    let response = await fetch(URL);
    if (response.ok) {
      const data = await response.json();
      showWeather(data);
    } else {
      if (response.status === 404) {
        throw new Error(
          "Oops! The city has gone incognito. Time to put on your detective hat and try again!"
        );
      } else if (response.status === 401) {
        throw new Error(
          "Oops! It seems you're not wearing the proper weather hat. Authenticate and try again!"
        );
      } else if (response.status === 500) {
        throw new Error(
          "Yikes! The weather server is under a rainstorm of bugs. Our bug-catchers are on it. Try again later!"
        );
      } else {
        throw new Error(
          "Blast! The weather crystal ball is cloudy today. Try your request again, and it might clear up!"
        );
      }
    }
  } catch (error) {
    let errorMessage = "Oops! Something went wrong. Please try again.";
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      errorMessage =
        "Oops! The weather data seems to be in an alien language. Our translators are on it. Try again later!";
    } else if (
      error instanceof TypeError &&
      error.message.includes("NetworkError")
    ) {
      errorMessage =
        "Uh-oh! The weather signal got lost in the digital clouds. Check your internet connection and try again!";
    } else {
      errorMessage = error.message || errorMessage;
    }
    weather.innerHTML = `<h2>${errorMessage}</h2>`;
    weatherDetail.innerHTML = "";
  }
};

const showWeather = (response) => {
  
  weather.innerHTML = ` 
              <div>
              <img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="">
              </div>
              <div>
                 <h2>${response.main.temp}°C</h2>
                 <h4>${response.weather[0].main}</h4>
              </div>
    `;

  weatherDetail.innerHTML = `
        <div class="col-sm-12 col-md-6 col-lg-4 mb-3 ">
          <div class="card">
            <div class="card-header">
              Current Weather
            </div>
            <div class="card-body">
              <p class="card-text">
                Temperature: ${response.main.temp}°C <br>
                Feels Like: ${response.main.feels_like}°C <br>
                Condition: ${response.weather[0].description} <br>
                Humidity: ${response.main.humidity}% <br>
                Visibility: ${response.visibility} meters <br>
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
          <div class="card">
            <div class="card-header">
              Wind Information
            </div>
            <div class="card-body">
              <p class="card-text">
                Wind Speed: ${convertWindSpeed(response.wind.speed)} <br>
                Direction: ${response.wind.deg}° ${convertWindDirection(
    response.wind.deg
  )} <br>
                Gusts: ${convertWindSpeed(response.wind.gust)} <br>
                Cloud Cover: ${response.clouds.all}%<br>
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
          <div class="card">
            <div class="card-header">
              Additional Information
            </div>
            <div class="card-body">

              <p class="card-text">
               Sunrise: ${convertTimestampToTime(response.sys.sunrise)} <br>
               Sunset: ${convertTimestampToTime(response.sys.sunset)} <br>
                Pressure: ${convertPressure(response.main.pressure)} <br>
                Sea Level: ${convertPressure(response.main.sea_level)} <br>
                Ground Level: ${convertPressure(response.main.grnd_level)} <br>
              </p>
            </div>
          </div>
        </div>
    
    `;
  weather.innerHTML +=
    '<p class="success-message">Weather updated successfully!</p>';
};

form.addEventListener("submit", (event) => {
  const cityName = city.value.trim();
  if (city.value !== "") {
    getWeather(cityName);
  } else {
    weather.innerHTML = `<h2 >Hold on! The weather ghosts are lonely without a city to haunt. Type one in, if you dare!</h2>`;
  }
  event.preventDefault();
});
