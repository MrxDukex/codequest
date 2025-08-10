/**
 * Card Set Parser for MTG Judge Bot
 * Handles parsing of card commands with optional set specifications
 */

class CardSetParser {
  /**
   * Parse a card command to extract card name and optional set identifier
   * Supports formats:
   * - !card [card name] from [set]
   * - !card [card name] [set code]
   * - !card [card name]
   *
   * @param {string} content - The full command string
   * @returns {Object} - { cardName: string, setIdentifier: string|null }
   */
  static parseCardCommand(content) {
    // Remove "!card " prefix (5 characters)
    let query = content.slice(5).trim();

    if (!query) {
      return { cardName: null, setIdentifier: null };
    }

    // Check for "from" keyword (case-insensitive)
    // Look for the LAST occurrence of " from " to handle cards with "from" in their name
    const lastFromIndex = query.toLowerCase().lastIndexOf(" from ");

    if (lastFromIndex > -1) {
      // Check if there's something after "from"
      const afterFrom = query.substring(lastFromIndex + 6).trim();

      // Only treat as set identifier if there's text after "from"
      // and it looks like a set (short code or set name)
      if (afterFrom.length > 0) {
        // Check if it looks like a set code (3-5 alphanumeric chars)
        // or a set name (contains spaces or longer text)
        const looksLikeSet =
          (afterFrom.length <= 5 && /^[a-zA-Z0-9]+$/.test(afterFrom)) || // Set code
          afterFrom.includes(" ") || // Multi-word set name
          afterFrom.length > 5; // Longer set name

        if (looksLikeSet) {
          return {
            cardName: query.substring(0, lastFromIndex).trim(),
            setIdentifier: afterFrom,
          };
        }
      }
    }

    // Check if last word might be a set code
    // Set codes are typically 3-4 characters (some special ones are longer)
    const words = query.split(/\s+/);

    if (words.length > 1) {
      const lastWord = words[words.length - 1];

      // Check if last word looks like a set code:
      // - 3-4 characters long (most common)
      // - All alphanumeric
      // - Not a common card word
      const commonCardWords = [
        "creature",
        "instant",
        "sorcery",
        "enchantment",
        "artifact",
        "planeswalker",
        "land",
        "above", // For "Gifts from Above"
        "beyond", // For "Blessings from Beyond"
        "orthanc", // For "Escape from Orthanc"
        // Common card name endings that shouldn't be treated as sets
        "plate",
        "saga",
        "wrath",
        "king",
        "queen",
        "knight",
        "dragon",
        "angel",
        "demon",
        "beast",
        "guard",
        "blade",
        "sword",
        "shield",
        "helm",
        "crown",
        "throne",
        "tower",
        "gate",
        "wall",
        "stone",
        "ring",
        "charm",
        "curse",
        "blessing",
        "protection",
        "destruction",
        "creation",
        "champion",
        "master",
        "lord",
        "titan",
        // Additional common words
        "box",
        "god",
        "ice",
        "fire",
        "top",
        "run",
        "mox",
        "soul",
        "mind",
        "body",
        "heart",
        "hand",
        "eye",
        "claw",
        "fang",
        "horn",
        "wing",
        "tail",
        "rage",
        "fury",
        "wrath",
        "storm",
        "bolt",
        "strike",
        "blast",
        "wave",
        "tide",
        "flood",
        "burn",
        "shock",
        "spark",
        "flame",
        "blaze",
        "light",
        "dark",
        "shadow",
        "void",
        "abyss",
        "depths",
        "peak",
        "summit",
        "valley",
        "forest",
        "plains",
        "island",
        "swamp",
        "mountain",
      ];

      if (
        lastWord.length >= 3 &&
        lastWord.length <= 5 &&
        /^[a-zA-Z0-9]+$/.test(lastWord) &&
        !commonCardWords.includes(lastWord.toLowerCase())
      ) {
        // Additional check: if the last word is a common English word, it's probably not a set code
        // Set codes are usually abbreviations like "mh2", "znr", "c17", etc.
        // If it's 4+ letters and all lowercase, it's likely part of the card name
        if (lastWord.length >= 4 && lastWord === lastWord.toLowerCase()) {
          // Likely a card name word, not a set code
          return {
            cardName: query,
            setIdentifier: null,
          };
        }

        // Only treat as set code if it's all uppercase or looks like a typical set code
        if (
          lastWord === lastWord.toUpperCase() ||
          (lastWord.length === 3 && /^[a-z0-9]+$/.test(lastWord.toLowerCase()))
        ) {
          return {
            cardName: words.slice(0, -1).join(" "),
            setIdentifier: lastWord,
          };
        }
      }
    }

    // No set specified
    return {
      cardName: query,
      setIdentifier: null,
    };
  }

  /**
   * Get a card from a specific set using Scryfall API
   * @param {string} cardName - The card name to search for
   * @param {string} setIdentifier - The set code or name
   * @returns {Object|null} - Card data or null if not found
   */
  static async getCardFromSet(cardName, setIdentifier) {
    try {
      // First, try partial set name matching for longer identifiers
      // This handles cases like "edge of eternities" matching "Edge of Eternities Commander"
      if (setIdentifier.length > 4) {
        try {
          console.log(
            `[SET SEARCH] Checking for partial match of "${setIdentifier}"...`
          );
          const allSetsUrl = `https://api.scryfall.com/sets`;
          const setsResponse = await fetch(allSetsUrl);

          if (setsResponse.ok) {
            const setsData = await setsResponse.json();

            // Find all matching sets
            const matchingSets = setsData.data.filter((set) =>
              set.name.toLowerCase().includes(setIdentifier.toLowerCase())
            );

            // Sort by best match (prefer sets that start with the identifier)
            matchingSets.sort((a, b) => {
              const aStartsWith = a.name
                .toLowerCase()
                .startsWith(setIdentifier.toLowerCase());
              const bStartsWith = b.name
                .toLowerCase()
                .startsWith(setIdentifier.toLowerCase());

              if (aStartsWith && !bStartsWith) return -1;
              if (!aStartsWith && bStartsWith) return 1;

              // Also prefer Commander sets for common searches
              const aIsCommander = a.name.toLowerCase().includes("commander");
              const bIsCommander = b.name.toLowerCase().includes("commander");

              if (aIsCommander && !bIsCommander) return -1;
              if (!aIsCommander && bIsCommander) return 1;

              return 0;
            });

            // Try each matching set until we find the card
            for (const matchingSet of matchingSets) {
              console.log(
                `[SET SEARCH] Checking set: "${matchingSet.name}" (${matchingSet.code})`
              );

              const searchUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
                cardName
              )}" set:${encodeURIComponent(matchingSet.code)}&unique=cards`;

              const response = await fetch(searchUrl);

              if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                  console.log(
                    `✅ Found "${data.data[0].name}" in set "${matchingSet.name}" (partial match)`
                  );
                  return data.data[0];
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error with partial set matching:`, error);
        }
      }

      // Try with set code (most precise)
      const setCode = setIdentifier.toLowerCase();

      // First try fuzzy search with set - this handles special characters better
      let searchUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
        cardName
      )}" set:${encodeURIComponent(setCode)}&unique=cards`;

      console.log(
        `[SET SEARCH] Searching for "${cardName}" in set "${setCode}"`
      );
      let response = await fetch(searchUrl);

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          // Find best match - prioritize exact matches
          const exactMatch = data.data.find(
            (card) => card.name.toLowerCase() === cardName.toLowerCase()
          );

          if (exactMatch) {
            console.log(`✅ Found "${exactMatch.name}" in set ${setCode}`);
            return exactMatch;
          }

          // Check for fuzzy matches (missing apostrophes, etc.)
          const normalizedInput = cardName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "");
          const fuzzyMatch = data.data.find(
            (card) =>
              card.name.toLowerCase().replace(/[^a-z0-9\s]/g, "") ===
              normalizedInput
          );

          if (fuzzyMatch) {
            console.log(
              `✅ Found "${fuzzyMatch.name}" in set ${setCode} (fuzzy match)`
            );
            return fuzzyMatch;
          }

          // Return first result if no exact match
          console.log(
            `✅ Found similar card "${data.data[0].name}" in set ${setCode}`
          );
          return data.data[0];
        }
      }

      // Try exact name match with set as fallback
      searchUrl = `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(
        cardName
      )}" set:${encodeURIComponent(setCode)}&unique=cards`;

      response = await fetch(searchUrl);

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          console.log(`✅ Found "${cardName}" in set ${setCode} (exact match)`);
          return data.data[0];
        }
      }

      // Try with full set name
      if (setIdentifier.length > 4) {
        searchUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
          cardName
        )}" set:"${encodeURIComponent(setIdentifier)}"&unique=cards`;

        response = await fetch(searchUrl);

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            console.log(
              `✅ Found "${data.data[0].name}" in set "${setIdentifier}" (by name)`
            );
            return data.data[0];
          }
        }
      }

      console.log(`❌ Card "${cardName}" not found in set "${setIdentifier}"`);
      return null;
    } catch (error) {
      console.error(`Error searching for card in set:`, error);
      return null;
    }
  }

  /**
   * Get all sets where a card appears
   * @param {string} cardName - The card name to search for
   * @returns {Array} - Array of set objects where the card appears
   */
  static async getCardSets(cardName) {
    try {
      const searchUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
        cardName
      )}"&unique=prints&order=released`;
      const response = await fetch(searchUrl);

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          // Extract unique sets
          const sets = new Map();

          data.data.forEach((card) => {
            if (!sets.has(card.set)) {
              sets.set(card.set, {
                code: card.set,
                name: card.set_name,
                released: card.released_at,
              });
            }
          });

          return Array.from(sets.values());
        }
      }

      return [];
    } catch (error) {
      console.error(`Error getting card sets:`, error);
      return [];
    }
  }
}

module.exports = CardSetParser;
