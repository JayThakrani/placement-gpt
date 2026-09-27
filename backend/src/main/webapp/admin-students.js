document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutButton = document.getElementById("logoutButton");

    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const addStudentModal = document.getElementById("addStudentModal");
    const openAddStudentModalBtn = document.getElementById("openAddStudentModalBtn");

    // Student Data State
    let studentsList = [
        { id: 1, name: "Akash Kumar", email: "akash@example.com", college: "IIT Bombay", branch: "Computer Science", semester: 8, role: "STUDENT", status: "Active" },
        { id: 2, name: "Priya Shah", email: "priya@example.com", college: "NIT Trichy", branch: "Information Technology", semester: 6, role: "STUDENT", status: "Active" },
        { id: 3, name: "Rahul Patel", email: "rahul@example.com", college: "BITS Pilani", branch: "Computer Science", semester: 8, role: "STUDENT", status: "Active" },
        { id: 4, name: "Neha Sharma", email: "neha@example.com", college: "DTU Delhi", branch: "Electronics", semester: 6, role: "STUDENT", status: "Inactive" },
        { id: 5, name: "Vikram Verma", email: "vikram@example.com", college: "VJTI Mumbai", branch: "Mechanical", semester: 4, role: "STUDENT", status: "Active" }
    ];

    renderStudentsTable();
    loadBackendStudents();

    function renderStudentsTable() {
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
                            <strong>${escapeHTML(s.name)}</strong><br>
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

    document.getElementById("studentSearchInput")?.addEventListener("input", renderStudentsTable);
    document.getElementById("studentBranchFilter")?.addEventListener("change", renderStudentsTable);

    window.deleteStudentAccount = function(id) {
        if (confirm("Are you sure you want to delete this student account?")) {
            studentsList = studentsList.filter(s => s.id !== id);
            renderStudentsTable();
            showToast("Student account deleted successfully.");
        }
    };

    // Add Student Form
    if (openAddStudentModalBtn) {
        openAddStudentModalBtn.addEventListener("click", () => {
            openModal(addStudentModal);
        });
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
        renderStudentsTable();
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
                        renderStudentsTable();
                        break;
                    }
                }
            } catch (e) {
                // Ignore fallback
            }
        }
    }

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

    // Utils
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
