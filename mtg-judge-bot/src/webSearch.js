const https = require("https");
const config = require("../config");

/**
 * Search Google using Custom Search API
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of search results
 */
async function searchWeb(query) {
  return new Promise((resolve, reject) => {
    const apiKey = config.google.apiKey;
    const searchEngineId = config.google.searchEngineId;

    if (!apiKey || !searchEngineId) {
      console.error("Google API credentials not configured");
      // Fallback to basic results if API not configured
      resolve([
        {
          title: "Search Configuration Required",
          snippet:
            "Google Custom Search API needs to be configured. Please add GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID to your .env file.",
          url: "https://developers.google.com/custom-search/v1/introduction",
        },
      ]);
      return;
    }

    // Build the Google Custom Search API URL
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      query
    )}&num=5`;

    https
      .get(searchUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const searchResults = JSON.parse(data);
            const results = [];

            if (searchResults.items) {
              searchResults.items.forEach((item) => {
                results.push({
                  title: item.title,
                  snippet: item.snippet || "No description available",
                  url: item.link,
                });
              });
            } else if (searchResults.error) {
              console.error("Google Search API Error:", searchResults.error);
              results.push({
                title: "Search Error",
                snippet: `API Error: ${searchResults.error.message}. Check your API key and quota.`,
                url: "https://console.cloud.google.com",
              });
            } else {
              results.push({
                title: "No Results Found",
                snippet:
                  "No search results found for your query. Try different search terms.",
                url: "https://google.com",
              });
            }

            resolve(results);
          } catch (error) {
            console.error("Error parsing search results:", error);
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        console.error("Error making search request:", error);
        reject(error);
      });
  });
}

/**
 * Search for MTG rules updates and changes
 * @param {string} topic - The topic to search for
 * @returns {Promise<Object>} - Search results and summary
 */
async function searchMTGRulesUpdates(topic) {
  try {
    // Enhance the search query with MTG-specific terms and include Reddit for community rulings
    const enhancedQuery = `"Magic the Gathering" ${topic} site:scryfall.com OR site:gatherer.wizards.com OR site:magic.wizards.com OR site:mtg.fandom.com OR site:reddit.com/r/mtg`;
    console.log(`Searching Google for: ${enhancedQuery}`);

    const results = await searchWeb(enhancedQuery);
    return {
      query: topic,
      results: results,
      summary:
        results.length > 0
          ? `Found ${results.length} results about ${topic}`
          : "No specific results found",
    };
  } catch (error) {
    console.error("Web search error:", error);
    return {
      error: "Could not perform web search",
      query: topic,
    };
  }
}

module.exports = { searchWeb, searchMTGRulesUpdates };
