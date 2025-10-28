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
      xp: 1250,
      unlocked: false,
    },
    {
      id: "first_html",
      name: "HTML Novice",
      description: "Complete your first HTML challenge",
      icon: "📄",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "first_css",
      name: "CSS Beginner",
      description: "Complete your first CSS challenge",
      icon: "🎨",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "first_js",
      name: "JS Starter",
      description: "Complete your first JavaScript challenge",
      icon: "⚡",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "first_react",
      name: "React Rookie",
      description: "Complete your first React challenge",
      icon: "⚛️",
      xp: 375,
      unlocked: false,
    },
    {
      id: "first_nextjs",
      name: "Next.js Novice",
      description: "Complete your first Next.js challenge",
      icon: "▲",
      xp: 375,
      unlocked: false,
    },
    {
      id: "first_mysql",
      name: "MySQL Beginner",
      description: "Complete your first MySQL challenge",
      icon: "🐬",
      xp: 375,
      unlocked: false,
    },
    {
      id: "first_postgres",
      name: "PostgreSQL Starter",
      description: "Complete your first PostgreSQL challenge",
      icon: "🐘",
      xp: 375,
      unlocked: false,
    },
    {
      id: "first_sqlite",
      name: "SQLite Learner",
      description: "Complete your first SQLite challenge",
      icon: "🗄️",
      xp: 375,
      unlocked: false,
    },

    // Completion Milestones
    {
      id: "html_5",
      name: "HTML Apprentice",
      description: "Complete 5 HTML challenges",
      icon: "📝",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "html_10",
      name: "HTML Journeyman",
      description: "Complete 10 HTML challenges",
      icon: "📘",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "html_complete",
      name: "HTML Master",
      description: "Complete all HTML challenges",
      icon: "👑",
      xp: 2500,
      unlocked: false,
    },

    {
      id: "css_5",
      name: "CSS Apprentice",
      description: "Complete 5 CSS challenges",
      icon: "🖌️",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "css_10",
      name: "CSS Journeyman",
      description: "Complete 10 CSS challenges",
      icon: "🎭",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "css_complete",
      name: "CSS Ninja",
      description: "Complete all CSS challenges",
      icon: "🥋",
      xp: 2500,
      unlocked: false,
    },

    {
      id: "js_5",
      name: "JS Apprentice",
      description: "Complete 5 JavaScript challenges",
      icon: "💻",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "js_10",
      name: "JS Journeyman",
      description: "Complete 10 JavaScript challenges",
      icon: "🔧",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "js_complete",
      name: "JavaScript Wizard",
      description: "Complete all JavaScript challenges",
      icon: "🧙",
      xp: 2500,
      unlocked: false,
    },

    {
      id: "react_5",
      name: "React Apprentice",
      description: "Complete 5 React challenges",
      icon: "⚛️",
      xp: 750,
      unlocked: false,
    },
    {
      id: "react_10",
      name: "React Developer",
      description: "Complete 10 React challenges",
      icon: "🔷",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "react_complete",
      name: "React Master",
      description: "Complete all React challenges",
      icon: "👨‍💻",
      xp: 750,
      unlocked: false,
    },

    {
      id: "nextjs_5",
      name: "Next.js Apprentice",
      description: "Complete 5 Next.js challenges",
      icon: "▲",
      xp: 750,
      unlocked: false,
    },
    {
      id: "nextjs_10",
      name: "Next.js Developer",
      description: "Complete 10 Next.js challenges",
      icon: "🔺",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "nextjs_complete",
      name: "Next.js Expert",
      description: "Complete all Next.js challenges",
      icon: "🚀",
      xp: 750,
      unlocked: false,
    },

    {
      id: "mysql_5",
      name: "MySQL Apprentice",
      description: "Complete 5 MySQL challenges",
      icon: "🐬",
      xp: 750,
      unlocked: false,
    },
    {
      id: "mysql_10",
      name: "MySQL Developer",
      description: "Complete 10 MySQL challenges",
      icon: "🗃️",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "mysql_complete",
      name: "MySQL Master",
      description: "Complete all MySQL challenges",
      icon: "🎯",
      xp: 750,
      unlocked: false,
    },

    {
      id: "postgres_5",
      name: "PostgreSQL Apprentice",
      description: "Complete 5 PostgreSQL challenges",
      icon: "🐘",
      xp: 750,
      unlocked: false,
    },
    {
      id: "postgres_10",
      name: "PostgreSQL Developer",
      description: "Complete 10 PostgreSQL challenges",
      icon: "📊",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "postgres_complete",
      name: "PostgreSQL Expert",
      description: "Complete all PostgreSQL challenges",
      icon: "💎",
      xp: 750,
      unlocked: false,
    },

    {
      id: "sqlite_5",
      name: "SQLite Apprentice",
      description: "Complete 5 SQLite challenges",
      icon: "🗄️",
      xp: 750,
      unlocked: false,
    },
    {
      id: "sqlite_10",
      name: "SQLite Developer",
      description: "Complete 10 SQLite challenges",
      icon: "📱",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "sqlite_complete",
      name: "SQLite Master",
      description: "Complete all SQLite challenges",
      icon: "🏅",
      xp: 750,
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
      xp: 1250,
      unlocked: false,
    },
    {
      id: "no_hints_10",
      name: "No Help Needed",
      description: "Complete 10 challenges without hints",
      icon: "💪",
      xp: 2500,
      unlocked: false,
    },

    // Streak Achievements
    {
      id: "streak_3",
      name: "Getting Started",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "📅",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "streak_14",
      name: "Two Weeks Strong",
      description: "Maintain a 14-day streak",
      icon: "💪",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "streak_30",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "🏆",
      xp: 4000,
      unlocked: false,
    },
    {
      id: "streak_100",
      name: "Century Club",
      description: "Maintain a 100-day streak",
      icon: "👑",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "weekend_warrior",
      name: "Weekend Warrior",
      description: "Complete challenges on 10 different weekends",
      icon: "🏋️",
      xp: 375,
      unlocked: false,
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Complete 10 challenges before 9 AM",
      icon: "🌅",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "night_owl",
      name: "Night Owl",
      description: "Complete 10 challenges after 10 PM",
      icon: "🦉",
      xp: 1250,
      unlocked: false,
    },

    // Level Achievements
    {
      id: "level_5",
      name: "Rising Star",
      description: "Reach Level 5",
      icon: "🌟",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "level_10",
      name: "Skilled Coder",
      description: "Reach Level 10",
      icon: "💫",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "level_25",
      name: "Expert Developer",
      description: "Reach Level 25",
      icon: "🎓",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "level_50",
      name: "Legendary",
      description: "Reach Level 50",
      icon: "👑",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "xp_1000",
      name: "XP Collector",
      description: "Earn 1,000 total XP",
      icon: "💰",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "xp_5000",
      name: "XP Hoarder",
      description: "Earn 5,000 total XP",
      icon: "💸",
      xp: 750,
      unlocked: false,
    },
    {
      id: "xp_10000",
      name: "XP Master",
      description: "Earn 10,000 total XP",
      icon: "💎",
      xp: 1500,
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
      xp: 2500,
      unlocked: false,
    },
    {
      id: "time_50h",
      name: "Committed",
      description: "Spend 50 hours learning",
      icon: "📚",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "time_100h",
      name: "100 Hour Club",
      description: "Spend 100 hours learning",
      icon: "🎯",
      xp: 2500,
      unlocked: false,
    },

    // Speed Achievements
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete a challenge in under 5 minutes",
      icon: "⚡",
      xp: 750,
      unlocked: false,
    },
    {
      id: "quick_learner",
      name: "Quick Learner",
      description: "Complete 10 challenges in one day",
      icon: "🚀",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "marathon_session",
      name: "Marathon Session",
      description: "Complete 20 challenges in one day",
      icon: "🏃",
      xp: 4000,
      unlocked: false,
    },
    {
      id: "first_try_hero",
      name: "First Try Hero",
      description: "Complete 5 challenges on the first attempt",
      icon: "🎯",
      xp: 375,
      unlocked: false,
    },
    {
      id: "persistent",
      name: "Persistent",
      description: "Retry a challenge 5 times before succeeding",
      icon: "💪",
      xp: 4000,
      unlocked: false,
    },

    // Exploration
    {
      id: "try_all_basic",
      name: "Explorer",
      description: "Try challenges from HTML, CSS, and JavaScript",
      icon: "🗺️",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "try_all_advanced",
      name: "Full Stack Explorer",
      description: "Try challenges from all 8 categories",
      icon: "🌐",
      xp: 2500,
      unlocked: false,
    },
    {
      id: "frontend_specialist",
      name: "Frontend Specialist",
      description: "Complete all HTML, CSS, and JavaScript challenges",
      icon: "🎨",
      xp: 1250,
      unlocked: false,
    },
    {
      id: "react_ecosystem",
      name: "React Ecosystem Master",
      description: "Complete all React and Next.js challenges",
      icon: "⚛️",
      xp: 1500,
      unlocked: false,
    },
    {
      id: "database_master",
      name: "Database Master",
      description: "Complete all MySQL, PostgreSQL, and SQLite challenges",
      icon: "�",
      xp: 1500,
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
      xp: 2500,
      unlocked: false,
    },
    {
      id: "comeback",
      name: "Comeback Kid",
      description: "Return after a broken streak",
      icon: "💪",
      xp: 1250,
      unlocked: false,
    },

    // Ultimate
    {
      id: "completionist",
      name: "The Completionist",
      description: "Complete ALL challenges",
      icon: "🏆",
      xp: 4000,
      unlocked: false,
    },
    {
      id: "perfectionist_ultimate",
      name: "Ultimate Perfectionist",
      description: "Complete all challenges without using hints",
      icon: "👑",
      xp: 5000,
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

  // XP milestone achievements
  checkXPAchievements(progress);

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
  if (stats.html.completed === stats.html.total && stats.html.total > 0) {
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
  if (stats.css.completed === stats.css.total && stats.css.total > 0) {
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
  if (stats.js.completed === stats.js.total && stats.js.total > 0) {
    unlockAchievement("js_complete", progress);
  }

  // React achievements
  if (stats.react.completed === 1) {
    unlockAchievement("first_react", progress);
  }
  if (stats.react.completed === 5) {
    unlockAchievement("react_5", progress);
  }
  if (stats.react.completed === 10) {
    unlockAchievement("react_10", progress);
  }
  if (stats.react.completed === stats.react.total && stats.react.total > 0) {
    unlockAchievement("react_complete", progress);
  }

  // Next.js achievements
  if (stats.nextjs.completed === 1) {
    unlockAchievement("first_nextjs", progress);
  }
  if (stats.nextjs.completed === 5) {
    unlockAchievement("nextjs_5", progress);
  }
  if (stats.nextjs.completed === 10) {
    unlockAchievement("nextjs_10", progress);
  }
  if (stats.nextjs.completed === stats.nextjs.total && stats.nextjs.total > 0) {
    unlockAchievement("nextjs_complete", progress);
  }

  // MySQL achievements
  if (stats.mysql.completed === 1) {
    unlockAchievement("first_mysql", progress);
  }
  if (stats.mysql.completed === 5) {
    unlockAchievement("mysql_5", progress);
  }
  if (stats.mysql.completed === 10) {
    unlockAchievement("mysql_10", progress);
  }
  if (stats.mysql.completed === stats.mysql.total && stats.mysql.total > 0) {
    unlockAchievement("mysql_complete", progress);
  }

  // PostgreSQL achievements
  if (stats.postgres.completed === 1) {
    unlockAchievement("first_postgres", progress);
  }
  if (stats.postgres.completed === 5) {
    unlockAchievement("postgres_5", progress);
  }
  if (stats.postgres.completed === 10) {
    unlockAchievement("postgres_10", progress);
  }
  if (
    stats.postgres.completed === stats.postgres.total &&
    stats.postgres.total > 0
  ) {
    unlockAchievement("postgres_complete", progress);
  }

  // SQLite achievements
  if (stats.sqlite.completed === 1) {
    unlockAchievement("first_sqlite", progress);
  }
  if (stats.sqlite.completed === 5) {
    unlockAchievement("sqlite_5", progress);
  }
  if (stats.sqlite.completed === 10) {
    unlockAchievement("sqlite_10", progress);
  }
  if (stats.sqlite.completed === stats.sqlite.total && stats.sqlite.total > 0) {
    unlockAchievement("sqlite_complete", progress);
  }

  // Cross-category achievements
  checkCrossCategoryAchievements(stats, progress);
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
    unlockAchievement("try_all_basic", progress);
  }

  // Check if tried all 8 categories
  if (
    stats.html.completed > 0 &&
    stats.css.completed > 0 &&
    stats.js.completed > 0 &&
    stats.react.completed > 0 &&
    stats.nextjs.completed > 0 &&
    stats.mysql.completed > 0 &&
    stats.postgres.completed > 0 &&
    stats.sqlite.completed > 0
  ) {
    unlockAchievement("try_all_advanced", progress);
  }
}

// Check cross-category achievements
function checkCrossCategoryAchievements(stats, progress) {
  // Frontend specialist
  if (
    stats.html.completed === stats.html.total &&
    stats.css.completed === stats.css.total &&
    stats.js.completed === stats.js.total &&
    stats.html.total > 0 &&
    stats.css.total > 0 &&
    stats.js.total > 0
  ) {
    unlockAchievement("frontend_specialist", progress);
  }

  // React ecosystem master
  if (
    stats.react.completed === stats.react.total &&
    stats.nextjs.completed === stats.nextjs.total &&
    stats.react.total > 0 &&
    stats.nextjs.total > 0
  ) {
    unlockAchievement("react_ecosystem", progress);
  }

  // Database master
  if (
    stats.mysql.completed === stats.mysql.total &&
    stats.postgres.completed === stats.postgres.total &&
    stats.sqlite.completed === stats.sqlite.total &&
    stats.mysql.total > 0 &&
    stats.postgres.total > 0 &&
    stats.sqlite.total > 0
  ) {
    unlockAchievement("database_master", progress);
  }
}

// Check XP milestone achievements
function checkXPAchievements(progress) {
  if (progress.xp >= 1000) {
    unlockAchievement("xp_1000", progress);
  }
  if (progress.xp >= 5000) {
    unlockAchievement("xp_5000", progress);
  }
  if (progress.xp >= 10000) {
    unlockAchievement("xp_10000", progress);
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
  // Check if popups are enabled
  const settings = window.getSettings
    ? window.getSettings()
    : { notifications: { achievementPopups: true } };
  if (!settings.notifications.achievementPopups) {
    return; // Don't show if disabled
  }

  const popup = document.getElementById("achievement-popup");
  document.getElementById("achievement-name").textContent = achievement.name;
  document.getElementById(
    "achievement-xp"
  ).textContent = `+${achievement.xp} XP`;

  const icon = popup.querySelector(".achievement-icon");
  icon.textContent = achievement.icon;

  popup.classList.remove("hidden");

  // Add confetti effect
  createConfetti();

  // Auto-hide after 4 seconds
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 4000);
}

// Create confetti effect for celebrations
function createConfetti() {
  const colors = [
    "#667eea",
    "#48bb78",
    "#f0db4f",
    "#e34c26",
    "#264de4",
    "#f56565",
  ];
  const confettiCount = 30;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%;
        left: 50%;
        z-index: 10000;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
        opacity: 1;
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
        --x: ${(Math.random() - 0.5) * 400}px;
        --y: ${200 + Math.random() * 300}px;
        --rotate: ${Math.random() * 360}deg;
      `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }, i * 20);
  }
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
  if (stats.html.completed < 5 && stats.html.completed > 0) {
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

  if (stats.css.completed < 5 && stats.css.completed > 0) {
    next.push({ name: "CSS Apprentice", progress: `${stats.css.completed}/5` });
  } else if (stats.css.completed < 10) {
    next.push({
      name: "CSS Journeyman",
      progress: `${stats.css.completed}/10`,
    });
  }

  if (stats.js.completed < 5 && stats.js.completed > 0) {
    next.push({ name: "JS Apprentice", progress: `${stats.js.completed}/5` });
  } else if (stats.js.completed < 10) {
    next.push({ name: "JS Journeyman", progress: `${stats.js.completed}/10` });
  }

  if (stats.react.completed < 5 && stats.react.completed > 0) {
    next.push({
      name: "React Apprentice",
      progress: `${stats.react.completed}/5`,
    });
  } else if (stats.react.completed < 10) {
    next.push({
      name: "React Developer",
      progress: `${stats.react.completed}/10`,
    });
  }

  if (stats.nextjs.completed < 5 && stats.nextjs.completed > 0) {
    next.push({
      name: "Next.js Apprentice",
      progress: `${stats.nextjs.completed}/5`,
    });
  } else if (stats.nextjs.completed < 10) {
    next.push({
      name: "Next.js Developer",
      progress: `${stats.nextjs.completed}/10`,
    });
  }

  if (stats.mysql.completed < 5 && stats.mysql.completed > 0) {
    next.push({
      name: "MySQL Apprentice",
      progress: `${stats.mysql.completed}/5`,
    });
  }

  if (stats.postgres.completed < 5 && stats.postgres.completed > 0) {
    next.push({
      name: "PostgreSQL Apprentice",
      progress: `${stats.postgres.completed}/5`,
    });
  }

  if (stats.sqlite.completed < 5 && stats.sqlite.completed > 0) {
    next.push({
      name: "SQLite Apprentice",
      progress: `${stats.sqlite.completed}/5`,
    });
  }

  // Next streak achievement
  if (progress.streak < 3) {
    next.push({
      name: "Getting Started",
      progress: `${progress.streak}/3 days`,
    });
  } else if (progress.streak < 7) {
    next.push({ name: "Week Warrior", progress: `${progress.streak}/7 days` });
  } else if (progress.streak < 14) {
    next.push({
      name: "Two Weeks Strong",
      progress: `${progress.streak}/14 days`,
    });
  }

  // Next level achievement
  if (progress.level < 5) {
    next.push({
      name: "Rising Star",
      progress: `Level ${progress.level}/5`,
    });
  } else if (progress.level < 10) {
    next.push({
      name: "Skilled Coder",
      progress: `Level ${progress.level}/10`,
    });
  }

  // Next XP achievement
  if (progress.xp < 1000) {
    next.push({
      name: "XP Collector",
      progress: `${progress.xp}/1000 XP`,
    });
  } else if (progress.xp < 5000) {
    next.push({
      name: "XP Hoarder",
      progress: `${progress.xp}/5000 XP`,
    });
  }

  return next.slice(0, 5); // Return top 5
}

// Re-check all achievements for existing progress (migration helper)
function recheckAllAchievements() {
  const progress = getProgress();

  console.log("Rechecking all achievements for existing progress...");

  // Check all achievement types
  checkMultipleAchievements(progress);
  checkStreakAchievements(progress);
  checkPerfectAchievements(progress);
  checkExplorerAchievement(progress);

  // Save updated progress
  saveProgress(progress);

  console.log("Achievement recheck complete!");

  // Reload achievements display if on that page
  if (typeof loadAchievements === "function") {
    loadAchievements();
  }

  return progress;
}

// ===== DAILY CHALLENGES & STREAKS =====

// Check if user completed daily challenge
function checkDailyChallenge(progress) {
  const today = new Date().toDateString();
  const lastDaily = progress.lastDailyChallenge || "";

  if (lastDaily !== today && progress.challengesCompletedToday >= 1) {
    progress.lastDailyChallenge = today;
    progress.dailyChallengesCompleted =
      (progress.dailyChallengesCompleted || 0) + 1;
    progress.xp += 25; // Small daily bonus XP

    // Update streak
    updateStreak(progress);

    return true;
  }
  return false;
}

// Update login/completion streak
function updateStreak(progress) {
  const today = new Date().toDateString();
  const lastLogin = progress.lastLoginDate || "";
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastLogin === yesterday) {
    // Consecutive day - increment streak
    progress.currentStreak = (progress.currentStreak || 0) + 1;
  } else if (lastLogin !== today) {
    // Streak broken - reset to 1
    progress.currentStreak = 1;
  }

  progress.lastLoginDate = today;
  progress.longestStreak = Math.max(
    progress.longestStreak || 0,
    progress.currentStreak
  );

  // Award streak bonuses
  checkStreakBonuses(progress);
}

// Award XP bonuses for streaks
function checkStreakBonuses(progress) {
  const streak = progress.currentStreak || 0;

  // Weekly streak bonus (7 days)
  if (streak === 7 && !progress.weeklyStreakAwarded) {
    progress.xp += 100;
    progress.weeklyStreakAwarded = true;
    showNotification("7-Day Streak! +100 XP bonus!", "🔥");
  } else if (streak !== 7) {
    progress.weeklyStreakAwarded = false;
  }

  // Monthly streak bonus (30 days)
  if (streak === 30 && !progress.monthlyStreakAwarded) {
    progress.xp += 500;
    progress.monthlyStreakAwarded = true;
    showNotification("30-Day Streak! +500 XP bonus!", "🌟");
  } else if (streak !== 30) {
    progress.monthlyStreakAwarded = false;
  }

  // Epic streak bonus (100 days)
  if (streak === 100 && !progress.epicStreakAwarded) {
    progress.xp += 2000;
    progress.epicStreakAwarded = true;
    showNotification("100-Day Streak! +2000 XP bonus!", "👑");
  } else if (streak !== 100) {
    progress.epicStreakAwarded = false;
  }
}

// Award course completion bonuses
function awardCourseBonus(progress, category) {
  const bonuses = {
    HTML: 5000,
    CSS: 5000,
    JavaScript: 8000,
    React: 10000,
    "Next.js": 10000,
    MySQL: 7000,
    PostgreSQL: 7000,
    SQLite: 7000,
  };

  const bonus = bonuses[category] || 3000;
  const bonusKey = `${category.toLowerCase()}_course_bonus`;

  if (!progress[bonusKey]) {
    progress.xp += bonus;
    progress[bonusKey] = true;
    showNotification(`${category} Course Complete! +${bonus} XP bonus!`, "🎓");
  }
}

// Show notification helper
function showNotification(message, icon = "✨") {
  if (typeof showAchievementNotification === "function") {
    showAchievementNotification({ name: message, icon });
  }
}
