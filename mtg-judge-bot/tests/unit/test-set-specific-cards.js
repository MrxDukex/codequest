/**
 * Comprehensive Stress Test Suite for Set-Specific Card Search
 * Tests the new !card command enhancement with set specifications
 */

const CardSetParser = require("../src/cardSetParser");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Test result tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

/**
 * Run a single test case
 */
async function runTest(testName, testFunction) {
  totalTests++;
  try {
    const result = await testFunction();
    if (result) {
      passedTests++;
      console.log(`${colors.green}✓${colors.reset} ${testName}`);
      testResults.push({ name: testName, status: "PASSED", details: result });
    } else {
      failedTests++;
      console.log(`${colors.red}✗${colors.reset} ${testName}`);
      testResults.push({
        name: testName,
        status: "FAILED",
        details: "Test returned false",
      });
    }
  } catch (error) {
    failedTests++;
    console.log(`${colors.red}✗${colors.reset} ${testName}: ${error.message}`);
    testResults.push({
      name: testName,
      status: "ERROR",
      details: error.message,
    });
  }
}

/**
 * Test Suite 1: Basic Parsing Tests
 */
async function testBasicParsing() {
  console.log(
    `\n${colors.cyan}=== Test Suite 1: Basic Parsing ===${colors.reset}`
  );

  // Test 1: Parse with "from" keyword
  await runTest('Parse "!card lightning bolt from m21"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card lightning bolt from m21"
    );
    return (
      result.cardName === "lightning bolt" && result.setIdentifier === "m21"
    );
  });

  // Test 2: Parse with set code only
  await runTest('Parse "!card sol ring cmr"', () => {
    const result = CardSetParser.parseCardCommand("!card sol ring cmr");
    return result.cardName === "sol ring" && result.setIdentifier === "cmr";
  });

  // Test 3: Parse without set
  await runTest('Parse "!card lightning bolt" (no set)', () => {
    const result = CardSetParser.parseCardCommand("!card lightning bolt");
    return (
      result.cardName === "lightning bolt" && result.setIdentifier === null
    );
  });

  // Test 4: Parse with uppercase set code
  await runTest('Parse "!card sol ring CMR"', () => {
    const result = CardSetParser.parseCardCommand("!card sol ring CMR");
    return result.cardName === "sol ring" && result.setIdentifier === "CMR";
  });

  // Test 5: Parse with full set name
  await runTest('Parse "!card lightning bolt from core set 2021"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card lightning bolt from core set 2021"
    );
    return (
      result.cardName === "lightning bolt" &&
      result.setIdentifier === "core set 2021"
    );
  });
}

/**
 * Test Suite 2: Edge Cases with "from" in Card Names
 */
async function testCardsWithFrom() {
  console.log(
    `\n${colors.cyan}=== Test Suite 2: Cards with "from" in Name ===${colors.reset}`
  );

  // Test 1: Card with "from" in name, no set
  await runTest('Parse "!card Gifts from Above"', () => {
    const result = CardSetParser.parseCardCommand("!card Gifts from Above");
    return (
      result.cardName === "Gifts from Above" && result.setIdentifier === null
    );
  });

  // Test 2: Card with "from" in name, with set using "from"
  await runTest('Parse "!card Gifts from Above from vow"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Gifts from Above from vow"
    );
    return (
      result.cardName === "Gifts from Above" && result.setIdentifier === "vow"
    );
  });

  // Test 3: Card with "from" in name, with set code
  await runTest('Parse "!card Escape from Orthanc ltr"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Escape from Orthanc ltr"
    );
    return (
      result.cardName === "Escape from Orthanc" &&
      result.setIdentifier === "ltr"
    );
  });

  // Test 4: Multiple "from" keywords
  await runTest('Parse "!card Blessings from Beyond from emn"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Blessings from Beyond from emn"
    );
    return (
      result.cardName === "Blessings from Beyond" &&
      result.setIdentifier === "emn"
    );
  });
}

/**
 * Test Suite 3: Complex Card Names
 */
async function testComplexCardNames() {
  console.log(
    `\n${colors.cyan}=== Test Suite 3: Complex Card Names ===${colors.reset}`
  );

  // Test 1: Apostrophes
  await runTest('Parse "!card Urza\'s Saga from mh2"', () => {
    const result = CardSetParser.parseCardCommand("!card Urza's Saga from mh2");
    return result.cardName === "Urza's Saga" && result.setIdentifier === "mh2";
  });

  // Test 2: Commas
  await runTest('Parse "!card Thalia, Guardian of Thraben dka"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Thalia, Guardian of Thraben dka"
    );
    return (
      result.cardName === "Thalia, Guardian of Thraben" &&
      result.setIdentifier === "dka"
    );
  });

  // Test 3: Very long card name
  await runTest('Parse "!card Asmoranomardicadaistinaculdacar mh2"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Asmoranomardicadaistinaculdacar mh2"
    );
    return (
      result.cardName === "Asmoranomardicadaistinaculdacar" &&
      result.setIdentifier === "mh2"
    );
  });

  // Test 4: The Ur-Dragon
  await runTest('Parse "!card The Ur-Dragon from c17"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card The Ur-Dragon from c17"
    );
    return (
      result.cardName === "The Ur-Dragon" && result.setIdentifier === "c17"
    );
  });

  // Test 5: Numbers in name
  await runTest('Parse "!card Force of Will 2xm"', () => {
    const result = CardSetParser.parseCardCommand("!card Force of Will 2xm");
    return (
      result.cardName === "Force of Will" && result.setIdentifier === "2xm"
    );
  });
}

/**
 * Test Suite 4: Ambiguous Cases
 */
async function testAmbiguousCases() {
  console.log(
    `\n${colors.cyan}=== Test Suite 4: Ambiguous Cases ===${colors.reset}`
  );

  // Test 1: Card ending with potential set code word
  await runTest('Parse "!card Mox Opal" (Opal not a set)', () => {
    const result = CardSetParser.parseCardCommand("!card Mox Opal");
    return result.cardName === "Mox Opal" && result.setIdentifier === null;
  });

  // Test 2: Card with 3-letter word at end
  await runTest('Parse "!card Lightning Axe" (Axe not a set)', () => {
    const result = CardSetParser.parseCardCommand("!card Lightning Axe");
    return result.cardName === "Lightning Axe" && result.setIdentifier === null;
  });

  // Test 3: Card with actual set code
  await runTest('Parse "!card Lightning Axe soi"', () => {
    const result = CardSetParser.parseCardCommand("!card Lightning Axe soi");
    return (
      result.cardName === "Lightning Axe" && result.setIdentifier === "soi"
    );
  });

  // Test 4: Mixed case that shouldn't be a set
  await runTest('Parse "!card Sword of Fire and Ice"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Sword of Fire and Ice"
    );
    return (
      result.cardName === "Sword of Fire and Ice" &&
      result.setIdentifier === null
    );
  });
}

/**
 * Test Suite 5: API Integration Tests (requires network)
 */
async function testAPIIntegration() {
  console.log(
    `\n${colors.cyan}=== Test Suite 5: API Integration ===${colors.reset}`
  );

  // Test 1: Fetch card from specific set
  await runTest('API: Fetch "Lightning Bolt" from M21', async () => {
    const card = await CardSetParser.getCardFromSet("Lightning Bolt", "m21");
    return card && card.name === "Lightning Bolt" && card.set === "m21";
  });

  // Test 2: Card not in specified set
  await runTest('API: "Black Lotus" not in M21', async () => {
    const card = await CardSetParser.getCardFromSet("Black Lotus", "m21");
    return card === null;
  });

  // Test 3: Fuzzy match
  await runTest('API: Fuzzy match "lightening bolt" in M21', async () => {
    const card = await CardSetParser.getCardFromSet("lightening bolt", "m21");
    return card && card.name === "Lightning Bolt";
  });

  // Test 4: Get all sets for a card
  await runTest('API: Get all sets for "Sol Ring"', async () => {
    const sets = await CardSetParser.getCardSets("Sol Ring");
    return sets && sets.length > 10; // Sol Ring is in many sets
  });

  // Test 5: Invalid set code
  await runTest('API: Invalid set code "xyz123"', async () => {
    const card = await CardSetParser.getCardFromSet("Lightning Bolt", "xyz123");
    return card === null;
  });
}

/**
 * Test Suite 6: Command Isolation Tests
 */
async function testCommandIsolation() {
  console.log(
    `\n${colors.cyan}=== Test Suite 6: Command Isolation ===${colors.reset}`
  );

  // Test 1: !judge command shouldn't be parsed
  await runTest('Ignore "!judge how does cascade work?"', () => {
    // This should not be parsed as a card command
    const command = "!judge how does cascade work?";
    return !command.startsWith("!card ");
  });

  // Test 2: !cards (plural) shouldn't be parsed
  await runTest('Ignore "!cards lightning bolt, counterspell"', () => {
    const command = "!cards lightning bolt, counterspell";
    return command.startsWith("!cards") && !command.startsWith("!card ");
  });

  // Test 3: Only !card should be parsed
  await runTest('Only parse commands starting with "!card "', () => {
    const validCommand = "!card lightning bolt";
    const invalidCommand = "!cardlightning bolt";
    return (
      validCommand.startsWith("!card ") && !invalidCommand.startsWith("!card ")
    );
  });
}

/**
 * Test Suite 7: Special Characters and Unicode
 */
async function testSpecialCharacters() {
  console.log(
    `\n${colors.cyan}=== Test Suite 7: Special Characters ===${colors.reset}`
  );

  // Test 1: Em dash
  await runTest("Parse card with em dash", () => {
    const result = CardSetParser.parseCardCommand(
      "!card Ral, Storm Conduit—Dragon's Maze war"
    );
    // Should handle the em dash gracefully
    return result.cardName && result.setIdentifier === "war";
  });

  // Test 2: Parentheses in name
  await runTest('Parse "!card Void Winnower (Borderless) from 2xm"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card Void Winnower (Borderless) from 2xm"
    );
    return (
      result.cardName === "Void Winnower (Borderless)" &&
      result.setIdentifier === "2xm"
    );
  });

  // Test 3: Slash in name
  await runTest('Parse "!card Fire // Ice from mh2"', () => {
    const result = CardSetParser.parseCardCommand("!card Fire // Ice from mh2");
    return result.cardName === "Fire // Ice" && result.setIdentifier === "mh2";
  });
}

/**
 * Test Suite 8: Set Name Variations
 */
async function testSetNameVariations() {
  console.log(
    `\n${colors.cyan}=== Test Suite 8: Set Name Variations ===${colors.reset}`
  );

  // Test 1: Partial set name
  await runTest('Parse "!card lightning bolt from core 2021"', () => {
    const result = CardSetParser.parseCardCommand(
      "!card lightning bolt from core 2021"
    );
    return (
      result.cardName === "lightning bolt" &&
      result.setIdentifier === "core 2021"
    );
  });

  // Test 2: Full set name with special characters
  await runTest(
    'Parse "!card sol ring from commander legends: battle for baldur\'s gate"',
    () => {
      const result = CardSetParser.parseCardCommand(
        "!card sol ring from commander legends: battle for baldur's gate"
      );
      return (
        result.cardName === "sol ring" &&
        result.setIdentifier === "commander legends: battle for baldur's gate"
      );
    }
  );

  // Test 3: Set code with numbers
  await runTest('Parse "!card force of will 2xm"', () => {
    const result = CardSetParser.parseCardCommand("!card force of will 2xm");
    return (
      result.cardName === "force of will" && result.setIdentifier === "2xm"
    );
  });

  // Test 4: Mystery Booster codes
  await runTest('Parse "!card lightning bolt mb1"', () => {
    const result = CardSetParser.parseCardCommand("!card lightning bolt mb1");
    return (
      result.cardName === "lightning bolt" && result.setIdentifier === "mb1"
    );
  });
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log(`${colors.blue}${"=".repeat(60)}`);
  console.log(
    `${colors.blue}Starting Comprehensive Set-Specific Card Search Tests`
  );
  console.log(`${colors.blue}${"=".repeat(60)}${colors.reset}`);

  const startTime = Date.now();

  // Run all test suites
  await testBasicParsing();
  await testCardsWithFrom();
  await testComplexCardNames();
  await testAmbiguousCases();
  await testAPIIntegration();
  await testCommandIsolation();
  await testSpecialCharacters();
  await testSetNameVariations();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log(`\n${colors.blue}${"=".repeat(60)}`);
  console.log(`${colors.blue}Test Summary`);
  console.log(`${colors.blue}${"=".repeat(60)}${colors.reset}`);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(
    `Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
  );
  console.log(`Duration: ${duration}s`);

  // Save detailed results
  const fs = require("fs").promises;
  const resultsPath = require("path").join(
    __dirname,
    "set-specific-test-results.json"
  );
  await fs.writeFile(
    resultsPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
          successRate: ((passedTests / totalTests) * 100).toFixed(1) + "%",
          duration: duration + "s",
        },
        tests: testResults,
      },
      null,
      2
    )
  );

  console.log(`\nDetailed results saved to: ${resultsPath}`);

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error(
      `${colors.red}Fatal error running tests:${colors.reset}`,
      error
    );
    process.exit(1);
  });
}

module.exports = { runAllTests };
