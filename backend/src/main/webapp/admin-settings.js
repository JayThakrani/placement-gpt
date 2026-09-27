document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");

    document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("System settings saved successfully!");
    });

    // Mobile Sidebar
    if (mobileMenu) {
        mobileMenu.addEventListener("click", () => {
            if (sidebar) sidebar.classList.add("open");
            if (sidebarOverlay) sidebarOverlay.classList.add("show");
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", () => {
            if (sidebar) sidebar.classList.remove("open");
            if (sidebarOverlay) sidebarOverlay.classList.remove("show");
        });
    }

    // Notifications & Profile & Logout
    document.getElementById("notificationButton")?.addEventListener("click", () => showToast("You have no new notifications."));
    document.getElementById("adminProfile")?.addEventListener("click", () => showToast("Admin Profile Settings"));

    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                sessionStorage.removeItem("placementGPTRole");
                sessionStorage.removeItem("placementGPTEmail");
                window.location.href = "login.html";
            }
        });
    }

    function escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showToast(message) {
        const existing = document.querySelector(".admin-toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = "admin-toast";
        toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${escapeHTML(message)}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 250);
        }, 3000);
    }
});
