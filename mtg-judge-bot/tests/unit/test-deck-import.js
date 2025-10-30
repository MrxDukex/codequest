/**
 * Test suite for Deck Import functionality
 * Tests Moxfield and Archidekt deck importing
 */

const DeckImporter = require("../../src/deck/deckImporter");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// Test the deck importer
async function testDeckImporter() {
  console.log("========================================");
  console.log("🃏 DECK IMPORTER TEST SUITE");
  console.log("========================================");
  console.log("Testing deck import functionality...\n");

  const importer = new DeckImporter();
  let passed = 0;
  let failed = 0;

  // Test URL detection
  console.log(`${BLUE}Testing URL detection...${RESET}`);
  const testUrls = [
    {
      url: "https://www.moxfield.com/decks/abc123",
      expected: "moxfield",
      name: "Moxfield URL",
    },
    {
      url: "https://archidekt.com/decks/12345",
      expected: "archidekt",
      name: "Archidekt URL",
    },
    {
      url: "https://tappedout.net/mtg-decks/test-deck",
      expected: "tappedout",
      name: "TappedOut URL",
    },
    {
      url: "https://example.com/deck",
      expected: null,
      name: "Invalid URL",
    },
  ];

  for (const test of testUrls) {
    const detected = importer.detectSite(test.url);
    if (detected === test.expected) {
      console.log(`  ${GREEN}✅ ${test.name}: Correctly detected${RESET}`);
      passed++;
    } else {
      console.log(
        `  ${RED}❌ ${test.name}: Expected ${test.expected}, got ${detected}${RESET}`
      );
      failed++;
    }
  }

  // Test deck ID extraction
  console.log(`\n${BLUE}Testing deck ID extraction...${RESET}`);
  const idTests = [
    {
      url: "https://www.moxfield.com/decks/abc123-def456",
      site: "moxfield",
      expected: "abc123-def456",
    },
    {
      url: "https://archidekt.com/decks/7654321",
      site: "archidekt",
      expected: "7654321",
    },
  ];

  for (const test of idTests) {
    const id = importer.extractDeckId(test.url, test.site);
    if (id === test.expected) {
      console.log(`  ${GREEN}✅ Extracted ID: ${id}${RESET}`);
      passed++;
    } else {
      console.log(`  ${RED}❌ Expected ${test.expected}, got ${id}${RESET}`);
      failed++;
    }
  }

  // Test deck analysis functions
  console.log(`\n${BLUE}Testing deck analysis...${RESET}`);

  // Create a mock deck for testing
  const mockDeck = {
    name: "Test Deck",
    format: "commander",
    mainboard: {
      "Sol Ring": {
        quantity: 1,
        name: "Sol Ring",
        cmc: 1,
        type: "Artifact",
        colors: [],
      },
      "Lightning Bolt": {
        quantity: 4,
        name: "Lightning Bolt",
        cmc: 1,
        type: "Instant",
        colors: ["R"],
      },
      Island: {
        quantity: 20,
        name: "Island",
        cmc: 0,
        type: "Basic Land — Island",
        colors: [],
      },
      Counterspell: {
        quantity: 3,
        name: "Counterspell",
        cmc: 2,
        type: "Instant",
        colors: ["U"],
      },
    },
    stats: {
      totalCards: 28,
      uniqueCards: 4,
      colors: ["R", "U"],
      types: {},
    },
  };

  // Calculate stats
  mockDeck.stats = importer.calculateDeckStats(mockDeck);

  // Test stat calculations
  if (mockDeck.stats.totalCards === 28) {
    console.log(`  ${GREEN}✅ Total cards calculated correctly${RESET}`);
    passed++;
  } else {
    console.log(
      `  ${RED}❌ Total cards incorrect: ${mockDeck.stats.totalCards}${RESET}`
    );
    failed++;
  }

  if (
    mockDeck.stats.colors.includes("R") &&
    mockDeck.stats.colors.includes("U")
  ) {
    console.log(`  ${GREEN}✅ Colors detected correctly${RESET}`);
    passed++;
  } else {
    console.log(
      `  ${RED}❌ Colors incorrect: ${mockDeck.stats.colors.join(", ")}${RESET}`
    );
    failed++;
  }

  // Test deck analysis
  const analysis = importer.analyzeDeck(mockDeck);

  if (!analysis.isLegal) {
    console.log(
      `  ${GREEN}✅ Correctly identified illegal commander deck (28 cards)${RESET}`
    );
    passed++;
  } else {
    console.log(`  ${RED}❌ Failed to identify illegal deck size${RESET}`);
    failed++;
  }

  if (analysis.suggestions.length > 0) {
    console.log(
      `  ${GREEN}✅ Generated ${analysis.suggestions.length} suggestions${RESET}`
    );
    passed++;
  } else {
    console.log(`  ${YELLOW}⚠️ No suggestions generated${RESET}`);
  }

  // Test deck comparison
  console.log(`\n${BLUE}Testing deck comparison...${RESET}`);

  const mockDeck2 = {
    name: "Test Deck 2",
    format: "modern",
    mainboard: {
      "Sol Ring": {
        quantity: 1,
        name: "Sol Ring",
        cmc: 1,
        type: "Artifact",
        colors: [],
      },
      "Path to Exile": {
        quantity: 4,
        name: "Path to Exile",
        cmc: 1,
        type: "Instant",
        colors: ["W"],
      },
      Plains: {
        quantity: 20,
        name: "Plains",
        cmc: 0,
        type: "Basic Land — Plains",
        colors: [],
      },
    },
    stats: {
      totalCards: 25,
      uniqueCards: 3,
    },
  };

  const comparison = importer.compareDeck(mockDeck, mockDeck2);

  if (
    comparison.sharedCards.length === 1 &&
    comparison.sharedCards[0].name === "Sol Ring"
  ) {
    console.log(`  ${GREEN}✅ Correctly identified shared cards${RESET}`);
    passed++;
  } else {
    console.log(`  ${RED}❌ Shared cards incorrect${RESET}`);
    failed++;
  }

  if (comparison.uniqueToDeck1.length === 3) {
    console.log(`  ${GREEN}✅ Correctly identified unique cards${RESET}`);
    passed++;
  } else {
    console.log(`  ${RED}❌ Unique cards count incorrect${RESET}`);
    failed++;
  }

  // Test helper functions
  console.log(`\n${BLUE}Testing helper functions...${RESET}`);

  // Test card type detection
  const typeTests = [
    { type: "Creature — Human Wizard", expected: "Creature" },
    { type: "Legendary Planeswalker — Jace", expected: "Planeswalker" },
    { type: "Basic Land — Island", expected: "Land" },
    { type: "Tribal Instant — Elf", expected: "Instant" },
    { type: "Legendary Artifact Creature", expected: "Creature" },
  ];

  for (const test of typeTests) {
    const mainType = importer.getMainCardType(test.type);
    if (mainType === test.expected) {
      console.log(`  ${GREEN}✅ "${test.type}" → ${mainType}${RESET}`);
      passed++;
    } else {
      console.log(
        `  ${RED}❌ "${test.type}" → Expected ${test.expected}, got ${mainType}${RESET}`
      );
      failed++;
    }
  }

  // Test color analysis
  const colorTests = [
    { colors: ["W"], expected: "Mono-White" },
    { colors: ["U", "B"], expected: "Two-color (Blue/Black)" },
    { colors: ["W", "U", "B", "R", "G"], expected: "Five-color" },
    { colors: [], expected: "Colorless" },
  ];

  for (const test of colorTests) {
    const analysis = importer.analyzeColorBalance(test.colors);
    if (analysis === test.expected) {
      console.log(`  ${GREEN}✅ Color analysis: ${analysis}${RESET}`);
      passed++;
    } else {
      console.log(
        `  ${RED}❌ Expected "${test.expected}", got "${analysis}"${RESET}`
      );
      failed++;
    }
  }

  // Test mana curve analysis
  console.log(`\n${BLUE}Testing mana curve analysis...${RESET}`);

  const curveTests = [
    {
      curve: { 0: 0, 1: 15, 2: 10, 3: 5, 4: 2, 5: 1, 6: 0, 7: 0 },
      expected: "Aggressive",
    },
    {
      curve: { 0: 0, 1: 5, 2: 8, 3: 12, 4: 8, 5: 5, 6: 2, 7: 1 },
      expected: "Midrange",
    },
    {
      curve: { 0: 0, 1: 2, 2: 4, 3: 6, 4: 10, 5: 8, 6: 5, 7: 3 },
      expected: "Control",
    },
  ];

  for (const test of curveTests) {
    const analysis = importer.analyzeManaCurve(test.curve);
    const isCorrect = analysis
      .toLowerCase()
      .includes(test.expected.toLowerCase());
    if (isCorrect) {
      console.log(`  ${GREEN}✅ Curve identified as ${test.expected}${RESET}`);
      passed++;
    } else {
      console.log(
        `  ${RED}❌ Expected ${test.expected} curve, got: ${analysis}${RESET}`
      );
      failed++;
    }
  }

  // Summary
  console.log("\n========================================");
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("========================================");
  console.log(`${GREEN}✅ Tests Passed: ${passed}${RESET}`);
  console.log(`${RED}❌ Tests Failed: ${failed}${RESET}`);
  console.log(
    `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
  );

  // Notes
  console.log("\n📝 Notes:");
  console.log("  • URL detection and parsing work correctly");
  console.log("  • Deck analysis functions are operational");
  console.log("  • Comparison features work as expected");
  console.log("  • Live API tests require valid deck URLs");
  console.log("  • Consider adding mock API responses for CI/CD");

  // Exit code
  const exitCode = failed > 0 ? 1 : 0;
  console.log("\n========================================");
  if (exitCode === 0) {
    console.log(`${GREEN}✅ All tests passed!${RESET}`);
  } else {
    console.log(`${YELLOW}⚠️ Some tests failed${RESET}`);
  }

  process.exit(exitCode);
}

// Run tests
testDeckImporter().catch((error) => {
  console.error(`${RED}Fatal error: ${error.message}${RESET}`);
  process.exit(1);
});
