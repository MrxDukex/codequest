// Firebase Sync - Automatic cross-device progress synchronization
// This handles real-time syncing of progress data across all devices

let syncEnabled = false;
let userId = null;
let syncStatusIndicator = null;

// Initialize Firebase sync when auth is ready
window.initializeFirebaseSync = function () {
  const auth = window.firebaseAuth;
  const { onAuthStateChanged } = window.firebaseModules;

  // Create sync status indicator
  createSyncStatusIndicator();

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId = user.uid;
      syncEnabled = true;
      updateSyncStatus("synced");
      console.log("✅ Sync enabled for user:", userId);

      // Load data from Firebase
      loadFromCloud();

      // Set up real-time listener
      setupRealtimeSync();
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
const originalMarkChallengeComplete = window.markChallengeComplete;
if (originalMarkChallengeComplete) {
  window.markChallengeComplete = function (challengeId) {
    // Call original function
    const result = originalMarkChallengeComplete(challengeId);

    // Trigger cloud sync
    localStorage.setItem("lastUpdated", new Date().toISOString());
    if (syncEnabled) {
      saveToCloud();
    }

    return result;
  };
}

// Sync when user gains XP or achievements
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

// Export functions for testing
window.saveToCloud = saveToCloud;
window.loadFromCloud = loadFromCloud;

console.log("🔥 Firebase sync module loaded");
