require("dotenv").config();
const SearchAggregator = require("../src/webSearch/searchAggregator");
const KnowledgeCache = require("../src/knowledge/cache");

async function testSearchAggregator() {
  console.log("🧪 Testing Search Aggregator...\n");

  // Initialize components
  const searchAggregator = new SearchAggregator({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    braveApiKey: process.env.BRAVE_API_KEY,
    cacheEnabled: true,
  });

  const knowledgeCache = new KnowledgeCache();
  await knowledgeCache.initialize();

  // Test 1: Search for upcoming Spider-Man set
  console.log("Test 1: Searching for Spider-Man set information...");
  try {
    const spiderManResults = await searchAggregator.searchUpcomingSet(
      "Spider-Man"
    );
    console.log("✅ Spider-Man set search results:");
    console.log("- Has information:", spiderManResults.hasInformation);
    console.log("- Summary:", spiderManResults.summary?.substring(0, 200));
    console.log("- Sources used:", spiderManResults.sources);
    console.log(
      "- Articles found:",
      spiderManResults.articles?.length || 0,
      "\n"
    );
  } catch (error) {
    console.error("❌ Spider-Man search failed:", error.message, "\n");
  }

  // Test 2: Get latest MTG news
  console.log("Test 2: Getting latest MTG news...");
  try {
    const latestNews = await searchAggregator.getLatestMTGNews(5);
    console.log("✅ Latest news results:");
    console.log("- Total news items:", latestNews.news?.length || 0);
    console.log("- Announcements:", latestNews.announcements?.length || 0);
    console.log("- Spoilers:", latestNews.spoilers?.length || 0);
    if (latestNews.news && latestNews.news[0]) {
      console.log(
        "- Latest item:",
        latestNews.news[0].title?.substring(0, 100),
        "\n"
      );
    }
  } catch (error) {
    console.error("❌ Latest news fetch failed:", error.message, "\n");
  }

  // Test 3: General search
  console.log("Test 3: General search for 'upcoming sets'...");
  try {
    const generalResults = await searchAggregator.search(
      "upcoming Magic the Gathering sets 2025"
    );
    console.log("✅ General search results:");
    console.log("- Has results:", generalResults.hasResults);
    console.log("- Sources used:", generalResults.sources);
    console.log("- Web results:", generalResults.webResults?.length || 0);
    console.log("- RSS items:", generalResults.rssItems?.length || 0, "\n");
  } catch (error) {
    console.error("❌ General search failed:", error.message, "\n");
  }

  // Test 4: Cache functionality
  console.log("Test 4: Testing cache...");
  try {
    // Store a test search result
    await knowledgeCache.cacheSearchResult("test query", { test: "data" }, 60);

    // Retrieve it
    const cached = await knowledgeCache.getCachedSearch("test query");
    console.log("✅ Cache working:", cached !== null);

    // Get cache stats
    const stats = await knowledgeCache.getStats();
    console.log("- Cache stats:", stats, "\n");
  } catch (error) {
    console.error("❌ Cache test failed:", error.message, "\n");
  }

  // Close database connection
  knowledgeCache.close();

  console.log("🎉 All tests completed!");
  console.log(
    "\n📝 Note: If Tavily API key is not set, those searches will be skipped."
  );
  console.log("Brave Search works without an API key for basic functionality.");
}

// Run tests
testSearchAggregator().catch(console.error);
