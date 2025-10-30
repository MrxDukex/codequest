const { OpenAI } = require("openai");
const config = require("./config");
const fs = require("fs").promises;
const path = require("path");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

async function testConsistency() {
  console.log("🧪 Testing answer consistency for 'warp' mechanic...\n");

  // Load custom mechanics database
  const mechanicsPath = path.join(__dirname, "data", "customMechanics.json");
  const mechanicsData = await fs.readFile(mechanicsPath, "utf8");
  const customMechanics = JSON.parse(mechanicsData);
  const warpInfo = customMechanics.warp;

  // Test questions about warp
  const testQuestions = [
    "!judge can you explain warp",
    "!judge how does warp work?",
    "!judge can you explain to me how the warp effect works on the new cards that just came out for the edge of eternities set?",
  ];

  const answers = [];

  for (const question of testQuestions) {
    console.log(`📝 Testing: "${question}"`);

    // Simulate the bot's answer generation with the custom mechanics database
    const mechPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "${question.replace(
      "!judge ",
      ""
    )}"

Here is the official information about this mechanic:
Name: ${warpInfo.name}
Description: ${warpInfo.description}
Example: ${warpInfo.example}
Rulings: ${warpInfo.rulings.join("\n")}

Please provide a clear, accurate answer based on this official information. Be consistent with this definition.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert Magic: The Gathering rules judge. Always provide consistent, accurate answers based on the official information provided.",
        },
        {
          role: "user",
          content: mechPrompt,
        },
      ],
      temperature: 0.0, // Zero temperature for maximum consistency
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content;
    answers.push(answer);

    console.log("\n✅ Answer generated:");
    console.log("================");
    console.log(answer.substring(0, 200) + "...");
    console.log("================\n");
  }

  // Check consistency
  console.log("\n🔍 Checking consistency across answers...");

  // All answers should mention key aspects of warp
  const keyPhrases = ["warp cost", "exile", "warp counter", "next turn"];

  let allConsistent = true;

  for (let i = 0; i < answers.length; i++) {
    console.log(`\nAnswer ${i + 1} analysis:`);
    for (const phrase of keyPhrases) {
      const hasPhrase = answers[i].toLowerCase().includes(phrase);
      console.log(`  - Contains "${phrase}": ${hasPhrase ? "✅" : "❌"}`);
      if (!hasPhrase) allConsistent = false;
    }
  }

  if (allConsistent) {
    console.log(
      "\n✅ SUCCESS: All answers are consistent and contain key information about warp!"
    );
  } else {
    console.log(
      "\n⚠️ WARNING: Some answers may be missing key information. Review needed."
    );
  }

  // Test menace for comparison (should use comprehensive rules)
  console.log("\n\n🧪 Testing 'menace' mechanic for comparison...");
  const menaceQuestion = "how does menace work?";
  const menaceInfo = customMechanics.menace;

  const menacePrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "${menaceQuestion}"

Here is the official information about this mechanic:
Name: ${menaceInfo.name}
Description: ${menaceInfo.description}
Example: ${menaceInfo.example}
Comprehensive Rule: ${menaceInfo.comprehensiveRule}

Please provide a clear, accurate answer based on this official information.`;

  const menaceResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert Magic: The Gathering rules judge. Always provide consistent, accurate answers based on the official information provided.",
      },
      {
        role: "user",
        content: menacePrompt,
      },
    ],
    temperature: 0.0,
    max_tokens: 500,
  });

  console.log("\n✅ Menace answer:");
  console.log("================");
  console.log(menaceResponse.choices[0].message.content);
  console.log("================");

  console.log("\n✅ Consistency test complete!");
}

// Run the test
testConsistency().catch(console.error);
