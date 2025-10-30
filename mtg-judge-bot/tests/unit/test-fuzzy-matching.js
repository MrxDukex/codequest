/**
 * Comprehensive test for fuzzy matching with special characters
 * Tests the bot's ability to find cards even with incorrect special characters
 */

const CardSetParser = require("../src/cardSetParser");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

async function testFuzzyMatching() {
  console.log("============================================================");
  console.log("Testing Fuzzy Matching for Special Characters");
  console.log("============================================================\n");

  const testCases = [
    // Test cases for !card command without set
    {
      command: "!card commanders plate",
      expectedCard: "Commander's Plate",
      desc: "Missing apostrophe",
    },
    {
      command: "!card commander's plate",
      expectedCard: "Commander's Plate",
      desc: "Correct apostrophe",
    },
    {
      command: "!card urzas saga",
      expectedCard: "Urza's Saga",
      desc: "Missing apostrophe in Urza's",
    },
    {
      command: "!card teferis protection",
      expectedCard: "Teferi's Protection",
      desc: "Missing apostrophe in Teferi's",
    },
    {
      command: "!card elspeth suns champion",
      expectedCard: "Elspeth, Sun's Champion",
      desc: "Missing comma and apostrophe",
    },
    {
      command: "!card akroma angel of wrath",
      expectedCard: "Akroma, Angel of Wrath",
      desc: "Missing comma",
    },
    {
      command: "!card thalia guardian of thraben",
      expectedCard: "Thalia, Guardian of Thraben",
      desc: "Missing comma",
    },
    {
      command: "!card omnath locus of creation",
      expectedCard: "Omnath, Locus of Creation",
      desc: "Missing comma",
    },
    {
      command: "!card kenrith the returned king",
      expectedCard: "Kenrith, the Returned King",
      desc: "Missing comma",
    },
    {
      command: "!card krrik son of yawgmoth",
      expectedCard: "K'rrik, Son of Yawgmoth",
      desc: "Missing special apostrophe and comma",
    },

    // Test cases with set specifications
    {
      command: "!card commanders plate from cmr",
      expectedCard: "Commander's Plate",
      expectedSet: "cmr",
      desc: "Missing apostrophe with set",
    },
    {
      command: "!card urzas saga from mh2",
      expectedCard: "Urza's Saga",
      expectedSet: "mh2",
      desc: "Missing apostrophe with set",
    },
    {
      command: "!card teferis protection c17",
      expectedCard: "Teferi's Protection",
      expectedSet: "c17",
      desc: "Missing apostrophe with set code",
    },
    {
      command: "!card akroma angel of wrath from c20",
      expectedCard: "Akroma, Angel of Wrath",
      expectedSet: "c20",
      desc: "Missing comma with set",
    },
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const test of testCases) {
    console.log(`\n--- Test: ${test.desc} ---`);
    console.log(`Command: "${test.command}"`);

    // Parse the command
    const { cardName, setIdentifier } = CardSetParser.parseCardCommand(
      test.command
    );
    console.log(
      `  Parsed: Card="${cardName}", Set="${setIdentifier || "none"}"`
    );

    try {
      let result = null;

      if (setIdentifier) {
        // Test with set
        result = await CardSetParser.getCardFromSet(cardName, setIdentifier);

        if (result) {
          if (result.name === test.expectedCard) {
            console.log(
              `${GREEN}✅ PASS: Found "${result.name}" in set ${result.set}${RESET}`
            );
            passed++;
          } else {
            console.log(
              `${RED}❌ FAIL: Found "${result.name}" but expected "${test.expectedCard}"${RESET}`
            );
            failed++;
            failures.push({
              command: test.command,
              got: result.name,
              expected: test.expectedCard,
            });
          }
        } else {
          console.log(`${RED}❌ FAIL: Card not found${RESET}`);
          failed++;
          failures.push({
            command: test.command,
            got: "Not found",
            expected: test.expectedCard,
          });
        }
      } else {
        // Test without set - use fuzzy search directly
        const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
          cardName
        )}`;
        const response = await fetch(fuzzyUrl);

        if (response.ok) {
          const data = await response.json();
          if (data.name === test.expectedCard) {
            console.log(`${GREEN}✅ PASS: Found "${data.name}"${RESET}`);
            passed++;
          } else {
            console.log(
              `${RED}❌ FAIL: Found "${data.name}" but expected "${test.expectedCard}"${RESET}`
            );
            failed++;
            failures.push({
              command: test.command,
              got: data.name,
              expected: test.expectedCard,
            });
          }
        } else {
          console.log(`${RED}❌ FAIL: Card not found${RESET}`);
          failed++;
          failures.push({
            command: test.command,
            got: "Not found",
            expected: test.expectedCard,
          });
        }
      }
    } catch (error) {
      console.log(`${RED}❌ ERROR: ${error.message}${RESET}`);
      failed++;
      failures.push({
        command: test.command,
        got: "Error",
        expected: test.expectedCard,
      });
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n============================================================");
  console.log("Final Results");
  console.log("============================================================");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`${GREEN}Passed: ${passed}${RESET}`);
  console.log(`${RED}Failed: ${failed}${RESET}`);
  console.log(
    `Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
  );

  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => {
      console.log(`  "${f.command}"`);
      console.log(`    Got: "${f.got}", Expected: "${f.expected}"`);
    });
  }

  if (passed === testCases.length) {
    console.log(
      `\n${GREEN}🎉 ALL TESTS PASSED! Fuzzy matching is working perfectly!${RESET}`
    );
    return true;
  } else {
    console.log(
      `\n${YELLOW}⚠️ Some tests failed. Review the failures above.${RESET}`
    );
    return false;
  }
}

// Run the test
testFuzzyMatching()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Test failed with error:", error);
    process.exit(1);
  });
