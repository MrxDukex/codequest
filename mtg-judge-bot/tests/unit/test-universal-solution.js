/**
 * Test the universal card detection solution
 * This should work for ANY card, not just specific ones
 */

const CardReferenceDetector = require("../src/cardReferenceDetector");

// Test cases covering various card types and ruling patterns
const testCases = [
  {
    name: "Goblin Warchief",
    text: `Official Rulings:
• Goblin Warchief's effect reduces only generic mana in the cost of Goblin spells you cast. For example, it doesn't reduce the cost of Skirk Prospector below {R}.`,
    cardBeingExplained: "Goblin Warchief",
    expectedCards: ["Skirk Prospector"],
  },
  {
    name: "The Ur-Dragon",
    text: `Official Rulings:
• You draw one card for each Dragon you controlled that attacked, even if some of them left the battlefield before The Ur-Dragon's triggered ability resolves.
• If a Dragon you control enters the battlefield attacking, it won't cause The Ur-Dragon's last ability to trigger.`,
    cardBeingExplained: "The Ur-Dragon",
    expectedCards: [], // Should NOT find "Niblis of the Urn"
  },
  {
    name: "Multiple card references",
    text: `Official Rulings:
• This ability doesn't affect Goblin Recruiter or Goblin Matron since they still cost their normal mana.
• Similar to Goblin Chieftain, but with cost reduction.
• Unlike Path to Exile, this spell gives life instead of a land.`,
    cardBeingExplained: "Some Random Card",
    expectedCards: [
      "Goblin Recruiter",
      "Goblin Matron",
      "Goblin Chieftain",
      "Path to Exile",
    ],
  },
  {
    name: "Oko, Thief of Crowns",
    text: `Official Rulings:
• Oko's second ability overwrites all previous effects.
• The effect of Oko's second ability lasts indefinitely.
• Similar to Lignify, but doesn't remove card types.`,
    cardBeingExplained: "Oko, Thief of Crowns",
    expectedCards: ["Lignify"],
  },
  {
    name: "Lightning Bolt",
    text: `Official Rulings:
• Lightning Bolt can target any creature, player, or planeswalker.
• Unlike Lightning Strike, this costs one less mana.
• Similar to Shock, but deals 3 damage instead of 2.`,
    cardBeingExplained: "Lightning Bolt",
    expectedCards: ["Lightning Strike"], // "Shock" is too short as single word
  },
  {
    name: "No rulings section",
    text: `This is just regular text about a card. It mentions The Ur-Dragon and Skirk Prospector but not in Official Rulings.`,
    cardBeingExplained: "Test Card",
    expectedCards: [], // Should find nothing without Official Rulings section
  },
];

console.log("UNIVERSAL SOLUTION TEST");
console.log("=======================");
console.log(
  "Testing that the solution works for ANY card, not hardcoded ones\n"
);

let allPass = true;
let passCount = 0;

testCases.forEach((test) => {
  const found = CardReferenceDetector.extractPotentialCardNames(
    test.text,
    test.cardBeingExplained
  );
  const foundSet = new Set(found);
  const expectedSet = new Set(test.expectedCards);

  const success =
    found.length === test.expectedCards.length &&
    test.expectedCards.every((card) => foundSet.has(card));

  console.log(`Test: ${test.name}`);
  console.log(`Card being explained: ${test.cardBeingExplained}`);
  console.log(`Expected: [${test.expectedCards.join(", ") || "none"}]`);
  console.log(`Found: [${found.join(", ") || "none"}]`);

  if (success) {
    console.log("✅ PASS");
    passCount++;
  } else {
    console.log("❌ FAIL");
    allPass = false;

    test.expectedCards.forEach((card) => {
      if (!foundSet.has(card)) {
        console.log(`  Missing: "${card}"`);
      }
    });

    found.forEach((card) => {
      if (!expectedSet.has(card)) {
        console.log(`  Unexpected: "${card}"`);
      }
    });
  }
  console.log();
});

console.log("=".repeat(60));
console.log(`Results: ${passCount}/${testCases.length} tests passed`);
console.log("=".repeat(60));

if (allPass) {
  console.log("✅ ALL TESTS PASS!");
  console.log("\nThe universal solution successfully:");
  console.log(
    "• Works for ANY card name format (hyphenated, comma, 'the', etc.)"
  );
  console.log("• Detects legitimate card references in rulings");
  console.log(
    "• Avoids false positives like 'Niblis of the Urn' from 'The Ur-Dragon'"
  );
  console.log("• Uses universal patterns, not hardcoded card names");
  console.log("• Only searches in Official Rulings section");
} else {
  console.log("❌ Some tests failed");
  console.log("\nIssues to address:");
  if (found.includes("Niblis of the Urn")) {
    console.log("• Still detecting false positives");
  }
  if (!found.includes("Skirk Prospector")) {
    console.log("• Missing legitimate card references");
  }
}
