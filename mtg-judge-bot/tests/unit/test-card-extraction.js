/**
 * Test card name extraction from questions
 * This tests the patterns used in the !judge command
 */

// Test the current extraction logic
function extractCardName(question) {
  const lowerQuestion = question.toLowerCase();

  // Remove common question phrases first
  let cleanedQuestion = lowerQuestion;
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

  // Current patterns from index.js
  const cardPatterns = [
    /\bcard\s+(the\s+)?([a-z\s]+?)(?:\s|$)/i,
    /\bthe\s+([a-z]+(?:\s+[a-z]+)?)\b/i,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/, // Capitalized words
  ];

  let potentialCardName = null;
  for (const pattern of cardPatterns) {
    const match = cleanedQuestion.match(pattern);
    if (match) {
      potentialCardName = match[match.length - 1].trim();
      // Skip if it's a common word
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
        !skipWords.includes(potentialCardName.toLowerCase()) &&
        potentialCardName.length > 2
      ) {
        return potentialCardName;
      }
    }
  }

  return null;
}

// Improved extraction logic
function improvedExtractCardName(question) {
  const originalQuestion = question;
  const lowerQuestion = question.toLowerCase();

  // Pattern 1: "how does [Card Name] work?" - most common
  let match = originalQuestion.match(
    /how (?:does|do)\s+(.+?)\s+(?:work|function)/i
  );
  if (match) {
    return match[1].trim();
  }

  // Pattern 2: "explain [Card Name]"
  match = originalQuestion.match(/explain\s+(.+?)(?:\s*$|\s*\?)/i);
  if (match) {
    return match[1].trim();
  }

  // Pattern 3: "what does [Card Name] do"
  match = originalQuestion.match(/what (?:does|do|is)\s+(.+?)\s+(?:do|mean)/i);
  if (match) {
    return match[1].trim();
  }

  // Pattern 4: "[Card Name] ruling" or "ruling on [Card Name]"
  match = originalQuestion.match(/(?:^|\s)(.+?)\s+ruling/i);
  if (match) {
    return match[1].trim();
  }
  match = originalQuestion.match(/ruling (?:on|for)\s+(.+?)(?:\s*$|\s*\?)/i);
  if (match) {
    return match[1].trim();
  }

  // Pattern 5: Questions ending with card name
  // Remove common question starters and see what's left
  let cleaned = originalQuestion;
  const questionStarters = [
    /^how (?:does|do)\s+/i,
    /^what (?:does|do|is)\s+/i,
    /^explain\s+/i,
    /^can you explain\s+/i,
    /^tell me about\s+/i,
  ];

  for (const starter of questionStarters) {
    cleaned = cleaned.replace(starter, "");
  }

  // Remove trailing question words
  cleaned = cleaned.replace(/\s+(?:work|do|mean|function)s?\??$/i, "");
  cleaned = cleaned.trim();

  // If what's left looks like a card name, return it
  if (cleaned.length > 2 && cleaned.length < 50) {
    return cleaned;
  }

  return null;
}

// Test cases
const testCases = [
  {
    question: "!judge how does Urza's Saga work?",
    expected: "Urza's Saga",
  },
  {
    question: "!judge explain Oko, Thief of Crowns",
    expected: "Oko, Thief of Crowns",
  },
  {
    question: "!judge how does Jace, the Mind Sculptor work?",
    expected: "Jace, the Mind Sculptor",
  },
  {
    question: "!judge what does Shu Yun, the Silent Tempest do?",
    expected: "Shu Yun, the Silent Tempest",
  },
  {
    question: "!judge explain Asmoranomardicadaistinaculdacar",
    expected: "Asmoranomardicadaistinaculdacar",
  },
  {
    question: "!judge how does Nicol Bolas, Dragon-God work?",
    expected: "Nicol Bolas, Dragon-God",
  },
  {
    question: "!judge how does The Ur-Dragon work?",
    expected: "The Ur-Dragon",
  },
  {
    question: "!judge how does Goblin Warchief work?",
    expected: "Goblin Warchief",
  },
];

console.log("TESTING CURRENT EXTRACTION LOGIC");
console.log("================================\n");

let currentFailures = 0;
testCases.forEach((test) => {
  // Remove "!judge " prefix for testing
  const question = test.question.replace("!judge ", "");
  const extracted = extractCardName(question);
  const success = extracted === test.expected;

  console.log(`Question: "${question}"`);
  console.log(`Expected: "${test.expected}"`);
  console.log(`Extracted: "${extracted}"`);
  console.log(success ? "✅ PASS" : "❌ FAIL");
  if (!success) currentFailures++;
  console.log();
});

console.log("\nTESTING IMPROVED EXTRACTION LOGIC");
console.log("==================================\n");

let improvedFailures = 0;
testCases.forEach((test) => {
  // Remove "!judge " prefix for testing
  const question = test.question.replace("!judge ", "");
  const extracted = improvedExtractCardName(question);
  const success = extracted === test.expected;

  console.log(`Question: "${question}"`);
  console.log(`Expected: "${test.expected}"`);
  console.log(`Extracted: "${extracted}"`);
  console.log(success ? "✅ PASS" : "❌ FAIL");
  if (!success) improvedFailures++;
  console.log();
});

console.log("\n" + "=".repeat(60));
console.log("RESULTS SUMMARY");
console.log("=".repeat(60));
console.log(
  `Current Logic: ${currentFailures} failures out of ${testCases.length} tests`
);
console.log(
  `Improved Logic: ${improvedFailures} failures out of ${testCases.length} tests`
);

if (improvedFailures === 0) {
  console.log("\n✅ IMPROVED LOGIC PASSES ALL TESTS!");
  console.log("\nThe fix will:");
  console.log("1. Handle apostrophes (Urza's Saga)");
  console.log("2. Handle commas (Oko, Thief of Crowns)");
  console.log("3. Handle 'the' in names (Jace, the Mind Sculptor)");
  console.log("4. Handle hyphens (Nicol Bolas, Dragon-God)");
  console.log("5. Handle long names (Asmoranomardicadaistinaculdacar)");
} else {
  console.log("\n❌ Improved logic still has issues, needs refinement");
}
