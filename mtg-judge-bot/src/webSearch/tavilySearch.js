const axios = require("axios");

class TavilySearch {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.tavily.com";
  }

  /**
   * Search the web using Tavily API
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Search results with answer
   */
  async search(query, options = {}) {
    try {
      if (!this.apiKey) {
        console.log("Tavily API key not configured, skipping Tavily search");
        return null;
      }

      const searchOptions = {
        api_key: this.apiKey,
        query: query,
        search_depth: options.searchDepth || "advanced",
        include_answer: options.includeAnswer !== false,
        include_raw_content: options.includeRawContent || false,
        max_results: options.maxResults || 5,
        include_domains: options.includeDomains || [],
        exclude_domains: options.excludeDomains || [],
      };

      // Add MTG-specific domains if searching for MTG content
      if (
        query.toLowerCase().includes("mtg") ||
        query.toLowerCase().includes("magic")
      ) {
        searchOptions.include_domains = [
          ...searchOptions.include_domains,
          "magic.wizards.com",
          "scryfall.com",
          "edhrec.com",
          "mtggoldfish.com",
          "channelfireball.com",
          "starcitygames.com",
          "reddit.com/r/magicTCG",
          "mythicspoiler.com",
        ];
      }

      const response = await axios.post(
        `${this.baseUrl}/search`,
        searchOptions
      );

      if (response.data) {
        return {
          answer: response.data.answer,
          query: response.data.query,
          results: response.data.results?.map((result) => ({
            title: result.title,
            url: result.url,
            content: result.content,
            score: result.score,
          })),
          images: response.data.images,
          response_time: response.data.response_time,
        };
      }

      return null;
    } catch (error) {
      console.error("Tavily search error:", error.message);
      if (error.response?.status === 401) {
        console.error("Invalid Tavily API key");
      } else if (error.response?.status === 429) {
        console.error("Tavily API rate limit exceeded");
      }
      return null;
    }
  }

  /**
   * Search specifically for MTG news and announcements
   * @param {string} topic - The MTG topic to search for
   * @returns {Promise<Object>} - Structured MTG news results
   */
  async searchMTGNews(topic) {
    const query = `Magic the Gathering ${topic} news announcement release date spoilers`;

    const results = await this.search(query, {
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 10,
      includeDomains: [
        "magic.wizards.com",
        "mythicspoiler.com",
        "mtggoldfish.com",
      ],
    });

    if (results && results.answer) {
      // Process and structure the results for MTG-specific information
      return {
        summary: results.answer,
        sources: results.results,
        query: topic,
        hasDetailedInfo: true,
      };
    }

    return {
      summary: "No detailed information found",
      sources: [],
      query: topic,
      hasDetailedInfo: false,
    };
  }
}

module.exports = TavilySearch;
