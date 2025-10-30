const fs = require("fs").promises;
const path = require("path");
const https = require("https");
const http = require("http");

class RulesManager {
  constructor() {
    this.rulesPath = path.join(__dirname, "..", "data", "MagicCompRules.txt");
    this.indexPath = path.join(__dirname, "..", "data", "rulesIndex.json");
    this.lastUpdatePath = path.join(
      __dirname,
      "..",
      "data",
      "lastRulesUpdate.json"
    );
    this.urlCachePath = path.join(
      __dirname,
      "..",
      "data",
      "lastWorkingUrl.json"
    );
    this.rulesIndex = {};
    this.rules = [];
  }

  /**
   * Initialize the rules system by loading existing rules or downloading new ones
   */
  async initializeRules() {
    try {
      // Check if rules file exists
      const rulesExist = await this.checkRulesExist();

      if (!rulesExist) {
        console.log("📥 No rules found. Downloading comprehensive rules...");
        await this.downloadRules();
      }

      // Load and parse rules
      await this.parseAndIndexRules();

      console.log(`✅ Loaded ${this.rules.length} comprehensive rules`);
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize rules:", error);
      throw error;
    }
  }

  /**
   * Check if rules file exists
   */
  async checkRulesExist() {
    try {
      await fs.access(this.rulesPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate potential URLs for comprehensive rules
   * @returns {Array} Array of potential URLs to try
   */
  generatePotentialUrls() {
    const urls = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed

    // Common release dates are around the 25th of the month
    const dates = [];

    // Try current month
    dates.push({
      year: currentYear,
      month: currentMonth,
      day: 25,
    });

    // Try previous month
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    dates.push({
      year: prevYear,
      month: prevMonth,
      day: 25,
    });

    // Try two months ago
    const twoMonthsAgo = prevMonth === 1 ? 12 : prevMonth - 1;
    const twoMonthsYear = prevMonth === 1 ? prevYear - 1 : prevYear;
    dates.push({
      year: twoMonthsYear,
      month: twoMonthsAgo,
      day: 25,
    });

    // Also try common dates (1st, 15th)
    dates.push({
      year: currentYear,
      month: currentMonth,
      day: 1,
    });
    dates.push({
      year: currentYear,
      month: currentMonth,
      day: 15,
    });

    // Generate URLs for each date
    for (const date of dates) {
      const dateStr = `${date.year}${String(date.month).padStart(
        2,
        "0"
      )}${String(date.day).padStart(2, "0")}`;

      // Try both URL formats (with space and with %20)
      urls.push(
        `https://media.wizards.com/${date.year}/downloads/MagicCompRules ${dateStr}.txt`
      );
      urls.push(
        `https://media.wizards.com/${date.year}/downloads/MagicCompRules%20${dateStr}.txt`
      );

      // Also try without space
      urls.push(
        `https://media.wizards.com/${date.year}/downloads/MagicCompRules_${dateStr}.txt`
      );
      urls.push(
        `https://media.wizards.com/${date.year}/downloads/MagicCompRules${dateStr}.txt`
      );
    }

    // Add some known working patterns from history
    urls.push(
      "https://media.wizards.com/2025/downloads/MagicCompRules 20250725.txt"
    );
    urls.push(
      "https://media.wizards.com/2024/downloads/MagicCompRules%2020240906.txt"
    );

    return urls;
  }

  /**
   * Try to download from a specific URL
   * @param {string} url - URL to try
   * @returns {Promise<boolean>} True if successful
   */
  async tryDownloadFromUrl(url) {
    return new Promise((resolve) => {
      console.log(`🔍 Trying URL: ${url}`);
      const tempPath = this.rulesPath + ".tmp";

      const protocol = url.startsWith("https") ? https : http;

      const request = protocol.get(url, (response) => {
        // Handle redirects
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          console.log(`↪️ Following redirect to: ${response.headers.location}`);
          this.tryDownloadFromUrl(response.headers.location).then(resolve);
          return;
        }

        if (response.statusCode !== 200) {
          console.log(`❌ Failed with status: ${response.statusCode}`);
          resolve(false);
          return;
        }

        const writeStream = require("fs").createWriteStream(tempPath);
        let downloadedSize = 0;

        response.on("data", (chunk) => {
          downloadedSize += chunk.length;
        });

        response.pipe(writeStream);

        writeStream.on("finish", async () => {
          writeStream.close();

          // Verify the file is valid (should be > 500KB for comprehensive rules)
          try {
            const stats = await fs.stat(tempPath);
            if (stats.size < 500000) {
              console.log(
                `❌ File too small (${stats.size} bytes), likely not valid rules`
              );
              await fs.unlink(tempPath).catch(() => {});
              resolve(false);
              return;
            }

            // Verify it contains actual rules by checking first few lines
            const content = await fs.readFile(tempPath, "utf8");
            if (
              !content.includes("Magic: The Gathering") &&
              !content.includes("Comprehensive Rules")
            ) {
              console.log(`❌ File doesn't appear to contain MTG rules`);
              await fs.unlink(tempPath).catch(() => {});
              resolve(false);
              return;
            }

            // Move temp file to final location
            await fs.rename(tempPath, this.rulesPath);

            // Save successful URL for future use
            await this.saveWorkingUrl(url);

            // Save update timestamp
            await fs.writeFile(
              this.lastUpdatePath,
              JSON.stringify(
                {
                  date: new Date().toISOString(),
                  url: url,
                  rulesCount: 0, // Will be updated after parsing
                },
                null,
                2
              )
            );

            console.log(`✅ Successfully downloaded from: ${url}`);
            resolve(true);
          } catch (error) {
            console.log(`❌ Error processing file: ${error.message}`);
            await fs.unlink(tempPath).catch(() => {});
            resolve(false);
          }
        });

        writeStream.on("error", (error) => {
          console.log(`❌ Write error: ${error.message}`);
          resolve(false);
        });
      });

      request.on("error", (error) => {
        console.log(`❌ Request error: ${error.message}`);
        resolve(false);
      });

      // Set timeout
      request.setTimeout(30000, () => {
        console.log(`❌ Request timeout`);
        request.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Save a working URL for future reference
   */
  async saveWorkingUrl(url) {
    try {
      await fs.writeFile(
        this.urlCachePath,
        JSON.stringify({ url, date: new Date().toISOString() }, null, 2)
      );
    } catch (error) {
      console.error("Failed to save working URL:", error);
    }
  }

  /**
   * Load the last working URL
   */
  async loadLastWorkingUrl() {
    try {
      const data = await fs.readFile(this.urlCachePath, "utf8");
      const { url } = JSON.parse(data);
      return url;
    } catch {
      return null;
    }
  }

  /**
   * Scrape the official rules page for the download link
   */
  async scrapeRulesPageForUrl() {
    return new Promise((resolve) => {
      console.log("🌐 Attempting to scrape rules page for current URL...");

      https
        .get("https://magic.wizards.com/en/rules", (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            // Look for TXT file link in the HTML
            const txtPattern =
              /https:\/\/media\.wizards\.com\/\d{4}\/downloads\/MagicCompRules[^"]*\.txt/gi;
            const matches = data.match(txtPattern);

            if (matches && matches.length > 0) {
              // Get the first match (should be the most recent)
              const url = matches[0];
              console.log(`✅ Found rules URL from webpage: ${url}`);
              resolve(url);
            } else {
              console.log("❌ Could not find rules URL in webpage");
              resolve(null);
            }
          });
        })
        .on("error", (error) => {
          console.error("❌ Failed to scrape rules page:", error.message);
          resolve(null);
        });
    });
  }

  /**
   * Download the latest comprehensive rules with intelligent fallback
   */
  async downloadRules() {
    console.log("🤖 Starting intelligent rules download process...");

    // Strategy 1: Try the last working URL
    const lastWorkingUrl = await this.loadLastWorkingUrl();
    if (lastWorkingUrl) {
      console.log("📝 Trying last known working URL...");
      if (await this.tryDownloadFromUrl(lastWorkingUrl)) {
        return;
      }
    }

    // Strategy 2: Scrape the official page for the current URL
    const scrapedUrl = await this.scrapeRulesPageForUrl();
    if (scrapedUrl) {
      if (await this.tryDownloadFromUrl(scrapedUrl)) {
        return;
      }
    }

    // Strategy 3: Try generated URLs based on date patterns
    const potentialUrls = this.generatePotentialUrls();
    console.log(`🔄 Trying ${potentialUrls.length} potential URLs...`);

    for (const url of potentialUrls) {
      if (await this.tryDownloadFromUrl(url)) {
        return;
      }
    }

    // If all strategies fail, throw an error
    throw new Error(
      "Failed to download comprehensive rules. All strategies exhausted. " +
        "Please check your internet connection or report this issue."
    );
  }

  /**
   * Parse and index the comprehensive rules
   */
  async parseAndIndexRules() {
    try {
      const rulesText = await fs.readFile(this.rulesPath, "utf8");
      // Handle different line endings (Windows \r\n, Mac \r, Unix \n)
      const lines = rulesText.split(/\r\n|\r|\n/);

      this.rules = [];
      this.rulesIndex = {};

      let currentRule = null;
      let rulesFound = 0;
      // Updated pattern to match rules like "100.1. Text" or "100.1a. Text" at the start of a line
      const rulePattern = /^(\d{1,3}(?:\.\d+[a-z]?))\.\s+(.+)$/;

      for (const line of lines) {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(rulePattern);

        if (match) {
          rulesFound++;
          // Save previous rule if exists
          if (currentRule) {
            this.rules.push(currentRule);
            this.indexRule(currentRule);
          }

          // Start new rule
          currentRule = {
            number: match[1],
            text: match[2].trim(),
          };
        } else if (
          currentRule &&
          trimmedLine &&
          !trimmedLine.match(/^\d{1,3}\./)
        ) {
          // Continue current rule (multi-line rules)
          // But don't include section headers like "100. General"
          currentRule.text += " " + trimmedLine;
        }
      }

      // Save last rule
      if (currentRule) {
        this.rules.push(currentRule);
        this.indexRule(currentRule);
      }

      // Save index to file
      await fs.writeFile(
        this.indexPath,
        JSON.stringify(this.rulesIndex, null, 2)
      );

      // Update last update info
      const updateInfo = {
        date: new Date().toISOString(),
        rulesCount: this.rules.length,
      };
      await fs.writeFile(
        this.lastUpdatePath,
        JSON.stringify(updateInfo, null, 2)
      );

      console.log(`📚 Indexed ${this.rules.length} rules`);
    } catch (error) {
      console.error("Error parsing rules:", error);
      throw error;
    }
  }

  /**
   * Check if rules need updating (older than 30 days)
   */
  async shouldUpdateRules() {
    try {
      const data = await fs.readFile(this.lastUpdatePath, "utf8");
      const { date } = JSON.parse(data);
      const lastUpdate = new Date(date);
      const now = new Date();
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

      return daysSinceUpdate > 30;
    } catch {
      return true; // If we can't read the file, assume we need to update
    }
  }

  /**
   * Index a single rule for searching
   */
  indexRule(rule) {
    // Extract keywords from rule text
    const keywords = this.extractKeywords(rule.text);

    for (const keyword of keywords) {
      if (!this.rulesIndex[keyword]) {
        this.rulesIndex[keyword] = [];
      }

      if (!this.rulesIndex[keyword].includes(rule.number)) {
        this.rulesIndex[keyword].push(rule.number);
      }
    }
  }

  /**
   * Extract keywords from rule text
   */
  extractKeywords(text) {
    const keywords = new Set();

    // Common MTG keywords to look for
    const importantTerms = [
      "draw",
      "discard",
      "sacrifice",
      "destroy",
      "exile",
      "counter",
      "tap",
      "untap",
      "damage",
      "life",
      "mana",
      "spell",
      "ability",
      "creature",
      "artifact",
      "enchantment",
      "planeswalker",
      "land",
      "graveyard",
      "battlefield",
      "library",
      "hand",
      "stack",
      "combat",
      "attack",
      "block",
      "flying",
      "trample",
      "vigilance",
      "haste",
      "deathtouch",
      "lifelink",
      "menace",
      "hexproof",
      "ward",
      "token",
      "copy",
      "trigger",
      "activated",
      "static",
      "replacement",
      "priority",
      "phase",
      "step",
      "turn",
      "player",
      "opponent",
      "commander",
      "legendary",
      "historic",
      "saga",
      "modal",
      "kicker",
    ];

    const lowerText = text.toLowerCase();

    // Add important terms found in the text
    for (const term of importantTerms) {
      if (lowerText.includes(term)) {
        keywords.add(term);
      }
    }

    // Also add specific words that are 4+ characters
    const words = lowerText.match(/\b[a-z]{4,}\b/g) || [];
    for (const word of words) {
      if (importantTerms.includes(word)) {
        keywords.add(word);
      }
    }

    return Array.from(keywords);
  }

  /**
   * Find rules relevant to a question
   */
  async findRelevantRules(question) {
    const lowerQuestion = question.toLowerCase();
    const relevantRules = [];
    const scores = new Map();

    // Extract keywords from question
    const questionKeywords = this.extractKeywords(question);

    // Search through all rules
    for (const rule of this.rules) {
      let score = 0;
      const lowerRuleText = rule.text.toLowerCase();

      // Check for keyword matches
      for (const keyword of questionKeywords) {
        if (lowerRuleText.includes(keyword)) {
          score += 2;
        }
      }

      // Check for partial matches of the question
      const questionWords = lowerQuestion
        .split(/\s+/)
        .filter((w) => w.length > 3);
      for (const word of questionWords) {
        if (lowerRuleText.includes(word)) {
          score += 1;
        }
      }

      if (score > 0) {
        scores.set(rule.number, score);
        relevantRules.push(rule);
      }
    }

    // Sort by relevance score
    relevantRules.sort((a, b) => {
      const scoreA = scores.get(a.number) || 0;
      const scoreB = scores.get(b.number) || 0;
      return scoreB - scoreA;
    });

    // Return top 5 most relevant rules
    return relevantRules.slice(0, 5);
  }

  /**
   * Get a specific rule by number
   */
  getRuleByNumber(ruleNumber) {
    return this.rules.find((rule) => rule.number === ruleNumber);
  }

  /**
   * Get all rules (for RAG system)
   */
  async getAllRules() {
    if (this.rules.length === 0) {
      await this.parseAndIndexRules();
    }
    return this.rules;
  }

  /**
   * Search rules by keyword
   */
  searchByKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    const ruleNumbers = this.rulesIndex[lowerKeyword] || [];

    return ruleNumbers
      .map((number) => this.getRuleByNumber(number))
      .filter(Boolean);
  }
}

// Create singleton instance
const rulesManager = new RulesManager();

// Export the instance and its methods
module.exports = rulesManager;
