/* =========================================================
   SmartAgriTwin - Disease Detection JavaScript
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
   DISEASE DATA
   ========================================================= */

const diseaseData = {

    healthy: {
        name: "Healthy Leaf",
        confidence: 96,
        severity: "Low",
        recommendation:
            "The leaf appears healthy. Continue regular monitoring and maintain proper irrigation and nutrition."
    },

    blight: {
        name: "Leaf Blight",
        confidence: 91,
        severity: "High",
        recommendation:
            "Remove severely affected leaves, avoid excessive moisture on foliage, and consider appropriate disease management."
    },

    spot: {
        name: "Leaf Spot",
        confidence: 88,
        severity: "Medium",
        recommendation:
            "Monitor the affected area, improve air circulation, and avoid unnecessary overhead irrigation."
    },

    mildew: {
        name: "Powdery Mildew",
        confidence: 89,
        severity: "Medium",
        recommendation:
            "Improve ventilation around the crop and monitor humidity. Apply suitable treatment if the condition spreads."
    }
};


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

function setupImageUpload() {

    const imageInput =
        getElement("diseaseImage");

    const preview =
        getElement("imagePreview");

    const uploadArea =
        getElement("uploadArea");


    if (!imageInput) {
        return;
    }


    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];


            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                showDiseaseMessage(
                    "Please select a valid image file.",
                    "error"
                );

                imageInput.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = (event) => {

                if (preview) {

                    preview.src =
                        event.target.result;

                    preview.style.display =
                        "block";
                }


                if (uploadArea) {

                    uploadArea.classList.add(
                        "has-image"
                    );
                }


                showDiseaseMessage(
                    "Leaf image uploaded successfully.",
                    "success"
                );
            };


            reader.onerror = () => {

                showDiseaseMessage(
                    "Unable to read the selected image.",
                    "error"
                );
            };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================================
   DEMO DISEASE DETECTION
   ========================================================= */

function detectDisease() {

    const imageInput =
        getElement("diseaseImage");


    if (
        !imageInput ||
        !imageInput.files.length
    ) {

        showDiseaseMessage(
            "Please upload a leaf image first.",
            "error"
        );

        return;
    }


    /*
     * Demo AI result.
     *
     * This is frontend simulation only.
     * Real ML model/API can be connected later.
     */

    const diseases =
        Object.keys(diseaseData);


    const randomIndex =
        Math.floor(
            Math.random() * diseases.length
        );


    const selectedDisease =
        diseaseData[
            diseases[randomIndex]
        ];


    displayDiseaseResult(
        selectedDisease
    );
}


/* =========================================================
   DISPLAY DISEASE RESULT
   ========================================================= */

function displayDiseaseResult(result) {

    const resultSection =
        getElement("diseaseResult");

    const diseaseName =
        getElement("diseaseName");

    const confidence =
        getElement("diseaseConfidence");

    const severity =
        getElement("diseaseSeverity");

    const recommendation =
        getElement("diseaseRecommendation");


    if (diseaseName) {

        diseaseName.textContent =
            result.name;
    }


    if (confidence) {

        confidence.textContent =
            `${result.confidence}%`;
    }


    if (severity) {

        severity.textContent =
            result.severity;
    }


    if (recommendation) {

        recommendation.textContent =
            result.recommendation;
    }


    if (resultSection) {

        resultSection.style.display =
            "block";
    }
}


/* =========================================================
   CLEAR RESULT
   ========================================================= */

function clearDiseaseResult() {

    const resultSection =
        getElement("diseaseResult");

    const preview =
        getElement("imagePreview");

    const imageInput =
        getElement("diseaseImage");


    if (resultSection) {

        resultSection.style.display =
            "none";
    }


    if (preview) {

        preview.src = "";

        preview.style.display =
            "none";
    }


    if (imageInput) {

        imageInput.value = "";
    }


    showDiseaseMessage(
        "Image and result cleared.",
        "success"
    );
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showDiseaseMessage(
    message,
    type
) {

    let messageBox =
        getElement("diseaseMessage");


    if (!messageBox) {

        messageBox =
            document.createElement("div");


        messageBox.id =
            "diseaseMessage";


        const detectionButton =
            getElement("detectDiseaseButton");


        if (
            detectionButton &&
            detectionButton.parentElement
        ) {

            detectionButton.parentElement.appendChild(
                messageBox
            );
        }
    }


    if (!messageBox) {
        return;
    }


    messageBox.textContent =
        message;


    messageBox.style.marginTop =
        "10px";

    messageBox.style.fontSize =
        "11px";

    messageBox.style.color =
        type === "success"
            ? "#15803d"
            : "#dc2626";
}


/* =========================================================
   BUTTON CONTROLS
   ========================================================= */

function setupDiseaseControls() {

    const detectButton =
        getElement(
            "detectDiseaseButton"
        );

    const clearButton =
        getElement(
            "clearDiseaseButton"
        );


    if (detectButton) {

        detectButton.addEventListener(
            "click",
            detectDisease
        );
    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearDiseaseResult
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
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUserProfile();

        setupImageUpload();

        setupDiseaseControls();

        setupMobileSidebar();

        setupLogout();
    }
);