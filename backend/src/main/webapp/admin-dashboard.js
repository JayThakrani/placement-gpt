document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // DOM ELEMENTS
    // =========================================================
    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");
    const currentDate = document.getElementById("currentDate");
    const headerTitle = document.getElementById("headerTitle");

    // Modal Backdrop & Dialogs
    const modalBackdrop = document.getElementById("modalBackdrop");
    const addStudentModal = document.getElementById("addStudentModal");
    const addQuestionModal = document.getElementById("addQuestionModal");
    const createTestModal = document.getElementById("createTestModal");
    const addCodingModal = document.getElementById("addCodingModal");

    // Modal Trigger Buttons
    const openAddStudentModalBtn = document.getElementById("openAddStudentModalBtn");
    const openAddQuestionModalBtn = document.getElementById("openAddQuestionModalBtn");
    const openCreateTestModalBtn = document.getElementById("openCreateTestModalBtn");
    const openAddCodingModalBtn = document.getElementById("openAddCodingModalBtn");

    // Quick Action Cards
    const addQuestionBtn = document.getElementById("addQuestion");
    const addCodingBtn = document.getElementById("addCoding");
    const createTestBtn = document.getElementById("createTest");
    const viewReportsBtn = document.getElementById("viewReports");
    const viewAllStudentsBtn = document.getElementById("viewAllStudents");

    // =========================================================
    // CURRENT DATE DISPLAY
    // =========================================================
    if (currentDate) {
        const today = new Date();
        currentDate.textContent = today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    // =========================================================
    // DATA STORES
    // =========================================================
    let studentsList = [
        { id: 1, name: "Akash Kumar", email: "akash@example.com", college: "IIT Bombay", branch: "Computer Science", semester: 8, role: "STUDENT", status: "Active" },
        { id: 2, name: "Priya Shah", email: "priya@example.com", college: "NIT Trichy", branch: "Information Technology", semester: 6, role: "STUDENT", status: "Active" },
        { id: 3, name: "Rahul Patel", email: "rahul@example.com", college: "BITS Pilani", branch: "Computer Science", semester: 8, role: "STUDENT", status: "Active" },
        { id: 4, name: "Neha Sharma", email: "neha@example.com", college: "DTU Delhi", branch: "Electronics", semester: 6, role: "STUDENT", status: "Inactive" },
        { id: 5, name: "Vikram Verma", email: "vikram@example.com", college: "VJTI Mumbai", branch: "Mechanical", semester: 4, role: "STUDENT", status: "Active" }
    ];

    let questionsList = [
        { id: 1, text: "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", category: "Quantitative", difficulty: "Easy", answer: "150 metres", optA: "120 m", optB: "150 m", optC: "180 m", optD: "320 m" },
        { id: 2, text: "Pointing to a photograph, a man said 'I have no brother or sister but that man's father is my father's son'. Whose photo is it?", category: "Logical Reasoning", difficulty: "Medium", answer: "His Son", optA: "His Son", optB: "His Nephew", optC: "His Father", optD: "His Own" },
        { id: 3, text: "Which data structure follows LIFO (Last In First Out) order?", category: "Technical CS", difficulty: "Easy", answer: "Stack", optA: "Queue", optB: "Stack", optC: "Tree", optD: "Graph" },
        { id: 4, text: "Find the synonym of 'Meticulous'.", category: "Verbal Ability", difficulty: "Medium", answer: "Careful / Precise", optA: "Careless", optB: "Careful / Precise", optC: "Hasty", optD: "Lazy" }
    ];

    let testsList = [
        { id: 1, title: "TCS NQT Full Length Mock 2026", category: "TCS NQT", questions: 30, duration: 60, passMark: 60, status: "Active" },
        { id: 2, title: "Infosys Aptitude & Reasoning Challenge", category: "Infosys", questions: 25, duration: 45, passMark: 65, status: "Active" },
        { id: 3, title: "Wipro NLTH Technical Assessment", category: "Wipro", questions: 20, duration: 40, passMark: 55, status: "Active" },
        { id: 4, title: "General Quantitative Diagnostic Test", category: "General Aptitude", questions: 20, duration: 30, passMark: 50, status: "Active" }
    ];

    let codingList = [
        { id: 1, title: "Two Sum", topic: "Arrays & Hashing", difficulty: "Easy", submissions: "1,240", passRate: "68%" },
        { id: 2, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", submissions: "890", passRate: "45%" },
        { id: 3, title: "Merge K Sorted Lists", topic: "Heap / Priority Queue", difficulty: "Hard", submissions: "420", passRate: "32%" },
        { id: 4, title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", submissions: "1,560", passRate: "74%" }
    ];

    // =========================================================
    // INITIALIZATION & RENDERERS
    // =========================================================
    renderDashboardRecentStudents();
    renderFullStudentsTable();
    renderQuestionsTable();
    renderTestsTable();
    renderCodingTable();
    loadBackendStudents();

    // =========================================================
    // 1. STUDENTS MANAGEMENT
    // =========================================================
    function renderDashboardRecentStudents() {
        const tbody = document.getElementById("recentStudentsTbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        studentsList.slice(0, 5).forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="student-info">
                        <div class="student-avatar">${getInitials(s.name)}</div>
                        <div class="student-name-group">
                            <strong style="font-size: 13px; font-weight: 600; color: #0f172a; display: block;">${escapeHTML(s.name)}</strong>
                            <span style="font-size: 12px; color: #64748b; display: block; margin-top: 1px;">${escapeHTML(s.email)}</span>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(s.branch)}</td>
                <td>Sem ${s.semester}</td>
                <td>${escapeHTML(s.college || "PlacementGPT College")}</td>
                <td><span class="${s.status === 'Active' ? 'badge-success' : 'badge-secondary'}">${escapeHTML(s.status || 'Active')}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderFullStudentsTable() {
        const tbody = document.getElementById("fullStudentsTbody");
        if (!tbody) return;

        const searchVal = (document.getElementById("studentSearchInput")?.value || "").toLowerCase();
        const branchVal = document.getElementById("studentBranchFilter")?.value || "ALL";

        const filtered = studentsList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchVal) ||
                                  s.email.toLowerCase().includes(searchVal) ||
                                  (s.college && s.college.toLowerCase().includes(searchVal));
            const matchesBranch = branchVal === "ALL" || s.branch === branchVal;
            return matchesSearch && matchesBranch;
        });

        tbody.innerHTML = "";
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 25px; color: #94a3b8;">No matching students found.</td></tr>`;
            return;
        }

        filtered.forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${s.id}</td>
                <td>
                    <div class="student-info">
                        <div class="student-avatar">${getInitials(s.name)}</div>
                        <div>
                            <strong>${escapeHTML(s.name)}</strong>
                            <small style="color:#64748b;">${escapeHTML(s.email)}</small>
                        </div>
                    </div>
                </td>
                <td>${escapeHTML(s.college || "PlacementGPT College")}</td>
                <td>${escapeHTML(s.branch)}</td>
                <td>Semester ${s.semester}</td>
                <td><span class="badge-primary">${escapeHTML(s.role || "STUDENT")}</span></td>
                <td><span class="status-badge ${s.status === 'Active' ? 'active' : ''}">${escapeHTML(s.status || 'Active')}</span></td>
                <td>
                    <button class="btn-action delete" title="Delete Student" onclick="deleteStudentAccount(${s.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById("studentSearchInput")?.addEventListener("input", renderFullStudentsTable);
    document.getElementById("studentBranchFilter")?.addEventListener("change", renderFullStudentsTable);

    window.deleteStudentAccount = function(id) {
        if (confirm("Are you sure you want to delete this student account?")) {
            studentsList = studentsList.filter(s => s.id !== id);
            renderFullStudentsTable();
            renderDashboardRecentStudents();
            showToast("Student account deleted successfully.");
        }
    };

    if (openAddStudentModalBtn) {
        openAddStudentModalBtn.addEventListener("click", () => openModal(addStudentModal));
    }

    document.getElementById("addStudentForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("newStudentName").value;
        const email = document.getElementById("newStudentEmail").value;
        const college = document.getElementById("newStudentCollege").value;
        const branch = document.getElementById("newStudentBranch").value;
        const semester = document.getElementById("newStudentSemester").value;

        const newStudent = {
            id: studentsList.length + 1,
            name, email, college, branch, semester: parseInt(semester),
            role: "STUDENT", status: "Active"
        };

        studentsList.unshift(newStudent);
        renderFullStudentsTable();
        renderDashboardRecentStudents();
        closeAllModals();
        e.target.reset();
        showToast("New student account added successfully!");
    });

    async function loadBackendStudents() {
        const endpoints = ["api/admin/students", "/placementgpt/api/admin/students"];
        for (const ep of endpoints) {
            try {
                const res = await fetch(ep);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        studentsList = data.map((s, idx) => ({
                            id: s.id || (idx + 1),
                            name: s.name || "Student User",
                            email: s.email || "student@example.com",
                            college: s.college || "Engineering College",
                            branch: s.branch || "Computer Science",
                            semester: s.semester || 6,
                            role: s.role || "STUDENT",
                            status: "Active"
                        }));
                        renderDashboardRecentStudents();
                        renderFullStudentsTable();
                        break;
                    }
                }
            } catch (e) {
                // Ignore fallback
            }
        }
    }

    // =========================================================
    // 2. QUESTION BANK MANAGEMENT
    // =========================================================
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

    // =========================================================
    // 3. MOCK TEST BUILDER
    // =========================================================
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

    // =========================================================
    // 4. CODING PROBLEMS
    // =========================================================
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

    // =========================================================
    // 5. QUICK ACTIONS REDIRECTS
    // =========================================================
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener("click", () => window.location.href = "admin-questions.html");
    }
    if (addCodingBtn) {
        addCodingBtn.addEventListener("click", () => window.location.href = "admin-coding.html");
    }
    if (createTestBtn) {
        createTestBtn.addEventListener("click", () => window.location.href = "admin-mocktest.html");
    }
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener("click", () => window.location.href = "admin-reports.html");
    }
    if (viewAllStudentsBtn) {
        viewAllStudentsBtn.addEventListener("click", () => window.location.href = "admin-students.html");
    }

    // =========================================================
    // 6. REPORTS & SETTINGS HANDLERS
    // =========================================================
    document.getElementById("exportReportBtn")?.addEventListener("click", () => {
        showToast("Exporting PlacementGPT analytics report as CSV...");
    });

    document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("System settings saved successfully!");
    });

    // =========================================================
    // MODAL DIALOG HELPERS
    // =========================================================
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

    // =========================================================
    // SIDEBAR & MOBILE NAVIGATION
    // =========================================================
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

    // =========================================================
    // PROFILE, NOTIFICATIONS & LOGOUT
    // =========================================================
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

    // =========================================================
    // UTILS & TOAST MESSAGES
    // =========================================================
    function getInitials(name) {
        if (!name) return "U";
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
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