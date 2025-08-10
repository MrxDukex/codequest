// Simplified RAG system for comprehensive rules
// This version doesn't use langchain to avoid dependency issues

let rulesStore = [];
let initialized = false;

/**
 * Initialize the RAG system with comprehensive rules
 * @param {Array} documents - Array of rule documents with pageContent and metadata
 */
async function initializeRAG(documents) {
  try {
    console.log(
      `Initializing simplified RAG system with ${documents.length} documents...`
    );

    // Store all rules in memory for quick searching
    rulesStore = documents.map((doc) => ({
      content: doc.pageContent || "",
      metadata: doc.metadata || {},
      // Create searchable text by lowercasing
      searchText: (doc.pageContent || "").toLowerCase(),
    }));

    initialized = true;
    console.log(
      `✅ Simplified RAG system initialized with ${rulesStore.length} rules`
    );
    return true;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    throw error;
  }
}

/**
 * Query the RAG system for relevant rules
 * @param {string} query - The question to search for
 * @param {number} k - Number of results to return (default: 5)
 */
async function queryRAG(query, k = 5) {
  if (!initialized || rulesStore.length === 0) {
    console.warn("RAG system not initialized or empty");
    return [];
  }

  try {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

    // Score each rule based on keyword matches
    const scoredRules = rulesStore.map((rule) => {
      let score = 0;

      // Check for exact phrase match
      if (rule.searchText.includes(lowerQuery)) {
        score += 10;
      }

      // Check for individual word matches
      for (const word of queryWords) {
        if (rule.searchText.includes(word)) {
          score += 2;
        }
      }

      return {
        content: rule.content,
        metadata: rule.metadata,
        score: score,
      };
    });

    // Filter out rules with no matches and sort by score
    const relevantRules = scoredRules
      .filter((rule) => rule.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    return relevantRules;
  } catch (error) {
    console.error("Error querying RAG system:", error);
    return [];
  }
}

/**
 * Add new documents to the RAG system
 * @param {Array} documents - New documents to add
 */
async function addDocuments(documents) {
  if (!initialized) {
    console.warn("RAG system not initialized");
    return false;
  }

  try {
    const newRules = documents.map((doc) => ({
      content: doc.pageContent || "",
      metadata: doc.metadata || {},
      searchText: (doc.pageContent || "").toLowerCase(),
    }));

    rulesStore.push(...newRules);
    console.log(`Added ${documents.length} new documents to RAG system`);
    return true;
  } catch (error) {
    console.error("Error adding documents to RAG:", error);
    return false;
  }
}

/**
 * Clear the RAG system
 */
function clearRAG() {
  rulesStore = [];
  initialized = false;
  console.log("RAG system cleared");
}

/**
 * Check if RAG system is initialized
 */
function isInitialized() {
  return initialized;
}

module.exports = {
  initializeRAG,
  queryRAG,
  addDocuments,
  clearRAG,
  isInitialized,
};
