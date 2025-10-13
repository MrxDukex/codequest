// ===== OBSIDIAN INTEGRATION =====

const OBSIDIAN_VAULT_PATH = "C:\\Users\\stivi\\Documents\\Notes\\Notes";
const CODEQUEST_FOLDER = "CodeQuest";

// Export challenge to Obsidian
function exportChallengeToObsidian(challenge, challengeState) {
  const markdown = generateChallengeNote(challenge, challengeState);

  // Since we can't directly write to file system from browser,
  // we'll download the file and user can move it to Obsidian
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const fileName = `${challenge.id}-${challenge.title.replace(/\s+/g, "-")}.md`;
  link.download = fileName;

  // Auto-download is disabled by default, but we save it for manual export
  // link.click();

  // Store in localStorage for batch export
  storeNoteForExport(fileName, markdown);
}

// Generate markdown note for a challenge
function generateChallengeNote(challenge, challengeState) {
  const date = new Date().toISOString().split("T")[0];
  const timeSpent = challengeState.timeSpent || 0;
  const hintsUsed = challengeState.hintsUsed || 0;
  const isPerfect = hintsUsed === 0 && !challengeState.usedSolution;

  return `---
title: ${challenge.title}
category: ${challenge.category}
difficulty: ${challenge.difficulty}
xp: ${challenge.xp}
completed: ${date}
timeSpent: ${timeSpent} minutes
hintsUsed: ${hintsUsed}
perfect: ${isPerfect}
tags: [codequest, ${challenge.category.toLowerCase()}, ${challenge.difficulty}]
---

# ${challenge.title}

**Category:** ${challenge.category}  
**Difficulty:** ${challenge.difficulty}  
**XP Earned:** ${challenge.xp}${
    hintsUsed > 0 ? ` (reduced by ${hintsUsed * 10}%)` : ""
  }  
**Completed:** ${new Date().toLocaleString()}  
**Time Spent:** ${timeSpent} minutes

${isPerfect ? "⭐ **Perfect Completion** - No hints used!\n" : ""}
${
  challengeState.usedSolution
    ? "⚠️ **Solution Used** - Review this topic!\n"
    : ""
}

## Challenge Description

${challenge.description}

## My Solution

\`\`\`${
    challenge.category === "JavaScript"
      ? "javascript"
      : challenge.category === "CSS"
      ? "css"
      : "html"
  }
${challengeState.currentCode || "No code saved"}
\`\`\`

## Key Concepts Learned

${
  challenge.concepts
    ? challenge.concepts.map((c) => `- ${c}`).join("\n")
    : "- [Add your notes here]"
}

## Notes & Reflections

[Add your personal notes, challenges faced, and learnings here]

---

**Related Challenges:** 
- [[Previous Challenge]]
- [[Next Challenge]]

**Resources:**
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3Schools](https://www.w3schools.com/)
`;
}

// Store note for batch export
function storeNoteForExport(fileName, content) {
  let pendingExports = localStorage.getItem("codequest_pending_exports");
  pendingExports = pendingExports ? JSON.parse(pendingExports) : {};

  pendingExports[fileName] = content;
  localStorage.setItem(
    "codequest_pending_exports",
    JSON.stringify(pendingExports)
  );
}

// Sync all pending notes to Obsidian
function syncToObsidian() {
  const pendingExports = localStorage.getItem("codequest_pending_exports");

  if (!pendingExports || pendingExports === "{}") {
    showToast("No new notes to export", "info");
    return;
  }

  const notes = JSON.parse(pendingExports);
  const noteCount = Object.keys(notes).length;

  if (
    confirm(
      `Export ${noteCount} note${noteCount > 1 ? "s" : ""} to Obsidian vault?`
    )
  ) {
    // Create a zip file with all notes
    exportNotesAsZip(notes);

    // Clear pending exports
    localStorage.removeItem("codequest_pending_exports");

    // Mark achievement
    const progress = getProgress();
    checkAchievement("obsidian", progress);

    showToast(
      `${noteCount} notes exported! Extract to ${OBSIDIAN_VAULT_PATH}\\${CODEQUEST_FOLDER}`,
      "success"
    );
  }
}

// Export notes as a downloadable ZIP (simplified version)
function exportNotesAsZip(notes) {
  // For simplicity, we'll create individual downloads
  // In production, you'd use JSZip library

  Object.entries(notes).forEach(([fileName, content], index) => {
    setTimeout(() => {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }, index * 200); // Stagger downloads
  });
}

// Generate daily log
function generateDailyLog() {
  const progress = getProgress();
  const today = new Date().toISOString().split("T")[0];

  // Get today's completed challenges
  const todaysChallenges = progress.completedChallenges
    .filter((id) => {
      const state = progress.challengeStates[id];
      if (!state || !state.completedAt) return false;
      const completedDate = new Date(state.completedAt)
        .toISOString()
        .split("T")[0];
      return completedDate === today;
    })
    .map((id) => {
      const challenge = getAllChallenges().find((c) => c.id === id);
      return { challenge, state: progress.challengeStates[id] };
    });

  if (todaysChallenges.length === 0) {
    showToast("No challenges completed today", "info");
    return;
  }

  const totalXP = todaysChallenges.reduce(
    (sum, { challenge }) => sum + challenge.xp,
    0
  );
  const totalTime = todaysChallenges.reduce(
    (sum, { state }) => sum + (state.timeSpent || 0),
    0
  );

  const markdown = `---
date: ${today}
type: daily-log
tags: [codequest, daily-log]
---

# CodeQuest Daily Log - ${new Date().toLocaleDateString()}

## Summary

- **Challenges Completed:** ${todaysChallenges.length}
- **XP Earned:** ${totalXP}
- **Time Spent:** ${totalTime} minutes
- **Current Streak:** ${progress.streak} days 🔥
- **Level:** ${progress.level}

## Challenges Completed Today

${todaysChallenges
  .map(
    ({ challenge, state }) => `
### ${challenge.title}
- **Category:** ${challenge.category}
- **XP:** ${challenge.xp}
- **Time:** ${state.timeSpent} minutes
- [[${challenge.id}-${challenge.title.replace(/\s+/g, "-")}|View Full Notes]]
`
  )
  .join("\n")}

## Daily Quest
${progress.dailyQuestCompleted ? "✅ Completed" : "⏳ In Progress"}

## Reflections

[What did you learn today? What was challenging? What are you proud of?]

## Tomorrow's Goals

- [ ] Complete [X] challenges
- [ ] Focus on [topic]
- [ ] Review [concept]

---

**Previous:** [[${getPreviousLogDate(today)}]]
**Next:** [[${getNextLogDate(today)}]]
`;

  // Download the daily log
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Daily-Log-${today}.md`;
  link.click();
  URL.revokeObjectURL(url);

  showToast("Daily log generated!", "success");
}

// Generate progress tracker
function generateProgressTracker() {
  const progress = getProgress();
  const stats = getCompletionStats();

  const markdown = `---
title: CodeQuest Progress Tracker
type: dashboard
tags: [codequest, progress, dashboard]
---

# 🎯 CodeQuest Progress Tracker

## Current Status

\`\`\`
Level: ${progress.level}
XP: ${progress.xp} / ${calculateXPForLevel(progress.level + 1)}
Streak: ${progress.streak} days 🔥
Total Time: ${formatTime(progress.totalTime)}
\`\`\`

## Learning Paths

### HTML
\`\`\`progress
${stats.html.completed} / ${stats.html.total} (${Math.round(
    (stats.html.completed / stats.html.total) * 100
  )}%)
\`\`\`

### CSS
\`\`\`progress
${stats.css.completed} / ${stats.css.total} (${Math.round(
    (stats.css.completed / stats.css.total) * 100
  )}%)
\`\`\`

### JavaScript
\`\`\`progress
${stats.js.completed} / ${stats.js.total} (${Math.round(
    (stats.js.completed / stats.js.total) * 100
  )}%)
\`\`\`

## Achievements

${progress.achievements
  .filter((a) => a.unlocked)
  .map((a) => `- ${a.icon} **${a.name}** - ${a.description}`)
  .join("\n")}

**Unlocked:** ${progress.achievements.filter((a) => a.unlocked).length} / ${
    progress.achievements.length
  }

## Statistics

| Metric | Value |
|--------|-------|
| Challenges Completed | ${stats.completed} / ${stats.total} |
| Perfect Completions | ${progress.stats.perfectCompletions} |
| Total Hints Used | ${progress.stats.hintsUsed} |
| Longest Streak | ${progress.longestStreak} days |
| Total Time | ${formatTime(progress.totalTime)} |

## Topics to Review

${
  progress.stats.studyMoreTopics.length > 0
    ? progress.stats.studyMoreTopics
        .map((id) => {
          const challenge = getAllChallenges().find((c) => c.id === id);
          return challenge
            ? `- [[${challenge.id}-${challenge.title.replace(/\s+/g, "-")}|${
                challenge.title
              }]]`
            : "";
        })
        .join("\n")
    : "_No topics flagged for review_"
}

## Recent Completions

${progress.completedChallenges
  .slice(-5)
  .reverse()
  .map((id) => {
    const challenge = getAllChallenges().find((c) => c.id === id);
    if (!challenge) return "";
    const state = progress.challengeStates[id];
    return `- [[${challenge.id}-${challenge.title.replace(/\s+/g, "-")}|${
      challenge.title
    }]] - ${challenge.category}`;
  })
  .join("\n")}

---

*Last updated: ${new Date().toLocaleString()}*
`;

  // Download the progress tracker
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Progress-Tracker.md";
  link.click();
  URL.revokeObjectURL(url);

  showToast("Progress tracker generated!", "success");
}

// Helper functions for daily log links
function getPreviousLogDate(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return `Daily-Log-${date.toISOString().split("T")[0]}`;
}

function getNextLogDate(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return `Daily-Log-${date.toISOString().split("T")[0]}`;
}

// Export all completed challenges at once
function exportAllToObsidian() {
  const progress = getProgress();
  const completed = progress.completedChallenges;

  if (completed.length === 0) {
    showToast("No completed challenges to export", "info");
    return;
  }

  if (
    confirm(`Export all ${completed.length} completed challenges to Obsidian?`)
  ) {
    completed.forEach((id) => {
      const challenge = getAllChallenges().find((c) => c.id === id);
      if (challenge) {
        exportChallengeToObsidian(challenge, progress.challengeStates[id]);
      }
    });

    // Also generate progress tracker and latest daily log
    generateProgressTracker();
    generateDailyLog();

    showToast(
      'All notes queued for export! Click "Sync to Obsidian" to download.',
      "success"
    );
  }
}
