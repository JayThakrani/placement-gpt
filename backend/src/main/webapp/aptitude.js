let aptitudeQuestions = [];

let submitted = false;


// =====================================
// PAGE INITIALIZATION
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadAptitudeQuestions();

    const aptitudeForm =
        document.getElementById("aptitudeForm");

    const retryButton =
        document.getElementById("retryButton");


    if (aptitudeForm) {

        aptitudeForm.addEventListener(
            "submit",
            submitAnswers
        );
    }


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            () => {
                window.location.reload();
            }
        );
    }

});


// =====================================
// LOAD QUESTIONS FROM BACKEND
// =====================================

async function loadAptitudeQuestions() {

    const container =
        document.getElementById("questionsContainer");

    const loadingStatus =
        document.getElementById("loadingStatus");

    const questionCount =
        document.getElementById("questionCount");


    if (!container) {
        return;
    }

    loadingStatus.textContent = "Loading questions...";

    const endpoints = [
        "api/aptitude/questions",
        "/placementgpt/api/aptitude/questions"
    ];

    let fetchedData = null;

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.success && data.questions && data.questions.length > 0) {
                    fetchedData = data.questions;
                    break;
                }
            }
        } catch (e) {
            // Ignore & try next
        }
    }

    if (fetchedData && fetchedData.length > 0) {
        aptitudeQuestions = fetchedData;
    } else {
        // Fallback for offline / static mode
        aptitudeQuestions = [
            {
                id: 1,
                question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                option_a: "120 metres",
                option_b: "180 metres",
                option_c: "324 metres",
                option_d: "150 metres",
                correct_option: "option_d",
                explanation: "Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 metres.",
                category: "Quantitative",
                difficulty: "Easy"
            },
            {
                id: 2,
                question: "Which number comes next in the series: 2, 6, 12, 20, 30, ?",
                option_a: "36",
                option_b: "40",
                option_c: "42",
                option_d: "48",
                correct_option: "option_c",
                explanation: "The differences are +4, +6, +8, +10, +12. So 30 + 12 = 42.",
                category: "Logical Reasoning",
                difficulty: "Medium"
            },
            {
                id: 3,
                question: "Select the synonym of the word: PRAGMATIC",
                option_a: "Idealistic",
                option_b: "Practical",
                option_c: "Theoretical",
                option_d: "Irrational",
                correct_option: "option_b",
                explanation: "Pragmatic means dealing with things sensibly and realistically.",
                category: "Verbal Ability",
                difficulty: "Easy"
            }
        ];
    }

    container.innerHTML = "";

    if (questionCount) {
        questionCount.textContent = aptitudeQuestions.length;
    }

    aptitudeQuestions.forEach((question, index) => {
        renderQuestion(question, index, container);
    });

    loadingStatus.textContent = `${aptitudeQuestions.length} questions loaded`;
}


// =====================================
// RENDER ONE QUESTION
// =====================================

function renderQuestion(
    question,
    index,
    container
) {

    const questionCard =
        document.createElement("article");


    questionCard.className =
        "question-card";


    questionCard.innerHTML = `

        <div class="question-top">

            <span class="question-number">
                Question ${index + 1}
            </span>

            <span class="difficulty">
                ${escapeHTML(question.difficulty)}
            </span>

        </div>


        <h3 class="question-text">

            ${escapeHTML(question.question)}

        </h3>


        <div class="options-container">

            ${createOption(
                question.id,
                "A",
                question.option_a
            )}

            ${createOption(
                question.id,
                "B",
                question.option_b
            )}

            ${createOption(
                question.id,
                "C",
                question.option_c
            )}

            ${createOption(
                question.id,
                "D",
                question.option_d
            )}

        </div>

    `;


    container.appendChild(
        questionCard
    );

}


// =====================================
// CREATE OPTION
// =====================================

function createOption(
    questionId,
    optionValue,
    optionText
) {

    return `

        <label class="option-label">

            <input
                type="radio"
                name="question-${questionId}"
                value="${optionValue}"
            >

            <span class="option-letter">
                ${optionValue}
            </span>

            <span class="option-text">
                ${escapeHTML(optionText)}
            </span>

        </label>

    `;
}


// =====================================
// SUBMIT ANSWERS
// =====================================

function submitAnswers(event) {

    event.preventDefault();


    if (submitted) {
        return;
    }


    let score = 0;

    let attempted = 0;


    aptitudeQuestions.forEach(
        (question) => {

            const selectedOption =
                document.querySelector(
                    `input[name="question-${question.id}"]:checked`
                );


            if (selectedOption) {

                attempted++;


                if (
                    selectedOption.value ===
                    question.correct_answer
                ) {

                    score++;

                }

            }

        }
    );


    submitted = true;


    showResults(
        score,
        attempted,
        aptitudeQuestions.length
    );

    // Save test results to the database
    fetch('/api/aptitude/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            score: score,
            total_questions: aptitudeQuestions.length
        })
    }).catch(err => console.error("Failed to save score", err));


    showCorrectAnswers();


    const submitButton =
        document.getElementById("submitButton");


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Practice Submitted";

    }

}


// =====================================
// SHOW RESULTS
// =====================================

function showResults(
    score,
    attempted,
    total
) {

    const resultContainer =
        document.getElementById("resultContainer");

    const resultText =
        document.getElementById("resultText");


    const percentage =
        total > 0
            ? Math.round((score / total) * 100)
            : 0;


    resultText.textContent =
        `You scored ${score}/${total} (${percentage}%).
        Attempted: ${attempted}/${total}.`;


    resultContainer.hidden = false;


    resultContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================
// SHOW CORRECT ANSWERS
// =====================================

function showCorrectAnswers() {

    aptitudeQuestions.forEach(
        (question) => {

            const options =
                document.querySelectorAll(
                    `input[name="question-${question.id}"]`
                );


            options.forEach(
                (option) => {

                    option.disabled = true;


                    const label =
                        option.closest(
                            ".option-label"
                        );


                    if (
                        option.value ===
                        question.correct_answer
                    ) {

                        label.classList.add(
                            "correct-option"
                        );

                    }


                    if (
                        option.checked &&
                        option.value !==
                        question.correct_answer
                    ) {

                        label.classList.add(
                            "wrong-option"
                        );

                    }

                }
            );

        }
    );

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}