/* =========================================================
   SmartAgriTwin - Crop & Soil JavaScript
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

    const userData =
        JSON.parse(
            localStorage.getItem("smartAgriUser")
        );

    const userName =
        getElement("userName");

    if (
        userName &&
        userData &&
        userData.name
    ) {

        userName.textContent =
            userData.name;
    }
}


/* =========================================================
   FARM DATA
   ========================================================= */

function getFarmData() {

    const savedData =
        localStorage.getItem("smartAgriFarmData");

    if (!savedData) {
        return null;
    }

    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error(
            "Unable to read farm data:",
            error
        );

        return null;
    }
}


/* =========================================================
   LOAD FARM DATA
   ========================================================= */

function loadFarmData() {

    const farmData =
        getFarmData();

    if (!farmData) {
        return;
    }


    const farmName =
        getElement("farmName");

    const farmArea =
        getElement("farmArea");

    const soilType =
        getElement("soilType");

    const irrigationType =
        getElement("irrigationType");


    if (farmName) {
        farmName.value =
            farmData.farmName || "";
    }

    if (farmArea) {
        farmArea.value =
            farmData.farmArea || "";
    }

    if (soilType) {
        soilType.value =
            farmData.soilType || "";
    }

    if (irrigationType) {
        irrigationType.value =
            farmData.irrigationType || "";
    }
}


/* =========================================================
   CLEAR ERRORS
   ========================================================= */

function clearErrors() {

    const errors =
        document.querySelectorAll(
            ".field-error"
        );

    errors.forEach((error) => {

        error.textContent = "";

    });
}


/* =========================================================
   VALIDATE FARM DATA
   ========================================================= */

function validateFarmData() {

    clearErrors();

    let isValid = true;


    const farmName =
        getElement("farmName");

    const farmArea =
        getElement("farmArea");

    const soilType =
        getElement("soilType");


    const farmNameError =
        getElement("farmNameError");

    const farmAreaError =
        getElement("farmAreaError");


    /* ---------- Farm Name ---------- */

    if (
        !farmName ||
        farmName.value.trim() === ""
    ) {

        if (farmNameError) {

            farmNameError.textContent =
                "Please enter your farm name.";
        }

        isValid = false;
    }


    /* ---------- Farm Area ---------- */

    if (
        !farmArea ||
        farmArea.value.trim() === ""
    ) {

        if (farmAreaError) {

            farmAreaError.textContent =
                "Please enter the farm area.";
        }

        isValid = false;

    } else if (
        Number(farmArea.value) <= 0
    ) {

        if (farmAreaError) {

            farmAreaError.textContent =
                "Farm area must be greater than 0.";
        }

        isValid = false;
    }


    /* ---------- Soil Type ---------- */

    if (
        !soilType ||
        soilType.value === ""
    ) {

        isValid = false;

        /*
         * Soil type does not currently have
         * a dedicated error element.
         *
         * We highlight the field instead.
         */

        soilType?.classList.add(
            "input-error"
        );

    }


    return isValid;
}


/* =========================================================
   SAVE FARM DATA
   ========================================================= */

function saveFarmData() {

    if (!validateFarmData()) {

        showMessage(
            "Please complete the required farm details.",
            "error"
        );

        return;
    }


    const farmData = {

        farmName:
            getElement("farmName").value.trim(),

        farmArea:
            Number(
                getElement("farmArea").value
            ),

        soilType:
            getElement("soilType").value,

        irrigationType:
            getElement("irrigationType").value,

        updatedAt:
            new Date().toISOString()
    };


    localStorage.setItem(
        "smartAgriFarmData",
        JSON.stringify(farmData)
    );


    showMessage(
        "Farm data saved successfully.",
        "success"
    );
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message, type) {

    let messageBox =
        getElement("saveMessage");


    /*
     * Create message element if it
     * doesn't already exist.
     */

    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "saveMessage";

        messageBox.style.marginTop =
            "12px";

        messageBox.style.fontSize =
            "11px";

        const button =
            getElement("saveFarmButton");

        if (button) {

            button.parentElement.appendChild(
                messageBox
            );
        }
    }


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;

    messageBox.style.color =
        type === "success"
            ? "#15803d"
            : "#dc2626";


    /*
     * Automatically remove message
     * after 3 seconds.
     */

    setTimeout(() => {

        if (messageBox) {
            messageBox.textContent = "";
        }

    }, 3000);
}


/* =========================================================
   REMOVE INPUT ERROR
   ========================================================= */

function setupInputListeners() {

    const inputs =
        document.querySelectorAll(
            "input, select"
        );


    inputs.forEach((input) => {

        input.addEventListener(
            "input",
            () => {

                input.classList.remove(
                    "input-error"
                );

            }
        );


        input.addEventListener(
            "change",
            () => {

                input.classList.remove(
                    "input-error"
                );

            }
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


    const links =
        sidebar.querySelectorAll(
            "a"
        );


    links.forEach((link) => {

        link.addEventListener(
            "click",
            closeSidebar
        );

    });


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
}


/* =========================================================
   SAVE BUTTON
   ========================================================= */

function setupSaveButton() {

    const saveButton =
        getElement("saveFarmButton");

    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        saveFarmData
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

        loadFarmData();

        setupSaveButton();

        setupInputListeners();

        setupLogout();

        setupMobileSidebar();

    }
);