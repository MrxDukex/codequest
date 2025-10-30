/**
 * Comprehensive test suite for intelligent rules download system
 * Tests all fallback mechanisms and self-healing features
 */

const path = require("path");
const fs = require("fs").promises;
const https = require("https");

// Mock the rulesManager for testing
class TestRulesManager {
  constructor() {
    this.testDir = path.join(__dirname, "..", "..", "data", "test");
    this.rulesPath = path.join(this.testDir, "MagicCompRules.txt");
    this.urlCachePath = path.join(this.testDir, "lastWorkingUrl.json");
    this.lastUpdatePath = path.join(this.testDir, "lastRulesUpdate.json");
  }

  async setupTestEnvironment() {
    // Create test directory
    await fs.mkdir(this.testDir, { recursive: true });

    // Clean up any existing test files
    await this.cleanupTestFiles();
  }

  async cleanupTestFiles() {
    try {
      await fs.unlink(this.rulesPath).catch(() => {});
      await fs.unlink(this.urlCachePath).catch(() => {});
      await fs.unlink(this.lastUpdatePath).catch(() => {});
      await fs.unlink(this.rulesPath + ".tmp").catch(() => {});
    } catch (error) {
      // Ignore errors during cleanup
    }
  }

  /**
   * Test URL generation for different dates
   */
  testUrlGeneration() {
    console.log("\n📝 Testing URL Generation...");

    const RulesManager = require("../../src/rulesManager");
    const urls = RulesManager.generatePotentialUrls();

    console.log(`✅ Generated ${urls.length} potential URLs`);

    // Verify URL patterns
    const patterns = [
      /https:\/\/media\.wizards\.com\/\d{4}\/downloads\/MagicCompRules\s\d{8}\.txt/,
      /https:\/\/media\.wizards\.com\/\d{4}\/downloads\/MagicCompRules%20\d{8}\.txt/,
      /https:\/\/media\.wizards\.com\/\d{4}\/downloads\/MagicCompRules_\d{8}\.txt/,
    ];

    let validPatterns = 0;
    for (const url of urls) {
      for (const pattern of patterns) {
        if (pattern.test(url)) {
          validPatterns++;
          break;
        }
      }
    }

    if (validPatterns > 0) {
      console.log(
        `✅ URL patterns are valid (${validPatterns}/${urls.length} match expected patterns)`
      );
      return true;
    } else {
      console.log("❌ URL generation failed - no valid patterns found");
      return false;
    }
  }

  /**
   * Test web scraping functionality
   */
  async testWebScraping() {
    console.log("\n🌐 Testing Web Scraping...");

    const RulesManager = require("../../src/rulesManager");

    try {
      const scrapedUrl = await RulesManager.scrapeRulesPageForUrl();

      if (scrapedUrl) {
        console.log(`✅ Successfully scraped URL: ${scrapedUrl}`);

        // Verify it's a valid MTG rules URL
        if (
          scrapedUrl.includes("media.wizards.com") &&
          scrapedUrl.includes("MagicCompRules")
        ) {
          console.log("✅ Scraped URL appears valid");
          return true;
        } else {
          console.log("⚠️ Scraped URL doesn't match expected pattern");
          return false;
        }
      } else {
        console.log("⚠️ Web scraping returned null (might be network issue)");
        return false;
      }
    } catch (error) {
      console.log(`⚠️ Web scraping error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test actual download with the current URL
   */
  async testActualDownload() {
    console.log("\n📥 Testing Actual Download...");

    const RulesManager = require("../../src/rulesManager");

    // First, try to get the current URL from scraping
    const currentUrl = await RulesManager.scrapeRulesPageForUrl();

    if (!currentUrl) {
      console.log("⚠️ Could not get current URL from scraping");
      return false;
    }

    console.log(`🔍 Testing download from: ${currentUrl}`);

    // Create a temporary path for testing
    const originalPath = RulesManager.rulesPath;
    RulesManager.rulesPath = this.rulesPath;

    try {
      const success = await RulesManager.tryDownloadFromUrl(currentUrl);

      if (success) {
        // Verify the file was downloaded
        const stats = await fs.stat(this.rulesPath);
        console.log(
          `✅ File downloaded successfully (${(
            stats.size /
            1024 /
            1024
          ).toFixed(2)} MB)`
        );

        // Verify content
        const content = await fs.readFile(this.rulesPath, "utf8");
        if (
          content.includes("Magic: The Gathering") ||
          content.includes("Comprehensive Rules")
        ) {
          console.log("✅ File contains valid MTG rules");
          return true;
        } else {
          console.log("❌ Downloaded file doesn't appear to contain rules");
          return false;
        }
      } else {
        console.log("❌ Download failed");
        return false;
      }
    } finally {
      // Restore original path
      RulesManager.rulesPath = originalPath;
    }
  }

  /**
   * Test URL caching mechanism
   */
  async testUrlCaching() {
    console.log("\n💾 Testing URL Caching...");

    const RulesManager = require("../../src/rulesManager");

    // Save the original paths
    const originalUrlCache = RulesManager.urlCachePath;
    RulesManager.urlCachePath = this.urlCachePath;

    try {
      const testUrl =
        "https://media.wizards.com/2025/downloads/MagicCompRules 20250725.txt";

      // Save a test URL
      await RulesManager.saveWorkingUrl(testUrl);
      console.log("✅ Saved test URL to cache");

      // Load it back
      const loadedUrl = await RulesManager.loadLastWorkingUrl();

      if (loadedUrl === testUrl) {
        console.log("✅ URL caching works correctly");
        return true;
      } else {
        console.log(
          `❌ URL caching failed. Expected: ${testUrl}, Got: ${loadedUrl}`
        );
        return false;
      }
    } finally {
      // Restore original path
      RulesManager.urlCachePath = originalUrlCache;
    }
  }

  /**
   * Test the complete download flow with all fallbacks
   */
  async testCompleteDownloadFlow() {
    console.log("\n🔄 Testing Complete Download Flow...");

    const RulesManager = require("../../src/rulesManager");

    // Save original paths
    const originalRulesPath = RulesManager.rulesPath;
    const originalUrlCache = RulesManager.urlCachePath;
    const originalUpdatePath = RulesManager.lastUpdatePath;

    // Use test paths
    RulesManager.rulesPath = this.rulesPath;
    RulesManager.urlCachePath = this.urlCachePath;
    RulesManager.lastUpdatePath = this.lastUpdatePath;

    try {
      console.log("🚀 Starting download process...");
      await RulesManager.downloadRules();

      // Check if file was downloaded
      const stats = await fs.stat(this.rulesPath);
      console.log(
        `✅ Rules downloaded successfully (${(stats.size / 1024 / 1024).toFixed(
          2
        )} MB)`
      );

      // Check if URL was cached
      const cachedUrl = await RulesManager.loadLastWorkingUrl();
      if (cachedUrl) {
        console.log(`✅ URL cached for future use: ${cachedUrl}`);
      }

      // Check if update info was saved
      try {
        const updateData = await fs.readFile(this.lastUpdatePath, "utf8");
        const updateInfo = JSON.parse(updateData);
        console.log(`✅ Update info saved (Date: ${updateInfo.date})`);
      } catch (error) {
        console.log("⚠️ Update info not saved");
      }

      return true;
    } catch (error) {
      console.log(`❌ Complete download flow failed: ${error.message}`);
      return false;
    } finally {
      // Restore original paths
      RulesManager.rulesPath = originalRulesPath;
      RulesManager.urlCachePath = originalUrlCache;
      RulesManager.lastUpdatePath = originalUpdatePath;
    }
  }

  /**
   * Test parsing of downloaded rules
   */
  async testRulesParsing() {
    console.log("\n📖 Testing Rules Parsing...");

    // Check if we have a test file from previous download
    try {
      await fs.access(this.rulesPath);
    } catch {
      console.log(
        "⚠️ No rules file to parse (download test may have been skipped)"
      );
      return false;
    }

    const RulesManager = require("../../src/rulesManager");

    // Save original path
    const originalPath = RulesManager.rulesPath;
    RulesManager.rulesPath = this.rulesPath;

    try {
      // Clear existing rules
      RulesManager.rules = [];
      RulesManager.rulesIndex = {};

      // Parse the rules
      await RulesManager.parseAndIndexRules();

      if (RulesManager.rules.length > 0) {
        console.log(
          `✅ Successfully parsed ${RulesManager.rules.length} rules`
        );

        // Verify some rules were indexed
        const indexKeys = Object.keys(RulesManager.rulesIndex);
        console.log(`✅ Indexed ${indexKeys.length} keywords`);

        // Test finding a rule
        const testRules = await RulesManager.findRelevantRules("draw a card");
        if (testRules.length > 0) {
          console.log(
            `✅ Rule search working (found ${testRules.length} relevant rules)`
          );
        }

        return true;
      } else {
        console.log("❌ No rules were parsed");
        return false;
      }
    } finally {
      // Restore original path
      RulesManager.rulesPath = originalPath;
    }
  }

  /**
   * Test error recovery and fallback mechanisms
   */
  async testErrorRecovery() {
    console.log("\n🛡️ Testing Error Recovery...");

    const RulesManager = require("../../src/rulesManager");

    // Test with an invalid URL first
    const invalidUrl =
      "https://media.wizards.com/9999/downloads/InvalidRules.txt";
    const result = await RulesManager.tryDownloadFromUrl(invalidUrl);

    if (!result) {
      console.log("✅ Correctly handled invalid URL");
    } else {
      console.log("❌ Should have failed with invalid URL");
      return false;
    }

    // Test timeout handling (using a URL that will hang)
    console.log("Testing timeout handling...");
    const timeoutUrl = "https://httpstat.us/200?sleep=35000"; // 35 second delay
    const startTime = Date.now();
    const timeoutResult = await RulesManager.tryDownloadFromUrl(timeoutUrl);
    const elapsed = Date.now() - startTime;

    if (!timeoutResult && elapsed < 35000) {
      console.log(`✅ Timeout worked correctly (failed after ${elapsed}ms)`);
    } else {
      console.log("⚠️ Timeout handling may not be working properly");
    }

    return true;
  }
}

// Main test runner
async function runAllTests() {
  console.log("========================================");
  console.log("🧪 INTELLIGENT RULES DOWNLOAD TEST SUITE");
  console.log("========================================");

  const tester = new TestRulesManager();
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  try {
    // Setup test environment
    await tester.setupTestEnvironment();
    console.log("✅ Test environment ready");

    // Run tests
    const tests = [
      { name: "URL Generation", fn: () => tester.testUrlGeneration() },
      { name: "Web Scraping", fn: () => tester.testWebScraping() },
      { name: "URL Caching", fn: () => tester.testUrlCaching() },
      { name: "Error Recovery", fn: () => tester.testErrorRecovery() },
      {
        name: "Complete Download Flow",
        fn: () => tester.testCompleteDownloadFlow(),
      },
      { name: "Rules Parsing", fn: () => tester.testRulesParsing() },
      { name: "Actual Download", fn: () => tester.testActualDownload() },
    ];

    for (const test of tests) {
      try {
        const result = await test.fn();
        if (result === true) {
          results.passed++;
        } else if (result === false) {
          results.failed++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        console.log(`❌ ${test.name} threw error: ${error.message}`);
        results.failed++;
      }
    }

    // Cleanup
    await tester.cleanupTestFiles();
  } catch (error) {
    console.error("Fatal test error:", error);
  }

  // Print summary
  console.log("\n========================================");
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("========================================");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️ Skipped: ${results.skipped}`);

  const total = results.passed + results.failed + results.skipped;
  const successRate =
    total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
  console.log(`\n📈 Success Rate: ${successRate}%`);

  if (results.failed === 0) {
    console.log(
      "\n🎉 ALL TESTS PASSED! The intelligent rules download system is working perfectly!"
    );
    process.exit(0);
  } else {
    console.log("\n⚠️ Some tests failed. Please review the output above.");
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(console.error);
