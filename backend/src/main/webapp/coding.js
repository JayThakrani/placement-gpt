document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "/placementgpt/api/coding/questions";

    const problemList = document.getElementById("problemList");
    const problemCount = document.getElementById("problemCount");
    const searchInput = document.getElementById("searchInput");
    const difficultyFilter = document.getElementById("difficultyFilter");

    let allQuestions = [];
    let selectedLanguage = "all";

    const languageButtons =
        document.querySelectorAll(".language-btn");

    /*
    =========================
    USER INFORMATION
    =========================
    */

    const userName = document.getElementById("userName");

    const email =
        sessionStorage.getItem("placementGPTEmail") ||
        localStorage.getItem("placementGPTEmail");

    if (email && userName) {
        const name = email
            .split("@")[0]
            .replace(/[._-]/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

        userName.textContent = name;
    }

    /*
    =========================
    SIDEBAR & NAVIGATION
    =========================
    */

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutBtn = document.getElementById("logoutBtn");
    const notificationBtn = document.getElementById("notificationBtn");
    const profileBtn = document.getElementById("profileBtn");

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

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
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
    }

    if (notificationBtn) {
        notificationBtn.addEventListener("click", () => {
            alert("No new notifications.");
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            window.location.href = "profile.html";
        });
    }

    /*
    =========================
    LOAD QUESTIONS
    =========================
    */

    async function loadQuestions() {

        const endpoints = [
            "api/coding/questions",
            "/placementgpt/api/coding/questions"
        ];

        let fetchedData = null;

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.success && data.questions && data.questions.length > 0) {
                        fetchedData = data.questions;
                        break;
                    }
                }
            } catch (err) {
                // Ignore & try next
            }
        }

        if (fetchedData && fetchedData.length > 0) {
            allQuestions = fetchedData;
        } else {
            // Default sample coding questions for fallback/static mode
            allQuestions = [
                {
                    id: 1,
                    title: "Two Sum",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    difficulty: "Easy",
                    category: "Arrays & Hashing",
                    input_format: "Line 1: space-separated array\nLine 2: target integer",
                    output_format: "Indices of two numbers",
                    sample_input: "2 7 11 15\n9",
                    sample_output: "0 1"
                },
                {
                    id: 2,
                    title: "Reverse Linked List",
                    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                    difficulty: "Easy",
                    category: "Linked Lists",
                    input_format: "Space separated integers representing elements of linked list",
                    output_format: "Space separated integers of reversed list",
                    sample_input: "1 2 3 4 5",
                    sample_output: "5 4 3 2 1"
                },
                {
                    id: 3,
                    title: "Valid Parentheses",
                    description: "Given a string s containing just characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                    difficulty: "Medium",
                    category: "Stack",
                    input_format: "String s",
                    output_format: "true or false",
                    sample_input: "()[]{}",
                    sample_output: "true"
                }
            ];
        }

        renderQuestions(allQuestions);
    }

    /*
    =========================
    ESCAPE HTML
    =========================
    */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /*
    =========================
    RENDER QUESTIONS
    =========================
    */

    function renderQuestions(questions) {

        problemList.innerHTML = "";

        problemCount.textContent =
            `${questions.length} Problem${questions.length !== 1 ? "s" : ""}`;

        if (questions.length === 0) {

            problemList.innerHTML = `
                <div class="loading-message">
                    No coding problems found.
                </div>
            `;

            return;
        }

        questions.forEach((question, index) => {

            const difficulty =
                (question.difficulty || "EASY").toLowerCase();

            const card = document.createElement("article");

            card.className = "problem-card";

            card.dataset.difficulty = difficulty;
            card.dataset.category = question.category || "";

            card.innerHTML = `
                <div class="problem-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="problem-info">

                    <h3>${escapeHTML(question.title)}</h3>

                    <p>
                        ${escapeHTML(question.description)}
                    </p>

                    <div class="problem-meta">

                        <span class="tag ${difficulty}">
                            ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>

                        <span>
                            <i class="fa-solid fa-layer-group"></i>
                            ${escapeHTML(question.category)}
                        </span>

                        <span>
                            <i class="fa-solid fa-database"></i>
                            Database Problem
                        </span>

                    </div>

                </div>

                <button class="solve-btn">
                    Solve
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;

            const solveButton =
                card.querySelector(".solve-btn");

            solveButton.addEventListener("click", () => {
                openProblem(question);
            });

            problemList.appendChild(card);
        });
    }

    /*
    =========================
    FILTER QUESTIONS
    =========================
    */

    function filterQuestions() {

        const searchTerm =
            searchInput?.value.toLowerCase().trim() || "";

        const difficulty =
            difficultyFilter?.value.toLowerCase() || "all";

        const filteredQuestions = allQuestions.filter(question => {

            const title =
                (question.title || "").toLowerCase();

            const description =
                (question.description || "").toLowerCase();

            const category =
                (question.category || "").toLowerCase();

            const questionDifficulty =
                (question.difficulty || "easy").toLowerCase();

            const matchesSearch =
                title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                category.includes(searchTerm);

            const matchesDifficulty =
                difficulty === "all" ||
                questionDifficulty === difficulty;

            return matchesSearch && matchesDifficulty;
        });

        renderQuestions(filteredQuestions);
    }

    /*
    =========================
    SEARCH AND DIFFICULTY
    =========================
    */

    searchInput?.addEventListener("input", filterQuestions);

    difficultyFilter?.addEventListener("change", filterQuestions);

    /*
    =========================
    LANGUAGE FILTER
    =========================

    The database currently does not have a language column.
    Therefore, language buttons are temporarily treated as
    visual selections until language support is added.
    */

    languageButtons.forEach(button => {

        button.addEventListener("click", () => {

            languageButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedLanguage =
                button.dataset.language || "all";

            filterQuestions();
        });
    });

    /*
    =========================
    PROBLEM MODAL
    =========================
    */

    function openProblem(question) {

        closeProblemModal();

        const modal = document.createElement("div");

        modal.id = "codingProblemModal";

        modal.innerHTML = `
            <div class="coding-modal-overlay">

                <div class="coding-modal">

                    <button class="coding-modal-close"
                            id="closeCodingModal">
                        &times;
                    </button>

                    <h2>${escapeHTML(question.title)}</h2>

                    <span class="tag ${(question.difficulty || "EASY").toLowerCase()}">
                        ${escapeHTML(question.difficulty)}
                    </span>

                    <p class="modal-description">
                        ${escapeHTML(question.description)}
                    </p>

                    <h3>Input Format</h3>

                    <pre>${escapeHTML(question.input_format)}</pre>

                    <h3>Output Format</h3>

                    <pre>${escapeHTML(question.output_format)}</pre>

                    <h3>Sample Input</h3>

                    <pre>${escapeHTML(question.sample_input)}</pre>

                    <h3>Sample Output</h3>

                    <pre>${escapeHTML(question.sample_output)}</pre>

                    <h3>Write Your Code</h3>

                    <select id="codingLanguage">
                        <option value="Java">Java</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="C++">C++</option>
                        <option value="Python">Python</option>
                    </select>

                    <textarea id="codeEditor"
                              rows="12"
                              placeholder="Write your solution here..."></textarea>

                    <button id="saveCodeButton"
                            class="modal-submit-btn">
                        Save Submission
                    </button>

                    <p id="submissionMessage"></p>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        addModalStyles();

        document
            .getElementById("closeCodingModal")
            .addEventListener("click", closeProblemModal);

        document
            .querySelector(".coding-modal-overlay")
            .addEventListener("click", event => {

                if (event.target.classList.contains("coding-modal-overlay")) {
                    closeProblemModal();
                }
            });

        document
            .getElementById("saveCodeButton")
            .addEventListener("click", () => {

                const code =
                    document.getElementById("codeEditor").value.trim();

                const language =
                    document.getElementById("codingLanguage").value;

                if (!code) {
                    showSubmissionMessage("Please write your code first.");
                    return;
                }

                showSubmissionMessage(
                    `Code prepared for ${language}. Submission API will be connected next.`
                );
            });
    }

    function closeProblemModal() {

        const modal =
            document.getElementById("codingProblemModal");

        if (modal) {
            modal.remove();
        }
    }

    function showSubmissionMessage(message) {

        const element =
            document.getElementById("submissionMessage");

        if (element) {
            element.textContent = message;
        }
    }

    /*
    =========================
    MODAL STYLES
    =========================
    */

    function addModalStyles() {

        if (document.getElementById("codingModalStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "codingModalStyles";

        style.textContent = `
            .coding-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.65);
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                z-index: 9999;
            }

            .coding-modal {
                position: relative;
                background: white;
                width: min(850px, 100%);
                max-height: 90vh;
                overflow-y: auto;
                padding: 30px;
                border-radius: 18px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.25);
            }

            .coding-modal h2 {
                margin-top: 0;
            }

            .coding-modal h3 {
                margin-top: 22px;
            }

            .coding-modal pre {
                background: #f4f6f8;
                padding: 15px;
                border-radius: 8px;
                white-space: pre-wrap;
            }

            .coding-modal textarea {
                width: 100%;
                box-sizing: border-box;
                margin-top: 10px;
                padding: 15px;
                border: 1px solid #d5dbe3;
                border-radius: 8px;
                font-family: monospace;
                resize: vertical;
            }

            .coding-modal select {
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #d5dbe3;
            }

            .coding-modal-close {
                position: absolute;
                right: 20px;
                top: 15px;
                font-size: 28px;
                border: none;
                background: transparent;
                cursor: pointer;
            }

            .modal-submit-btn {
                margin-top: 15px;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                background: #0088ff;
                color: white;
                cursor: pointer;
            }

            #submissionMessage {
                margin-top: 15px;
                font-weight: 600;
            }
        `;

        document.head.appendChild(style);
    }

    /*
    =========================
    INITIALIZATION
    =========================
    */

    loadQuestions();
});