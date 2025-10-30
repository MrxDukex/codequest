/**
 * Test Suite for Keyword Response Truncation
 * Ensures that all keyword responses fit within Discord's embed limits
 * and are never truncated
 */

const KeywordDatabase = require("../../src/keywordDatabase");
const KeywordResponseFormatter = require("../../src/keywordResponseFormatter");
const rulesManager = require("../../src/rulesManager");

// Discord's actual limits
const DISCORD_LIMITS = {
  EMBED_DESCRIPTION: 4096,
  FIELD_VALUE: 1024,
  FIELD_NAME: 256,
  TOTAL_EMBEDS: 10,
  TOTAL_CHARACTERS: 6000,
};

// Test questions that previously caused truncation
const TRUNCATION_TEST_CASES = [
  "how does menace work?",
  "what is priority?",
  "explain flying",
  "how does the stack work?",
  "what happens when a creature with lifelink deals damage?",
  "how does doubling season work with planeswalkers?",
  "explain first strike",
  "what is summoning sickness?",
  "how does trample work?",
  "what does deathtouch do?",
  "explain vigilance",
  "how does hexproof work?",
  "what is indestructible?",
  "how does ward work?",
  "explain the legend rule",
  "what is the graveyard?",
  "how does exile work?",
  "what is the battlefield?",
  "what does it mean to sacrifice?",
  "how does destroy work?",
  "what happens when you counter a spell?",
  "how does scry work?",
  "what does mill mean?",
  "what is a planeswalker?",
  "how do instants work?",
  "what is the difference between instant and sorcery?",
  "explain the combat phase",
  "what is the main phase?",
  "how does upkeep work?",
];

async function initializeRules() {
  try {
    console.log("📚 Initializing comprehensive rules for testing...");
    await rulesManager.initializeRules();
    console.log("✅ Rules initialized");
  } catch (error) {
    console.warn(
      "⚠️ Could not initialize rules, tests will run without comprehensive rules context"
    );
  }
}

async function testKeywordResponse(question) {
  console.log(`\nTesting: "${question}"`);

  // Detect keyword
  const keywordData = KeywordDatabase.detectKeyword(question);

  if (!keywordData) {
    console.log("  ❌ No keyword detected");
    return {
      question,
      passed: false,
      error: "No keyword detected",
    };
  }

  console.log(`  ✅ Keyword detected: ${keywordData.name}`);

  // Get comprehensive rules if available
  let comprehensiveRules = [];
  try {
    comprehensiveRules = await rulesManager.findRelevantRules(question);
    console.log(`  📚 Found ${comprehensiveRules.length} comprehensive rules`);
  } catch (error) {
    console.log("  ⚠️ No comprehensive rules available");
  }

  // Format the response
  const formattedResponse = KeywordResponseFormatter.formatKeywordResponse(
    keywordData,
    comprehensiveRules
  );

  // Validate the response
  const isValid = KeywordResponseFormatter.validateEmbedSize(
    formattedResponse.description,
    formattedResponse.fields
  );

  // Check specific limits
  const descriptionLength = formattedResponse.description.length;
  const withinDescriptionLimit =
    descriptionLength <= DISCORD_LIMITS.EMBED_DESCRIPTION;

  let fieldsValid = true;
  let fieldIssues = [];

  if (formattedResponse.fields) {
    for (const field of formattedResponse.fields) {
      if (field.name && field.name.length > DISCORD_LIMITS.FIELD_NAME) {
        fieldsValid = false;
        fieldIssues.push(
          `Field name too long: ${field.name.length} > ${DISCORD_LIMITS.FIELD_NAME}`
        );
      }
      if (field.value && field.value.length > DISCORD_LIMITS.FIELD_VALUE) {
        fieldsValid = false;
        fieldIssues.push(
          `Field value too long: ${field.value.length} > ${DISCORD_LIMITS.FIELD_VALUE}`
        );
      }
    }
  }

  // Check for truncation indicators
  const hasTruncation =
    formattedResponse.description.includes("...\n•") ||
    formattedResponse.description.endsWith("...");

  // Check if the response is complete (has all expected sections)
  const hasDescription =
    keywordData.description &&
    formattedResponse.description.includes(
      keywordData.description.substring(0, 50)
    );
  const hasExample =
    !keywordData.example || formattedResponse.description.includes("Example:");
  const hasRule =
    !keywordData.rule ||
    formattedResponse.description.includes("Comprehensive Rule:");

  const isComplete = hasDescription && hasExample && hasRule;

  // Determine if test passed
  const passed =
    isValid &&
    withinDescriptionLimit &&
    fieldsValid &&
    !hasTruncation &&
    isComplete;

  // Log results
  console.log(
    `  📏 Description length: ${descriptionLength}/${DISCORD_LIMITS.EMBED_DESCRIPTION}`
  );
  console.log(`  ✅ Within limits: ${withinDescriptionLimit ? "Yes" : "No"}`);
  console.log(`  ✅ Fields valid: ${fieldsValid ? "Yes" : "No"}`);
  console.log(`  ✅ No truncation: ${!hasTruncation ? "Yes" : "No"}`);
  console.log(`  ✅ Complete response: ${isComplete ? "Yes" : "No"}`);
  console.log(`  ${passed ? "✅ PASS" : "❌ FAIL"}`);

  return {
    question,
    passed,
    keywordName: keywordData.name,
    descriptionLength,
    withinLimit: withinDescriptionLimit,
    fieldsValid,
    fieldIssues,
    hasTruncation,
    isComplete,
    hasDescription,
    hasExample,
    hasRule,
  };
}

async function runAllTests() {
  console.log("========================================");
  console.log("🧪 KEYWORD TRUNCATION TEST SUITE");
  console.log("========================================");
  console.log(`Testing ${TRUNCATION_TEST_CASES.length} keyword questions`);
  console.log(
    `Discord Embed Description Limit: ${DISCORD_LIMITS.EMBED_DESCRIPTION} characters`
  );
  console.log(
    `Discord Field Value Limit: ${DISCORD_LIMITS.FIELD_VALUE} characters`
  );
  console.log("========================================");

  // Initialize rules first
  await initializeRules();

  const results = [];

  for (const question of TRUNCATION_TEST_CASES) {
    const result = await testKeywordResponse(question);
    results.push(result);
  }

  // Summary
  console.log("\n========================================");
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("========================================");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const successRate = ((passed / results.length) * 100).toFixed(1);

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${successRate}%`);

  if (failed > 0) {
    console.log("\n⚠️ FAILURES:");
    for (const result of results.filter((r) => !r.passed)) {
      console.log(`  • "${result.question}"`);
      if (!result.withinLimit) {
        console.log(
          `    - Description too long: ${result.descriptionLength} characters`
        );
      }
      if (!result.fieldsValid && result.fieldIssues) {
        result.fieldIssues.forEach((issue) => {
          console.log(`    - ${issue}`);
        });
      }
      if (result.hasTruncation) {
        console.log(`    - Response appears truncated`);
      }
      if (!result.isComplete) {
        if (!result.hasDescription) console.log(`    - Missing description`);
        if (!result.hasExample) console.log(`    - Missing example`);
        if (!result.hasRule) console.log(`    - Missing rule reference`);
      }
    }
  }

  // Length statistics
  console.log("\n📊 LENGTH STATISTICS:");
  const lengths = results.map((r) => r.descriptionLength).filter((l) => l > 0);
  const avgLength = Math.round(
    lengths.reduce((a, b) => a + b, 0) / lengths.length
  );
  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);

  console.log(`  Average response length: ${avgLength} characters`);
  console.log(`  Longest response: ${maxLength} characters`);
  console.log(`  Shortest response: ${minLength} characters`);
  console.log(
    `  Safe buffer remaining: ${
      DISCORD_LIMITS.EMBED_DESCRIPTION - maxLength
    } characters`
  );

  console.log("\n========================================");

  if (successRate === "100.0") {
    console.log("🎉 ALL TESTS PASSED! No truncation issues detected.");
  } else {
    console.log(`⚠️ ${failed} test(s) failed. Review the failures above.`);
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
