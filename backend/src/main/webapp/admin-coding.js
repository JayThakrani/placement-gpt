document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");

    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const addCodingModal = document.getElementById("addCodingModal");
    const openAddCodingModalBtn = document.getElementById("openAddCodingModalBtn");

    let codingList = [
        { id: 1, title: "Two Sum", topic: "Arrays & Hashing", difficulty: "Easy", submissions: "1,240", passRate: "68%" },
        { id: 2, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", submissions: "890", passRate: "45%" },
        { id: 3, title: "Merge K Sorted Lists", topic: "Heap / Priority Queue", difficulty: "Hard", submissions: "420", passRate: "32%" },
        { id: 4, title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", submissions: "1,560", passRate: "74%" }
    ];

    renderCodingTable();

    function renderCodingTable() {
        const tbody = document.getElementById("codingTbody");
        if (!tbody) return;

        const searchVal = (document.getElementById("codingSearchInput")?.value || "").toLowerCase();
        const diffVal = document.getElementById("codingDifficultyFilter")?.value || "ALL";

        const filtered = codingList.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchVal) || c.topic.toLowerCase().includes(searchVal);
            const matchesDiff = diffVal === "ALL" || c.difficulty === diffVal;
            return matchesSearch && matchesDiff;
        });

        tbody.innerHTML = "";
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 25px; color: #94a3b8;">No coding problems found.</td></tr>`;
            return;
        }

        filtered.forEach(c => {
            const diffClass = c.difficulty === 'Easy' ? 'badge-success' : (c.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger');
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHTML(c.title)}</strong></td>
                <td><span class="badge-primary">${escapeHTML(c.topic)}</span></td>
                <td><span class="${diffClass}">${escapeHTML(c.difficulty)}</span></td>
                <td>${c.submissions}</td>
                <td><strong style="color: #10b981;">${c.passRate}</strong></td>
                <td>
                    <button class="btn-action delete" title="Delete Coding Problem" onclick="deleteCodingItem(${c.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById("codingSearchInput")?.addEventListener("input", renderCodingTable);
    document.getElementById("codingDifficultyFilter")?.addEventListener("change", renderCodingTable);

    window.deleteCodingItem = function(id) {
        if (confirm("Are you sure you want to delete this coding problem?")) {
            codingList = codingList.filter(c => c.id !== id);
            renderCodingTable();
            showToast("Coding problem deleted.");
        }
    };

    if (openAddCodingModalBtn) {
        openAddCodingModalBtn.addEventListener("click", () => openModal(addCodingModal));
    }

    document.getElementById("addCodingForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newCodingTitle").value;
        const topic = document.getElementById("newCodingTopic").value;
        const difficulty = document.getElementById("newCodingDifficulty").value;

        const newC = {
            id: codingList.length + 1,
            title, topic, difficulty, submissions: "0", passRate: "100%"
        };

        codingList.unshift(newC);
        renderCodingTable();
        closeAllModals();
        e.target.reset();
        showToast("New coding problem created!");
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
