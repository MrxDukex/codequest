const TavilySearch = require("./tavilySearch");
const BraveSearch = require("./braveSearch");
const RSSMonitor = require("./rssMonitor");
const NodeCache = require("node-cache");

class SearchAggregator {
  constructor(config = {}) {
    // Initialize search engines
    this.tavily = new TavilySearch(config.tavilyApiKey);
    this.brave = new BraveSearch(config.braveApiKey);
    this.rssMonitor = new RSSMonitor();

    // Cache search results for 24 hours
    this.cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

    // Configuration
    this.config = {
      useTavily: config.tavilyApiKey ? true : false,
      useBrave: true, // Brave works without API key for basic searches
      useRSS: true,
      cacheEnabled: config.cacheEnabled !== false,
      ...config,
    };
  }

  /**
   * Perform a comprehensive search across all sources
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Aggregated search results
   */
  async search(query, options = {}) {
    // Check cache first
    if (this.config.cacheEnabled) {
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log("Returning cached search results for:", query);
        return cached;
      }
    }

    const results = {
      query: query,
      timestamp: new Date().toISOString(),
      sources: [],
      combinedAnswer: null,
      webResults: [],
      news: [],
      discussions: [],
      videos: [],
      rssItems: [],
      hasResults: false,
    };

    // Parallel search across all enabled sources
    const searchPromises = [];

    // Tavily Search (best for detailed answers)
    if (this.config.useTavily) {
      searchPromises.push(
        this.tavily
          .searchMTGNews(query)
          .then((tavilyResults) => {
            if (tavilyResults && tavilyResults.hasDetailedInfo) {
              results.sources.push("Tavily");
              results.combinedAnswer = tavilyResults.summary;
              if (tavilyResults.sources) {
                results.webResults.push(
                  ...tavilyResults.sources.map((s) => ({
                    ...s,
                    source: "Tavily",
                  }))
                );
              }
            }
          })
          .catch((err) => console.error("Tavily search error:", err))
      );
    }

    // Brave Search (good for recent news and discussions)
    if (this.config.useBrave) {
      searchPromises.push(
        this.brave
          .searchMTG(query)
          .then((braveResults) => {
            if (braveResults && braveResults.hasResults) {
              results.sources.push("Brave");
              if (braveResults.results.webResults) {
                results.webResults.push(
                  ...braveResults.results.webResults.map((r) => ({
                    ...r,
                    source: "Brave",
                  }))
                );
              }
              if (braveResults.results.news) {
                results.news.push(...braveResults.results.news);
              }
              if (braveResults.results.discussions) {
                results.discussions.push(...braveResults.results.discussions);
              }
              if (braveResults.results.videos) {
                results.videos.push(...braveResults.results.videos);
              }
            }
          })
          .catch((err) => console.error("Brave search error:", err))
      );
    }

    // RSS Feed Search
    if (this.config.useRSS) {
      searchPromises.push(
        this.rssMonitor
          .searchInFeeds(query, 10)
          .then((rssResults) => {
            if (rssResults && rssResults.length > 0) {
              results.sources.push("RSS");
              results.rssItems = rssResults;
            }
          })
          .catch((err) => console.error("RSS search error:", err))
      );
    }

    // Wait for all searches to complete
    await Promise.all(searchPromises);

    // Check if we have any results
    results.hasResults =
      results.webResults.length > 0 ||
      results.news.length > 0 ||
      results.discussions.length > 0 ||
      results.rssItems.length > 0 ||
      results.combinedAnswer !== null;

    // If no detailed answer from Tavily, try to generate one from collected data
    if (!results.combinedAnswer && results.hasResults) {
      results.combinedAnswer = this.synthesizeAnswer(query, results);
    }

    // Cache the results
    if (this.config.cacheEnabled && results.hasResults) {
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;
      this.cache.set(cacheKey, results);
    }

    return results;
  }

  /**
   * Search specifically for information about upcoming MTG sets
   * @param {string} setName - The set name to search for
   * @returns {Promise<Object>} - Set information
   */
  async searchUpcomingSet(setName) {
    const query = `"${setName}" Magic the Gathering set release date spoilers mechanics products`;

    const results = await this.search(query, {
      searchDepth: "advanced",
    });

    // Also get RSS feed info about releases
    const releaseNews = await this.rssMonitor.getUpcomingReleases();
    const relevantReleases = releaseNews.filter(
      (item) =>
        item.title?.toLowerCase().includes(setName.toLowerCase()) ||
        item.content?.toLowerCase().includes(setName.toLowerCase())
    );

    if (relevantReleases.length > 0) {
      results.releaseNews = relevantReleases;
    }

    // Structure the response for set information
    const setInfo = {
      setName: setName,
      hasInformation: results.hasResults || relevantReleases.length > 0,
      summary: results.combinedAnswer,
      releaseInfo: this.extractReleaseInfo(results, relevantReleases),
      sources: results.sources,
      articles: results.webResults.slice(0, 5),
      discussions: results.discussions.slice(0, 3),
      latestNews: relevantReleases.slice(0, 3),
    };

    return setInfo;
  }

  /**
   * Get the latest MTG news from all sources
   * @param {number} limit - Number of items to return
   * @returns {Promise<Object>} - Latest news
   */
  async getLatestMTGNews(limit = 10) {
    const results = {
      timestamp: new Date().toISOString(),
      news: [],
      announcements: [],
      spoilers: [],
      discussions: [],
    };

    // Get RSS news
    const rssNews = await this.rssMonitor.getLatestNews(limit * 2);
    results.news.push(
      ...rssNews.map((item) => ({
        ...item,
        source: "RSS: " + item.source,
      }))
    );

    // Get Brave latest news
    if (this.config.useBrave) {
      const braveNews = await this.brave.searchLatestMTGNews();
      if (braveNews.latestNews) {
        results.news.push(
          ...braveNews.latestNews.map((item) => ({
            ...item,
            source: "Brave Search",
          }))
        );
      }
      if (braveNews.discussions) {
        results.discussions.push(...braveNews.discussions);
      }
    }

    // Sort all news by date
    results.news.sort((a, b) => {
      const dateA = new Date(a.pubDate || a.age || 0);
      const dateB = new Date(b.pubDate || b.age || 0);
      return dateB - dateA;
    });

    // Categorize news
    results.news.forEach((item) => {
      const title = item.title?.toLowerCase() || "";
      const content = item.content?.toLowerCase() || "";

      if (title.includes("announcement") || content.includes("announced")) {
        results.announcements.push(item);
      }
      if (
        title.includes("spoiler") ||
        title.includes("preview") ||
        content.includes("revealed")
      ) {
        results.spoilers.push(item);
      }
    });

    // Limit results
    results.news = results.news.slice(0, limit);
    results.announcements = results.announcements.slice(0, 5);
    results.spoilers = results.spoilers.slice(0, 5);

    return results;
  }

  /**
   * Synthesize an answer from collected search results
   * @param {string} query - Original query
   * @param {Object} results - Collected results
   * @returns {string} - Synthesized answer
   */
  synthesizeAnswer(query, results) {
    let answer = "";

    // Check if we have RSS items with relevant content
    if (results.rssItems && results.rssItems.length > 0) {
      const topItem = results.rssItems[0];
      answer += `According to ${topItem.source}: ${topItem.title}. `;
      if (topItem.content) {
        answer += topItem.content.substring(0, 200) + "... ";
      }
    }

    // Add web results summary
    if (results.webResults && results.webResults.length > 0) {
      const topResults = results.webResults.slice(0, 2);
      topResults.forEach((result) => {
        if (result.content || result.description) {
          answer +=
            (result.content || result.description).substring(0, 150) + "... ";
        }
      });
    }

    // Add news if available
    if (results.news && results.news.length > 0) {
      answer += "\n\nRecent news: " + results.news[0].title;
    }

    return (
      answer ||
      "No specific information found. Try searching for more specific terms."
    );
  }

  /**
   * Extract release information from search results
   * @param {Object} results - Search results
   * @param {Array} releaseNews - Release news items
   * @returns {Object} - Structured release information
   */
  extractReleaseInfo(results, releaseNews) {
    const info = {
      releaseDate: null,
      prereleaseDate: null,
      products: [],
      mechanics: [],
      themes: [],
    };

    // Parse results for dates
    const datePattern = /(\w+\s+\d{1,2},?\s+\d{4})/g;
    const allText = JSON.stringify(results) + JSON.stringify(releaseNews);
    const dates = allText.match(datePattern);

    if (dates && dates.length > 0) {
      // Look for specific date mentions
      dates.forEach((date) => {
        const context = allText.substring(
          Math.max(0, allText.indexOf(date) - 50),
          Math.min(allText.length, allText.indexOf(date) + 50)
        );

        if (context.toLowerCase().includes("release")) {
          info.releaseDate = date;
        }
        if (context.toLowerCase().includes("prerelease")) {
          info.prereleaseDate = date;
        }
      });
    }

    // Extract product information
    const productKeywords = [
      "booster",
      "bundle",
      "collector",
      "commander",
      "deck",
      "box",
    ];
    productKeywords.forEach((keyword) => {
      if (allText.toLowerCase().includes(keyword)) {
        info.products.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return info;
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.flushAll();
    this.rssMonitor.clearCache();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getCacheStats() {
    return {
      searchCache: this.cache.getStats(),
      rssCache: this.rssMonitor.getCacheStats(),
    };
  }
}

module.exports = SearchAggregator;
