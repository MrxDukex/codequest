/**
 * MTG Interaction Database
 * Handles common card/mechanic interactions and complex rules questions
 */

const commonInteractions = {
  // Doubling Season interactions
  "doubling season + planeswalker": {
    keywords: ["doubling season", "planeswalker"],
    patterns: [
      /doubling season.*planeswalker/i,
      /planeswalker.*doubling season/i,
      /how does doubling season work with planeswalker/i,
      /doubling season.*loyalty/i,
    ],
    answer: {
      title: "Doubling Season and Planeswalkers",
      description:
        "Doubling Season doubles the loyalty counters a planeswalker enters the battlefield with. If a planeswalker would normally enter with 3 loyalty counters, it enters with 6 instead.",
      important:
        "**Important:** Doubling Season does NOT double loyalty gained from activating loyalty abilities, because adding or removing loyalty counters is a cost, not an effect.",
      example:
        "If you control Doubling Season and cast a Jace that normally enters with 3 loyalty, it enters with 6 loyalty instead. However, using its +1 ability still only adds 1 loyalty counter.",
      rules: ["614.16", "306.5b", "122.6"],
    },
  },

  // Deathtouch + Trample
  "deathtouch + trample": {
    keywords: ["deathtouch", "trample"],
    patterns: [
      /deathtouch.*trample/i,
      /trample.*deathtouch/i,
      /creature with deathtouch and trample/i,
    ],
    answer: {
      title: "Deathtouch and Trample",
      description:
        "A creature with both deathtouch and trample only needs to assign 1 damage to each blocking creature (since 1 damage is lethal with deathtouch), then assigns the rest to the defending player/planeswalker.",
      example:
        "A 5/5 with deathtouch and trample blocked by a 4/4 assigns 1 damage to the blocker (killing it) and 4 damage tramples over.",
      rules: ["702.2b", "702.19b"],
    },
  },

  // Lifelink + Double Strike
  "lifelink + double strike": {
    keywords: ["lifelink", "double strike"],
    patterns: [
      /lifelink.*double strike/i,
      /double strike.*lifelink/i,
      /creature with lifelink and double strike/i,
    ],
    answer: {
      title: "Lifelink and Double Strike",
      description:
        "A creature with both lifelink and double strike causes you to gain life twice - once during first strike damage and once during regular damage.",
      example:
        "A 3/3 with lifelink and double strike deals 6 total damage (3 in each damage step) and causes you to gain 6 total life.",
      rules: ["702.15b", "702.4"],
    },
  },

  // Protection vs Board Wipes
  "protection + board wipe": {
    keywords: ["protection", "destroy all", "wrath", "board wipe"],
    patterns: [
      /protection.*destroy all/i,
      /protection.*wrath/i,
      /protection.*board wipe/i,
      /does protection.*from.*save.*wrath/i,
    ],
    answer: {
      title: "Protection and Board Wipes",
      description:
        "Protection does NOT save a creature from 'destroy all' effects like Wrath of God. Protection only prevents Damage, Enchanting/Equipping, Blocking, and Targeting (DEBT).",
      important: "Board wipes don't target, so protection doesn't stop them.",
      example:
        "A creature with protection from white is still destroyed by Wrath of God (which is white) because Wrath doesn't target.",
      rules: ["702.16", "701.7"],
    },
  },

  // Hexproof vs Board Wipes
  "hexproof + board wipe": {
    keywords: ["hexproof", "destroy all", "wrath", "board wipe"],
    patterns: [
      /hexproof.*destroy all/i,
      /hexproof.*wrath/i,
      /hexproof.*board wipe/i,
      /does hexproof.*save.*wrath/i,
      /destroy all.*kill.*hexproof/i,
      /can.*destroy all.*hexproof/i,
    ],
    answer: {
      title: "Hexproof and Board Wipes",
      description:
        "Hexproof does NOT protect from 'destroy all' effects. Hexproof only prevents targeting by opponents' spells and abilities.",
      important: "Board wipes don't target, so hexproof doesn't stop them.",
      example:
        "A hexproof creature is still destroyed by Day of Judgment because it doesn't target.",
      rules: ["702.11", "701.7"],
    },
  },

  // Indestructible vs -X/-X
  "indestructible + minus": {
    keywords: ["indestructible", "minus", "-x/-x", "toughness"],
    patterns: [
      /indestructible.*minus/i,
      /indestructible.*-\d+\/-\d+/i,
      /does.*minus.*kill.*indestructible/i,
      /indestructible.*toughness.*zero/i,
      /-\d+\/-\d+.*kill.*indestructible/i,
      /does.*-\d+\/-\d+.*kill.*indestructible/i,
      /indestructible.*zero toughness/i,
      /can.*minus.*kill.*indestructible/i,
    ],
    answer: {
      title: "Indestructible and Toughness Reduction",
      description:
        "Indestructible creatures CAN die from having 0 or less toughness. Indestructible only prevents destruction from damage and 'destroy' effects.",
      important:
        "Having 0 or less toughness is a state-based action, not destruction.",
      example:
        "A 5/5 indestructible creature with -5/-5 from Tragic Slip dies because it has 0 toughness.",
      rules: ["702.12b", "704.5f"],
    },
  },

  // First Strike + Deathtouch
  "first strike + deathtouch": {
    keywords: ["first strike", "deathtouch"],
    patterns: [/first strike.*deathtouch/i, /deathtouch.*first strike/i],
    answer: {
      title: "First Strike and Deathtouch",
      description:
        "A creature with both first strike and deathtouch deals its damage first and any amount of that damage is lethal. The opposing creature dies before it can deal damage back (unless it also has first strike).",
      example:
        "A 1/1 with first strike and deathtouch kills a 5/5 without first strike before taking any damage.",
      rules: ["702.7", "702.2"],
    },
  },

  // Multiple Combat Phases
  "multiple combat": {
    keywords: ["additional combat", "extra combat", "multiple combat"],
    patterns: [
      /additional combat/i,
      /extra combat/i,
      /multiple combat phase/i,
      /two combat phases/i,
    ],
    answer: {
      title: "Additional Combat Phases",
      description:
        "When you get an additional combat phase, you get a new untap step for your creatures (unless the effect says otherwise). Creatures can attack again in each additional combat phase.",
      important:
        "Vigilance creatures don't need to untap. 'Attacks each combat if able' creatures must attack in every combat phase.",
      example:
        "With Aurelia, the Warleader, your creatures untap and can attack again in the second combat phase.",
      rules: ["506.1", "508.1"],
    },
  },

  // Legendary Rule interactions
  "legendary + copy": {
    keywords: ["legendary", "copy", "clone"],
    patterns: [
      /legendary.*copy/i,
      /copy.*legendary/i,
      /clone.*legendary/i,
      /two.*same legendary/i,
    ],
    answer: {
      title: "Legendary Rule and Copies",
      description:
        "If you control two or more legendary permanents with the same name, you choose one to keep and put the rest into your graveyard. This happens immediately as a state-based action.",
      important:
        "This is NOT sacrificing - it's putting into graveyard. Effects that trigger on sacrifice don't trigger.",
      example:
        "If you Clone your own legendary creature, you must immediately choose one to keep.",
      rules: ["704.5j", "306.4"],
    },
  },

  // Token doubling
  "token doubling": {
    keywords: [
      "double tokens",
      "doubling season",
      "parallel lives",
      "anointed procession",
    ],
    patterns: [
      /double.*tokens/i,
      /twice.*many tokens/i,
      /token.*doubl/i,
      /multiple.*parallel lives/i,
      /parallel lives.*work/i,
      /doubling season.*tokens/i,
      /anointed procession.*stack/i,
    ],
    answer: {
      title: "Token Doubling Effects",
      description:
        "Effects like Doubling Season, Parallel Lives, and Anointed Procession are replacement effects that double token creation. Multiple doublers multiply exponentially.",
      example:
        "With two Parallel Lives, creating 1 token creates 4 instead (1 → 2 → 4). With three, you get 8 tokens.",
      rules: ["614.1", "616.1"],
    },
  },
};

/**
 * Detect if a question is about an interaction between mechanics/cards
 * @param {string} question - The user's question
 * @returns {Object|null} - Interaction data if found, null otherwise
 */
function detectInteraction(question) {
  const lowerQuestion = question.toLowerCase();

  // Check each interaction pattern
  for (const [key, interaction] of Object.entries(commonInteractions)) {
    // Check if any pattern matches
    for (const pattern of interaction.patterns) {
      if (pattern.test(question)) {
        console.log(`[INTERACTION] Detected interaction: ${key}`);
        return {
          type: key,
          ...interaction.answer,
        };
      }
    }

    // Also check if all keywords are present (fallback)
    const hasAllKeywords = interaction.keywords.every((keyword) =>
      lowerQuestion.includes(keyword.toLowerCase())
    );

    if (hasAllKeywords) {
      // Additional check for "work with" or "interact" patterns
      if (/work|interact|together|combo|synerg|with/i.test(lowerQuestion)) {
        console.log(`[INTERACTION] Detected interaction by keywords: ${key}`);
        return {
          type: key,
          ...interaction.answer,
        };
      }
    }
  }

  return null;
}

/**
 * Check if a question is asking about an interaction
 * @param {string} question - The user's question
 * @returns {boolean} - True if it's an interaction question
 */
function isInteractionQuestion(question) {
  const interactionPatterns = [
    /how does .+ work with .+/i,
    /how do .+ and .+ interact/i,
    /what happens when .+ and .+/i,
    /can .+ and .+ work together/i,
    /does .+ affect .+/i,
    /interaction between .+ and .+/i,
    /.+ \+ .+/i, // "X + Y" pattern
    /combo|synerg|together/i,
  ];

  return interactionPatterns.some((pattern) => pattern.test(question));
}

/**
 * Format an interaction answer for Discord
 * @param {Object} interactionData - The interaction data
 * @returns {string} - Formatted answer
 */
function formatInteractionAnswer(interactionData) {
  let answer = `**${interactionData.title}**\n\n`;
  answer += `${interactionData.description}\n\n`;

  if (interactionData.important) {
    answer += `${interactionData.important}\n\n`;
  }

  if (interactionData.example) {
    answer += `**Example:** ${interactionData.example}\n\n`;
  }

  if (interactionData.rules && interactionData.rules.length > 0) {
    answer += `**Relevant Rules:** ${interactionData.rules.join(", ")}`;
  }

  return answer;
}

module.exports = {
  detectInteraction,
  isInteractionQuestion,
  formatInteractionAnswer,
  commonInteractions,
};
