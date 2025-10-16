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
                table {
                    border-collapse: collapse;
                    border: 2px solid #333;
                }
                td, th {
                    border: 1px solid #666;
                    padding: 8px 12px;
                    text-align: left;
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
  const errors = [];

  // Use custom validator if available
  if (challenge.customValidator) {
    const results = challenge.customValidator(code);
    challenge.tests.forEach((test, index) => {
      const passed = results[index];
      const testItem = document.getElementById(`test-${index}`);

      if (testItem) {
        testItem.className = `test-item ${passed ? "passed" : "failed"}`;
        testItem.querySelector(".test-icon").innerHTML = `<i class="fas fa-${
          passed ? "check-circle" : "times-circle"
        }"></i>`;
      }

      if (!passed) {
        allPassed = false;
        errors.push({ test, index, description: test });
      }
    });
  } else {
    // Use default test evaluation
    challenge.tests.forEach((test, index) => {
      const result = evaluateTestWithDetails(code, test, challenge);
      const passed = result.passed;
      const testItem = document.getElementById(`test-${index}`);

      if (testItem) {
        testItem.className = `test-item ${passed ? "passed" : "failed"}`;
        testItem.querySelector(".test-icon").innerHTML = `<i class="fas fa-${
          passed ? "check-circle" : "times-circle"
        }"></i>`;
      }

      if (!passed) {
        allPassed = false;
        errors.push({ test, index, description: test, details: result.error });
      }
    });
  }

  // Highlight errors in code
  if (!allPassed) {
    highlightCodeErrors(code, errors);
  } else {
    clearCodeHighlights();
  }

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

// Highlight code errors in the editor
function highlightCodeErrors(code, errors) {
  clearCodeHighlights();

  const codeInput = document.getElementById("code-input");
  const editorContainer = document.getElementById("code-editor");

  // Create error overlay if it doesn't exist
  let errorOverlay = document.getElementById("error-overlay");
  if (!errorOverlay) {
    errorOverlay = document.createElement("div");
    errorOverlay.id = "error-overlay";
    errorOverlay.className = "error-overlay";
    editorContainer.appendChild(errorOverlay);
  }

  const lines = code.split("\n");
  const errorMarkers = [];

  errors.forEach((error) => {
    const issues = detectErrorLocation(code, error);
    issues.forEach((issue) => {
      errorMarkers.push({
        line: issue.line,
        column: issue.column,
        length: issue.length,
        message: issue.message,
      });
    });
  });

  // Display error markers
  displayErrorMarkers(errorMarkers, lines);
}

// Detect where in the code the error is
function detectErrorLocation(code, error) {
  const issues = [];
  const lines = code.split("\n");

  // Check for common HTML errors
  if (error.test.includes("<") && error.test.includes(">")) {
    const tagMatch = error.test.match(/<(\w+)>/);
    if (tagMatch) {
      const tag = tagMatch[1];

      // Find mismatched or missing tags
      lines.forEach((line, lineIndex) => {
        // Check for typos like <tb> instead of <td>
        const typoMatch = line.match(/<([a-z]+)>/gi);
        if (typoMatch) {
          typoMatch.forEach((typo) => {
            const cleanTypo = typo.toLowerCase().replace(/[<>]/g, "");
            const validTags = [
              "html",
              "head",
              "body",
              "title",
              "meta",
              "link",
              "script",
              "style",
              "div",
              "span",
              "p",
              "a",
              "img",
              "br",
              "hr",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "ul",
              "ol",
              "li",
              "dl",
              "dt",
              "dd",
              "table",
              "tr",
              "td",
              "th",
              "thead",
              "tbody",
              "tfoot",
              "form",
              "input",
              "textarea",
              "button",
              "select",
              "option",
              "label",
              "strong",
              "em",
              "b",
              "i",
              "u",
              "s",
              "code",
              "pre",
              "section",
              "article",
              "header",
              "footer",
              "nav",
              "aside",
              "main",
            ];

            if (!validTags.includes(cleanTypo)) {
              const col = line.indexOf(typo);
              issues.push({
                line: lineIndex,
                column: col,
                length: typo.length,
                message: `Invalid tag "${typo}"`,
              });
            }
          });
        }

        // Check for unclosed tags
        const openTags = (line.match(new RegExp(`<${tag}[\\s>]`, "gi")) || [])
          .length;
        const closeTags = (line.match(new RegExp(`</${tag}>`, "gi")) || [])
          .length;

        if (openTags > closeTags && line.includes(`<${tag}`)) {
          const col = line.lastIndexOf(`<${tag}`);
          issues.push({
            line: lineIndex,
            column: col,
            length: tag.length + 2,
            message: `Missing closing tag </${tag}>`,
          });
        }
      });
    }
  }

  // CSS errors - check for property/value issues
  if (error.test.includes(":")) {
    const propMatch = error.test.match(/([a-z-]+):\s*([^;]+)?/i);
    if (propMatch) {
      const property = propMatch[1].toLowerCase();
      const value = propMatch[2] ? propMatch[2].trim().toLowerCase() : null;

      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase();

        // Check if line has property but missing/wrong value
        if (lowerLine.includes(property)) {
          if (value && !lowerLine.includes(value)) {
            const col = line.toLowerCase().indexOf(property);
            issues.push({
              line: lineIndex,
              column: col,
              length: line.trim().length,
              message: `CSS property issue`,
            });
          }
          // Check for missing semicolon
          if (
            lowerLine.includes(property + ":") &&
            !line.trim().endsWith(";") &&
            !line.trim().endsWith("}")
          ) {
            const col = line.length - 1;
            issues.push({
              line: lineIndex,
              column: col,
              length: 1,
              message: `Missing semicolon`,
            });
          }
        }

        // Check for empty CSS blocks
        if (
          line.includes("{") &&
          !lowerLine.includes(":") &&
          !lowerLine.includes("}")
        ) {
          const col = line.indexOf("{");
          issues.push({
            line: lineIndex,
            column: col,
            length: 1,
            message: "Empty CSS block",
          });
        }
      });
    }
  }

  // JavaScript errors - variable declarations and methods
  const jsKeywordMatch = error.test.match(/\b(const|let|var|function)\b/i);
  if (jsKeywordMatch) {
    const keyword = jsKeywordMatch[1].toLowerCase();
    lines.forEach((line, lineIndex) => {
      const lowerLine = line.toLowerCase();

      // Check for incorrect variable syntax
      if (lowerLine.includes(keyword)) {
        // Check for missing assignment operator
        if (
          lowerLine.includes(keyword + " ") &&
          !line.includes("=") &&
          !line.includes("(")
        ) {
          const col = line.toLowerCase().indexOf(keyword);
          issues.push({
            line: lineIndex,
            column: col,
            length: keyword.length,
            message: `Incomplete ${keyword} declaration`,
          });
        }
      }
    });
  }

  // Check for JavaScript method errors
  const jsMethodMatch = error.test.match(
    /\b(document\.|console\.|querySelector|getElementById|addEventListener)\b/i
  );
  if (jsMethodMatch) {
    const method = jsMethodMatch[1].toLowerCase();
    lines.forEach((line, lineIndex) => {
      const lowerLine = line.toLowerCase();

      // Look for typos in common methods
      const commonTypos = {
        "document.": ["documet", "docment", "ducument"],
        queryselector: ["queryseletor", "querselector", "querselect"],
        getelementbyid: ["getelmentbyid", "getelemetbyid", "getelmntbyid"],
        addeventlistener: [
          "addeventlistner",
          "addventlistener",
          "addevenlistener",
        ],
      };

      Object.keys(commonTypos).forEach((correct) => {
        commonTypos[correct].forEach((typo) => {
          if (lowerLine.includes(typo)) {
            const col = lowerLine.indexOf(typo);
            issues.push({
              line: lineIndex,
              column: col,
              length: typo.length,
              message: `Possible typo`,
            });
          }
        });
      });
    });
  }

  // Check for attribute errors (for="", id="", etc.)
  const attrMatch = error.test.match(/([a-z-]+)="([^"]+)"/i);
  if (attrMatch) {
    const attrName = attrMatch[1].toLowerCase();
    const attrValue = attrMatch[2];

    lines.forEach((line, lineIndex) => {
      const lowerLine = line.toLowerCase();

      // Check if attribute exists but with wrong value
      if (lowerLine.includes(attrName + "=")) {
        const currentValueMatch = line.match(
          new RegExp(attrName + "\\s*=\\s*[\"']([^\"']+)[\"']", "i")
        );
        if (currentValueMatch && currentValueMatch[1] !== attrValue) {
          const col = line.toLowerCase().indexOf(attrName);
          issues.push({
            line: lineIndex,
            column: col,
            length: currentValueMatch[0].length,
            message: `Wrong ${attrName} value`,
          });
        }
      }
    });
  }

  // If no specific location found, highlight the general issue
  if (issues.length === 0 && error.details) {
    issues.push({
      line: 0,
      column: 0,
      length: 0,
      message: error.details || error.description,
    });
  }

  return issues;
}

// Display error markers in the editor
function displayErrorMarkers(markers, lines) {
  const codeInput = document.getElementById("code-input");
  const errorOverlay = document.getElementById("error-overlay");

  if (!errorOverlay) return;

  errorOverlay.innerHTML = "";

  // Calculate line height dynamically
  const computedStyle = window.getComputedStyle(codeInput);
  const lineHeight = parseInt(computedStyle.lineHeight) || 24;
  const paddingTop = parseInt(computedStyle.paddingTop) || 8;

  markers.forEach((marker) => {
    // Create line highlight background
    const lineHighlight = document.createElement("div");
    lineHighlight.className = "error-line-highlight";
    lineHighlight.style.cssText = `
      position: absolute;
      left: 0;
      top: ${marker.line * lineHeight + paddingTop}px;
      width: 100%;
      height: ${lineHeight}px;
      background: rgba(245, 101, 101, 0.15);
      border-left: 3px solid #f56565;
      pointer-events: none;
      z-index: 1;
    `;
    errorOverlay.appendChild(lineHighlight);

    // Create error dot marker
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-marker";
    errorDiv.textContent = "●";
    errorDiv.style.cssText = `
      position: absolute;
      left: 5px;
      top: ${marker.line * lineHeight + paddingTop}px;
      color: #f56565;
      cursor: pointer;
      font-size: 12px;
      z-index: 10;
    `;
    errorOverlay.appendChild(errorDiv);
  });

  // Highlight the problematic lines in the textarea
  codeInput.classList.add("has-errors");
}

// Clear code highlights
function clearCodeHighlights() {
  const codeInput = document.getElementById("code-input");
  const errorOverlay = document.getElementById("error-overlay");

  if (codeInput) {
    codeInput.classList.remove("has-errors");
  }

  if (errorOverlay) {
    errorOverlay.innerHTML = "";
  }
}

// Enhanced HTML validation using DOM parser
function validateHTML(code) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, "text/html");
    return doc;
  } catch (e) {
    return null;
  }
}

// Evaluate test with detailed error information
function evaluateTestWithDetails(code, test, challenge) {
  const passed = evaluateTest(code, test, challenge);
  let error = null;

  if (!passed) {
    error = `Failed: ${test}`;
  }

  return { passed, error };
}

// Evaluate a test
function evaluateTest(code, test, challenge) {
  // Normalize code - trim but preserve structure
  const cleanCode = code.trim();
  const lowerCode = cleanCode.toLowerCase();
  const lowerTest = test.toLowerCase();

  // Parse HTML for structural validation
  const doc = validateHTML(code);

  // Check if [tag] exists - validate proper HTML structure
  const checkIfMatch = test.match(/check if <(\w+)> exists/i);
  if (checkIfMatch) {
    const tag = checkIfMatch[1].toLowerCase();
    if (doc) {
      const elements = doc.querySelectorAll(tag);
      if (elements.length === 0) return false;

      // Verify tags are properly closed
      const openCount = (
        cleanCode.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []
      ).length;
      const closeCount = (cleanCode.match(new RegExp(`</${tag}>`, "gi")) || [])
        .length;

      const selfClosing = ["img", "input", "br", "hr", "meta", "link"];
      if (!selfClosing.includes(tag)) {
        return openCount === closeCount && openCount > 0;
      }
      return openCount > 0;
    }
    return false;
  }

  // Check for occurrence count (e.g., 'include "</p>" twice')
  const countMatch = test.match(
    /"([^"]+)"\s+(twice|three times|(\d+)\s+times)/i
  );
  if (countMatch) {
    const searchText = countMatch[1];
    const requiredCount =
      countMatch[2] === "twice"
        ? 2
        : countMatch[2] === "three times"
        ? 3
        : parseInt(countMatch[3]) || 2;

    // For closing tags, validate actual HTML structure
    if (searchText.startsWith("</")) {
      const tagName = searchText.match(/<\/(\w+)>/)?.[1];
      if (tagName && doc) {
        const elements = doc.querySelectorAll(tagName);
        return elements.length >= requiredCount;
      }
    }

    const occurrences = (
      cleanCode.match(
        new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
      ) || []
    ).length;
    return occurrences >= requiredCount;
  }

  // Check for complete HTML tags with proper validation
  const completeTagMatch = test.match(/<(\w+)>/);
  if (completeTagMatch) {
    const tag = completeTagMatch[1].toLowerCase();

    // Validate tag actually exists in parsed DOM
    if (doc) {
      const elements = doc.querySelectorAll(tag);
      if (elements.length === 0) return false;

      // Verify tags are properly closed
      const openCount = (
        cleanCode.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []
      ).length;
      const closeCount = (cleanCode.match(new RegExp(`</${tag}>`, "gi")) || [])
        .length;

      // Self-closing tags don't need closing tags
      const selfClosing = ["img", "input", "br", "hr", "meta", "link"];
      if (!selfClosing.includes(tag)) {
        return openCount === closeCount && openCount > 0;
      }
      return openCount > 0;
    }

    // Fallback to regex
    const tagRegex = new RegExp(`<${tag}(\\s+[^>]*)?>`, "i");
    return tagRegex.test(cleanCode);
  }

  // Check for incomplete tags like "<img" or "<input" (self-closing tags)
  const incompleteTagMatch = test.match(/^<(\w+)$/);
  if (incompleteTagMatch) {
    const tag = incompleteTagMatch[1].toLowerCase();
    if (doc) {
      const elements = doc.querySelectorAll(tag);
      return elements.length > 0;
    }
    const tagRegex = new RegExp(`<${tag}[\\s>]`, "i");
    return tagRegex.test(cleanCode);
  }

  // Check for attributes (e.g., 'Must have src attribute' or 'Include href')
  const attrMatch = test.match(
    /\b(href|src|alt|class|id|type|name|value|placeholder|action|method)\b/i
  );
  if (attrMatch && doc) {
    const attrName = attrMatch[1].toLowerCase();
    const elements = doc.querySelectorAll(`[${attrName}]`);
    return elements.length > 0;
  }

  // Check for specific text content with DOM validation
  if (lowerTest.includes("contain") || lowerTest.includes("include")) {
    const contentMatch = test.match(/"([^"]+)"/);
    if (contentMatch) {
      const searchText = contentMatch[1];

      // First check if text exists in actual rendered content
      if (doc && doc.body) {
        const bodyText = doc.body.textContent || "";
        if (bodyText.toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }
      }

      // Fallback to source code check
      return lowerCode.includes(searchText.toLowerCase());
    }
  }

  // Check for CSS properties with proper validation
  if (test.includes(":")) {
    const propMatch = test.match(/([a-z-]+):\s*([^;]+)?/i);
    if (propMatch) {
      const property = propMatch[1].toLowerCase();
      const value = propMatch[2] ? propMatch[2].trim().toLowerCase() : null;

      // Extract CSS from <style> tags or inline styles
      const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const inlineStyleMatch = code.match(/style="([^"]*)"/gi);

      let cssContent = "";
      if (styleMatch) cssContent += styleMatch[1];
      if (inlineStyleMatch) {
        inlineStyleMatch.forEach((match) => {
          const styleValue = match.match(/style="([^"]*)"/i);
          if (styleValue) cssContent += styleValue[1];
        });
      }

      // Check if property exists in CSS
      const hasProp = cssContent.toLowerCase().includes(property + ":");
      if (!value) return hasProp;

      // Check if property has the correct value
      const propRegex = new RegExp(
        property + "\\s*:\\s*" + value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      return propRegex.test(cssContent);
    }
  }

  // Check for attribute existence with specific values (e.g., 'for="email"', 'id="name"')
  if (test.includes("=") && test.includes('"')) {
    const attrMatch = test.match(/([a-z-]+)="([^"]+)"/i);
    if (attrMatch) {
      // Check for exact attribute match (case-insensitive for attribute name)
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = attrMatch[2];
      const attrRegex = new RegExp(
        `${attrName}\\s*=\\s*["']${attrValue}["']`,
        "i"
      );
      return attrRegex.test(cleanCode);
    }
  }

  // JavaScript validation
  // Check for variable declarations
  if (lowerTest.match(/\b(const|let|var)\b/)) {
    const varMatch = test.match(/\b(const|let|var)\b/i);
    if (varMatch) {
      const keyword = varMatch[1].toLowerCase();
      // Extract JavaScript from <script> tags
      const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      const jsContent = scriptMatch ? scriptMatch[1] : code;

      // Validate keyword is properly used
      const varRegex = new RegExp(
        "\\b" + keyword + "\\s+[a-zA-Z_$][a-zA-Z0-9_$]*\\s*=",
        "i"
      );
      return varRegex.test(jsContent);
    }
  }

  // Check for JavaScript methods/functions
  const jsMethodMatch = test.match(
    /\b(document\.|console\.|addEventListener|querySelector|getElementById|textContent|innerHTML|function)\b/i
  );
  if (jsMethodMatch) {
    const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const jsContent = scriptMatch ? scriptMatch[1] : code;
    return jsContent.toLowerCase().includes(jsMethodMatch[1].toLowerCase());
  }

  // Default: check if test string appears in code (case-insensitive)
  return lowerCode.includes(lowerTest);
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
let currentPlaygroundLanguage = "web";

function loadPlayground() {
  const saved = localStorage.getItem("codequest_playground");
  const savedLang =
    localStorage.getItem("codequest_playground_language") || "web";

  currentPlaygroundLanguage = savedLang;
  document.getElementById("playground-language").value = savedLang;

  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (currentPlaygroundLanguage === "web") {
        document.getElementById("playground-html").value = data.html || "";
        document.getElementById("playground-css").value = data.css || "";
        document.getElementById("playground-js").value = data.js || "";
      } else {
        document.getElementById("playground-single").value = data.code || "";
      }
    } catch (e) {
      console.error("Error loading playground:", e);
    }
  }

  // Setup auto-update for web mode
  ["playground-html", "playground-css", "playground-js"].forEach((id) => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.addEventListener("input", () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
          updatePlaygroundPreview();
          savePlayground();
        }, 1000);
      });
    }
  });

  // Setup auto-save for single mode
  const singleTextarea = document.getElementById("playground-single");
  if (singleTextarea) {
    singleTextarea.addEventListener("input", () => {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(savePlayground, 1000);
    });
  }

  switchPlaygroundLanguage();

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
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                table {
                    border-collapse: collapse;
                    border: 2px solid #333;
                }
                td, th {
                    border: 1px solid #666;
                    padding: 8px 12px;
                    text-align: left;
                }
                ${css}
            </style>
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

function switchPlaygroundLanguage() {
  const language = document.getElementById("playground-language").value;
  currentPlaygroundLanguage = language;
  localStorage.setItem("codequest_playground_language", language);

  const webMode = document.getElementById("playground-web-mode");
  const singleMode = document.getElementById("playground-single-mode");
  const icon = document.getElementById("single-editor-icon");
  const label = document.getElementById("single-editor-label");
  const infoText = document.getElementById("editor-info-text");

  if (language === "web") {
    webMode.style.display = "flex";
    singleMode.style.display = "none";
    updatePlaygroundPreview();
  } else {
    webMode.style.display = "none";
    singleMode.style.display = "flex";

    const languageConfig = {
      javascript: {
        icon: "fab fa-js",
        label: "JavaScript",
        info: "Write JavaScript code and click Run to see the output",
      },
      react: {
        icon: "fab fa-react",
        label: "React (JSX)",
        info: "Write React components using JSX syntax",
      },
      sql: {
        icon: "fas fa-database",
        label: "SQL",
        info: "Write SQL queries (simulated environment)",
      },
      python: {
        icon: "fab fa-python",
        label: "Python",
        info: "Python syntax highlighting (execution coming soon)",
      },
      typescript: {
        icon: "fas fa-code",
        label: "TypeScript",
        info: "TypeScript syntax highlighting (execution coming soon)",
      },
    };

    const config = languageConfig[language];
    icon.className = config.icon;
    label.textContent = config.label;
    infoText.textContent = config.info;
  }
}

function runPlaygroundCode() {
  const language = currentPlaygroundLanguage;

  if (language === "web") {
    updatePlaygroundPreview();
    showToast("Preview updated", "success");
    return;
  }

  const code = document.getElementById("playground-single").value;
  const output = document.getElementById("playground-output-content");

  if (!code.trim()) {
    output.innerHTML =
      '<div class="output-placeholder"><i class="fas fa-info-circle"></i><p>Write some code first!</p></div>';
    return;
  }

  output.innerHTML = "";

  if (language === "javascript") {
    try {
      // Capture console.log
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        );
      };

      // Execute code
      const result = eval(code);

      // Restore console.log
      console.log = originalLog;

      // Display logs
      if (logs.length > 0) {
        logs.forEach((log) => {
          const line = document.createElement("div");
          line.className = "output-line";
          line.textContent = log;
          output.appendChild(line);
        });
      }

      // Display result if any
      if (result !== undefined) {
        const resultLine = document.createElement("div");
        resultLine.className = "output-line output-success";
        resultLine.textContent = `=> ${
          typeof result === "object" ? JSON.stringify(result, null, 2) : result
        }`;
        output.appendChild(resultLine);
      }

      if (logs.length === 0 && result === undefined) {
        output.innerHTML =
          '<div class="output-info">Code executed successfully (no output)</div>';
      }

      showToast("Code executed successfully", "success");
    } catch (error) {
      const errorLine = document.createElement("div");
      errorLine.className = "output-line output-error";
      errorLine.textContent = `Error: ${error.message}`;
      output.appendChild(errorLine);
      showToast("Execution error", "error");
    }
  } else if (language === "sql") {
    output.innerHTML =
      "<div class=\"output-info\"><i class=\"fas fa-info-circle\"></i> SQL execution is simulated. Try:\n\nSELECT * FROM users;\nINSERT INTO users VALUES (1, 'John');\nUPDATE users SET name = 'Jane' WHERE id = 1;</div>";
  } else if (language === "react") {
    output.innerHTML =
      '<div class="output-info"><i class="fas fa-info-circle"></i> React JSX preview coming soon!\n\nFor now, you can write and save your React components here.</div>';
  } else {
    output.innerHTML = `<div class="output-info"><i class="fas fa-info-circle"></i> ${
      language.charAt(0).toUpperCase() + language.slice(1)
    } execution coming soon!\n\nYou can still write and save your code here.</div>`;
  }
}

function clearPlaygroundOutput() {
  const output = document.getElementById("playground-output-content");
  output.innerHTML =
    '<div class="output-placeholder"><i class="fas fa-info-circle"></i><p>Click "Run" to see the output</p></div>';
}

function savePlayground() {
  const data = {};

  if (currentPlaygroundLanguage === "web") {
    data.html = document.getElementById("playground-html").value;
    data.css = document.getElementById("playground-css").value;
    data.js = document.getElementById("playground-js").value;
  } else {
    data.code = document.getElementById("playground-single").value;
  }

  localStorage.setItem("codequest_playground", JSON.stringify(data));
}

function clearPlayground() {
  if (confirm("Clear all code in the playground?")) {
    if (currentPlaygroundLanguage === "web") {
      document.getElementById("playground-html").value = "";
      document.getElementById("playground-css").value = "";
      document.getElementById("playground-js").value = "";
      updatePlaygroundPreview();
    } else {
      document.getElementById("playground-single").value = "";
      clearPlaygroundOutput();
    }
    localStorage.removeItem("codequest_playground");
    showToast("Playground cleared", "info");
  }
}
