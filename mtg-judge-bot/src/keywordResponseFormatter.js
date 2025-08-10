/**
 * Keyword Response Formatter
 * Handles formatting keyword responses to fit within Discord's embed limits
 * Ensures no content is truncated
 */

const MAX_EMBED_DESCRIPTION = 4096;
const MAX_FIELD_VALUE = 1024;
const MAX_FIELD_NAME = 256;
const SAFE_DESCRIPTION_LIMIT = 3500; // Leave buffer for formatting

/**
 * Format a keyword response for Discord
 * @param {Object} keywordData - The keyword data from the database
 * @param {Array} comprehensiveRules - Additional rules if any
 * @returns {Object} Formatted response that fits Discord limits
 */
function formatKeywordResponse(keywordData, comprehensiveRules = []) {
  // Start with the core information
  let mainContent = `**${keywordData.name}**\n\n`;
  mainContent += `${keywordData.description}\n\n`;

  // Add example if it exists and fits
  if (keywordData.example) {
    const exampleText = `**Example:** ${keywordData.example}\n\n`;
    if (mainContent.length + exampleText.length < SAFE_DESCRIPTION_LIMIT) {
      mainContent += exampleText;
    }
  }

  // Add the primary comprehensive rule reference if it exists
  if (keywordData.rule) {
    const ruleText = `**Comprehensive Rule:** ${keywordData.rule}\n`;
    if (mainContent.length + ruleText.length < SAFE_DESCRIPTION_LIMIT) {
      mainContent += ruleText;
    }
  }

  // Only add DIRECTLY RELEVANT comprehensive rules
  if (comprehensiveRules && comprehensiveRules.length > 0 && keywordData.rule) {
    const remainingSpace = SAFE_DESCRIPTION_LIMIT - mainContent.length;

    // Only proceed if we have substantial space left
    if (remainingSpace > 300) {
      // Filter rules to only include those that are DIRECTLY relevant
      const relevantRules = comprehensiveRules.filter((rule) => {
        if (!rule || !rule.text || !rule.number) return false;

        // Priority 1: Is this the exact rule for the keyword?
        if (rule.number === keywordData.rule) return true;

        // Priority 2: Does this rule specifically mention the keyword?
        const keywordName = keywordData.name.toLowerCase();
        const ruleTextLower = rule.text.toLowerCase();

        // Check if the rule text contains the keyword
        // But avoid generic rules that just happen to mention it in passing
        if (ruleTextLower.includes(keywordName)) {
          // Check if it's actually ABOUT the keyword, not just mentioning it
          // Rules about the keyword typically start with the keyword or have it in the first sentence
          const firstSentence = rule.text.split(".")[0].toLowerCase();
          return firstSentence.includes(keywordName);
        }

        return false;
      });

      // Only add the most relevant rule (usually just one)
      if (relevantRules.length > 0) {
        const mostRelevantRule = relevantRules[0];

        // Only add if it's not redundant with what we already have
        if (mostRelevantRule.number !== keywordData.rule) {
          const fullRuleText = `\n**Rule ${mostRelevantRule.number}:** ${mostRelevantRule.text}\n`;

          // Check if this rule fits
          if (
            mainContent.length + fullRuleText.length <
            SAFE_DESCRIPTION_LIMIT
          ) {
            mainContent += fullRuleText;
          } else {
            // If it doesn't fit in full, try just the first sentence
            const firstSentence = mostRelevantRule.text.split(".")[0] + ".";
            if (firstSentence.length < remainingSpace - 100) {
              const partialRuleText = `\n**Rule ${mostRelevantRule.number}:** ${firstSentence}\n`;
              if (
                mainContent.length + partialRuleText.length <
                SAFE_DESCRIPTION_LIMIT
              ) {
                mainContent += partialRuleText;
              }
            }
          }
        }
      }
    }
  }

  // No additional fields - everything goes in the main description
  const additionalFields = [];

  // Ensure the main content doesn't exceed Discord's limit
  if (mainContent.length > MAX_EMBED_DESCRIPTION) {
    // Truncate safely at a word boundary
    mainContent = truncateAtWordBoundary(
      mainContent,
      MAX_EMBED_DESCRIPTION - 10
    );
  }

  return {
    description: mainContent.trim(),
    fields: additionalFields,
  };
}

/**
 * Truncate text at a word boundary
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateAtWordBoundary(text, maxLength) {
  if (text.length <= maxLength) return text;

  // Find the last space before the limit
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace).trim();
  }

  return truncated.trim();
}

/**
 * Split long content into multiple embeds if needed
 * @param {string} content - Content to split
 * @param {string} title - Title for the embeds
 * @returns {Array} Array of embed descriptions
 */
function splitIntoEmbeds(content, title) {
  const embeds = [];
  const lines = content.split("\n");
  let currentEmbed = `**${title}**\n\n`;

  for (const line of lines) {
    // Check if adding this line would exceed the limit
    if (currentEmbed.length + line.length + 1 > SAFE_DESCRIPTION_LIMIT) {
      // Save current embed and start a new one
      embeds.push(currentEmbed.trim());
      currentEmbed = `**${title} (continued)**\n\n${line}\n`;
    } else {
      currentEmbed += line + "\n";
    }
  }

  // Add the last embed if it has content
  if (currentEmbed.trim().length > title.length + 10) {
    embeds.push(currentEmbed.trim());
  }

  return embeds;
}

/**
 * Validate that content fits within Discord limits
 * @param {string} description - Embed description
 * @param {Array} fields - Embed fields
 * @returns {boolean} True if content fits
 */
function validateEmbedSize(description, fields = []) {
  // Check description length
  if (description.length > MAX_EMBED_DESCRIPTION) {
    console.warn(
      `[FORMATTER] Description exceeds limit: ${description.length} > ${MAX_EMBED_DESCRIPTION}`
    );
    return false;
  }

  // Check each field
  for (const field of fields) {
    if (field.name && field.name.length > MAX_FIELD_NAME) {
      console.warn(
        `[FORMATTER] Field name exceeds limit: ${field.name.length} > ${MAX_FIELD_NAME}`
      );
      return false;
    }
    if (field.value && field.value.length > MAX_FIELD_VALUE) {
      console.warn(
        `[FORMATTER] Field value exceeds limit: ${field.value.length} > ${MAX_FIELD_VALUE}`
      );
      return false;
    }
  }

  return true;
}

module.exports = {
  formatKeywordResponse,
  splitIntoEmbeds,
  validateEmbedSize,
  MAX_EMBED_DESCRIPTION,
  MAX_FIELD_VALUE,
  MAX_FIELD_NAME,
  SAFE_DESCRIPTION_LIMIT,
};
