/**
 * Test script for the enhanced mana symbol system
 */

const manaSymbols = require("../src/manaSymbols");

console.log("🧪 Testing Enhanced Mana Symbol System\n");
console.log("=".repeat(60));

// Test cases for mana cost conversion
const testManaCosts = [
  { input: "{2}{R}{R}", name: "Goblin Warchief" },
  { input: "{1}{R}", name: "Lightning Bolt alternative" },
  { input: "{W}{U}{B}{R}{G}", name: "Five-color" },
  { input: "{X}{R}{R}", name: "Fireball" },
  { input: "{2/W}{2/U}", name: "Twobrid mana" },
  { input: "{W/U}{W/B}", name: "Hybrid mana" },
  { input: "{B/P}{R/P}", name: "Phyrexian mana" },
  { input: "{C}{C}", name: "Colorless mana" },
  { input: "{T}", name: "Tap symbol" },
  { input: "{S}", name: "Snow mana" },
  { input: "{0}", name: "Zero mana" },
  { input: "{10}{R}{R}", name: "High cost spell" },
  { input: "{∞}", name: "Infinity mana" },
];

console.log("\n📊 Mana Cost Conversions:\n");
console.log("-".repeat(60));

for (const test of testManaCosts) {
  const converted = manaSymbols.getDisplayManaCost(test.input);
  console.log(
    `${test.name.padEnd(25)} ${test.input.padEnd(20)} → ${converted}`
  );
}

// Test oracle text formatting
console.log("\n📝 Oracle Text Formatting:\n");
console.log("-".repeat(60));

const testOracleTexts = [
  {
    name: "Goblin Warchief",
    text: "Goblin spells you cast cost {1} less to cast. Goblins you control have haste.",
  },
  {
    name: "Lightning Bolt",
    text: "Lightning Bolt deals 3 damage to any target.",
  },
  {
    name: "Skirk Prospector",
    text: "Sacrifice a Goblin: Add {R}.",
  },
  {
    name: "Complex ability",
    text: "Flying, vigilance, trample\n{T}: Add {W}{U}{B}{R}{G}.\nWard {2}",
  },
];

for (const test of testOracleTexts) {
  console.log(`\n${test.name}:`);
  console.log("Original: " + test.text);
  const formatted = manaSymbols.formatOracleText(test.text);
  console.log("Formatted: " + formatted);
}

// Test SVG URL generation
console.log("\n🔗 SVG URLs for Symbols:\n");
console.log("-".repeat(60));

const symbolsToTest = ["{W}", "{U}", "{B}", "{R}", "{G}", "{C}", "{1}", "{T}"];
for (const symbol of symbolsToTest) {
  const url = manaSymbols.getSvgUrl(symbol);
  console.log(`${symbol} → ${url}`);
}

// Test CMC calculation
console.log("\n🔢 CMC Calculations:\n");
console.log("-".repeat(60));

const cmcTests = [
  { cost: "{2}{R}{R}", expected: 4 },
  { cost: "{W}{U}{B}{R}{G}", expected: 5 },
  { cost: "{X}{R}{R}", expected: 2 },
  { cost: "{2/W}{2/U}", expected: 4 },
  { cost: "{W/U}{W/B}", expected: 2 },
  { cost: "{B/P}{R/P}", expected: 2 },
  { cost: "{HW}{HR}", expected: 1 },
  { cost: "{0}", expected: 0 },
];

for (const test of cmcTests) {
  const cmc = manaSymbols.calculateCMC(test.cost);
  const status = cmc === test.expected ? "✅" : "❌";
  console.log(
    `${test.cost.padEnd(20)} CMC: ${cmc} (expected ${test.expected}) ${status}`
  );
}

// Test symbol extraction
console.log("\n🔍 Symbol Extraction:\n");
console.log("-".repeat(60));

const textWithSymbols =
  "Pay {2}{R} or {1}{R}{R}: Deal 3 damage. Activate only if you control a creature with power 4 or greater.";
const extracted = manaSymbols.extractManaSymbols(textWithSymbols);
console.log("Text:", textWithSymbols);
console.log("Extracted symbols:", extracted);

// Display all available symbols
console.log(
  "\n📚 All Available Symbols: " + manaSymbols.getAllSymbols().length + " total"
);

console.log("\n" + "=".repeat(60));
console.log("✅ Mana symbol system test complete!");
console.log("\nThe new system provides:");
console.log("• Better Unicode representations for all mana symbols");
console.log("• SVG image URLs from Scryfall");
console.log("• Keyword ability icons");
console.log("• CMC calculation");
console.log("• Symbol extraction and validation");
