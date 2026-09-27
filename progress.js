document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoutBtn = document.getElementById("logoutBtn");
    const notificationBtn = document.getElementById("notificationBtn");
    const profileBtn = document.getElementById("profileBtn");
    const reportBtn = document.getElementById("reportBtn");
    const practiceBtn = document.getElementById("practiceBtn");
    const userName = document.getElementById("userName");

    const email = sessionStorage.getItem("placementGPTEmail");

    if (email) {
        const name = email
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

        if (userName) userName.textContent = name;
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

    notificationBtn.addEventListener("click", () => {
        alert("No new notifications.");
    });

    profileBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
    });

    let currentProgress = {
        overallScorePercentage: 0,
        aptitudeTestsCompleted: 0,
        codingProblemsSolved: 0
    };

    fetch('/api/progress')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                currentProgress = data;
                
                // Update UI elements based on their order in the DOM
                const strongTags = document.querySelectorAll('.stat-card strong');
                if (strongTags.length >= 3) {
                    strongTags[0].textContent = `${data.overallScorePercentage}%`;
                    strongTags[1].textContent = `${data.aptitudeTestsCompleted + data.codingProblemsSolved}`;
                }
            }
        })
        .catch(err => console.error("Error fetching progress", err));

    reportBtn.addEventListener("click", () => {
        alert(
            "Progress Report\n\n" +
            "Overall Score: " + currentProgress.overallScorePercentage + "%\n" +
            "Questions Solved: " + (currentProgress.aptitudeTestsCompleted + currentProgress.codingProblemsSolved) + "\n" +
            "Practice Time: 18h 42m\n" +
            "Current Streak: 7 Days"
        );
    });

    practiceBtn.addEventListener("click", () => {
        window.location.href = "aptitude.html";
    });

});