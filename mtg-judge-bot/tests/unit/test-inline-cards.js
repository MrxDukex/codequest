/**
 * Test suite for inline card detection feature
 * Tests the {card name} syntax for automatic card lookups
 */

const InlineCardDetector = require("../../src/inlineCardDetector");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

// Test cases
const testCases = [
  // Basic card detection
  {
    message: "My favorite card is {Sol Ring} in commander",
    expectedCards: ["Sol Ring"],
    expectedCount: 1,
    description: "Single card detection",
  },
  {
    message: "I love {Lightning Bolt} and {Counterspell} in my deck",
    expectedCards: ["Lightning Bolt", "Counterspell"],
    expectedCount: 2,
    description: "Multiple cards detection",
  },
  {
    message: "{Birds of Paradise} is great with {Noble Hierarch}",
    expectedCards: ["Birds of Paradise", "Noble Hierarch"],
    expectedCount: 2,
    description: "Cards at start of message",
  },

  // Set-specific cards
  {
    message: "I need {Sol Ring|C21} for my deck",
    expectedCards: ["Sol Ring"],
    expectedSets: ["C21"],
    expectedCount: 1,
    description: "Card with set code",
  },
  {
    message: "Looking for {Lightning Bolt|2ED} and {Counterspell|LEA}",
    expectedCards: ["Lightning Bolt", "Counterspell"],
    expectedSets: ["2ED", "LEA"],
    expectedCount: 2,
    description: "Multiple cards with set codes",
  },

  // Edge cases
  {
    message: "The card {The Ur-Dragon} is my commander",
    expectedCards: ["The Ur-Dragon"],
    expectedCount: 1,
    description: "Card with 'The' prefix",
  },
  {
    message: "{Swords to Plowshares} and {Path to Exile} are removal",
    expectedCards: ["Swords to Plowshares", "Path to Exile"],
    expectedCount: 2,
    description: "Cards with 'to' in name",
  },
  {
    message: "I play {} in my deck",
    expectedCards: [],
    expectedCount: 0,
    description: "Empty braces",
  },
  {
    message: "No cards here",
    expectedCards: [],
    expectedCount: 0,
    description: "No braces at all",
  },

  // Duplicate handling
  {
    message: "{Sol Ring} is great and {Sol Ring} is cheap",
    expectedCards: ["Sol Ring"],
    expectedCount: 1,
    description: "Duplicate card mentioned twice",
  },
  {
    message: "{Sol Ring|C21} and {Sol Ring|C20} versions",
    expectedCards: ["Sol Ring", "Sol Ring"],
    expectedSets: ["C21", "C20"],
    expectedCount: 2,
    description: "Same card different sets",
  },

  // Complex messages
  {
    message:
      "My deck has {Sol Ring}, {Mana Crypt}, {Mana Vault}, {Chrome Mox}, and {Lotus Petal}",
    expectedCards: [
      "Sol Ring",
      "Mana Crypt",
      "Mana Vault",
      "Chrome Mox",
      "Lotus Petal",
    ],
    expectedCount: 5,
    description: "Maximum 5 cards",
  },
  {
    message: "Too many: {Card1}, {Card2}, {Card3}, {Card4}, {Card5}, {Card6}",
    expectedCards: ["Card1", "Card2", "Card3", "Card4", "Card5"],
    expectedCount: 5,
    exceedsLimit: true,
    description: "More than 5 cards (should be limited)",
  },

  // Special characters
  {
    message: "{Jace, the Mind Sculptor} is powerful",
    expectedCards: ["Jace, the Mind Sculptor"],
    expectedCount: 1,
    description: "Card with comma",
  },
  {
    message: "{Nicol Bolas, Dragon-God} is my favorite",
    expectedCards: ["Nicol Bolas, Dragon-God"],
    expectedCount: 1,
    description: "Card with hyphen",
  },
  {
    message: "{Urza's Saga} creates constructs",
    expectedCards: ["Urza's Saga"],
    expectedCount: 1,
    description: "Card with apostrophe",
  },
];

// Run tests
console.log("========================================");
console.log("🃏 INLINE CARD DETECTION TEST SUITE");
console.log("========================================");
console.log(`Testing ${testCases.length} scenarios`);
console.log("========================================\n");

let passed = 0;
let failed = 0;
const failedTests = [];

for (const testCase of testCases) {
  console.log(`📝 ${testCase.description}`);
  console.log(`   Message: "${testCase.message}"`);

  // Parse the message
  const result = InlineCardDetector.parseMessage(testCase.message);

  // Check card count
  let countCorrect = result.cardCount === testCase.expectedCount;
  if (countCorrect) {
    console.log(`   ${GREEN}✅ Card count: ${result.cardCount}${RESET}`);
  } else {
    console.log(
      `   ${RED}❌ Card count: ${result.cardCount} (expected ${testCase.expectedCount})${RESET}`
    );
  }

  // Check card names
  let namesCorrect = true;
  if (testCase.expectedCards && testCase.expectedCards.length > 0) {
    const foundNames = result.cards.map((c) => c.name);
    for (const expectedCard of testCase.expectedCards) {
      if (!foundNames.includes(expectedCard)) {
        namesCorrect = false;
        console.log(`   ${RED}❌ Missing card: ${expectedCard}${RESET}`);
      }
    }

    if (namesCorrect) {
      console.log(`   ${GREEN}✅ All cards detected correctly${RESET}`);
    }
  }

  // Check set codes if applicable
  let setsCorrect = true;
  if (testCase.expectedSets) {
    const foundSets = result.cards.map((c) => c.set).filter((s) => s !== null);
    for (let i = 0; i < testCase.expectedSets.length; i++) {
      if (foundSets[i] !== testCase.expectedSets[i]) {
        setsCorrect = false;
        console.log(
          `   ${RED}❌ Wrong set: ${foundSets[i]} (expected ${testCase.expectedSets[i]})${RESET}`
        );
      }
    }

    if (setsCorrect && testCase.expectedSets.length > 0) {
      console.log(`   ${GREEN}✅ Set codes correct${RESET}`);
    }
  }

  // Check limit exceeded flag
  if (testCase.exceedsLimit !== undefined) {
    if (result.exceedsLimit === testCase.exceedsLimit) {
      console.log(`   ${GREEN}✅ Limit check correct${RESET}`);
    } else {
      console.log(`   ${RED}❌ Limit check wrong${RESET}`);
      namesCorrect = false;
    }
  }

  // Overall test result
  if (countCorrect && namesCorrect && setsCorrect) {
    passed++;
    console.log(`   ${GREEN}✅ PASS${RESET}\n`);
  } else {
    failed++;
    failedTests.push(testCase.description);
    console.log(`   ${RED}❌ FAIL${RESET}\n`);
  }
}

// Test helper functions
console.log("========================================");
console.log("Testing helper functions...");
console.log("========================================\n");

// Test hasCardReferences
const hasRefsTests = [
  { message: "{Sol Ring}", expected: true },
  { message: "No cards here", expected: false },
  { message: "I love {Lightning Bolt}!", expected: true },
  { message: "{}", expected: true }, // Has braces even if empty
];

let helpersPassed = 0;
let helpersFailed = 0;

for (const test of hasRefsTests) {
  const result = InlineCardDetector.hasCardReferences(test.message);
  if (result === test.expected) {
    console.log(`✅ hasCardReferences("${test.message}") = ${result}`);
    helpersPassed++;
  } else {
    console.log(
      `❌ hasCardReferences("${test.message}") = ${result} (expected ${test.expected})`
    );
    helpersFailed++;
  }
}

// Test cleanCardName
console.log("\nTesting cleanCardName...");
const cleanTests = [
  { input: "  Sol Ring  ", expected: "Sol Ring" },
  { input: "Lightning  Bolt", expected: "Lightning Bolt" },
  { input: "Jace's  Sanctum", expected: "Jace's Sanctum" },
];

for (const test of cleanTests) {
  const result = InlineCardDetector.cleanCardName(test.input);
  if (result === test.expected) {
    console.log(`✅ cleanCardName("${test.input}") = "${result}"`);
    helpersPassed++;
  } else {
    console.log(
      `❌ cleanCardName("${test.input}") = "${result}" (expected "${test.expected}")`
    );
    helpersFailed++;
  }
}

// Print summary
console.log("\n========================================");
console.log("📊 TEST RESULTS SUMMARY");
console.log("========================================");
console.log(
  `${GREEN}✅ Main Tests Passed: ${passed}/${testCases.length}${RESET}`
);
console.log(
  `${RED}❌ Main Tests Failed: ${failed}/${testCases.length}${RESET}`
);
console.log(
  `📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
);

console.log(`\n${GREEN}✅ Helper Tests Passed: ${helpersPassed}${RESET}`);
console.log(`${RED}❌ Helper Tests Failed: ${helpersFailed}${RESET}`);

if (failedTests.length > 0) {
  console.log(`\n${RED}Failed Tests:${RESET}`);
  failedTests.forEach((test) => console.log(`  - ${test}`));
}

// Overall result
const totalTests = testCases.length + helpersPassed + helpersFailed;
const totalPassed = passed + helpersPassed;
const overallSuccessRate = (totalPassed / totalTests) * 100;

console.log("\n========================================");
if (overallSuccessRate === 100) {
  console.log(
    `${GREEN}🎉 ALL TESTS PASSED! Inline card detection working perfectly.${RESET}`
  );
} else if (overallSuccessRate >= 90) {
  console.log(
    `${YELLOW}⚠️ MOSTLY PASSING (${overallSuccessRate.toFixed(1)}%)${RESET}`
  );
} else {
  console.log(
    `${RED}❌ TESTS FAILING (${overallSuccessRate.toFixed(1)}%)${RESET}`
  );
}

// Exit with appropriate code
process.exit(failed + helpersFailed > 0 ? 1 : 0);
