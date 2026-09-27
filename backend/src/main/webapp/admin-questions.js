document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");

    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const addQuestionModal = document.getElementById("addQuestionModal");
    const openAddQuestionModalBtn = document.getElementById("openAddQuestionModalBtn");

    let questionsList = [
        { id: 1, text: "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", category: "Quantitative", difficulty: "Easy", answer: "150 metres", optA: "120 m", optB: "150 m", optC: "180 m", optD: "320 m" },
        { id: 2, text: "Pointing to a photograph, a man said 'I have no brother or sister but that man's father is my father's son'. Whose photo is it?", category: "Logical Reasoning", difficulty: "Medium", answer: "His Son", optA: "His Son", optB: "His Nephew", optC: "His Father", optD: "His Own" },
        { id: 3, text: "Which data structure follows LIFO (Last In First Out) order?", category: "Technical CS", difficulty: "Easy", answer: "Stack", optA: "Queue", optB: "Stack", optC: "Tree", optD: "Graph" },
        { id: 4, text: "Find the synonym of 'Meticulous'.", category: "Verbal Ability", difficulty: "Medium", answer: "Careful / Precise", optA: "Careless", optB: "Careful / Precise", optC: "Hasty", optD: "Lazy" }
    ];

    renderQuestionsTable();

    function renderQuestionsTable() {
        const tbody = document.getElementById("questionsTbody");
        if (!tbody) return;

        const searchVal = (document.getElementById("questionSearchInput")?.value || "").toLowerCase();
        const catVal = document.getElementById("questionCategoryFilter")?.value || "ALL";
        const diffVal = document.getElementById("questionDifficultyFilter")?.value || "ALL";

        const filtered = questionsList.filter(q => {
            const matchesSearch = q.text.toLowerCase().includes(searchVal);
            const matchesCat = catVal === "ALL" || q.category === catVal;
            const matchesDiff = diffVal === "ALL" || q.difficulty === diffVal;
            return matchesSearch && matchesCat && matchesDiff;
        });

        tbody.innerHTML = "";
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 25px; color: #94a3b8;">No questions found matching criteria.</td></tr>`;
            return;
        }

        filtered.forEach(q => {
            const diffClass = q.difficulty === 'Easy' ? 'badge-success' : (q.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger');
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${q.id}</td>
                <td style="max-width: 320px;"><strong>${escapeHTML(q.text)}</strong></td>
                <td><span class="badge-primary">${escapeHTML(q.category)}</span></td>
                <td><span class="${diffClass}">${escapeHTML(q.difficulty)}</span></td>
                <td><strong style="color: #10b981;">${escapeHTML(q.answer)}</strong></td>
                <td>
                    <button class="btn-action delete" title="Delete Question" onclick="deleteQuestionItem(${q.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById("questionSearchInput")?.addEventListener("input", renderQuestionsTable);
    document.getElementById("questionCategoryFilter")?.addEventListener("change", renderQuestionsTable);
    document.getElementById("questionDifficultyFilter")?.addEventListener("change", renderQuestionsTable);

    window.deleteQuestionItem = function(id) {
        if (confirm("Are you sure you want to delete this question?")) {
            questionsList = questionsList.filter(q => q.id !== id);
            renderQuestionsTable();
            showToast("Question removed from bank.");
        }
    };

    if (openAddQuestionModalBtn) {
        openAddQuestionModalBtn.addEventListener("click", () => openModal(addQuestionModal));
    }

    document.getElementById("addQuestionForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("newQuestionText").value;
        const category = document.getElementById("newQuestionCategory").value;
        const difficulty = document.getElementById("newQuestionDifficulty").value;
        const optA = document.getElementById("newOptA").value;
        const optB = document.getElementById("newOptB").value;
        const optC = document.getElementById("newOptC").value;
        const optD = document.getElementById("newOptD").value;
        const correctCode = document.getElementById("newCorrectAns").value;

        const answerMap = { "A": optA, "B": optB, "C": optC, "D": optD };

        const newQ = {
            id: questionsList.length + 1,
            text, category, difficulty, optA, optB, optC, optD,
            answer: answerMap[correctCode] || optA
        };

        questionsList.unshift(newQ);
        renderQuestionsTable();
        closeAllModals();
        e.target.reset();
        showToast("New question added to bank successfully!");
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
