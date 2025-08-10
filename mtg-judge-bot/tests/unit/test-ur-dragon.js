require("dotenv").config();
const { OpenAI } = require("openai");
const config = require("../config");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Function to get card data from Scryfall
async function getCardData(cardName) {
  try {
    const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
      cardName
    )}`;
    const fuzzyRes = await fetch(fuzzyUrl);

    if (fuzzyRes.ok) {
      const cardData = await fuzzyRes.json();
      return cardData;
    }
    return null;
  } catch (error) {
    console.error("Error getting card:", error);
    return null;
  }
}

async function testUrDragon() {
  console.log("🧪 Testing The Ur-Dragon Answer Generation\n");
  console.log("=".repeat(60));

  // Get The Ur-Dragon data
  const urDragonData = await getCardData("The Ur-Dragon");

  if (!urDragonData) {
    console.log("❌ Could not fetch The Ur-Dragon from Scryfall");
    return;
  }

  console.log("✅ Found The Ur-Dragon!");
  console.log(`   Name: ${urDragonData.name}`);
  console.log(`   Type: ${urDragonData.type_line}`);
  console.log(`   Oracle Text: ${urDragonData.oracle_text}`);
  console.log("\n" + "=".repeat(60));

  // Test the current prompt that's causing issues
  console.log("\n📝 Testing CURRENT prompt (the problematic one):");

  const currentPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "can you explain how the ur-dragon works?"

This card exists! Here is the official card information:
Card Name: ${urDragonData.name}
Type: ${urDragonData.type_line}
Oracle Text: ${urDragonData.oracle_text || "No oracle text available"}
Set: ${urDragonData.set_name}

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
          content: currentPrompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    console.log("\n❌ Current Answer (INCORRECT):");
    console.log("-".repeat(60));
    console.log(response.choices[0].message.content);
    console.log("-".repeat(60));
  } catch (error) {
    console.error("Error generating answer:", error.message);
  }

  // Test an improved prompt
  console.log("\n📝 Testing IMPROVED prompt (more explicit):");

  const improvedPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "can you explain how the ur-dragon works?"

IMPORTANT: Read the oracle text EXACTLY as written and explain ONLY what it says. Do not add interpretations or assumptions.

Card Name: ${urDragonData.name}
Type: ${urDragonData.type_line}
Oracle Text: ${urDragonData.oracle_text}
Set: ${urDragonData.set_name}

Please explain this card's abilities EXACTLY as written in the oracle text:
1. The Eminence ability says "other Dragon spells you cast cost {1} less to cast" - this means ALL other Dragon spells cost exactly {1} generic mana less, NOT {1} less per Dragon you control.
2. The triggered ability when Dragons attack.

Be precise and accurate. Do not confuse cost reduction amounts.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Magic: The Gathering rules judge. You must explain cards EXACTLY as their oracle text states, without adding interpretations. Be extremely precise about cost reductions and ability effects.",
        },
        {
          role: "user",
          content: improvedPrompt,
        },
      ],
      temperature: 0.0, // Zero temperature for maximum accuracy
      max_tokens: 500,
    });

    console.log("\n✅ Improved Answer (SHOULD BE CORRECT):");
    console.log("-".repeat(60));
    console.log(response.choices[0].message.content);
    console.log("-".repeat(60));
  } catch (error) {
    console.error("Error generating answer:", error.message);
  }

  // Test with direct oracle text parsing
  console.log("\n📝 Testing DIRECT PARSING approach:");

  const parsingPrompt = `Parse and explain this Magic: The Gathering card's oracle text line by line:

"${urDragonData.oracle_text}"

For each ability, state EXACTLY what it does without interpretation:
- If it says "cost {1} less" that means exactly one generic mana less, not per creature
- State each ability separately
- Be literal and precise`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a precise Magic: The Gathering oracle text parser. Explain abilities EXACTLY as written, with no interpretation or embellishment.",
        },
        {
          role: "user",
          content: parsingPrompt,
        },
      ],
      temperature: 0.0,
      max_tokens: 500,
    });

    console.log("\n✅ Direct Parsing Answer:");
    console.log("-".repeat(60));
    console.log(response.choices[0].message.content);
    console.log("-".repeat(60));
  } catch (error) {
    console.error("Error generating answer:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎯 Analysis:");
  console.log(
    "The bot is misinterpreting '{1} less to cast' as '{1} per Dragon'"
  );
  console.log(
    "This is a GPT interpretation error that needs explicit correction"
  );
  console.log(
    "\nSolution: Use more explicit prompts that clarify cost reduction"
  );
}

// Run the test
testUrDragon().catch(console.error);
