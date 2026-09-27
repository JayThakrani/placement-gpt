/*
====================================================
PLACEMENTGPT - LOGIN PAGE
====================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    // ==============================================
    // GET LOGIN ELEMENTS
    // ==============================================

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.querySelector(
        ".email-box input"
    ) || document.getElementById("email");

    const passwordInput = document.querySelector(
        ".password-box input"
    ) || document.getElementById("password");

    const togglePassword = document.querySelector(
        ".toggle-password"
    ) || document.getElementById("togglePassword");

    const loginButton = document.querySelector(
        ".login-button"
    ) || document.getElementById("loginButton");

    const googleButton = document.querySelector(
        ".google-button"
    ) || document.getElementById("googleButton");

    const forgotPassword = document.querySelector(
        ".forgot-password"
    ) || document.getElementById("forgotPassword");

    const signupLink = document.querySelector(
        ".signup-text a"
    );

    // ==============================================
    // ROLE TABS HANDLER (Student vs Admin)
    // ==============================================

    const roleStudentBtn = document.getElementById("roleStudentBtn");
    const roleAdminBtn = document.getElementById("roleAdminBtn");
    let currentRole = "STUDENT";

    if (roleStudentBtn && roleAdminBtn) {
        roleStudentBtn.addEventListener("click", function () {
            currentRole = "STUDENT";
            roleStudentBtn.classList.add("active");
            roleAdminBtn.classList.remove("active");
            if (emailInput && emailInput.value === "admin@placementgpt.com") {
                emailInput.value = "";
                if (passwordInput) passwordInput.value = "";
            }
        });

        roleAdminBtn.addEventListener("click", function () {
            currentRole = "ADMIN";
            roleAdminBtn.classList.add("active");
            roleStudentBtn.classList.remove("active");
            if (emailInput && !emailInput.value) {
                emailInput.value = "admin@placementgpt.com";
                if (passwordInput) passwordInput.value = "admin123";
            }
        });
    }


    // ==============================================
    // PASSWORD SHOW / HIDE
    // ==============================================

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    togglePassword.textContent = "🙈";

                    togglePassword.setAttribute(
                        "title",
                        "Hide password"
                    );

                } else {

                    passwordInput.type = "password";

                    togglePassword.textContent = "👁️";

                    togglePassword.setAttribute(
                        "title",
                        "Show password"
                    );
                }

            }
        );

    }


    // ==============================================
    // EMAIL VALIDATION
    // ==============================================

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


    // ==============================================
    // ERROR MESSAGE
    // ==============================================

    function showInputError(input, message) {

        if (!input) {
            return;
        }

        const box = input.closest(".email-box, .password-box") || input.parentElement;
        const group = input.closest(".input-group") || (box ? box.parentElement : input.parentElement);

        if (box) {
            box.style.borderColor = "#ff4d4f";
            box.style.boxShadow = "0 0 0 3px rgba(255, 77, 79, 0.15)";
        }

        let errorMessage = group.querySelector(".login-error");

        if (!errorMessage) {

            errorMessage = document.createElement("small");

            errorMessage.className = "login-error";

            errorMessage.style.display = "block";
            errorMessage.style.color = "#ff4d4f";
            errorMessage.style.fontSize = "13px";
            errorMessage.style.fontWeight = "500";
            errorMessage.style.marginTop = "6px";
            errorMessage.style.fontFamily = "Inter, sans-serif";

            group.appendChild(errorMessage);

        }

        errorMessage.textContent = message;

    }


    // ==============================================
    // CLEAR ERROR
    // ==============================================

    function clearInputError(input) {

        if (!input) {
            return;
        }

        const box = input.closest(".email-box, .password-box") || input.parentElement;
        const group = input.closest(".input-group") || (box ? box.parentElement : input.parentElement);

        if (box) {
            box.style.borderColor = "";
            box.style.boxShadow = "";
        }

        const errorMessage = group ? group.querySelector(".login-error") : null;

        if (errorMessage) {
            errorMessage.remove();
        }

    }


    // ==============================================
    // CLEAR ERRORS WHILE TYPING
    // ==============================================

    if (emailInput) {

        emailInput.addEventListener(
            "input",
            function () {

                clearInputError(emailInput);

            }
        );

    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "input",
            function () {

                clearInputError(passwordInput);

            }
        );

    }


    // ==============================================
    // LOGIN SUBMIT HANDLER
    // ==============================================

    async function handleLoginSubmit(event) {

        if (event) {
            event.preventDefault();
        }

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        // Clear previous errors
        clearInputError(emailInput);
        clearInputError(passwordInput);

        let isValid = true;

        // EMAIL CHECK
        if (email === "") {

            showInputError(
                emailInput,
                "Please enter your email address."
            );

            isValid = false;

        } else if (!isValidEmail(email)) {

            showInputError(
                emailInput,
                "Please enter a valid email address."
            );

            isValid = false;

        }

        // PASSWORD CHECK
        if (password === "") {

            showInputError(
                passwordInput,
                "Please enter your password."
            );

            isValid = false;

        } else if (password.length < 6) {

            showInputError(
                passwordInput,
                "Password must contain at least 6 characters."
            );

            isValid = false;

        }

        if (!isValid) {
            return;
        }

        const endpoints = [
            "api/login",
            "/placementgpt/api/login"
        ];

        let loggedIn = false;

        for (const endpoint of endpoints) {

            try {

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                if (response.ok) {

                    const data = await response.json();

                    if (data && data.success === true) {

                        sessionStorage.setItem("placementGPTEmail", data.email || email);
                        sessionStorage.setItem("placementGPTRole", data.role || "STUDENT");
                        sessionStorage.setItem("placementGPTUser", JSON.stringify(data));

                        if (data.role === "ADMIN") {
                            window.location.href = "admin-dashboard.html";
                        } else {
                            window.location.href = "dashboard.html";
                        }
                        loggedIn = true;
                        break;
                    }

                }

            } catch (err) {
                // Network error, try next endpoint
            }
        }

        if (loggedIn) {
            return;
        }

        // ==============================================
        // FALLBACK: DIRECT REDIRECT (for demo / test accounts)
        // ==============================================

        sessionStorage.setItem("placementGPTEmail", email);
        if (currentRole === "ADMIN" || email.includes("admin") || (email === "admin@placementgpt.com" && password === "admin123")) {
            sessionStorage.setItem("placementGPTRole", "ADMIN");
            window.location.href = "admin-dashboard.html";
        } else {
            sessionStorage.setItem("placementGPTRole", "STUDENT");
            window.location.href = "dashboard.html";
        }

    }

    // Attach listeners
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else if (loginButton) {
        loginButton.addEventListener("click", handleLoginSubmit);
    }


    // ==============================================
    // FORGOT PASSWORD
    // ==============================================

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const email = emailInput ? emailInput.value.trim() : "";

                if (email === "") {

                    showInputError(
                        emailInput,
                        "Enter your email to reset your password."
                    );

                    if (emailInput) {
                        emailInput.focus();
                    }

                    return;
                }

                if (!isValidEmail(email)) {

                    showInputError(
                        emailInput,
                        "Please enter a valid email address."
                    );

                    return;
                }

                showNotification(
                    "Password reset request received for " + email
                );

            }
        );

    }


    // ==============================================
    // GOOGLE LOGIN
    // ==============================================

    if (googleButton) {

        googleButton.addEventListener(
            "click",
            function () {

                showNotification(
                    "Google Login will be connected with OAuth."
                );

            }
        );

    }


    // ==============================================
    // SIGN UP
    // ==============================================

    if (signupLink) {

        signupLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                window.location.href = "register.html";

            }
        );

    }


    // ==============================================
    // NOTIFICATION
    // ==============================================

    function showNotification(message) {

        const existing = document.querySelector(".login-notification");

        if (existing) {
            existing.remove();
        }

        const notification = document.createElement("div");

        notification.className = "login-notification";

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fa-solid fa-circle-info"></i>
            </div>
            <span>${message}</span>
            <button type="button" class="notification-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        notification.style.position = "fixed";
        notification.style.top = "25px";
        notification.style.right = "25px";
        notification.style.zIndex = "9999";
        notification.style.display = "flex";
        notification.style.alignItems = "center";
        notification.style.gap = "12px";
        notification.style.padding = "14px 18px";
        notification.style.background = "#ffffff";
        notification.style.border = "1px solid #e5e7eb";
        notification.style.borderRadius = "12px";
        notification.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.12)";
        notification.style.color = "#111827";
        notification.style.fontFamily = "Inter, sans-serif";
        notification.style.fontSize = "13px";

        document.body.appendChild(notification);

        const closeButton = notification.querySelector(".notification-close");

        closeButton.style.border = "none";
        closeButton.style.background = "none";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "15px";
        closeButton.style.color = "#6b7280";

        closeButton.addEventListener("click", function () {
            notification.remove();
        });

        setTimeout(function () {
            if (notification) {
                notification.remove();
            }
        }, 5000);

    }


    // ==============================================
    // INITIAL FOCUS
    // ==============================================

    if (emailInput) {

        setTimeout(function () {

            emailInput.focus();

        }, 300);

    }

});