// Script to identify and fix the multiple response issue

const fs = require("fs").promises;
const path = require("path");

async function analyzeAndFix() {
  console.log("🔧 MTG Judge Bot Issue Fixer");
  console.log("==============================\n");

  // Issue 1: Multiple Responses
  console.log("📌 Issue 1: Multiple Responses");
  console.log("Likely causes:");
  console.log("1. Multiple event listeners registered");
  console.log("2. Bot responding to its own messages");
  console.log("3. Message edits triggering new responses");
  console.log("\nFix: Adding response tracking and deduplication\n");

  // Issue 2: Incorrect Answers
  console.log("📌 Issue 2: Incorrect Answers");
  console.log("Problem: The bot may be misinterpreting card abilities");
  console.log("Fix: Enhanced validation and answer generation\n");

  // Create patches for the index.js file
  const patches = [
    {
      name: "Add response tracking",
      code: `
// Add at the top of the file after initializations
const processedMessages = new Set();
const responseInProgress = new Set();
      `,
    },
    {
      name: "Prevent duplicate responses",
      code: `
// Add this check at the beginning of messageCreate handler
if (processedMessages.has(message.id)) {
  console.log(\`[DUPLICATE] Already processed message \${message.id}\`);
  return;
}

if (responseInProgress.has(message.channel.id)) {
  console.log(\`[IN PROGRESS] Response already in progress for channel \${message.channel.id}\`);
  return;
}

processedMessages.add(message.id);
responseInProgress.add(message.channel.id);

// Clean up after 10 seconds
setTimeout(() => {
  processedMessages.delete(message.id);
  responseInProgress.delete(message.channel.id);
}, 10000);
      `,
    },
    {
      name: "Fix answer accuracy",
      code: `
// Enhanced answer validation
function validateAndFixAnswer(answer, cardData) {
  // Remove any duplicate sentences
  const sentences = answer.split('. ');
  const uniqueSentences = [...new Set(sentences)];
  
  // Ensure accuracy for card abilities
  if (cardData && cardData.oracle_text) {
    // Check for common misinterpretations
    if (cardData.oracle_text.includes("for each")) {
      // Make sure "for each" is not interpreted as "per"
      answer = answer.replace(/per creature/gi, "for each creature");
    }
    
    if (cardData.oracle_text.includes("costs") && cardData.oracle_text.includes("less")) {
      // Ensure cost reduction is accurate
      const match = cardData.oracle_text.match(/costs? \\{(\\d+)\\} less/);
      if (match) {
        const amount = match[1];
        answer = answer.replace(/costs? \\d+ less/gi, \`costs {\${amount}} less\`);
      }
    }
  }
  
  return uniqueSentences.join('. ');
}
      `,
    },
  ];

  console.log("📝 Patches to apply:");
  patches.forEach((patch, i) => {
    console.log(`\n${i + 1}. ${patch.name}`);
    console.log("   Code preview:", patch.code.substring(0, 100) + "...");
  });

  console.log("\n✅ Fixes identified and ready to apply");
  console.log("\n📌 Next steps:");
  console.log("1. Apply response deduplication");
  console.log("2. Add message tracking");
  console.log("3. Enhance answer validation");
  console.log("4. Test with the problematic questions");
}

analyzeAndFix().catch(console.error);
