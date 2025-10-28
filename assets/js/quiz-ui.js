// ===== QUIZ UI HANDLERS =====

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizAnswers = [];
let quizStartTime = null;

// Show quiz notification after completing required challenges
function checkAndShowQuizNotification() {
  const quiz = checkForQuiz();
  if (quiz) {
    setTimeout(() => {
      showQuizAvailableModal(quiz);
    }, 1000);
  }
}

// Show modal when quiz becomes available
function showQuizAvailableModal(quiz) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content quiz-available-modal">
      <div class="modal-icon">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <h2>🎓 Quiz Available!</h2>
      <h3>${quiz.title}</h3>
      <p>${quiz.description}</p>
      <p class="quiz-unlock-message">
        You've completed all the required challenges! Test your knowledge and earn <strong>+${quiz.xpReward} XP</strong>!
      </p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="dismissQuizModal()">
          Maybe Later
        </button>
        <button class="btn btn-primary" onclick="goToQuiz('${quiz.id}')">
          Take Quiz Now!
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function dismissQuizModal() {
  const modal = document.querySelector(".quiz-available-modal");
  if (modal && modal.parentElement) {
    modal.parentElement.remove();
  }
}

function goToQuiz(quizId) {
  dismissQuizModal();
  loadQuiz(quizId);
}

// Navigate to quiz view
function navigateToQuiz(quizId) {
  loadQuiz(quizId);
}

// Load quiz
function loadQuiz(quizId) {
  const quizzes = getQuizzes();
  const quiz = quizzes[quizId];

  if (!quiz) {
    showToast("Quiz not found!", "error");
    return;
  }

  currentQuiz = quiz;
  currentQuestionIndex = 0;
  quizAnswers = [];

  // Mark quiz as shown
  markQuizShown(quizId);

  // Switch to quiz view
  switchView("quiz");

  // Load quiz intro
  loadQuizIntro();
}

// Load quiz intro screen
function loadQuizIntro() {
  const progress = getProgress();

  document.getElementById("quiz-title").textContent = currentQuiz.title;
  document.getElementById("quiz-intro-title").textContent = currentQuiz.title;
  document.getElementById("quiz-intro-description").textContent =
    currentQuiz.description;
  document.getElementById("quiz-question-count").textContent =
    currentQuiz.questions.length;
  document.getElementById("quiz-passing-score").textContent =
    currentQuiz.passingScore;
  document.getElementById("quiz-xp-reward").textContent = currentQuiz.xpReward;

  // Show status message
  const statusMessage = getQuizStatusMessage(currentQuiz.id);
  const statusEl = document.getElementById("quiz-status-message");
  statusEl.textContent = statusMessage;

  // Check if can take quiz
  const canTake = canTakeQuiz(currentQuiz.id);
  const startBtn = document.getElementById("start-quiz-btn");

  if (!canTake) {
    startBtn.disabled = true;
    startBtn.innerHTML =
      '<i class="fas fa-lock"></i> Complete Review Challenges First';
    statusEl.classList.add("warning");
  } else {
    startBtn.disabled = false;
    statusEl.classList.remove("warning");

    const quizResult = progress.quizResults?.[currentQuiz.id];
    if (quizResult?.passed) {
      startBtn.innerHTML = '<i class="fas fa-redo"></i> Retake Quiz';

      // Show and enable the Next button if quiz has been passed
      const nextBtn = document.getElementById("quiz-intro-next-btn");
      if (nextBtn) {
        nextBtn.style.display = "inline-block";
        nextBtn.disabled = false;
        nextBtn.classList.remove("btn-disabled");
        nextBtn.classList.add("btn-success");
      }
    } else {
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start Quiz';

      // Hide the Next button if quiz hasn't been passed yet
      const nextBtn = document.getElementById("quiz-intro-next-btn");
      if (nextBtn) {
        nextBtn.style.display = "none";
      }
    }
  }

  // Show previous attempts
  if (progress.quizResults && progress.quizResults[currentQuiz.id]?.attempts) {
    const attempts = progress.quizResults[currentQuiz.id].attempts;
    if (attempts.length > 0) {
      document.getElementById("quiz-previous-attempts").style.display = "block";
      const attemptsList = document.getElementById("quiz-attempts-list");
      attemptsList.innerHTML = attempts
        .map(
          (attempt, i) => `
        <div class="quiz-attempt-item ${attempt.passed ? "passed" : "failed"}">
          <span>Attempt ${i + 1}</span>
          <span>${attempt.score}% ${attempt.passed ? "✅" : "❌"}</span>
        </div>
      `
        )
        .join("");
    }
  }

  // Show intro, hide questions and results
  document.getElementById("quiz-intro").style.display = "block";
  document.getElementById("quiz-questions").style.display = "none";
  document.getElementById("quiz-results").style.display = "none";
}

// Start quiz
function startQuiz() {
  if (!canTakeQuiz(currentQuiz.id)) {
    showToast("Complete review challenges first!", "warning");
    return;
  }

  quizStartTime = Date.now();
  currentQuestionIndex = 0;
  quizAnswers = new Array(currentQuiz.questions.length).fill(null);

  document.getElementById("quiz-intro").style.display = "none";
  document.getElementById("quiz-questions").style.display = "block";
  document.getElementById("quiz-results").style.display = "none";

  loadQuizQuestion();
}

// Load current question
function loadQuizQuestion() {
  const question = currentQuiz.questions[currentQuestionIndex];
  const container = document.getElementById("quiz-question-container");

  // Update progress
  document.getElementById("quiz-progress-text").textContent = `Question ${
    currentQuestionIndex + 1
  } of ${currentQuiz.questions.length}`;
  const progressPercent =
    ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  document.getElementById(
    "quiz-progress-fill"
  ).style.width = `${progressPercent}%`;

  // Update navigation buttons
  document.getElementById("quiz-prev-btn").disabled =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === currentQuiz.questions.length - 1;
  document.getElementById("quiz-next-btn").style.display = isLastQuestion
    ? "none"
    : "inline-flex";
  document.getElementById("quiz-submit-btn").style.display = isLastQuestion
    ? "inline-flex"
    : "none";

  // Render question based on type
  if (question.type === "multiple-choice") {
    // Clear container
    container.innerHTML = "";

    // Create question wrapper
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";

    // Add question title
    const title = document.createElement("h3");
    title.textContent = `Question ${currentQuestionIndex + 1}`;
    questionDiv.appendChild(title);

    // Add question text
    const questionText = document.createElement("p");
    questionText.className = "quiz-question-text";
    questionText.textContent = question.question;
    questionDiv.appendChild(questionText);

    // Create options container
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "quiz-options";

    // Add each option
    question.options.forEach((option, i) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      if (quizAnswers[currentQuestionIndex] === i) {
        label.classList.add("selected");
      }

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quiz-answer";
      radio.value = i;
      radio.checked = quizAnswers[currentQuestionIndex] === i;
      radio.onchange = () => selectQuizAnswer(i);

      const letterSpan = document.createElement("span");
      letterSpan.className = "option-letter";
      letterSpan.textContent = String.fromCharCode(65 + i);

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = option;

      label.appendChild(radio);
      label.appendChild(letterSpan);
      label.appendChild(textSpan);
      optionsDiv.appendChild(label);
    });

    questionDiv.appendChild(optionsDiv);
    container.appendChild(questionDiv);
  } else if (question.type === "code") {
    const savedAnswer =
      quizAnswers[currentQuestionIndex] || question.starterCode;
    container.innerHTML = `
      <div class="quiz-question">
        <h3>Question ${currentQuestionIndex + 1}</h3>
        <p class="quiz-question-text">${question.question}</p>
        <div class="quiz-code-editor">
          <textarea id="quiz-code-input" class="code-input" rows="8">${savedAnswer}</textarea>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="resetQuizCode()">
          <i class="fas fa-redo"></i> Reset
        </button>
      </div>
    `;

    // Auto-save code on input
    document
      .getElementById("quiz-code-input")
      .addEventListener("input", (e) => {
        quizAnswers[currentQuestionIndex] = e.target.value;
      });
  }
}

// Select multiple choice answer
function selectQuizAnswer(answerIndex) {
  quizAnswers[currentQuestionIndex] = answerIndex;

  // Update UI
  document.querySelectorAll(".quiz-option").forEach((el, i) => {
    if (i === answerIndex) {
      el.classList.add("selected");
    } else {
      el.classList.remove("selected");
    }
  });
}

// Reset quiz code
function resetQuizCode() {
  const question = currentQuiz.questions[currentQuestionIndex];
  document.getElementById("quiz-code-input").value = question.starterCode;
  quizAnswers[currentQuestionIndex] = question.starterCode;
}

// Previous question
function previousQuizQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuizQuestion();
  }
}

// Next question
function nextQuizQuestion() {
  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    // Save current answer if it's a code question
    if (currentQuiz.questions[currentQuestionIndex].type === "code") {
      const codeInput = document.getElementById("quiz-code-input");
      if (codeInput) {
        quizAnswers[currentQuestionIndex] = codeInput.value;
      }
    }

    currentQuestionIndex++;
    loadQuizQuestion();
  }
}

// Submit quiz
function submitQuiz() {
  console.log("Submit quiz called");

  // Save current answer if it's a code question
  if (currentQuiz.questions[currentQuestionIndex].type === "code") {
    const codeInput = document.getElementById("quiz-code-input");
    if (codeInput) {
      quizAnswers[currentQuestionIndex] = codeInput.value;
    }
  }

  console.log("Quiz answers:", quizAnswers);

  // Check if all questions answered
  const unanswered = quizAnswers.filter(
    (a) => a === null || a === undefined
  ).length;

  console.log("Unanswered questions:", unanswered);

  if (unanswered > 0) {
    if (
      !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)
    ) {
      return;
    }
  }

  // Grade quiz
  console.log("Starting grading...");
  gradeQuiz();
}

// Grade the quiz
function gradeQuiz() {
  console.log("gradeQuiz function called");
  let correctCount = 0;
  const results = [];

  currentQuiz.questions.forEach((question, i) => {
    const userAnswer = quizAnswers[i];
    let isCorrect = false;

    console.log(`Grading question ${i}:`, {
      question: question.question,
      userAnswer,
      type: question.type,
    });

    try {
      if (question.type === "multiple-choice") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "code") {
        console.log(`Running test function for question ${i}...`);
        isCorrect = question.testFunction(userAnswer || "");
        console.log(`Test result for question ${i}:`, isCorrect);
      }
    } catch (error) {
      console.error(`Error grading question ${i}:`, error);
      isCorrect = false;
    }

    if (isCorrect) correctCount++;

    results.push({
      question: question.question,
      userAnswer: userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: isCorrect,
      explanation: question.explanation,
      type: question.type,
      options: question.options,
    });
  });

  const score = Math.round((correctCount / currentQuiz.questions.length) * 100);
  const passed = score >= currentQuiz.passingScore;

  // Save results
  const progress = saveQuizResult(currentQuiz.id, score, results, passed);

  // Award XP if passed
  if (passed) {
    addXP(currentQuiz.xpReward, `${currentQuiz.title} completed!`);
  }

  // Show results
  showQuizResults(score, correctCount, passed, results);
}

// Show quiz results
function showQuizResults(score, correctCount, passed, results) {
  document.getElementById("quiz-intro").style.display = "none";
  document.getElementById("quiz-questions").style.display = "none";
  document.getElementById("quiz-results").style.display = "block";

  // Update icon and title
  const icon = document.getElementById("quiz-results-icon");
  const title = document.getElementById("quiz-results-title");
  const message = document.getElementById("quiz-score-message");

  if (passed) {
    icon.innerHTML = '<i class="fas fa-trophy"></i>';
    icon.className = "quiz-results-icon success";
    title.textContent = "🎉 Congratulations!";
    message.textContent = "You passed the quiz!";
  } else {
    icon.innerHTML = '<i class="fas fa-times-circle"></i>';
    icon.className = "quiz-results-icon failure";
    title.textContent = "Keep Learning!";
    message.textContent = `You need ${currentQuiz.passingScore}% to pass. Review and try again!`;
  }

  // Update score
  document.getElementById("quiz-score-text").textContent = `${score}%`;
  document.getElementById(
    "quiz-correct-count"
  ).textContent = `${correctCount}/${currentQuiz.questions.length}`;

  if (passed) {
    document.getElementById(
      "quiz-xp-earned"
    ).textContent = `+${currentQuiz.xpReward} XP`;
  } else {
    document.getElementById("quiz-xp-earned").textContent = `0 XP`;
  }

  // Show remedial message if failed
  if (!passed && currentQuiz.remedialChallenges.length > 0) {
    const remedialMsg = document.getElementById("quiz-remedial-message");
    remedialMsg.style.display = "block";

    const remedialList = document.getElementById("quiz-remedial-list");
    const allChallenges = getAllChallenges();
    remedialList.innerHTML = currentQuiz.remedialChallenges
      .map((challengeId) => {
        const challenge = allChallenges.find((c) => c.id === challengeId);
        return `<li>${challenge ? challenge.title : challengeId}</li>`;
      })
      .join("");
  } else {
    document.getElementById("quiz-remedial-message").style.display = "none";
  }

  // Show review
  const reviewList = document.getElementById("quiz-review-list");
  reviewList.innerHTML = results
    .map((result, i) => {
      const statusIcon = result.isCorrect
        ? '<i class="fas fa-check-circle"></i> Correct'
        : '<i class="fas fa-times-circle"></i> Incorrect';

      let answerSection = "";
      if (result.type === "multiple-choice") {
        const userAnswerText =
          result.userAnswer !== null && result.userAnswer !== undefined
            ? result.options[result.userAnswer]
            : "No answer";

        answerSection = `
          <p class="quiz-review-answer">
            <strong>Your answer:</strong> ${userAnswerText}
          </p>`;

        if (!result.isCorrect) {
          answerSection += `
          <p class="quiz-review-correct">
            <strong>Correct answer:</strong> ${
              result.options[result.correctAnswer]
            }
          </p>`;
        }
      } else {
        // Code question - escape HTML entities
        const userCode = result.userAnswer || "No answer";
        const escapedCode = userCode
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        answerSection = `
          <p class="quiz-review-answer code-answer">
            <strong>Your code:</strong><br>
            <code>${escapedCode}</code>
          </p>`;
      }

      return `
        <div class="quiz-review-item ${
          result.isCorrect ? "correct" : "incorrect"
        }">
          <div class="quiz-review-header">
            <span class="quiz-review-number">Q${i + 1}</span>
            <span class="quiz-review-status">${statusIcon}</span>
          </div>
          <p class="quiz-review-question">${result.question}</p>
          ${answerSection}
          <p class="quiz-review-explanation">
            <i class="fas fa-info-circle"></i> ${result.explanation}
          </p>
        </div>
      `;
    })
    .join("");

  // Show/hide retake button
  const retakeBtn = document.getElementById("retake-quiz-btn");
  const nextBtn = document.getElementById("quiz-next-btn");

  if (passed) {
    retakeBtn.style.display = "inline-flex";
    retakeBtn.innerHTML = '<i class="fas fa-redo"></i> Retake for Better Score';

    // Enable Next button only if quiz is passed
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.classList.add("btn-success");
      nextBtn.classList.remove("btn-disabled");
    }
  } else {
    retakeBtn.style.display = "none";

    // Keep Next button disabled if quiz is failed
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.classList.remove("btn-success");
      nextBtn.classList.add("btn-disabled");
    }
  }
}

// Retake quiz
function retakeQuiz() {
  startQuiz();
}

// Back from quiz
function backFromQuiz() {
  // Navigate back to the challenge list for the current quiz's category
  if (currentQuiz && currentQuiz.category) {
    const categoryToPathMap = {
      HTML: "html",
      CSS: "css",
      JavaScript: "javascript",
      React: "react",
      "Next.js": "nextjs",
      MySQL: "mysql",
      PostgreSQL: "postgresql",
      SQLite: "sqlite",
    };

    const path = categoryToPathMap[currentQuiz.category];
    if (path) {
      loadChallengeList(path);
      switchView("challenge-list");
    } else {
      navigateToDashboard();
    }
  } else {
    navigateToDashboard();
  }
}

// Back from quiz results
function backFromQuizResults() {
  // Find the next challenge after this quiz
  const allChallenges = getAllChallenges().filter(
    (c) => c.category === currentQuiz.category
  );

  // Find the challenge that comes after the last required challenge
  const lastRequiredId =
    currentQuiz.requiredChallenges[currentQuiz.requiredChallenges.length - 1];
  const lastRequiredIndex = allChallenges.findIndex(
    (c) => c.id === lastRequiredId
  );

  // If there's a next challenge, load it
  if (lastRequiredIndex >= 0 && lastRequiredIndex < allChallenges.length - 1) {
    const nextChallenge = allChallenges[lastRequiredIndex + 1];
    loadChallenge(nextChallenge.id);
  } else {
    // Otherwise go back to dashboard
    navigateToDashboard();
  }

  // Check if there are more quizzes available
  setTimeout(checkAndShowQuizNotification, 500);
}

// Continue to next challenge after passing quiz
function continueAfterQuiz() {
  if (!currentQuiz) {
    navigateToDashboard();
    return;
  }

  const allChallenges = getAllChallenges().filter(
    (c) => c.category === currentQuiz.category
  );

  // Find the challenge that comes after the last required challenge
  const lastRequiredId =
    currentQuiz.requiredChallenges[currentQuiz.requiredChallenges.length - 1];
  const lastRequiredIndex = allChallenges.findIndex(
    (c) => c.id === lastRequiredId
  );

  // If there's a next challenge, load it
  if (lastRequiredIndex >= 0 && lastRequiredIndex < allChallenges.length - 1) {
    const nextChallenge = allChallenges[lastRequiredIndex + 1];
    loadChallenge(nextChallenge.id);
    showToast(`Continuing to ${nextChallenge.title}`, "success");
  } else {
    // Otherwise go back to challenge list
    showToast("You've completed all challenges in this path!", "success");
    backToChallengeList();
  }
}
