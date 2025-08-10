/**
 * Card Reference Detector for Magic: The Gathering
 * Detects card names mentioned in text and fetches their data
 */

class CardReferenceDetector {
  /**
   * Known card name patterns that are likely to be actual cards
   */
  static cardPatterns = [
    // Specific card name endings
    /\b\w+\s+Prospector\b/gi,
    /\b\w+\s+Warchief\b/gi,
    /\b\w+\s+Bolt\b/gi,
    /\b\w+\s+Ring\b/gi,
    /\b\w+\s+Study\b/gi,
    /\b\w+\s+Season\b/gi,
    /\b\w+\s+Sphinx\b/gi,
    /\b\w+\s+Tithe\b/gi,
    /\b\w+\s+Henge\b/gi,
    /\b\w+\s+Saga\b/gi,
    /\b\w+\s+Will\b/gi,

    // Common MTG card patterns
    /\bLightning\s+\w+\b/gi,
    /\bCounterspell\b/gi,
    /\bSol\s+Ring\b/gi,
    /\b\w+,\s+the\s+\w+\b/gi, // "Name, the Title" pattern
    /\bThe\s+[A-Z]\w+(?:\s+[A-Z]\w+)*\b/g, // "The Something" pattern
  ];

  /**
   * Words to exclude from card detection
   */
  static excludeWords = new Set([
    "the",
    "for",
    "when",
    "if",
    "this",
    "that",
    "each",
    "all",
    "other",
    "your",
    "opponent",
    "official",
    "rulings",
    "creature",
    "spell",
    "permanent",
    "card",
    "ability",
    "effect",
    "cost",
    "mana",
    "turn",
    "phase",
    "step",
    "player",
    "game",
    "battlefield",
    "graveyard",
    "library",
    "hand",
    "exile",
    "stack",
    "target",
    "source",
    "damage",
    "life",
    "counter",
    "token",
    "copy",
    "draw",
    "discard",
    "sacrifice",
    "destroy",
    "tap",
    "untap",
    "attack",
    "block",
    "combat",
    "beginning",
    "end",
    "upkeep",
    "main",
    "declare",
    "resolution",
    "priority",
    "goblin",
    "dragon",
    "elf",
    "human",
    "wizard",
    "warrior",
    "angel",
    "demon",
    "zombie",
    "vampire",
    "merfolk",
    "artifact",
    "enchantment",
    "instant",
    "sorcery",
    "planeswalker",
    "land",
    "basic",
    "legendary",
  ]);

  /**
   * Extract potential card names from text
   * @param {string} text - The text to search for card names
   * @param {string} cardBeingExplained - The card currently being explained (to avoid false positives)
   */
  static extractPotentialCardNames(text, cardBeingExplained = null) {
    const potentialCards = new Set();

    // Only look for cards in the Official Rulings section
    const rulingsIndex = text.indexOf("Official Rulings:");
    let searchText = text;

    // If there's an Official Rulings section, only search within it
    if (rulingsIndex !== -1) {
      searchText = text.substring(rulingsIndex);
    } else {
      // If no official rulings, be very conservative
      return [];
    }

    // Create ignored variations if we're explaining a specific card
    const ignoredVariations = new Set();
    if (cardBeingExplained) {
      const cardName = cardBeingExplained.toLowerCase();
      ignoredVariations.add(cardName);

      // Add possessive forms
      ignoredVariations.add(cardName + "'s");

      // Add individual words from the card name to avoid fragments
      const words = cardName.split(/[\s-,]+/);
      words.forEach((word) => {
        if (word.length > 2) {
          ignoredVariations.add(word);
          ignoredVariations.add(word + "'s");
        }
      });
    }

    // Universal patterns that work for ANY card rulings
    const universalPatterns = [
      // Pattern 1: "doesn't reduce the cost of [Card Name] below"
      /(?:doesn't|does not|won't|will not)\s+reduce the cost of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)\s+below/gi,

      // Pattern 2: "it doesn't reduce the cost of [Card Name] below"
      /it\s+(?:doesn't|does not)\s+reduce the cost of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)\s+below/gi,

      // Pattern 3: "doesn't affect [Card Name] or [Card Name]" - handle each card separately
      /(?:doesn't|does not|won't|will not)\s+affect\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)\s+or\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)(?:\s+since|\s+because|,|\.)/gi,

      // Pattern 4: Comparisons - "Similar to [Card]" or "Unlike [Card]"
      /(?:Similar to|Unlike)\s+([A-Z][a-z]+(?:,?\s+(?:the\s+)?[A-Z][a-z]+)*?)(?:,|\.|;|\s+but)/gi,

      // Pattern 5: Examples - "for example, it doesn't" special case
      /for example,\s+it\s+doesn't\s+reduce the cost of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)\s+below/gi,

      // Pattern 6: Direct cost references
      /cost of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+?)\s+(?:below|by|is)/gi,

      // Pattern 7: "Similar to [Card], but doesn't" pattern
      /Similar to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?),\s+but\s+doesn't/gi,
    ];

    // Process each pattern
    for (const pattern of universalPatterns) {
      let match;
      while ((match = pattern.exec(searchText)) !== null) {
        // Handle patterns that capture multiple groups (for "or" patterns)
        for (let i = 1; i < match.length; i++) {
          if (match[i]) {
            let cardName = match[i].trim();

            // Clean up the card name
            cardName = cardName.replace(/[,.]$/, "");

            // Skip if it's an ignored variation
            if (!ignoredVariations.has(cardName.toLowerCase())) {
              // Universal validation rules
              const wordCount = cardName.split(/\s+/).length;

              // Must be at least 2 words OR a single word of 8+ characters
              if (wordCount >= 2 || (wordCount === 1 && cardName.length >= 8)) {
                // Universal fragment filter - works for ANY card
                if (!this.isFragment(cardName)) {
                  potentialCards.add(cardName);
                }
              }
            }
          }
        }
      }
    }

    return Array.from(potentialCards);
  }

  /**
   * Universal fragment detection - works for ANY card
   */
  static isFragment(cardName) {
    // Fragments are partial card names that shouldn't be detected
    // This is a universal check that doesn't hardcode specific cards

    // Check if it's just "The" + single short word
    if (cardName.startsWith("The ")) {
      const withoutThe = cardName.substring(4);
      if (!withoutThe.includes(" ") && withoutThe.length < 6) {
        return true; // It's a fragment like "The Ur"
      }
    }

    // Check if it ends with a possessive
    if (cardName.endsWith("'s")) {
      return true;
    }

    // Check if it's a single short word that's likely a fragment
    if (!cardName.includes(" ") && cardName.length < 8) {
      // Single words under 8 characters are likely fragments
      // unless they're known single-word cards (handled by length check)
      return true;
    }

    return false;
  }

  /**
   * Filter and validate card names
   */
  static async validateCardNames(potentialNames, getBestCardPrinting) {
    const validCards = [];
    const checkedNames = new Set(); // Avoid checking duplicates

    for (const name of potentialNames) {
      // Skip if already checked
      if (checkedNames.has(name.toLowerCase())) continue;
      checkedNames.add(name.toLowerCase());

      // Skip if it's too generic
      if (
        name.split(" ").length === 1 &&
        this.excludeWords.has(name.toLowerCase())
      ) {
        continue;
      }

      try {
        // Try to fetch the card
        const cardData = await getBestCardPrinting(name);
        if (cardData) {
          validCards.push({
            name: cardData.name,
            mana_cost: cardData.mana_cost,
            type_line: cardData.type_line,
            oracle_text: cardData.oracle_text,
            image_uri:
              cardData.image_uris?.normal ||
              cardData.card_faces?.[0]?.image_uris?.normal ||
              cardData.image_uris?.small ||
              cardData.card_faces?.[0]?.image_uris?.small,
            scryfall_uri: cardData.scryfall_uri,
          });

          // Limit to 3 referenced cards to avoid spam
          if (validCards.length >= 3) break;
        }
      } catch (err) {
        // Silently skip cards that can't be fetched
        console.log(`Could not validate card: ${name}`);
      }
    }

    return validCards;
  }

  /**
   * Format referenced cards for display
   */
  static formatReferencedCards(cards) {
    if (!cards || cards.length === 0) return null;

    let formatted = "\n\n📋 **Referenced Cards:**\n";

    for (const card of cards) {
      formatted += `• **${card.name}**`;
      if (card.mana_cost) {
        formatted += ` - ${card.mana_cost}`;
      }
      if (card.type_line) {
        formatted += ` - ${card.type_line}`;
      }
      if (card.scryfall_uri) {
        formatted += ` - [View](${card.scryfall_uri})`;
      }
      formatted += "\n";
    }

    return formatted;
  }
}

module.exports = CardReferenceDetector;
