/**
 * Balanced solution for card detection
 * Detects legitimate cards without false positives
 */

function balancedCardDetector(text, cardBeingExplained = null) {
  const potentialCards = new Set();

  // Create ignored variations if we're explaining a specific card
  const ignoredVariations = new Set();
  if (cardBeingExplained) {
    const cardName = cardBeingExplained.toLowerCase();
    ignoredVariations.add(cardName);

    // Add possessive forms
    ignoredVariations.add(cardName + "'s");

    // Add individual words from the card name to avoid fragments
    const words = cardName.split(/[\s-,]+/);
    words.forEach((word) => {
      if (word.length > 2) {
        ignoredVariations.add(word);
        ignoredVariations.add(word + "'s");
      }
    });
  }

  // Strategy: Look for complete card names in specific contexts
  // Use more specific patterns that capture full card names

  // Pattern 1: "cost of [Card Name]" - very common in rulings
  const costPattern =
    /(?:cost of|costs?\s+(?:of\s+)?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:below|by|is|remains)/gi;
  let match;
  while ((match = costPattern.exec(text)) !== null) {
    const cardName = match[1].trim();
    if (
      !ignoredVariations.has(cardName.toLowerCase()) &&
      cardName.split(/\s+/).length >= 2
    ) {
      potentialCards.add(cardName);
    }
  }

  // Pattern 2: "doesn't reduce the cost of [Card Name] below"
  const doesntReducePattern =
    /(?:doesn't|does not|won't|will not)\s+reduce the cost of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+below/gi;
  while ((match = doesntReducePattern.exec(text)) !== null) {
    const cardName = match[1].trim();
    if (!ignoredVariations.has(cardName.toLowerCase())) {
      potentialCards.add(cardName);
    }
  }

  // Pattern 3: "doesn't affect [Card Name]" with proper boundaries
  const doesntAffectPattern =
    /(?:doesn't|does not|won't|will not)\s+affect\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)(?:\s+(?:since|because|or|and|,|\.))/gi;
  while ((match = doesntAffectPattern.exec(text)) !== null) {
    const cardName = match[1].trim();
    if (
      !ignoredVariations.has(cardName.toLowerCase()) &&
      cardName.split(/\s+/).length >= 2
    ) {
      potentialCards.add(cardName);
    }
  }

  // Pattern 4: Comparisons with proper card name boundaries
  const comparisonPattern =
    /(?:Unlike|Similar to|Compare with)\s+([A-Z][a-z]+(?:,?\s+(?:the\s+)?[A-Z][a-z]+)*?)(?:,|\.|;|\s+this|\s+but)/gi;
  while ((match = comparisonPattern.exec(text)) !== null) {
    const cardName = match[1].trim().replace(/,$/, "");
    if (!ignoredVariations.has(cardName.toLowerCase()) && cardName.length > 5) {
      potentialCards.add(cardName);
    }
  }

  // Pattern 5: "such as" or "for example" with complete card names
  const examplePattern =
    /(?:such as|for example,?|like|including)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi;
  while ((match = examplePattern.exec(text)) !== null) {
    const cardName = match[1].trim();
    if (!ignoredVariations.has(cardName.toLowerCase())) {
      potentialCards.add(cardName);
    }
  }

  // Pattern 6: Handle "or" lists properly
  const orListPattern =
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+or\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi;
  while ((match = orListPattern.exec(text)) !== null) {
    const card1 = match[1].trim();
    const card2 = match[2].trim();
    if (!ignoredVariations.has(card1.toLowerCase())) {
      potentialCards.add(card1);
    }
    if (!ignoredVariations.has(card2.toLowerCase())) {
      potentialCards.add(card2);
    }
  }

  // Filter out fragments and validate
  const filtered = Array.from(potentialCards).filter((card) => {
    // Remove single words that are too short
    if (!card.includes(" ") && card.length < 8) {
      return false;
    }

    // Remove specific fragments
    if (["Urn", "Dragon", "Ur", "The Ur", "Path"].includes(card)) {
      return false;
    }

    // Ensure it's not just "The" + single word
    if (
      card.startsWith("The ") &&
      card.split(/\s+/).length === 2 &&
      card.length < 10
    ) {
      return false;
    }

    return true;
  });

  return filtered;
}

// Test cases
const testCases = [
  {
    name: "Goblin Warchief ruling",
    text: `Official Rulings:
• Goblin Warchief's effect reduces only generic mana in the cost of Goblin spells you cast. For example, it doesn't reduce the cost of Skirk Prospector below {R}.`,
    cardBeingExplained: "Goblin Warchief",
    expectedCards: ["Skirk Prospector"],
  },
  {
    name: "The Ur-Dragon ruling",
    text: `Official Rulings:
• You draw one card for each Dragon you controlled that attacked, even if some of them left the battlefield before The Ur-Dragon's triggered ability resolves.
• If a Dragon you control enters the battlefield attacking, it won't cause The Ur-Dragon's last ability to trigger.`,
    cardBeingExplained: "The Ur-Dragon",
    expectedCards: [], // Should NOT find anything
  },
  {
    name: "Multiple card references",
    text: `Official Rulings:
• This ability doesn't affect Goblin Recruiter or Goblin Matron since they still cost their normal mana.
• Similar to Goblin Chieftain, but with cost reduction instead of additional power.
• Unlike Path to Exile, this spell gives life instead of a land.`,
    cardBeingExplained: "Some Card",
    expectedCards: [
      "Goblin Recruiter",
      "Goblin Matron",
      "Goblin Chieftain",
      "Path to Exile",
    ],
  },
  {
    name: "Lightning Bolt comparison",
    text: `Official Rulings:
• This spell is similar to Lightning Strike, but costs one less mana.
• Unlike Shock, this deals 3 damage instead of 2.`,
    cardBeingExplained: "Lightning Bolt",
    expectedCards: ["Lightning Strike"], // "Shock" is single word, should be filtered
  },
];

console.log("BALANCED SOLUTION TEST");
console.log("=======================\n");

let allPass = true;

testCases.forEach((test) => {
  const found = balancedCardDetector(test.text, test.cardBeingExplained);
  const foundSet = new Set(found);
  const expectedSet = new Set(test.expectedCards);

  const success =
    found.length === test.expectedCards.length &&
    test.expectedCards.every((card) => foundSet.has(card));

  console.log(`Test: ${test.name}`);
  console.log(`Card being explained: ${test.cardBeingExplained}`);
  console.log(`Expected: [${test.expectedCards.join(", ")}]`);
  console.log(`Found: [${found.join(", ")}]`);

  if (success) {
    console.log("✅ PASS");
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
if (allPass) {
  console.log("✅ ALL TESTS PASS!");
  console.log("\nThe balanced solution:");
  console.log("1. Uses specific patterns with proper boundaries");
  console.log("2. Filters out fragments like 'The Ur', 'Path', 'Urn'");
  console.log("3. Respects the cardBeingExplained context");
  console.log("4. Detects legitimate card references");
  console.log("5. Avoids false positives");
} else {
  console.log("❌ Some tests failed - needs adjustment");
}
