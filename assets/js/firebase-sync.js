// Firebase Sync - Automatic cross-device progress synchronization
// This handles real-time syncing of progress data across all devices

let syncEnabled = false;
let userId = null;
let syncStatusIndicator = null;
let deviceSyncCode = null;

// Get or create a shared sync code for all devices
function getDeviceSyncCode() {
  // Check localStorage first
  let code = localStorage.getItem("deviceSyncCode");

  // If no code exists, try to get from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlCode = urlParams.get("sync");

  if (urlCode) {
    // Use code from URL and save it
    code = urlCode;
    localStorage.setItem("deviceSyncCode", code);
    console.log("🔗 Using sync code from URL:", code);
    // Remove the parameter from URL without reloading
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash
    );
  } else if (!code) {
    // Generate a new code (8 random characters)
    code = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("deviceSyncCode", code);
    console.log("🆕 Generated new sync code:", code);
    showSyncCodePrompt(code);
  } else {
    console.log("✅ Using existing sync code:", code);
  }

  return code;
}

// Show sync code to user for other devices
function showSyncCodePrompt(code) {
  const syncUrl = `${window.location.origin}${window.location.pathname}?sync=${code}`;

  setTimeout(() => {
    const message = `📱 To sync with other devices, open this URL on your phone:\n\n${syncUrl}\n\nOr manually enter sync code: ${code}`;

    if (confirm(message + "\n\nCopy URL to clipboard?")) {
      navigator.clipboard
        .writeText(syncUrl)
        .then(() => {
          showToast("Sync URL copied to clipboard!", "success");
        })
        .catch(() => {
          showToast("Sync code: " + code, "info");
        });
    }
  }, 2000);
}

// Initialize Firebase sync when auth is ready
window.initializeFirebaseSync = function () {
  const auth = window.firebaseAuth;
  const { onAuthStateChanged } = window.firebaseModules;

  // Create sync status indicator
  createSyncStatusIndicator();

  console.log("🔥 Initializing Firebase sync...");

  // Get device sync code (shared across all devices)
  deviceSyncCode = getDeviceSyncCode();

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Use deviceSyncCode instead of user.uid for cross-device sync
      userId = deviceSyncCode;
      syncEnabled = true;
      updateSyncStatus("synced");
      console.log("✅ Sync enabled with code:", deviceSyncCode);

      // Load data from Firebase
      loadFromCloud();

      // Set up real-time listener
      setupRealtimeSync();

      // Override progress functions after sync is ready
      setTimeout(overrideProgressFunctions, 500);
    } else {
      syncEnabled = false;
      userId = null;
      updateSyncStatus("offline");
      console.log("⚠️ Not signed in - sync disabled");
    }
  });
};

// Create sync status indicator in the UI
function createSyncStatusIndicator() {
  if (syncStatusIndicator) return; // Already created

  syncStatusIndicator = document.createElement("div");
  syncStatusIndicator.id = "sync-status";
  syncStatusIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
  document.body.appendChild(syncStatusIndicator);
}

// Update sync status indicator
function updateSyncStatus(status) {
  if (!syncStatusIndicator) return;

  const statusConfig = {
    syncing: { icon: "🔄", text: "Syncing...", bg: "#3498db", color: "#fff" },
    synced: { icon: "✅", text: "Synced", bg: "#2ecc71", color: "#fff" },
    offline: { icon: "📴", text: "Offline", bg: "#95a5a6", color: "#fff" },
    error: { icon: "⚠️", text: "Sync Error", bg: "#e74c3c", color: "#fff" },
  };

  const config = statusConfig[status] || statusConfig.offline;
  syncStatusIndicator.innerHTML = `<span>${config.icon}</span><span>${config.text}</span>`;
  syncStatusIndicator.style.backgroundColor = config.bg;
  syncStatusIndicator.style.color = config.color;

  // Hide "Synced" status after 2 seconds
  if (status === "synced") {
    setTimeout(() => {
      syncStatusIndicator.style.opacity = "0.6";
      syncStatusIndicator.style.transform = "scale(0.9)";
    }, 2000);
  } else {
    syncStatusIndicator.style.opacity = "1";
    syncStatusIndicator.style.transform = "scale(1)";
  }
}

// Load progress from Firebase
async function loadFromCloud() {
  if (!syncEnabled || !userId) return;

  try {
    updateSyncStatus("syncing");
    const db = window.firebaseDb;
    const { doc, getDoc } = window.firebaseModules;

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cloudData = docSnap.data();
      console.log("📥 Loading progress from cloud:", cloudData);

      // Merge cloud data with local data
      mergeProgressData(cloudData);

      updateSyncStatus("synced");
    } else {
      console.log("📝 No cloud data found, will sync local data");
      // Upload current local data to cloud
      await saveToCloud();
    }
  } catch (error) {
    console.error("❌ Error loading from cloud:", error);
    updateSyncStatus("error");
  }
}

// Save progress to Firebase
async function saveToCloud() {
  if (!syncEnabled || !userId) return;

  try {
    updateSyncStatus("syncing");
    const db = window.firebaseDb;
    const { doc, setDoc } = window.firebaseModules;

    // Get all progress data from localStorage
    const progressData = {
      completedChallenges: JSON.parse(
        localStorage.getItem("completedChallenges") || "[]"
      ),
      userXP: parseInt(localStorage.getItem("userXP") || "0"),
      userLevel: parseInt(localStorage.getItem("userLevel") || "1"),
      currentStreak: parseInt(localStorage.getItem("currentStreak") || "0"),
      longestStreak: parseInt(localStorage.getItem("longestStreak") || "0"),
      lastActiveDate: localStorage.getItem("lastActiveDate") || null,
      achievements: JSON.parse(localStorage.getItem("achievements") || "[]"),
      lastUpdated: new Date().toISOString(),
    };

    const docRef = doc(db, "users", userId);
    await setDoc(docRef, progressData, { merge: true });

    console.log("📤 Progress saved to cloud");
    updateSyncStatus("synced");
  } catch (error) {
    console.error("❌ Error saving to cloud:", error);
    updateSyncStatus("error");
  }
}

// Merge cloud data with local data (cloud takes precedence if more recent)
function mergeProgressData(cloudData) {
  const localUpdated = localStorage.getItem("lastUpdated");
  const cloudUpdated = cloudData.lastUpdated;

  // If cloud data is more recent, use it
  if (
    !localUpdated ||
    (cloudUpdated && new Date(cloudUpdated) > new Date(localUpdated))
  ) {
    console.log("☁️ Cloud data is newer, updating local storage");

    if (cloudData.completedChallenges) {
      localStorage.setItem(
        "completedChallenges",
        JSON.stringify(cloudData.completedChallenges)
      );
    }
    if (cloudData.userXP !== undefined) {
      localStorage.setItem("userXP", cloudData.userXP.toString());
    }
    if (cloudData.userLevel !== undefined) {
      localStorage.setItem("userLevel", cloudData.userLevel.toString());
    }
    if (cloudData.currentStreak !== undefined) {
      localStorage.setItem("currentStreak", cloudData.currentStreak.toString());
    }
    if (cloudData.longestStreak !== undefined) {
      localStorage.setItem("longestStreak", cloudData.longestStreak.toString());
    }
    if (cloudData.lastActiveDate) {
      localStorage.setItem("lastActiveDate", cloudData.lastActiveDate);
    }
    if (cloudData.achievements) {
      localStorage.setItem(
        "achievements",
        JSON.stringify(cloudData.achievements)
      );
    }

    localStorage.setItem("lastUpdated", cloudData.lastUpdated);

    // Refresh the UI if we're on the dashboard
    if (
      typeof loadDashboard === "function" &&
      window.location.hash === "#dashboard"
    ) {
      loadDashboard();
    }
  } else {
    console.log("💾 Local data is newer, syncing to cloud");
    saveToCloud();
  }
}

// Set up real-time sync listener
function setupRealtimeSync() {
  if (!syncEnabled || !userId) return;

  const db = window.firebaseDb;
  const { doc, onSnapshot } = window.firebaseModules;

  const docRef = doc(db, "users", userId);

  // Listen for real-time updates from other devices
  onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        const cloudData = doc.data();
        const localUpdated = localStorage.getItem("lastUpdated");

        // Only update if cloud data is from a different device
        if (cloudData.lastUpdated !== localUpdated) {
          console.log("🔄 Real-time update received from another device");
          mergeProgressData(cloudData);
        }
      }
    },
    (error) => {
      console.error("❌ Real-time sync error:", error);
      updateSyncStatus("error");
    }
  );
}

// Override the markChallengeComplete function to trigger sync
function overrideProgressFunctions() {
  const originalMarkChallengeComplete = window.markChallengeComplete;
  if (originalMarkChallengeComplete) {
    window.markChallengeComplete = function (challengeId) {
      // Call original function
      const result = originalMarkChallengeComplete(challengeId);

      // Trigger cloud sync
      localStorage.setItem("lastUpdated", new Date().toISOString());
      if (syncEnabled) {
        console.log("🔄 Challenge completed, syncing to cloud...");
        saveToCloud();
      }

      return result;
    };
  }

  const originalSaveProgress = window.saveProgress;
  if (originalSaveProgress) {
    window.saveProgress = function (...args) {
      // Call original function
      const result = originalSaveProgress(...args);

      // Trigger cloud sync
      localStorage.setItem("lastUpdated", new Date().toISOString());
      if (syncEnabled) {
        saveToCloud();
      }

      return result;
    };
  }
}

// Call this after a delay to ensure functions are loaded
setTimeout(overrideProgressFunctions, 1000);

// Show sync code UI
window.showSyncCode = function () {
  const code = localStorage.getItem("deviceSyncCode");
  if (!code) {
    showToast("Sync not initialized yet", "error");
    return;
  }

  const syncUrl = `${window.location.origin}${window.location.pathname}?sync=${code}`;

  const message = `📱 To sync your progress to another device:\n\n1. Copy the URL below\n2. Open it on your other device\n3. Your progress will sync automatically!\n\n${syncUrl}\n\nSync Code: ${code}`;

  if (confirm(message + "\n\nCopy URL to clipboard?")) {
    navigator.clipboard
      .writeText(syncUrl)
      .then(() => {
        showToast("✅ Sync URL copied! Open on your phone", "success");
      })
      .catch(() => {
        alert("Sync code: " + code + "\n\nManually open: " + syncUrl);
      });
  }
};

// Export functions for testing
window.saveToCloud = saveToCloud;
window.loadFromCloud = loadFromCloud;

console.log("🔥 Firebase sync module loaded");
