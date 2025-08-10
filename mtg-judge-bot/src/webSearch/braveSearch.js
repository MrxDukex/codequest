const axios = require("axios");

class BraveSearch {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.search.brave.com/res/v1";
  }

  /**
   * Search the web using Brave Search API
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Search results
   */
  async search(query, options = {}) {
    try {
      // Brave Search offers free tier without API key for basic searches
      const headers = {};
      if (this.apiKey) {
        headers["X-Subscription-Token"] = this.apiKey;
      }

      const params = {
        q: query,
        count: options.count || 10,
        offset: options.offset || 0,
        safesearch: options.safesearch || "moderate",
      };

      // Only add optional parameters if they have values
      if (options.freshness) {
        params.freshness = options.freshness;
      }

      // Remove null values
      Object.keys(params).forEach(
        (key) => params[key] === null && delete params[key]
      );

      const response = await axios.get(`${this.baseUrl}/web/search`, {
        headers,
        params,
      });

      if (response.data) {
        return {
          query: response.data.query?.original || query,
          webResults: response.data.web?.results?.map((result) => ({
            title: result.title,
            url: result.url,
            description: result.description,
            age: result.age,
            snippet: result.extra_snippets?.[0] || result.description,
          })),
          news: response.data.news?.results,
          videos: response.data.videos?.results,
          infobox: response.data.infobox,
          discussions: response.data.discussions?.results,
          faq: response.data.faq?.results,
        };
      }

      return null;
    } catch (error) {
      console.error("Brave search error:", error.message);
      if (error.response?.status === 401) {
        console.error("Invalid Brave API key (if using premium features)");
      } else if (error.response?.status === 429) {
        console.error("Brave API rate limit exceeded");
      }
      return null;
    }
  }

  /**
   * Search for MTG-related content with enhanced filtering
   * @param {string} topic - The MTG topic to search for
   * @returns {Promise<Object>} - Structured MTG search results
   */
  async searchMTG(topic) {
    // Enhance query with MTG-specific terms
    const query = `"Magic the Gathering" OR MTG ${topic}`;

    const results = await this.search(query, {
      count: 20,
      freshness: "pw", // Past week for recent news
    });

    if (results) {
      // Filter and prioritize MTG-specific results
      const mtgResults = {
        webResults: [],
        news: [],
        discussions: [],
        videos: [],
      };

      // Filter web results for MTG relevance
      if (results.webResults) {
        mtgResults.webResults = results.webResults.filter((result) => {
          const url = result.url.toLowerCase();
          const title = result.title.toLowerCase();
          const desc = result.description?.toLowerCase() || "";

          // Prioritize known MTG sites
          const isMTGSite =
            url.includes("wizards.com") ||
            url.includes("scryfall.com") ||
            url.includes("edhrec.com") ||
            url.includes("mtggoldfish.com") ||
            url.includes("channelfireball.com") ||
            url.includes("starcitygames.com") ||
            url.includes("mythicspoiler.com") ||
            url.includes("reddit.com/r/magictcg");

          // Check content relevance
          const hasRelevantContent =
            title.includes("magic") ||
            title.includes("mtg") ||
            desc.includes("magic the gathering") ||
            desc.includes("wizards of the coast");

          return isMTGSite || hasRelevantContent;
        });
      }

      // Include news if available
      if (results.news) {
        mtgResults.news = results.news;
      }

      // Include discussions (often Reddit threads)
      if (results.discussions) {
        mtgResults.discussions = results.discussions;
      }

      // Include videos
      if (results.videos) {
        mtgResults.videos = results.videos;
      }

      return {
        query: topic,
        results: mtgResults,
        hasResults:
          mtgResults.webResults.length > 0 ||
          mtgResults.news?.length > 0 ||
          mtgResults.discussions?.length > 0,
      };
    }

    return {
      query: topic,
      results: { webResults: [], news: [], discussions: [], videos: [] },
      hasResults: false,
    };
  }

  /**
   * Search for the latest MTG news and announcements
   * @param {string} topic - Optional specific topic
   * @returns {Promise<Object>} - Latest MTG news
   */
  async searchLatestMTGNews(topic = "") {
    const query = `"Magic the Gathering" ${topic} announcement news spoiler release date site:magic.wizards.com OR site:reddit.com/r/magicTCG`;

    const results = await this.search(query, {
      count: 15,
      freshness: "pd", // Past day for very recent news
    });

    if (results && results.webResults) {
      // Sort by recency if age information is available
      const sortedResults = results.webResults.sort((a, b) => {
        if (!a.age && !b.age) return 0;
        if (!a.age) return 1;
        if (!b.age) return -1;
        return a.age.localeCompare(b.age);
      });

      return {
        latestNews: sortedResults.slice(0, 5),
        discussions: results.discussions || [],
        hasRecentUpdates: sortedResults.length > 0,
      };
    }

    return {
      latestNews: [],
      discussions: [],
      hasRecentUpdates: false,
    };
  }
}

module.exports = BraveSearch;
