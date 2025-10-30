/**
 * Test suite for Meta Command functionality
 * Tests the tournament meta scraping and display
 */

const MetaScraper = require("../../src/meta/metaScraper");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// Test the meta scraper
async function testMetaScraper() {
  console.log("========================================");
  console.log("📊 META SCRAPER TEST SUITE");
  console.log("========================================");
  console.log("Testing tournament meta data fetching...\n");

  const scraper = new MetaScraper();
  let passed = 0;
  let failed = 0;
  const results = [];

  // Test formats
  const formats = ["standard", "modern", "pioneer", "legacy", "commander"];

  for (const format of formats) {
    console.log(`${BLUE}Testing ${format.toUpperCase()} meta...${RESET}`);

    try {
      const startTime = Date.now();
      const metaData = await scraper.fetchMetaBreakdown(format);
      const elapsed = Date.now() - startTime;

      if (metaData && !metaData.error) {
        console.log(
          `  ${GREEN}✅ Fetched successfully in ${elapsed}ms${RESET}`
        );

        // Check data quality
        if (metaData.decks && metaData.decks.length > 0) {
          console.log(
            `  ${GREEN}✅ Found ${metaData.decks.length} deck archetypes${RESET}`
          );

          // Display top 3 decks
          console.log(`  ${BLUE}Top 3 decks:${RESET}`);
          metaData.decks.slice(0, 3).forEach((deck, i) => {
            console.log(
              `    ${i + 1}. ${deck.name} - ${deck.percentage.toFixed(1)}%`
            );
          });

          passed++;
          results.push({
            format,
            status: "success",
            deckCount: metaData.decks.length,
            topDeck: metaData.decks[0]?.name,
            sources: metaData.sources,
          });
        } else {
          console.log(`  ${YELLOW}⚠️ No deck data found${RESET}`);
          failed++;
          results.push({
            format,
            status: "no_data",
            error: "No decks returned",
          });
        }
      } else {
        console.log(`  ${RED}❌ Failed to fetch meta data${RESET}`);
        if (metaData?.message) {
          console.log(`  ${RED}Error: ${metaData.message}${RESET}`);
        }
        failed++;
        results.push({
          format,
          status: "error",
          error: metaData?.message || "Unknown error",
        });
      }
    } catch (error) {
      console.log(`  ${RED}❌ Exception: ${error.message}${RESET}`);
      failed++;
      results.push({
        format,
        status: "exception",
        error: error.message,
      });
    }

    console.log(); // Empty line between formats
  }

  // Test recent tournaments
  console.log(`${BLUE}Testing recent tournaments...${RESET}`);
  try {
    const tournaments = await scraper.fetchRecentTournaments();

    if (tournaments && tournaments.length > 0) {
      console.log(
        `  ${GREEN}✅ Found ${tournaments.length} recent tournaments${RESET}`
      );

      // Display first 3 tournaments
      console.log(`  ${BLUE}Recent tournaments:${RESET}`);
      tournaments.slice(0, 3).forEach((tournament) => {
        console.log(
          `    • ${tournament.name} (${tournament.format}) - ${tournament.date}`
        );
      });

      passed++;
    } else {
      console.log(`  ${YELLOW}⚠️ No tournaments found${RESET}`);
      failed++;
    }
  } catch (error) {
    console.log(
      `  ${RED}❌ Failed to fetch tournaments: ${error.message}${RESET}`
    );
    failed++;
  }

  // Test matchup estimation
  console.log(`\n${BLUE}Testing matchup estimation...${RESET}`);
  const testMatchups = [
    { deck1: "Burn", deck2: "Control", expected: "aggro_vs_control" },
    { deck1: "Tron", deck2: "Burn", expected: "combo_vs_aggro" },
    { deck1: "Jund", deck2: "Burn", expected: "midrange_vs_aggro" },
  ];

  for (const test of testMatchups) {
    const matchup = scraper.estimateMatchup(test.deck1, test.deck2);
    console.log(
      `  ${test.deck1} vs ${test.deck2}: ${matchup.deck1}% / ${matchup.deck2}%`
    );

    if (matchup.deck1 !== 50 || matchup.deck2 !== 50) {
      console.log(`    ${GREEN}✅ Non-mirror matchup detected${RESET}`);
      passed++;
    } else if (test.deck1.toLowerCase() === test.deck2.toLowerCase()) {
      console.log(`    ${GREEN}✅ Mirror match correctly identified${RESET}`);
      passed++;
    } else {
      console.log(`    ${YELLOW}⚠️ Default 50/50 split${RESET}`);
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

  // Detailed results
  console.log("\n📋 Format Results:");
  results.forEach((result) => {
    const statusColor =
      result.status === "success"
        ? GREEN
        : result.status === "no_data"
        ? YELLOW
        : RED;
    console.log(`  ${result.format}: ${statusColor}${result.status}${RESET}`);
    if (result.topDeck) {
      console.log(`    Top deck: ${result.topDeck}`);
    }
    if (result.sources) {
      console.log(`    Sources: ${result.sources.join(", ")}`);
    }
    if (result.error) {
      console.log(`    Error: ${result.error}`);
    }
  });

  // Performance notes
  console.log("\n📝 Notes:");
  console.log(
    "  • Web scraping may be slow or fail due to network/site issues"
  );
  console.log("  • MTGTop8 and MTGGoldfish may have rate limiting");
  console.log("  • Some formats may have limited data availability");
  console.log("  • Consider implementing caching for production use");

  // Exit code
  const exitCode = failed > 0 ? 1 : 0;
  console.log("\n========================================");
  if (exitCode === 0) {
    console.log(`${GREEN}✅ All critical tests passed!${RESET}`);
  } else {
    console.log(
      `${YELLOW}⚠️ Some tests failed - this may be due to external site availability${RESET}`
    );
  }

  process.exit(exitCode);
}

// Run tests
testMetaScraper().catch((error) => {
  console.error(`${RED}Fatal error: ${error.message}${RESET}`);
  process.exit(1);
});
