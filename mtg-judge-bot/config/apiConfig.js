const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
  openai: {
    provider: "openai",
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
  },
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: "llama-3.1-sonar-large-128k-online", // This model has internet access
  },
  scryfall: {
    baseUrl: "https://api.scryfall.com/cards/named?fuzzy=",
    exactUrl: "https://api.scryfall.com/cards/named?exact=",
    searchUrl: "https://api.scryfall.com/cards/search",
  },
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
  },
};
