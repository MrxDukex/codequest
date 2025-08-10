/**
 * Oracle Text Parser for Magic: The Gathering cards
 * Ensures accurate interpretation of card abilities
 */

class OracleTextParser {
  /**
   * Parse a card's oracle text and extract structured information
   */
  static parseCard(cardData) {
    if (!cardData || !cardData.oracle_text) {
      return {
        abilities: [],
        warnings: [],
        keywords: [],
        patterns: {},
      };
    }

    const oracleText = cardData.oracle_text;

    return {
      abilities: this.extractAbilities(oracleText),
      warnings: this.generateWarnings(oracleText),
      keywords: this.extractKeywords(oracleText),
      patterns: this.detectPatterns(oracleText),
    };
  }

  /**
   * Extract individual abilities from oracle text
   */
  static extractAbilities(oracleText) {
    const abilities = [];

    // Split by line breaks for separate abilities
    const lines = oracleText.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      const ability = {
        text: line,
        type: this.classifyAbility(line),
      };
      abilities.push(ability);
    }

    return abilities;
  }

  /**
   * Classify the type of ability
   */
  static classifyAbility(abilityText) {
    // Triggered abilities
    if (/^(when|whenever|at the beginning|at the end)/i.test(abilityText)) {
      return "triggered";
    }

    // Activated abilities (cost: effect)
    if (/{[^}]+}.*:/.test(abilityText)) {
      return "activated";
    }

    // Keyword abilities
    if (
      /^(flying|vigilance|trample|haste|first strike|double strike|lifelink|deathtouch|hexproof|indestructible|menace|ward|flash|defender|reach|prowess|protection|shroud|intimidate|fear|shadow|eminence|partner|companion)/i.test(
        abilityText
      )
    ) {
      return "keyword";
    }

    // Static abilities
    if (
      /(all|other|each|your|opponents?'?)\s+\w+\s+(get|have|are|cost)/i.test(
        abilityText
      )
    ) {
      return "static";
    }

    // Replacement effects
    if (/if .* would .*, instead/i.test(abilityText)) {
      return "replacement";
    }

    return "other";
  }

  /**
   * Generate warnings for commonly misinterpreted patterns
   */
  static generateWarnings(oracleText) {
    const warnings = [];

    // Cost reduction without "for each"
    const costReductionMatch = oracleText.match(/costs?\s+{(\d+)}\s+less/gi);
    if (costReductionMatch && !oracleText.includes("for each")) {
      const amount = oracleText.match(/costs?\s+{(\d+)}\s+less/i)[1];
      warnings.push(
        `IMPORTANT: Cost reduction is EXACTLY {${amount}} generic mana less total, NOT per creature or per permanent`
      );
    }

    // Cost reduction WITH "for each"
    if (costReductionMatch && oracleText.includes("for each")) {
      warnings.push(
        "This cost reduction scales based on the number of qualifying permanents/cards"
      );
    }

    // Life gain patterns
    if (
      oracleText.match(/gain.*life.*plus/i) ||
      oracleText.match(/gain twice/i)
    ) {
      warnings.push(
        "Life gain amounts should be calculated exactly as written"
      );
    }

    // X in costs or effects
    if (oracleText.includes("{X}") || oracleText.match(/\bX\b/)) {
      warnings.push(
        "X is a variable that must be chosen or calculated as specified"
      );
    }

    // "Other" creatures/permanents
    if (oracleText.includes("other")) {
      warnings.push("'Other' excludes this card itself from the effect");
    }

    // "Up to" effects
    if (oracleText.includes("up to")) {
      warnings.push(
        "'Up to' means you can choose any number from 0 to the specified maximum"
      );
    }

    // Draw effects
    if (oracleText.match(/draw.*cards?\s+for each/i)) {
      warnings.push("Card draw scales with the specified condition");
    }

    // Damage effects
    if (oracleText.match(/deals?\s+\d+\s+damage\s+for each/i)) {
      warnings.push("Damage scales with the specified condition");
    }

    return warnings;
  }

  /**
   * Extract keyword abilities
   */
  static extractKeywords(oracleText) {
    const keywords = [];
    const keywordPatterns = [
      "flying",
      "vigilance",
      "trample",
      "haste",
      "first strike",
      "double strike",
      "lifelink",
      "deathtouch",
      "hexproof",
      "indestructible",
      "menace",
      "ward",
      "flash",
      "defender",
      "reach",
      "prowess",
      "protection",
      "shroud",
      "intimidate",
      "fear",
      "shadow",
      "plainswalk",
      "islandwalk",
      "swampwalk",
      "mountainwalk",
      "forestwalk",
      "eminence",
      "partner",
      "companion",
      "mutate",
      "cascade",
      "storm",
      "madness",
      "flashback",
      "kicker",
      "multikicker",
      "overload",
      "miracle",
      "rebound",
      "undying",
      "persist",
      "wither",
      "infect",
      "annihilator",
      "devoid",
      "ingest",
      "myriad",
      "melee",
      "afflict",
      "ascend",
      "afterlife",
      "riot",
      "spectacle",
      "escape",
      "foretell",
      "boast",
      "disturb",
      "daybound",
      "nightbound",
      "decayed",
      "training",
      "cleave",
      "casualty",
      "blitz",
      "enlist",
      "read ahead",
      "ravenous",
      "squad",
      "backup",
      "bargain",
      "craft",
      "discover",
      "disguise",
      "cloak",
      "suspect",
      "collect evidence",
      "plot",
      "saddle",
      "offspring",
    ];

    const lowerText = oracleText.toLowerCase();
    for (const keyword of keywordPatterns) {
      if (lowerText.includes(keyword)) {
        keywords.push(keyword);
      }
    }

    return keywords;
  }

  /**
   * Detect specific patterns in oracle text
   */
  static detectPatterns(oracleText) {
    return {
      hasCostReduction: /costs?\s+{?\d+}?\s+less/i.test(oracleText),
      hasCostIncrease: /costs?\s+{?\d+}?\s+more/i.test(oracleText),
      hasForEach: /for each/i.test(oracleText),
      hasTriggered: /(when|whenever|at the beginning)/i.test(oracleText),
      hasActivated: /{[^}]+}.*:/.test(oracleText),
      hasStatic: /(all|other|each)\s+\w+\s+(get|have|are)/i.test(oracleText),
      hasReplacement: /if .* would .*, instead/i.test(oracleText),
      hasETB: /when .* enters/i.test(oracleText),
      hasDies: /when .* dies/i.test(oracleText),
      hasDrawEffect: /draw (a card|X cards|\d+ cards)/i.test(oracleText),
      hasLifeGain: /gain (\d+|X) life/i.test(oracleText),
      hasDamage: /deals? (\d+|X) damage/i.test(oracleText),
      hasCounters: /counter(s)? on/i.test(oracleText),
      hasTokens: /create(s)? .* token/i.test(oracleText),
      hasSacrifice: /sacrifice/i.test(oracleText),
      hasDestroy: /destroy/i.test(oracleText),
      hasExile: /exile/i.test(oracleText),
      hasMill: /mill|put .* cards? .* graveyard/i.test(oracleText),
      hasScry: /scry/i.test(oracleText),
      hasSurveil: /surveil/i.test(oracleText),
    };
  }

  /**
   * Generate a strict prompt for GPT based on parsed data
   */
  static generateStrictPrompt(cardData, parsedData, userQuestion) {
    const warnings =
      parsedData.warnings.length > 0
        ? `\nCRITICAL WARNINGS FOR ACCURACY:\n${parsedData.warnings
            .map((w) => `- ${w}`)
            .join("\n")}\n`
        : "";

    return `You are a Magic: The Gathering rules judge providing an accurate explanation.

STRICT INTERPRETATION RULES:
1. Read the oracle text EXACTLY as written - do not add interpretations
2. Numbers are LITERAL - "{1}" means exactly one, not "one per creature"
3. "Other" means excluding this card itself
4. List each ability separately and in order
5. Do not add rules or interactions not explicitly stated in the oracle text
6. Be extremely precise with cost reductions, life gain, damage, and draw effects

CARD INFORMATION:
Name: ${cardData.name}
Type: ${cardData.type_line}
Mana Cost: ${cardData.mana_cost || "No mana cost"}
Power/Toughness: ${
      cardData.power && cardData.toughness
        ? `${cardData.power}/${cardData.toughness}`
        : "N/A"
    }

ORACLE TEXT (Read this EXACTLY):
"${cardData.oracle_text}"
${warnings}
PARSED ABILITIES:
${parsedData.abilities
  .map((a, i) => `${i + 1}. [${a.type.toUpperCase()}] ${a.text}`)
  .join("\n")}

USER QUESTION: "${userQuestion}"

TASK: Explain this card based SOLELY on the oracle text above. Be literal and precise. Do not add any information not present in the oracle text.`;
  }

  /**
   * Validate a generated answer against the oracle text
   */
  static validateAnswer(oracleText, generatedAnswer) {
    const errors = [];

    // Check for "per creature" hallucination when not present
    if (
      !oracleText.includes("for each") &&
      generatedAnswer.match(/for each|per (creature|dragon|permanent|card)/i)
    ) {
      errors.push(
        "Answer incorrectly mentions scaling 'per creature' effect not present in oracle text"
      );
    }

    // Check for cost reduction accuracy
    const costMatch = oracleText.match(/costs?\s+{(\d+)}\s+less/i);
    if (costMatch && !oracleText.includes("for each")) {
      const correctAmount = costMatch[1];
      if (generatedAnswer.match(new RegExp(`${correctAmount}.*per`, "i"))) {
        errors.push(
          `Cost reduction is exactly {${correctAmount}}, not per anything`
        );
      }
    }

    // Check for made-up abilities
    const abilityKeywords = [
      "flying",
      "vigilance",
      "trample",
      "haste",
      "lifelink",
      "deathtouch",
    ];
    for (const keyword of abilityKeywords) {
      if (
        !oracleText.toLowerCase().includes(keyword) &&
        generatedAnswer.toLowerCase().includes(keyword)
      ) {
        errors.push(
          `Answer mentions '${keyword}' which is not in the oracle text`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }
}

module.exports = OracleTextParser;
