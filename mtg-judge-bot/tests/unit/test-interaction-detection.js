/**
 * Comprehensive test suite for interaction detection
 * Tests that the bot correctly identifies and answers interaction questions
 */

const InteractionDatabase = require("../../src/interactionDatabase");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// Test cases for interaction detection
const testCases = [
  // Doubling Season + Planeswalkers
  {
    question: "how does doubling season work with planeswalkers?",
    expectedInteraction: "doubling season + planeswalker",
    shouldDetect: true,
  },
  {
    question: "!judge how does doubling season work with planeswalkers?",
    expectedInteraction: "doubling season + planeswalker",
    shouldDetect: true,
  },
  {
    question: "does doubling season double loyalty counters?",
    expectedInteraction: "doubling season + planeswalker",
    shouldDetect: true,
  },
  {
    question: "planeswalker with doubling season",
    expectedInteraction: "doubling season + planeswalker",
    shouldDetect: true,
  },

  // Deathtouch + Trample
  {
    question: "how does deathtouch work with trample?",
    expectedInteraction: "deathtouch + trample",
    shouldDetect: true,
  },
  {
    question: "creature with deathtouch and trample",
    expectedInteraction: "deathtouch + trample",
    shouldDetect: true,
  },
  {
    question: "what happens when a creature has both trample and deathtouch?",
    expectedInteraction: "deathtouch + trample",
    shouldDetect: true,
  },

  // Lifelink + Double Strike
  {
    question: "how does lifelink work with double strike?",
    expectedInteraction: "lifelink + double strike",
    shouldDetect: true,
  },
  {
    question: "creature with double strike and lifelink",
    expectedInteraction: "lifelink + double strike",
    shouldDetect: true,
  },
  {
    question: "do I gain life twice with lifelink and double strike?",
    expectedInteraction: "lifelink + double strike",
    shouldDetect: true,
  },

  // Protection vs Board Wipes
  {
    question: "does protection save from wrath of god?",
    expectedInteraction: "protection + board wipe",
    shouldDetect: true,
  },
  {
    question: "protection from white vs board wipe",
    expectedInteraction: "protection + board wipe",
    shouldDetect: true,
  },
  {
    question: "does protection stop destroy all creatures?",
    expectedInteraction: "protection + board wipe",
    shouldDetect: true,
  },

  // Hexproof vs Board Wipes
  {
    question: "does hexproof protect from board wipes?",
    expectedInteraction: "hexproof + board wipe",
    shouldDetect: true,
  },
  {
    question: "hexproof creature vs wrath of god",
    expectedInteraction: "hexproof + board wipe",
    shouldDetect: true,
  },
  {
    question: "can destroy all kill hexproof creatures?",
    expectedInteraction: "hexproof + board wipe",
    shouldDetect: true,
  },

  // Indestructible vs -X/-X
  {
    question: "does -5/-5 kill an indestructible creature?",
    expectedInteraction: "indestructible + minus",
    shouldDetect: true,
  },
  {
    question: "indestructible with zero toughness",
    expectedInteraction: "indestructible + minus",
    shouldDetect: true,
  },
  {
    question: "can minus effects kill indestructible?",
    expectedInteraction: "indestructible + minus",
    shouldDetect: true,
  },

  // First Strike + Deathtouch
  {
    question: "how does first strike work with deathtouch?",
    expectedInteraction: "first strike + deathtouch",
    shouldDetect: true,
  },
  {
    question: "creature with deathtouch and first strike",
    expectedInteraction: "first strike + deathtouch",
    shouldDetect: true,
  },

  // Multiple Combat Phases
  {
    question: "how do additional combat phases work?",
    expectedInteraction: "multiple combat",
    shouldDetect: true,
  },
  {
    question: "extra combat phase rules",
    expectedInteraction: "multiple combat",
    shouldDetect: true,
  },
  {
    question: "two combat phases in one turn",
    expectedInteraction: "multiple combat",
    shouldDetect: true,
  },

  // Legendary Rule
  {
    question: "what happens when I copy a legendary creature?",
    expectedInteraction: "legendary + copy",
    shouldDetect: true,
  },
  {
    question: "clone on legendary creature",
    expectedInteraction: "legendary + copy",
    shouldDetect: true,
  },
  {
    question: "two same legendary permanents",
    expectedInteraction: "legendary + copy",
    shouldDetect: true,
  },

  // Token Doubling
  {
    question: "how do multiple parallel lives work?",
    expectedInteraction: "token doubling",
    shouldDetect: true,
  },
  {
    question: "doubling season with tokens",
    expectedInteraction: "token doubling",
    shouldDetect: true,
  },
  {
    question: "anointed procession stacking",
    expectedInteraction: "token doubling",
    shouldDetect: true,
  },

  // Non-interaction questions (should NOT detect)
  {
    question: "what is menace?",
    expectedInteraction: null,
    shouldDetect: false,
  },
  {
    question: "how does flying work?",
    expectedInteraction: null,
    shouldDetect: false,
  },
  {
    question: "explain the stack",
    expectedInteraction: null,
    shouldDetect: false,
  },
  {
    question: "what is a planeswalker?",
    expectedInteraction: null,
    shouldDetect: false,
  },
];

// Run tests
console.log("========================================");
console.log("🧪 INTERACTION DETECTION TEST SUITE");
console.log("========================================");
console.log(`Testing ${testCases.length} interaction questions`);
console.log("========================================\n");

let passed = 0;
let failed = 0;
const failedTests = [];

for (const testCase of testCases) {
  const { question, expectedInteraction, shouldDetect } = testCase;

  console.log(`Testing: "${question}"`);

  // Detect interaction
  const detectedInteraction = InteractionDatabase.detectInteraction(question);

  // Check if detection matches expectation
  let testPassed = false;

  if (shouldDetect) {
    // Should detect an interaction
    if (
      detectedInteraction &&
      detectedInteraction.type === expectedInteraction
    ) {
      console.log(
        `  ${GREEN}✅ Correctly detected: ${expectedInteraction}${RESET}`
      );

      // Verify the answer contains key information
      const answer =
        InteractionDatabase.formatInteractionAnswer(detectedInteraction);

      // Check for key components in the answer
      const hasTitle = answer.includes(detectedInteraction.title);
      const hasDescription = answer.includes(detectedInteraction.description);
      const hasRules =
        !detectedInteraction.rules || answer.includes("Relevant Rules:");

      if (hasTitle && hasDescription && hasRules) {
        console.log(`  ${GREEN}✅ Answer properly formatted${RESET}`);
        testPassed = true;
      } else {
        console.log(`  ${RED}❌ Answer missing components${RESET}`);
        if (!hasTitle) console.log(`    Missing title`);
        if (!hasDescription) console.log(`    Missing description`);
        if (!hasRules) console.log(`    Missing rules`);
      }
    } else if (detectedInteraction) {
      console.log(
        `  ${RED}❌ Wrong interaction detected: ${detectedInteraction.type}${RESET}`
      );
      console.log(`     Expected: ${expectedInteraction}`);
    } else {
      console.log(
        `  ${RED}❌ No interaction detected (expected: ${expectedInteraction})${RESET}`
      );
    }
  } else {
    // Should NOT detect an interaction
    if (!detectedInteraction) {
      console.log(`  ${GREEN}✅ Correctly did not detect interaction${RESET}`);
      testPassed = true;
    } else {
      console.log(
        `  ${RED}❌ Incorrectly detected: ${detectedInteraction.type}${RESET}`
      );
    }
  }

  if (testPassed) {
    passed++;
    console.log(`  ${GREEN}✅ PASS${RESET}\n`);
  } else {
    failed++;
    failedTests.push(question);
    console.log(`  ${RED}❌ FAIL${RESET}\n`);
  }
}

// Test the isInteractionQuestion helper
console.log("========================================");
console.log("Testing isInteractionQuestion helper...");
console.log("========================================\n");

const interactionPatterns = [
  { question: "how does X work with Y?", shouldMatch: true },
  { question: "what happens when X and Y interact?", shouldMatch: true },
  { question: "X + Y combo", shouldMatch: true },
  { question: "synergy between X and Y", shouldMatch: true },
  { question: "what is menace?", shouldMatch: false },
  { question: "explain flying", shouldMatch: false },
];

let helperPassed = 0;
let helperFailed = 0;

for (const pattern of interactionPatterns) {
  const isInteraction = InteractionDatabase.isInteractionQuestion(
    pattern.question
  );
  const expected = pattern.shouldMatch;

  if (isInteraction === expected) {
    console.log(
      `  ${GREEN}✅ "${pattern.question}" - Correctly identified as ${
        expected ? "interaction" : "non-interaction"
      }${RESET}`
    );
    helperPassed++;
  } else {
    console.log(
      `  ${RED}❌ "${pattern.question}" - Expected ${expected}, got ${isInteraction}${RESET}`
    );
    helperFailed++;
  }
}

// Print summary
console.log("\n========================================");
console.log("📊 TEST RESULTS SUMMARY");
console.log("========================================");
console.log(`${GREEN}✅ Passed: ${passed}${RESET}`);
console.log(`${RED}❌ Failed: ${failed}${RESET}`);
console.log(
  `📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
);

console.log(`\n${BLUE}Helper Function Tests:${RESET}`);
console.log(`${GREEN}✅ Passed: ${helperPassed}${RESET}`);
console.log(`${RED}❌ Failed: ${helperFailed}${RESET}`);

if (failedTests.length > 0) {
  console.log(`\n${RED}Failed Questions:${RESET}`);
  failedTests.forEach((q) => console.log(`  - ${q}`));
}

// Overall result
const totalTests = testCases.length + interactionPatterns.length;
const totalPassed = passed + helperPassed;
const overallSuccessRate = (totalPassed / totalTests) * 100;

console.log("\n========================================");
if (overallSuccessRate === 100) {
  console.log(
    `${GREEN}🎉 ALL TESTS PASSED! Interaction detection working perfectly.${RESET}`
  );
} else if (overallSuccessRate >= 90) {
  console.log(
    `${YELLOW}⚠️ MOSTLY PASSING (${overallSuccessRate.toFixed(
      1
    )}%) - Minor issues to fix${RESET}`
  );
} else {
  console.log(
    `${RED}❌ TESTS FAILING (${overallSuccessRate.toFixed(
      1
    )}%) - Significant issues detected${RESET}`
  );
}

// Exit with appropriate code
process.exit(failed + helperFailed > 0 ? 1 : 0);
