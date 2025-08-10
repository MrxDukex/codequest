/**
 * Final comprehensive test suite for all bot features
 * Tests fuzzy matching, set-specific searches, and special character handling
 */

const CardSetParser = require("../src/cardSetParser");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

async function runComprehensiveTests() {
  console.log("============================================================");
  console.log("FINAL COMPREHENSIVE TEST SUITE");
  console.log("============================================================\n");

  const testSuites = [
    {
      name: "Special Character Handling",
      tests: [
        {
          cmd: "!card commanders plate",
          expected: "Commander's Plate",
          desc: "Missing apostrophe",
        },
        {
          cmd: "!card urzas saga",
          expected: "Urza's Saga",
          desc: "Missing apostrophe",
        },
        {
          cmd: "!card teferis protection",
          expected: "Teferi's Protection",
          desc: "Missing apostrophe",
        },
        {
          cmd: "!card akroma angel of wrath",
          expected: "Akroma, Angel of Wrath",
          desc: "Missing comma",
        },
        {
          cmd: "!card thalia guardian of thraben",
          expected: "Thalia, Guardian of Thraben",
          desc: "Missing comma",
        },
        {
          cmd: "!card krrik son of yawgmoth",
          expected: "K'rrik, Son of Yawgmoth",
          desc: "Missing special chars",
        },
      ],
    },
    {
      name: "Set-Specific Searches",
      tests: [
        {
          cmd: "!card Sol Ring from edge of eternities",
          expected: "Sol Ring",
          expectedSet: "eoc",
          desc: "Partial set name",
        },
        {
          cmd: "!card Sol Ring eoc",
          expected: "Sol Ring",
          expectedSet: "eoc",
          desc: "Set code",
        },
        {
          cmd: "!card Lightning Bolt from m21",
          expected: null,
          desc: "Card not in set (should fail gracefully)",
        },
        {
          cmd: "!card The Ur-Dragon from c17",
          expected: "The Ur-Dragon",
          expectedSet: "c17",
          desc: "Complex name with set",
        },
      ],
    },
    {
      name: "Fuzzy Matching with Sets",
      tests: [
        {
          cmd: "!card commanders plate from cmr",
          expected: "Commander's Plate",
          expectedSet: "cmr",
          desc: "Fuzzy + set",
        },
        {
          cmd: "!card urzas saga from mh2",
          expected: "Urza's Saga",
          expectedSet: "mh2",
          desc: "Fuzzy + set",
        },
        {
          cmd: "!card teferis protection c17",
          expected: "Teferi's Protection",
          expectedSet: "c17",
          desc: "Fuzzy + set code",
        },
        {
          cmd: "!card akroma angel of wrath from c20",
          expected: "Akroma, Angel of Wrath",
          expectedSet: "c20",
          desc: "Fuzzy + set",
        },
      ],
    },
    {
      name: "Edge Cases",
      tests: [
        {
          cmd: "!card Walking Ballista",
          expected: "Walking Ballista",
          desc: "Normal card lookup",
        },
        {
          cmd: "!card Mox Opal",
          expected: "Mox Opal",
          desc: "Card name that could be confused with set",
        },
        {
          cmd: "!card Gift of Estates from c14",
          expected: "Gift of Estates",
          expectedSet: "c14",
          desc: "Card with 'Gift' in name",
        },
        {
          cmd: "!card Force of Will 2xm",
          expected: "Force of Will",
          expectedSet: "2xm",
          desc: "Set code with number",
        },
      ],
    },
  ];

  let totalPassed = 0;
  let totalFailed = 0;
  const allFailures = [];

  for (const suite of testSuites) {
    console.log(`${BLUE}=== ${suite.name} ===${RESET}`);

    for (const test of suite.tests) {
      process.stdout.write(`  ${test.desc}: `);

      const { cardName, setIdentifier } = CardSetParser.parseCardCommand(
        test.cmd
      );

      try {
        let result = null;

        if (setIdentifier) {
          result = await CardSetParser.getCardFromSet(cardName, setIdentifier);
        } else {
          // Use fuzzy search for cards without set
          const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
            cardName
          )}`;
          const response = await fetch(fuzzyUrl);
          if (response.ok) {
            result = await response.json();
          }
        }

        if (test.expected === null) {
          // Test expects failure
          if (!result) {
            console.log(`${GREEN}✓${RESET}`);
            totalPassed++;
          } else {
            console.log(`${RED}✗ (should have failed)${RESET}`);
            totalFailed++;
            allFailures.push({
              suite: suite.name,
              test: test.desc,
              reason: "Should have failed but didn't",
            });
          }
        } else {
          // Test expects success
          if (result && result.name === test.expected) {
            if (test.expectedSet && result.set !== test.expectedSet) {
              console.log(`${RED}✗ (wrong set: ${result.set})${RESET}`);
              totalFailed++;
              allFailures.push({
                suite: suite.name,
                test: test.desc,
                reason: `Wrong set: got ${result.set}, expected ${test.expectedSet}`,
              });
            } else {
              console.log(`${GREEN}✓${RESET}`);
              totalPassed++;
            }
          } else {
            console.log(
              `${RED}✗ (got: ${result ? result.name : "null"})${RESET}`
            );
            totalFailed++;
            allFailures.push({
              suite: suite.name,
              test: test.desc,
              reason: `Got: ${result ? result.name : "null"}, Expected: ${
                test.expected
              }`,
            });
          }
        }
      } catch (error) {
        console.log(`${RED}✗ (error: ${error.message})${RESET}`);
        totalFailed++;
        allFailures.push({
          suite: suite.name,
          test: test.desc,
          reason: `Error: ${error.message}`,
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log();
  }

  console.log("============================================================");
  console.log("FINAL RESULTS");
  console.log("============================================================");
  console.log(`Total Tests: ${totalPassed + totalFailed}`);
  console.log(`${GREEN}Passed: ${totalPassed}${RESET}`);
  console.log(`${RED}Failed: ${totalFailed}${RESET}`);
  console.log(
    `Success Rate: ${(
      (totalPassed / (totalPassed + totalFailed)) *
      100
    ).toFixed(1)}%`
  );

  if (allFailures.length > 0) {
    console.log("\nFailures:");
    allFailures.forEach((f) => {
      console.log(`  [${f.suite}] ${f.test}: ${f.reason}`);
    });
  }

  if (totalFailed === 0) {
    console.log(
      `\n${GREEN}🎉 ALL TESTS PASSED! Bot is production ready!${RESET}`
    );
    console.log(`\n${GREEN}✅ Special character handling: WORKING`);
    console.log(`✅ Set-specific searches: WORKING`);
    console.log(`✅ Fuzzy matching: WORKING`);
    console.log(`✅ Edge case handling: WORKING${RESET}`);
    return true;
  } else {
    console.log(
      `\n${YELLOW}⚠️ Some tests failed. Review the failures above.${RESET}`
    );
    return false;
  }
}

// Run the tests
runComprehensiveTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
