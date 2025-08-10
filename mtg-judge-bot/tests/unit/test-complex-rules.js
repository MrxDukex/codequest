/**
 * Comprehensive test suite for complex rules handling
 * Tests that the bot correctly answers complex MTG rules questions
 */

const ComplexRulesDatabase = require("../../src/complexRulesDatabase");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// Test cases for complex rules
const testCases = [
  // Damage Assignment with Multiple Blockers
  {
    question: "how does damage assignment work with multiple blockers?",
    expectedTopic: "damage_assignment_blockers",
    shouldDetect: true,
    keyPhrases: ["damage assignment order", "lethal damage", "509.2"],
  },
  {
    question: "!judge how does damage work with multiple blockers?",
    expectedTopic: "damage_assignment_blockers",
    shouldDetect: true,
    keyPhrases: ["declare blockers step", "must assign"],
  },
  {
    question: "my creature is blocked by multiple creatures",
    expectedTopic: "damage_assignment_blockers",
    shouldDetect: true,
    keyPhrases: ["order", "lethal"],
  },

  // APNAP Order
  {
    question: "what is APNAP order?",
    expectedTopic: "apnap_order",
    shouldDetect: true,
    keyPhrases: ["Active Player", "Non-Active Player", "101.4"],
  },
  {
    question: "!judge what is apnap?",
    expectedTopic: "apnap_order",
    shouldDetect: true,
    keyPhrases: ["whose turn it is", "stack"],
  },
  {
    question: "triggers at the same time",
    expectedTopic: "apnap_order",
    shouldDetect: true,
    keyPhrases: ["APNAP", "simultaneously"],
  },

  // Layers System
  {
    question: "how do layers work in magic?",
    expectedTopic: "layers",
    shouldDetect: true,
    keyPhrases: ["7 layers", "613", "continuous effects"],
  },
  {
    question: "!judge how do layers work?",
    expectedTopic: "layers",
    shouldDetect: true,
    keyPhrases: ["Copy effects", "Control-changing", "Power/Toughness"],
  },
  {
    question: "what is the layer system?",
    expectedTopic: "layers",
    shouldDetect: true,
    keyPhrases: ["timestamp", "613"],
  },
  {
    question: "explain layers",
    expectedTopic: "layers",
    shouldDetect: true,
    keyPhrases: ["continuous effects", "applied"],
  },

  // Priority System
  {
    question: "how does priority work?",
    expectedTopic: "priority",
    shouldDetect: true,
    keyPhrases: ["117", "cast spells", "active player"],
  },
  {
    question: "what is priority in magic?",
    expectedTopic: "priority",
    shouldDetect: true,
    keyPhrases: ["who can cast", "pass priority"],
  },
  {
    question: "holding priority",
    expectedTopic: "priority",
    shouldDetect: true,
    keyPhrases: ["hold priority", "multiple spells"],
  },

  // The Stack
  {
    question: "how does the stack work?",
    expectedTopic: "stack",
    shouldDetect: true,
    keyPhrases: ["Last In, First Out", "LIFO", "405"],
  },
  {
    question: "what is the stack?",
    expectedTopic: "stack",
    shouldDetect: true,
    keyPhrases: ["zone", "spells and abilities", "resolve"],
  },
  {
    question: "stack resolution",
    expectedTopic: "stack",
    shouldDetect: true,
    keyPhrases: ["top to bottom", "one at a time"],
  },

  // State-Based Actions
  {
    question: "what are state based actions?",
    expectedTopic: "state_based_actions",
    shouldDetect: true,
    keyPhrases: ["704", "automatically", "SBAs"],
  },
  {
    question: "when does a creature die to 0 toughness?",
    expectedTopic: "state_based_actions",
    shouldDetect: true,
    keyPhrases: ["state-based", "0 or less toughness"],
  },
  {
    question: "legend rule",
    expectedTopic: "state_based_actions",
    shouldDetect: true,
    keyPhrases: ["legendary", "choose one"],
  },

  // Combat Phases
  {
    question: "what are the combat phases?",
    expectedTopic: "combat_phases",
    shouldDetect: true,
    keyPhrases: ["five steps", "Beginning of Combat", "Declare Attackers"],
  },
  {
    question: "combat steps in order",
    expectedTopic: "combat_phases",
    shouldDetect: true,
    keyPhrases: ["506", "508", "509", "510", "511"],
  },
  {
    question: "declare blockers step",
    expectedTopic: "combat_phases",
    shouldDetect: true,
    keyPhrases: ["509", "blocking", "order blockers"],
  },

  // Replacement Effects
  {
    question: "what are replacement effects?",
    expectedTopic: "replacement_effects",
    shouldDetect: true,
    keyPhrases: ["614", "instead", "modify"],
  },
  {
    question: "if would instead",
    expectedTopic: "replacement_effects",
    shouldDetect: true,
    keyPhrases: ["replacement", "before it happens"],
  },
  {
    question: "enters the battlefield with counters",
    expectedTopic: "replacement_effects",
    shouldDetect: true,
    keyPhrases: ["replacement effect", "as"],
  },

  // Non-complex questions (should NOT detect)
  {
    question: "what is flying?",
    expectedTopic: null,
    shouldDetect: false,
    keyPhrases: [],
  },
  {
    question: "how does menace work?",
    expectedTopic: null,
    shouldDetect: false,
    keyPhrases: [],
  },
  {
    question: "explain trample",
    expectedTopic: null,
    shouldDetect: false,
    keyPhrases: [],
  },
];

// Run tests
console.log("========================================");
console.log("🧪 COMPLEX RULES TEST SUITE");
console.log("========================================");
console.log(`Testing ${testCases.length} complex rules questions`);
console.log("========================================\n");

let passed = 0;
let failed = 0;
const failedTests = [];

for (const testCase of testCases) {
  const { question, expectedTopic, shouldDetect, keyPhrases } = testCase;

  console.log(`Testing: "${question}"`);

  // Detect complex topic
  const detectedTopic = ComplexRulesDatabase.detectComplexTopic(question);

  // Check if detection matches expectation
  let testPassed = false;

  if (shouldDetect) {
    // Should detect a complex topic
    if (detectedTopic && detectedTopic.key === expectedTopic) {
      console.log(`  ${GREEN}✅ Correctly detected: ${expectedTopic}${RESET}`);

      // Format the answer
      const answer = ComplexRulesDatabase.formatComplexAnswer(detectedTopic);

      // Check for key phrases in the answer
      let hasAllKeyPhrases = true;
      const missingPhrases = [];

      for (const phrase of keyPhrases) {
        if (!answer.includes(phrase)) {
          hasAllKeyPhrases = false;
          missingPhrases.push(phrase);
        }
      }

      if (hasAllKeyPhrases) {
        console.log(`  ${GREEN}✅ Answer contains all key information${RESET}`);
        testPassed = true;
      } else {
        console.log(`  ${RED}❌ Answer missing key phrases:${RESET}`);
        missingPhrases.forEach((p) => console.log(`    - "${p}"`));
      }

      // Check answer length (should be comprehensive)
      if (answer.length < 200) {
        console.log(
          `  ${YELLOW}⚠️ Answer seems too short (${answer.length} chars)${RESET}`
        );
      }
    } else if (detectedTopic) {
      console.log(
        `  ${RED}❌ Wrong topic detected: ${detectedTopic.key}${RESET}`
      );
      console.log(`     Expected: ${expectedTopic}`);
    } else {
      console.log(
        `  ${RED}❌ No topic detected (expected: ${expectedTopic})${RESET}`
      );
    }
  } else {
    // Should NOT detect a complex topic
    if (!detectedTopic) {
      console.log(
        `  ${GREEN}✅ Correctly did not detect complex topic${RESET}`
      );
      testPassed = true;
    } else {
      console.log(
        `  ${RED}❌ Incorrectly detected: ${detectedTopic.key}${RESET}`
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

// Test specific problem cases from user
console.log("========================================");
console.log("Testing specific problem cases...");
console.log("========================================\n");

const problemCases = [
  {
    question: "!judge how does damage assignment work with multiple blockers?",
    shouldNotMention: ["APNAP", "Active Player, Non-Active Player", "101.4"],
    shouldMention: ["damage assignment order", "509.2", "lethal damage"],
  },
  {
    question: "!judge what is APNAP order?",
    shouldNotMention: ["damage assignment", "blockers", "509"],
    shouldMention: ["Active Player", "Non-Active Player", "101.4"],
  },
  {
    question: "!judge how do layers work in magic?",
    shouldNotMention: ["Thistledown", "creature", "Mouse"],
    shouldMention: ["613", "7 layers", "continuous effects"],
  },
];

let problemsPassed = 0;
let problemsFailed = 0;

for (const testCase of problemCases) {
  const { question, shouldNotMention, shouldMention } = testCase;

  console.log(`Testing: "${question}"`);

  const detectedTopic = ComplexRulesDatabase.detectComplexTopic(question);

  if (!detectedTopic) {
    console.log(`  ${RED}❌ No topic detected!${RESET}`);
    problemsFailed++;
    continue;
  }

  const answer = ComplexRulesDatabase.formatComplexAnswer(detectedTopic);

  // Check that unwanted content is NOT present
  let hasUnwantedContent = false;
  for (const unwanted of shouldNotMention) {
    if (answer.includes(unwanted)) {
      console.log(
        `  ${RED}❌ Answer incorrectly mentions: "${unwanted}"${RESET}`
      );
      hasUnwantedContent = true;
    }
  }

  // Check that required content IS present
  let missingContent = [];
  for (const required of shouldMention) {
    if (!answer.includes(required)) {
      missingContent.push(required);
    }
  }

  if (!hasUnwantedContent && missingContent.length === 0) {
    console.log(`  ${GREEN}✅ Answer is correct and relevant${RESET}`);
    problemsPassed++;
  } else {
    if (missingContent.length > 0) {
      console.log(`  ${RED}❌ Missing required content:${RESET}`);
      missingContent.forEach((c) => console.log(`    - "${c}"`));
    }
    problemsFailed++;
  }

  console.log();
}

// Print summary
console.log("========================================");
console.log("📊 TEST RESULTS SUMMARY");
console.log("========================================");
console.log(`${GREEN}✅ Basic Tests Passed: ${passed}${RESET}`);
console.log(`${RED}❌ Basic Tests Failed: ${failed}${RESET}`);
console.log(
  `📈 Basic Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
);

console.log(`\n${BLUE}Problem Cases:${RESET}`);
console.log(`${GREEN}✅ Passed: ${problemsPassed}${RESET}`);
console.log(`${RED}❌ Failed: ${problemsFailed}${RESET}`);

if (failedTests.length > 0) {
  console.log(`\n${RED}Failed Questions:${RESET}`);
  failedTests.forEach((q) => console.log(`  - ${q}`));
}

// Overall result
const totalTests = testCases.length + problemCases.length;
const totalPassed = passed + problemsPassed;
const overallSuccessRate = (totalPassed / totalTests) * 100;

console.log("\n========================================");
if (overallSuccessRate === 100) {
  console.log(
    `${GREEN}🎉 ALL TESTS PASSED! Complex rules handling working perfectly.${RESET}`
  );
  console.log(`${GREEN}✅ No more APNAP in damage assignment answers${RESET}`);
  console.log(
    `${GREEN}✅ No more Thistledown Players in layers answers${RESET}`
  );
  console.log(`${GREEN}✅ All answers are accurate and relevant${RESET}`);
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
process.exit(failed + problemsFailed > 0 ? 1 : 0);
