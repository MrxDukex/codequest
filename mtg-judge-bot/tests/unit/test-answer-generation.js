const { OpenAI } = require("openai");
const config = require("../../config");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

async function testAnswerGeneration() {
  console.log("ANSWER GENERATION TEST");
  console.log("======================\n");

  const testCases = [
    {
      question: "how does The Ur-Dragon work?",
      cardName: "The Ur-Dragon",
      expectedKeywords: ["Eminence", "cost", "less", "Dragon"],
    },
    {
      question: "how does menace work?",
      cardName: null,
      expectedKeywords: ["blocked", "two", "creatures"],
    },
    {
      question: "explain Lightning Bolt",
      cardName: "Lightning Bolt",
      expectedKeywords: ["damage", "target", "3"],
    },
  ];

  for (const test of testCases) {
    console.log(`Testing: "${test.question}"`);

    try {
      // Simulate answer generation
      const prompt = `You are a Magic: The Gathering rules judge. Answer this question: "${
        test.question
      }"
      
      ${test.cardName ? `This is about the card: ${test.cardName}` : ""}
      
      Provide a clear, accurate answer.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert Magic: The Gathering rules judge providing accurate answers.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.0,
        max_tokens: 500,
      });

      const answer = response.choices[0].message.content;

      // Check if answer contains expected keywords
      const hasAllKeywords = test.expectedKeywords.every((keyword) =>
        answer.toLowerCase().includes(keyword.toLowerCase())
      );

      if (hasAllKeywords) {
        console.log("✅ PASS - Answer contains expected keywords");
      } else {
        console.log("❌ FAIL - Missing some expected keywords");
        console.log("Expected:", test.expectedKeywords);
      }

      console.log("Sample answer snippet:", answer.substring(0, 150) + "...\n");
    } catch (error) {
      console.log("⚠️ Test skipped - API error:", error.message);
    }
  }
}

// Run test
testAnswerGeneration().catch(console.error);
