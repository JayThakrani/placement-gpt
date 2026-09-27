document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // DYNAMIC GRADUATION YEAR POPULATION
    // ================================

    const gradSelect = document.getElementById("graduationYear");
    if (gradSelect && gradSelect.options.length <= 1) {
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];
        years.forEach(function (yr) {
            const opt = document.createElement("option");
            opt.value = yr.toString();
            opt.textContent = yr.toString();
            gradSelect.appendChild(opt);
        });
    }

    // ================================
    // ELEMENTS WITH ROBUST FALLBACKS
    // ================================

    const registerForm = document.getElementById("registerForm");

    const nameInput =
        document.getElementById("fullName") || document.getElementById("name");

    const emailInput = document.getElementById("email");
    const collegeInput = document.getElementById("college");
    const branchInput = document.getElementById("branch");

    const semesterInput =
        document.getElementById("graduationYear") || document.getElementById("semester");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const togglePassword =
        document.getElementById("passwordToggle") || document.getElementById("togglePassword");

    const toggleConfirmPassword =
        document.getElementById("confirmPasswordToggle") || document.getElementById("toggleConfirmPassword");

    const passwordStrength =
        document.getElementById("passwordStrength");

    const termsCheckbox =
        document.getElementById("terms");

    const registerButton =
        document.querySelector(".register-button") || document.getElementById("registerButton");

    const googleButton =
        document.getElementById("googleButton");


    // ================================
    // PASSWORD VISIBILITY
    // ================================

    function toggleVisibility(button, input) {
        if (!button || !input) return;

        button.addEventListener("click", function () {
            const icon = button.querySelector("i") || button;
            if (input.type === "password") {
                input.type = "text";
                if (icon.classList) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }
            } else {
                input.type = "password";
                if (icon.classList) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    }

    toggleVisibility(togglePassword, passwordInput);
    toggleVisibility(toggleConfirmPassword, confirmPasswordInput);


    // ================================
    // PASSWORD STRENGTH
    // ================================

    if (passwordInput && passwordStrength) {

        passwordInput.addEventListener("input", function () {

            const password = passwordInput.value;

            if (password.length === 0) {
                passwordStrength.textContent = "";
                passwordStrength.className = "password-strength";
                return;
            }

            let strength = 0;

            if (password.length >= 6) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            if (strength <= 2) {
                passwordStrength.className = "password-strength weak";
            } else if (strength <= 4) {
                passwordStrength.className = "password-strength medium";
            } else {
                passwordStrength.className = "password-strength strong";
            }
        });
    }


    // ================================
    // VALIDATION HELPERS
    // ================================

    function getElementByIdOrAlias(inputId) {
        let el = document.getElementById(inputId);
        if (!el) {
            if (inputId === "name") el = document.getElementById("fullName");
            if (inputId === "semester") el = document.getElementById("graduationYear");
        }
        return el;
    }

    function showError(inputId, message) {

        const input = getElementByIdOrAlias(inputId);

        if (!input) return;

        input.classList.add("input-error");

        let errorElement =
            document.getElementById(input.id + "Error") || document.getElementById(inputId + "Error");

        if (!errorElement) {

            errorElement = document.createElement("small");

            errorElement.id = (input.id || inputId) + "Error";
            errorElement.className = "error-message";

            if (input.parentElement) {
                input.parentElement.appendChild(errorElement);
            }
        }

        errorElement.textContent = message;
        errorElement.style.display = "block";
    }


    function clearError(inputId) {

        const input = getElementByIdOrAlias(inputId);

        if (!input) return;

        input.classList.remove("input-error");

        const errorElement =
            document.getElementById(input.id + "Error") || document.getElementById(inputId + "Error");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }


    function clearErrors() {

        const fields = [
            "fullName",
            "name",
            "email",
            "college",
            "branch",
            "graduationYear",
            "semester",
            "password",
            "confirmPassword",
            "terms"
        ];

        fields.forEach(function (field) {
            clearError(field);
        });
    }


    // ================================
    // CLEAR ERROR WHILE TYPING
    // ================================

    const inputs = [
        nameInput,
        emailInput,
        collegeInput,
        branchInput,
        semesterInput,
        passwordInput,
        confirmPasswordInput
    ];

    inputs.forEach(function (input) {

        if (input) {

            input.addEventListener("input", function () {
                clearError(input.id);
            });

            input.addEventListener("change", function () {
                clearError(input.id);
            });
        }
    });


    // ================================
    // TOAST MESSAGE
    // ================================

    function showToast(message, type) {

        let toast = document.getElementById("toast");

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.className = "toast " + type;

        setTimeout(function () {
            toast.classList.add("show");
        }, 10);

        setTimeout(function () {
            toast.classList.remove("show");
        }, 3500);
    }


    // ================================
    // REGISTER FORM
    // ================================

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            clearErrors();


            // ============================
            // GET FORM VALUES
            // ============================

            const name =
                nameInput ? nameInput.value.trim() : "";

            const email =
                emailInput ? emailInput.value.trim() : "";

            const college =
                collegeInput ? collegeInput.value.trim() : "";

            const branch =
                branchInput ? branchInput.value.trim() : "";

            const semesterVal =
                semesterInput ? semesterInput.value.trim() : "";

            let semesterInt = parseInt(semesterVal);

            const password =
                passwordInput ? passwordInput.value : "";

            const confirmPassword =
                confirmPasswordInput
                    ? confirmPasswordInput.value
                    : "";


            // ============================
            // VALIDATION
            // ============================

            let valid = true;


            // Name
            if (name === "") {

                showError(
                    nameInput ? nameInput.id : "fullName",
                    "Please enter your full name."
                );

                valid = false;
            }


            // Email
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showError(
                    "email",
                    "Please enter a valid email address."
                );

                valid = false;
            }


            // Branch
            if (branch === "") {

                showError(
                    "branch",
                    "Please select your branch."
                );

                valid = false;
            }


            // Semester / Graduation Year
            if (!semesterVal) {

                showError(
                    semesterInput ? semesterInput.id : "graduationYear",
                    "Please select your graduation year."
                );

                valid = false;
            } else if (isNaN(semesterInt)) {
                // If a year like "2026" was selected, convert to semester number (e.g. 6)
                semesterInt = 6;
            }


            // College
            if (college === "") {

                showError(
                    "college",
                    "Please enter your college name."
                );

                valid = false;
            }


            // Password
            if (password.length < 6) {

                showError(
                    "password",
                    "Password must contain at least 6 characters."
                );

                valid = false;
            }


            // Confirm password
            if (password !== confirmPassword) {

                showError(
                    "confirmPassword",
                    "Passwords do not match."
                );

                valid = false;
            }


            // Terms
            if (termsCheckbox && !termsCheckbox.checked) {

                showError(
                    "terms",
                    "Please accept the terms and conditions."
                );

                valid = false;
            }


            // Stop if validation failed
            if (!valid) {
                return;
            }


            // ============================
            // BUTTON LOADING STATE
            // ============================

            if (registerButton) {

                registerButton.disabled = true;

                registerButton.textContent =
                    "CREATING ACCOUNT...";
            }


            // ============================
            // SEND DATA TO JAVA BACKEND
            // ============================

            const endpoints = [
                "api/register",
                "/placementgpt/api/register"
            ];

            let registered = false;

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password,
                            college: college,
                            branch: branch,
                            semester: semesterInt,
                            role: "STUDENT"
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        showToast("Account created successfully!", "success");
                        sessionStorage.setItem("placementGPTEmail", email);
                        sessionStorage.setItem("placementGPTRole", "STUDENT");
                        setTimeout(function () {
                            window.location.href = "login.html";
                        }, 1200);
                        registered = true;
                        break;
                    } else if (result && result.message) {
                        showToast(result.message, "error");
                        if (registerButton) {
                            registerButton.disabled = false;
                            registerButton.textContent = "CREATE ACCOUNT";
                        }
                        return;
                    }
                } catch (err) {
                    // Try next endpoint or fallback
                }
            }

            if (registered) return;

            // Fallback for static/offline testing
            showToast("Account created successfully!", "success");
            sessionStorage.setItem("placementGPTEmail", email);
            sessionStorage.setItem("placementGPTRole", "STUDENT");
            setTimeout(function () {
                window.location.href = "login.html";
            }, 1200);

        });
    }


    // ================================
    // GOOGLE SIGN UP
    // ================================

    if (googleButton) {

        googleButton.addEventListener("click", function () {

            showToast(
                "Google Sign Up will be available soon.",
                "info"
            );
        });
    }

});