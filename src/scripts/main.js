
import { apiKey } from "./config.js";
import { handleWithDaysOfTheWeek } from "./date.js";
import { isHour } from "./hour.js";



const cityName = document.querySelector(".cityName");
const submitCityNameButton = document.querySelector("#insertCity button")
const htmlLang = document.querySelector("html").getAttribute("lang");
const lang = htmlLang.split('-').join('_');

/**
 * set Brazil capital for the first load
 */
let cityNameValue = "";


const firstLoadApp = () => {
    cityNameValue = "brasília";
    getTemperature(cityNameValue);
}
firstLoadApp();


/**

Loads the city data, gets the temperature and erases the input value.
@return {undefined} This function does not return anything
*/

const loadCityData = (event) => {
    cityNameValue = cityName.value;
    getTemperature(cityNameValue);
    cityName.value = "";
    event.preventDefault();
}
/** show by input button submit */
submitCityNameButton.addEventListener("click", (event) => {
    loadCityData(event);
});


/**
Sets the city name in the HTML document based on whether the city was found or not.
@param {boolean} isCity - Whether the city was found or not.
*/
const setcityName = (isCity) => {

    const city = document.querySelector(".city");

    if (isCity) {
        city.innerHTML = `<i class="ph ph-map-pin"></i> Em ${cityNameValue}`;
    } else {
        city.innerHTML = `<i class="ph ph-map-pin"></i> Cidade, ${cityNameValue} - não encontrada!`;
    }

}


/**

Sets the temperature data for the city.
@param {Number} temp_now - The current temperature.
@param {Number} max_temp - The maximum temperature for the day.
@param {Number} min_temp - The minimum temperature for the day.
*/

const setsCityTemperatue = (temp_now, max_temp, min_temp) => {
    const actualTemp = document.querySelector(".actualTemp .temp");
    const maxTemp = document.querySelector(".temp .maxTemp");
    const minTemp = document.querySelector(".temp .minTemp");

    actualTemp.textContent = temp_now.toFixed(0);
    maxTemp.textContent = `${max_temp.toFixed(0)}º`;
    minTemp.textContent = `${min_temp.toFixed(0)}º`;

}


/**
Sets the city weather information on the page.
@param {number} wind_now - The current wind speed value.
@param {number} humidity_now - The current humidity value.
@param {string} descriptionForecast - The current weather description.
@param {number} vol_rain_now - The current volume of rain value.
@param {string} icon - The weather icon code.
@returns {void}
*/

const setsCityWeather = (wind_now, humidity_now, descriptionForecast, vol_rain_now, icon) => {

    const wind = document.querySelector(".wind > div > strong");
    const humidity = document.querySelector(".humidity > div > strong");
    const description = document.querySelector(".rain > div > span");
    const rain = document.querySelector(".rain > div > strong");
    const iconWeather = document.querySelector(".iconWeather")

    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;


    wind.textContent = wind_now;
    humidity.textContent = humidity_now;
    description.textContent = descriptionForecast;
    rain.textContent = vol_rain_now + " %";

    iconWeather.setAttribute("src", iconUrl);
    iconWeather.setAttribute("alt", `imagem ${descriptionForecast}`);
}



/**
Parses the current weather data from the API and sets it to the relevant elements in the UI.
@param {Object} data - The weather data object returned from the API.
*/

const todayForecast = (data) => {

    const today = data.list[0];
    let volOfRain = 0;

    // some time key rain doesnt load on API
    if (today.rain && today.rain['3h']) {
        volOfRain = today.rain['3h'];
    }

    const todayForecast = {
        "temp": today.main.temp,
        "maxTemp": today.main.temp_max,
        "minTemp": today.main.temp_min,
        "humidity": today.main.humidity,
        "wind": today.wind.speed,
        "volumeOfRain": volOfRain,
        "description": today.weather[0].description,
        "icon": today.weather[0].icon,
    }

    setsCityTemperatue(todayForecast.temp, todayForecast.maxTemp, todayForecast.minTemp);
    setsCityWeather(todayForecast.wind, todayForecast.humidity, todayForecast.description, todayForecast.volumeOfRain, todayForecast.icon);
}



/**
Renders the five days forecast on the page.
@param {object} data - The API response data containing the five days forecast.
The data object must have a list property containing an array of five days forecast.
Each forecast must have the following properties: 
main.temp_max, main.temp_min, weather[0].description, weather[0].icon
*/

const fiveDaysForecast = (data) => {
    const getWeekWeatherForecast = document.querySelector(".weekWeatherForecast");
    const daysOfTheWeek = handleWithDaysOfTheWeek();

    // erase field
    getWeekWeatherForecast.innerHTML = "";

    data.list.forEach((forecast, i) => {
        const fiveDays = {
            maxTemp: forecast.main.temp_max,
            minTemp: forecast.main.temp_min,
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon
        };

        const iconUrl = `http://openweathermap.org/img/w/${fiveDays.icon}.png`;

        getWeekWeatherForecast.innerHTML += `
        <div class="days">
          <header>${daysOfTheWeek[i]}</header>
          <img class="main" src="${iconUrl}" alt="${fiveDays.description}">
          <footer>
            <span class="maxTemp">${fiveDays.maxTemp.toFixed(0)}º</span>
            <span class="minTemp">${fiveDays.minTemp.toFixed(0)}º</span>
          </footer>
        </div>
      `;
    });
};

/**
 * Makes a request to the OpenWeatherMap API and gets the temperature and weather forecast 
 * for the given city.
 * @param {string} cityName - The name of the city to get the temperature and forecast for.
 */
async function getTemperature(cityName) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=6&appid=${apiKey}&lang=${lang}&units=metric`;

    try {
        const response = await fetch(apiUrl);

        if (response.status === 200) {

            const data = await response.json();

            todayForecast(data);
            fiveDaysForecast(data);
            setcityName(true);

        } else {
            setcityName(false);
            console.error(`Erro ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Function handlesWithTimeOfSun calculates and displays the position of the 
 * sun based on the current time, 
 * sunrise and sunset times. It also displays the sunrise and sunset times on the screen.
 * @returns {void}
 */
const handlesWithTimeOfSun = () => {

    const gradient = document.querySelector(".chart .main .gradient");
    const sun = document.querySelector(".chart .sun");

    const actualTime = document.querySelector(".actualtime");

    const updateTime = () => {
        actualTime.textContent = isHour();
    }
    setInterval(updateTime,1000);


    const hourSunrise = 6;
    const hourSunset = 18;

    const minuteSunrise = 0;
    const minuteSunset = 0;

    let timeNow = parseInt(isHour());
    
    //prevent hour above than 18 and low than 6
    if (timeNow > hourSunset) {
        timeNow = hourSunset;
    }
    if (timeNow < hourSunrise) {
        timeNow = hourSunrise;
    }

    //Calculate the total number of hours between sunrise and sunset
    const totalHourDay = Math.abs(hourSunset - hourSunrise);

    // Calculate the number of hours between sunrise and the current time
    const hourStartInSunrise = Math.abs(timeNow - hourSunrise);

    // Calculate the rotation of the sun based on the current time and the length of the day
    // 180 degrees represents the angle of the sun at sunset
    const sunRotate = hourStartInSunrise / totalHourDay * 180;
    sun.style.transform = `rotate(${sunRotate}deg)`;

    // Define a mapping of hours to percentage values
    let percent = 0;
    const timeToPercent = {
        8: 35,
        9: 55,
        10: 73,
        11: 87,
        12: 100,
        13: 110
    };

    if (timeNow >= 14) {
        percent = 113;
    } else {
        percent = timeToPercent[timeNow] || 0;
    }

    const sunShine = hourStartInSunrise / totalHourDay * percent;

    gradient.style.width = `${Math.abs(sunShine)}%`;


    /** build sunrise and sunset on the screen */
    const sunrise = document.querySelector(".timeLine .sunrise");
    const sunset = document.querySelector(".timeLine .sunset");

    const timeToSunrise = [hourSunrise, minuteSunrise].
        map(unit => String(unit).padStart(2, "0")).join(":")
    sunrise.textContent = timeToSunrise;

    const timeToSunset = [hourSunset, minuteSunset].
        map(unit => String(unit).padStart(2, "0")).join(":")
    sunset.textContent = timeToSunset;

}
handlesWithTimeOfSun();


//updates the time every 5min 
setInterval(handlesWithTimeOfSun, 5 * 60 * 1000);