/* =========================================================
   SmartAgriTwin - AI Recommendation JavaScript
   Frontend Prototype Version
   ========================================================= */


/* =========================================================
   ELEMENT HELPER
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
     * Do not redirect from AI Recommendation page.
     * If login information is missing, the page still loads.
     */

    if (isLoggedIn !== "true") {
        console.warn(
            "SmartAgriTwin: Login state not found. Running prototype mode."
        );
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
        name: "Farmer"
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
            user.name || "Farmer";
    }
}


/* =========================================================
   FARM / SENSOR DATA
   ========================================================= */

function getFarmData() {

    const savedData =
        localStorage.getItem("smartAgriFarmData");

    if (!savedData) {

        return {
            soilMoisture: 42,
            temperature: 27,
            humidity: 67,
            rainProbability: 35,
            cropHealth: 91,
            nitrogen: "Slightly Low"
        };
    }

    try {

        const data =
            JSON.parse(savedData);

        return {
            soilMoisture:
                Number(data.soilMoisture ?? 42),

            temperature:
                Number(data.temperature ?? 27),

            humidity:
                Number(data.humidity ?? 67),

            rainProbability:
                Number(data.rainProbability ?? 35),

            cropHealth:
                Number(data.cropHealth ?? 91),

            nitrogen:
                data.nitrogen ?? "Slightly Low"
        };

    } catch (error) {

        console.error(
            "Unable to read farm data:",
            error
        );

        return {
            soilMoisture: 42,
            temperature: 27,
            humidity: 67,
            rainProbability: 35,
            cropHealth: 91,
            nitrogen: "Slightly Low"
        };
    }
}


/* =========================================================
   IRRIGATION RECOMMENDATION
   ========================================================= */

function generateIrrigationRecommendation(data) {

    const title =
        getElement("irrigationRecommendation");

    const text =
        getElement("irrigationRecommendationText");

    if (!title || !text) {
        return;
    }

    const moisture =
        data.soilMoisture;

    if (moisture < 30) {

        title.textContent =
            "Irrigation required immediately";

        text.textContent =
            `Soil moisture is critically low at ${moisture}%. Start irrigation to reduce crop water stress.`;

        return;
    }

    if (moisture < 35) {

        title.textContent =
            "Irrigation recommended soon";

        text.textContent =
            `Soil moisture is ${moisture}%. The field is approaching the lower recommended limit.`;

        return;
    }

    if (moisture > 60) {

        title.textContent =
            "Avoid irrigation";

        text.textContent =
            `Soil moisture is high at ${moisture}%. Additional irrigation may cause waterlogging.`;

        return;
    }

    title.textContent =
        "No immediate irrigation required";

    text.textContent =
        `Soil moisture is ${moisture}%, which is within the recommended range. Continue monitoring the field.`;
}


/* =========================================================
   SOIL RECOMMENDATION
   ========================================================= */

function generateSoilRecommendation(data) {

    const title =
        getElement("soilRecommendation");

    const text =
        getElement("soilRecommendationText");

    if (!title || !text) {
        return;
    }

    if (
        data.nitrogen === "Low" ||
        data.nitrogen === "Slightly Low"
    ) {

        title.textContent =
            "Monitor nitrogen level";

        text.textContent =
            "Nitrogen appears slightly below the preferred range. Monitor soil nutrients before applying fertilizer.";

        return;
    }

    title.textContent =
        "Soil condition looks healthy";

    text.textContent =
        "Current soil conditions are suitable. Continue regular monitoring of moisture and nutrients.";
}


/* =========================================================
   WEATHER RECOMMENDATION
   ========================================================= */

function generateWeatherRecommendation(data) {

    const title =
        getElement("weatherRecommendation");

    const text =
        getElement("weatherRecommendationText");

    if (!title || !text) {
        return;
    }

    const rain =
        data.rainProbability;

    if (rain >= 70) {

        title.textContent =
            "High rainfall expected";

        text.textContent =
            `Rain probability is ${rain}%. Avoid unnecessary irrigation and monitor the field for excess moisture.`;

        return;
    }

    if (rain >= 40) {

        title.textContent =
            "Monitor rainfall";

        text.textContent =
            `Rain probability is ${rain}%. Consider rainfall before starting the next irrigation cycle.`;

        return;
    }

    title.textContent =
        "Low rainfall probability";

    text.textContent =
        `Rain probability is ${rain}%. Continue irrigation based on soil moisture and crop requirements.`;
}


/* =========================================================
   CROP RECOMMENDATION
   ========================================================= */

function generateCropRecommendation(data) {

    const title =
        getElement("cropRecommendation");

    const text =
        getElement("cropRecommendationText");

    if (!title || !text) {
        return;
    }

    const health =
        data.cropHealth;

    if (health < 60) {

        title.textContent =
            "Crop health needs attention";

        text.textContent =
            `Estimated crop health is ${health}%. Inspect the crop for nutrient deficiency, disease or environmental stress.`;

        return;
    }

    if (health < 80) {

        title.textContent =
            "Monitor crop health";

        text.textContent =
            `Estimated crop health is ${health}%. Continue monitoring crop growth and environmental conditions.`;

        return;
    }

    title.textContent =
        "Continue current crop management";

    text.textContent =
        `Crop health is estimated at ${health}%. Maintain current management practices and continue regular monitoring.`;
}


/* =========================================================
   OVERALL AI RECOMMENDATION
   ========================================================= */

function generateOverallRecommendation(data) {

    const title =
        getElement("overallRecommendation");

    const text =
        getElement("overallRecommendationText");

    const confidence =
        getElement("aiConfidence");

    const aiStatus =
        getElement("aiStatus");

    if (aiStatus) {
        aiStatus.textContent = "Active";
    }

    let recommendation =
        "Farm conditions are generally healthy";

    let explanation =
        "Current soil, weather and crop conditions are within acceptable ranges. Continue regular monitoring.";

    let confidenceValue = 92;


    /*
     * Priority 1:
     * Very low soil moisture
     */

    if (data.soilMoisture < 30) {

        recommendation =
            "Irrigation is urgently recommended";

        explanation =
            `Soil moisture is critically low at ${data.soilMoisture}%. The crop may experience water stress if irrigation is delayed.`;

        confidenceValue = 95;
    }


    /*
     * Priority 2:
     * Very high rainfall
     */

    else if (data.rainProbability >= 70) {

        recommendation =
            "Rainfall may reduce irrigation requirements";

        explanation =
            `Rain probability is ${data.rainProbability}%. Avoid unnecessary irrigation and monitor soil moisture closely.`;

        confidenceValue = 94;
    }


    /*
     * Priority 3:
     * Poor crop health
     */

    else if (data.cropHealth < 60) {

        recommendation =
            "Crop health requires attention";

        explanation =
            `AI-estimated crop health is ${data.cropHealth}%. Inspect the crop for possible environmental, nutrient or disease-related stress.`;

        confidenceValue = 89;
    }


    /*
     * Normal condition
     */

    if (title) {
        title.textContent =
            recommendation;
    }

    if (text) {
        text.textContent =
            explanation;
    }

    if (confidence) {
        confidence.textContent =
            `${confidenceValue}%`;
    }
}


/* =========================================================
   UPDATE AI DECISION FACTORS
   ========================================================= */

function updateDecisionFactors(data) {

    const factors =
        document.querySelectorAll(
            ".decision-factor"
        );

    if (!factors || factors.length < 4) {
        return;
    }


    /* ---------- Soil Moisture ---------- */

    const moistureValue =
        factors[0].querySelector("span");

    const moistureStatus =
        factors[0].querySelector("b");

    if (moistureValue) {

        moistureValue.textContent =
            `Current value: ${data.soilMoisture}%`;
    }

    if (moistureStatus) {

        if (
            data.soilMoisture >= 35 &&
            data.soilMoisture <= 60
        ) {

            moistureStatus.textContent =
                "Optimal";

        } else {

            moistureStatus.textContent =
                "Monitor";
        }
    }


    /* ---------- Temperature ---------- */

    const temperatureValue =
        factors[1].querySelector("span");

    const temperatureStatus =
        factors[1].querySelector("b");

    if (temperatureValue) {

        temperatureValue.textContent =
            `Current value: ${data.temperature}°C`;
    }

    if (temperatureStatus) {

        if (
            data.temperature >= 18 &&
            data.temperature <= 35
        ) {

            temperatureStatus.textContent =
                "Normal";

        } else {

            temperatureStatus.textContent =
                "Monitor";
        }
    }


    /* ---------- Rain ---------- */

    const rainValue =
        factors[2].querySelector("span");

    const rainStatus =
        factors[2].querySelector("b");

    if (rainValue) {

        rainValue.textContent =
            `Current probability: ${data.rainProbability}%`;
    }

    if (rainStatus) {

        if (data.rainProbability >= 70) {

            rainStatus.textContent =
                "High";

        } else if (data.rainProbability >= 40) {

            rainStatus.textContent =
                "Moderate";

        } else {

            rainStatus.textContent =
                "Low";
        }
    }


    /* ---------- Crop Health ---------- */

    const cropValue =
        factors[3].querySelector("span");

    const cropStatus =
        factors[3].querySelector("b");

    if (cropValue) {

        cropValue.textContent =
            `AI estimated health: ${data.cropHealth}%`;
    }

    if (cropStatus) {

        if (data.cropHealth >= 80) {

            cropStatus.textContent =
                "Healthy";

        } else if (data.cropHealth >= 60) {

            cropStatus.textContent =
                "Monitor";

        } else {

            cropStatus.textContent =
                "Attention";
        }
    }
}


/* =========================================================
   YIELD PREDICTION
   ========================================================= */

function updateYieldPrediction(data) {

    const predictedYield =
        getElement("predictedYield");

    if (!predictedYield) {
        return;
    }

    let yieldValue =
        4.2;


    /*
     * Simple prototype calculation.
     * This is NOT a real ML model.
     */

    if (data.cropHealth < 60) {

        yieldValue = 3.2;

    } else if (data.cropHealth < 80) {

        yieldValue = 3.7;

    } else if (
        data.soilMoisture >= 35 &&
        data.soilMoisture <= 60
    ) {

        yieldValue = 4.2;

    } else {

        yieldValue = 3.9;
    }


    predictedYield.textContent =
        yieldValue.toFixed(1);
}


/* =========================================================
   DISEASE RISK
   ========================================================= */

function updateDiseaseRisk(data) {

    const diseaseRisk =
        getElement("diseaseRisk");

    if (!diseaseRisk) {
        return;
    }

    let risk = 12;


    /*
     * High humidity + rainfall
     * increases prototype disease risk.
     */

    if (
        data.humidity >= 80 &&
        data.rainProbability >= 60
    ) {

        risk = 55;

    } else if (
        data.humidity >= 70 ||
        data.rainProbability >= 50
    ) {

        risk = 30;

    } else {

        risk = 12;
    }


    diseaseRisk.textContent =
        `${risk}%`;


    const riskStatus =
        document.querySelector(
            ".risk-content"
        );


    if (riskStatus) {

        const statusElement =
            document.querySelector(
                ".card-header .stat-status"
            );

        if (statusElement) {

            if (risk >= 50) {

                statusElement.textContent =
                    "HIGH";

                statusElement.className =
                    "stat-status bad";

            } else if (risk >= 30) {

                statusElement.textContent =
                    "MEDIUM";

                statusElement.className =
                    "stat-status warning";

            } else {

                statusElement.textContent =
                    "LOW";

                statusElement.className =
                    "stat-status good";
            }
        }
    }
}


/* =========================================================
   AI ANALYSIS
   ========================================================= */

function runAIAnalysis() {

    const farmData =
        getFarmData();

    generateOverallRecommendation(
        farmData
    );

    generateIrrigationRecommendation(
        farmData
    );

    generateSoilRecommendation(
        farmData
    );

    generateWeatherRecommendation(
        farmData
    );

    generateCropRecommendation(
        farmData
    );

    updateDecisionFactors(
        farmData
    );

    updateYieldPrediction(
        farmData
    );

    updateDiseaseRisk(
        farmData
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


    sidebar
        .querySelectorAll("a")
        .forEach(
            function (link) {

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
   NOTIFICATION BUTTON
   ========================================================= */

function setupNotification() {

    const notificationButton =
        getElement("notificationButton");


    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        function () {

            alert(
                "No new farm alerts. AI monitoring is active."
            );
        }
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!checkAuthentication()) {
            return;
        }


        loadUserProfile();

        runAIAnalysis();

        setupMobileSidebar();

        setupLogout();

        setupNotification();

    }
);