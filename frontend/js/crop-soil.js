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
   LOAD USER
   ========================================================= */

function loadUser() {

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
   FARM DATA
   ========================================================= */

function getFarmData() {

    const savedData =
        localStorage.getItem(
            "smartAgriFarmData"
        );


    if (!savedData) {
        return null;
    }


    try {

        return JSON.parse(
            savedData
        );

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
   CLEAR VALIDATION ERRORS
   ========================================================= */

function clearErrors() {

    const errors =
        document.querySelectorAll(
            ".field-error"
        );


    errors.forEach((error) => {

        error.textContent = "";
    });


    const invalidInputs =
        document.querySelectorAll(
            ".input-error"
        );


    invalidInputs.forEach((input) => {

        input.classList.remove(
            "input-error"
        );
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

    const soilTypeError =
        getElement("soilTypeError");


    /* -----------------------------------------------------
       FARM NAME
       ----------------------------------------------------- */

    if (
        !farmName ||
        farmName.value.trim() === ""
    ) {

        if (farmNameError) {

            farmNameError.textContent =
                "Please enter your farm name.";
        }

        if (farmName) {

            farmName.classList.add(
                "input-error"
            );
        }

        isValid = false;
    }


    /* -----------------------------------------------------
       FARM AREA
       ----------------------------------------------------- */

    if (
        !farmArea ||
        farmArea.value.trim() === ""
    ) {

        if (farmAreaError) {

            farmAreaError.textContent =
                "Please enter the farm area.";
        }

        if (farmArea) {

            farmArea.classList.add(
                "input-error"
            );
        }

        isValid = false;

    } else if (
        Number(farmArea.value) <= 0
    ) {

        if (farmAreaError) {

            farmAreaError.textContent =
                "Farm area must be greater than 0.";
        }

        farmArea.classList.add(
            "input-error"
        );

        isValid = false;
    }


    /* -----------------------------------------------------
       SOIL TYPE
       ----------------------------------------------------- */

    if (
        !soilType ||
        soilType.value === ""
    ) {

        if (soilTypeError) {

            soilTypeError.textContent =
                "Please select the soil type.";
        }

        if (soilType) {

            soilType.classList.add(
                "input-error"
            );
        }

        isValid = false;
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
            getElement("farmName")
                .value
                .trim(),

        farmArea:
            Number(
                getElement("farmArea")
                    .value
            ),

        soilType:
            getElement("soilType")
                .value,

        irrigationType:
            getElement("irrigationType")
                .value,

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


        if (
            button &&
            button.parentElement
        ) {

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


    setTimeout(() => {

        if (messageBox) {

            messageBox.textContent =
                "";
        }

    }, 3000);
}


/* =========================================================
   INPUT LISTENERS
   ========================================================= */

function setupInputListeners() {

    const inputs =
        document.querySelectorAll(
            "input, select"
        );


    inputs.forEach((input) => {

        const removeError = () => {

            input.classList.remove(
                "input-error"
            );


            const errorElement =
                getElement(
                    `${input.id}Error`
                );


            if (errorElement) {

                errorElement.textContent =
                    "";
            }
        };


        input.addEventListener(
            "input",
            removeError
        );


        input.addEventListener(
            "change",
            removeError
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
   INITIALIZE CROP & SOIL PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Authentication is intentionally
         * disabled during frontend development.
         */

        loadUser();

        loadFarmData();

        setupSaveButton();

        setupInputListeners();

        setupLogout();

        setupMobileSidebar();
    }
);