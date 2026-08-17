/* =========================================================
   SmartAgriTwin - Analytics JavaScript
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
   ANALYTICS DATA
   ========================================================= */

const analyticsData = {

    7: {
        productivity: "4.8 Ton/Ha",
        productivityChange: "↑ 8.4% vs last period",

        water: "82%",
        waterChange: "↑ 12.2% improvement",

        profit: "₹1.42 L",
        profitChange: "↑ 6.7% vs last period",

        health: "86/100",
        healthChange: "↑ 4 points",

        waterTotal: "18,000 L"
    },


    30: {
        productivity: "4.6 Ton/Ha",
        productivityChange: "↑ 6.8% vs last period",

        water: "79%",
        waterChange: "↑ 9.5% improvement",

        profit: "₹1.36 L",
        profitChange: "↑ 5.2% vs last period",

        health: "84/100",
        healthChange: "↑ 3 points",

        waterTotal: "76,500 L"
    },


    90: {
        productivity: "4.3 Ton/Ha",
        productivityChange: "↑ 11.4% vs previous period",

        water: "75%",
        waterChange: "↑ 15.8% improvement",

        profit: "₹1.28 L",
        profitChange: "↑ 9.1% vs previous period",

        health: "81/100",
        healthChange: "↑ 6 points",

        waterTotal: "228,000 L"
    }

};


/* =========================================================
   SUMMARY ELEMENTS
   ========================================================= */

const summaryElements = {

    productivity: {
        value: null,
        change: null
    },

    water: {
        value: null,
        change: null
    },

    profit: {
        value: null,
        change: null
    },

    health: {
        value: null,
        change: null
    },

    waterTotal: null

};


/* =========================================================
   CACHE ELEMENTS
   ========================================================= */

function cacheElements() {

    const summaryCards =
        document.querySelectorAll(
            ".analytics-summary-card"
        );


    if (summaryCards.length >= 4) {

        summaryElements.productivity.value =
            summaryCards[0].querySelector("strong");

        summaryElements.productivity.change =
            summaryCards[0].querySelector("small");


        summaryElements.water.value =
            summaryCards[1].querySelector("strong");

        summaryElements.water.change =
            summaryCards[1].querySelector("small");


        summaryElements.profit.value =
            summaryCards[2].querySelector("strong");

        summaryElements.profit.change =
            summaryCards[2].querySelector("small");


        summaryElements.health.value =
            summaryCards[3].querySelector("strong");

        summaryElements.health.change =
            summaryCards[3].querySelector("small");
    }


    summaryElements.waterTotal =
        document.querySelector(
            ".analytics-chart-card:nth-child(2) .chart-value"
        );
}


/* =========================================================
   UPDATE ANALYTICS
   ========================================================= */

function updateAnalytics(period) {

    const data =
        analyticsData[period];

    if (!data) {
        return;
    }


    /* Productivity */

    if (summaryElements.productivity.value) {

        summaryElements.productivity.value.textContent =
            data.productivity;

        summaryElements.productivity.change.textContent =
            data.productivityChange;
    }


    /* Water */

    if (summaryElements.water.value) {

        summaryElements.water.value.textContent =
            data.water;

        summaryElements.water.change.textContent =
            data.waterChange;
    }


    /* Profit */

    if (summaryElements.profit.value) {

        summaryElements.profit.value.textContent =
            data.profit;

        summaryElements.profit.change.textContent =
            data.profitChange;
    }


    /* Farm Health */

    if (summaryElements.health.value) {

        summaryElements.health.value.textContent =
            data.health;

        summaryElements.health.change.textContent =
            data.healthChange;
    }


    /* Water chart total */

    if (summaryElements.waterTotal) {

        summaryElements.waterTotal.textContent =
            data.waterTotal;
    }


    updateChart(period);

    updateInsights(period);

}


/* =========================================================
   PERIOD BUTTONS
   ========================================================= */

function setupPeriodButtons() {

    const buttons =
        document.querySelectorAll(
            ".period-button"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const period =
                        Number(
                            button.dataset.period
                        );


                    updateAnalytics(
                        period
                    );

                }
            );

        }
    );
}


/* =========================================================
   UPDATE PRODUCTIVITY CHART
   ========================================================= */

function updateChart(period) {

    const svg =
        document.querySelector(
            ".line-chart svg"
        );

    if (!svg) {
        return;
    }


    const polyline =
        svg.querySelector(
            "polyline"
        );

    const circles =
        svg.querySelectorAll(
            "circle"
        );


    let points;


    if (period === 7) {

        points =
            "0,190 100,165 200,175 300,135 " +
            "400,145 500,95 600,105 700,65";

    } else if (period === 30) {

        points =
            "0,200 100,185 200,175 300,160 " +
            "400,145 500,125 600,95 700,70";

    } else {

        points =
            "0,210 100,195 200,180 300,160 " +
            "400,140 500,115 600,90 700,55";
    }


    polyline.setAttribute(
        "points",
        points
    );


    const pointValues =
        points
            .split(" ")
            .map(
                (point) =>
                    point.split(",")
            );


    circles.forEach(
        (circle, index) => {

            if (!pointValues[index]) {
                return;
            }

            circle.setAttribute(
                "cx",
                pointValues[index][0]
            );

            circle.setAttribute(
                "cy",
                pointValues[index][1]
            );

        }
    );
}


/* =========================================================
   UPDATE INSIGHTS
   ========================================================= */

function updateInsights(period) {

    const insightItems =
        document.querySelectorAll(
            ".insight-item"
        );


    if (insightItems.length < 3) {
        return;
    }


    if (period === 7) {

        insightItems[0]
            .querySelector("strong")
            .textContent =
            "Water efficiency improved";

        insightItems[0]
            .querySelector("p")
            .textContent =
            "Your irrigation efficiency has improved " +
            "by 12.2% compared with the previous " +
            "monitoring period.";


        insightItems[1]
            .querySelector("strong")
            .textContent =
            "Crop productivity is increasing";

        insightItems[1]
            .querySelector("p")
            .textContent =
            "Current crop growth conditions indicate " +
            "an upward productivity trend.";


        insightItems[2]
            .querySelector("strong")
            .textContent =
            "Monitor rainfall conditions";

        insightItems[2]
            .querySelector("p")
            .textContent =
            "Recent weather variation may affect " +
            "irrigation requirements during the next " +
            "few days.";

    }


    else if (period === 30) {

        insightItems[0]
            .querySelector("strong")
            .textContent =
            "Monthly water usage is improving";

        insightItems[0]
            .querySelector("p")
            .textContent =
            "Water efficiency remained positive across " +
            "the selected 30-day monitoring period.";


        insightItems[1]
            .querySelector("strong")
            .textContent =
            "Stable crop productivity";

        insightItems[1]
            .querySelector("p")
            .textContent =
            "The crop maintained stable productivity " +
            "with moderate improvement over the period.";


        insightItems[2]
            .querySelector("strong")
            .textContent =
            "Review irrigation patterns";

        insightItems[2]
            .querySelector("p")
            .textContent =
            "Historical irrigation patterns can be used " +
            "to optimize future water scheduling.";

    }


    else {

        insightItems[0]
            .querySelector("strong")
            .textContent =
            "Long-term water efficiency improved";

        insightItems[0]
            .querySelector("p")
            .textContent =
            "The farm shows a sustained improvement " +
            "in water-use efficiency over the selected period.";


        insightItems[1]
            .querySelector("strong")
            .textContent =
            "Productivity trend is positive";

        insightItems[1]
            .querySelector("p")
            .textContent =
            "Long-term data indicates gradual improvement " +
            "in crop productivity.";


        insightItems[2]
            .querySelector("strong")
            .textContent =
            "Use historical data for planning";

        insightItems[2]
            .querySelector("p")
            .textContent =
            "Long-term farm records can support better " +
            "crop planning, irrigation and resource allocation.";

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
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkAuthentication()) {
            return;
        }


        cacheElements();

        loadUser();

        setupPeriodButtons();

        setupMobileSidebar();

        setupLogout();

        updateAnalytics(7);

    }
);