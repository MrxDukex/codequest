/**
 * Comprehensive Stress Test Suite for MTG Judge Bot
 * Tests all card name extraction patterns and edge cases
 */

const fs = require("fs").promises;
const path = require("path");

// Import the extraction logic from index.js
function extractCardNameFromQuestion(question) {
  let potentialCardName = null;

  // Pattern 1: "how does [Card Name] work?" - most common
  let match = question.match(/how (?:does|do)\s+(.+?)\s+(?:work|function)/i);
  if (match) {
    potentialCardName = match[1].trim();
  }

  // Pattern 2: "explain [Card Name]"
  if (!potentialCardName) {
    match = question.match(/explain\s+(.+?)(?:\s*$|\s*\?)/i);
    if (match) {
      potentialCardName = match[1].trim();
    }
  }

  // Pattern 3: "what does [Card Name] do"
  if (!potentialCardName) {
    match = question.match(/what (?:does|do|is)\s+(.+?)\s+(?:do|mean)/i);
    if (match) {
      potentialCardName = match[1].trim();
    }
  }

  // Pattern 4: "[Card Name] ruling" or "ruling on [Card Name]"
  if (!potentialCardName) {
    match = question.match(/(?:^|\s)(.+?)\s+ruling/i);
    if (match) {
      potentialCardName = match[1].trim();
    } else {
      match = question.match(/ruling (?:on|for)\s+(.+?)(?:\s*$|\s*\?)/i);
      if (match) {
        potentialCardName = match[1].trim();
      }
    }
  }

  // Pattern 5: Fallback - remove common question starters and see what's left
  if (!potentialCardName) {
    let cleaned = question;
    const questionStarters = [
      /^how (?:does|do)\s+/i,
      /^what (?:does|do|is)\s+/i,
      /^explain\s+/i,
      /^can you explain\s+/i,
      /^tell me about\s+/i,
    ];

    for (const starter of questionStarters) {
      cleaned = cleaned.replace(starter, "");
    }

    // Remove trailing question words
    cleaned = cleaned.replace(/\s+(?:work|do|mean|function)s?\??$/i, "");
    cleaned = cleaned.trim();

    // If what's left looks like a card name, use it
    if (cleaned.length > 2 && cleaned.length < 50) {
      potentialCardName = cleaned;
    }
  }

  return potentialCardName;
}

// Test if a card exists via Scryfall API
async function verifyCardExists(cardName) {
  try {
    // Try fuzzy search first
    const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
      cardName
    )}`;
    const fuzzyRes = await fetch(fuzzyUrl);

    if (fuzzyRes.ok) {
      const data = await fuzzyRes.json();
      return { exists: true, actualName: data.name };
    }

    // Try exact search
    const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
      cardName
    )}`;
    const exactRes = await fetch(exactUrl);

    if (exactRes.ok) {
      const data = await exactRes.json();
      return { exists: true, actualName: data.name };
    }

    return { exists: false, actualName: null };
  } catch (error) {
    console.error(`Error verifying card ${cardName}:`, error);
    return { exists: false, actualName: null, error: error.message };
  }
}

// Comprehensive test suite
const stressTests = [
  // Group A: Apostrophe Cases
  {
    group: "A",
    name: "Apostrophe Cases",
    tests: [
      {
        question: "how does Liliana's Caress work?",
        expected: "Liliana's Caress",
      },
      {
        question: "explain Teferi's Protection",
        expected: "Teferi's Protection",
      },
      { question: "what does Gaea's Cradle do?", expected: "Gaea's Cradle" },
      {
        question: "how does Emrakul, the Aeons Torn work?",
        expected: "Emrakul, the Aeons Torn",
      },
    ],
  },

  // Group B: Commas & Complex Names
  {
    group: "B",
    name: "Commas & Complex Names",
    tests: [
      {
        question: "explain Borborygmos, Enraged",
        expected: "Borborygmos, Enraged",
      },
      {
        question: "how does Teysa, Orzhov Scion work?",
        expected: "Teysa, Orzhov Scion",
      },
      {
        question: "what does Akroma, Angel of Wrath do?",
        expected: "Akroma, Angel of Wrath",
      },
      {
        question: "explain Kamahl, Fist of Krosa",
        expected: "Kamahl, Fist of Krosa",
      },
    ],
  },

  // Group C: "The" in Different Positions
  {
    group: "C",
    name: "'The' in Different Positions",
    tests: [
      {
        question: "how does The Gitrog Monster work?",
        expected: "The Gitrog Monster",
      },
      { question: "explain The Scarab God", expected: "The Scarab God" },
      {
        question: "what does Karn, the Great Creator do?",
        expected: "Karn, the Great Creator",
      },
      {
        question: "how does Omnath, Locus of the Roil work?",
        expected: "Omnath, Locus of the Roil",
      },
    ],
  },

  // Group D: Hyphens & Dashes
  {
    group: "D",
    name: "Hyphens & Dashes",
    tests: [
      {
        question: "explain Shu Yun, the Silent Tempest",
        expected: "Shu Yun, the Silent Tempest",
      },
      {
        question: "how does Zur the Enchanter work?",
        expected: "Zur the Enchanter",
      },
      {
        question: "what does Atraxa, Praetors' Voice do?",
        expected: "Atraxa, Praetors' Voice",
      },
      {
        question: "explain K'rrik, Son of Yawgmoth",
        expected: "K'rrik, Son of Yawgmoth",
      },
    ],
  },

  // Group E: Very Long Names
  {
    group: "E",
    name: "Very Long Names",
    tests: [
      {
        question: "how does Asmoranomardicadaistinaculdacar work?",
        expected: "Asmoranomardicadaistinaculdacar",
      },
      {
        question: "explain The Cheese Stands Alone",
        expected: "The Cheese Stands Alone",
      },
      {
        question: "what does Infernal Spawn of Infernal Spawn of Evil do?",
        expected: "Infernal Spawn of Infernal Spawn of Evil",
      },
    ],
  },

  // Group F: Numbers in Names
  {
    group: "F",
    name: "Numbers in Names",
    tests: [
      {
        question: "how does Figure of Destiny work?",
        expected: "Figure of Destiny",
      },
      {
        question: "explain Eight-and-a-Half-Tails",
        expected: "Eight-and-a-Half-Tails",
      },
      {
        question: "what does Hundred-Handed One do?",
        expected: "Hundred-Handed One",
      },
    ],
  },

  // Group G: Alternative Phrasings
  {
    group: "G",
    name: "Alternative Phrasings",
    tests: [
      { question: "Urza's Saga ruling", expected: "Urza's Saga" },
      { question: "ruling on Lightning Bolt", expected: "Lightning Bolt" },
      { question: "tell me about Sol Ring", expected: "Sol Ring" },
      { question: "can you explain Black Lotus", expected: "Black Lotus" },
    ],
  },

  // Group H: Mixed Special Characters
  {
    group: "H",
    name: "Mixed Special Characters",
    tests: [
      {
        question: "how does Ob Nixilis, the Fallen work?",
        expected: "Ob Nixilis, the Fallen",
      },
      { question: "explain Niv-Mizzet, Parun", expected: "Niv-Mizzet, Parun" },
      {
        question: "what does Yuriko, the Tiger's Shadow do?",
        expected: "Yuriko, the Tiger's Shadow",
      },
      {
        question: "how does Will-o'-the-Wisp work?",
        expected: "Will-o'-the-Wisp",
      },
    ],
  },

  // Group I: Single Word Cards
  {
    group: "I",
    name: "Single Word Cards",
    tests: [
      { question: "how does Counterspell work?", expected: "Counterspell" },
      { question: "explain Doom Blade", expected: "Doom Blade" },
      { question: "what does Terminate do?", expected: "Terminate" },
      { question: "how does Ponder work?", expected: "Ponder" },
    ],
  },

  // Group J: Cards Starting with "The"
  {
    group: "J",
    name: "Cards Starting with 'The'",
    tests: [
      { question: "how does The Wanderer work?", expected: "The Wanderer" },
      { question: "explain The Immortal Sun", expected: "The Immortal Sun" },
      { question: "what does The Chain Veil do?", expected: "The Chain Veil" },
      { question: "how does The Ozolith work?", expected: "The Ozolith" },
    ],
  },

  // Additional stress tests
  {
    group: "K",
    name: "Edge Cases",
    tests: [
      { question: "how does +2 Mace work?", expected: "+2 Mace" },
      { question: "explain ___", expected: "___" },
      {
        question: "what does B.F.M. (Big Furry Monster) do?",
        expected: "B.F.M. (Big Furry Monster)",
      },
      {
        question: "how does Sword of Dungeons & Dragons work?",
        expected: "Sword of Dungeons & Dragons",
      },
    ],
  },
];

// Run all tests
async function runAllTests() {
  console.log("=".repeat(80));
  console.log("COMPREHENSIVE STRESS TEST SUITE FOR MTG JUDGE BOT");
  console.log("=".repeat(80));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];
  let cardVerificationFailures = [];

  // Add delay between API calls to avoid rate limiting
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const group of stressTests) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`GROUP ${group.group}: ${group.name}`);
    console.log(`${"=".repeat(60)}`);

    for (const test of group.tests) {
      totalTests++;

      // Extract card name
      const extracted = extractCardNameFromQuestion(test.question);
      const extractionPass = extracted === test.expected;

      // Verify card exists (with rate limiting)
      await delay(100); // 100ms delay between API calls
      const verification = await verifyCardExists(test.expected);

      // Determine overall pass/fail
      const overallPass = extractionPass && verification.exists;

      if (overallPass) {
        passedTests++;
        console.log(`✅ PASS: "${test.question}"`);
        console.log(`   Extracted: "${extracted}" | Card exists: Yes`);
      } else {
        failedTests.push({
          group: group.group,
          question: test.question,
          expected: test.expected,
          extracted: extracted,
          extractionPass: extractionPass,
          cardExists: verification.exists,
          actualCardName: verification.actualName,
        });

        console.log(`❌ FAIL: "${test.question}"`);
        console.log(`   Expected: "${test.expected}"`);
        console.log(
          `   Extracted: "${extracted}" (${extractionPass ? "✓" : "✗"})`
        );
        console.log(`   Card exists: ${verification.exists ? "Yes" : "No"}`);

        if (!verification.exists && extractionPass) {
          cardVerificationFailures.push(test.expected);
        }
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("TEST SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(
    `Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log(
    `Failed: ${failedTests.length} (${(
      (failedTests.length / totalTests) *
      100
    ).toFixed(1)}%)`
  );

  if (failedTests.length > 0) {
    console.log("\n❌ FAILED TESTS:");
    for (const fail of failedTests) {
      console.log(`   Group ${fail.group}: "${fail.question}"`);
      if (!fail.extractionPass) {
        console.log(
          `      - Extraction failed: Expected "${fail.expected}", got "${fail.extracted}"`
        );
      }
      if (!fail.cardExists && fail.extractionPass) {
        console.log(
          `      - Card verification failed: "${fail.expected}" not found in Scryfall`
        );
      }
    }
  }

  if (cardVerificationFailures.length > 0) {
    console.log(
      "\n⚠️ CARDS NOT FOUND IN SCRYFALL (may be Un-cards or special cards):"
    );
    for (const card of [...new Set(cardVerificationFailures)]) {
      console.log(`   - ${card}`);
    }
  }

  // Write results to file
  const results = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests: failedTests.length,
    passRate: ((passedTests / totalTests) * 100).toFixed(1) + "%",
    failures: failedTests,
    cardsNotInScryfall: [...new Set(cardVerificationFailures)],
  };

  await fs.writeFile(
    path.join(__dirname, "stress-test-results.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\n✅ Results saved to stress-test-results.json");

  return {
    success: failedTests.length === 0,
    passRate: (passedTests / totalTests) * 100,
    failures: failedTests,
  };
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests()
    .then((result) => {
      if (result.success) {
        console.log("\n🎉 ALL TESTS PASSED!");
        process.exit(0);
      } else {
        console.log(
          `\n⚠️ ${
            result.failures.length
          } tests failed. Pass rate: ${result.passRate.toFixed(1)}%`
        );
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Test suite error:", error);
      process.exit(1);
    });
}

module.exports = { extractCardNameFromQuestion, verifyCardExists, runAllTests };
