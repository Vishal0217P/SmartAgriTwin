/* =========================================================
   SmartAgriTwin - Dashboard JavaScript
   ========================================================= */


/* =========================================================
   GET ELEMENT
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


/* =========================================================
   LOAD USER INFORMATION
   ========================================================= */

function loadUserInformation() {

    const storedUser =
        JSON.parse(
            localStorage.getItem("smartAgriUser")
        );

    const userName =
        getElement("userName");

    const welcomeName =
        getElement("welcomeName");


    /*
     * Demo user
     * Used until backend authentication is connected.
     */

    const defaultUser = {
        name: "Farmer"
    };


    const user =
        storedUser || defaultUser;


    if (userName) {

        userName.textContent =
            user.name;
    }


    if (welcomeName) {

        const firstName =
            user.name
                .trim()
                .split(" ")[0];

        welcomeName.textContent =
            firstName;
    }
}


/* =========================================================
   CURRENT DATE
   ========================================================= */

function displayCurrentDate() {

    const dateElement =
        getElement("currentDate");

    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    dateElement.textContent =
        formattedDate;
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

        sidebar.classList.add("open");

        overlay.classList.add("active");

        document.body.style.overflow =
            "hidden";
    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        overlay.classList.remove("active");

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


    const navigationLinks =
        sidebar.querySelectorAll("a");


    navigationLinks.forEach(
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

            window.location.href =
                "index.html";
        }
    );
}


/* =========================================================
   SOIL MOISTURE PROGRESS
   ========================================================= */

function updateSoilProgress() {

    const moistureElement =
        getElement("soilMoisture");

    const progressElement =
        getElement("soilProgress");


    if (
        !moistureElement ||
        !progressElement
    ) {
        return;
    }


    const moisture =
        Number(
            moistureElement.textContent
        );


    const safeValue =
        Math.max(
            0,
            Math.min(
                100,
                moisture
            )
        );


    progressElement.style.width =
        `${safeValue}%`;
}


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Authentication is intentionally
         * disabled during frontend development.
         *
         * It will be connected later with
         * the actual login/backend system.
         */

        loadUserInformation();

        displayCurrentDate();

        setupMobileSidebar();

        setupLogout();

        updateSoilProgress();
    }
);