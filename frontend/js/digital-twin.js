/* =========================================================
   SmartAgriTwin - Digital Twin JavaScript
   Frontend Prototype
   ========================================================= */


/* =========================================================
   HELPER
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

    /*
     * For prototype:
     * If user is not logged in, redirect to login page.
     */

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

            const parsedUser =
                JSON.parse(storedUser);

            user = {
                ...user,
                ...parsedUser
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


    if (userName) {

        userName.textContent =
            user.name;
    }
}


/* =========================================================
   FARM DATA
   ========================================================= */

const farmData = {

    soilMoisture: 42,

    temperature: 27,

    humidity: 67,

    rainProbability: 35,

    cropHealth: 91,

    ph: 6.5,

    waterLevel: 72,

    light: 68
};


/* =========================================================
   LOAD FARM DATA
   ========================================================= */

function loadFarmData() {

    const moisture =
        getElement("twinMoisture");

    const temperature =
        getElement("twinTemperature");

    const humidity =
        getElement("twinHumidity");

    const cropHealth =
        getElement("twinCropHealth");


    if (moisture) {

        moisture.textContent =
            farmData.soilMoisture + "%";
    }


    if (temperature) {

        temperature.textContent =
            farmData.temperature + "°C";
    }


    if (humidity) {

        humidity.textContent =
            farmData.humidity + "%";
    }


    if (cropHealth) {

        cropHealth.textContent =
            farmData.cropHealth + "%";
    }
}


/* =========================================================
   TWIN METRICS
   ========================================================= */

function loadTwinMetrics() {

    const moisture =
        getElement("soilMoistureValue");

    const temperature =
        getElement("temperatureValue");

    const humidity =
        getElement("humidityValue");

    const cropHealth =
        getElement("cropHealthValue");


    if (moisture) {

        moisture.textContent =
            farmData.soilMoisture + "%";
    }


    if (temperature) {

        temperature.textContent =
            farmData.temperature + "°C";
    }


    if (humidity) {

        humidity.textContent =
            farmData.humidity + "%";
    }


    if (cropHealth) {

        cropHealth.textContent =
            farmData.cropHealth + "%";
    }
}


/* =========================================================
   HEALTH STATUS
   ========================================================= */

function updateHealthStatus() {

    const healthScore =
        getElement("healthScore");

    const healthStatus =
        getElement("healthStatus");


    if (healthScore) {

        healthScore.textContent =
            farmData.cropHealth + "%";
    }


    if (healthStatus) {

        if (farmData.cropHealth >= 80) {

            healthStatus.textContent =
                "Farm is healthy";

        } else if (farmData.cropHealth >= 60) {

            healthStatus.textContent =
                "Farm needs monitoring";

        } else {

            healthStatus.textContent =
                "Farm requires attention";
        }
    }
}


/* =========================================================
   HEALTH LIST
   ========================================================= */

function updateHealthList() {

    const soilStatus =
        getElement("soilStatus");

    const weatherStatus =
        getElement("weatherStatus");

    const waterStatus =
        getElement("waterStatus");

    const cropStatus =
        getElement("cropStatus");


    if (soilStatus) {

        soilStatus.textContent =
            farmData.soilMoisture >= 35 &&
            farmData.soilMoisture <= 60
                ? "Optimal"
                : "Monitor";
    }


    if (weatherStatus) {

        if (farmData.rainProbability >= 70) {

            weatherStatus.textContent =
                "Rain Expected";

        } else if (farmData.rainProbability >= 40) {

            weatherStatus.textContent =
                "Moderate";

        } else {

            weatherStatus.textContent =
                "Stable";
        }
    }


    if (waterStatus) {

        waterStatus.textContent =
            farmData.waterLevel >= 40
                ? "Available"
                : "Low";
    }


    if (cropStatus) {

        cropStatus.textContent =
            farmData.cropHealth >= 80
                ? "Healthy"
                : "Monitor";
    }
}


/* =========================================================
   RANGE INPUTS
   ========================================================= */

function setupRangeInputs() {

    const ranges =
        document.querySelectorAll(
            'input[type="range"]'
        );


    ranges.forEach(function (range) {

        const valueElement =
            getElement(range.dataset.output);


        if (!valueElement) {
            return;
        }


        function updateRangeValue() {

            valueElement.textContent =
                range.value + "%";
        }


        range.addEventListener(
            "input",
            updateRangeValue
        );


        updateRangeValue();

    });
}


/* =========================================================
   SIMULATION
   ========================================================= */

function runSimulation() {

    const cropSelect =
        getElement("cropSelect");

    const moistureRange =
        getElement("moistureRange");

    const temperatureRange =
        getElement("temperatureRange");

    const rainRange =
        getElement("rainRange");


    const crop =
        cropSelect
            ? cropSelect.value
            : "Wheat";


    const moisture =
        moistureRange
            ? Number(moistureRange.value)
            : farmData.soilMoisture;


    const temperature =
        temperatureRange
            ? Number(temperatureRange.value)
            : farmData.temperature;


    const rain =
        rainRange
            ? Number(rainRange.value)
            : farmData.rainProbability;


    /*
     * Simple prototype simulation model.
     */

    let yieldPrediction = 4.2;

    let waterRequirement = "Medium";

    let cropRisk = "Low";


    /* Moisture effect */

    if (moisture < 30) {

        yieldPrediction -= 0.6;

        waterRequirement = "High";

    } else if (moisture > 70) {

        yieldPrediction -= 0.4;

        waterRequirement = "Low";

    }


    /* Temperature effect */

    if (temperature > 35) {

        yieldPrediction -= 0.5;

        cropRisk = "Medium";

    }


    if (temperature < 15) {

        yieldPrediction -= 0.3;

        cropRisk = "Medium";
    }


    /* Rain effect */

    if (rain >= 70) {

        waterRequirement = "Low";

        cropRisk = "Medium";
    }


    if (yieldPrediction < 1) {

        yieldPrediction = 1;
    }


    const predictedYield =
        getElement("predictedYield");

    const waterRequirementElement =
        getElement("waterRequirement");

    const cropRiskElement =
        getElement("cropRisk");

    const simulationRecommendation =
        getElement(
            "simulationRecommendation"
        );


    if (predictedYield) {

        predictedYield.textContent =
            yieldPrediction.toFixed(1) +
            " t/ha";
    }


    if (waterRequirementElement) {

        waterRequirementElement.textContent =
            waterRequirement;
    }


    if (cropRiskElement) {

        cropRiskElement.textContent =
            cropRisk;
    }


    if (simulationRecommendation) {

        let message = "";


        if (moisture < 30) {

            message =
                "Soil moisture is low. Increase irrigation carefully and monitor soil moisture.";

        } else if (moisture > 70) {

            message =
                "Soil moisture is high. Avoid unnecessary irrigation to reduce waterlogging risk.";

        } else if (rain >= 70) {

            message =
                "High rainfall probability detected. Reduce irrigation and monitor field drainage.";

        } else if (temperature > 35) {

            message =
                "High temperature may increase crop stress. Monitor irrigation and crop condition.";

        } else {

            message =
                crop +
                " conditions are currently suitable. Continue regular monitoring of soil, weather and crop health.";
        }


        simulationRecommendation.textContent =
            message;
    }
}


/* =========================================================
   SIMULATION BUTTON
   ========================================================= */

function setupSimulationButton() {

    const button =
        getElement("simulateButton");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            button.disabled = true;

            button.textContent =
                "Simulating...";


            setTimeout(
                function () {

                    runSimulation();

                    button.disabled =
                        false;

                    button.textContent =
                        "Run Simulation";

                },
                700
            );

        }
    );
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
        function () {

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


    const links =
        sidebar.querySelectorAll("a");


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            closeSidebar
        );

    });
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
        function () {

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
   LIVE TWIN UPDATE
   ========================================================= */

function startLiveUpdate() {

    setInterval(
        function () {

            /*
             * Small prototype variation.
             * This simulates live IoT sensor updates.
             */

            farmData.soilMoisture =
                Math.max(
                    20,
                    Math.min(
                        80,
                        farmData.soilMoisture +
                        (Math.random() * 2 - 1)
                    )
                );


            farmData.temperature =
                Math.max(
                    20,
                    Math.min(
                        35,
                        farmData.temperature +
                        (Math.random() * 0.4 - 0.2)
                    )
                );


            loadFarmData();

            loadTwinMetrics();

        },
        5000
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * IMPORTANT:
         * Correct condition is:
         * if (!checkAuthentication())
         *
         * NOT:
         * if (checkAuthentication())
         */

        if (!checkAuthentication()) {

            return;
        }


        loadUserProfile();

        loadFarmData();

        loadTwinMetrics();

        updateHealthStatus();

        updateHealthList();

        setupRangeInputs();

        setupSimulationButton();

        setupMobileSidebar();

        setupLogout();

        startLiveUpdate();

    }
);