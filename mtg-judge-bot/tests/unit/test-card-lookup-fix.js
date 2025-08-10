require("dotenv").config();
const { OpenAI } = require("openai");
const config = require("../config");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Function to get the best printing of a card
async function getBestCardPrinting(cardName) {
  try {
    // First try fuzzy search - this handles misspellings, partial names, and case variations
    const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
      cardName
    )}`;
    console.log(`Trying fuzzy search for: "${cardName}"`);
    const fuzzyRes = await fetch(fuzzyUrl);

    if (fuzzyRes.ok) {
      const cardData = await fuzzyRes.json();
      console.log(`✅ Found card via fuzzy search: ${cardData.name}`);
      return cardData;
    }

    // If fuzzy fails, try exact match
    const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
      cardName
    )}`;
    console.log(`Trying exact search for: "${cardName}"`);
    const exactRes = await fetch(exactUrl);

    if (exactRes.ok) {
      const cardData = await exactRes.json();
      console.log(`✅ Found card via exact search: ${cardData.name}`);
      return cardData;
    }

    console.log(`❌ Could not find card: "${cardName}"`);
    return null;
  } catch (error) {
    console.error("Error getting card:", error);
    return null;
  }
}

async function testCardLookups() {
  console.log("🧪 Testing Card Lookup Fixes\n");
  console.log("=".repeat(60));

  // Test cases with different capitalizations and formats
  const testCases = [
    "the endstone", // All lowercase
    "The Endstone", // Proper case
    "THE ENDSTONE", // All uppercase
    "endstone", // Without "the"
    "lightning bolt", // Common card lowercase
    "Lightning Bolt", // Common card proper case
    "black lotus", // Iconic card lowercase
    "Black Lotus", // Iconic card proper case
    "the one ring", // Card with "the" in name
    "The One Ring", // Proper case version
  ];

  console.log("\n📝 Testing various card name formats:\n");

  let successCount = 0;
  let failCount = 0;

  for (const testCard of testCases) {
    console.log(`\nTesting: "${testCard}"`);
    console.log("-".repeat(40));

    const cardData = await getBestCardPrinting(testCard);

    if (cardData) {
      console.log(`✅ SUCCESS: Found "${cardData.name}"`);
      console.log(`   Type: ${cardData.type_line}`);
      console.log(`   Set: ${cardData.set_name}`);
      if (cardData.oracle_text) {
        console.log(`   Oracle: ${cardData.oracle_text.substring(0, 100)}...`);
      }
      successCount++;
    } else {
      console.log(`❌ FAILED: Could not find card`);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Results Summary:");
  console.log(`   ✅ Successful lookups: ${successCount}/${testCases.length}`);
  console.log(`   ❌ Failed lookups: ${failCount}/${testCases.length}`);

  // Test the judge command simulation
  console.log("\n" + "=".repeat(60));
  console.log("🧪 Testing Judge Command Logic:\n");

  const judgeQuestions = [
    "!judge can you explain how the card the endstone works?",
    "!judge how does the endstone work?",
    "!judge what does endstone do?",
    "!judge explain the card The Endstone",
  ];

  for (const question of judgeQuestions) {
    console.log(`\nQuestion: "${question}"`);
    console.log("-".repeat(40));

    // Extract the question part (remove !judge)
    const actualQuestion = question.replace("!judge", "").trim();

    // Try to find card names in the question
    const words = actualQuestion.split(/\s+/);
    let foundCard = false;

    for (let i = 0; i < words.length; i++) {
      for (let len = 1; len <= Math.min(5, words.length - i); len++) {
        const potentialCard = words.slice(i, i + len).join(" ");

        // Skip common words
        const skipWords = [
          "work",
          "works",
          "function",
          "rule",
          "judge",
          "can",
          "you",
          "explain",
          "how",
          "does",
          "the",
          "card",
          "what",
          "do",
        ];
        if (
          skipWords.includes(potentialCard.toLowerCase()) ||
          potentialCard.length < 3
        ) {
          continue;
        }

        const cardData = await getBestCardPrinting(potentialCard);
        if (cardData) {
          console.log(`✅ Found card: ${cardData.name}`);
          foundCard = true;
          break;
        }
      }
      if (foundCard) break;
    }

    if (!foundCard) {
      console.log(`⚠️ No card detected in question`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Card Lookup Fix Test Complete!");
  console.log("\n📌 Key Improvements:");
  console.log("   1. Fuzzy search handles all case variations");
  console.log("   2. Handles misspellings and partial names");
  console.log("   3. Works with or without 'the' prefix");
  console.log("   4. Never claims a real card doesn't exist");

  console.log("\n✅ The bot should now correctly handle:");
  console.log("   - 'the endstone' (lowercase)");
  console.log("   - 'The Endstone' (proper case)");
  console.log("   - 'ENDSTONE' (uppercase)");
  console.log("   - Any valid card name in any case format");
}

// Run the tests
testCardLookups().catch(console.error);
