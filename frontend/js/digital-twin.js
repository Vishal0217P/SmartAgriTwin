/* =========================================================
   SmartAgriTwin - Digital Twin JavaScript
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

    const userName =
        getElement("userName");

    const storedUser =
        localStorage.getItem("smartAgriUser");

    if (!userName || !storedUser) {
        return;
    }

    try {

        const user =
            JSON.parse(storedUser);

        if (user.name) {
            userName.textContent =
                user.name;
        }

    } catch (error) {

        console.error(
            "Unable to load user:",
            error
        );
    }
}


/* =========================================================
   FARM DATA
   ========================================================= */

function getFarmData() {

    const storedData =
        localStorage.getItem(
            "smartAgriFarmData"
        );

    if (!storedData) {
        return null;
    }

    try {

        return JSON.parse(storedData);

    } catch (error) {

        console.error(
            "Unable to load farm data:",
            error
        );

        return null;
    }
}


/* =========================================================
   UPDATE RANGE VALUES
   ========================================================= */

function setupRangeInputs() {

    const irrigationRange =
        getElement("irrigationRange");

    const rainfallRange =
        getElement("rainfallRange");

    const temperatureRange =
        getElement("temperatureRange");

    const irrigationValue =
        getElement("irrigationValue");

    const rainfallValue =
        getElement("rainfallValue");

    const temperatureValue =
        getElement("temperatureValue");


    if (irrigationRange) {

        irrigationRange.addEventListener(
            "input",
            () => {

                irrigationValue.textContent =
                    `${formatSignedValue(
                        irrigationRange.value
                    )}%`;

            }
        );
    }


    if (rainfallRange) {

        rainfallRange.addEventListener(
            "input",
            () => {

                rainfallValue.textContent =
                    `${formatSignedValue(
                        rainfallRange.value
                    )}%`;

            }
        );
    }


    if (temperatureRange) {

        temperatureRange.addEventListener(
            "input",
            () => {

                temperatureValue.textContent =
                    `${formatSignedValue(
                        temperatureRange.value
                    )}°C`;

            }
        );
    }
}


/* =========================================================
   FORMAT SIGNED VALUE
   ========================================================= */

function formatSignedValue(value) {

    const number =
        Number(value);

    if (number > 0) {
        return `+${number}`;
    }

    return number;
}


/* =========================================================
   BASELINE VALUES
   ========================================================= */

const BASELINE = {

    tomato: {
        yield: 4.8,
        water: 18000,
        profit: 142000
    },

    rice: {
        yield: 5.2,
        water: 24000,
        profit: 128000
    },

    wheat: {
        yield: 4.1,
        water: 16000,
        profit: 112000
    },

    soybean: {
        yield: 3.4,
        water: 13000,
        profit: 98000
    }

};


/* =========================================================
   SIMULATION
   ========================================================= */

function runSimulation() {

    const cropSelect =
        getElement("cropSelect");

    const irrigationRange =
        getElement("irrigationRange");

    const rainfallRange =
        getElement("rainfallRange");

    const temperatureRange =
        getElement("temperatureRange");

    const simulationButton =
        getElement("simulateButton");


    if (
        !cropSelect ||
        !irrigationRange ||
        !rainfallRange ||
        !temperatureRange ||
        !simulationButton
    ) {
        return;
    }


    const crop =
        cropSelect.value;

    const irrigation =
        Number(
            irrigationRange.value
        );

    const rainfall =
        Number(
            rainfallRange.value
        );

    const temperature =
        Number(
            temperatureRange.value
        );


    setSimulationLoading(
        simulationButton
    );


    /*
     * Prototype simulation.
     *
     * This is NOT the final ML model.
     *
     * Final SIH version:
     *
     * Frontend
     *     ↓
     * Spring Boot API
     *     ↓
     * ML model
     *     ↓
     * Prediction
     */


    setTimeout(() => {

        const baseline =
            BASELINE[crop];


        if (!baseline) {

            resetSimulationButton(
                simulationButton
            );

            return;
        }


        /*
         * -----------------------------------------------------
         * YIELD IMPACT
         * -----------------------------------------------------
         */


        let yieldImpact = 0;


        /*
         * Irrigation effect
         */

        yieldImpact +=
            irrigation * 0.10;


        /*
         * Rainfall effect
         */

        yieldImpact +=
            rainfall * 0.06;


        /*
         * Temperature penalty
         */

        const temperaturePenalty =
            Math.abs(temperature) * 0.8;

        yieldImpact -=
            temperaturePenalty;


        /*
         * Limit unrealistic result
         */

        yieldImpact =
            Math.max(
                -35,
                Math.min(
                    25,
                    yieldImpact
                )
            );


        /*
         * -----------------------------------------------------
         * WATER IMPACT
         * -----------------------------------------------------
         */

        let waterImpact =
            irrigation;


        /*
         * Rainfall can reduce irrigation need.
         */

        waterImpact -=
            rainfall * 0.35;


        waterImpact =
            Math.max(
                -45,
                Math.min(
                    50,
                    waterImpact
                )
            );


        /*
         * -----------------------------------------------------
         * PROFIT IMPACT
         * -----------------------------------------------------
         */

        let profitImpact =
            yieldImpact * 0.75;

        /*
         * Excess irrigation has additional cost.
         */

        if (irrigation > 0) {

            profitImpact -=
                irrigation * 0.10;
        }


        /*
         * Heavy rainfall can reduce profit.
         */

        if (rainfall < -20) {

            profitImpact -=
                5;
        }


        /*
         * Temperature stress
         */

        profitImpact -=
            temperaturePenalty * 0.35;


        profitImpact =
            Math.max(
                -40,
                Math.min(
                    30,
                    profitImpact
                )
            );


        /*
         * -----------------------------------------------------
         * FINAL VALUES
         * -----------------------------------------------------
         */

        const predictedYield =
            baseline.yield *
            (1 + yieldImpact / 100);


        const predictedWater =
            baseline.water *
            (1 + waterImpact / 100);


        const predictedProfit =
            baseline.profit *
            (1 + profitImpact / 100);


        /*
         * -----------------------------------------------------
         * UPDATE UI
         * -----------------------------------------------------
         */

        updateResult(
            "yieldResult",
            `${predictedYield.toFixed(1)} Ton`
        );

        updateChange(
            "yieldChange",
            yieldImpact
        );


        updateResult(
            "waterResult",
            formatNumber(
                Math.round(
                    predictedWater
                )
            ) + " L"
        );

        updateChange(
            "waterChange",
            waterImpact,
            true
        );


        updateResult(
            "profitResult",
            formatIndianCurrency(
                predictedProfit
            )
        );

        updateChange(
            "profitChange",
            profitImpact
        );


        /*
         * -----------------------------------------------------
         * AI RECOMMENDATION
         * -----------------------------------------------------
         */

        generateRecommendation(
            yieldImpact,
            waterImpact,
            profitImpact,
            irrigation,
            rainfall,
            temperature
        );


        resetSimulationButton(
            simulationButton
        );

    }, 900);
}


/* =========================================================
   UPDATE RESULT
   ========================================================= */

function updateResult(
    elementId,
    value
) {

    const element =
        getElement(elementId);

    if (!element) {
        return;
    }

    element.textContent =
        value;
}


/* =========================================================
   UPDATE CHANGE
   ========================================================= */

function updateChange(
    elementId,
    value,
    lowerIsBetter = false
) {

    const element =
        getElement(elementId);

    if (!element) {
        return;
    }


    element.classList.remove(
        "positive",
        "negative"
    );


    const rounded =
        Number(value).toFixed(1);


    if (value === 0) {

        element.textContent =
            "Baseline";

        return;
    }


    const sign =
        value > 0 ? "+" : "";


    /*
     * For water:
     *
     * Lower consumption = positive
     */

    const isPositive =
        lowerIsBetter
            ? value < 0
            : value > 0;


    element.classList.add(
        isPositive
            ? "positive"
            : "negative"
    );


    element.textContent =
        `${sign}${rounded}% vs baseline`;
}


/* =========================================================
   AI RECOMMENDATION
   ========================================================= */

function generateRecommendation(
    yieldImpact,
    waterImpact,
    profitImpact,
    irrigation,
    rainfall,
    temperature
) {

    const recommendation =
        getElement(
            "simulationRecommendation"
        );


    if (!recommendation) {
        return;
    }


    let message = "";


    /*
     * BEST CASE
     */

    if (
        profitImpact > 5 &&
        waterImpact <= 0
    ) {

        message =
            "This scenario appears favorable. " +
            "The model predicts improved profitability " +
            "while maintaining or reducing water consumption.";

    }


    /*
     * WATER SAVING
     */

    else if (
        waterImpact < -10 &&
        profitImpact >= 0
    ) {

        message =
            "The scenario can reduce water consumption " +
            "without significantly affecting expected profit. " +
            "This may be a suitable water-saving strategy.";

    }


    /*
     * TOO MUCH IRRIGATION
     */

    else if (
        irrigation > 25 &&
        yieldImpact < 5
    ) {

        message =
            "Increasing irrigation beyond this level " +
            "may provide limited yield improvement. " +
            "Consider a more efficient irrigation strategy.";

    }


    /*
     * HEAVY RAIN
     */

    else if (
        rainfall > 25 &&
        waterImpact < -10
    ) {

        message =
            "Higher rainfall may reduce irrigation demand. " +
            "Avoid unnecessary watering and monitor soil moisture.";

    }


    /*
     * TEMPERATURE STRESS
     */

    else if (
        Math.abs(temperature) >= 5
    ) {

        message =
            "The temperature change creates additional crop stress. " +
            "Consider selecting a more suitable crop or adjusting " +
            "irrigation and protection strategies.";

    }


    /*
     * NEGATIVE PROFIT
     */

    else if (
        profitImpact < -5
    ) {

        message =
            "This scenario may reduce farm profitability. " +
            "The model suggests comparing another combination " +
            "of irrigation, rainfall and temperature conditions.";

    }


    /*
     * DEFAULT
     */

    else {

        message =
            "The simulated conditions are relatively balanced. " +
            "Compare multiple scenarios before making a farming decision.";
    }


    recommendation.textContent =
        message;
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(number) {

    return Number(number)
        .toLocaleString("en-IN");
}


/* =========================================================
   FORMAT INDIAN CURRENCY
   ========================================================= */

function formatIndianCurrency(number) {

    const value =
        Number(number);


    if (value >= 100000) {

        return (
            "₹" +
            (value / 100000)
                .toFixed(2) +
            " L"
        );
    }


    if (value >= 1000) {

        return (
            "₹" +
            (value / 1000)
                .toFixed(1) +
            " K"
        );
    }


    return (
        "₹" +
        Math.round(value)
            .toLocaleString("en-IN")
    );
}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setSimulationLoading(
    button
) {

    button.disabled =
        true;

    button.dataset.originalText =
        button.textContent;

    button.textContent =
        "Running Simulation...";

    button.classList.add(
        "simulation-loading"
    );
}


/* =========================================================
   RESET BUTTON
   ========================================================= */

function resetSimulationButton(
    button
) {

    button.disabled =
        false;

    button.textContent =
        "Run AI Simulation →";

    button.classList.remove(
        "simulation-loading"
    );
}


/* =========================================================
   UPDATE FARM DATA
   ========================================================= */

function updateFarmMetrics() {

    const farmData =
        getFarmData();


    if (!farmData) {
        return;
    }


    /*
     * These values will later come
     * directly from IoT sensors.
     */

    const temperature =
        farmData.temperature || 28;

    const humidity =
        farmData.humidity || 67;

    const moisture =
        farmData.soilMoisture || 42;

    const ph =
        farmData.ph || 6.5;


    const temperatureElement =
        getElement(
            "twinTemperature"
        );

    const humidityElement =
        getElement(
            "twinHumidity"
        );

    const moistureElement =
        getElement(
            "twinMoisture"
        );

    const phElement =
        getElement(
            "twinPH"
        );


    if (temperatureElement) {
        temperatureElement.textContent =
            `${temperature}°C`;
    }

    if (humidityElement) {
        humidityElement.textContent =
            `${humidity}%`;
    }

    if (moistureElement) {
        moistureElement.textContent =
            `${moisture}%`;
    }

    if (phElement) {
        phElement.textContent =
            ph;
    }
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
        getElement(
            "logoutButton"
        );


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
   SIMULATION EVENTS
   ========================================================= */

function setupSimulation() {

    const button =
        getElement(
            "simulateButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        runSimulation
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


        loadUser();

        updateFarmMetrics();

        setupRangeInputs();

        setupSimulation();

        setupMobileSidebar();

        setupLogout();

    }
);