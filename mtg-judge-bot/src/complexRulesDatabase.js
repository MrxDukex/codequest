/**
 * Complex Rules Database
 * Handles complex MTG rules topics with accurate, curated responses
 */

const complexRulesTopics = {
  // Damage Assignment with Multiple Blockers
  damage_assignment_blockers: {
    patterns: [
      /damage assignment.*multiple block/i,
      /how does damage.*work.*multiple block/i,
      /assign.*damage.*block/i,
      /combat damage.*multiple creature/i,
      /blocked by multiple/i,
      /multiple blockers/i,
    ],
    title: "Damage Assignment with Multiple Blockers",
    answer: `**Damage Assignment Order (Rule 509.2)**

When a creature is blocked by multiple creatures, the attacking player must order the blockers during the declare blockers step. This is called the "damage assignment order."

**How It Works:**
1. **Declare Blockers Step**: After blockers are declared, the attacking player immediately orders them (e.g., "First this 2/2, then this 3/3")
2. **Combat Damage Step**: The attacker must assign lethal damage to each blocker in order before moving to the next
3. **Lethal Damage**: This is damage equal to the blocker's toughness, minus any damage already marked on it

**Example:** A 5/5 attacker blocked by a 2/2 and a 3/3:
- Attacker orders them: 2/2 first, then 3/3
- Must assign at least 2 damage to the 2/2 (lethal)
- Can then assign remaining 3 damage to the 3/3

**Important:** You cannot "skip" blockers or split damage freely. You must assign lethal damage in order.`,
    rules: ["509.2", "509.3", "510.1c", "510.1d"],
    relatedTopics: ["combat", "blocking", "damage"],
  },

  // APNAP Order
  apnap_order: {
    patterns: [
      /what is apnap/i,
      /apnap order/i,
      /active player.*non.*active/i,
      /simultaneous triggers/i,
      /triggers at the same time/i,
    ],
    title: "APNAP Order (Active Player, Non-Active Player)",
    answer: `**APNAP Order (Rule 101.4)**

APNAP determines the order when multiple players need to make choices or put triggers on the stack simultaneously.

**The Rule:**
- **Active Player** (whose turn it is) makes all choices first
- **Non-Active Players** make choices in turn order
- Triggers go on the stack in APNAP order (active player's first, then others in turn order)

**Key Point:** Since the stack resolves top-to-bottom, non-active player triggers resolve FIRST.

**Example:** Both players control a creature that triggers "at the beginning of upkeep":
1. Active player puts their trigger on the stack
2. Non-active player puts their trigger on top
3. Non-active player's trigger resolves first

**Multiplayer:** In games with 3+ players, non-active players act in turn order starting from the active player.`,
    rules: ["101.4", "405.3", "405.4", "405.5"],
    relatedTopics: ["stack", "triggers", "priority"],
  },

  // Layers System
  layers: {
    patterns: [
      /how do layers work/i,
      /layers? in magic/i,
      /layer system/i,
      /continuous effects.*layer/i,
      /what are layers/i,
      /layer \d/i,
      /timestamp order/i,
    ],
    title: "The Layer System",
    answer: `**The Layer System (Rule 613)**

Layers determine how continuous effects are applied to permanents. There are 7 layers (plus sublayers):

**The 7 Layers:**
1. **Copy effects** (Clone copying something)
2. **Control-changing effects** (Mind Control)
3. **Text-changing effects** (changing "Mountain" to "Island")
4. **Type-changing effects** (becomes an artifact)
5. **Color-changing effects** (becomes blue)
6. **Ability effects** (gains flying, loses all abilities)
   - 6a: Ability-removing effects
   - 6b: Ability-adding effects
7. **Power/Toughness effects**
   - 7a: Characteristic-defining abilities (*/*)
   - 7b: Set P/T to specific values
   - 7c: Modify P/T (+2/+2, -3/-3)
   - 7d: P/T switching effects

**Key Rules:**
- Effects are always applied in layer order
- Within the same layer, apply in timestamp order (oldest first)
- Dependencies can override timestamp order

**Example:** A 2/2 permanent with "becomes 5/5" and "+2/+2":
- Layer 7b: Becomes 5/5
- Layer 7c: Gets +2/+2
- Result: 7/7`,
    rules: ["613.1", "613.2", "613.3", "613.4", "613.5", "613.6", "613.7"],
    relatedTopics: ["continuous effects", "timestamps", "dependencies"],
  },

  // Priority System
  priority: {
    patterns: [
      /how does priority work/i,
      /what is priority/i,
      /when do.*get priority/i,
      /priority pass/i,
      /holding priority/i,
      /priority in magic/i,
    ],
    title: "Priority System",
    answer: `**Priority (Rule 117)**

Priority determines who can cast spells or activate abilities at any given time.

**Basic Rules:**
1. Only the player with priority can cast spells/activate abilities
2. The active player gets priority first at the beginning of most steps/phases
3. After casting a spell/ability, that player keeps priority
4. Priority passes clockwise when a player passes

**When Players Get Priority:**
- Beginning of most phases/steps (after turn-based actions)
- After a spell/ability resolves
- After declaring attackers
- After declaring blockers

**Important Points:**
- You can "hold priority" to cast multiple spells before opponents can respond
- Both players must pass priority in succession for the top item to resolve
- Priority does NOT pass during combat damage (it just happens)

**Example:** You cast Lightning Bolt:
1. You keep priority (can cast another instant)
2. You pass priority
3. Opponent gets priority (can respond)
4. If they pass, Lightning Bolt resolves`,
    rules: ["117.1", "117.3", "117.4", "117.5", "405.1"],
    relatedTopics: ["stack", "timing", "instant speed"],
  },

  // The Stack
  stack: {
    patterns: [
      /how does the stack work/i,
      /what is the stack/i,
      /stack in magic/i,
      /stack resolv/i,
      /stack resolution/i,
      /last in first out/i,
      /lifo/i,
    ],
    title: "The Stack",
    answer: `**The Stack (Rule 405)**

The stack is a zone where spells and abilities wait to resolve. It follows "Last In, First Out" (LIFO).

**How It Works:**
1. Spells/abilities go on the stack when cast/activated
2. Players can respond by adding more to the stack
3. When both players pass priority, the TOP item resolves
4. After each resolution, players get priority again

**Key Rules:**
- The stack resolves one item at a time, from top to bottom
- Players can respond between each resolution, one at a time
- Once something starts resolving, it can't be responded to
- Mana abilities and special actions don't use the stack

**What DOESN'T Use the Stack:**
- Land plays
- Mana abilities
- Turning face-up (morph)
- Phasing
- Combat damage (in current rules)

**Example:** 
- You cast Giant Growth (goes on stack)
- Opponent casts Lightning Bolt in response (goes on top)
- Lightning Bolt resolves first
- Then Giant Growth resolves (if creature survived)`,
    rules: ["405.1", "405.2", "405.3", "405.5", "405.6"],
    relatedTopics: ["priority", "timing", "responses"],
  },

  // State-Based Actions
  state_based_actions: {
    patterns: [
      /state.?based action/i,
      /sba/i,
      /when.*creature.*die.*0 toughness/i,
      /legend rule/i,
      /dies to state.?based/i,
    ],
    title: "State-Based Actions (SBAs)",
    answer: `**State-Based Actions (Rule 704)**

State-based actions are game rules that are automatically checked and performed whenever a player would get priority.

**Common SBAs:**
- Creature with 0 or less toughness dies
- Creature with lethal damage dies
- Player with 0 or less life loses
- Player with 10+ poison counters loses
- Legendary rule (if you control two or more legendary permanents with the same name, choose one and put the rest into their owner's graveyard)
- Planeswalker with 0 loyalty goes to graveyard
- +1/+1 and -1/-1 counters cancel each other
- Aura with nothing to enchant goes to graveyard

**Key Points:**
- SBAs don't use the stack and can't be responded to
- They're checked right before any player gets priority
- Multiple SBAs happen simultaneously
- They're checked repeatedly until none apply

**Example:** A 5/5 indestructible creature with -5/-5:
- Has 0 toughness
- Dies to state-based actions (not destruction)
- Indestructible doesn't prevent this`,
    rules: ["704.1", "704.3", "704.5", "704.6", "704.7"],
    relatedTopics: ["death", "legendary rule", "toughness"],
  },

  // Combat Phases
  combat_phases: {
    patterns: [
      /combat phase/i,
      /combat step/i,
      /declare attacker/i,
      /declare blocker/i,
      /combat damage/i,
      /first strike/i,
      /combat in magic/i,
    ],
    title: "Combat Phases and Steps",
    answer: `**Combat Phase Structure (Rule 506-511)**

The combat phase has five steps:

**1. Beginning of Combat (506)**
- Triggers happen ("at beginning of combat")
- Last chance to tap potential attackers

**2. Declare Attackers (508)**
- Active player declares all attackers simultaneously
- Attackers tap (unless vigilance)
- "When attacks" triggers go on stack

**3. Declare Blockers (509)**
- Defending player declares all blocks simultaneously
- Attacker must order blockers if multiple blockers are assigned to one attacker
- "When blocks/becomes blocked" triggers

**4. Combat Damage Step (510)**
- All creatures assign damage simultaneously
- Damage is dealt all at once (no stack)
- First Strike creates an additional damage step (510.4)

**5. End of Combat (511)**
- "At end of combat" triggers
- Last moment creatures are still attacking/blocking

**Important:**
- Players get priority in each step (except damage)
- Skipping steps requires specific effects
- Once you move to the next step, you can't go back`,
    rules: ["506.1", "508.1", "509.1", "510.1", "511.1"],
    relatedTopics: ["attacking", "blocking", "damage", "first strike"],
  },

  // Replacement Effects
  replacement_effects: {
    patterns: [
      /replacement effect/i,
      /instead/i,
      /if.*would.*instead/i,
      /prevent.*damage/i,
      /enters the battlefield with/i,
      /as.*enters/i,
    ],
    title: "Replacement Effects",
    answer: `**Replacement Effects (Rule 614)**

Replacement effects modify or replace events as they happen. They use "instead," "as," "with," or "prevent."

**How They Work:**
- They modify an event before it happens
- They don't use the stack
- Each replacement effect can only apply once to each event
- The affected player (or controller) chooses the order

**Common Examples:**
- "If you would gain life, gain twice that much instead"
- "Enters the battlefield with X counters"
- "As ~ enters the battlefield, choose a color"
- "Prevent the next 3 damage"

**Key Differences from Triggered Abilities:**
- Replacement: "If...would...instead" (modifies the event)
- Triggered: "When/Whenever/At" (happens after the event)

**Multiple Replacement Effects:**
1. Self-replacement effects first
2. Effects that modify under whose control something enters
3. Other effects in order chosen by affected player

**Example:** Doubling Season + Planeswalker:
- Planeswalker would enter with 3 loyalty
- Replacement effect doubles it to 6
- Enters with 6 (never had 3)`,
    rules: ["614.1", "614.2", "614.5", "614.9", "614.12"],
    relatedTopics: ["prevention", "doubling", "enters the battlefield"],
  },
};

/**
 * Detect which complex rule topic is being asked about
 * @param {string} question - The user's question
 * @returns {Object|null} - The matching topic data or null
 */
function detectComplexTopic(question) {
  const lowerQuestion = question.toLowerCase();

  // Check each topic's patterns
  for (const [key, topic] of Object.entries(complexRulesTopics)) {
    for (const pattern of topic.patterns) {
      if (pattern.test(question)) {
        console.log(`[COMPLEX RULES] Detected topic: ${key}`);
        return {
          key,
          ...topic,
        };
      }
    }
  }

  // Fallback: check for keyword matches
  if (lowerQuestion.includes("layer") && !lowerQuestion.includes("player")) {
    return { key: "layers", ...complexRulesTopics.layers };
  }

  if (
    lowerQuestion.includes("apnap") ||
    (lowerQuestion.includes("active") &&
      lowerQuestion.includes("player") &&
      lowerQuestion.includes("order"))
  ) {
    return { key: "apnap_order", ...complexRulesTopics.apnap_order };
  }

  if (
    (lowerQuestion.includes("damage") &&
      lowerQuestion.includes("assign") &&
      lowerQuestion.includes("block")) ||
    (lowerQuestion.includes("multiple") && lowerQuestion.includes("block"))
  ) {
    return {
      key: "damage_assignment_blockers",
      ...complexRulesTopics.damage_assignment_blockers,
    };
  }

  return null;
}

/**
 * Format a complex rules answer for Discord
 * @param {Object} topicData - The topic data
 * @returns {string} - Formatted answer
 */
function formatComplexAnswer(topicData) {
  let answer = topicData.answer;

  // Add rule citations at the end if not already included
  if (
    topicData.rules &&
    topicData.rules.length > 0 &&
    !answer.includes("Relevant Rules:")
  ) {
    answer += `\n\n**Relevant Rules:** ${topicData.rules.join(", ")}`;
  }

  return answer;
}

/**
 * Check if a question is about complex rules
 * @param {string} question - The user's question
 * @returns {boolean} - True if it's a complex rules question
 */
function isComplexRulesQuestion(question) {
  return detectComplexTopic(question) !== null;
}

/**
 * Get all complex topics (for testing)
 * @returns {Object} - All complex topics
 */
function getAllTopics() {
  return complexRulesTopics;
}

module.exports = {
  detectComplexTopic,
  formatComplexAnswer,
  isComplexRulesQuestion,
  getAllTopics,
};
