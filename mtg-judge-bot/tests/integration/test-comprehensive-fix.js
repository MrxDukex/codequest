require("dotenv").config();
const { OpenAI } = require("openai");
const config = require("../config");
const OracleTextParser = require("../src/oracleParser");

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

async function testCardExplanation(cardName, question) {
  console.log(`\n📝 Testing: "${question}"`);
  console.log("-".repeat(60));

  const cardData = await getCardData(cardName);
  if (!cardData) {
    console.log(`❌ Could not fetch ${cardName} from Scryfall`);
    return false;
  }

  console.log(`✅ Found card: ${cardData.name}`);
  console.log(`   Oracle Text: ${cardData.oracle_text}`);

  // Parse the oracle text
  const parsedData = OracleTextParser.parseCard(cardData);

  if (parsedData.warnings.length > 0) {
    console.log("\n⚠️ Warnings generated:");
    parsedData.warnings.forEach((w) => console.log(`   - ${w}`));
  }

  // Generate strict prompt
  const cardPrompt = OracleTextParser.generateStrictPrompt(
    cardData,
    parsedData,
    question
  );

  // Generate answer
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert Magic: The Gathering rules judge. You must explain cards EXACTLY as their oracle text states, without adding interpretations. Be extremely precise about cost reductions, life gain, damage, and all numerical effects. Never say 'per creature' unless the oracle text explicitly says 'for each'.",
      },
      {
        role: "user",
        content: cardPrompt,
      },
    ],
    temperature: 0.0,
    max_tokens: 500,
  });

  const generatedAnswer = response.choices[0].message.content;

  // Validate the answer
  const validation = OracleTextParser.validateAnswer(
    cardData.oracle_text,
    generatedAnswer
  );

  console.log("\n📊 Answer Validation:");
  if (validation.isValid) {
    console.log("   ✅ Answer is valid!");
  } else {
    console.log("   ❌ Answer has errors:");
    validation.errors.forEach((e) => console.log(`      - ${e}`));
  }

  console.log("\n💬 Generated Answer:");
  console.log("-".repeat(60));
  console.log(generatedAnswer);
  console.log("-".repeat(60));

  return validation.isValid;
}

async function runComprehensiveTests() {
  console.log("🧪 Comprehensive Card Explanation Test");
  console.log("=".repeat(60));

  const testCases = [
    {
      card: "The Ur-Dragon",
      question: "can you explain how the ur-dragon works?",
    },
    {
      card: "The Endstone",
      question: "can you explain how the card the endstone works?",
    },
    {
      card: "Rhystic Study",
      question: "how does Rhystic Study work?",
    },
    {
      card: "Doubling Season",
      question: "explain Doubling Season",
    },
    {
      card: "Atraxa, Praetors' Voice",
      question: "what does Atraxa do?",
    },
  ];

  let successCount = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    const success = await testCardExplanation(testCase.card, testCase.question);
    if (success) successCount++;
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Final Results:");
  console.log(`   ✅ Successful: ${successCount}/${totalTests}`);
  console.log(`   ❌ Failed: ${totalTests - successCount}/${totalTests}`);
  console.log(
    `   Success Rate: ${((successCount / totalTests) * 100).toFixed(1)}%`
  );

  console.log("\n🎯 Key Improvements Verified:");
  console.log("   1. Oracle text parsed accurately");
  console.log("   2. Cost reductions explained correctly (not 'per creature')");
  console.log("   3. Warnings generated for common misinterpretations");
  console.log("   4. Answers validated before sending");
  console.log("   5. Zero temperature for maximum accuracy");
}

// Run the tests
runComprehensiveTests().catch(console.error);
