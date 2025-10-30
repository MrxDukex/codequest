// ===== OBSIDIAN INTEGRATION =====

const OBSIDIAN_API_KEY =
  "2a672d8391da2dfd65fd3eaadaaa54f08fe971a54e42b70452f2f7914d6e9133";
const OBSIDIAN_API_URL = "http://127.0.0.1:27123";
const CODEQUEST_FOLDER = "CodeQuest";

// Export challenge to Obsidian (via Firebase cloud, then to local vault when PC available)
async function exportChallengeToObsidian(challenge, challengeState) {
  const markdown = generateChallengeNote(challenge, challengeState);
  const fileName = `${challenge.id}-${challenge.title.replace(/\s+/g, "-")}.md`;

  // First, save to Firebase cloud for cross-device access
  await saveNoteToFirebase(fileName, markdown, 'challenge');

  // Then try to write to local Obsidian if available
  try {
    const filePath = `${CODEQUEST_FOLDER}/${fileName}`;
    await createObsidianNote(filePath, markdown);
    showToast(`Exported "${challenge.title}" to Obsidian!`, "success");
    
    // Mark as synced in Firebase
    await markNoteAsSynced(fileName);
  } catch (error) {
    console.error("Failed to write to local Obsidian:", error);
    // Note is already in Firebase, will sync when PC is on
    showToast(`"${challenge.title}" saved to cloud (will sync to Obsidian when PC is on)`, "info");
  }
}

// Create or update a note in Obsidian via REST API
async function createObsidianNote(filePath, content) {
  const response = await fetch(`${OBSIDIAN_API_URL}/vault/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${OBSIDIAN_API_KEY}`,
      "Content-Type": "text/markdown",
    },
    body: content,
  });

  if (!response.ok) {
    throw new Error(`Obsidian API error: ${response.status}`);
  }

  return await response.text();
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

// Save note to Firebase cloud storage
async function saveNoteToFirebase(fileName, content, type = 'challenge') {
  try {
    const deviceSyncCode = localStorage.getItem('deviceSyncCode');
    if (!deviceSyncCode) {
      console.error('No sync code found');
      return;
    }

    const db = window.firebaseDb;
    const { doc, setDoc } = window.firebaseModules;

    const noteData = {
      fileName,
      content,
      type,
      createdAt: Date.now(),
      synced: false,
      deviceId: deviceSyncCode
    };

    const docRef = doc(db, 'obsidian_notes', `${deviceSyncCode}_${fileName}`);
    await setDoc(docRef, noteData, { merge: true });
    
    console.log('✅ Note saved to Firebase:', fileName);
  } catch (error) {
    console.error('Failed to save note to Firebase:', error);
  }
}

// Mark note as synced to local Obsidian
async function markNoteAsSynced(fileName) {
  try {
    const deviceSyncCode = localStorage.getItem('deviceSyncCode');
    if (!deviceSyncCode) return;

    const db = window.firebaseDb;
    const { doc, setDoc } = window.firebaseModules;

    const docRef = doc(db, 'obsidian_notes', `${deviceSyncCode}_${fileName}`);
    await setDoc(docRef, { synced: true, syncedAt: Date.now() }, { merge: true });
  } catch (error) {
    console.error('Failed to mark note as synced:', error);
  }
}

// Store note for batch export (legacy fallback)
function storeNoteForExport(fileName, content) {
  let pendingExports = localStorage.getItem("codequest_pending_exports");
  pendingExports = pendingExports ? JSON.parse(pendingExports) : {};

  pendingExports[fileName] = content;
  localStorage.setItem(
    "codequest_pending_exports",
    JSON.stringify(pendingExports)
  );
}

// Sync all pending notes from Firebase to local Obsidian
async function syncToObsidian() {
  try {
    // Check if Obsidian is running
    const isObsidianRunning = await testObsidianConnection(true);
    
    if (!isObsidianRunning) {
      showToast("⚠️ Obsidian is not running. Start Obsidian with Local REST API enabled.", "warning");
      return;
    }

    // Get unsynced notes from Firebase
    const unsyncedNotes = await getUnsyncedNotesFromFirebase();

    if (unsyncedNotes.length === 0) {
      showToast("✅ All notes are already synced to Obsidian!", "success");
      return;
    }

    showToast(`Syncing ${unsyncedNotes.length} notes to Obsidian...`, "info");

    let successCount = 0;
    let failedCount = 0;

    for (const note of unsyncedNotes) {
      try {
        // Determine folder based on note type
        let folderPath = CODEQUEST_FOLDER;
        if (note.type === 'daily-log') {
          folderPath = `${CODEQUEST_FOLDER}/Daily-Logs`;
        }
        
        const filePath = `${folderPath}/${note.fileName}`;
        await createObsidianNote(filePath, note.content);
        
        // Mark as synced in Firebase
        await markNoteAsSynced(note.fileName);
        successCount++;
      } catch (error) {
        console.error(`Failed to sync ${note.fileName}:`, error);
        failedCount++;
      }
    }

    if (successCount > 0) {
      // Mark achievement
      const progress = getProgress();
      checkAchievement("obsidian", progress);

      showToast(
        `✅ ${successCount} note${successCount > 1 ? "s" : ""} synced to Obsidian!`,
        "success"
      );
    }

    if (failedCount > 0) {
      showToast(
        `⚠️ ${failedCount} note${failedCount > 1 ? "s" : ""} failed to sync`,
        "warning"
      );
    }
  } catch (error) {
    console.error("Sync failed:", error);
    showToast(
      "Failed to sync. Is Obsidian running with Local REST API enabled?",
      "error"
    );
  }
}

// Get unsynced notes from Firebase
async function getUnsyncedNotesFromFirebase() {
  try {
    const deviceSyncCode = localStorage.getItem('deviceSyncCode');
    if (!deviceSyncCode) {
      console.error('No sync code found');
      return [];
    }

    const db = window.firebaseDb;
    const { collection, query, where, getDocs } = window.firebaseModules;

    // Query for unsynced notes
    const notesRef = collection(db, 'obsidian_notes');
    const q = query(
      notesRef,
      where('deviceId', '==', deviceSyncCode),
      where('synced', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const notes = [];

    querySnapshot.forEach((doc) => {
      notes.push(doc.data());
    });

    console.log(`📥 Found ${notes.length} unsynced notes in Firebase`);
    return notes;
  } catch (error) {
    console.error('Failed to get unsynced notes from Firebase:', error);
    return [];
  }
}

// Auto-sync notes when on PC (runs periodically)
async function autoSyncToObsidianIfAvailable() {
  try {
    const isObsidianRunning = await testObsidianConnection(true);
    
    if (isObsidianRunning) {
      const unsyncedNotes = await getUnsyncedNotesFromFirebase();
      
      if (unsyncedNotes.length > 0) {
        console.log(`🔄 Auto-syncing ${unsyncedNotes.length} notes to Obsidian...`);
        await syncToObsidian();
      }
    }
  } catch (error) {
    // Silently fail - this is a background operation
    console.log('Auto-sync skipped (Obsidian not available)');
  }
}

// Start auto-sync timer when app loads (checks every 5 minutes)
if (typeof window !== 'undefined') {
  // Initial check after 10 seconds
  setTimeout(() => {
    autoSyncToObsidianIfAvailable();
  }, 10000);
  
  // Then check every 5 minutes
  setInterval(() => {
    autoSyncToObsidianIfAvailable();
  }, 5 * 60 * 1000);
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
async function generateDailyLog() {
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

  const fileName = `Daily-Log-${today}.md`;
  
  // Save to Firebase first
  await saveNoteToFirebase(fileName, markdown, 'daily-log');

  // Then try to write to local Obsidian if available
  try {
    const filePath = `${CODEQUEST_FOLDER}/Daily-Logs/${fileName}`;
    await createObsidianNote(filePath, markdown);
    await markNoteAsSynced(fileName);
    showToast("Daily log synced to Obsidian!", "success");
  } catch (error) {
    console.error("Failed to create daily log:", error);
    // Saved to Firebase, will sync when PC is on
    showToast("Daily log saved to cloud (will sync to Obsidian when PC is on)", "info");
  }
}

// Generate progress tracker
async function generateProgressTracker() {
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

  const fileName = "Progress-Tracker.md";
  
  // Save to Firebase first
  await saveNoteToFirebase(fileName, markdown, 'tracker');

  // Then try to write to local Obsidian if available
  try {
    const filePath = `${CODEQUEST_FOLDER}/${fileName}`;
    await createObsidianNote(filePath, markdown);
    await markNoteAsSynced(fileName);
    showToast("Progress tracker synced to Obsidian!", "success");
  } catch (error) {
    console.error("Failed to create progress tracker:", error);
    // Saved to Firebase, will sync when PC is on
    showToast("Progress tracker saved to cloud (will sync to Obsidian when PC is on)", "info");
  }
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

// Test Obsidian API connection
async function testObsidianConnection(silent = false) {
  try {
    const response = await fetch(`${OBSIDIAN_API_URL}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${OBSIDIAN_API_KEY}`,
      },
    });

    if (response.ok) {
      if (!silent) showToast("✅ Connected to Obsidian!", "success");
      return true;
    } else {
      if (!silent) showToast("❌ Obsidian API authentication failed", "error");
      return false;
    }
  } catch (error) {
    if (!silent) showToast("❌ Cannot connect to Obsidian. Is it running?", "error");
    return false;
  }
}

// Export all completed challenges at once
async function exportAllToObsidian() {
  const progress = getProgress();
  const completed = progress.completedChallenges;

  if (completed.length === 0) {
    showToast("No completed challenges to export", "info");
    return;
  }

  if (
    confirm(`Export all ${completed.length} completed challenges to Obsidian?`)
  ) {
    showToast(`Exporting ${completed.length} challenges...`, "info");

    let successCount = 0;
    let failedCount = 0;

    for (const id of completed) {
      const challenge = getAllChallenges().find((c) => c.id === id);
      if (challenge) {
        try {
          await exportChallengeToObsidian(
            challenge,
            progress.challengeStates[id]
          );
          successCount++;
        } catch (error) {
          failedCount++;
        }
      }
    }

    // Also generate progress tracker and latest daily log
    await generateProgressTracker();
    await generateDailyLog();

    if (successCount > 0) {
      showToast(
        `✅ Exported ${successCount} challenges to Obsidian!`,
        "success"
      );
    }

    if (failedCount > 0) {
      showToast(`⚠️ ${failedCount} challenges failed to export`, "warning");
    }
  }
}
