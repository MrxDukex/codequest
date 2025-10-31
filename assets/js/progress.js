// ===== PROGRESS MANAGEMENT =====

// Default progress structure
function getDefaultProgress() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalTime: 0, // in minutes
    completedChallenges: [],
    challengeStates: {}, // { challengeId: { status, currentCode, hintsUsed, attempts, timeSpent } }
    achievements: initializeAchievements(),
    dailyQuestCompleted: false,
    lastQuestDate: null,
    stats: {
      totalAttempts: 0,
      hintsUsed: 0,
      perfectCompletions: 0,
      studyMoreTopics: [],
    },
    settings: {
      dailyQuestCount: 1,
      codeButtonsEnabled: true,
    },
    quizResults: {}, // { quizId: { attempts: [], passed: bool, bestScore: num, needsRemedial: bool } }
  };
}

// Get current progress from localStorage
function getProgress() {
  const saved = localStorage.getItem("codequest_progress");
  if (saved) {
    try {
      const progress = JSON.parse(saved);

      // Merge achievements - add any new achievements that don't exist
      const currentAchievements = initializeAchievements();
      const savedAchievementIds = new Set(
        progress.achievements.map((a) => a.id)
      );

      // Add new achievements that don't exist in saved progress
      currentAchievements.forEach((newAchievement) => {
        if (!savedAchievementIds.has(newAchievement.id)) {
          progress.achievements.push(newAchievement);
        }
      });

      // Merge with defaults in case of new fields
      const mergedProgress = { ...getDefaultProgress(), ...progress };

      // Save the updated progress to persist new achievements
      saveProgress(mergedProgress);

      return mergedProgress;
    } catch (e) {
      console.error("Error parsing progress:", e);
      return getDefaultProgress();
    }
  }
  return getDefaultProgress();
}

// Save progress to localStorage
function saveProgress(progress) {
  try {
    localStorage.setItem("codequest_progress", JSON.stringify(progress));

    // Also save to file for cross-device sync
    const lastSave = {
      timestamp: Date.now(),
      device: "computer", // or detect from user agent
      xp: progress.xp,
      level: progress.level,
    };
    localStorage.setItem("codequest_last_save", JSON.stringify(lastSave));

    return true;
  } catch (e) {
    console.error("Error saving progress:", e);
    showToast("Error saving progress!", "error");
    return false;
  }
}

// Add XP and check for level up
function addXP(amount, reason = "") {
  const progress = getProgress();
  const oldLevel = progress.level;
  progress.xp += amount;

  // Check for level up
  while (progress.xp >= calculateXPForLevel(progress.level + 1)) {
    progress.level++;
  }

  saveProgress(progress);
  updateLevelDisplay(progress);

  // Show level up animation if leveled up
  if (progress.level > oldLevel) {
    showLevelUp(progress.level);
  }

  // Show XP gain
  if (reason) {
    showToast(`+${amount} XP - ${reason}`, "success");
  }

  return progress.level > oldLevel;
}

// Mark challenge as completed
function markChallengeComplete(
  challengeId,
  hintsUsed = 0,
  timeSpent = 0,
  usedSolution = false
) {
  const progress = getProgress();
  const challenge = getAllChallenges().find((c) => c.id === challengeId);

  if (!challenge) return;

  // Don't allow duplicate completions
  if (progress.completedChallenges.includes(challengeId)) {
    showToast("Challenge already completed!", "info");
    return;
  }

  // Calculate XP
  let xpGained = challenge.xp;

  // Penalties
  if (usedSolution) {
    xpGained = Math.floor(xpGained * 0.3); // 70% penalty
    if (!progress.stats.studyMoreTopics.includes(challenge.id)) {
      progress.stats.studyMoreTopics.push(challenge.id);
    }
  } else if (hintsUsed > 0) {
    xpGained = Math.floor(xpGained * (1 - hintsUsed * 0.1)); // 10% per hint
  }

  // Bonus for perfect completion
  if (hintsUsed === 0 && !usedSolution) {
    xpGained = Math.floor(xpGained * 1.2); // 20% bonus
    progress.stats.perfectCompletions++;
    checkAchievement("perfect_completion", progress);
  }

  // Update progress
  progress.completedChallenges.push(challengeId);
  progress.challengeStates[challengeId] = {
    status: "completed",
    completedAt: Date.now(),
    hintsUsed: hintsUsed,
    timeSpent: timeSpent,
    usedSolution: usedSolution,
  };

  progress.totalTime += timeSpent;
  progress.stats.totalAttempts++;
  progress.stats.hintsUsed += hintsUsed;

  // Update streak
  updateStreak(progress);

  // Check for daily quest completion
  if (!progress.dailyQuestCompleted) {
    progress.dailyQuestCompleted = true;
    xpGained += 50; // Bonus XP for daily quest
    showToast("Daily Quest Complete! +50 Bonus XP", "success");
  }

  // Save before adding XP (to ensure level up uses latest data)
  saveProgress(progress);

  // Add XP
  addXP(xpGained, `${challenge.title} completed`);

  // Check achievements
  checkMultipleAchievements(progress);

  // Export to Obsidian
  exportChallengeToObsidian(challenge, progress.challengeStates[challengeId]);

  // Show completion modal
  showChallengeComplete(challenge, xpGained, hintsUsed);

  // Check if quiz is now available
  if (typeof checkAndShowQuizNotification === "function") {
    setTimeout(checkAndShowQuizNotification, 2000);
  }
}

// Update daily streak
function updateStreak(progress) {
  const today = new Date().toDateString();
  const lastActive = progress.lastActiveDate
    ? new Date(progress.lastActiveDate).toDateString()
    : null;

  if (lastActive === today) {
    // Already updated today
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (lastActive === yesterdayStr) {
    // Continuing streak
    progress.streak++;
  } else if (lastActive !== today) {
    // Streak broken
    progress.streak = 1;
  }

  // Update longest streak
  if (progress.streak > progress.longestStreak) {
    progress.longestStreak = progress.streak;
  }

  progress.lastActiveDate = new Date().toISOString();

  // Check streak achievements
  checkAchievement("streak", progress);
}

// Get completion statistics
function getCompletionStats() {
  const progress = getProgress();
  const allChallenges = getAllChallenges();

  const htmlChallenges = allChallenges.filter((c) => c.category === "HTML");
  const cssChallenges = allChallenges.filter((c) => c.category === "CSS");
  const jsChallenges = allChallenges.filter((c) => c.category === "JavaScript");
  const reactChallenges = allChallenges.filter((c) => c.category === "React");
  const nextjsChallenges = allChallenges.filter(
    (c) => c.category === "Next.js"
  );
  const mysqlChallenges = allChallenges.filter((c) => c.category === "MySQL");
  const postgresChallenges = allChallenges.filter(
    (c) => c.category === "PostgreSQL"
  );
  const sqliteChallenges = allChallenges.filter((c) => c.category === "SQLite");

  const htmlCompleted = htmlChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const cssCompleted = cssChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const jsCompleted = jsChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const reactCompleted = reactChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const nextjsCompleted = nextjsChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const mysqlCompleted = mysqlChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const postgresCompleted = postgresChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;
  const sqliteCompleted = sqliteChallenges.filter((c) =>
    progress.completedChallenges.includes(c.id)
  ).length;

  return {
    total: allChallenges.length,
    completed: progress.completedChallenges.length,
    html: { total: htmlChallenges.length, completed: htmlCompleted },
    css: { total: cssChallenges.length, completed: cssCompleted },
    js: { total: jsChallenges.length, completed: jsCompleted },
    react: { total: reactChallenges.length, completed: reactCompleted },
    nextjs: { total: nextjsChallenges.length, completed: nextjsCompleted },
    mysql: { total: mysqlChallenges.length, completed: mysqlCompleted },
    postgres: {
      total: postgresChallenges.length,
      completed: postgresCompleted,
    },
    sqlite: { total: sqliteChallenges.length, completed: sqliteCompleted },
    percentage: Math.round(
      (progress.completedChallenges.length / allChallenges.length) * 100
    ),
  };
}

// Load profile view
function loadProfile() {
  const progress = getProgress();
  const stats = getCompletionStats();

  // Update profile header
  const level = progress.level;
  const currentXP = progress.xp; // Total XP accumulated
  const nextLevelXP = calculateXPForLevel(level + 1); // Total XP needed to reach next level
  
  // Calculate percentage: how much of the way to next level
  const percentage = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

  document.getElementById("profile-level").textContent = level;
  document.getElementById("profile-xp-text").textContent = `${currentXP} / ${nextLevelXP} XP`;
  document.getElementById("profile-xp-fill").style.width = `${percentage}%`;

  // Update stats cards
  document.getElementById("total-challenges").textContent = stats.completed;
  document.getElementById("total-time").textContent = formatTime(
    progress.totalTime
  );
  document.getElementById("current-streak").textContent = progress.streak;

  const accuracy =
    progress.stats.totalAttempts > 0
      ? Math.round((stats.completed / progress.stats.totalAttempts) * 100)
      : 0;
  document.getElementById("accuracy-stat").textContent = `${accuracy}%`;

  // Update detailed stats
  document.getElementById("total-xp").textContent = progress.xp;
  document.getElementById("attempted-challenges").textContent =
    progress.stats.totalAttempts;

  const avgTime =
    stats.completed > 0 ? Math.round(progress.totalTime / stats.completed) : 0;
  document.getElementById("avg-time").textContent = `${avgTime}m`;
  document.getElementById("total-hints").textContent = progress.stats.hintsUsed;
  document.getElementById("perfect-completions").textContent =
    progress.stats.perfectCompletions;
  document.getElementById(
    "longest-streak"
  ).textContent = `${progress.longestStreak} days`;

  // Update category progress
  const htmlPercent = (stats.html.completed / stats.html.total) * 100;
  const cssPercent = (stats.css.completed / stats.css.total) * 100;
  const jsPercent = (stats.js.completed / stats.js.total) * 100;

  document.getElementById(
    "html-progress-text"
  ).textContent = `${stats.html.completed}/${stats.html.total}`;
  document.getElementById(
    "profile-html-progress"
  ).style.width = `${htmlPercent}%`;

  document.getElementById(
    "css-progress-text"
  ).textContent = `${stats.css.completed}/${stats.css.total}`;
  document.getElementById(
    "profile-css-progress"
  ).style.width = `${cssPercent}%`;

  document.getElementById(
    "js-progress-text"
  ).textContent = `${stats.js.completed}/${stats.js.total}`;
  document.getElementById("profile-js-progress").style.width = `${jsPercent}%`;
}

// Check if quest count should be increased
function checkQuestIncrease() {
  const progress = getProgress();
  const accountAge = progress.lastActiveDate
    ? Math.floor(
        (Date.now() - new Date(progress.lastActiveDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // After 7 days, ask if they want more quests
  if (accountAge >= 7 && progress.settings.dailyQuestCount === 1) {
    if (
      confirm(
        "You've been learning for a week! Would you like to increase daily quests from 1 to 3?"
      )
    ) {
      progress.settings.dailyQuestCount = 3;
      saveProgress(progress);
      showToast("Daily quests increased to 3!", "success");
    }
  }
}

// Save progress to file for syncing
function saveSyncFile() {
  const progress = getProgress();
  const syncData = {
    ...progress,
    lastSync: Date.now(),
    version: "1.0.0",
  };

  const dataStr = JSON.stringify(syncData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "progress.json";
  link.click();

  showToast("Progress saved for syncing!", "success");
}

// Load sync file
function loadSyncFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // Check if it's a valid progress file
      if (data.xp !== undefined && data.level !== undefined) {
        const current = getProgress();

        // Ask user which to keep if there's a conflict
        if (data.lastSync > (current.lastSync || 0)) {
          if (
            confirm("Imported progress is newer. Replace current progress?")
          ) {
            localStorage.setItem("codequest_progress", JSON.stringify(data));
            location.reload();
          }
        } else {
          showToast("Current progress is more recent.", "info");
        }
      } else {
        showToast("Invalid progress file!", "error");
      }
    } catch (err) {
      showToast("Error loading progress file!", "error");
    }
  };
  reader.readAsText(file);
}

// Show level up animation
function showLevelUp(newLevel) {
  showToast(`🎉 Level Up! You're now Level ${newLevel}!`, "success");

  // Could add more elaborate animation here
  const levelDisplay = document.getElementById("level-circle");
  if (levelDisplay) {
    levelDisplay.style.animation = "none";
    setTimeout(() => {
      levelDisplay.style.animation = "pulse 0.5s ease";
    }, 10);
  }
}

// Show challenge complete modal
function showChallengeComplete(challenge, xpGained, hintsUsed) {
  const message =
    hintsUsed === 0
      ? `🎉 Perfect! +${xpGained} XP (with bonus!)`
      : `✅ Complete! +${xpGained} XP`;

  showToast(message, "success");

  // Enable next button
  const nextBtn = document.getElementById("next-challenge-btn");
  if (nextBtn) nextBtn.disabled = false;
}
