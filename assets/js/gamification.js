// ===== GAMIFICATION & ACHIEVEMENTS =====

// Initialize all achievements
function initializeAchievements() {
  return [
    // First Steps
    {
      id: "first_challenge",
      name: "First Step",
      description: "Complete your first challenge",
      icon: "🎯",
      xp: 10,
      unlocked: false,
    },
    {
      id: "first_html",
      name: "HTML Novice",
      description: "Complete your first HTML challenge",
      icon: "📄",
      xp: 10,
      unlocked: false,
    },
    {
      id: "first_css",
      name: "CSS Beginner",
      description: "Complete your first CSS challenge",
      icon: "🎨",
      xp: 10,
      unlocked: false,
    },
    {
      id: "first_js",
      name: "JS Starter",
      description: "Complete your first JavaScript challenge",
      icon: "⚡",
      xp: 10,
      unlocked: false,
    },

    // Completion Milestones
    {
      id: "html_5",
      name: "HTML Apprentice",
      description: "Complete 5 HTML challenges",
      icon: "📝",
      xp: 25,
      unlocked: false,
    },
    {
      id: "html_10",
      name: "HTML Journeyman",
      description: "Complete 10 HTML challenges",
      icon: "📘",
      xp: 50,
      unlocked: false,
    },
    {
      id: "html_complete",
      name: "HTML Master",
      description: "Complete all HTML challenges",
      icon: "👑",
      xp: 100,
      unlocked: false,
    },

    {
      id: "css_5",
      name: "CSS Apprentice",
      description: "Complete 5 CSS challenges",
      icon: "🖌️",
      xp: 25,
      unlocked: false,
    },
    {
      id: "css_10",
      name: "CSS Journeyman",
      description: "Complete 10 CSS challenges",
      icon: "🎭",
      xp: 50,
      unlocked: false,
    },
    {
      id: "css_complete",
      name: "CSS Ninja",
      description: "Complete all CSS challenges",
      icon: "🥋",
      xp: 100,
      unlocked: false,
    },

    {
      id: "js_5",
      name: "JS Apprentice",
      description: "Complete 5 JavaScript challenges",
      icon: "💻",
      xp: 25,
      unlocked: false,
    },
    {
      id: "js_10",
      name: "JS Journeyman",
      description: "Complete 10 JavaScript challenges",
      icon: "🔧",
      xp: 50,
      unlocked: false,
    },
    {
      id: "js_complete",
      name: "JavaScript Wizard",
      description: "Complete all JavaScript challenges",
      icon: "🧙",
      xp: 100,
      unlocked: false,
    },

    // Special Achievements
    {
      id: "perfect_completion",
      name: "Perfectionist",
      description: "Complete a challenge without hints",
      icon: "⭐",
      xp: 20,
      unlocked: false,
    },
    {
      id: "perfect_5",
      name: "Flawless",
      description: "Complete 5 challenges without hints",
      icon: "✨",
      xp: 50,
      unlocked: false,
    },
    {
      id: "no_hints_10",
      name: "No Help Needed",
      description: "Complete 10 challenges without hints",
      icon: "💪",
      xp: 100,
      unlocked: false,
    },

    // Streak Achievements
    {
      id: "streak_3",
      name: "Getting Started",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      xp: 25,
      unlocked: false,
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "📅",
      xp: 50,
      unlocked: false,
    },
    {
      id: "streak_14",
      name: "Two Weeks Strong",
      description: "Maintain a 14-day streak",
      icon: "💪",
      xp: 100,
      unlocked: false,
    },
    {
      id: "streak_30",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "🏆",
      xp: 200,
      unlocked: false,
    },
    {
      id: "streak_100",
      name: "Century Club",
      description: "Maintain a 100-day streak",
      icon: "👑",
      xp: 500,
      unlocked: false,
    },

    // Level Achievements
    {
      id: "level_5",
      name: "Rising Star",
      description: "Reach Level 5",
      icon: "🌟",
      xp: 50,
      unlocked: false,
    },
    {
      id: "level_10",
      name: "Skilled Coder",
      description: "Reach Level 10",
      icon: "💫",
      xp: 100,
      unlocked: false,
    },
    {
      id: "level_25",
      name: "Expert Developer",
      description: "Reach Level 25",
      icon: "🎓",
      xp: 250,
      unlocked: false,
    },
    {
      id: "level_50",
      name: "Legendary",
      description: "Reach Level 50",
      icon: "👑",
      xp: 500,
      unlocked: false,
    },

    // Time Achievements
    {
      id: "time_1h",
      name: "First Hour",
      description: "Spend 1 hour learning",
      icon: "⏰",
      xp: 20,
      unlocked: false,
    },
    {
      id: "time_10h",
      name: "Dedicated",
      description: "Spend 10 hours learning",
      icon: "⏱️",
      xp: 100,
      unlocked: false,
    },
    {
      id: "time_50h",
      name: "Committed",
      description: "Spend 50 hours learning",
      icon: "📚",
      xp: 250,
      unlocked: false,
    },
    {
      id: "time_100h",
      name: "100 Hour Club",
      description: "Spend 100 hours learning",
      icon: "🎯",
      xp: 500,
      unlocked: false,
    },

    // Speed Achievements
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete a challenge in under 5 minutes",
      icon: "⚡",
      xp: 30,
      unlocked: false,
    },
    {
      id: "quick_learner",
      name: "Quick Learner",
      description: "Complete 10 challenges in one day",
      icon: "🚀",
      xp: 100,
      unlocked: false,
    },

    // Exploration
    {
      id: "try_all",
      name: "Explorer",
      description: "Try challenges from all three categories",
      icon: "🗺️",
      xp: 50,
      unlocked: false,
    },
    {
      id: "playground_user",
      name: "Experimenter",
      description: "Use the playground",
      icon: "🧪",
      xp: 20,
      unlocked: false,
    },

    // Social/Meta
    {
      id: "obsidian_sync",
      name: "Note Taker",
      description: "Export progress to Obsidian",
      icon: "📓",
      xp: 25,
      unlocked: false,
    },
    {
      id: "comeback",
      name: "Comeback Kid",
      description: "Return after a broken streak",
      icon: "💪",
      xp: 50,
      unlocked: false,
    },

    // Ultimate
    {
      id: "completionist",
      name: "The Completionist",
      description: "Complete ALL challenges",
      icon: "🏆",
      xp: 1000,
      unlocked: false,
    },
    {
      id: "perfectionist_ultimate",
      name: "Ultimate Perfectionist",
      description: "Complete all challenges without using hints",
      icon: "👑",
      xp: 2000,
      unlocked: false,
    },
  ];
}

// Check multiple achievements after challenge completion
function checkMultipleAchievements(progress) {
  // Category-specific achievements
  checkCategoryAchievements(progress);

  // Level achievements
  checkLevelAchievements(progress);

  // Time achievements
  checkTimeAchievements(progress);

  // Completion achievements
  checkCompletionAchievements(progress);

  // Explorer achievement
  checkExplorerAchievement(progress);
}

// Check specific achievement
function checkAchievement(type, progress) {
  switch (type) {
    case "perfect_completion":
      checkPerfectAchievements(progress);
      break;
    case "streak":
      checkStreakAchievements(progress);
      break;
    case "playground":
      unlockAchievement("playground_user", progress);
      break;
    case "obsidian":
      unlockAchievement("obsidian_sync", progress);
      break;
  }
}

// Check category-specific achievements
function checkCategoryAchievements(progress) {
  const stats = getCompletionStats();

  // HTML achievements
  if (stats.html.completed === 1) {
    unlockAchievement("first_html", progress);
  }
  if (stats.html.completed === 5) {
    unlockAchievement("html_5", progress);
  }
  if (stats.html.completed === 10) {
    unlockAchievement("html_10", progress);
  }
  if (stats.html.completed === stats.html.total) {
    unlockAchievement("html_complete", progress);
  }

  // CSS achievements
  if (stats.css.completed === 1) {
    unlockAchievement("first_css", progress);
  }
  if (stats.css.completed === 5) {
    unlockAchievement("css_5", progress);
  }
  if (stats.css.completed === 10) {
    unlockAchievement("css_10", progress);
  }
  if (stats.css.completed === stats.css.total) {
    unlockAchievement("css_complete", progress);
  }

  // JavaScript achievements
  if (stats.js.completed === 1) {
    unlockAchievement("first_js", progress);
  }
  if (stats.js.completed === 5) {
    unlockAchievement("js_5", progress);
  }
  if (stats.js.completed === 10) {
    unlockAchievement("js_10", progress);
  }
  if (stats.js.completed === stats.js.total) {
    unlockAchievement("js_complete", progress);
  }
}

// Check perfect completion achievements
function checkPerfectAchievements(progress) {
  if (progress.stats.perfectCompletions === 1) {
    unlockAchievement("perfect_completion", progress);
  }
  if (progress.stats.perfectCompletions === 5) {
    unlockAchievement("perfect_5", progress);
  }
  if (progress.stats.perfectCompletions === 10) {
    unlockAchievement("no_hints_10", progress);
  }
}

// Check streak achievements
function checkStreakAchievements(progress) {
  if (progress.streak >= 3) {
    unlockAchievement("streak_3", progress);
  }
  if (progress.streak >= 7) {
    unlockAchievement("streak_7", progress);
  }
  if (progress.streak >= 14) {
    unlockAchievement("streak_14", progress);
  }
  if (progress.streak >= 30) {
    unlockAchievement("streak_30", progress);
  }
  if (progress.streak >= 100) {
    unlockAchievement("streak_100", progress);
  }
}

// Check level achievements
function checkLevelAchievements(progress) {
  if (progress.level >= 5) {
    unlockAchievement("level_5", progress);
  }
  if (progress.level >= 10) {
    unlockAchievement("level_10", progress);
  }
  if (progress.level >= 25) {
    unlockAchievement("level_25", progress);
  }
  if (progress.level >= 50) {
    unlockAchievement("level_50", progress);
  }
}

// Check time achievements
function checkTimeAchievements(progress) {
  const hours = progress.totalTime / 60;

  if (hours >= 1) {
    unlockAchievement("time_1h", progress);
  }
  if (hours >= 10) {
    unlockAchievement("time_10h", progress);
  }
  if (hours >= 50) {
    unlockAchievement("time_50h", progress);
  }
  if (hours >= 100) {
    unlockAchievement("time_100h", progress);
  }
}

// Check completion achievements
function checkCompletionAchievements(progress) {
  const stats = getCompletionStats();

  if (stats.completed === 1) {
    unlockAchievement("first_challenge", progress);
  }

  if (stats.completed === stats.total) {
    unlockAchievement("completionist", progress);

    // Check if all were perfect
    if (progress.stats.perfectCompletions === stats.total) {
      unlockAchievement("perfectionist_ultimate", progress);
    }
  }
}

// Check explorer achievement
function checkExplorerAchievement(progress) {
  const stats = getCompletionStats();
  if (
    stats.html.completed > 0 &&
    stats.css.completed > 0 &&
    stats.js.completed > 0
  ) {
    unlockAchievement("try_all", progress);
  }
}

// Unlock an achievement
function unlockAchievement(achievementId, progress) {
  const achievement = progress.achievements.find((a) => a.id === achievementId);

  if (!achievement || achievement.unlocked) {
    return; // Already unlocked or doesn't exist
  }

  achievement.unlocked = true;
  achievement.unlockedAt = Date.now();

  saveProgress(progress);

  // Show achievement popup
  showAchievementPopup(achievement);

  // Add bonus XP
  addXP(achievement.xp, `Achievement: ${achievement.name}`);
}

// Show achievement unlock popup
function showAchievementPopup(achievement) {
  const popup = document.getElementById("achievement-popup");
  document.getElementById("achievement-name").textContent = achievement.name;
  document.getElementById(
    "achievement-xp"
  ).textContent = `+${achievement.xp} XP`;

  const icon = popup.querySelector(".achievement-icon");
  icon.textContent = achievement.icon;

  popup.classList.remove("hidden");

  // Auto-hide after 4 seconds
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 4000);
}

// Load achievements view
function loadAchievements() {
  const progress = getProgress();
  const grid = document.getElementById("achievements-grid");

  const unlocked = progress.achievements.filter((a) => a.unlocked).length;
  const total = progress.achievements.length;

  document.getElementById(
    "achievements-subtitle"
  ).textContent = `${unlocked} of ${total} unlocked`;

  grid.innerHTML = "";

  // Sort: unlocked first, then by XP
  const sorted = [...progress.achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return b.xp - a.xp;
  });

  sorted.forEach((achievement) => {
    const card = document.createElement("div");
    card.className = `achievement-card ${
      achievement.unlocked ? "unlocked" : "locked"
    }`;

    card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h3>${achievement.name}</h3>
            <p>${achievement.description}</p>
            <span class="achievement-xp">+${achievement.xp} XP</span>
            ${
              achievement.unlocked
                ? `<small style="color: var(--color-success); margin-top: 0.5rem; display: block;">
                    Unlocked ${new Date(
                      achievement.unlockedAt
                    ).toLocaleDateString()}
                </small>`
                : ""
            }
        `;

    grid.appendChild(card);
  });
}

// Calculate achievement progress percentage
function getAchievementProgress() {
  const progress = getProgress();
  const unlocked = progress.achievements.filter((a) => a.unlocked).length;
  const total = progress.achievements.length;
  return Math.round((unlocked / total) * 100);
}

// Get next achievable achievements
function getNextAchievements(progress) {
  const stats = getCompletionStats();
  const next = [];

  // Next category achievements
  if (stats.html.completed < 5) {
    next.push({
      name: "HTML Apprentice",
      progress: `${stats.html.completed}/5`,
    });
  } else if (stats.html.completed < 10) {
    next.push({
      name: "HTML Journeyman",
      progress: `${stats.html.completed}/10`,
    });
  }

  if (stats.css.completed < 5) {
    next.push({ name: "CSS Apprentice", progress: `${stats.css.completed}/5` });
  }

  if (stats.js.completed < 5) {
    next.push({ name: "JS Apprentice", progress: `${stats.js.completed}/5` });
  }

  // Next streak achievement
  if (progress.streak < 3) {
    next.push({
      name: "Getting Started",
      progress: `${progress.streak}/3 days`,
    });
  } else if (progress.streak < 7) {
    next.push({ name: "Week Warrior", progress: `${progress.streak}/7 days` });
  }

  return next.slice(0, 3); // Return top 3
}
