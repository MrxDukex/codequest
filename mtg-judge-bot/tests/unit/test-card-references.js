/**
 * Test script to verify card reference detection and display
 */

require("dotenv").config();
const CardReferenceDetector = require("../src/cardReferenceDetector");

// Mock getBestCardPrinting for testing
async function mockGetBestCardPrinting(cardName) {
  const mockCards = {
    "Skirk Prospector": {
      name: "Skirk Prospector",
      mana_cost: "{R}",
      type_line: "Creature — Goblin",
      oracle_text: "Sacrifice a Goblin: Add {R}.",
      image_uris: { small: "https://example.com/skirk.jpg" },
      scryfall_uri: "https://scryfall.com/card/skirk-prospector",
    },
    "Lightning Bolt": {
      name: "Lightning Bolt",
      mana_cost: "{R}",
      type_line: "Instant",
      oracle_text: "Lightning Bolt deals 3 damage to any target.",
      image_uris: { small: "https://example.com/bolt.jpg" },
      scryfall_uri: "https://scryfall.com/card/lightning-bolt",
    },
  };

  // Simple fuzzy matching
  for (const [key, value] of Object.entries(mockCards)) {
    if (
      key.toLowerCase().includes(cardName.toLowerCase()) ||
      cardName.toLowerCase().includes(key.toLowerCase())
    ) {
      return value;
    }
  }
  return null;
}

async function testCardReferenceDetection() {
  console.log("🧪 Testing Card Reference Detection\n");
  console.log("=".repeat(60));

  // Test text that mentions cards
  const testTexts = [
    {
      name: "Goblin Warchief ruling",
      text: "Goblin Warchief's effect reduces only generic mana in the cost of Goblin spells you cast. For example, it doesn't reduce the cost of Skirk Prospector below {R}.",
    },
    {
      name: "Multiple cards",
      text: "You can cast Lightning Bolt in response to Skirk Prospector's ability.",
    },
    {
      name: "No card references",
      text: "This is a ruling about general game mechanics with no specific cards mentioned.",
    },
  ];

  for (const test of testTexts) {
    console.log(`\n📝 Test: "${test.name}"`);
    console.log("-".repeat(60));
    console.log(`Text: "${test.text}"`);
    console.log();

    // Extract potential card names
    const potentialCards = CardReferenceDetector.extractPotentialCardNames(
      test.text
    );
    console.log(`📌 Potential cards found: ${potentialCards.length}`);
    if (potentialCards.length > 0) {
      potentialCards.forEach((card) => console.log(`   - ${card}`));
    }

    // Validate card names
    const validatedCards = await CardReferenceDetector.validateCardNames(
      potentialCards,
      mockGetBestCardPrinting
    );

    console.log(`✅ Validated cards: ${validatedCards.length}`);
    if (validatedCards.length > 0) {
      validatedCards.forEach((card) => {
        console.log(`   - ${card.name} (${card.type_line})`);
        console.log(`     Mana: ${card.mana_cost || "N/A"}`);
        console.log(`     Oracle: ${card.oracle_text}`);
      });
    }

    // Format for display
    const formatted =
      CardReferenceDetector.formatReferencedCards(validatedCards);
    if (formatted) {
      console.log("\n📋 Formatted output:");
      console.log(formatted);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Card reference detection test complete!");
}

// Run the test
testCardReferenceDetection().catch(console.error);
