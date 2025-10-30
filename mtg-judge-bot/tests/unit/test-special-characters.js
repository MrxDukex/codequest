/**
 * Test special character handling in card names
 * Tests apostrophes, hyphens, commas, and other special characters
 */

async function testSpecialCharacters() {
  console.log("============================================================");
  console.log("Testing Special Character Handling in Card Names");
  console.log("============================================================\n");

  // Test cases with various special character issues
  const testCases = [
    // Apostrophes
    {
      input: "commanders plate",
      expected: "Commander's Plate",
      desc: "Missing apostrophe",
    },
    {
      input: "commander's plate",
      expected: "Commander's Plate",
      desc: "Correct apostrophe",
    },
    {
      input: "commanders plate",
      expected: "Commander's Plate",
      desc: "Missing apostrophe",
    },
    {
      input: "urzas saga",
      expected: "Urza's Saga",
      desc: "Missing apostrophe in Urza's",
    },
    {
      input: "teferis protection",
      expected: "Teferi's Protection",
      desc: "Missing apostrophe in Teferi's",
    },
    {
      input: "elspeth suns champion",
      expected: "Elspeth, Sun's Champion",
      desc: "Missing comma and apostrophe",
    },

    // Hyphens and dashes
    {
      input: "swords to plowshares",
      expected: "Swords to Plowshares",
      desc: "No special chars needed",
    },
    {
      input: "akroma angel of wrath",
      expected: "Akroma, Angel of Wrath",
      desc: "Missing comma",
    },
    {
      input: "ur dragon",
      expected: "The Ur-Dragon",
      desc: "Missing 'The' and hyphen",
    },
    { input: "ur-dragon", expected: "The Ur-Dragon", desc: "Missing 'The'" },
    {
      input: "the ur dragon",
      expected: "The Ur-Dragon",
      desc: "Missing hyphen",
    },

    // Commas
    {
      input: "thalia guardian of thraben",
      expected: "Thalia, Guardian of Thraben",
      desc: "Missing comma",
    },
    {
      input: "omnath locus of creation",
      expected: "Omnath, Locus of Creation",
      desc: "Missing comma",
    },
    {
      input: "kenrith the returned king",
      expected: "Kenrith, the Returned King",
      desc: "Missing comma",
    },

    // Parentheses and slashes
    {
      input: "fire ice",
      expected: "Fire // Ice",
      desc: "Missing double slash",
    },
    {
      input: "fire/ice",
      expected: "Fire // Ice",
      desc: "Single slash instead of double",
    },
    {
      input: "wear tear",
      expected: "Wear // Tear",
      desc: "Missing double slash",
    },

    // Complex cases
    {
      input: "asmoranomardicadaistinaculdacar",
      expected: "Asmoranomardicadaistinaculdacar",
      desc: "Long name, no special chars",
    },
    {
      input: "k'rrik son of yawgmoth",
      expected: "K'rrik, Son of Yawgmoth",
      desc: "Special apostrophe and comma",
    },
    {
      input: "krrik son of yawgmoth",
      expected: "K'rrik, Son of Yawgmoth",
      desc: "Missing special chars",
    },
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const test of testCases) {
    try {
      // Try using Scryfall's fuzzy search
      const response = await fetch(
        `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
          test.input
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.name === test.expected) {
          console.log(
            `✅ PASS: "${test.input}" → "${data.name}" (${test.desc})`
          );
          passed++;
        } else {
          console.log(
            `❌ FAIL: "${test.input}" → "${data.name}" (expected "${test.expected}")`
          );
          failed++;
          failures.push({
            input: test.input,
            got: data.name,
            expected: test.expected,
          });
        }
      } else {
        console.log(
          `❌ FAIL: "${test.input}" → Not found (expected "${test.expected}")`
        );
        failed++;
        failures.push({
          input: test.input,
          got: "Not found",
          expected: test.expected,
        });
      }
    } catch (error) {
      console.log(`❌ ERROR: "${test.input}" → ${error.message}`);
      failed++;
      failures.push({
        input: test.input,
        got: "Error",
        expected: test.expected,
      });
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n============================================================");
  console.log("Test Results");
  console.log("============================================================");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(
    `Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
  );

  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((f) => {
      console.log(
        `  "${f.input}" → Got: "${f.got}", Expected: "${f.expected}"`
      );
    });
  }

  return { passed, failed, total: testCases.length };
}

// Run the test
testSpecialCharacters().catch(console.error);
