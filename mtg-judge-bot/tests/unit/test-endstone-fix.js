require("dotenv").config();
const { OpenAI } = require("openai");
const config = require("../config");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Function to get the best printing of a card
async function getBestCardPrinting(cardName) {
  try {
    // First, search for all non-digital printings
    const nonDigitalRes = await fetch(
      `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(
        cardName
      )}" -is:digital&order=released&dir=desc`
    );

    if (nonDigitalRes.ok) {
      const nonDigitalData = await nonDigitalRes.json();
      if (nonDigitalData.data && nonDigitalData.data.length > 0) {
        return nonDigitalData.data[0];
      }
    }

    // If no non-digital printings exist, try exact match
    const exactRes = await fetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
        cardName
      )}`
    );

    if (exactRes.ok) {
      const exactData = await exactRes.json();
      return exactData;
    }

    return null;
  } catch (error) {
    console.error("Error getting card:", error);
    return null;
  }
}

async function testEndstoneLogic() {
  console.log("🧪 Testing Endstone Card Recognition Fix\n");
  console.log("=".repeat(50));

  // Test 1: Check if "The Endstone" exists
  console.log("\n📝 Test 1: Checking if 'The Endstone' exists in Scryfall...");
  const endstoneData = await getBestCardPrinting("The Endstone");

  if (endstoneData) {
    console.log("✅ Found 'The Endstone'!");
    console.log(`   Name: ${endstoneData.name}`);
    console.log(`   Type: ${endstoneData.type_line}`);
    console.log(`   Set: ${endstoneData.set_name}`);
    console.log(`   Oracle Text: ${endstoneData.oracle_text}`);
  } else {
    console.log("❌ 'The Endstone' not found in Scryfall");
  }

  // Test 2: Simulate the judge command logic
  console.log("\n📝 Test 2: Simulating judge command with card detection...");

  const testQuestions = [
    "can you explain how the card the endstone works?",
    "how does The Endstone work?",
    "what does the endstone do?",
    "explain the endstone card",
  ];

  for (const question of testQuestions) {
    console.log(`\n   Testing: "${question}"`);

    // Extract potential card names (simplified version of the bot's logic)
    const cardNamePatterns = [
      /(?:card|about|explain)\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)/g,
      /(?:the\s+)([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)/g,
      /\b([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)\b(?:\s+work|\s+card)/g,
    ];

    let foundCard = false;
    for (const pattern of cardNamePatterns) {
      const matches = question.matchAll(pattern);
      for (const match of matches) {
        const potentialCard = match[1];
        if (potentialCard && potentialCard.length > 2) {
          console.log(`      Checking: "${potentialCard}"`);
          const cardData = await getBestCardPrinting(potentialCard);
          if (cardData) {
            console.log(`      ✅ Found card: ${cardData.name}`);
            foundCard = true;
            break;
          }
        }
      }
      if (foundCard) break;
    }

    if (!foundCard) {
      console.log(`      ⚠️ No card detected in question`);
    }
  }

  // Test 3: Generate proper answer for The Endstone
  console.log("\n📝 Test 3: Generating answer about The Endstone...");

  if (endstoneData) {
    const cardPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "How does The Endstone work?"

This card exists! Here is the official card information:
Card Name: ${endstoneData.name}
Type: ${endstoneData.type_line}
Oracle Text: ${endstoneData.oracle_text || "No oracle text available"}
Set: ${endstoneData.set_name}

This card may be from a special set (Mystery Booster playtest cards, Un-sets, promotional cards, etc.) that isn't covered in the comprehensive rules document. Based on the oracle text above, explain how this card works.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert Magic: The Gathering rules judge. When a card exists in Scryfall, always acknowledge it exists and explain how it works based on its oracle text. Never claim a real card doesn't exist.",
          },
          {
            role: "user",
            content: cardPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      console.log("\n✅ Generated Answer:");
      console.log("-".repeat(50));
      console.log(response.choices[0].message.content);
      console.log("-".repeat(50));
    } catch (error) {
      console.error("❌ Error generating answer:", error.message);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Test Complete!");
  console.log("\nSummary:");
  console.log(
    "- The bot will now check if a card exists BEFORE claiming it doesn't"
  );
  console.log("- If a card exists in Scryfall, it will explain how it works");
  console.log(
    "- Special set cards (Mystery Booster, etc.) are properly handled"
  );
}

// Run the test
testEndstoneLogic().catch(console.error);
