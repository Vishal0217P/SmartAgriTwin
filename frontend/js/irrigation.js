/* =========================================================
   SmartAgriTwin - Irrigation JavaScript
   ========================================================= */


/* =========================================================
   HELPER
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
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


    if (userName) {
        userName.textContent =
            user.name;
    }
}


/* =========================================================
   IRRIGATION STATE
   ========================================================= */

const irrigationState = {

    soilMoisture: 42,

    pumpRunning: false,

    controlMode: "AUTO"
};


/* =========================================================
   UPDATE PUMP UI
   ========================================================= */

function updatePumpUI() {

    const pumpStatus =
        getElement("pumpStatus");

    const displayStatus =
        getElement("pumpDisplayStatus");

    const pumpCircle =
        getElement("pumpCircle");

    const systemStatus =
        getElement("systemStatus");


    if (irrigationState.pumpRunning) {

        if (pumpStatus) {

            pumpStatus.textContent =
                "ON";

            pumpStatus.classList.remove(
                "pump-off"
            );
        }


        if (displayStatus) {

            displayStatus.textContent =
                "Pump is ON";
        }


        if (pumpCircle) {

            pumpCircle.classList.add(
                "active"
            );
        }


        if (systemStatus) {

            systemStatus.textContent =
                "Irrigation Running";
        }

    } else {

        if (pumpStatus) {

            pumpStatus.textContent =
                "OFF";

            pumpStatus.classList.add(
                "pump-off"
            );
        }


        if (displayStatus) {

            displayStatus.textContent =
                "Pump is OFF";
        }


        if (pumpCircle) {

            pumpCircle.classList.remove(
                "active"
            );
        }


        if (systemStatus) {

            systemStatus.textContent =
                "System Ready";
        }
    }
}


/* =========================================================
   START PUMP
   ========================================================= */

function startPump() {

    irrigationState.pumpRunning =
        true;

    updatePumpUI();

    showNotification(
        "Irrigation pump started."
    );
}


/* =========================================================
   STOP PUMP
   ========================================================= */

function stopPump() {

    irrigationState.pumpRunning =
        false;

    updatePumpUI();

    showNotification(
        "Irrigation pump stopped."
    );
}


/* =========================================================
   AI IRRIGATION RECOMMENDATION
   ========================================================= */

function generateIrrigationRecommendation() {

    const moisture =
        irrigationState.soilMoisture;


    const decision =
        getElement("irrigationDecision");

    const reason =
        getElement("irrigationReason");

    const moistureStatus =
        getElement("moistureStatus");

    const waterAdvice =
        getElement("waterAdvice");


    if (!decision || !reason) {
        return;
    }


    if (moisture < 30) {

        decision.textContent =
            "Irrigation Recommended";

        reason.textContent =
            `Soil moisture is critically low at ${moisture}%. Irrigation should be started to reduce crop water stress.`;


        if (moistureStatus) {

            moistureStatus.textContent =
                "Soil moisture is below the recommended range.";
        }


        if (waterAdvice) {

            waterAdvice.textContent =
                "Soil moisture is low. Start irrigation and monitor the moisture level during the watering cycle.";
        }

        return;
    }


    if (moisture < 35) {

        decision.textContent =
            "Irrigation Recommended Soon";

        reason.textContent =
            `Soil moisture is ${moisture}%. The field is approaching the lower limit of the recommended range.`;


        if (moistureStatus) {

            moistureStatus.textContent =
                "Soil moisture is approaching the lower limit.";
        }


        if (waterAdvice) {

            waterAdvice.textContent =
                "Prepare the next irrigation cycle and continue monitoring soil moisture.";
        }

        return;
    }


    if (moisture > 60) {

        decision.textContent =
            "Do Not Irrigate";

        reason.textContent =
            `Soil moisture is high at ${moisture}%. Additional irrigation may cause unnecessary water usage or waterlogging.`;


        if (moistureStatus) {

            moistureStatus.textContent =
                "Soil moisture is above the recommended range.";
        }


        if (waterAdvice) {

            waterAdvice.textContent =
                "Avoid irrigation for now and monitor the field for excess moisture.";
        }

        return;
    }


    decision.textContent =
        "No Immediate Irrigation";

    reason.textContent =
        `Current soil moisture is ${moisture}%. Conditions are within the recommended range.`;


    if (moistureStatus) {

        moistureStatus.textContent =
            "Soil moisture is at an acceptable level.";
    }


    if (waterAdvice) {

        waterAdvice.textContent =
            "Current soil moisture is suitable. Continue monitoring before starting another irrigation cycle.";
    }
}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(message) {

    const existing =
        getElement("irrigationNotification");


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");


    notification.id =
        "irrigationNotification";


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.right =
        "20px";

    notification.style.bottom =
        "20px";

    notification.style.padding =
        "12px 16px";

    notification.style.borderRadius =
        "8px";

    notification.style.background =
        "#ffffff";

    notification.style.border =
        "1px solid #dfe5df";

    notification.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.08)";

    notification.style.fontSize =
        "12px";

    notification.style.fontWeight =
        "600";

    notification.style.zIndex =
        "9999";


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        if (notification) {
            notification.remove();
        }

    }, 2500);
}


/* =========================================================
   PUMP CONTROLS
   ========================================================= */

function setupPumpControls() {

    const startButton =
        getElement("startPumpButton");

    const stopButton =
        getElement("stopPumpButton");


    if (startButton) {

        startButton.addEventListener(
            "click",
            startPump
        );
    }


    if (stopButton) {

        stopButton.addEventListener(
            "click",
            stopPump
        );
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


    function openSidebar() {

        sidebar.classList.add(
            "open"
        );

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";
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
        openSidebar
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
   INITIALIZE IRRIGATION PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Authentication is disabled
         * during frontend development.
         */

        loadUserProfile();

        updatePumpUI();

        generateIrrigationRecommendation();

        setupPumpControls();

        setupMobileSidebar();

        setupLogout();
    }
);