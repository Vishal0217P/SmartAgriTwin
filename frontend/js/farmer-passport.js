/* =========================================================
   SmartAgriTwin - Farmer Passport JavaScript
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
        window.location.href = "../../index.html";
        return false;
    }

    return true;
}


/* =========================================================
   LOAD USER
   ========================================================= */

function loadUserProfile() {

    const storedUser =
        localStorage.getItem("smartAgriUser");

    let user = {
        name: "Farmer",
        location: "Pune, Maharashtra",
        farmerId: "SAT-FR-00124"
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
                "Unable to read stored user:",
                error
            );

        }
    }


    const userName =
        getElement("userName");

    const passportName =
        getElement("passportName");

    const passportLocation =
        getElement("passportLocation");

    const farmerId =
        getElement("farmerId");


    if (userName) {
        userName.textContent =
            user.name;
    }

    if (passportName) {
        passportName.textContent =
            user.name;
    }

    if (passportLocation) {
        passportLocation.textContent =
            `📍 ${user.location}`;
    }

    if (farmerId && user.farmerId) {
        farmerId.textContent =
            user.farmerId;
    }
}


/* =========================================================
   EDIT PROFILE
   ========================================================= */

function setupEditProfile() {

    const button =
        getElement("editProfileButton");

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const storedUser =
                localStorage.getItem(
                    "smartAgriUser"
                );


            let user = {
                name: "Farmer",
                location: "Pune, Maharashtra",
                farmerId: "SAT-FR-00124"
            };


            if (storedUser) {

                try {

                    user = {
                        ...user,
                        ...JSON.parse(storedUser)
                    };

                } catch (error) {

                    console.error(error);

                }
            }


            const newName =
                prompt(
                    "Enter farmer name:",
                    user.name
                );


            if (
                newName === null ||
                newName.trim() === ""
            ) {
                return;
            }


            const newLocation =
                prompt(
                    "Enter location:",
                    user.location
                );


            if (
                newLocation === null ||
                newLocation.trim() === ""
            ) {
                return;
            }


            user.name =
                newName.trim();

            user.location =
                newLocation.trim();


            localStorage.setItem(
                "smartAgriUser",
                JSON.stringify(user)
            );


            loadUserProfile();


            showMessage(
                "Profile updated successfully."
            );

        }
    );
}


/* =========================================================
   VIEW PASSPORT
   ========================================================= */

function setupViewPassport() {

    const button =
        getElement(
            "downloadPassportButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            window.print();

        }
    );
}


/* =========================================================
   PRINT STYLING
   ========================================================= */

function setupPrintMode() {

    const printStyle =
        document.createElement("style");


    printStyle.textContent = `
        @media print {

            .sidebar,
            .topbar,
            .profile-actions,
            .passport-status,
            .sidebar-overlay,
            .notification-button {
                display: none !important;
            }

            .main-content {
                margin: 0 !important;
                width: 100% !important;
            }

            .dashboard-content {
                padding: 20px !important;
            }

            .passport-page-header {
                margin-bottom: 20px !important;
            }

            body {
                background: white !important;
            }

            .passport-card,
            .passport-profile-card,
            .ai-passport-card {
                box-shadow: none !important;
                break-inside: avoid;
            }

        }
    `;


    document.head.appendChild(
        printStyle
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
                "../../index.html";

        }
    );
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message) {

    const existing =
        document.querySelector(
            ".passport-message"
        );


    if (existing) {
        existing.remove();
    }


    const messageBox =
        document.createElement("div");


    messageBox.className =
        "passport-message";


    messageBox.textContent =
        message;


    messageBox.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 9999;
        padding: 12px 16px;
        border-radius: 8px;
        background: #166534;
        color: white;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    `;


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        () => {

            messageBox.remove();

        },
        2500
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

        setupEditProfile();

        setupViewPassport();

        setupPrintMode();

        setupMobileSidebar();

        setupLogout();

    }
);
