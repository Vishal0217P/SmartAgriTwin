/* =========================================================
   SmartAgriTwin - AI Recommendation JavaScript
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

    if (isLoggedIn !== "true") {

        window.location.href = "index.html";

        return false;
    }

    return true;
}


/* =========================================================
   LOAD USER
   ========================================================= */

function loadUser() {

    const storedUser =
        JSON.parse(
            localStorage.getItem("smartAgriUser")
        );

    const userName =
        getElement("userName");

    if (
        userName &&
        storedUser &&
        storedUser.name
    ) {
        userName.textContent =
            storedUser.name;
    }
}


/* =========================================================
   LOAD FARM DATA
   ========================================================= */

function getFarmData() {

    const data =
        localStorage.getItem(
            "smartAgriFarmData"
        );

    if (!data) {
        return null;
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Unable to load farm data:",
            error
        );

        return null;
    }
}


/* =========================================================
   CROP RECOMMENDATION
   ========================================================= */

function analyzeCrop() {

    const button =
        getElement(
            "cropRecommendationButton"
        );

    const crop =
        getElement("recommendedCrop");

    const confidence =
        getElement("cropConfidence");

    const confidenceBar =
        getElement("cropConfidenceBar");


    if (
        !button ||
        !crop ||
        !confidence ||
        !confidenceBar
    ) {
        return;
    }


    setButtonLoading(
        button,
        "Analyzing..."
    );


    /*
     * This is currently a frontend demo.
     *
     * Later this section will call:
     *
     * Spring Boot API
     *       ↓
     * ML Model
     *       ↓
     * Prediction
     */

    setTimeout(() => {

        const farmData =
            getFarmData();


        let recommendedCrop =
            "Tomato";

        let score =
            91;


        /*
         * Simple prototype logic.
         *
         * NOT the final ML model.
         */

        if (
            farmData &&
            farmData.soilType === "black"
        ) {

            recommendedCrop =
                "Soybean";

            score =
                88;
        }


        if (
            farmData &&
            farmData.soilType === "sandy"
        ) {

            recommendedCrop =
                "Groundnut";

            score =
                84;
        }


        if (
            farmData &&
            farmData.soilType === "alluvial"
        ) {

            recommendedCrop =
                "Rice";

            score =
                92;
        }


        crop.textContent =
            recommendedCrop;

        confidence.textContent =
            score;

        confidenceBar.style.width =
            `${score}%`;


        resetButton(
            button,
            "Analyze Crop →"
        );


    }, 900);
}


/* =========================================================
   IRRIGATION RECOMMENDATION
   ========================================================= */

function analyzeIrrigation() {

    const button =
        getElement(
            "irrigationRecommendationButton"
        );

    const recommendation =
        getElement(
            "irrigationRecommendation"
        );

    const water =
        getElement("waterRequired");


    if (
        !button ||
        !recommendation ||
        !water
    ) {
        return;
    }


    setButtonLoading(
        button,
        "Analyzing..."
    );


    setTimeout(() => {

        const farmData =
            getFarmData();


        /*
         * Demo sensor value.
         *
         * Later this will come from
         * ESP32 / IoT backend.
         */

        const soilMoisture =
            42;


        if (soilMoisture < 30) {

            recommendation.textContent =
                "Irrigate immediately";

            water.textContent =
                "25 L/m²";

        } else if (soilMoisture < 50) {

            recommendation.textContent =
                "Irrigate in 6 hours";

            water.textContent =
                "18 L/m²";

        } else {

            recommendation.textContent =
                "No irrigation required";

            water.textContent =
                "0 L/m²";
        }


        resetButton(
            button,
            "Analyze Irrigation →"
        );


    }, 900);
}


/* =========================================================
   DISEASE RISK
   ========================================================= */

function analyzeDiseaseRisk() {

    const button =
        getElement(
            "diseaseRiskButton"
        );

    const risk =
        getElement("diseaseRisk");

    const riskInfo =
        document.querySelector(
            ".risk-info strong"
        );

    const riskDescription =
        document.querySelector(
            ".risk-info span"
        );


    if (
        !button ||
        !risk
    ) {
        return;
    }


    setButtonLoading(
        button,
        "Checking..."
    );


    setTimeout(() => {

        /*
         * Demo risk value.
         *
         * Later:
         * weather + humidity + crop
         * + image analysis + ML model
         */

        const diseaseRisk =
            18;


        risk.textContent =
            `${diseaseRisk}%`;


        if (diseaseRisk < 30) {

            riskInfo.textContent =
                "Low Risk";

            riskInfo.style.color =
                "#15803d";

            riskDescription.textContent =
                "Current conditions appear favorable for crop health.";

        } else if (diseaseRisk < 60) {

            riskInfo.textContent =
                "Moderate Risk";

            riskInfo.style.color =
                "#d97706";

            riskDescription.textContent =
                "Monitor crop and environmental conditions carefully.";

        } else {

            riskInfo.textContent =
                "High Risk";

            riskInfo.style.color =
                "#dc2626";

            riskDescription.textContent =
                "Immediate crop monitoring is recommended.";
        }


        resetButton(
            button,
            "Check Disease Risk →"
        );


    }, 900);
}


/* =========================================================
   FERTILIZER RECOMMENDATION
   ========================================================= */

function analyzeFertilizer() {

    const button =
        getElement(
            "fertilizerRecommendationButton"
        );

    if (!button) {
        return;
    }


    setButtonLoading(
        button,
        "Analyzing..."
    );


    setTimeout(() => {

        /*
         * Demo fertilizer analysis.
         *
         * Final version will use:
         *
         * N + P + K
         * soil pH
         * crop requirement
         * growth stage
         */

        const fertilizerItems =
            document.querySelectorAll(
                ".fertilizer-item strong"
            );


        if (fertilizerItems.length >= 3) {

            fertilizerItems[0].textContent =
                "Moderate";

            fertilizerItems[1].textContent =
                "Adequate";

            fertilizerItems[2].textContent =
                "Increase";
        }


        resetButton(
            button,
            "Analyze Nutrients →"
        );


    }, 900);
}


/* =========================================================
   BUTTON LOADING
   ========================================================= */

function setButtonLoading(
    button,
    text
) {

    button.disabled = true;

    button.dataset.originalText =
        button.textContent;

    button.textContent =
        text;

    button.classList.add(
        "ai-loading"
    );
}


/* =========================================================
   RESET BUTTON
   ========================================================= */

function resetButton(
    button,
    text
) {

    button.disabled = false;

    button.textContent =
        text;

    button.classList.remove(
        "ai-loading"
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
        .forEach((link) => {

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
        () => {

            localStorage.removeItem(
                "smartAgriLoggedIn"
            );

            window.location.href =
                "index.html";
        }
    );
}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupAIButtons() {

    const cropButton =
        getElement(
            "cropRecommendationButton"
        );

    const irrigationButton =
        getElement(
            "irrigationRecommendationButton"
        );

    const diseaseButton =
        getElement(
            "diseaseRiskButton"
        );

    const fertilizerButton =
        getElement(
            "fertilizerRecommendationButton"
        );


    if (cropButton) {

        cropButton.addEventListener(
            "click",
            analyzeCrop
        );
    }


    if (irrigationButton) {

        irrigationButton.addEventListener(
            "click",
            analyzeIrrigation
        );
    }


    if (diseaseButton) {

        diseaseButton.addEventListener(
            "click",
            analyzeDiseaseRisk
        );
    }


    if (fertilizerButton) {

        fertilizerButton.addEventListener(
            "click",
            analyzeFertilizer
        );
    }
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

        loadUser();

        setupAIButtons();

        setupMobileSidebar();

        setupLogout();

    }
);