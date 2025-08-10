/**
 * Meta Scraper Module
 * Fetches tournament meta data from MTGTop8 and other sources
 * No API keys required - uses web scraping
 */

const fetch = require("node-fetch");
const cheerio = require("cheerio");

class MetaScraper {
  constructor() {
    this.baseUrls = {
      mtgtop8: "https://www.mtgtop8.com",
      mtggoldfish: "https://www.mtggoldfish.com/metagame",
    };

    this.formats = {
      standard: "ST",
      modern: "MO",
      pioneer: "PI",
      legacy: "LE",
      vintage: "VI",
      pauper: "PAU",
      commander: "EDH",
      historic: "HI",
      explorer: "EX",
    };
  }

  /**
   * Fetch meta breakdown for a specific format
   * @param {string} format - The format to fetch (standard, modern, etc.)
   * @returns {Object} Meta breakdown with deck percentages
   */
  async fetchMetaBreakdown(format) {
    try {
      const formatCode = this.formats[format.toLowerCase()];
      if (!formatCode) {
        throw new Error(`Unknown format: ${format}`);
      }

      // Try MTGTop8 first
      const mtgtop8Data = await this.scrapeMTGTop8(formatCode);

      // Try MTGGoldfish as backup
      const goldfish = await this.scrapeMTGGoldfish(format);

      // Combine data from both sources
      return this.combineMetaData(mtgtop8Data, goldfish);
    } catch (error) {
      console.error(`Error fetching meta for ${format}:`, error);
      return this.getDefaultMetaResponse(format);
    }
  }

  /**
   * Scrape MTGTop8 for meta data
   * @param {string} formatCode - MTGTop8 format code
   */
  async scrapeMTGTop8(formatCode) {
    try {
      const url = `${this.baseUrls.mtgtop8}/format?f=${formatCode}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const decks = [];

      // Parse the meta breakdown table
      $(".hover_tr").each((i, elem) => {
        const deckName = $(elem).find("td").eq(0).text().trim();
        const percentage = $(elem).find("td").eq(1).text().trim();
        const count = $(elem).find("td").eq(2).text().trim();

        if (deckName && percentage) {
          decks.push({
            name: deckName,
            percentage: parseFloat(percentage.replace("%", "")) || 0,
            count: parseInt(count) || 0,
            source: "MTGTop8",
          });
        }
      });

      // Sort by percentage
      decks.sort((a, b) => b.percentage - a.percentage);

      return {
        format: formatCode,
        lastUpdated: new Date().toISOString(),
        decks: decks.slice(0, 15), // Top 15 decks
        totalDecks: decks.reduce((sum, d) => sum + d.count, 0),
      };
    } catch (error) {
      console.error("MTGTop8 scraping error:", error);
      return null;
    }
  }

  /**
   * Scrape MTGGoldfish for meta data
   * @param {string} format - Format name
   */
  async scrapeMTGGoldfish(format) {
    try {
      const url = `${this.baseUrls.mtggoldfish}/${format}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const decks = [];

      // Parse archetype tiles
      $(".archetype-tile").each((i, elem) => {
        const deckName = $(elem)
          .find(".deck-price-paper .deck-price-deck-name")
          .text()
          .trim();
        const percentage = $(elem).find(".percentage").text().trim();

        if (deckName && percentage) {
          decks.push({
            name: deckName,
            percentage: parseFloat(percentage.replace("%", "")) || 0,
            source: "MTGGoldfish",
          });
        }
      });

      return {
        format: format,
        decks: decks.slice(0, 10),
        source: "MTGGoldfish",
      };
    } catch (error) {
      console.error("MTGGoldfish scraping error:", error);
      return null;
    }
  }

  /**
   * Combine meta data from multiple sources
   */
  combineMetaData(mtgtop8, goldfish) {
    const combined = {
      lastUpdated: new Date().toISOString(),
      sources: [],
      decks: [],
    };

    // Add MTGTop8 data
    if (mtgtop8 && mtgtop8.decks && mtgtop8.decks.length > 0) {
      combined.sources.push("MTGTop8");
      combined.decks = [...mtgtop8.decks];
      combined.totalDecks = mtgtop8.totalDecks;
    }

    // Merge Goldfish data if available
    if (goldfish && goldfish.decks && goldfish.decks.length > 0) {
      combined.sources.push("MTGGoldfish");

      // Merge unique decks from Goldfish
      goldfish.decks.forEach((gDeck) => {
        const exists = combined.decks.find(
          (d) => d.name.toLowerCase() === gDeck.name.toLowerCase()
        );

        if (!exists) {
          combined.decks.push(gDeck);
        }
      });
    }

    // If no data from either source, return null to trigger default response
    if (combined.decks.length === 0) {
      return null;
    }

    // Sort by percentage
    combined.decks.sort((a, b) => b.percentage - a.percentage);

    return combined;
  }

  /**
   * Get recent tournament results
   */
  async fetchRecentTournaments() {
    try {
      const url = `${this.baseUrls.mtgtop8}/events`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      const tournaments = [];

      $("table.Stable tr")
        .slice(1, 11)
        .each((i, elem) => {
          const date = $(elem).find("td").eq(0).text().trim();
          const name = $(elem).find("td").eq(1).find("a").text().trim();
          const format = $(elem).find("td").eq(2).text().trim();
          const players = $(elem).find("td").eq(3).text().trim();

          if (name) {
            tournaments.push({
              date,
              name,
              format,
              players: parseInt(players) || 0,
            });
          }
        });

      return tournaments;
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      return [];
    }
  }

  /**
   * Get top 8 decks from a specific tournament
   */
  async fetchTournamentTop8(tournamentUrl) {
    try {
      const response = await fetch(tournamentUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      const top8 = [];

      $(".chosen_tr, .hover_tr")
        .slice(0, 8)
        .each((i, elem) => {
          const place = i + 1;
          const player = $(elem).find("td").eq(0).text().trim();
          const deck = $(elem).find("td").eq(1).text().trim();

          if (player && deck) {
            top8.push({
              place,
              player,
              deck,
            });
          }
        });

      return top8;
    } catch (error) {
      console.error("Error fetching top 8:", error);
      return [];
    }
  }

  /**
   * Get matchup data for top decks
   */
  async fetchMatchupData(format, deck1, deck2) {
    // This would require more complex scraping or historical data
    // For now, return estimated matchup based on archetype
    return this.estimateMatchup(deck1, deck2);
  }

  /**
   * Estimate matchup based on deck archetypes
   */
  estimateMatchup(deck1, deck2) {
    // Simplified matchup logic based on common patterns
    const matchups = {
      aggro_vs_control: { deck1: 45, deck2: 55 },
      control_vs_combo: { deck1: 60, deck2: 40 },
      combo_vs_aggro: { deck1: 40, deck2: 60 },
      midrange_vs_aggro: { deck1: 55, deck2: 45 },
      midrange_vs_control: { deck1: 45, deck2: 55 },
      mirror: { deck1: 50, deck2: 50 },
    };

    // Detect archetype from deck name
    const getArchetype = (deck) => {
      const name = deck.toLowerCase();
      if (
        name.includes("burn") ||
        name.includes("red") ||
        name.includes("aggro")
      )
        return "aggro";
      if (
        name.includes("control") ||
        name.includes("uw") ||
        name.includes("azor")
      )
        return "control";
      if (
        name.includes("combo") ||
        name.includes("storm") ||
        name.includes("tron")
      )
        return "combo";
      return "midrange";
    };

    const arch1 = getArchetype(deck1);
    const arch2 = getArchetype(deck2);

    if (arch1 === arch2) return matchups.mirror;

    const key = `${arch1}_vs_${arch2}`;
    return matchups[key] || { deck1: 50, deck2: 50 };
  }

  /**
   * Default response when scraping fails - provide sample data
   */
  getDefaultMetaResponse(format) {
    // Provide sample meta data for each format
    const sampleMeta = {
      standard: [
        { name: "Domain Control", percentage: 18.5, count: 45 },
        { name: "Rakdos Midrange", percentage: 15.2, count: 37 },
        { name: "Esper Legends", percentage: 12.8, count: 31 },
        { name: "Mono Red Aggro", percentage: 10.5, count: 26 },
        { name: "Azorius Soldiers", percentage: 8.3, count: 20 },
      ],
      modern: [
        { name: "Rakdos Scam", percentage: 14.2, count: 89 },
        { name: "Yawgmoth Combo", percentage: 11.8, count: 74 },
        { name: "Amulet Titan", percentage: 10.5, count: 66 },
        { name: "Hammer Time", percentage: 9.3, count: 58 },
        { name: "Burn", percentage: 8.7, count: 55 },
      ],
      commander: [
        { name: "Atraxa, Praetors' Voice", percentage: 4.2, count: 156 },
        { name: "The Ur-Dragon", percentage: 3.8, count: 141 },
        { name: "Edgar Markov", percentage: 3.5, count: 130 },
        { name: "Korvold, Fae-Cursed King", percentage: 3.2, count: 119 },
        { name: "Muldrotha, the Gravetide", percentage: 2.9, count: 108 },
      ],
      pioneer: [
        { name: "Rakdos Midrange", percentage: 16.3, count: 52 },
        { name: "Green Devotion", percentage: 13.7, count: 44 },
        { name: "Azorius Control", percentage: 11.2, count: 36 },
        { name: "Mono White Humans", percentage: 9.8, count: 31 },
        { name: "Izzet Phoenix", percentage: 8.4, count: 27 },
      ],
      legacy: [
        { name: "Delver", percentage: 12.5, count: 28 },
        { name: "Reanimator", percentage: 10.3, count: 23 },
        { name: "Death & Taxes", percentage: 9.7, count: 22 },
        { name: "Lands", percentage: 8.9, count: 20 },
        { name: "Storm", percentage: 7.6, count: 17 },
      ],
      vintage: [
        { name: "Shops", percentage: 18.2, count: 12 },
        { name: "Dredge", percentage: 15.6, count: 10 },
        { name: "Oath", percentage: 13.4, count: 9 },
        { name: "BUG Midrange", percentage: 11.8, count: 8 },
        { name: "Jeskai Control", percentage: 10.2, count: 7 },
      ],
      pauper: [
        { name: "Affinity", percentage: 14.8, count: 67 },
        { name: "Faeries", percentage: 12.3, count: 56 },
        { name: "Burn", percentage: 10.9, count: 49 },
        { name: "Tron", percentage: 9.5, count: 43 },
        { name: "Bogles", percentage: 8.2, count: 37 },
      ],
    };

    const decks = sampleMeta[format.toLowerCase()] || [
      { name: "Unknown Deck 1", percentage: 20.0, count: 10 },
      { name: "Unknown Deck 2", percentage: 15.0, count: 8 },
      { name: "Unknown Deck 3", percentage: 12.0, count: 6 },
      { name: "Unknown Deck 4", percentage: 10.0, count: 5 },
      { name: "Unknown Deck 5", percentage: 8.0, count: 4 },
    ];

    return {
      format: format,
      lastUpdated: new Date().toISOString(),
      decks: decks,
      totalDecks: decks.reduce((sum, d) => sum + d.count, 0),
      sources: ["Sample Data"],
      note: "Using sample data - live data temporarily unavailable",
    };
  }
}

module.exports = MetaScraper;
