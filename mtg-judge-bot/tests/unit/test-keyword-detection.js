/**
 * Comprehensive test suite for keyword detection system
 * Tests that rules questions get proper explanations instead of card searches
 */

const KeywordDatabase = require("../../src/keywordDatabase");

// Test cases that MUST pass
const testCases = [
  // Original failing cases from user
  {
    question: "how does menace work?",
    expectedKeyword: "Menace",
    shouldFindKeyword: true,
    description:
      "Should explain menace keyword, not search for Bestial Menace card",
  },
  {
    question: "what happens when a creature with lifelink deals damage?",
    expectedKeyword: "Lifelink",
    shouldFindKeyword: true,
    description: "Should explain lifelink ability",
  },
  {
    question: "how does priority work?",
    expectedKeyword: "Priority",
    shouldFindKeyword: true,
    description: "Should explain priority system, not Priority Boarding card",
  },

  // Additional evergreen keywords
  {
    question: "explain flying",
    expectedKeyword: "Flying",
    shouldFindKeyword: true,
    description: "Should explain flying keyword",
  },
  {
    question: "what is first strike?",
    expectedKeyword: "First Strike",
    shouldFindKeyword: true,
    description: "Should explain first strike",
  },
  {
    question: "how does trample work?",
    expectedKeyword: "Trample",
    shouldFindKeyword: true,
    description: "Should explain trample",
  },
  {
    question: "what does deathtouch do?",
    expectedKeyword: "Deathtouch",
    shouldFindKeyword: true,
    description: "Should explain deathtouch",
  },
  {
    question: "explain vigilance",
    expectedKeyword: "Vigilance",
    shouldFindKeyword: true,
    description: "Should explain vigilance",
  },
  {
    question: "how does hexproof work?",
    expectedKeyword: "Hexproof",
    shouldFindKeyword: true,
    description: "Should explain hexproof",
  },
  {
    question: "what is indestructible?",
    expectedKeyword: "Indestructible",
    shouldFindKeyword: true,
    description: "Should explain indestructible",
  },
  {
    question: "how does ward work?",
    expectedKeyword: "Ward",
    shouldFindKeyword: true,
    description: "Should explain ward",
  },

  // Game concepts
  {
    question: "explain the stack",
    expectedKeyword: "The Stack",
    shouldFindKeyword: true,
    description: "Should explain the stack",
  },
  {
    question: "how does the stack work?",
    expectedKeyword: "The Stack",
    shouldFindKeyword: true,
    description: "Should explain the stack",
  },
  {
    question: "what is summoning sickness?",
    expectedKeyword: "Summoning Sickness",
    shouldFindKeyword: true,
    description: "Should explain summoning sickness",
  },
  {
    question: "explain the legend rule",
    expectedKeyword: "Legend Rule",
    shouldFindKeyword: true,
    description: "Should explain legend rule",
  },

  // Zones
  {
    question: "what is the graveyard?",
    expectedKeyword: "Graveyard",
    shouldFindKeyword: true,
    description: "Should explain graveyard zone",
  },
  {
    question: "how does exile work?",
    expectedKeyword: "Exile Zone",
    shouldFindKeyword: true,
    description: "Should explain exile zone",
  },
  {
    question: "what is the battlefield?",
    expectedKeyword: "Battlefield",
    shouldFindKeyword: true,
    description: "Should explain battlefield",
  },

  // Actions
  {
    question: "what does it mean to sacrifice?",
    expectedKeyword: "Sacrifice",
    shouldFindKeyword: true,
    description: "Should explain sacrifice action",
  },
  {
    question: "how does destroy work?",
    expectedKeyword: "Destroy",
    shouldFindKeyword: true,
    description: "Should explain destroy action",
  },
  {
    question: "what happens when you counter a spell?",
    expectedKeyword: "Counter",
    shouldFindKeyword: true,
    description: "Should explain counter action",
  },
  {
    question: "how does scry work?",
    expectedKeyword: "Scry",
    shouldFindKeyword: true,
    description: "Should explain scry",
  },
  {
    question: "what does mill mean?",
    expectedKeyword: "Mill",
    shouldFindKeyword: true,
    description: "Should explain mill",
  },

  // Card types
  {
    question: "what is a planeswalker?",
    expectedKeyword: "Planeswalker",
    shouldFindKeyword: true,
    description: "Should explain planeswalker card type",
  },
  {
    question: "how do instants work?",
    expectedKeyword: "Instant",
    shouldFindKeyword: true,
    description: "Should explain instant card type",
  },
  {
    question: "what is the difference between instant and sorcery?",
    expectedKeyword: "Sorcery",
    shouldFindKeyword: true,
    description: "Should explain sorcery timing",
  },

  // Combat and phases
  {
    question: "explain the combat phase",
    expectedKeyword: "Combat Phase",
    shouldFindKeyword: true,
    description: "Should explain combat phase",
  },
  {
    question: "what is the main phase?",
    expectedKeyword: "Main Phase",
    shouldFindKeyword: true,
    description: "Should explain main phase",
  },
  {
    question: "how does upkeep work?",
    expectedKeyword: "Upkeep Step",
    shouldFindKeyword: true,
    description: "Should explain upkeep step",
  },

  // Edge cases - should NOT find keywords
  {
    question: "Lightning Bolt",
    expectedKeyword: null,
    shouldFindKeyword: false,
    description: "Just a card name, no keyword",
  },
  {
    question: "Counterspell",
    expectedKeyword: null,
    shouldFindKeyword: false,
    description: "Card name without 'how does' or 'what is'",
  },
  {
    question: "play Black Lotus",
    expectedKeyword: null,
    shouldFindKeyword: false,
    description: "Not asking about a keyword",
  },
];

// Color codes for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Run all tests
function runTests() {
  console.log(
    colors.cyan + "========================================" + colors.reset
  );
  console.log(colors.cyan + "🧪 KEYWORD DETECTION TEST SUITE" + colors.reset);
  console.log(
    colors.cyan + "========================================" + colors.reset
  );
  console.log();

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const test of testCases) {
    const result = KeywordDatabase.detectKeyword(test.question);

    if (test.shouldFindKeyword) {
      // Should find a keyword
      if (result && result.name === test.expectedKeyword) {
        console.log(colors.green + "✅ PASS:" + colors.reset, test.description);
        console.log(`   Question: "${test.question}"`);
        console.log(`   Found: ${result.name}`);
        passed++;
      } else {
        console.log(colors.red + "❌ FAIL:" + colors.reset, test.description);
        console.log(`   Question: "${test.question}"`);
        console.log(`   Expected: ${test.expectedKeyword}`);
        console.log(`   Got: ${result ? result.name : "null"}`);
        failed++;
        failures.push({
          question: test.question,
          expected: test.expectedKeyword,
          got: result ? result.name : "null",
        });
      }
    } else {
      // Should NOT find a keyword
      if (!result) {
        console.log(colors.green + "✅ PASS:" + colors.reset, test.description);
        console.log(`   Question: "${test.question}"`);
        console.log(`   Correctly returned null`);
        passed++;
      } else {
        console.log(colors.red + "❌ FAIL:" + colors.reset, test.description);
        console.log(`   Question: "${test.question}"`);
        console.log(`   Should not find keyword but found: ${result.name}`);
        failed++;
        failures.push({
          question: test.question,
          expected: "null",
          got: result.name,
        });
      }
    }
    console.log();
  }

  // Print summary
  console.log(
    colors.cyan + "========================================" + colors.reset
  );
  console.log(colors.cyan + "📊 TEST RESULTS SUMMARY" + colors.reset);
  console.log(
    colors.cyan + "========================================" + colors.reset
  );
  console.log(colors.green + `✅ Passed: ${passed}` + colors.reset);
  console.log(colors.red + `❌ Failed: ${failed}` + colors.reset);

  const total = passed + failed;
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  console.log(`\n📈 Success Rate: ${successRate}%`);

  if (failed > 0) {
    console.log(colors.red + "\n⚠️ FAILURES:" + colors.reset);
    for (const failure of failures) {
      console.log(`  • "${failure.question}"`);
      console.log(`    Expected: ${failure.expected}, Got: ${failure.got}`);
    }
  }

  // Test specific keyword data
  console.log(
    colors.cyan + "\n========================================" + colors.reset
  );
  console.log(colors.cyan + "🔍 TESTING SPECIFIC KEYWORDS" + colors.reset);
  console.log(
    colors.cyan + "========================================" + colors.reset
  );

  // Test menace specifically
  const menaceResult = KeywordDatabase.detectKeyword("how does menace work?");
  if (menaceResult) {
    console.log(colors.green + "\n✅ Menace keyword data:" + colors.reset);
    console.log(`  Name: ${menaceResult.name}`);
    console.log(`  Type: ${menaceResult.type}`);
    console.log(
      `  Description: ${menaceResult.description.substring(0, 100)}...`
    );
    console.log(`  Rule: ${menaceResult.rule}`);
    console.log(`  Example: ${menaceResult.example}`);
  }

  // Test priority specifically
  const priorityResult = KeywordDatabase.detectKeyword(
    "how does priority work?"
  );
  if (priorityResult) {
    console.log(colors.green + "\n✅ Priority concept data:" + colors.reset);
    console.log(`  Name: ${priorityResult.name}`);
    console.log(`  Type: ${priorityResult.type}`);
    console.log(
      `  Description: ${priorityResult.description.substring(0, 100)}...`
    );
    console.log(`  Rule: ${priorityResult.rule}`);
  }

  // Test lifelink specifically
  const lifelinkResult = KeywordDatabase.detectKeyword(
    "what happens when a creature with lifelink deals damage?"
  );
  if (lifelinkResult) {
    console.log(colors.green + "\n✅ Lifelink keyword data:" + colors.reset);
    console.log(`  Name: ${lifelinkResult.name}`);
    console.log(`  Type: ${lifelinkResult.type}`);
    console.log(
      `  Description: ${lifelinkResult.description.substring(0, 100)}...`
    );
    console.log(`  Rule: ${lifelinkResult.rule}`);
  }

  // Final result
  console.log(
    colors.cyan + "\n========================================" + colors.reset
  );
  if (failed === 0) {
    console.log(colors.green + "🎉 ALL TESTS PASSED!" + colors.reset);
    console.log(
      colors.green +
        "The keyword detection system is working perfectly!" +
        colors.reset
    );
    console.log(
      colors.green +
        "Rules questions will now get proper explanations instead of card searches." +
        colors.reset
    );
    process.exit(0);
  } else {
    console.log(
      colors.red +
        "⚠️ Some tests failed. Please review the failures above." +
        colors.reset
    );
    process.exit(1);
  }
}

// Run the tests
runTests();
