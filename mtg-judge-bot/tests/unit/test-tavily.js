require("dotenv").config();
const TavilySearch = require("../src/webSearch/tavilySearch");

async function testTavilyAPI() {
  console.log("🧪 Testing Tavily API Integration...\n");

  // Check if API key is loaded
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.log("❌ TAVILY_API_KEY not found in environment variables!");
    console.log("Please make sure you added it to your .env file");
    return;
  }

  console.log("✅ Tavily API key detected in environment");
  console.log(`   Key starts with: ${apiKey.substring(0, 8)}...`);

  // Initialize Tavily search
  const tavily = new TavilySearch(apiKey);

  // Test 1: Search for Spider-Man set
  console.log("\n📝 Test 1: Searching for Spider-Man MTG set information...");
  try {
    const results = await tavily.searchMTGNews("Spider-Man Universes Beyond");

    if (results && results.hasDetailedInfo) {
      console.log("✅ Tavily search successful!");
      console.log("\n📊 Results:");
      console.log(
        "- Summary length:",
        results.summary ? results.summary.length : 0,
        "characters"
      );
      console.log(
        "- Sources found:",
        results.sources ? results.sources.length : 0
      );

      if (results.summary) {
        console.log("\n📖 Summary preview (first 300 chars):");
        console.log(results.summary.substring(0, 300) + "...");
      }

      if (results.sources && results.sources.length > 0) {
        console.log("\n🔗 Top sources:");
        results.sources.slice(0, 3).forEach((source, i) => {
          console.log(`${i + 1}. ${source.title || source.url}`);
        });
      }
    } else {
      console.log(
        "⚠️ Tavily returned no results (API may be working but no data found)"
      );
    }
  } catch (error) {
    console.log("❌ Tavily API error:", error.message);
    if (error.response?.status === 401) {
      console.log("   → Invalid API key. Please check your TAVILY_API_KEY");
    } else if (error.response?.status === 429) {
      console.log(
        "   → Rate limit exceeded. You may have used up your free tier"
      );
    }
  }

  // Test 2: General MTG search
  console.log("\n📝 Test 2: General MTG search test...");
  try {
    const generalResults = await tavily.search(
      "Magic the Gathering latest news 2025",
      {
        searchDepth: "basic",
        maxResults: 3,
      }
    );

    if (generalResults) {
      console.log("✅ General search successful!");
      console.log("- Has answer:", !!generalResults.answer);
      console.log(
        "- Results count:",
        generalResults.results ? generalResults.results.length : 0
      );
    }
  } catch (error) {
    console.log("❌ General search failed:", error.message);
  }

  console.log("\n🎉 Tavily API test complete!");
  console.log(
    "\nYour Tavily integration is",
    apiKey ? "configured" : "not configured",
    "and",
    "ready to enhance your bot's web search capabilities!"
  );
}

// Run the test
testTavilyAPI().catch(console.error);
