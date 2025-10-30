/**
 * Inline Card Detector
 * Detects card names within curly braces {} in Discord messages
 * and returns them for lookup
 */

class InlineCardDetector {
  /**
   * Extract all card references from a message
   * Supports formats:
   * - {Card Name}
   * - {Card Name|SET}
   * - Multiple cards in one message
   * @param {string} message - The message to parse
   * @returns {Array} Array of card references with name and optional set
   */
  static extractCardReferences(message) {
    if (!message || typeof message !== "string") {
      return [];
    }

    // Regex to match content within curly braces
    // Matches: {anything} including {card|set}
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;

    while ((match = regex.exec(message)) !== null) {
      const content = match[1].trim();

      if (content.length === 0) {
        continue; // Skip empty braces
      }

      // Check if it includes a set code (format: card|set)
      const parts = content.split("|").map((p) => p.trim());

      const cardRef = {
        raw: match[0], // The full {card} string
        name: parts[0],
        set: parts[1] || null,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      // Avoid duplicates (same card mentioned multiple times)
      const isDuplicate = matches.some(
        (m) =>
          m.name.toLowerCase() === cardRef.name.toLowerCase() &&
          m.set === cardRef.set
      );

      if (!isDuplicate) {
        // Apply limit of 5 cards maximum
        if (matches.length < 5) {
          matches.push(cardRef);
        }
      }
    }

    return matches;
  }

  /**
   * Check if a message contains any card references
   * @param {string} message - The message to check
   * @returns {boolean} True if message contains card references
   */
  static hasCardReferences(message) {
    if (!message || typeof message !== "string") {
      return false;
    }
    return /\{[^}]*\}/.test(message);
  }

  /**
   * Validate and clean a card name
   * @param {string} cardName - The card name to validate
   * @returns {string} Cleaned card name
   */
  static cleanCardName(cardName) {
    if (!cardName) return "";

    // Remove extra whitespace
    let cleaned = cardName.trim();

    // Remove common typos/issues
    cleaned = cleaned
      .replace(/\s+/g, " ") // Multiple spaces to single space
      .replace(/['']/, "'") // Normalize apostrophes
      .replace(/[""]/g, '"') // Normalize quotes
      .trim();

    return cleaned;
  }

  /**
   * Format a card reference for display
   * @param {Object} cardRef - The card reference object
   * @returns {string} Formatted string for display
   */
  static formatCardReference(cardRef) {
    if (cardRef.set) {
      return `${cardRef.name} (${cardRef.set.toUpperCase()})`;
    }
    return cardRef.name;
  }

  /**
   * Check if the message is asking for too many cards (spam prevention)
   * @param {Array} cardRefs - Array of card references
   * @param {number} maxCards - Maximum allowed cards (default 5)
   * @returns {boolean} True if within limit
   */
  static isWithinLimit(cardRefs, maxCards = 5) {
    return cardRefs.length <= maxCards;
  }

  /**
   * Get a sample usage message for users
   * @returns {string} Help text
   */
  static getUsageHelp() {
    return `**Inline Card Lookup**
You can look up cards by putting their names in curly braces!

**Examples:**
• \`{Sol Ring}\` - Look up Sol Ring
• \`{Lightning Bolt|2ED}\` - Look up Lightning Bolt from 2nd Edition
• \`My deck has {Birds of Paradise} and {Noble Hierarch}\` - Look up multiple cards

**Tips:**
• Maximum 5 cards per message
• Set codes are optional (e.g., |NEO, |DMU)
• Case doesn't matter
• Partial names will show suggestions`;
  }

  /**
   * Parse a message and prepare card lookup data
   * @param {string} message - The message to parse
   * @returns {Object} Parsed data with cards to look up
   */
  static parseMessage(message) {
    // First, count how many cards were attempted (before limiting)
    const allMatches = [];
    const regex = /\{([^}]+)\}/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      const content = match[1].trim();
      if (content.length > 0) {
        allMatches.push(content);
      }
    }

    // Now get the actual limited cards
    const cardRefs = this.extractCardReferences(message);

    // Check if user tried to add more than 5 cards
    const attemptedCount = allMatches.length;
    const exceedsLimit = attemptedCount > 5;

    return {
      hasCards: cardRefs.length > 0,
      cardCount: cardRefs.length,
      cards: cardRefs.map((ref) => ({
        ...ref,
        cleanName: this.cleanCardName(ref.name),
        display: this.formatCardReference(ref),
      })),
      isWithinLimit: !exceedsLimit,
      exceedsLimit: exceedsLimit,
    };
  }
}

module.exports = InlineCardDetector;
