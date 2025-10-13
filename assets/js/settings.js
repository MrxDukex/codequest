// ===== SETTINGS MANAGEMENT =====

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'dark',
  editor: {
    fontSize: 'medium',
    theme: 'dark',
    lineNumbers: true,
    autoComplete: true,
    wordWrap: false,
    tabSize: 2
  },
  learning: {
    autoHints: '5',
    progressiveDifficulty: false,
    solutionTimer: true
  },
  notifications: {
    achievementPopups: true,
    dailyReminders: true,
    streakWarnings: true
  }
};

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('codequest_settings');
  return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem('codequest_settings', JSON.stringify(settings));
  // Sync to cloud if available
  if (window.saveToCloud) {
    window.saveToCloud();
  }
}

// Get current settings
function getSettings() {
  return loadSettings();
}

// ===== MODAL FUNCTIONS =====

function openSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Load current settings into UI
  const settings = loadSettings();
  document.getElementById('theme-select').value = settings.theme;
  document.getElementById('editor-font-size').value = settings.editor.fontSize;
  document.getElementById('editor-theme').value = settings.editor.theme;
  document.getElementById('line-numbers').checked = settings.editor.lineNumbers;
  document.getElementById('auto-complete').checked = settings.editor.autoComplete;
  document.getElementById('word-wrap').checked = settings.editor.wordWrap;
  document.getElementById('tab-size').value = settings.editor.tabSize;
  document.getElementById('auto-hints').value = settings.learning.autoHints;
  document.getElementById('progressive-difficulty').checked = settings.learning.progressiveDifficulty;
  document.getElementById('solution-timer').checked = settings.learning.solutionTimer;
  document.getElementById('achievement-popups').checked = settings.notifications.achievementPopups;
  document.getElementById('daily-reminders').checked = settings.notifications.dailyReminders;
  document.getElementById('streak-warnings').checked = settings.notifications.streakWarnings;
}

function closeSettings() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openHelp() {
  const modal = document.getElementById('help-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeHelp() {
  const modal = document.getElementById('help-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modals on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeSettings();
    closeHelp();
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSettings();
    closeHelp();
  }
});

// ===== THEME SETTINGS =====

function changeTheme(theme) {
  const settings = loadSettings();
  settings.theme = theme;
  saveSettings(settings);
  
  document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  
  // Show success message
  showToast(`Theme changed to ${theme} mode`, 'success');
}

// ===== EDITOR SETTINGS =====

function changeEditorFontSize(size) {
  const settings = loadSettings();
  settings.editor.fontSize = size;
  saveSettings(settings);
  
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.classList.remove('font-small', 'font-medium', 'font-large');
    editor.classList.add(`font-${size}`);
  }
  
  showToast('Editor font size updated', 'success');
}

function changeEditorTheme(theme) {
  const settings = loadSettings();
  settings.editor.theme = theme;
  saveSettings(settings);
  
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.setAttribute('data-theme', theme);
  }
  
  showToast(`Editor theme changed to ${theme}`, 'success');
}

function toggleLineNumbers(enabled) {
  const settings = loadSettings();
  settings.editor.lineNumbers = enabled;
  saveSettings(settings);
  
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.classList.toggle('hide-line-numbers', !enabled);
  }
  
  showToast(`Line numbers ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleAutoComplete(enabled) {
  const settings = loadSettings();
  settings.editor.autoComplete = enabled;
  saveSettings(settings);
  
  showToast(`Auto-complete ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleWordWrap(enabled) {
  const settings = loadSettings();
  settings.editor.wordWrap = enabled;
  saveSettings(settings);
  
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    editor.style.overflowX = enabled ? 'hidden' : 'auto';
  }
  
  showToast(`Word wrap ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function changeTabSize(size) {
  const settings = loadSettings();
  settings.editor.tabSize = parseInt(size);
  saveSettings(settings);
  
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.style.tabSize = size;
  }
  
  showToast(`Tab size set to ${size} spaces`, 'success');
}

// ===== LEARNING SETTINGS =====

function changeAutoHints(value) {
  const settings = loadSettings();
  settings.learning.autoHints = value;
  saveSettings(settings);
  
  if (value === 'off') {
    showToast('Auto-hints disabled', 'info');
  } else {
    showToast(`Auto-hints will show after ${value} attempts`, 'success');
  }
}

function toggleProgressiveDifficulty(enabled) {
  const settings = loadSettings();
  settings.learning.progressiveDifficulty = enabled;
  saveSettings(settings);
  
  showToast(`Progressive difficulty ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleSolutionTimer(enabled) {
  const settings = loadSettings();
  settings.learning.solutionTimer = enabled;
  saveSettings(settings);
  
  const timer = document.getElementById('challenge-timer');
  if (timer) {
    timer.style.display = enabled ? 'block' : 'none';
  }
  
  showToast(`Solution timer ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

// ===== NOTIFICATION SETTINGS =====

function toggleAchievementPopups(enabled) {
  const settings = loadSettings();
  settings.notifications.achievementPopups = enabled;
  saveSettings(settings);
  
  showToast(`Achievement pop-ups ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleDailyReminders(enabled) {
  const settings = loadSettings();
  settings.notifications.dailyReminders = enabled;
  saveSettings(settings);
  
  if (enabled) {
    scheduleDailyReminder();
  }
  
  showToast(`Daily reminders ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleStreakWarnings(enabled) {
  const settings = loadSettings();
  settings.notifications.streakWarnings = enabled;
  saveSettings(settings);
  
  showToast(`Streak warnings ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

// ===== DAILY REMINDER SYSTEM =====

function scheduleDailyReminder() {
  const settings = loadSettings();
  if (!settings.notifications.dailyReminders) return;
  
  // Check if user hasn't completed daily quest
  const progress = JSON.parse(localStorage.getItem('codequest_progress') || '{}');
  const lastActivity = progress.lastActivity || Date.now();
  const hoursSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);
  
  // If more than 18 hours since last activity, show reminder
  if (hoursSinceActivity > 18) {
    showToast('⏰ Don\'t forget your daily challenge!', 'warning', 5000);
  }
}

// ===== STREAK WARNING SYSTEM =====

function checkStreakWarning() {
  const settings = loadSettings();
  if (!settings.notifications.streakWarnings) return;
  
  const progress = JSON.parse(localStorage.getItem('codequest_progress') || '{}');
  const lastActivity = progress.lastActivity || Date.now();
  const hoursSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);
  
  // If more than 20 hours since last activity, warn about losing streak
  if (hoursSinceActivity > 20 && progress.streak > 0) {
    showToast('⚠️ Complete a challenge to keep your streak!', 'warning', 5000);
  }
}

// ===== APPLY SETTINGS ON LOAD =====

function applySettings() {
  const settings = loadSettings();
  
  // Apply theme
  document.body.className = settings.theme === 'dark' ? 'dark-theme' : 'light-theme';
  
  // Apply editor settings
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.classList.add(`font-${settings.editor.fontSize}`);
    editor.setAttribute('data-theme', settings.editor.theme);
    editor.classList.toggle('hide-line-numbers', !settings.editor.lineNumbers);
    editor.style.whiteSpace = settings.editor.wordWrap ? 'pre-wrap' : 'pre';
    editor.style.overflowX = settings.editor.wordWrap ? 'hidden' : 'auto';
    editor.style.tabSize = settings.editor.tabSize;
  }
  
  // Apply learning settings
  const timer = document.getElementById('challenge-timer');
  if (timer) {
    timer.style.display = settings.learning.solutionTimer ? 'block' : 'none';
  }
  
  // Schedule reminders if enabled
  if (settings.notifications.dailyReminders) {
    setInterval(scheduleDailyReminder, 60 * 60 * 1000); // Check every hour
  }
  
  if (settings.notifications.streakWarnings) {
    setInterval(checkStreakWarning, 60 * 60 * 1000); // Check every hour
  }
}

// ===== INITIALIZE =====

// Apply settings when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applySettings);
} else {
  applySettings();
}

// Export for use in other files
window.getSettings = getSettings;
window.saveSettings = saveSettings;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.openHelp = openHelp;
window.closeHelp = closeHelp;
