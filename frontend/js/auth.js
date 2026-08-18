/* =========================================================
   SmartAgriTwin - Authentication
   Frontend Demo Version
   ========================================================= */


/* =========================================================
   Utility Functions
   ========================================================= */

/**
 * Get an element safely by ID.
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
 * Show an error message.
 */
function showError(elementId, message) {
    const element = getElement(elementId);

    if (element) {
        element.textContent = message;
    }
}


/**
 * Clear an error message.
 */
function clearError(elementId) {
    const element = getElement(elementId);

    if (element) {
        element.textContent = "";
    }
}


/**
 * Show general form message.
 */
function showMessage(elementId, message, type) {
    const element = getElement(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className = `form-message show ${type}`;
}


/**
 * Clear general form message.
 */
function clearMessage(elementId) {
    const element = getElement(elementId);

    if (!element) {
        return;
    }

    element.textContent = "";
    element.className = "form-message";
}


/**
 * Basic email validation.
 */
function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/**
 * Validate Indian 10-digit mobile number.
 */
function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}


/**
 * Validate password strength.
 *
 * Minimum:
 * 8 characters
 * 1 uppercase
 * 1 lowercase
 * 1 number
 */
function isStrongPassword(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
    );
}


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

/**
 * Toggle password visibility.
 */
function setupPasswordToggle(buttonId, inputId) {
    const button = getElement(buttonId);
    const input = getElement(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", () => {

        const isPassword =
            input.type === "password";

        input.type = isPassword
            ? "text"
            : "password";

        button.textContent =
            isPassword ? "🙈" : "👁";

        button.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );
    });
}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const form = getElement("loginForm");

    if (!form) {
        return;
    }

    const emailInput = getElement("loginEmail");
    const passwordInput = getElement("loginPassword");

    const button = getElement("loginButton");
    const buttonText = getElement("loginButtonText");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        clearError("loginEmailError");
        clearError("loginPasswordError");
        clearMessage("loginMessage");


        const email =
            emailInput.value.trim().toLowerCase();

        const password =
            passwordInput.value;


        let isValid = true;


        /* Email validation */

        if (!email) {

            showError(
                "loginEmailError",
                "Email address is required."
            );

            isValid = false;

        } else if (!isValidEmail(email)) {

            showError(
                "loginEmailError",
                "Enter a valid email address."
            );

            isValid = false;
        }


        /* Password validation */

        if (!password) {

            showError(
                "loginPasswordError",
                "Password is required."
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        /* -------------------------------------------------
           DEMO AUTHENTICATION

           Temporary only.
           Later this will call the backend API.
           ------------------------------------------------- */

        const storedUser =
            JSON.parse(
                localStorage.getItem("smartAgriUser")
            );


        if (!storedUser) {

            showMessage(
                "loginMessage",
                "No account found. Please create an account first.",
                "error"
            );

            return;
        }


        if (
            storedUser.email !== email ||
            storedUser.password !== password
        ) {

            showMessage(
                "loginMessage",
                "Incorrect email or password.",
                "error"
            );

            return;
        }


        /* -------------------------------------------------
           Login successful
           ------------------------------------------------- */

        button.disabled = true;

        buttonText.textContent =
            "Signing in...";


        localStorage.setItem(
            "smartAgriLoggedIn",
            "true"
        );


        setTimeout(() => {

            window.location.href =
                "frontend/html/dashboard.html";

        }, 600);
    });
}


/* =========================================================
   REGISTER
   ========================================================= */

function setupRegister() {

    const form = getElement("registerForm");

    if (!form) {
        return;
    }

    const nameInput =
        getElement("registerName");

    const emailInput =
        getElement("registerEmail");

    const phoneInput =
        getElement("registerPhone");

    const passwordInput =
        getElement("registerPassword");

    const confirmPasswordInput =
        getElement("confirmPassword");


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        /* Clear previous errors */

        clearError("registerNameError");
        clearError("registerEmailError");
        clearError("registerPhoneError");
        clearError("registerPasswordError");
        clearError("confirmPasswordError");

        clearMessage("registerMessage");


        /* Get values */

        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim().toLowerCase();

        const phone =
            phoneInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        let isValid = true;


        /* Name */

        if (!name) {

            showError(
                "registerNameError",
                "Full name is required."
            );

            isValid = false;

        } else if (name.length < 2) {

            showError(
                "registerNameError",
                "Name must contain at least 2 characters."
            );

            isValid = false;
        }


        /* Email */

        if (!email) {

            showError(
                "registerEmailError",
                "Email address is required."
            );

            isValid = false;

        } else if (!isValidEmail(email)) {

            showError(
                "registerEmailError",
                "Enter a valid email address."
            );

            isValid = false;
        }


        /* Phone */

        if (!phone) {

            showError(
                "registerPhoneError",
                "Phone number is required."
            );

            isValid = false;

        } else if (!isValidPhone(phone)) {

            showError(
                "registerPhoneError",
                "Enter a valid 10-digit mobile number."
            );

            isValid = false;
        }


        /* Password */

        if (!password) {

            showError(
                "registerPasswordError",
                "Password is required."
            );

            isValid = false;

        } else if (!isStrongPassword(password)) {

            showError(
                "registerPasswordError",
                "Password must be 8+ characters with uppercase, lowercase and a number."
            );

            isValid = false;
        }


        /* Confirm password */

        if (!confirmPassword) {

            showError(
                "confirmPasswordError",
                "Please confirm your password."
            );

            isValid = false;

        } else if (password !== confirmPassword) {

            showError(
                "confirmPasswordError",
                "Passwords do not match."
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        /* -------------------------------------------------
           DEMO STORAGE

           Temporary only.
           Backend database will replace this later.
           ------------------------------------------------- */

        const existingUser =
            JSON.parse(
                localStorage.getItem("smartAgriUser")
            );


        if (
            existingUser &&
            existingUser.email === email
        ) {

            showMessage(
                "registerMessage",
                "An account with this email already exists.",
                "error"
            );

            return;
        }


        const user = {
            name: name,
            email: email,
            phone: phone,
            password: password
        };


        localStorage.setItem(
            "smartAgriUser",
            JSON.stringify(user)
        );


        showMessage(
            "registerMessage",
            "Account created successfully! Redirecting to login...",
            "success"
        );


        form.reset();


        setTimeout(() => {

            window.location.href =
                "../../index.html";

        }, 1200);
    });
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function setupForgotPassword() {

    const form =
        getElement("forgotPasswordForm");

    if (!form) {
        return;
    }


    const emailInput =
        getElement("forgotEmail");


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        clearError("forgotEmailError");
        clearMessage("forgotMessage");


        const email =
            emailInput.value.trim().toLowerCase();


        if (!email) {

            showError(
                "forgotEmailError",
                "Email address is required."
            );

            return;
        }


        if (!isValidEmail(email)) {

            showError(
                "forgotEmailError",
                "Enter a valid email address."
            );

            return;
        }


        const storedUser =
            JSON.parse(
                localStorage.getItem("smartAgriUser")
            );


        if (
            !storedUser ||
            storedUser.email !== email
        ) {

            showMessage(
                "forgotMessage",
                "No account was found with this email address.",
                "error"
            );

            return;
        }


        showMessage(
            "forgotMessage",
            "Demo reset request successful. Backend email service will be connected later.",
            "success"
        );


        form.reset();
    });
}


/* =========================================================
   INITIALIZE AUTH MODULE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupLogin();

    setupRegister();

    setupForgotPassword();


    /* Login password */

    setupPasswordToggle(
        "togglePassword",
        "loginPassword"
    );


    /* Register password */

    setupPasswordToggle(
        "toggleRegisterPassword",
        "registerPassword"
    );


    /* Confirm password */

    setupPasswordToggle(
        "toggleConfirmPassword",
        "confirmPassword"
    );

});

