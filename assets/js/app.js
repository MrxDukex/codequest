// ===== APP INITIALIZATION =====
let currentView = "dashboard";
let currentPath = null;
let currentChallengeId = null;
let tutorialStep = 1;

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

// Initialize the application
function initializeApp() {
  // Check if first time user
  const isFirstTime = !localStorage.getItem("codequest_initialized");

  // Check for achievement migration (run once after update)
  const achievementsMigrated = localStorage.getItem(
    "codequest_achievements_migrated_v2"
  );
  if (!achievementsMigrated) {
    console.log("Running achievement migration...");
    if (typeof recheckAllAchievements === "function") {
      recheckAllAchievements();
    }
    localStorage.setItem("codequest_achievements_migrated_v2", "true");
  }

  if (isFirstTime) {
    // Show tutorial
    setTimeout(() => {
      document.getElementById("loading-screen").classList.add("hidden");
      document.getElementById("tutorial-overlay").classList.remove("hidden");
    }, 1500);
  } else {
    // Load app directly
    setTimeout(() => {
      document.getElementById("loading-screen").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      loadDashboard();
    }, 1000);
  }

  // Register service worker for PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker registration failed"));
  }

  // Initialize auto-save
  initializeAutoSave();

  // Check and update daily quest
  checkDailyQuest();

  // Update quest timer
  updateQuestTimer();
  setInterval(updateQuestTimer, 60000); // Update every minute
}

// Tutorial navigation
function nextTutorialStep() {
  const currentStep = document.querySelector(
    `.tutorial-step[data-step="${tutorialStep}"]`
  );
  currentStep.classList.add("hidden");

  tutorialStep++;

  const nextStep = document.querySelector(
    `.tutorial-step[data-step="${tutorialStep}"]`
  );
  if (nextStep) {
    nextStep.classList.remove("hidden");
  }
}

function completeTutorial() {
  localStorage.setItem("codequest_initialized", "true");
  document.getElementById("tutorial-overlay").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  loadDashboard();
  showToast("Welcome to CodeQuest! Let's start learning! 🚀", "success");
}

// ===== NAVIGATION =====
function navigateToDashboard() {
  switchView("dashboard");
  updateNavigation("dashboard");
  loadDashboard();
}

function navigateToPath(path) {
  currentPath = path;
  switchView("challenge-list");
  loadChallengeList(path);
}

function scrollPaths(direction) {
  const container = document.getElementById("paths-scroll-container");
  if (!container) return;

  const scrollAmount = 340; // Card width (320px) + gap (20px)
  const currentScroll = container.scrollLeft;

  if (direction === "left") {
    container.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: "smooth",
    });
  } else {
    container.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: "smooth",
    });
  }
}

function checkAndNavigateToProjects() {
  const progress = getProgress();
  const quizzes = getQuizzes();

  // Check if all path final exams are passed
  const requiredExams = ["html-final-exam", "css-final-exam", "js-final-exam"];
  const allPassed = requiredExams.every(
    (examId) => progress.quizResults?.[examId]?.passed
  );

  if (allPassed) {
    navigateToPath("projects");
  } else {
    showNotification(
      "🔒 Complete and pass all path final exams (HTML, CSS, JavaScript) to unlock Final Projects!",
      "warning"
    );
  }
}

function checkAndTakeFinalExam() {
  const progress = getProgress();
  const quizzes = getQuizzes();
  const finalExam = quizzes["final-exam"];

  if (!finalExam || !finalExam.requiredQuizzes) {
    takeFinalExam();
    return;
  }

  // Check if all required quizzes are passed
  const allPassed = finalExam.requiredQuizzes.every(
    (quizId) => progress.quizResults?.[quizId]?.passed
  );

  if (allPassed) {
    navigateToQuiz("final-exam");
  } else {
    const remaining = finalExam.requiredQuizzes.filter(
      (quizId) => !progress.quizResults?.[quizId]?.passed
    ).length;
    showNotification(
      `🔒 Pass all path final exams first! (${remaining} remaining)`,
      "warning"
    );
  }
}

function navigateToPlayground() {
  switchView("playground");
  updateNavigation("playground");
  loadPlayground();
}

function navigateToAchievements() {
  switchView("achievements");
  updateNavigation("achievements");
  loadAchievements();
}

function navigateToProfile() {
  switchView("profile");
  updateNavigation("profile");
  loadProfile();
}

function backToChallengeList() {
  navigateToPath(currentPath);
}

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
  });

  // Show selected view
  const view = document.getElementById(`${viewName}-view`);
  if (view) {
    view.classList.add("active");
  }

  currentView = viewName;

  // Scroll to top immediately when switching views
  window.scrollTo(0, 0);

  // Multiple scroll attempts to ensure we stay at top
  requestAnimationFrame(() => window.scrollTo(0, 0));
  setTimeout(() => window.scrollTo(0, 0), 50);
  setTimeout(() => window.scrollTo(0, 0), 150);
}

function updateNavigation(active) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
}

// ===== DASHBOARD =====
function loadDashboard() {
  const progress = getProgress();

  // Update greeting based on time
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  if (hour >= 18) greeting = "Good Evening";

  document.getElementById("greeting").textContent = `${greeting}! 👋`;

  // Update stats
  document.getElementById("streak-value").textContent = progress.streak;
  document.getElementById("achievements-value").textContent =
    progress.achievements.filter((a) => a.unlocked).length;
  document.getElementById("time-value").textContent = formatTime(
    progress.totalTime
  );

  // Update level display
  updateLevelDisplay(progress);

  // Update rank display
  updateRankDisplay(progress);

  // Update path progress - Core paths
  updatePathProgress("html", progress);
  updatePathProgress("css", progress);
  updatePathProgress("js", progress);

  // Update path progress - Framework paths
  updatePathProgress("react", progress);
  updatePathProgress("nextjs", progress);

  // Update path progress - Database paths
  updatePathProgress("mysql", progress);
  updatePathProgress("postgresql", progress);
  updatePathProgress("sqlite", progress);

  // Update continue section
  updateContinueSection(progress);

  // Update daily quest
  updateDailyQuest(progress);

  // Update advanced section status
  updateAdvancedSectionStatus(progress);
}

function updateAdvancedSectionStatus(progress) {
  // Update Final Projects status
  const projectsCard = document.getElementById("projects-card");
  const projectsLockMessage = document.getElementById("projects-lock-message");

  const pathFinalExams = ["html-final-exam", "css-final-exam", "js-final-exam"];
  const allPathExamsPassed = pathFinalExams.every(
    (examId) => progress.quizResults?.[examId]?.passed
  );

  if (allPathExamsPassed) {
    projectsCard?.classList.remove("locked");
    projectsCard?.classList.add("available");
    if (projectsLockMessage) {
      projectsLockMessage.style.display = "none";
    }
  }

  // Update Grand Final Exam status
  const finalExamCard = document.getElementById("final-exam-card");
  const finalExamInfo = document.getElementById("final-exam-info");
  const finalExamDetails = document.getElementById("final-exam-details");

  if (!finalExamCard) return;

  const quizzes = getQuizzes();
  const finalExam = quizzes["final-exam"];

  if (!finalExam) return;

  const allRequiredQuizzesPassed =
    finalExam.requiredQuizzes?.every(
      (quizId) => progress.quizResults?.[quizId]?.passed
    ) || false;

  const finalExamPassed = progress.quizResults?.["final-exam"]?.passed;
  const finalExamBestScore =
    progress.quizResults?.["final-exam"]?.bestScore || 0;

  if (finalExamPassed) {
    finalExamCard.classList.remove("locked");
    finalExamCard.classList.add("passed");
    finalExamInfo.innerHTML = `<i class="fas fa-trophy"></i> Passed with ${finalExamBestScore}%`;
    finalExamDetails.style.display = "block";
  } else if (allRequiredQuizzesPassed) {
    finalExamCard.classList.remove("locked");
    finalExamCard.classList.add("available");
    finalExamInfo.innerHTML = `<i class="fas fa-star"></i> Ready to take!`;
    finalExamDetails.style.display = "block";
  } else {
    finalExamCard.classList.add("locked");
    const passedCount =
      finalExam.requiredQuizzes?.filter(
        (quizId) => progress.quizResults?.[quizId]?.passed
      ).length || 0;
    const totalRequired = finalExam.requiredQuizzes?.length || 0;
    finalExamInfo.innerHTML = `<i class="fas fa-lock"></i> Pass all path final exams first (${passedCount}/${totalRequired})`;
    finalExamDetails.style.display = "none";
  }
}

function takeFinalExam() {
  const progress = getProgress();
  const requiredQuizzes = [
    "html-quiz-1",
    "html-quiz-2",
    "css-quiz-1",
    "css-quiz-2",
    "js-quiz-1",
  ];
  const allQuizzesPassed = requiredQuizzes.every(
    (quizId) => progress.quizResults?.[quizId]?.passed
  );

  if (!allQuizzesPassed) {
    showToast("Complete all section quizzes first!", "warning");
    return;
  }

  navigateToQuiz("final-exam");
}

function updateLevelDisplay(progress) {
  const level = progress.level;
  const currentXP = progress.xp;
  const neededXP = calculateXPForLevel(level + 1);
  const percentage = (currentXP / neededXP) * 100;

  document.getElementById("level-display").textContent = level;
  document.getElementById("level-text").textContent = level;
  document.getElementById("current-xp").textContent = currentXP;
  document.getElementById("needed-xp").textContent = neededXP;
  document.getElementById("xp-fill").style.width = `${percentage}%`;

  // Update navbar
  document.getElementById("nav-level").textContent = `Lvl ${level}`;
  document.getElementById("nav-xp").textContent = `${currentXP} XP`;
  document.getElementById("nav-xp-progress").style.width = `${percentage}%`;
}

function updateRankDisplay(progress) {
  const level = progress.level;

  // Get rank information from gamification.js
  if (typeof getRank !== "function") return;

  const rank = getRank(level);
  const nextRank = getNextRank ? getNextRank(level) : null;

  // Update rank shield image
  const rankShield = document.getElementById("rank-shield");
  if (rankShield && rank.shield) {
    rankShield.innerHTML = `<img src="assets/images/${rank.shield}" alt="${rank.name} Shield" style="width: 80px; height: 80px; margin-bottom: 10px;">`;
  }

  // Update rank text
  const rankInfo = document.getElementById("rank-info");
  if (rankInfo) {
    rankInfo.innerHTML = `
      <h3 class="rank-name" style="margin: 0; font-size: 1.2rem; color: var(--text-primary);">${rank.name}</h3>
      <p class="rank-tier" style="margin: 5px 0; font-size: 0.9rem; color: var(--text-secondary); opacity: 0.8;">${rank.tierName}</p>
    `;

    // Add next rank info if available
    if (nextRank) {
      const levelsToNext = nextRank.minLevel - level;
      rankInfo.innerHTML += `<p style="margin: 5px 0; font-size: 0.85rem; color: var(--text-muted);">${levelsToNext} levels to ${nextRank.name}</p>`;
    }
  }
}

function updatePathProgress(path, progress) {
  // Map short names to full category names
  const categoryMap = {
    html: "HTML",
    css: "CSS",
    js: "JavaScript",
    react: "React",
    nextjs: "Next.js",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    sqlite: "SQLite",
  };

  const category = categoryMap[path] || path;

  const challenges = getAllChallenges().filter((c) => c.category === category);
  const completed = challenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const total = challenges.length;
  const percentage = (completed / total) * 100;

  document.getElementById(
    `${path}-completed`
  ).textContent = `${completed}/${total} Complete`;
  document.getElementById(`${path}-progress`).style.width = `${percentage}%`;

  const btnText = document.getElementById(`${path}-btn-text`);
  if (btnText) {
    btnText.textContent = completed > 0 ? "Continue Path" : "Start Path";
  }

  // Load quiz checkpoints for this path
  loadPathQuizCheckpoints(path, category, progress);
}

function loadPathQuizCheckpoints(path, category, progress) {
  const quizzesContainer = document.getElementById(`${path}-quizzes`);
  if (!quizzesContainer) return;

  const quizzes = getQuizzes();
  const pathQuizzes = Object.values(quizzes).filter(
    (q) => q.category === category
  );

  if (pathQuizzes.length === 0) {
    quizzesContainer.innerHTML = "";
    return;
  }

  // Only show passed quizzes
  const passedQuizzes = pathQuizzes.filter(
    (quiz) => progress.quizResults?.[quiz.id]?.passed
  );

  if (passedQuizzes.length === 0) {
    quizzesContainer.innerHTML = "";
    return;
  }

  quizzesContainer.innerHTML = `
    <div class="quiz-checkpoints">
      <div class="checkpoint-label">
        <i class="fas fa-check-circle"></i> Quizzes Passed:
      </div>
      ${passedQuizzes
        .map((quiz) => {
          return `
          <div class="checkpoint-item passed" 
               onclick="event.stopPropagation(); navigateToQuiz('${quiz.id}')">
            <span class="checkpoint-icon">✅</span>
            <span class="checkpoint-text">${quiz.title}</span>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

function updateContinueSection(progress) {
  const inProgressChallenges = Object.keys(progress.challengeStates).filter(
    (id) => progress.challengeStates[id].status === "in-progress"
  );

  const continueCard = document.getElementById("continue-card");

  if (inProgressChallenges.length > 0) {
    const challengeId = inProgressChallenges[0];
    const challenge = getAllChallenges().find((c) => c.id === challengeId);

    if (challenge) {
      continueCard.querySelector(".continue-category").textContent =
        challenge.category;
      continueCard.querySelector(".continue-category").style.background =
        getCategoryGradient(challenge.category);
      continueCard.querySelector(".continue-title").textContent =
        challenge.title;
      continueCard.querySelector(
        ".continue-progress"
      ).textContent = `${challenge.difficulty} • In Progress`;
      continueCard.querySelector(".btn").onclick = () =>
        loadChallenge(challengeId);
      continueCard.querySelector(".btn").innerHTML =
        '<i class="fas fa-play"></i> Continue Challenge';
    }
  }
}

function startFirstChallenge() {
  const firstChallenge = getAllChallenges()[0];
  if (firstChallenge) {
    currentPath = firstChallenge.category.toLowerCase();
    loadChallenge(firstChallenge.id);
    switchView("challenge");
  }
}

// ===== CHALLENGE LIST =====
function loadChallengeList(path) {
  const challenges = getAllChallenges().filter(
    (c) => c.category.toLowerCase().replace(/\./g, "") === path
  );
  const progress = getProgress();

  // Update header
  const titles = {
    html: {
      title: "HTML Challenges",
      subtitle: "Master the structure of the web",
    },
    css: { title: "CSS Challenges", subtitle: "Design beautiful interfaces" },
    javascript: {
      title: "JavaScript Challenges",
      subtitle: "Bring your pages to life",
    },
    react: {
      title: "React Challenges",
      subtitle: "Build dynamic user interfaces",
    },
    nextjs: {
      title: "Next.js Challenges",
      subtitle: "Full-stack React framework",
    },
    mysql: {
      title: "MySQL Challenges",
      subtitle: "Learn relational database management",
    },
    postgresql: {
      title: "PostgreSQL Challenges",
      subtitle: "Advanced database features",
    },
    sqlite: {
      title: "SQLite Challenges",
      subtitle: "Lightweight embedded databases",
    },
    projects: {
      title: "Final Projects",
      subtitle: "Build real-world applications",
    },
  };

  document.getElementById("path-title").textContent =
    titles[path]?.title || "Challenges";
  document.getElementById("path-subtitle").textContent =
    titles[path]?.subtitle || "Learn and practice";

  const completed = challenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  document.getElementById(
    "path-progress-text"
  ).textContent = `${completed}/${challenges.length} Complete`;

  // Render challenges
  const list = document.getElementById("challenges-list");
  console.log("Challenge list element:", list);
  console.log("Number of challenges to render:", challenges.length);
  console.log("First challenge:", challenges[0]);
  list.innerHTML = "";

  // Get quizzes for this path
  const pathCategoryMap = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    react: "React",
    nextjs: "Next.js",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    sqlite: "SQLite",
  };
  const pathCategory = pathCategoryMap[path] || "";
  const quizzes = getQuizzes();
  const pathQuizzes = Object.values(quizzes).filter(
    (q) => q.category === pathCategory
  );

  challenges.forEach((challenge, index) => {
    console.log(
      `Rendering challenge ${index + 1}/${challenges.length}:`,
      challenge.title
    );
    const state = progress.challengeStates[challenge.id] || {
      status: "not-started",
    };

    // Lock challenges: only allow access to completed challenges, in-progress, or the next available one
    let isLocked = false;
    if (state.status === "not-started" && index > 0) {
      // Check if previous challenge is completed
      const prevChallenge = challenges[index - 1];
      const prevState = progress.challengeStates[prevChallenge.id];
      isLocked = !prevState || prevState.status !== "completed";
    }

    const item = document.createElement("div");
    item.className = `challenge-item ${state.status} ${
      isLocked ? "locked" : ""
    }`;
    if (!isLocked) {
      item.onclick = () => loadChallenge(challenge.id);
    } else {
      item.style.cursor = "not-allowed";
      item.style.opacity = "0.6";
      item.title = `Complete challenge ${index} first to unlock this`;
      item.onclick = () => {
        showNotification(
          `🔒 Complete the previous challenge first!`,
          "warning"
        );
      };
    }

    item.innerHTML = `
            <div class="challenge-number">${index + 1}</div>
            <div class="challenge-info">
                <h3>${challenge.title}${isLocked ? " 🔒" : ""}</h3>
                <p>${challenge.description}</p>
                <div class="challenge-badges">
                    <span class="badge difficulty-${challenge.difficulty}">${
      challenge.difficulty
    }</span>
                    <span class="badge xp">+${challenge.xp} XP</span>
                </div>
            </div>
            <div class="challenge-status-icon">
                ${
                  isLocked
                    ? '<i class="fas fa-lock"></i>'
                    : state.status === "completed"
                    ? '<i class="fas fa-check-circle"></i>'
                    : state.status === "in-progress"
                    ? '<i class="fas fa-spinner"></i>'
                    : '<i class="fas fa-circle"></i>'
                }
            </div>
        `;

    list.appendChild(item);
    console.log(`Appended challenge item ${index + 1} to list`);

    // Check if we should add a quiz checkpoint after this challenge
    // A quiz appears after its LAST required challenge is completed
    const quiz = pathQuizzes.find((q) => {
      const lastRequiredChallenge =
        q.requiredChallenges[q.requiredChallenges.length - 1];
      return lastRequiredChallenge === challenge.id;
    });

    if (quiz) {
      const quizResult = progress.quizResults?.[quiz.id];
      const isPassed = quizResult?.passed || false;
      const isUnlocked = quiz.requiredChallenges.every((id) =>
        progress.completedChallenges.includes(id)
      );

      const quizItem = document.createElement("div");
      quizItem.className = `quiz-checkpoint-item ${
        isPassed ? "passed" : isUnlocked ? "unlocked" : "locked"
      }`;

      if (isUnlocked || isPassed) {
        quizItem.onclick = () => navigateToQuiz(quiz.id);
      }

      quizItem.innerHTML = `
        <div class="quiz-checkpoint-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="quiz-checkpoint-info">
          <h3>${quiz.title}</h3>
          <p>${quiz.description}</p>
          <div class="quiz-checkpoint-meta">
            <span class="badge quiz-badge"><i class="fas fa-question-circle"></i> ${
              quiz.questions.length
            } Questions</span>
            <span class="badge quiz-badge"><i class="fas fa-star"></i> +${
              quiz.xpReward
            } XP</span>
            <span class="badge quiz-badge"><i class="fas fa-chart-line"></i> ${
              quiz.passingScore
            }% to Pass</span>
          </div>
        </div>
        <div class="quiz-checkpoint-status">
          ${
            isPassed
              ? '<i class="fas fa-check-circle"></i><span>Passed</span>'
              : isUnlocked
              ? '<i class="fas fa-star"></i><span>Available</span>'
              : '<i class="fas fa-lock"></i><span>Locked</span>'
          }
        </div>
      `;

      list.appendChild(quizItem);
    }
  });

  console.log(
    "Finished rendering. List now has",
    list.children.length,
    "items"
  );
}

function isChallengUnlocked(challenge, progress) {
  // First challenge is always unlocked
  const allChallenges = getAllChallenges().filter(
    (c) => c.category === challenge.category
  );
  const index = allChallenges.findIndex((c) => c.id === challenge.id);

  if (index === 0) return true;

  // Check if previous challenges in category are completed
  for (let i = 0; i < index; i++) {
    if (!progress.completedChallenges.includes(allChallenges[i].id)) {
      return false;
    }
  }

  return true;
}

// ===== UTILITY FUNCTIONS =====
function getCategoryGradient(category) {
  const gradients = {
    HTML: "linear-gradient(135deg, #e34c26 0%, #f06529 100%)",
    CSS: "linear-gradient(135deg, #264de4 0%, #4169e1 100%)",
    JavaScript: "linear-gradient(135deg, #f0db4f 0%, #f7df1e 100%)",
  };
  return gradients[category] || "var(--gradient-primary)";
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function calculateXPForLevel(level) {
  // Very flat XP curve for 45-50 level progression
  // 1.1 exponent supports reaching Level 45+ with available XP
  return Math.floor(100 * Math.pow(1.1, level - 1));
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "times-circle"
            : "info-circle"
        }"></i>
        <span>${message}</span>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== AUTO-SAVE =====
let autoSaveTimer;

function initializeAutoSave() {
  // Save on page unload
  window.addEventListener("beforeunload", () => {
    if (currentView === "challenge" && currentChallengeId) {
      saveCurrentChallenge();
    }
  });
}

function saveCurrentChallenge() {
  const code = document.getElementById("code-input")?.value;
  if (code && currentChallengeId) {
    const progress = getProgress();
    if (!progress.challengeStates[currentChallengeId]) {
      progress.challengeStates[currentChallengeId] = { status: "in-progress" };
    }
    progress.challengeStates[currentChallengeId].currentCode = code;
    progress.challengeStates[currentChallengeId].lastAccessed = Date.now();
    saveProgress(progress);
  }
}

// ===== DAILY QUEST =====
function checkDailyQuest() {
  const progress = getProgress();
  const today = new Date().toDateString();

  if (progress.lastQuestDate !== today) {
    // Reset daily quest
    progress.dailyQuestCompleted = false;
    progress.lastQuestDate = today;
    saveProgress(progress);
  }
}

function updateDailyQuest(progress) {
  const questCard = document.getElementById("daily-quest");
  const questStatus = document.getElementById("quest-status");

  if (progress.dailyQuestCompleted) {
    questStatus.innerHTML = '<i class="fas fa-check-circle"></i>';
    questStatus.classList.add("completed");
  } else {
    questStatus.innerHTML = '<i class="fas fa-circle-notch"></i>';
    questStatus.classList.remove("completed");
  }
}

function updateQuestTimer() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const timer = document.getElementById("quest-timer");
  if (timer) {
    timer.textContent = `Resets in ${hours}h ${minutes}m`;
  }
}

// ===== EXPORT FUNCTIONS =====
function exportProgress() {
  const progress = getProgress();
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `codequest-progress-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
  showToast("Progress exported successfully!", "success");
}

function resetProgress() {
  if (
    confirm(
      "Are you sure you want to reset ALL progress? This cannot be undone!"
    )
  ) {
    if (
      confirm(
        "Really? All your XP, achievements, and completed challenges will be lost!"
      )
    ) {
      localStorage.removeItem("codequest_progress");
      location.reload();
    }
  }
}
