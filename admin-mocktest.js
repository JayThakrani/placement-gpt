document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");

    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const createTestModal = document.getElementById("createTestModal");
    const openCreateTestModalBtn = document.getElementById("openCreateTestModalBtn");

    let testsList = [
        { id: 1, title: "TCS NQT Full Length Mock 2026", category: "TCS NQT", questions: 30, duration: 60, passMark: 60, status: "Active" },
        { id: 2, title: "Infosys Aptitude & Reasoning Challenge", category: "Infosys", questions: 25, duration: 45, passMark: 65, status: "Active" },
        { id: 3, title: "Wipro NLTH Technical Assessment", category: "Wipro", questions: 20, duration: 40, passMark: 55, status: "Active" },
        { id: 4, title: "General Quantitative Diagnostic Test", category: "General Aptitude", questions: 20, duration: 30, passMark: 50, status: "Active" }
    ];

    renderTestsTable();

    function renderTestsTable() {
        const tbody = document.getElementById("testsTbody");
        if (!tbody) return;

        const searchVal = (document.getElementById("testSearchInput")?.value || "").toLowerCase();
        const catVal = document.getElementById("testCategoryFilter")?.value || "ALL";

        const filtered = testsList.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchVal);
            const matchesCat = catVal === "ALL" || t.category === catVal;
            return matchesSearch && matchesCat;
        });

        tbody.innerHTML = "";
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 25px; color: #94a3b8;">No mock tests found.</td></tr>`;
            return;
        }

        filtered.forEach(t => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHTML(t.title)}</strong></td>
                <td><span class="badge-primary">${escapeHTML(t.category)}</span></td>
                <td>${t.questions} Questions</td>
                <td>${t.duration} Mins</td>
                <td><strong style="color:#0088ff;">${t.passMark}%</strong></td>
                <td><span class="status-badge active">${escapeHTML(t.status)}</span></td>
                <td>
                    <button class="btn-action delete" title="Delete Test" onclick="deleteTestItem(${t.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById("testSearchInput")?.addEventListener("input", renderTestsTable);
    document.getElementById("testCategoryFilter")?.addEventListener("change", renderTestsTable);

    window.deleteTestItem = function(id) {
        if (confirm("Are you sure you want to delete this mock test?")) {
            testsList = testsList.filter(t => t.id !== id);
            renderTestsTable();
            showToast("Mock test deleted successfully.");
        }
    };

    if (openCreateTestModalBtn) {
        openCreateTestModalBtn.addEventListener("click", () => openModal(createTestModal));
    }

    document.getElementById("createTestForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newTestTitle").value;
        const category = document.getElementById("newTestCategory").value;
        const duration = document.getElementById("newTestDuration").value;
        const questions = document.getElementById("newTestQuestions").value;
        const passMark = document.getElementById("newTestPass").value;

        const newT = {
            id: testsList.length + 1,
            title, category, questions: parseInt(questions), duration: parseInt(duration), passMark: parseInt(passMark), status: "Active"
        };

        testsList.unshift(newT);
        renderTestsTable();
        closeAllModals();
        e.target.reset();
        showToast("Mock test created successfully!");
    });

    // Modal Helpers
    function openModal(modalElem) {
        if (!modalElem) return;
        closeAllModals();
        if (modalBackdrop) modalBackdrop.classList.add("show");
        modalElem.classList.add("show");
    }

    function closeAllModals() {
        if (modalBackdrop) modalBackdrop.classList.remove("show");
        document.querySelectorAll(".modal-dialog").forEach(m => m.classList.remove("show"));
    }

    document.querySelectorAll(".closeModalBtn").forEach(btn => btn.addEventListener("click", closeAllModals));
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeAllModals);

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
