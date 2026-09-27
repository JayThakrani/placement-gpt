document.addEventListener("DOMContentLoaded", () => {

    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");
    const notificationBtn = document.getElementById("notificationBtn");
    const profileBtn = document.getElementById("profileBtn");

    const searchInput = document.getElementById("searchInput");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const testCards =
        document.querySelectorAll(".test-card");

    const startButtons =
        document.querySelectorAll(".start-btn");

    const testModal =
        document.getElementById("testModal");

    const closeModal =
        document.getElementById("closeModal");

    const modalStartBtn =
        document.getElementById("modalStartBtn");

    const modalTestName =
        document.getElementById("modalTestName");

    const emptyState =
        document.getElementById("emptyState");

    const userName =
        document.getElementById("userName");


    /* ================= USER ================= */

    const email =
        sessionStorage.getItem("placementGPTEmail");

    if (email) {

        const name = email
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );

        if (userName) userName.textContent = name;
    }


    /* ================= SIDEBAR ================= */

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
    }

    function closeSidebarMenu() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    }

    if (mobileMenu) {
        mobileMenu.addEventListener("click", openSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener(
            "click",
            closeSidebarMenu
        );
    }


    /* ================= LOGOUT ================= */

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async event => {
            event.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                try {
                    await fetch('/api/logout', { method: 'POST' });
                } catch (err) {
                    console.error("Logout failed", err);
                }
                sessionStorage.removeItem("placementGPTEmail");
                sessionStorage.removeItem("placementGPTRole");
                window.location.href = "login.html";
            }
        });

    }


    /* ================= NOTIFICATION ================= */

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {

            alert(
                "No new notifications.\n\n" +
                "Your mock test results will appear here."
            );

        });

    }


    /* ================= PROFILE ================= */

    if (profileBtn) {

        profileBtn.addEventListener("click", () => {
            window.location.href = "profile.html";
        });

    }


    /* ================= CATEGORY FILTER ================= */

    let selectedCategory = "all";


    function filterTests() {

        const searchTerm =
            searchInput.value.toLowerCase().trim();

        let visibleTests = 0;


        testCards.forEach(card => {

            const category =
                card.dataset.category;

            const title =
                card.querySelector("h3")
                    .textContent
                    .toLowerCase();

            const description =
                card.querySelector("p")
                    .textContent
                    .toLowerCase();


            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;

            const searchMatch =
                title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                category.includes(searchTerm);


            if (
                categoryMatch &&
                searchMatch
            ) {

                card.classList.remove("hidden");
                visibleTests++;

            } else {

                card.classList.add("hidden");

            }

        });


        if (visibleTests === 0) {
            emptyState.classList.add("show");
        } else {
            emptyState.classList.remove("show");
        }

    }


    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedCategory =
                button.dataset.category;

            filterTests();

        });

    });


    /* ================= SEARCH ================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterTests
        );

    }


    /* ================= MODAL ================= */

    let selectedTest = "";


    startButtons.forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".test-card");

            selectedTest =
                card.querySelector("h3").textContent;

            modalTestName.textContent =
                selectedTest;

            testModal.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });


    function closeTestModal() {

        testModal.classList.remove("show");

        document.body.style.overflow = "";

    }


    if (closeModal) {
        closeModal.addEventListener(
            "click",
            closeTestModal
        );
    }


    testModal.addEventListener("click", event => {

        if (event.target === testModal) {
            closeTestModal();
        }

    });


    /* ================= START TEST ================= */

    if (modalStartBtn) {

        modalStartBtn.addEventListener("click", () => {

            window.location.href = "aptitude.html";

        });

    }


    /* ================= ESCAPE ================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeTestModal();
        }

    });


    /* ================= INITIALIZE ================= */

    filterTests();


    /* ================= RESPONSIVE ================= */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeSidebarMenu();
        }

    });

});