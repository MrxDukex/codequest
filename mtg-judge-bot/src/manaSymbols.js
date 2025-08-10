/**
 * Mana Symbol Handler for MTG Judge Bot
 * Uses Scryfall's official SVG symbols with enhanced Unicode representations
 */

class ManaSymbolHandler {
  constructor() {
    // Store for dynamically loaded Discord emojis
    this.discordEmojis = {};

    // Complete mapping of all MTG symbols to Discord custom emojis
    this.symbols = {
      // Basic colored mana
      "{W}": { discord: ":manaw:", unicode: "⚪", svg: "W", name: "white" },
      "{U}": { discord: ":manau:", unicode: "🔵", svg: "U", name: "blue" },
      "{B}": { discord: ":manab:", unicode: "⚫", svg: "B", name: "black" },
      "{R}": { discord: ":manar:", unicode: "🔴", svg: "R", name: "red" },
      "{G}": { discord: ":manag:", unicode: "🟢", svg: "G", name: "green" },
      "{C}": { discord: ":manac:", unicode: "◊", svg: "C", name: "colorless" },

      // Generic mana (0-20)
      "{0}": { discord: ":mana0:", unicode: "{0}", svg: "0", name: "zero" },
      "{1}": { discord: ":1:", unicode: "①", svg: "1", name: "one" },
      "{2}": { discord: ":2:", unicode: "②", svg: "2", name: "two" },
      "{3}": { discord: ":3:", unicode: "③", svg: "3", name: "three" },
      "{4}": { discord: ":4:", unicode: "④", svg: "4", name: "four" },
      "{5}": { discord: ":5:", unicode: "⑤", svg: "5", name: "five" },
      "{6}": { discord: ":6:", unicode: "⑥", svg: "6", name: "six" },
      "{7}": { discord: ":7:", unicode: "⑦", svg: "7", name: "seven" },
      "{8}": { discord: ":8:", unicode: "⑧", svg: "8", name: "eight" },
      "{9}": { discord: ":9:", unicode: "⑨", svg: "9", name: "nine" },
      "{10}": { discord: ":10:", unicode: "⑩", svg: "10", name: "ten" },
      "{11}": { discord: ":mana11:", unicode: "⑪", svg: "11", name: "eleven" },
      "{12}": { discord: ":mana12:", unicode: "⑫", svg: "12", name: "twelve" },
      "{13}": {
        discord: ":mana13:",
        unicode: "⑬",
        svg: "13",
        name: "thirteen",
      },
      "{14}": {
        discord: ":mana14:",
        unicode: "⑭",
        svg: "14",
        name: "fourteen",
      },
      "{15}": { discord: ":mana15:", unicode: "⑮", svg: "15", name: "fifteen" },
      "{16}": { discord: ":mana16:", unicode: "⑯", svg: "16", name: "sixteen" },
      "{17}": {
        discord: ":mana17:",
        unicode: "⑰",
        svg: "17",
        name: "seventeen",
      },
      "{18}": {
        discord: ":mana18:",
        unicode: "⑱",
        svg: "18",
        name: "eighteen",
      },
      "{19}": {
        discord: ":mana19:",
        unicode: "⑲",
        svg: "19",
        name: "nineteen",
      },
      "{20}": { discord: ":mana20:", unicode: "⑳", svg: "20", name: "twenty" },

      // Variable mana
      "{X}": { discord: ":manax:", unicode: "Ⓧ", svg: "X", name: "X" },
      "{Y}": { discord: ":manay:", unicode: "Ⓨ", svg: "Y", name: "Y" },
      "{Z}": { discord: ":manaz:", unicode: "Ⓩ", svg: "Z", name: "Z" },

      // Special mana
      "{S}": { discord: ":manas:", unicode: "❄", svg: "S", name: "snow" },
      "{T}": { discord: ":manat:", unicode: "⟲", svg: "T", name: "tap" },
      "{Q}": { discord: ":manaq:", unicode: "⤵", svg: "Q", name: "untap" },
      "{E}": { discord: ":manae:", unicode: "⚡", svg: "E", name: "energy" },
      "{P}": { discord: ":manap:", unicode: "🐾", svg: "P", name: "pawprint" },
      "{PW}": {
        discord: ":manapw:",
        unicode: "⚔",
        svg: "PW",
        name: "planeswalker",
      },
      "{CHAOS}": {
        discord: ":manachaos:",
        unicode: "🌀",
        svg: "CHAOS",
        name: "chaos",
      },
      "{A}": { discord: ":manaa:", unicode: "🌰", svg: "A", name: "acorn" },
      "{TK}": { discord: ":manatk:", unicode: "🎫", svg: "TK", name: "ticket" },

      // Hybrid mana (two-color)
      "{W/U}": {
        discord: ":manawu:",
        unicode: "⚪/🔵",
        svg: "WU",
        name: "white/blue",
      },
      "{W/B}": {
        discord: ":manawb:",
        unicode: "⚪/⚫",
        svg: "WB",
        name: "white/black",
      },
      "{U/B}": {
        discord: ":manaub:",
        unicode: "🔵/⚫",
        svg: "UB",
        name: "blue/black",
      },
      "{U/R}": {
        discord: ":manaur:",
        unicode: "🔵/🔴",
        svg: "UR",
        name: "blue/red",
      },
      "{B/R}": {
        discord: ":manabr:",
        unicode: "⚫/🔴",
        svg: "BR",
        name: "black/red",
      },
      "{B/G}": {
        discord: ":manabg:",
        unicode: "⚫/🟢",
        svg: "BG",
        name: "black/green",
      },
      "{R/G}": {
        discord: ":manarg:",
        unicode: "🔴/🟢",
        svg: "RG",
        name: "red/green",
      },
      "{R/W}": {
        discord: ":manarw:",
        unicode: "🔴/⚪",
        svg: "RW",
        name: "red/white",
      },
      "{G/W}": {
        discord: ":managw:",
        unicode: "🟢/⚪",
        svg: "GW",
        name: "green/white",
      },
      "{G/U}": {
        discord: ":managU:",
        unicode: "🟢/🔵",
        svg: "GU",
        name: "green/blue",
      },

      // Phyrexian mana
      "{W/P}": {
        discord: ":manawp:",
        unicode: "Φ⚪",
        svg: "WP",
        name: "phyrexian white",
      },
      "{U/P}": {
        discord: ":manaup:",
        unicode: "Φ🔵",
        svg: "UP",
        name: "phyrexian blue",
      },
      "{B/P}": {
        discord: ":manabp:",
        unicode: "Φ⚫",
        svg: "BP",
        name: "phyrexian black",
      },
      "{R/P}": {
        discord: ":manarp:",
        unicode: "Φ🔴",
        svg: "RP",
        name: "phyrexian red",
      },
      "{G/P}": {
        discord: ":managp:",
        unicode: "Φ🟢",
        svg: "GP",
        name: "phyrexian green",
      },
      "{C/P}": {
        discord: ":manacp:",
        unicode: "Φ◊",
        svg: "CP",
        name: "phyrexian colorless",
      },

      // Hybrid Phyrexian mana
      "{W/U/P}": {
        unicode: "Φ⚪/🔵",
        svg: "WUP",
        name: "phyrexian white/blue",
      },
      "{W/B/P}": {
        unicode: "Φ⚪/⚫",
        svg: "WBP",
        name: "phyrexian white/black",
      },
      "{U/B/P}": {
        unicode: "Φ🔵/⚫",
        svg: "UBP",
        name: "phyrexian blue/black",
      },
      "{U/R/P}": { unicode: "Φ🔵/🔴", svg: "URP", name: "phyrexian blue/red" },
      "{B/R/P}": { unicode: "Φ⚫/🔴", svg: "BRP", name: "phyrexian black/red" },
      "{B/G/P}": {
        unicode: "Φ⚫/🟢",
        svg: "BGP",
        name: "phyrexian black/green",
      },
      "{R/G/P}": { unicode: "Φ🔴/🟢", svg: "RGP", name: "phyrexian red/green" },
      "{R/W/P}": { unicode: "Φ🔴/⚪", svg: "RWP", name: "phyrexian red/white" },
      "{G/W/P}": {
        unicode: "Φ🟢/⚪",
        svg: "GWP",
        name: "phyrexian green/white",
      },
      "{G/U/P}": {
        unicode: "Φ🟢/🔵",
        svg: "GUP",
        name: "phyrexian green/blue",
      },

      // Twobrid mana
      "{2/W}": { unicode: "②/⚪", svg: "2W", name: "two/white" },
      "{2/U}": { unicode: "②/🔵", svg: "2U", name: "two/blue" },
      "{2/B}": { unicode: "②/⚫", svg: "2B", name: "two/black" },
      "{2/R}": { unicode: "②/🔴", svg: "2R", name: "two/red" },
      "{2/G}": { unicode: "②/🟢", svg: "2G", name: "two/green" },

      // Colorless hybrid
      "{C/W}": { unicode: "◊/⚪", svg: "CW", name: "colorless/white" },
      "{C/U}": { unicode: "◊/🔵", svg: "CU", name: "colorless/blue" },
      "{C/B}": { unicode: "◊/⚫", svg: "CB", name: "colorless/black" },
      "{C/R}": { unicode: "◊/🔴", svg: "CR", name: "colorless/red" },
      "{C/G}": { unicode: "◊/🟢", svg: "CG", name: "colorless/green" },

      // Half mana
      "{HW}": { unicode: "½⚪", svg: "HW", name: "half white" },
      "{HR}": { unicode: "½🔴", svg: "HR", name: "half red" },
      "{½}": { unicode: "½", svg: "HALF", name: "half" },

      // Special/Funny mana
      "{100}": { unicode: "💯", svg: "100", name: "one hundred" },
      "{1000000}": { unicode: "1M", svg: "1000000", name: "one million" },
      "{∞}": { unicode: "∞", svg: "INFINITY", name: "infinity" },
      "{H}": { unicode: "♥", svg: "H", name: "hybrid generic" },
      "{L}": { unicode: "👑", svg: "L", name: "legendary" },
      "{D}": { unicode: "🏞", svg: "D", name: "land drop" },
    };

    // Base URL for Scryfall SVG symbols
    this.svgBaseUrl = "https://svgs.scryfall.io/card-symbols/";
  }

  /**
   * Set Discord emojis dynamically from the server
   * @param {Object} emojiMap - Map of emoji names to Discord emoji strings
   */
  setDiscordEmojis(emojiMap) {
    console.log("🎨 Updating mana symbols with Discord emojis...");

    // Map the emoji names to the corresponding mana symbols
    const emojiMappings = {
      // Basic mana
      manaw: "{W}",
      manau: "{U}",
      manab: "{B}",
      manar: "{R}",
      manag: "{G}",
      manac: "{C}",

      // Numbers (with underscore variants)
      mana0: "{0}", // Try mana0 first
      "0_": "{0}", // Alternative name
      0: "{0}", // Fallback
      1: "{1}",
      2: "{2}",
      3: "{3}",
      4: "{4}",
      5: "{5}",
      6: "{6}",
      7: "{7}",
      8: "{8}",
      9: "{9}",
      "1_": "{1}",
      "2_": "{2}",
      "3_": "{3}",
      "4_": "{4}",
      "5_": "{5}",
      "6_": "{6}",
      "7_": "{7}",
      "8_": "{8}",
      "9_": "{9}",
      10: "{10}",
      mana11: "{11}",
      mana12: "{12}",
      mana13: "{13}",
      mana14: "{14}",
      mana15: "{15}",
      mana16: "{16}",
      mana17: "{17}",
      mana18: "{18}",
      mana19: "{19}",
      mana20: "{20}",

      // Special
      manax: "{X}",
      manay: "{Y}",
      manaz: "{Z}",
      manat: "{T}",
      manaq: "{Q}",
      manas: "{S}",
      manae: "{E}",
      manainfinity: "{∞}",

      // Hybrid mana
      manawu: "{W/U}",
      manawb: "{W/B}",
      manaub: "{U/B}",
      manaur: "{U/R}",
      manabr: "{B/R}",
      manabg: "{B/G}",
      manarg: "{R/G}",
      manarw: "{R/W}",
      managw: "{G/W}",
      managU: "{G/U}",
      manaqu: "{G/U}", // Alternative name

      // Phyrexian
      manawp: "{W/P}",
      manaup: "{U/P}",
      manabp: "{B/P}",
      manarp: "{R/P}",
      managp: "{G/P}",

      // Colorless hybrid
      manacb: "{C/B}",
      manacg: "{C/G}",
      manacr: "{C/R}",
      manacu: "{C/U}",
      manacw: "{C/W}",

      // Other hybrid combinations
      manaaw: "{W/B}", // Alternative white/black
      manawb: "{W/B}",
      managr: "{G/R}",
      manawr: "{W/R}",
      manawg: "{W/G}",
      managu: "{G/U}",
      manabw: "{B/W}",
      manawu: "{W/U}",
      manauw: "{U/W}",
    };

    // Update symbols with actual Discord emoji strings
    for (const [emojiName, emojiString] of Object.entries(emojiMap)) {
      const symbolKey = emojiMappings[emojiName];
      if (symbolKey && this.symbols[symbolKey]) {
        // Update the discord property with the actual emoji string (e.g., <:manar:123456>)
        this.symbols[symbolKey].discord = emojiString;
        console.log(`  Mapped ${emojiName} -> ${symbolKey} = ${emojiString}`);
      }
    }

    // Store the emoji map for future reference
    this.discordEmojis = emojiMap;
    console.log(
      `✅ Updated ${
        Object.keys(emojiMap).length
      } Discord emojis in mana symbols`
    );
  }

  /**
   * Get the SVG URL for a mana symbol
   */
  getSvgUrl(symbol) {
    const symbolData = this.symbols[symbol];
    if (!symbolData) return null;
    return `${this.svgBaseUrl}${symbolData.svg}.svg`;
  }

  /**
   * Convert mana cost string to Discord custom emojis
   * @param {string} manaCost - The mana cost string (e.g., "{2}{R}{R}")
   * @param {boolean} useDiscord - Whether to use Discord custom emojis (default: true)
   * @returns {string} - The converted mana cost
   */
  convertManaCost(manaCost, useDiscord = true) {
    if (!manaCost) return "";

    let converted = manaCost;

    // Sort symbols by length (longest first) to avoid partial replacements
    const sortedSymbols = Object.keys(this.symbols).sort(
      (a, b) => b.length - a.length
    );

    for (const symbol of sortedSymbols) {
      const symbolData = this.symbols[symbol];
      if (!symbolData) continue;

      // Use Discord custom emojis if available, otherwise fall back to Unicode
      let replacement;
      if (useDiscord && symbolData.discord) {
        replacement = symbolData.discord;
      } else {
        replacement = symbolData.unicode;
      }

      // Replace all occurrences of this symbol
      const regex = new RegExp(symbol.replace(/[{}]/g, "\\$&"), "g");
      converted = converted.replace(regex, replacement);
    }

    return converted;
  }

  /**
   * Convert oracle text with mana symbols to enhanced representation
   * @param {string} text - The oracle text
   * @param {boolean} useDiscord - Whether to use Discord custom emojis (default: true)
   * @returns {string} - The converted text
   */
  formatOracleText(text, useDiscord = true) {
    if (!text) return "";

    // First convert mana symbols to Discord emojis
    let formatted = this.convertManaCost(text, useDiscord);

    // Add keyword ability icons (optional enhancement)
    const keywordIcons = {
      Flying: "🦅",
      Vigilance: "👁️",
      Trample: "🦣",
      Haste: "⚡",
      "First strike": "⚔️",
      "Double strike": "⚔️⚔️",
      Lifelink: "❤️",
      Deathtouch: "💀",
      Hexproof: "🛡️",
      Indestructible: "💎",
      Menace: "👹",
      Ward: "🔮",
      Flash: "⚡",
      Defender: "🛡️",
      Reach: "🏹",
      Prowess: "💪",
      Protection: "🛡️",
      Shroud: "🌫️",
      Intimidate: "😨",
      Fear: "😨",
      Shadow: "👤",
    };

    // Add icons after keywords
    for (const [keyword, icon] of Object.entries(keywordIcons)) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      formatted = formatted.replace(regex, `${keyword} ${icon}`);
    }

    return formatted;
  }

  /**
   * Get a display-friendly version of a mana cost
   * This version uses Discord custom emojis for actual MTG symbols
   */
  getDisplayManaCost(manaCost) {
    return this.convertManaCost(manaCost, true);
  }

  /**
   * Get an interactive version of a mana cost with clickable links
   * Note: Discord doesn't support inline images, but links will be blue and clickable
   */
  getInteractiveManaCost(manaCost) {
    return this.convertManaCost(manaCost, true);
  }

  /**
   * Check if a string contains mana symbols
   */
  containsManaSymbols(text) {
    if (!text) return false;
    return /\{[^}]+\}/.test(text);
  }

  /**
   * Extract all mana symbols from a text
   */
  extractManaSymbols(text) {
    if (!text) return [];
    const matches = text.match(/\{[^}]+\}/g);
    return matches || [];
  }

  /**
   * Get symbol data by symbol string
   */
  getSymbolData(symbol) {
    return this.symbols[symbol] || null;
  }

  /**
   * Get all available symbols
   */
  getAllSymbols() {
    return Object.keys(this.symbols);
  }

  /**
   * Validate if a symbol exists
   */
  isValidSymbol(symbol) {
    return symbol in this.symbols;
  }

  /**
   * Convert a mana cost to its CMC (Converted Mana Cost)
   */
  calculateCMC(manaCost) {
    if (!manaCost) return 0;

    let cmc = 0;
    const symbols = this.extractManaSymbols(manaCost);

    for (const symbol of symbols) {
      // Handle generic mana
      const genericMatch = symbol.match(/\{(\d+)\}/);
      if (genericMatch) {
        cmc += parseInt(genericMatch[1]);
        continue;
      }

      // Handle X, Y, Z as 0 for CMC calculation
      if (["{X}", "{Y}", "{Z}"].includes(symbol)) {
        continue;
      }

      // Handle half mana
      if (["{HW}", "{HR}", "{½}"].includes(symbol)) {
        cmc += 0.5;
        continue;
      }

      // Handle Phyrexian mana (counts as 1)
      if (symbol.includes("/P")) {
        cmc += 1;
        continue;
      }

      // Handle twobrid (counts as 2)
      if (symbol.match(/\{2\/[WUBRG]\}/)) {
        cmc += 2;
        continue;
      }

      // All other symbols count as 1
      if (this.isValidSymbol(symbol)) {
        cmc += 1;
      }
    }

    return cmc;
  }
}

// Export as singleton
module.exports = new ManaSymbolHandler();
