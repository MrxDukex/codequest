/**
 * Comprehensive MTG Keyword and Mechanic Database
 * This module contains all MTG keywords, abilities, and game concepts
 * to ensure proper rules explanations instead of card searches
 */

const keywords = {
  // Evergreen Keywords (appear in every set)
  deathtouch: {
    name: "Deathtouch",
    type: "keyword",
    description:
      "Any amount of damage a source with deathtouch deals to a creature is enough to destroy it. When a creature with deathtouch deals damage to a creature, that creature is destroyed regardless of its toughness.",
    rule: "702.2",
    example:
      "A 1/1 creature with deathtouch can destroy a 10/10 creature in combat.",
    related: ["damage", "destroy", "combat"],
  },
  defender: {
    name: "Defender",
    type: "keyword",
    description:
      "A creature with defender can't attack. It can still block attacking creatures normally.",
    rule: "702.3",
    example: "Wall creatures typically have defender.",
    related: ["attack", "block", "combat"],
  },
  "double strike": {
    name: "Double Strike",
    type: "keyword",
    description:
      "A creature with double strike deals both first-strike and regular combat damage. It deals damage twice: once during the first-strike damage step and once during the regular damage step.",
    rule: "702.4",
    example:
      "A 2/2 with double strike deals 4 total damage in combat (2 in first strike, 2 in regular).",
    related: ["first strike", "combat damage", "damage step"],
  },
  enchant: {
    name: "Enchant",
    type: "keyword",
    description:
      "Enchant is a keyword ability that defines what an Aura can be attached to. It's followed by a description of what the Aura can enchant.",
    rule: "702.5",
    example:
      "Enchant creature means the Aura can only be attached to a creature.",
    related: ["aura", "attachment", "permanent"],
  },
  equip: {
    name: "Equip",
    type: "keyword",
    description:
      "Equip is an activated ability of Equipment cards. You can pay the equip cost to attach the Equipment to a creature you control. You can only activate equip as a sorcery.",
    rule: "702.6",
    example:
      "Equip {2} means pay 2 mana to attach this Equipment to a creature you control.",
    related: ["equipment", "artifact", "attach", "sorcery speed"],
  },
  "first strike": {
    name: "First Strike",
    type: "keyword",
    description:
      "A creature with first strike deals combat damage before creatures without first strike. There's a special first-strike damage step where only creatures with first strike or double strike deal damage.",
    rule: "702.7",
    example:
      "A 2/2 with first strike can kill a 2/2 without first strike before taking any damage.",
    related: ["combat damage", "damage step", "double strike"],
  },
  flash: {
    name: "Flash",
    type: "keyword",
    description:
      "You may cast spells with flash any time you could cast an instant. This means you can cast them during your opponent's turn or in response to other spells.",
    rule: "702.8",
    example:
      "A creature with flash can be cast during combat to surprise block.",
    related: ["instant", "timing", "stack"],
  },
  flying: {
    name: "Flying",
    type: "keyword",
    description:
      "A creature with flying can't be blocked except by creatures with flying or reach. Flying creatures can block both flying and non-flying creatures.",
    rule: "702.9",
    example:
      "A flying creature can attack over ground creatures and can only be blocked by other flyers or creatures with reach.",
    related: ["evasion", "block", "reach", "combat"],
  },
  haste: {
    name: "Haste",
    type: "keyword",
    description:
      "A creature with haste can attack and tap to activate abilities the turn it comes under your control. Without haste, creatures have 'summoning sickness' and can't attack or use tap abilities the turn they enter.",
    rule: "702.10",
    example:
      "A creature with haste can attack immediately when it enters the battlefield.",
    related: ["summoning sickness", "attack", "tap", "activated ability"],
  },
  hexproof: {
    name: "Hexproof",
    type: "keyword",
    description:
      "A permanent with hexproof can't be the target of spells or abilities your opponents control. You can still target your own permanents with hexproof.",
    rule: "702.11",
    example:
      "An opponent can't cast Murder targeting your hexproof creature, but board wipes still affect it.",
    related: ["target", "protection", "shroud"],
  },
  indestructible: {
    name: "Indestructible",
    type: "keyword",
    description:
      "A permanent with indestructible can't be destroyed by damage or effects that say 'destroy'. It can still be exiled, returned to hand, sacrificed, or put into the graveyard by having 0 or less toughness.",
    rule: "702.12",
    example:
      "An indestructible creature survives damage and destroy effects but dies to -X/-X effects that reduce toughness to 0.",
    related: ["destroy", "damage", "exile", "sacrifice"],
  },
  intimidate: {
    name: "Intimidate",
    type: "keyword",
    description:
      "A creature with intimidate can't be blocked except by artifact creatures and/or creatures that share a color with it.",
    rule: "702.13",
    example:
      "A red creature with intimidate can only be blocked by red creatures or artifact creatures.",
    related: ["evasion", "block", "fear", "color"],
  },
  lifelink: {
    name: "Lifelink",
    type: "keyword",
    description:
      "Damage dealt by a source with lifelink causes its controller to gain that much life. This happens simultaneously with the damage being dealt, not as a separate event.",
    rule: "702.15",
    example:
      "A 3/3 with lifelink that deals 3 damage causes you to gain 3 life at the same time.",
    related: ["damage", "life gain", "combat"],
  },
  menace: {
    name: "Menace",
    type: "keyword",
    description:
      "A creature with menace can't be blocked except by two or more creatures. If only one creature blocks a creature with menace, the block is illegal.",
    rule: "702.111",
    example:
      "A creature with menace requires at least two blockers to be blocked.",
    related: ["evasion", "block", "combat", "intimidate"],
  },
  protection: {
    name: "Protection",
    type: "keyword",
    description:
      "Protection from [quality] means: can't be damaged by sources with that quality, can't be enchanted/equipped by permanents with that quality, can't be blocked by creatures with that quality, and can't be targeted by spells or abilities with that quality. Remember DEBT: Damage, Enchant/Equip, Block, Target.",
    rule: "702.16",
    example:
      "Protection from red means the permanent can't be damaged by red sources, targeted by red spells, blocked by red creatures, or enchanted by red auras.",
    related: ["damage", "target", "block", "enchant", "DEBT"],
  },
  reach: {
    name: "Reach",
    type: "keyword",
    description:
      "A creature with reach can block creatures with flying. Reach doesn't grant flying itself - the creature can still be blocked normally by ground creatures.",
    rule: "702.17",
    example:
      "A creature with reach can block both flying and non-flying attackers.",
    related: ["flying", "block", "combat"],
  },
  shroud: {
    name: "Shroud",
    type: "keyword",
    description:
      "A permanent with shroud can't be the target of spells or abilities. Unlike hexproof, even you can't target your own permanents with shroud.",
    rule: "702.18",
    example:
      "You can't cast Giant Growth on your own creature if it has shroud.",
    related: ["target", "hexproof", "protection"],
  },
  trample: {
    name: "Trample",
    type: "keyword",
    description:
      "If a creature with trample would assign enough damage to its blockers to destroy them, it assigns the rest of its damage to the player or planeswalker it's attacking. You must assign lethal damage to all blockers before trampling over.",
    rule: "702.19",
    example:
      "A 5/5 with trample blocked by a 2/2 deals 2 damage to the blocker and 3 damage to the defending player.",
    related: ["combat damage", "excess damage", "blocker"],
  },
  vigilance: {
    name: "Vigilance",
    type: "keyword",
    description:
      "Attacking doesn't cause creatures with vigilance to tap. They can attack and still be untapped to block during your opponent's turn.",
    rule: "702.20",
    example:
      "A creature with vigilance can attack every turn and still block every turn.",
    related: ["tap", "attack", "block", "combat"],
  },
  ward: {
    name: "Ward",
    type: "keyword",
    description:
      "Ward is a triggered ability. Whenever a permanent with ward becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays the ward cost.",
    rule: "702.21",
    example:
      "Ward {2} means an opponent must pay 2 extra mana when targeting this permanent, or their spell is countered.",
    related: ["triggered ability", "counter", "target", "tax"],
  },

  // Game Concepts and Rules
  priority: {
    name: "Priority",
    type: "game concept",
    description:
      "Priority determines which player can cast spells or activate abilities at any given time. The active player (whose turn it is) gets priority first after each spell resolves and at the beginning of most steps and phases. Players pass priority in turn order. When all players pass priority in succession, the top spell or ability on the stack resolves, or if the stack is empty, the game moves to the next step or phase.",
    rule: "117",
    example:
      "After you cast a spell, you get priority first to cast another spell or activate an ability before your opponent can respond.",
    related: ["stack", "active player", "timing", "instant speed"],
  },
  "the stack": {
    name: "The Stack",
    type: "game concept",
    description:
      "The stack is a zone where spells and abilities wait to resolve. It works on a last-in, first-out basis. When a spell or ability is cast or activated, it goes on top of the stack. Players can respond by adding more spells or abilities on top. When both players pass priority, the top item of the stack resolves. This continues until the stack is empty.",
    rule: "405",
    example:
      "If you cast Lightning Bolt and your opponent responds with Counterspell, the Counterspell is on top of the stack and resolves first, countering your Lightning Bolt.",
    related: ["priority", "resolve", "response", "LIFO"],
  },
  stack: {
    name: "The Stack",
    type: "game concept",
    description:
      "The stack is a zone where spells and abilities wait to resolve. It works on a last-in, first-out basis. When a spell or ability is cast or activated, it goes on top of the stack. Players can respond by adding more spells or abilities on top. When both players pass priority, the top item of the stack resolves. This continues until the stack is empty.",
    rule: "405",
    example:
      "If you cast Lightning Bolt and your opponent responds with Counterspell, the Counterspell is on top of the stack and resolves first, countering your Lightning Bolt.",
    related: ["priority", "resolve", "response", "LIFO"],
  },
  "summoning sickness": {
    name: "Summoning Sickness",
    type: "game concept",
    description:
      "Creatures can't attack or activate abilities with the tap symbol unless they've been under your control continuously since the beginning of your most recent turn. This informal term describes this rule. Creatures with haste ignore summoning sickness.",
    rule: "302.6",
    example:
      "A creature you just played can't attack this turn unless it has haste, but it can still block.",
    related: ["haste", "tap", "attack", "creature"],
  },
  "legend rule": {
    name: "Legend Rule",
    type: "game concept",
    description:
      "If a player controls two or more legendary permanents with the same name, that player chooses one of them, and the rest are put into their owners' graveyards. This is a state-based action.",
    rule: "704.5j",
    example:
      "If you control two copies of the same legendary creature, you must immediately choose one to keep and put the other in your graveyard.",
    related: ["legendary", "state-based action", "permanent"],
  },
  "mana burn": {
    name: "Mana Burn",
    type: "obsolete rule",
    description:
      "Mana burn was removed from the game in 2009. Previously, unspent mana would deal damage to you at the end of phases. Now, mana simply empties from your mana pool at the end of each step and phase with no penalty.",
    rule: "Former 300.3",
    example:
      "You can tap lands for mana you don't need without taking damage - the mana just disappears.",
    related: ["mana pool", "phases", "obsolete"],
  },
  "damage on the stack": {
    name: "Damage on the Stack",
    type: "obsolete rule",
    description:
      "Combat damage no longer uses the stack. This rule was removed in 2009. Now, combat damage is dealt immediately when the damage step begins. Creatures that would die from combat damage are destroyed before players get priority to cast spells or activate abilities.",
    rule: "Former 310.4",
    example:
      "You can no longer sacrifice a creature after it assigns combat damage but before it takes damage.",
    related: ["combat damage", "stack", "obsolete", "sacrifice"],
  },

  // Combat and Phases
  combat: {
    name: "Combat Phase",
    type: "game phase",
    description:
      "The combat phase consists of five steps in order: Beginning of Combat, Declare Attackers, Declare Blockers, Combat Damage (possibly two if first strike is involved), and End of Combat. Players get priority in each step.",
    rule: "506",
    example:
      "You can cast instants between declaring attackers and declaring blockers.",
    related: ["attack", "block", "damage", "phases"],
  },
  "main phase": {
    name: "Main Phase",
    type: "game phase",
    description:
      "You have two main phases each turn: pre-combat and post-combat. During your main phases, you can play lands (if you haven't played your land for turn) and cast any type of spell (if the stack is empty). These are the only phases where you can normally cast sorceries, creatures, artifacts, enchantments, and planeswalkers.",
    rule: "505",
    example:
      "You can only cast sorceries during your main phase when the stack is empty.",
    related: ["sorcery speed", "land", "priority", "phases"],
  },
  upkeep: {
    name: "Upkeep Step",
    type: "game step",
    description:
      "The upkeep step is the second step of the beginning phase, after the untap step. Abilities that trigger 'at the beginning of your upkeep' trigger at this time. The active player gets priority after these triggers are put on the stack.",
    rule: "503",
    example: "Cumulative upkeep costs are paid during the upkeep step.",
    related: ["beginning phase", "triggered ability", "untap"],
  },
  "draw step": {
    name: "Draw Step",
    type: "game step",
    description:
      "The draw step is the third step of the beginning phase. The active player draws a card as a turn-based action that doesn't use the stack. Then the active player gets priority.",
    rule: "504",
    example:
      "The first player in a game skips their draw step on their first turn.",
    related: ["beginning phase", "draw", "turn-based action"],
  },

  // Card Types
  instant: {
    name: "Instant",
    type: "card type",
    description:
      "Instants can be cast any time you have priority, even during your opponent's turn or in response to other spells. They go to the graveyard after resolving.",
    rule: "304",
    example: "You can cast Counterspell in response to your opponent's spell.",
    related: ["stack", "priority", "flash", "timing"],
  },
  sorcery: {
    name: "Sorcery",
    type: "card type",
    description:
      "Sorceries can only be cast during your main phase when the stack is empty. They go to the graveyard after resolving. This timing restriction is called 'sorcery speed'.",
    rule: "307",
    example:
      "You can't cast a sorcery during combat or on your opponent's turn.",
    related: ["main phase", "timing", "stack"],
  },
  planeswalker: {
    name: "Planeswalker",
    type: "card type",
    description:
      "Planeswalkers enter with loyalty counters equal to their printed loyalty. You can activate one loyalty ability per planeswalker per turn at sorcery speed. They can be attacked directly and take damage, losing loyalty counters. When a planeswalker has 0 loyalty, it's put into the graveyard.",
    rule: "306",
    example:
      "You can only use one loyalty ability per planeswalker each turn during your main phase.",
    related: ["loyalty", "permanent", "legendary", "damage redirection"],
  },

  // Zones
  graveyard: {
    name: "Graveyard",
    type: "zone",
    description:
      "The graveyard is where cards go when they're discarded, destroyed, sacrificed, or countered (for spells). It's a public zone, so all players can look at all graveyards at any time. Cards in graveyards are in the order they were put there.",
    rule: "404",
    example: "When a creature dies, it goes to its owner's graveyard.",
    related: ["destroy", "sacrifice", "discard", "death"],
  },
  exile: {
    name: "Exile Zone",
    type: "zone",
    description:
      "The exile zone is a public zone where cards can be put face-up or face-down. Exiled cards are removed from the game but can sometimes be returned by the effect that exiled them. Cards in exile are not in any player's graveyard, hand, library, or battlefield.",
    rule: "406",
    example:
      "Path to Exile removes a creature from the game by putting it in exile.",
    related: ["remove from game", "zone", "public information"],
  },
  battlefield: {
    name: "Battlefield",
    type: "zone",
    description:
      "The battlefield is the zone where permanents exist. Creatures, artifacts, enchantments, planeswalkers, and lands on the battlefield are permanents. Instants and sorceries never enter the battlefield.",
    rule: "403",
    example:
      "When you cast a creature spell and it resolves, it enters the battlefield.",
    related: ["permanent", "in play", "enters the battlefield"],
  },
  library: {
    name: "Library",
    type: "zone",
    description:
      "Your library is your deck. It's a hidden zone - you can't look at cards in your library unless an effect allows it. When you draw a card, you take the top card of your library. If you would draw from an empty library, you lose the game.",
    rule: "401",
    example:
      "When you 'search your library', you can look through your entire deck.",
    related: ["deck", "draw", "shuffle", "mill"],
  },
  hand: {
    name: "Hand",
    type: "zone",
    description:
      "Your hand is where you hold cards you've drawn but haven't played yet. Your hand is hidden information from your opponents. You have a maximum hand size of seven - at the end of your turn, you discard down to seven cards.",
    rule: "402",
    example:
      "At the end of your turn, if you have 9 cards in hand, you must discard 2.",
    related: ["draw", "discard", "maximum hand size", "hidden information"],
  },

  // Actions
  tap: {
    name: "Tap",
    type: "action",
    description:
      "To tap a permanent, turn it sideways. Tapped permanents typically can't be tapped again until they untap. Creatures normally tap when attacking. Many abilities require tapping as a cost, shown by the tap symbol {T}.",
    rule: "701.21",
    example:
      "You tap lands to produce mana, and tap creatures when they attack.",
    related: ["untap", "attack", "activated ability", "cost"],
  },
  untap: {
    name: "Untap",
    type: "action",
    description:
      "To untap a permanent, turn it back to its normal upright position from being tapped. Permanents normally untap during your untap step, but some effects can untap them at other times.",
    rule: "701.22",
    example:
      "All your permanents untap during your untap step unless an effect prevents it.",
    related: ["tap", "untap step", "vigilance"],
  },
  sacrifice: {
    name: "Sacrifice",
    type: "action",
    description:
      "To sacrifice a permanent, move it from the battlefield to its owner's graveyard. You can only sacrifice permanents you control. Sacrificing can't be prevented by regeneration or indestructible.",
    rule: "701.17",
    example:
      "If a spell says 'sacrifice a creature', you must choose one of your own creatures.",
    related: ["destroy", "graveyard", "cost", "control"],
  },
  destroy: {
    name: "Destroy",
    type: "action",
    description:
      "To destroy a permanent means to move it from the battlefield to its owner's graveyard. Destruction can be prevented by regeneration or ignored by indestructible. Destruction is different from sacrifice.",
    rule: "701.7",
    example:
      "Murder destroys target creature, but can't destroy an indestructible creature.",
    related: ["indestructible", "regenerate", "sacrifice", "graveyard"],
  },
  counter: {
    name: "Counter",
    type: "action",
    description:
      "To counter a spell or ability means to remove it from the stack and put it into its owner's graveyard without it resolving. The spell or ability has no effect. Only spells and abilities on the stack can be countered.",
    rule: "701.5",
    example:
      "Counterspell counters target spell, preventing all of its effects.",
    related: ["stack", "resolve", "spell", "ability"],
  },
  discard: {
    name: "Discard",
    type: "action",
    description:
      "To discard a card, move it from your hand to your graveyard. If an effect tells you to discard but doesn't specify, you choose which cards to discard. Some effects make opponents discard at random.",
    rule: "701.8",
    example: "Mind Rot makes target player discard two cards of their choice.",
    related: ["hand", "graveyard", "madness"],
  },
  draw: {
    name: "Draw",
    type: "action",
    description:
      "To draw a card means to take the top card of your library and put it into your hand. If you can't draw because your library is empty, you lose the game. Drawing is different from putting cards into your hand by other means.",
    rule: "121",
    example: "You draw one card during your draw step each turn.",
    related: ["library", "hand", "mill", "card advantage"],
  },
  mill: {
    name: "Mill",
    type: "action",
    description:
      "To mill cards means to put that many cards from the top of a library into its owner's graveyard. This is named after the card Millstone. Mill doesn't target the cards being milled.",
    rule: "701.13",
    example: "Glimpse the Unthinkable mills target player for 10 cards.",
    related: ["library", "graveyard", "self-mill"],
  },
  shuffle: {
    name: "Shuffle",
    type: "action",
    description:
      "To shuffle a library means to randomize the order of cards in it. After searching a library, you typically must shuffle it. Some effects shuffle cards into libraries.",
    rule: "701.20",
    example:
      "After you search your library with Rampant Growth, you must shuffle.",
    related: ["library", "search", "randomize"],
  },
  scry: {
    name: "Scry",
    type: "action",
    description:
      "To scry N, look at the top N cards of your library, then put any number of them on the bottom of your library and the rest on top in any order. Scry helps you filter your draws.",
    rule: "701.18",
    example:
      "Scry 2 means look at your top 2 cards and arrange them how you want.",
    related: ["library", "card selection", "filtering"],
  },
  regenerate: {
    name: "Regenerate",
    type: "action",
    description:
      "Regeneration is a replacement effect that prevents destruction. When a permanent with a regeneration shield would be destroyed, instead remove all damage from it, tap it, and remove it from combat. The shield is used up.",
    rule: "701.15",
    example:
      "If you regenerate a creature, the next time it would be destroyed this turn, it isn't.",
    related: ["destroy", "replacement effect", "damage", "combat"],
  },
};

/**
 * Check if a question is asking about a keyword or game concept
 * @param {string} question - The user's question
 * @returns {Object|null} - The keyword data if found, null otherwise
 */
function detectKeyword(question) {
  const lowerQuestion = question.toLowerCase();

  // Check for exact keyword matches
  for (const [key, data] of Object.entries(keywords)) {
    // Check if the question contains this keyword
    if (lowerQuestion.includes(key)) {
      // Make sure it's actually asking about the keyword, not a card
      const isAskingAboutKeyword =
        lowerQuestion.includes("how does") ||
        lowerQuestion.includes("how do") ||
        lowerQuestion.includes("what is") ||
        lowerQuestion.includes("what does") ||
        lowerQuestion.includes("what happens") ||
        lowerQuestion.includes("explain") ||
        lowerQuestion.includes("work") ||
        lowerQuestion.includes("mean") ||
        lowerQuestion.includes("rule") ||
        lowerQuestion.includes("ability") ||
        lowerQuestion.includes("keyword") ||
        lowerQuestion.includes("mechanic");

      if (isAskingAboutKeyword) {
        console.log(`[KEYWORD DETECTED] Found keyword: ${data.name}`);
        return data;
      }
    }
  }

  // Check for common question patterns about rules
  const rulePatterns = [
    { pattern: /priority/i, keyword: "priority" },
    { pattern: /\bstack\b/i, keyword: "stack" },
    { pattern: /summoning sickness/i, keyword: "summoning sickness" },
    { pattern: /legend rule/i, keyword: "legend rule" },
    { pattern: /mana burn/i, keyword: "mana burn" },
    { pattern: /damage on the stack/i, keyword: "damage on the stack" },
    { pattern: /combat phase/i, keyword: "combat" },
    { pattern: /main phase/i, keyword: "main phase" },
    { pattern: /upkeep/i, keyword: "upkeep" },
    { pattern: /draw step/i, keyword: "draw step" },
    { pattern: /graveyard/i, keyword: "graveyard" },
    { pattern: /exile/i, keyword: "exile" },
    { pattern: /battlefield/i, keyword: "battlefield" },
    { pattern: /library/i, keyword: "library" },
    { pattern: /\bhand\b/i, keyword: "hand" },
  ];

  for (const { pattern, keyword } of rulePatterns) {
    if (pattern.test(lowerQuestion)) {
      const data = keywords[keyword];
      if (data) {
        console.log(`[KEYWORD PATTERN] Matched pattern for: ${data.name}`);
        return data;
      }
    }
  }

  return null;
}

/**
 * Get all keyword names for validation
 * @returns {string[]} Array of all keyword names
 */
function getAllKeywords() {
  return Object.keys(keywords);
}

/**
 * Check if a word might be a keyword (for filtering out of card searches)
 * @param {string} word - The word to check
 * @returns {boolean} True if it's likely a keyword
 */
function isLikelyKeyword(word) {
  const lowerWord = word.toLowerCase();
  return Object.keys(keywords).some(
    (key) => key.includes(lowerWord) || lowerWord.includes(key)
  );
}

module.exports = {
  keywords,
  detectKeyword,
  getAllKeywords,
  isLikelyKeyword,
};
