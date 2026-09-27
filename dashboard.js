/* =========================================================
   PLACEMENTGPT — DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");

    const searchInput = document.getElementById("searchInput");

    const notificationBtn = document.getElementById("notificationBtn");

    const profileMenu = document.getElementById("profileMenu");

    const headerUserName = document.getElementById("headerUserName");
    const welcomeUserName = document.getElementById("welcomeUserName");

    const currentDate = document.getElementById("currentDate");


    /* =====================================================
       LOAD USER INFORMATION
    ====================================================== */

    const storedEmail = sessionStorage.getItem("placementGPTEmail");
    const storedRole = sessionStorage.getItem("placementGPTRole");


    /*
       Convert email into a simple display name.

       Example:
       jay@gmail.com
       → Jay
    */

    function getDisplayName(email) {

        if (!email) {
            return "Student";
        }

        const namePart = email.split("@")[0];

        if (!namePart) {
            return "Student";
        }

        const formattedName = namePart
            .replace(/[._-]/g, " ")
            .split(" ")
            .filter(Boolean)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");

        return formattedName || "Student";
    }


    const displayName = getDisplayName(storedEmail);


    /* =====================================================
       DISPLAY USER NAME
    ====================================================== */

    if (headerUserName) {
        headerUserName.textContent = displayName;
    }

    if (welcomeUserName) {
        welcomeUserName.textContent = displayName;
    }


    /* =====================================================
       CURRENT DATE
    ====================================================== */

    function updateDate() {

        if (!currentDate) {
            return;
        }

        const today = new Date();

        const options = {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        };

        currentDate.textContent = today.toLocaleDateString(
            "en-IN",
            options
        );
    }

    updateDate();


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";
    }


    if (menuBtn) {

        menuBtn.addEventListener("click", function () {

            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener("click", function () {
            closeSidebar();
        });

    }


    /* =====================================================
       CLOSE SIDEBAR AFTER NAVIGATION
    ====================================================== */

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            if (window.innerWidth <= 760) {
                closeSidebar();
            }

        });

    });


    /* =====================================================
       ACTIVE SIDEBAR ITEM
    ====================================================== */

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            /*
               Don't change active state for # links.
               They are placeholders for pages that we
               haven't created yet.
            */

            const link = item.getAttribute("href");

            if (link && link !== "#") {

                navItems.forEach(function (nav) {
                    nav.classList.remove("active");
                });

                item.classList.add("active");
            }

        });

    });


    /* =====================================================
       SEARCH
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = searchInput.value
                .trim()
                .toLowerCase();

            const preparationCards =
                document.querySelectorAll(".preparation-card");

            const recommendedCards =
                document.querySelectorAll(".recommended-card");


            /* ---------------------------------------------
               Search preparation cards
            ---------------------------------------------- */

            preparationCards.forEach(function (card) {

                const cardText =
                    card.textContent.toLowerCase();

                if (
                    searchValue === "" ||
                    cardText.includes(searchValue)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });


            /* ---------------------------------------------
               Search recommendation cards
            ---------------------------------------------- */

            recommendedCards.forEach(function (card) {

                const cardText =
                    card.textContent.toLowerCase();

                if (
                    searchValue === "" ||
                    cardText.includes(searchValue)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }


    /* =====================================================
       SEARCH ENTER KEY
    ====================================================== */

    if (searchInput) {

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                const value = searchInput.value.trim();

                if (value !== "") {

                    console.log(
                        "Searching for:",
                        value
                    );

                }

            }

        });

    }


    /* =====================================================
       NOTIFICATION BUTTON
    ====================================================== */

    if (notificationBtn) {

        notificationBtn.addEventListener("click", function () {

            /*
               Temporary notification behaviour.
               Later this can be connected to the backend.
            */

            alert(
                "You have new placement preparation updates!"
            );

        });

    }


    /* =====================================================
       PROFILE MENU
    ====================================================== */

    if (profileMenu) {

        profileMenu.addEventListener("click", function () {

            window.location.href = "profile.html";

        });

    }


    /* =====================================================
       LOGOUT
    ====================================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to logout?");
            if (!confirmLogout) return;

            try {
                await fetch('/api/logout', { method: 'POST' });
            } catch (err) {
                console.error("Logout failed", err);
            }
            sessionStorage.removeItem("placementGPTEmail");
            sessionStorage.removeItem("placementGPTRole");
            window.location.href = "login.html";
        });

    }


    /* =====================================================
       PREVENT PLACEHOLDER LINKS
    ====================================================== */

    const placeholderLinks =
        document.querySelectorAll('a[href="#"]');

    placeholderLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

        });

    });


    /* =====================================================
       RECOMMENDED PRACTICE BUTTONS
    ====================================================== */

    const recommendButtons =
        document.querySelectorAll(".recommend-btn");

    recommendButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const card =
                button.closest(".recommended-card");

            if (!card) {
                return;
            }

            const titleElement =
                card.querySelector("h3");

            if (!titleElement) {
                return;
            }

            const title =
                titleElement.textContent.trim();

            alert(
                "Opening practice: " + title
            );

        });

    });


    /* =====================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 760) {
            closeSidebar();
        }

    });


    /* =====================================================
       CONSOLE MESSAGE
    ====================================================== */

    console.log(
        "PlacementGPT Dashboard loaded successfully."
    );

    if (storedRole) {

        console.log(
            "Logged in role:",
            storedRole
        );

    }

});
// ===============================
// LOAD STUDENT DASHBOARD DATA
// ===============================

async function loadDashboardData() {

    try {

        const response = await fetch(
            "/placementgpt/api/dashboard",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            console.error(data.message);

            return;
        }

        // Update student name
        const studentName =
            document.querySelector(".student-name");

        if (studentName && data.name) {
            studentName.textContent = data.name;
        }

        // Update dashboard statistics
        const statNumbers =
            document.querySelectorAll(".stat-number");

        if (statNumbers.length >= 3) {

            statNumbers[0].textContent =
                data.totalQuestions ?? 0;

            statNumbers[1].textContent =
                data.testsCompleted ?? 0;

            statNumbers[2].textContent =
                data.codingSubmissions ?? 0;
        }

        console.log(
            "Dashboard data loaded successfully.",
            data
        );

    } catch (error) {

        console.error(
            "Dashboard API Error:",
            error
        );
    }
}

// Run when page loads
document.addEventListener(
    "DOMContentLoaded",
    loadDashboardData
);