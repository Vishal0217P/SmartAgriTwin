/* =========================================================
   SmartAgriTwin - Weather JavaScript
   ========================================================= */


/* =========================================================
   HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function checkAuthentication() {

    const isLoggedIn =
        localStorage.getItem("smartAgriLoggedIn");

    if (isLoggedIn !== "true") {
        window.location.href = "index.html";
        return false;
    }

    return true;
}


/* =========================================================
   USER PROFILE
   ========================================================= */

function loadUserProfile() {

    const storedUser =
        localStorage.getItem("smartAgriUser");

    let user = {
        name: "Farmer",
        location: "Pune, Maharashtra"
    };


    if (storedUser) {

        try {

            user = {
                ...user,
                ...JSON.parse(storedUser)
            };

        } catch (error) {

            console.error(
                "Unable to load user profile:",
                error
            );

        }
    }


    const userName =
        getElement("userName");

    const weatherLocation =
        getElement("weatherLocation");


    if (userName) {
        userName.textContent =
            user.name;
    }


    if (weatherLocation) {
        weatherLocation.textContent =
            user.location;
    }
}


/* =========================================================
   WEATHER DATA
   ========================================================= */

const weatherData = {

    location: "Pune, Maharashtra",

    current: {
        temperature: 28,
        condition: "Partly Cloudy",
        humidity: 67,
        wind: 14,
        rainChance: 35,
        uv: 6
    },

    forecast: [
        {
            day: "Today",
            icon: "🌤️",
            high: 28,
            low: 21,
            condition: "Partly Cloudy",
            rain: 35
        },
        {
            day: "Tue",
            icon: "🌦️",
            high: 27,
            low: 20,
            condition: "Light Rain",
            rain: 62
        },
        {
            day: "Wed",
            icon: "🌧️",
            high: 25,
            low: 19,
            condition: "Rain",
            rain: 78
        },
        {
            day: "Thu",
            icon: "🌤️",
            high: 27,
            low: 20,
            condition: "Cloudy",
            rain: 40
        },
        {
            day: "Fri",
            icon: "☀️",
            high: 29,
            low: 21,
            condition: "Sunny",
            rain: 18
        },
        {
            day: "Sat",
            icon: "☀️",
            high: 30,
            low: 22,
            condition: "Sunny",
            rain: 15
        },
        {
            day: "Sun",
            icon: "🌤️",
            high: 29,
            low: 21,
            condition: "Partly Cloudy",
            rain: 28
        }
    ]
};


/* =========================================================
   LOAD CURRENT WEATHER
   ========================================================= */

function loadCurrentWeather() {

    const current =
        weatherData.current;


    const temperature =
        getElement("currentTemperature");

    const condition =
        getElement("weatherCondition");

    const humidity =
        getElement("humidity");

    const wind =
        getElement("windSpeed");

    const rainChance =
        getElement("rainChance");

    const uv =
        getElement("uvIndex");


    if (temperature) {
        temperature.textContent =
            current.temperature;
    }

    if (condition) {
        condition.textContent =
            current.condition;
    }

    if (humidity) {
        humidity.textContent =
            `${current.humidity}%`;
    }

    if (wind) {
        wind.textContent =
            `${current.wind} km/h`;
    }

    if (rainChance) {
        rainChance.textContent =
            `${current.rainChance}%`;
    }

    if (uv) {
        uv.textContent =
            current.uv;
    }
}


/* =========================================================
   LOAD FORECAST
   ========================================================= */

function loadForecast() {

    const forecastGrid =
        getElement("forecastGrid");


    if (!forecastGrid) {
        return;
    }


    forecastGrid.innerHTML = "";


    weatherData.forecast.forEach(
        (day, index) => {

            const article =
                document.createElement("article");


            article.className =
                "forecast-day";


            if (index === 0) {
                article.classList.add("today");
            }


            article.innerHTML = `
                <span>
                    ${day.day}
                </span>

                <strong>
                    ${day.icon}
                </strong>

                <div class="forecast-temp">
                    <b>${day.high}°</b>
                    <small>${day.low}°</small>
                </div>

                <small>
                    ${day.condition}
                </small>

                <span class="forecast-rain">
                    🌧️ ${day.rain}%
                </span>
            `;


            forecastGrid.appendChild(
                article
            );

        }
    );
}


/* =========================================================
   WEATHER RECOMMENDATION
   ========================================================= */

function generateWeatherRecommendation() {

    const recommendation =
        getElement(
            "weatherRecommendation"
        );


    if (!recommendation) {
        return;
    }


    const rainChance =
        weatherData.current.rainChance;


    if (rainChance >= 70) {

        recommendation.textContent =
            "High rainfall probability detected. Avoid unnecessary irrigation and monitor soil moisture to prevent waterlogging.";

        return;
    }


    if (rainChance >= 40) {

        recommendation.textContent =
            "Moderate rainfall is expected. Consider reducing irrigation and monitor rainfall before the next watering cycle.";

        return;
    }


    recommendation.textContent =
        "Rainfall probability is currently low. Continue regular irrigation based on soil moisture and crop requirements.";
}


/* =========================================================
   UPDATE TIME
   ========================================================= */

function updateWeatherTime() {

    const updated =
        getElement("weatherUpdated");


    if (!updated) {
        return;
    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    updated.textContent =
        `Updated at ${time}`;
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function setupMobileSidebar() {

    const menuButton =
        getElement("menuButton");

    const sidebar =
        getElement("sidebar");

    const overlay =
        getElement("sidebarOverlay");


    if (
        !menuButton ||
        !sidebar ||
        !overlay
    ) {
        return;
    }


    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        overlay.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";
    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.add(
                "open"
            );

            overlay.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

        }
    );


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    sidebar
        .querySelectorAll("a")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    closeSidebar
                );

            }
        );
}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutButton =
        getElement("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "smartAgriLoggedIn"
            );

            localStorage.removeItem(
                "smartAgriUser"
            );

            window.location.href =
                "index.html";

        }
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkAuthentication()) {
            return;
        }


        loadUserProfile();

        loadCurrentWeather();

        loadForecast();

        generateWeatherRecommendation();

        updateWeatherTime();

        setupMobileSidebar();

        setupLogout();

    }
);