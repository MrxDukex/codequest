// ===== CODE EDITOR & CHALLENGE LOGIC =====

let challengeStartTime = null;
let currentHintsRevealed = 0;
let usedSolution = false;

// Load a challenge
function loadChallenge(challengeId) {
  const challenge = getAllChallenges().find((c) => c.id === challengeId);
  if (!challenge) {
    showToast("Challenge not found!", "error");
    return;
  }

  currentChallengeId = challengeId;
  challengeStartTime = Date.now();
  currentHintsRevealed = 0;
  usedSolution = false;

  switchView("challenge");

  const progress = getProgress();
  const state = progress.challengeStates[challengeId] || {
    status: "not-started",
  };

  // Update header
  document.getElementById("challenge-title").textContent = challenge.title;
  document.getElementById("challenge-category").textContent =
    challenge.category;
  document.getElementById("challenge-category").style.background =
    getCategoryGradient(challenge.category);
  document.getElementById("challenge-difficulty").textContent =
    challenge.difficulty;
  document.getElementById("challenge-xp").textContent = `+${challenge.xp} XP`;

  // Load instructions
  document.getElementById("instructions-content").innerHTML =
    challenge.instructions;

  // Load hints
  loadHints(challenge.hints);

  // Load tests
  loadTests(challenge.tests);

  // Load code editor
  const codeInput = document.getElementById("code-input");
  codeInput.value = state.currentCode || challenge.starterCode || "";

  // Setup code buttons based on category
  setupQuickCodeButtons(challenge.category);

  // Setup auto-save
  codeInput.addEventListener("input", () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveCurrentChallenge, 5000);
  });

  // Update preview (but don't run tests yet)
  updatePreview();

  // Setup navigation buttons
  updateChallengeNavigation(challenge);

  // Disable Next button until challenge is passed (unless already completed)
  const nextBtn = document.getElementById("next-challenge-btn");
  if (nextBtn) {
    nextBtn.disabled = !progress.completedChallenges.includes(challengeId);
  }

  // Mark as in progress if not completed
  if (!progress.completedChallenges.includes(challengeId)) {
    if (!progress.challengeStates[challengeId]) {
      progress.challengeStates[challengeId] = {};
    }
    progress.challengeStates[challengeId].status = "in-progress";
    saveProgress(progress);
  }
}

// Load hints
function loadHints(hints) {
  const hintsList = document.getElementById("hints-list");
  hintsList.innerHTML = "";

  if (!hints || hints.length === 0) {
    hintsList.innerHTML =
      '<p style="color: var(--text-muted);">No hints available for this challenge.</p>';
    return;
  }

  hints.forEach((hint, index) => {
    const hintItem = document.createElement("div");
    hintItem.className = "hint-item";
    hintItem.innerHTML = `
            <div class="hint-header">
                <span class="hint-number">Hint ${index + 1}</span>
                <button class="reveal-hint-btn" onclick="revealHint(${index})">
                    Reveal Hint (-${Math.round(10 / hints.length)}% XP)
                </button>
            </div>
            <div class="hint-content" id="hint-${index}">
                <p>${hint}</p>
            </div>
        `;
    hintsList.appendChild(hintItem);
  });

  document.getElementById(
    "hints-counter"
  ).textContent = `0/${hints.length} hints used`;
}

// Reveal a hint
function revealHint(index) {
  const hintContent = document.getElementById(`hint-${index}`);
  if (hintContent.classList.contains("revealed")) {
    return; // Already revealed
  }

  hintContent.classList.add("revealed");
  currentHintsRevealed++;

  const challenge = getAllChallenges().find((c) => c.id === currentChallengeId);
  const totalHints = challenge.hints.length;

  document.getElementById(
    "hints-counter"
  ).textContent = `${currentHintsRevealed}/${totalHints} hints used`;

  showToast(`Hint ${index + 1} revealed`, "info");
}

// Show solution (Really Stuck button)
function showSolution() {
  if (
    !confirm(
      "Using the solution will reduce your XP by 70% and mark this topic for review. Are you sure?"
    )
  ) {
    return;
  }

  const challenge = getAllChallenges().find((c) => c.id === currentChallengeId);
  if (!challenge || !challenge.solution) {
    showToast("Solution not available", "error");
    return;
  }

  document.getElementById("code-input").value = challenge.solution;
  usedSolution = true;
  runCode();

  showToast("Solution shown. Try to understand the code!", "warning");
}

// Load tests
function loadTests(tests) {
  const testsList = document.getElementById("tests-list");
  testsList.innerHTML = "";

  if (!tests || tests.length === 0) {
    testsList.innerHTML =
      '<p style="color: var(--text-muted);">No automated tests for this challenge.</p>';
    return;
  }

  tests.forEach((test, index) => {
    const testItem = document.createElement("div");
    testItem.className = "test-item pending";
    testItem.id = `test-${index}`;
    testItem.innerHTML = `
            <div class="test-icon"><i class="fas fa-circle"></i></div>
            <div class="test-description">${test}</div>
        `;
    testsList.appendChild(testItem);
  });
}

// Run code and update preview
// Update preview without running tests
function updatePreview() {
  const code = document.getElementById("code-input").value;
  const preview = document.getElementById("preview-frame");

  // Build full HTML document
  const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    margin: 16px; 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
            </style>
        </head>
        <body>
            ${code}
        </body>
        </html>
    `;

  preview.srcdoc = fullHTML;
}

// Run code AND tests (for "Run Code" button)
function runCode() {
  updatePreview();
  
  // Run tests
  setTimeout(() => {
    const code = document.getElementById("code-input").value;
    runTests(code);
  }, 500);
}

// Run tests on code
function runTests(code) {
  const challenge = getAllChallenges().find((c) => c.id === currentChallengeId);
  if (!challenge || !challenge.tests) return;

  let allPassed = true;

  challenge.tests.forEach((test, index) => {
    const passed = evaluateTest(code, test, challenge);
    const testItem = document.getElementById(`test-${index}`);

    if (testItem) {
      testItem.className = `test-item ${passed ? "passed" : "failed"}`;
      testItem.querySelector(".test-icon").innerHTML = `<i class="fas fa-${
        passed ? "check-circle" : "times-circle"
      }"></i>`;
    }

    if (!passed) allPassed = false;
  });

  // Enable Next button if all tests pass
  const nextBtn = document.getElementById("next-challenge-btn");
  if (nextBtn) {
    nextBtn.disabled = !allPassed;
  }

  // Show result message
  if (allPassed) {
    showToast("🎉 All tests passed! Click Next to continue.", "success");
  } else {
    showToast("❌ Some tests failed. Keep trying!", "error");
  }

  return allPassed;
}

// Evaluate a test
function evaluateTest(code, test, challenge) {
  // Simple pattern matching tests
  const lowerCode = code.toLowerCase();
  const lowerTest = test.toLowerCase();

  // Check for specific HTML tags (e.g., "Check if <h1> exists" or "<h1> tag")
  const tagMatch = test.match(/<(\w+)>/);
  if (tagMatch) {
    const tag = tagMatch[1].toLowerCase();
    return lowerCode.includes(`<${tag}>`);
  }

  // Check for specific text content (e.g., 'Contain "Hello, World!"')
  if (lowerTest.includes("contain") || lowerTest.includes("include")) {
    const contentMatch = test.match(/"([^"]+)"/);
    if (contentMatch) {
      return code.includes(contentMatch[1]);
    }
  }

  // Check for CSS properties (for inline styles)
  if (lowerTest.includes("style") || lowerTest.includes("css")) {
    const propMatch = lowerTest.match(/(\w+):/);
    if (propMatch) {
      return lowerCode.includes(propMatch[1] + ":");
    }
  }

  // Check for attribute existence (e.g., 'for="email"')
  if (test.includes("=")) {
    return code.includes(test);
  }

  // Default: just check if test string appears in code
  return lowerCode.includes(lowerTest.toLowerCase());
}

// Refresh preview
function refreshPreview() {
  runCode();
  showToast("Preview refreshed", "info");
}

// Reset challenge code
function resetChallenge() {
  if (
    confirm("Reset code to starting point? This will erase your current work.")
  ) {
    const challenge = getAllChallenges().find(
      (c) => c.id === currentChallengeId
    );
    document.getElementById("code-input").value = challenge.starterCode || "";
    runCode();
    showToast("Code reset", "info");
  }
}

// Check answer - runs tests and provides feedback
function checkAnswer() {
  const code = document.getElementById("code-input").value;
  const allPassed = runTests(code);

  if (allPassed) {
    // Mark challenge as complete
    const timeSpent = Math.floor(
      (Date.now() - challengeStartTime) / (1000 * 60)
    );
    markChallengeComplete(
      currentChallengeId,
      currentHintsRevealed,
      timeSpent,
      usedSolution
    );
  }
}

// Complete challenge
function completeChallenge() {
  const timeSpent = Math.floor((Date.now() - challengeStartTime) / (1000 * 60)); // minutes
  markChallengeComplete(
    currentChallengeId,
    currentHintsRevealed,
    timeSpent,
    usedSolution
  );

  // Show completion message
  setTimeout(() => {
    if (confirm("Challenge complete! Continue to next challenge?")) {
      nextChallenge();
    } else {
      backToChallengeList();
    }
  }, 500);
}

// Give up on challenge
function giveUpChallenge() {
  if (confirm("Give up on this challenge? You can come back to it later.")) {
    backToChallengeList();
  }
}

// Navigate to previous challenge
function previousChallenge() {
  const allChallenges = getAllChallenges().filter(
    (c) => c.category === currentPath.toUpperCase()
  );
  const currentIndex = allChallenges.findIndex(
    (c) => c.id === currentChallengeId
  );

  if (currentIndex > 0) {
    loadChallenge(allChallenges[currentIndex - 1].id);
  }
}

// Navigate to next challenge
function nextChallenge() {
  const allChallenges = getAllChallenges().filter(
    (c) => c.category === currentPath.toUpperCase()
  );
  const currentIndex = allChallenges.findIndex(
    (c) => c.id === currentChallengeId
  );

  if (currentIndex < allChallenges.length - 1) {
    loadChallenge(allChallenges[currentIndex + 1].id);
  } else {
    showToast("You've completed all challenges in this path!", "success");
    backToChallengeList();
  }
}

// Update challenge navigation buttons
function updateChallengeNavigation(challenge) {
  const allChallenges = getAllChallenges().filter(
    (c) => c.category === challenge.category
  );
  const currentIndex = allChallenges.findIndex((c) => c.id === challenge.id);

  const prevBtn = document.getElementById("prev-challenge-btn");
  const nextBtn = document.getElementById("next-challenge-btn");

  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = false; // Always allow next
}

// Setup quick code buttons
function setupQuickCodeButtons(category) {
  const container = document.getElementById("quick-code-buttons");

  const buttons = {
    HTML: [
      "<div></div>",
      "<p></p>",
      "<h1></h1>",
      '<a href=""></a>',
      '<img src="" alt="">',
      "<ul></ul>",
      "<li></li>",
      "<button></button>",
      '<input type="text">',
      "<form></form>",
    ],
    CSS: [
      "color:",
      "background:",
      "margin:",
      "padding:",
      "display:",
      "flex",
      "grid",
      "width:",
      "height:",
      "border:",
    ],
    JavaScript: [
      "const ",
      "let ",
      "function",
      "if ()",
      "for ()",
      "console.log()",
      "document.",
      ".addEventListener()",
      "return",
      "=>",
    ],
  };

  container.innerHTML = "";
  const categoryButtons = buttons[category] || [];

  categoryButtons.forEach((btn) => {
    const button = document.createElement("button");
    button.className = "quick-btn";
    button.textContent = btn;
    button.onclick = () => insertCode(btn);
    container.appendChild(button);
  });
}

// Insert code at cursor
function insertCode(text) {
  const input = document.getElementById("code-input");
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const current = input.value;

  input.value = current.substring(0, start) + text + current.substring(end);
  input.selectionStart = input.selectionEnd = start + text.length;
  input.focus();

  runCode();
}

// Toggle quick code buttons
function toggleCodeButtons() {
  const container = document.getElementById("quick-code-buttons");
  container.classList.toggle("hidden");

  const progress = getProgress();
  progress.settings.codeButtonsEnabled =
    !container.classList.contains("hidden");
  saveProgress(progress);
}

// Switch tabs in challenge view
function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  document
    .querySelector(`.tab-btn[data-tab="${tabName}"]`)
    .classList.add("active");
  document
    .querySelector(`.tab-content[data-tab="${tabName}"]`)
    .classList.add("active");
}

// ===== PLAYGROUND =====
function loadPlayground() {
  const saved = localStorage.getItem("codequest_playground");

  if (saved) {
    try {
      const data = JSON.parse(saved);
      document.getElementById("playground-html").value = data.html || "";
      document.getElementById("playground-css").value = data.css || "";
      document.getElementById("playground-js").value = data.js || "";
    } catch (e) {
      console.error("Error loading playground:", e);
    }
  }

  // Setup auto-update
  ["playground-html", "playground-css", "playground-js"].forEach((id) => {
    const textarea = document.getElementById(id);
    textarea.addEventListener("input", () => {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        updatePlaygroundPreview();
        savePlayground();
      }, 1000);
    });
  });

  updatePlaygroundPreview();

  // Check achievement
  const progress = getProgress();
  checkAchievement("playground", progress);
}

function updatePlaygroundPreview() {
  const html = document.getElementById("playground-html").value;
  const css = document.getElementById("playground-css").value;
  const js = document.getElementById("playground-js").value;

  const preview = document.getElementById("playground-frame");

  const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;

  preview.srcdoc = fullHTML;
}

function refreshPlaygroundPreview() {
  updatePlaygroundPreview();
  showToast("Preview refreshed", "info");
}

function savePlayground() {
  const data = {
    html: document.getElementById("playground-html").value,
    css: document.getElementById("playground-css").value,
    js: document.getElementById("playground-js").value,
  };

  localStorage.setItem("codequest_playground", JSON.stringify(data));
}

function clearPlayground() {
  if (confirm("Clear all code in the playground?")) {
    document.getElementById("playground-html").value = "";
    document.getElementById("playground-css").value = "";
    document.getElementById("playground-js").value = "";
    updatePlaygroundPreview();
    localStorage.removeItem("codequest_playground");
    showToast("Playground cleared", "info");
  }
}
