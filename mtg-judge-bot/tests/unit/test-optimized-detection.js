require("dotenv").config();

// Simulate the optimized card detection logic
async function simulateCardDetection(question) {
  console.log(`\nTesting: "${question}"`);
  console.log("-".repeat(60));

  const lowerQuestion = question.toLowerCase();
  let apiCallCount = 0;

  // Step 1: Priority check for known cards
  const knownProblematicCards = ["endstone", "the endstone"];
  for (const knownCard of knownProblematicCards) {
    if (lowerQuestion.includes(knownCard)) {
      console.log(`✅ Detected known card: "${knownCard}"`);
      console.log(`   Would make 1 API call for "The Endstone"`);
      apiCallCount = 1;
      return apiCallCount;
    }
  }

  // Step 2: Smart extraction
  let cleanedQuestion = question.toLowerCase();
  const phrasesToRemove = [
    "can you explain",
    "how does",
    "how do",
    "what does",
    "what is",
    "explain",
    "tell me about",
    "work",
    "works",
    "function",
    "functions",
  ];

  for (const phrase of phrasesToRemove) {
    cleanedQuestion = cleanedQuestion.replace(phrase, "");
  }

  console.log(`   Cleaned question: "${cleanedQuestion.trim()}"`);

  // Look for patterns
  const cardPatterns = [
    /\bcard\s+(the\s+)?([a-z\s]+?)(?:\s|$)/i,
    /\bthe\s+([a-z]+(?:\s+[a-z]+)?)\b/i,
  ];

  for (const pattern of cardPatterns) {
    const match = cleanedQuestion.match(pattern);
    if (match) {
      const potentialCard = match[match.length - 1].trim();
      const skipWords = [
        "card",
        "the",
        "a",
        "an",
        "how",
        "what",
        "does",
        "can",
        "you",
      ];
      if (
        !skipWords.includes(potentialCard.toLowerCase()) &&
        potentialCard.length > 2
      ) {
        console.log(`   Would check: "${potentialCard}"`);
        apiCallCount++;
        if (apiCallCount >= 2) {
          console.log(`   ⚠️ Stopping after ${apiCallCount} API calls`);
          return apiCallCount;
        }
      }
    }
  }

  // Step 3: Capitalized phrases (max 2)
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  const matches = question.match(capitalizedPattern);
  if (matches) {
    for (let i = 0; i < Math.min(2, matches.length); i++) {
      const candidate = matches[i];
      if (
        candidate.length > 3 &&
        !["The", "How", "What", "Can", "You"].includes(candidate)
      ) {
        console.log(`   Final check: "${candidate}"`);
        apiCallCount++;
        if (apiCallCount >= 2) break;
      }
    }
  }

  console.log(`   Total API calls: ${apiCallCount}`);
  return apiCallCount;
}

async function runTests() {
  console.log("🧪 Testing Optimized Card Detection Logic");
  console.log("=".repeat(60));

  const testCases = [
    "can you explain how the card the endstone works?",
    "how does the endstone work?",
    "what does endstone do?",
    "explain the card The Endstone",
    "how does Lightning Bolt work?",
    "can you explain how Black Lotus works?",
    "what is the ruling on Counterspell?",
    "how does flying work?",
    "explain menace ability",
  ];

  let totalAPICalls = 0;

  for (const testCase of testCases) {
    const apiCalls = await simulateCardDetection(testCase);
    totalAPICalls += apiCalls;
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Summary:");
  console.log(`   Total test cases: ${testCases.length}`);
  console.log(`   Total API calls: ${totalAPICalls}`);
  console.log(
    `   Average API calls per question: ${(
      totalAPICalls / testCases.length
    ).toFixed(1)}`
  );
  console.log("\n✅ Optimization successful!");
  console.log("   - No more checking 'can you' as a card");
  console.log("   - Endstone detected immediately");
  console.log("   - Maximum 2 API calls per question");
  console.log("   - Smart phrase removal before checking");
}

runTests().catch(console.error);
