document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");
    const startBtn = document.getElementById("startBtn");
    const searchInput = document.getElementById("searchInput");

    const topicCards =
        document.querySelectorAll(".topic-card");

    const topicButtons =
        document.querySelectorAll(".topic-btn");

    const userName =
        document.getElementById("userName");


    const email =
        sessionStorage.getItem("placementGPTEmail");

    if (email) {

        const name = email
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );

        userName.textContent = name;
    }


    mobileMenu.addEventListener("click", () => {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");
    });


    sidebarOverlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    });


    logoutBtn.addEventListener("click", async event => {
        event.preventDefault();

        if (confirm("Are you sure you want to logout?")) {
            try {
                await fetch('/api/logout', { method: 'POST' });
            } catch (err) {
                console.error("Logout failed", err);
            }
            sessionStorage.clear();
            window.location.href = "login.html";
        }
    });


    startBtn.addEventListener("click", () => {

        document.querySelector(".topic-grid")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


    topicButtons.forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".topic-card");

            const topic =
                card.querySelector("h3").textContent;

            alert(
                `GD Practice Started\n\n` +
                `Topic: ${topic}\n\n` +
                `You will get 2 minutes to prepare your points, ` +
                `followed by a timed speaking session.`
            );

        });

    });


    searchInput.addEventListener("input", () => {

        const search =
            searchInput.value.toLowerCase().trim();

        topicCards.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            card.style.display =
                text.includes(search)
                    ? "flex"
                    : "none";

        });

    });

});