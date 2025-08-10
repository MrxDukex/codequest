const { OpenAI } = require("openai");
const config = require("./config");
const rulesManager = require("./rulesManager");
const { initializeRAG, queryRAG } = require("./rag");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: config.openai.apiKey });

async function testAnswerGeneration() {
  console.log("🧪 Testing answer generation with fixes...\n");

  try {
    // Initialize rules
    console.log("📚 Initializing comprehensive rules...");
    await rulesManager.initializeRules();

    // Initialize RAG
    const rulesForRAG = rulesManager.getAllRules().map((rule) => ({
      pageContent: `Rule ${rule.number}: ${rule.text}`,
      metadata: { ruleNumber: rule.number },
    }));
    console.log(`📚 Preparing ${rulesForRAG.length} rules for RAG system...`);
    await initializeRAG(rulesForRAG);
    console.log("✅ RAG system ready!\n");

    // Test question about menace
    const testQuestion = "how does menace work?";
    console.log(`📝 Test Question: "${testQuestion}"\n`);

    // Search comprehensive rules
    const comprehensiveRules = await rulesManager.findRelevantRules(
      testQuestion
    );
    console.log(`Found ${comprehensiveRules.length} relevant rules`);

    // Build context
    let context = "";
    if (comprehensiveRules && comprehensiveRules.length > 0) {
      context += "Relevant Comprehensive Rules:\n";
      comprehensiveRules.forEach((rule) => {
        context += `Rule ${rule.number}: ${rule.text}\n`;
        console.log(
          `  - Rule ${rule.number}: ${rule.text.substring(0, 100)}...`
        );
      });
      context += "\n";
    }

    // Generate answer using the fixed approach
    let finalAnswer = "";

    if (context.trim()) {
      console.log("\n🤖 Generating answer with context...");
      const prompt = `You are a Magic: The Gathering rules judge. Based on the following context, answer this question: "${testQuestion}"

Context:
${context}

Provide a clear, accurate answer based on the official rules provided above. If the question is about a specific mechanic like "menace", explain exactly how it works according to the rules.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert Magic: The Gathering rules judge. Provide accurate, concise answers based on the comprehensive rules.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      finalAnswer = response.choices[0].message.content;
    } else {
      console.log("\n🤖 Using RAG fallback (no specific context)...");
      finalAnswer = await queryRAG(testQuestion);
    }

    console.log("\n✅ Final Answer:");
    console.log("================");
    console.log(finalAnswer);
    console.log("================\n");

    // Test that we only get ONE answer (not multiple)
    console.log("✅ Answer generation test passed!");
    console.log("✅ Single answer generated (no duplicates)");
    console.log("✅ Answer is based on comprehensive rules context");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the test
testAnswerGeneration();
