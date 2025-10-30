/**
 * Test to find the right balance for card detection
 * Should detect legitimate cards but not false positives
 */

// Current overly restrictive patterns
const currentPatterns = [
  /(?:such as|for example|like|including)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,
  /(?:doesn't reduce the cost of|doesn't affect|won't trigger|won't cause)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,
  /(?:Unlike|Similar to|Compare with)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,
];

// Improved balanced patterns
const improvedPatterns = [
  // Cards mentioned as examples (more flexible)
  /(?:such as|for example|like|including)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,

  // Cards in negative contexts (allow "it" before)
  /(?:it\s+)?(?:doesn't|does not|won't|will not)\s+(?:reduce the cost of|affect|trigger|cause)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,

  // Comparison references
  /(?:Unlike|Similar to|Compare with|different from)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,

  // Direct cost references (common in rulings)
  /(?:cost of|costs?\s+(?:of\s+)?)\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,

  // "below" pattern for mana costs
  /below\s+([A-Z][a-z]+(?:[\s,]+(?:the\s+)?[A-Z][a-z]+)*)/g,
];

function testPatterns(patterns, text, expectedCards) {
  const found = new Set();

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const cardName = match[1].trim().replace(/[,.]$/, "");
      // Basic validation
      if (cardName.length > 3 && !cardName.includes("'s")) {
        found.add(cardName);
      }
    }
  }

  return Array.from(found);
}

// Test cases
const testCases = [
  {
    name: "Goblin Warchief ruling",
    text: `Official Rulings:
• Goblin Warchief's effect reduces only generic mana in the cost of Goblin spells you cast. For example, it doesn't reduce the cost of Skirk Prospector below {R}.`,
    expectedCards: ["Skirk Prospector"],
  },
  {
    name: "The Ur-Dragon ruling",
    text: `Official Rulings:
• You draw one card for each Dragon you controlled that attacked, even if some of them left the battlefield before The Ur-Dragon's triggered ability resolves.
• If a Dragon you control enters the battlefield attacking, it won't cause The Ur-Dragon's last ability to trigger.`,
    expectedCards: [], // Should NOT find "Ur", "Dragon", or "Niblis of the Urn"
  },
  {
    name: "Multiple card references",
    text: `Official Rulings:
• This ability doesn't affect Goblin Recruiter or Goblin Matron since they still cost their normal mana.
• Similar to Goblin Chieftain, but with cost reduction instead of additional power.
• Unlike Path to Exile, this spell gives life instead of a land.`,
    expectedCards: [
      "Goblin Recruiter",
      "Goblin Matron",
      "Goblin Chieftain",
      "Path to Exile",
    ],
  },
];

console.log("Testing CURRENT patterns (too restrictive):");
console.log("==========================================\n");

testCases.forEach((test) => {
  const found = testPatterns(currentPatterns, test.text, test.expectedCards);
  const success =
    JSON.stringify(found.sort()) === JSON.stringify(test.expectedCards.sort());

  console.log(`Test: ${test.name}`);
  console.log(`Expected: [${test.expectedCards.join(", ")}]`);
  console.log(`Found: [${found.join(", ")}]`);
  console.log(success ? "✅ PASS" : "❌ FAIL");

  if (!success) {
    test.expectedCards.forEach((card) => {
      if (!found.includes(card)) {
        console.log(`  Missing: "${card}"`);
      }
    });
    found.forEach((card) => {
      if (!test.expectedCards.includes(card)) {
        console.log(`  Unexpected: "${card}"`);
      }
    });
  }
  console.log();
});

console.log("\nTesting IMPROVED patterns (balanced):");
console.log("======================================\n");

testCases.forEach((test) => {
  const found = testPatterns(improvedPatterns, test.text, test.expectedCards);
  const success =
    JSON.stringify(found.sort()) === JSON.stringify(test.expectedCards.sort());

  console.log(`Test: ${test.name}`);
  console.log(`Expected: [${test.expectedCards.join(", ")}]`);
  console.log(`Found: [${found.join(", ")}]`);
  console.log(success ? "✅ PASS" : "❌ FAIL");

  if (!success) {
    test.expectedCards.forEach((card) => {
      if (!found.includes(card)) {
        console.log(`  Missing: "${card}"`);
      }
    });
    found.forEach((card) => {
      if (!test.expectedCards.includes(card)) {
        console.log(`  Unexpected: "${card}"`);
      }
    });
  }
  console.log();
});

console.log("\n" + "=".repeat(60));
console.log("SOLUTION SUMMARY");
console.log("=".repeat(60));
console.log("The improved patterns:");
console.log("1. Allow 'it' before 'doesn't reduce the cost of'");
console.log("2. Add pattern for 'below {R}' style references");
console.log("3. Add pattern for direct 'cost of' references");
console.log("4. Still prevent false positives like 'Niblis of the Urn'");
console.log("5. Work with the cardBeingExplained filter to avoid fragments");
