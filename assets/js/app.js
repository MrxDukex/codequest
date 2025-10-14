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

  // Update path progress
  updatePathProgress("html", progress);
  updatePathProgress("css", progress);
  updatePathProgress("js", progress);

  // Update continue section
  updateContinueSection(progress);

  // Update daily quest
  updateDailyQuest(progress);

  // Load available quizzes
  loadDashboardQuizzes(progress);
}

function loadDashboardQuizzes(progress) {
  const quizzes = getQuizzes();
  const quizzesSection = document.getElementById("quizzes-section");
  const quizzesList = document.getElementById("quizzes-list");

  // Get quizzes with their status
  const quizData = Object.values(quizzes).map((quiz) => {
    const allCompleted = quiz.requiredChallenges.every((challengeId) =>
      progress.completedChallenges.includes(challengeId)
    );

    const quizResult = progress.quizResults?.[quiz.id];
    const passed = quizResult?.passed || false;
    const needsReview = quizResult?.needsRemedial || false;

    return {
      quiz,
      available: allCompleted,
      passed,
      needsReview,
      bestScore: quizResult?.bestScore || 0,
    };
  });

  // Only show section if at least one quiz is available or passed
  const hasRelevantQuizzes = quizData.some((q) => q.available || q.passed);

  if (hasRelevantQuizzes) {
    quizzesSection.style.display = "block";

    quizzesList.innerHTML = quizData
      .map(({ quiz, available, passed, needsReview, bestScore }) => {
        let statusClass = "locked";
        let statusText = `Complete ${quiz.requiredChallenges.length} challenges to unlock`;
        let statusIcon = '<i class="fas fa-lock"></i>';

        if (passed) {
          statusClass = "passed";
          statusText = `✅ Passed with ${bestScore}%`;
          statusIcon = "";
        } else if (needsReview) {
          statusClass = "review";
          statusText = `📚 Review challenges to retake`;
          statusIcon = "";
        } else if (available) {
          statusClass = "available";
          statusText = `✨ Ready to take!`;
          statusIcon = "";
        }

        const clickable = available || passed;
        const cardClass = clickable ? "" : "locked";
        const onclick = clickable
          ? `onclick="navigateToQuiz('${quiz.id}')"`
          : "";

        return `
        <div class="quiz-dashboard-card ${cardClass}" ${onclick}>
          <div class="quiz-dashboard-header">
            <div class="quiz-dashboard-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="quiz-dashboard-info">
              <h3>${quiz.title}</h3>
              <span class="quiz-dashboard-category">${quiz.category}</span>
            </div>
          </div>
          <p class="quiz-dashboard-description">${quiz.description}</p>
          <div class="quiz-dashboard-meta">
            <div class="quiz-meta-item">
              <i class="fas fa-question-circle"></i>
              <span>${quiz.questions.length} Questions</span>
            </div>
            <div class="quiz-meta-item">
              <i class="fas fa-star"></i>
              <span>+${quiz.xpReward} XP</span>
            </div>
          </div>
          <div class="quiz-dashboard-status ${statusClass}">
            ${statusIcon} ${statusText}
          </div>
        </div>
      `;
      })
      .join("");
  } else {
    quizzesSection.style.display = "none";
  }
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

function updatePathProgress(path, progress) {
  // Map short names to full category names
  const categoryMap = {
    html: "html",
    css: "css",
    js: "javascript",
  };

  const category = categoryMap[path] || path;

  const challenges = getAllChallenges().filter(
    (c) => c.category.toLowerCase() === category
  );
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
    (c) => c.category.toLowerCase() === path
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
    projects: {
      title: "Final Projects",
      subtitle: "Build real-world applications",
    },
  };

  document.getElementById("path-title").textContent = titles[path].title;
  document.getElementById("path-subtitle").textContent = titles[path].subtitle;

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

  challenges.forEach((challenge, index) => {
    console.log(
      `Rendering challenge ${index + 1}/${challenges.length}:`,
      challenge.title
    );
    const state = progress.challengeStates[challenge.id] || {
      status: "not-started",
    };
    // Temporarily disable locking to avoid any rendering issues
    const isLocked = false;

    const item = document.createElement("div");
    item.className = `challenge-item ${state.status} ${
      isLocked ? "locked" : ""
    }`;
    if (!isLocked) {
      item.onclick = () => loadChallenge(challenge.id);
    }

    item.innerHTML = `
            <div class="challenge-number">${index + 1}</div>
            <div class="challenge-info">
                <h3>${challenge.title}</h3>
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
  // Exponential XP curve
  return Math.floor(100 * Math.pow(1.5, level - 1));
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
