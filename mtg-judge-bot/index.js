const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { OpenAI } = require("openai");
const config = require("./config");
const { searchMTGRulesUpdates } = require("./src/webSearch");
const rulesManager = require("./src/rulesManager");
const SecurityManager = require("./security-enhancements");

// Initialize security manager
const security = new SecurityManager();

// Validate environment and API keys
SecurityManager.validateEnvironment();
SecurityManager.validateApiKeys();
SecurityManager.checkFilePermissions();
SecurityManager.monitorMemoryUsage();

// Set production environment
process.env.NODE_ENV = "production";
const { initializeRAG, queryRAG } = require("./src/rag");
const SearchAggregator = require("./src/webSearch/searchAggregator");
const KnowledgeCache = require("./src/knowledge/cache");
const OracleTextParser = require("./src/oracleParser");
const CardReferenceDetector = require("./src/cardReferenceDetector");
const manaSymbols = require("./src/manaSymbols");
const CardSetParser = require("./src/cardSetParser");
const KeywordDatabase = require("./src/keywordDatabase");
const KeywordResponseFormatter = require("./src/keywordResponseFormatter");
const InteractionDatabase = require("./src/interactionDatabase");
const ComplexRulesDatabase = require("./src/complexRulesDatabase");
const InlineCardDetector = require("./src/inlineCardDetector");
const MetaCommand = require("./src/meta/metaCommand");

// Initialize command handlers
const metaCommand = new MetaCommand();

// Mechanic/keyword to icon mapping
const mechanicIcons = {
  nightbound: "🌙",
  disturb: "👻",
  decayed: "🧟",
  blood: "🩸",
  treasure: "💰",
  food: "🍞",
  clue: "🔍",
  adventure: "🗺️",
  sacrifice: "💀",
  destroy: "💥",
  exile: "🚫",
  counter: "❌",
  draw: "📤",
  discard: "📥",
  mill: "⚙️",
  scry: "🔮",
  graveyard: "⚰️",
  battlefield: "⚔️",
  etb: "➡️",
  token: "🪙",
  copy: "📋",
  transform: "🔄",
  morph: "❓",
  kicker: "🦵",
  madness: "🤪",
  ninjutsu: "🥷",
  overload: "⚡",
  proliferate: "📈",
  rebound: "↩️",
  miracle: "✨",
  monarch: "👑",
  dungeon: "🏰",
  venture: "🗺️",
  party: "🎉",
  investigate: "🔍",
  embalm: "⚱️",
  eternalize: "♾️",
  partner: "🤝",
  commander: "👑",
  devotion: "🙏",
};

// Function to get mechanic icon
function getMechanicIcon(mechanic) {
  const lowerMechanic = mechanic.toLowerCase();
  return mechanicIcons[lowerMechanic] || "";
}

// Function to convert mana cost using the new mana symbol handler
function convertManaCost(manaCost) {
  if (!manaCost) return "No mana cost";
  // Use the enhanced mana symbol handler for better Unicode representations
  return manaSymbols.getDisplayManaCost(manaCost);
}

// Function to format oracle text with mana symbols and keyword icons
function formatOracleText(text) {
  if (!text) return "No rules text";
  // Use the enhanced mana symbol handler for oracle text formatting with Discord emojis
  return manaSymbols.formatOracleText(text, true);
}

// Function to get card type emoji - removed to match Scryfall's clean style
function getCardTypeEmoji(typeLine) {
  return ""; // No emojis in card titles for cleaner look
}

// Function to get rarity color
function getRarityColor(rarity) {
  switch (rarity) {
    case "common":
      return 0x000000; // Black
    case "uncommon":
      return 0xc0c0c0; // Silver
    case "rare":
      return 0xffd700; // Gold
    case "mythic":
      return 0xff8c00; // Orange
    default:
      return 0x0099ff; // Blue
  }
}

// Initialize OpenAI client for processing web search results
const openai = new OpenAI({ apiKey: config.openai.apiKey });

// Initialize search aggregator and knowledge cache
const searchAggregator = new SearchAggregator({
  tavilyApiKey: process.env.TAVILY_API_KEY,
  braveApiKey: process.env.BRAVE_API_KEY,
  cacheEnabled: true,
});

const knowledgeCache = new KnowledgeCache();

// Response tracking to prevent duplicates
const processedMessages = new Set();
const responseInProgress = new Map();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Thinking delay messages - now with more variety and entertainment!
const thinkingMessages = [
  // Initial messages
  "🤔 Let me check the comprehensive rules...",
  "📚 Consulting the official Judge Handbook...",
  "🧠 Processing your rules question...",
  "⏳ Searching through Oracle text...",
  "🔍 Reviewing recent tournament rulings...",

  // Fun intermediate messages
  "⚖️ Analyzing card interactions...",
  "📖 Cross-referencing with Gatherer rulings...",
  "🎯 Checking for relevant errata...",
  "💭 Considering all layers and timestamps...",
  "🔮 Consulting the rules manager's notes...",

  // Entertaining messages
  "🏛️ Checking the latest rules updates...",
  "🎲 Rolling a D20 for wisdom...",
  "📜 Deciphering ancient rules text...",
  "🧙‍♂️ Channeling my inner rules advisor...",
  "⚔️ Battling through complex interactions...",

  // More fun messages
  "🗺️ Navigating the comprehensive rules maze...",
  "🔬 Examining edge cases under a microscope...",
  "🎭 Unmasking the true ruling...",
  "🌟 Summoning the spirit of Garfield...",
  "📡 Downloading rulings from the multiverse...",

  // Progress indicators
  "⚡ Almost there, just checking one more thing...",
  "🎪 Juggling multiple rule citations...",
  "🧩 Piecing together the perfect answer...",
  "🎨 Crafting a masterful ruling...",
  "🚀 Launching into the rules stratosphere...",

  // Final stretch messages
  "🏁 Final checks in progress...",
  "✨ Polishing the ruling to perfection...",
  "🎯 Zeroing in on the answer...",
  "🔥 Forging the ultimate judgment...",
  "💎 Crystallizing the ruling...",
];

// Function to get a sequence of thinking messages
function getThinkingMessageSequence() {
  // Shuffle the messages for variety
  const shuffled = [...thinkingMessages].sort(() => Math.random() - 0.5);
  return shuffled;
}

// Animated thinking messages for longer processing
const loadingFrames = ["⚖️", "⚖️.", "⚖️..", "⚖️..."];
let loadingInterval;

// Function to create an animated thinking message
function createAnimatedThinking(baseMessage) {
  let frame = 0;
  const messages = [
    `${baseMessage} ${loadingFrames[0]}`,
    `${baseMessage} ${loadingFrames[1]}`,
    `${baseMessage} ${loadingFrames[2]}`,
    `${baseMessage} ${loadingFrames[3]}`,
  ];

  return {
    messages,
    getNext: function () {
      const message = messages[frame];
      frame = (frame + 1) % messages.length;
      return message;
    },
  };
}

// Function to get card suggestions using Scryfall autocomplete
async function getCardSuggestions(query) {
  try {
    const autocompleteUrl = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(autocompleteUrl);

    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting card suggestions:", error);
    return [];
  }
}

// Function to get the best printing of a card (always preferring non-digital)
async function getBestCardPrinting(cardName) {
  try {
    // First try fuzzy search - this handles misspellings, partial names, and case variations
    const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
      cardName
    )}`;
    console.log(`Trying fuzzy search for: "${cardName}"`);
    const fuzzyRes = await fetch(fuzzyUrl);

    if (fuzzyRes.ok) {
      const cardData = await fuzzyRes.json();
      console.log(`✅ Found card via fuzzy search: ${cardData.name}`);
      return cardData;
    }

    // If fuzzy fails, try exact match
    const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
      cardName
    )}`;
    console.log(`Trying exact search for: "${cardName}"`);
    const exactRes = await fetch(exactUrl);

    if (exactRes.ok) {
      const cardData = await exactRes.json();
      console.log(`✅ Found card via exact search: ${cardData.name}`);
      return cardData;
    }

    // If both fail, try searching for non-digital printings
    const searchUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
      cardName
    )}" -is:digital&order=released&dir=desc`;
    const searchRes = await fetch(searchUrl);

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.data && searchData.data.length > 0) {
        console.log(`✅ Found card via search: ${searchData.data[0].name}`);
        return searchData.data[0];
      }
    }

    console.log(`❌ Could not find card: "${cardName}"`);
    return null;
  } catch (error) {
    console.error("Error getting card:", error);
    return null;
  }
}

// Function to search for current MTG rules and card information
async function searchMTGRules(query) {
  try {
    let searchUrl;

    // Check if this is an oracle text search
    if (query.startsWith("o:")) {
      searchUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        query
      )}&unique=cards&order=released`;
    } else if (query.includes("set:")) {
      searchUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        query
      )}&unique=cards&order=released`;
    } else {
      // Clean up the query - remove common words that might interfere
      const cleanQuery = query
        .replace(/\b(the|of|and|or|in|on|at|to|for)\b/gi, "")
        .trim();
      searchUrl = `${config.scryfall.baseUrl}${encodeURIComponent(cleanQuery)}`;
    }

    // Try Scryfall for card-specific info
    const cardResponse = await fetch(searchUrl);

    if (cardResponse.ok) {
      const responseData = await cardResponse.json();

      // Handle search results (multiple cards)
      if (responseData.data && Array.isArray(responseData.data)) {
        // Return info about cards found, focusing on ones with "warp" or relevant mechanics
        const relevantCards = responseData.data.slice(0, 3); // Get first 3 results
        return {
          search_results: relevantCards.map((card) => ({
            name: card.name,
            oracle_text: card.oracle_text,
            type_line: card.type_line,
            set_name: card.set_name,
            released_at: card.released_at,
          })),
          message: `Found ${responseData.data.length} cards matching the search.`,
        };
      }

      // Handle single card result
      const cardData = responseData;
      const result = {
        card_name: cardData.name,
        oracle_text: cardData.oracle_text,
        type_line: cardData.type_line,
        legalities: cardData.legalities,
      };

      // Get rulings if available
      if (cardData.rulings_uri) {
        const rulingsResponse = await fetch(cardData.rulings_uri);
        if (rulingsResponse.ok) {
          const rulings = await rulingsResponse.json();
          result.rulings = rulings.data.map((r) => `• ${r.comment}`).join("\n");
        }
      }

      return result;
    }

    return {
      message: "No specific card found, providing general rules guidance.",
    };
  } catch (error) {
    console.error("Error searching MTG rules:", error);
    return { error: "Could not fetch current information" };
  }
}

client.once("ready", async () => {
  console.log(`✅ Judge bot is online as ${client.user.tag}`);

  // Fetch and store Discord custom emojis for mana symbols
  try {
    console.log("🎨 Fetching Discord custom emojis...");

    // Get the first guild (server) the bot is in
    const guild = client.guilds.cache.first();
    if (guild) {
      const emojis = guild.emojis.cache;
      const emojiMap = {};

      // Map emoji names to their full Discord format
      emojis.forEach((emoji) => {
        // Store the emoji in format <:name:id>
        emojiMap[emoji.name] = emoji.toString();
        console.log(`  Found emoji: ${emoji.name} -> ${emoji.toString()}`);
      });

      // Update manaSymbols with the Discord emoji IDs
      manaSymbols.setDiscordEmojis(emojiMap);
      console.log(`✅ Loaded ${Object.keys(emojiMap).length} custom emojis!`);
    } else {
      console.warn("⚠️ No guild found for emoji loading");
    }
  } catch (error) {
    console.error("⚠️ Failed to load Discord emojis:", error);
  }

  // Initialize knowledge cache
  try {
    console.log("🗄️ Initializing knowledge cache...");
    await knowledgeCache.initialize();
    console.log("✅ Knowledge cache ready!");
  } catch (error) {
    console.error("⚠️ Failed to initialize knowledge cache:", error);
  }

  // Initialize comprehensive rules
  try {
    console.log("📚 Initializing comprehensive rules...");
    await rulesManager.initializeRules();
    // Initialize RAG with the comprehensive rules
    const allRules = await rulesManager.getAllRules();
    const rulesForRAG = allRules.map((rule) => ({
      pageContent: `Rule ${rule.number}: ${rule.text}`,
      metadata: { ruleNumber: rule.number },
    }));
    console.log(`📚 Preparing ${rulesForRAG.length} rules for RAG system...`);
    await initializeRAG(rulesForRAG);
    console.log("✅ RAG system ready!");
  } catch (error) {
    console.error("⚠️ Failed to initialize comprehensive rules:", error);
    console.log("Bot will continue without comprehensive rules support.");
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Security checks
  if (!security.isChannelWhitelisted(message.channel.id)) {
    return; // Silently ignore messages from non-whitelisted channels
  }

  if (!security.checkRateLimit(message.author.id)) {
    return message.reply(
      "⚠️ Please wait a moment before sending another command."
    );
  }

  // Sanitize input
  const content = security.sanitizeInput(message.content.trim());

  // Prevent duplicate processing
  if (processedMessages.has(message.id)) {
    console.log(`[DUPLICATE] Already processed message ${message.id}`);
    return;
  }

  // Check if we're already processing a response for this channel
  if (responseInProgress.has(message.channel.id)) {
    console.log(
      `[IN PROGRESS] Response already in progress for channel ${message.channel.id}`
    );
    return;
  }

  // Mark message as processed and channel as in progress
  processedMessages.add(message.id);
  responseInProgress.set(message.channel.id, true);

  // Clean up after 10 seconds
  setTimeout(() => {
    processedMessages.delete(message.id);
    responseInProgress.delete(message.channel.id);
  }, 10000);

  // Check for inline card references FIRST (works on all messages)
  if (InlineCardDetector.hasCardReferences(content)) {
    console.log("[INLINE CARDS] Detected card references in message");
    const parsedData = InlineCardDetector.parseMessage(content);

    if (parsedData.exceedsLimit) {
      return message.reply(
        "⚠️ Maximum 5 cards per message. Please reduce the number of cards."
      );
    }

    if (parsedData.hasCards) {
      const embeds = [];
      const notFound = [];

      for (const cardRef of parsedData.cards) {
        try {
          let cardData = null;
          if (cardRef.set) {
            cardData = await CardSetParser.getCardFromSet(
              cardRef.cleanName,
              cardRef.set
            );
          }
          if (!cardData) {
            cardData = await getBestCardPrinting(cardRef.cleanName);
          }

          if (cardData) {
            console.log(`[INLINE CARDS] Found card: ${cardData.name}`);
            const cardImage =
              cardData.image_uris?.normal ||
              cardData.card_faces?.[0]?.image_uris?.normal;

            const embedTitle = cardRef.set
              ? `${cardData.name} ${
                  cardData.mana_cost ? convertManaCost(cardData.mana_cost) : ""
                } [${cardRef.set.toUpperCase()}]`
              : `${cardData.name} ${
                  cardData.mana_cost ? convertManaCost(cardData.mana_cost) : ""
                }`;

            const embed = new EmbedBuilder()
              .setTitle(embedTitle)
              .setURL(cardData.scryfall_uri)
              .setColor(getRarityColor(cardData.rarity))
              .setImage(cardImage);

            let description = `**${cardData.type_line}**`;
            if (cardData.power && cardData.toughness) {
              description += ` • ${cardData.power}/${cardData.toughness}`;
            } else if (cardData.loyalty) {
              description += ` • Loyalty: ${cardData.loyalty}`;
            }

            description += `\n${cardData.collector_number} • ${
              cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)
            }`;

            if (cardData.oracle_text) {
              const formattedText = formatOracleText(cardData.oracle_text);
              description += `\n\n${formattedText}`;
            }

            if (cardData.flavor_text) {
              description += `\n\n*${cardData.flavor_text}*`;
            }

            embed.setDescription(description.substring(0, 4096));
            embeds.push(embed);
          } else {
            console.log(`[INLINE CARDS] Card not found: ${cardRef.cleanName}`);
            const suggestions = await getCardSuggestions(cardRef.cleanName);
            if (suggestions.length > 0) {
              notFound.push(
                `${cardRef.raw} - Did you mean: ${suggestions[0]}?`
              );
            } else {
              notFound.push(cardRef.raw);
            }
          }
        } catch (error) {
          console.error(
            `[INLINE CARDS] Error processing ${cardRef.name}:`,
            error
          );
          notFound.push(cardRef.raw);
        }
      }

      if (embeds.length > 0) {
        const responseMessage = { embeds: embeds };
        if (notFound.length > 0) {
          responseMessage.content = `⚠️ Cards not found: ${notFound.join(
            ", "
          )}`;
        }
        await message.channel.send(responseMessage);
      } else if (notFound.length > 0) {
        await message.reply(`⚠️ No cards found: ${notFound.join(", ")}`);
      }
    }
    return;
  }

  // !meta command for tournament meta analysis
  if (content.startsWith("!meta")) {
    const args = content.slice(5).trim().split(/\s+/);
    return metaCommand.handle(message, args);
  }

  // !commands command to list all available commands
  if (content === "!commands") {
    const commandsList = [
      {
        cmd: "!judge [question]",
        desc: "Get Magic: The Gathering rules clarifications.",
      },
      {
        cmd: "!card [card name]",
        desc: "Look up card information from Scryfall.",
      },
      {
        cmd: "!cards [names]",
        desc: "Look up multiple cards (comma-separated, max 10).",
      },
      {
        cmd: "!meta [format]",
        desc: "Get current tournament meta breakdown.",
      },
      {
        cmd: "!updaterules",
        desc: "Update the comprehensive rules.",
      },
      {
        cmd: "!rulestatus",
        desc: "Check comprehensive rules status.",
      },
      {
        cmd: "[[card name]]",
        desc: "Inline card lookup.",
      },
    ];
    let reply = "**Available Commands:**\n\n";
    for (const c of commandsList) {
      reply += `${c.cmd} — ${c.desc}\n`;
    }
    await message.channel.send(reply);
    return;
  }

  // !updaterules command for manually updating comprehensive rules
  if (content === "!updaterules") {
    const updatingMsg = await message.channel.send(
      "📥 Downloading latest comprehensive rules from Wizards of the Coast..."
    );

    try {
      await rulesManager.downloadRules();
      await rulesManager.parseAndIndexRules();
      await updatingMsg.edit("✅ Comprehensive rules updated successfully!");
    } catch (error) {
      console.error("Error updating rules:", error);
      await updatingMsg.edit(
        "❌ Failed to update comprehensive rules. Please try again later."
      );
    }

    return;
  }

  // !rulestatus command to check comprehensive rules status
  if (content === "!rulestatus") {
    try {
      const fs = require("fs").promises;
      const path = require("path");

      const lastUpdateFile = path.join(
        __dirname,
        "data",
        "lastRulesUpdate.json"
      );
      const rulesFile = path.join(__dirname, "data", "MagicCompRules.txt");

      let statusMessage = "📚 **Comprehensive Rules Status**\n\n";

      try {
        const lastUpdateData = await fs.readFile(lastUpdateFile, "utf8");
        const updateInfo = JSON.parse(lastUpdateData);
        const updateDate = new Date(updateInfo.date);

        statusMessage += `✅ Rules loaded: **${updateInfo.rulesCount.toLocaleString()}** rules indexed\n`;
        statusMessage += `📅 Last updated: ${updateDate.toLocaleDateString()} at ${updateDate.toLocaleTimeString()}\n`;

        // Check file size
        const stats = await fs.stat(rulesFile);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        statusMessage += `📁 Rules file size: ${fileSizeMB} MB\n`;

        // Calculate time since last update
        const hoursSinceUpdate = Math.floor(
          (Date.now() - updateDate) / (1000 * 60 * 60)
        );
        statusMessage += `⏰ Time since update: ${hoursSinceUpdate} hours ago\n`;

        if (hoursSinceUpdate > 24) {
          statusMessage += `\n⚠️ Rules are over 24 hours old. Run \`!updaterules\` to check for updates.`;
        } else {
          statusMessage += `\n✨ Rules are up to date!`;
        }
      } catch (error) {
        statusMessage += `❌ No rules currently loaded.\n`;
        statusMessage += `Run \`!updaterules\` to download the comprehensive rules.`;
      }

      await message.channel.send(statusMessage);
    } catch (error) {
      console.error("Error checking rules status:", error);
      await message.channel.send("❌ Error checking rules status.");
    }

    return;
  }

  // !judge command for rules
  if (content.startsWith("!judge")) {
    const question = content.slice(6).trim();
    if (!question) return;

    // Get a sequence of thinking messages
    const messageSequence = getThinkingMessageSequence();
    let messageIndex = 0;

    // Start with the first message
    const thinkingMsg = await message.channel.send(messageSequence[0]);

    // Set up message cycling - change message every 5 seconds
    let cycleCount = 0;
    loadingInterval = setInterval(async () => {
      try {
        cycleCount++;

        // Every 5 seconds (3.33 cycles at 1.5s intervals), change to a new message
        if (cycleCount % 3 === 0) {
          messageIndex = (messageIndex + 1) % messageSequence.length;
          const newMessage = messageSequence[messageIndex];

          // Add a loading animation to the message
          const loadingDots = ".".repeat((cycleCount % 4) + 1);
          await thinkingMsg.edit(newMessage + loadingDots);
        } else {
          // Just update the loading dots on the current message
          const currentMessage = messageSequence[messageIndex];
          const loadingDots = ".".repeat((cycleCount % 4) + 1);
          await thinkingMsg.edit(currentMessage + loadingDots);
        }

        // Stop after 30 seconds to prevent infinite loops
        if (cycleCount > 20) {
          clearInterval(loadingInterval);
        }
      } catch (err) {
        clearInterval(loadingInterval);
      }
    }, 1500); // Update every 1.5 seconds

    try {
      // Clear any existing interval first
      if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
      }

      // Analyze the question
      const lowerQuestion = question.toLowerCase();
      let cardSearchResults = null;
      let webSearchResults = null;
      let specificCardData = null;
      let secondaryCardData = null;
      let specificCardName = null;
      let secondaryCardName = null;
      let comprehensiveRules = null;
      let sourcesUsed = [];

      // Initialize analysis flags and shared search term
      // These flags are referenced throughout the handler; define them up-front to avoid ReferenceError
      let askingHowAbilityWorks =
        /(?:\bhow\s+(?:does|do)\b.*\b(?:work|function)\b|\bexplain\b.*\b(?:mechanic|ability|keyword)\b)/i.test(
          lowerQuestion
        );
      let askingAboutMechanic =
        askingHowAbilityWorks ||
        /(\bmechanic\b|\bkeyword\b|\bability\b)/i.test(lowerQuestion);
      let askingAboutInteraction =
        /(work with|interact|combo|synerg|together| vs |against)/i.test(
          lowerQuestion
        ) ||
        (lowerQuestion.includes(" with ") && /[a-z]/i.test(lowerQuestion));
      let searchTerm = null;

      // OPTIMIZED CARD DETECTION - No more excessive API calls!
      let mentionedCardName = null;
      let cardExists = false;

      console.log(
        "[CARD DETECTION] Starting card detection for question:",
        question
      );

      // Step 1: Priority check for known cards (including The Ur-Dragon)
      const knownProblematicCards = [
        "endstone",
        "the endstone",
        "ur-dragon",
        "the ur-dragon",
        "ur dragon",
      ];
      for (const knownCard of knownProblematicCards) {
        if (lowerQuestion.includes(knownCard)) {
          console.log(
            `[CARD DETECTION] Detected known card reference: "${knownCard}"`
          );
          // Map to correct card name
          let searchName = knownCard;
          if (knownCard.includes("endstone")) searchName = "The Endstone";
          if (knownCard.includes("ur")) searchName = "The Ur-Dragon";

          const cardData = await getBestCardPrinting(searchName);
          if (cardData) {
            mentionedCardName = cardData.name;
            cardExists = true;
            specificCardData = cardData;
            console.log(`[CARD FOUND] ✅ Found card: ${cardData.name}`);
            console.log(`[CARD ORACLE] Oracle text: ${cardData.oracle_text}`);
            sourcesUsed.push("Scryfall (Card Verified)");
          }
          break;
        }
      }

      // Step 2: If no known card found, try smart extraction with improved patterns
      if (!cardExists) {
        let potentialCardName = null;

        // Pattern 1: "how does [Card Name] work?" - most common
        let match = question.match(
          /how (?:does|do)\s+(.+?)\s+(?:work|function)/i
        );
        if (match) {
          potentialCardName = match[1].trim();
        }

        // Pattern 2: "explain [Card Name]"
        if (!potentialCardName) {
          match = question.match(/explain\s+(.+?)(?:\s*$|\s*\?)/i);
          if (match) {
            potentialCardName = match[1].trim();
          }
        }

        // Pattern 3: "what does [Card Name] do"
        if (!potentialCardName) {
          match = question.match(/what (?:does|do|is)\s+(.+?)\s+(?:do|mean)/i);
          if (match) {
            potentialCardName = match[1].trim();
          }
        }

        // Pattern 4: "[Card Name] ruling" or "ruling on [Card Name]"
        if (!potentialCardName) {
          match = question.match(/(?:^|\s)(.+?)\s+ruling/i);
          if (match) {
            potentialCardName = match[1].trim();
          } else {
            match = question.match(/ruling (?:on|for)\s+(.+?)(?:\s*$|\s*\?)/i);
            if (match) {
              potentialCardName = match[1].trim();
            }
          }
        }

        // Pattern 5: Fallback - remove common question starters and see what's left
        if (!potentialCardName) {
          let cleaned = question;
          const questionStarters = [
            /^how (?:does|do)\s+/i,
            /^what (?:does|do|is)\s+/i,
            /^explain\s+/i,
            /^can you explain\s+/i,
            /^tell me about\s+/i,
          ];

          for (const starter of questionStarters) {
            cleaned = cleaned.replace(starter, "");
          }

          // Remove trailing question words
          cleaned = cleaned.replace(/\s+(?:work|do|mean|function)s?\??$/i, "");
          cleaned = cleaned.trim();

          // If what's left looks like a card name, use it
          if (cleaned.length > 2 && cleaned.length < 50) {
            potentialCardName = cleaned;
          }
        }

        // Try to fetch the card if we found a potential name
        if (potentialCardName && potentialCardName.length > 2) {
          console.log(`Checking potential card: "${potentialCardName}"`);
          const cardData = await getBestCardPrinting(potentialCardName);
          if (cardData) {
            mentionedCardName = cardData.name;
            cardExists = true;
            specificCardData = cardData;
            console.log(`✅ Found card: ${cardData.name}`);
            sourcesUsed.push("Scryfall (Card Verified)");
          }
        }

        // Step 3: Last resort - look for any capitalized multi-word phrase
        if (!cardExists) {
          // Extract capitalized phrases from original question
          const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
          const matches = question.match(capitalizedPattern);
          if (matches) {
            // Check only the most likely candidates (max 2 API calls)
            for (let i = 0; i < Math.min(2, matches.length); i++) {
              const candidate = matches[i];
              if (
                candidate.length > 3 &&
                !["The", "How", "What", "Can", "You"].includes(candidate)
              ) {
                console.log(`Final check for: "${candidate}"`);
                const cardData = await getBestCardPrinting(candidate);
                if (cardData) {
                  mentionedCardName = cardData.name;
                  cardExists = true;
                  specificCardData = cardData;
                  console.log(`✅ Found card: ${cardData.name}`);
                  sourcesUsed.push("Scryfall (Card Verified)");
                  break;
                }
              }
            }
          }
        }
      }

      // Always search comprehensive rules for any mechanic/keyword
      try {
        comprehensiveRules = await rulesManager.findRelevantRules(question);
        if (comprehensiveRules && comprehensiveRules.length > 0) {
          sourcesUsed.push("Comprehensive Rules");
          console.log(
            `Found ${comprehensiveRules.length} relevant rules from comprehensive rules`
          );
        }
      } catch (error) {
        console.error("Error searching comprehensive rules:", error);
      }

      // If we found a card that exists but no comprehensive rules, that's OK!
      // The card might be from a special set (Mystery Booster, Un-sets, etc.)
      let needsScryfall =
        (!comprehensiveRules || comprehensiveRules.length === 0) && !cardExists;

      if (needsScryfall) {
        // Try to extract a mechanic or card name from the question
        searchTerm = null;
        const quotedMatch = question.match(/["']([^"']+)["']/);
        if (quotedMatch) searchTerm = quotedMatch[1];
        if (!searchTerm) {
          const words = question.split(" ").filter((w) => w.length > 3);
          if (words.length > 0) searchTerm = words.join(" ");
        }
        if (searchTerm) {
          cardSearchResults = await searchMTGRules(searchTerm);
          if (
            cardSearchResults &&
            (cardSearchResults.search_results?.length > 0 ||
              cardSearchResults.oracle_text)
          ) {
            sourcesUsed.push("Scryfall");
          }
        }
      }

      // If still unclear, use web search as a last resort
      let needsWeb =
        (!comprehensiveRules || comprehensiveRules.length === 0) &&
        (!cardSearchResults || cardSearchResults.search_results?.length === 0);
      if (needsWeb) {
        webSearchResults = await searchMTGRulesUpdates(question);
        if (
          webSearchResults &&
          webSearchResults.results &&
          webSearchResults.results.length > 0
        ) {
          sourcesUsed.push("Web Search");
        }
      }

      // Check if this is about rules updates, changes, or announcements
      // Only do web search if it's specifically about updates/changes, NOT for normal rules questions
      const needsWebSearch =
        lowerQuestion.includes("update") ||
        lowerQuestion.includes("change") ||
        lowerQuestion.includes("recent") ||
        lowerQuestion.includes("new rule") ||
        lowerQuestion.includes("announcement") ||
        lowerQuestion.includes("errata") ||
        lowerQuestion.includes("ban") ||
        lowerQuestion.includes("restriction") ||
        lowerQuestion.includes("latest") ||
        lowerQuestion.includes("upcoming") ||
        lowerQuestion.includes("secret lair") ||
        lowerQuestion.includes("edge of eternities") ||
        lowerQuestion.includes("spiderman") ||
        lowerQuestion.includes("spider-man") ||
        lowerQuestion.includes("universes beyond") ||
        lowerQuestion.includes("new set") ||
        lowerQuestion.includes("spoiler") ||
        lowerQuestion.includes("preview") ||
        lowerQuestion.includes("release date");

      // Check if this is about specific cards or mechanics
      const needsCardSearch =
        askingHowAbilityWorks ||
        askingAboutMechanic ||
        ((lowerQuestion.includes("card") ||
          lowerQuestion.includes("mechanic") ||
          lowerQuestion.includes("ability") ||
          lowerQuestion.includes("keyword") ||
          lowerQuestion.includes("work with") ||
          lowerQuestion.includes("synerg") ||
          lowerQuestion.includes("combo") ||
          lowerQuestion.includes("interact")) &&
          !needsWebSearch);

      if (needsWebSearch) {
        // Use the new search aggregator for comprehensive web search
        console.log("Detected need for web search. Question:", question);
        console.log("Using search aggregator for MTG information...");

        // Check if this is about a specific set
        const setKeywords = [
          "spider-man",
          "spiderman",
          "universes beyond",
          "upcoming",
          "new set",
        ];
        let isAboutSet = setKeywords.some((keyword) =>
          lowerQuestion.includes(keyword)
        );

        if (isAboutSet) {
          // Extract set name if possible
          let setName = "";
          if (
            lowerQuestion.includes("spider-man") ||
            lowerQuestion.includes("spiderman")
          ) {
            setName = "Spider-Man";
          } else if (lowerQuestion.includes("universes beyond")) {
            setName = "Universes Beyond";
          }

          if (setName) {
            const setResults = await searchAggregator.searchUpcomingSet(
              setName
            );
            if (setResults.hasInformation) {
              webSearchResults = {
                results: setResults.articles || [],
                summary: setResults.summary,
              };
              sourcesUsed.push("Web Search (Aggregated)");
            }
          }
        } else {
          // General search
          const searchResults = await searchAggregator.search(question);
          if (searchResults.hasResults) {
            webSearchResults = {
              results: searchResults.webResults || [],
              summary: searchResults.combinedAnswer,
            };
            sourcesUsed.push("Web Search (Aggregated)");
          }
        }

        console.log("Search aggregator results:", webSearchResults);
      } else if (needsCardSearch) {
        // Check if a specific card is mentioned
        let specificCardName = null;
        let secondaryCardName = null;

        // Look for card names in various patterns
        const cardPatterns = [
          /(?:with|on|about|for)\s+((?:the\s+)?[\w\s]+?)(?:\s+creature|\s+card|\?|$)/i,
          /work\s+with\s+((?:the\s+)?[\w\s]+?)(?:\?|$)/i,
          /(?:cast|play|use)\s+((?:the\s+)?[\w\s]+?)(?:\s+and|\s+with|\?|$)/i,
          /(?:with)\s+((?:the\s+)?[\w\s]+?)(?:\?|$)/i, // Catches "with The Endstone?"
        ];

        for (const pattern of cardPatterns) {
          const match = question.match(pattern);
          if (match && match[1].trim().length > 2) {
            const cardName = match[1].trim();
            if (!specificCardName) {
              specificCardName = cardName;
              console.log("Detected specific card name:", specificCardName);
            } else if (cardName !== specificCardName) {
              secondaryCardName = cardName;
              console.log("Detected secondary card name:", secondaryCardName);
            }
          }
        }

        // Extract potential card/mechanic names from the question
        const quotedMatch = question.match(/["']([^"']+)["']/);
        searchTerm = quotedMatch ? quotedMatch[1] : null;

        if (!searchTerm && askingHowAbilityWorks) {
          // Extract ability name from "how does X work" patterns
          const abilityMatch = question.match(
            /(?:how (?:does|do)|explain|what (?:does|is))\s+(?:the\s+)?(\w+(?:\s+\w+)?)\s+(?:ability|mechanic|work|keyword)?/i
          );
          if (abilityMatch) {
            searchTerm = abilityMatch[1];
          }
        }

        if (!searchTerm) {
          const words = question
            .split(" ")
            .filter(
              (word) =>
                word.length > 3 &&
                ![
                  "from",
                  "what",
                  "does",
                  "work",
                  "card",
                  "mechanic",
                  "ability",
                  "keyword",
                  "rule",
                  "judge",
                  "explain",
                  "how",
                ].includes(word.toLowerCase())
            );
          if (words.length > 0) {
            searchTerm = words.join(" ");
          }
        }

        // Special handling for specific types of effects
        if (
          lowerQuestion.includes("twice as much life") ||
          lowerQuestion.includes("double life") ||
          (lowerQuestion.includes("life gain") &&
            lowerQuestion.includes("doubl"))
        ) {
          // Search for life doubling effects
          console.log("Searching for life doubling effects...");
          cardSearchResults = await searchMTGRules(
            'o:"If you would gain life" o:"gain that much life plus"'
          );

          if (
            !cardSearchResults ||
            cardSearchResults.search_results?.length === 0
          ) {
            // Try another search pattern
            cardSearchResults = await searchMTGRules(
              'o:"gain twice that much" or o:"gain double that"'
            );
          }
        } else if (searchTerm) {
          console.log("Searching Scryfall for:", searchTerm);

          // For ability questions, search for cards with that ability in oracle text
          if (askingHowAbilityWorks) {
            // For mechanics, search for the keyword ability
            let mechanicSearch = searchTerm.toLowerCase();

            // Handle common variations
            if (
              mechanicSearch.includes("warp") ||
              mechanicSearch.includes("edge of eternities")
            ) {
              mechanicSearch = "warp";
            }

            // Try multiple search strategies
            const searchQueries = [
              `o:"${mechanicSearch} {"`, // For keyword abilities like "Warp {2}"
              `o:"${mechanicSearch} —"`, // For abilities with em dash
              `o:"${mechanicSearch}:"`, // For abilities with colon
              `o:"${mechanicSearch}"`, // General oracle text search
            ];

            for (const query of searchQueries) {
              console.log("Searching oracle text with:", query);
              cardSearchResults = await searchMTGRules(query);

              if (
                cardSearchResults &&
                !cardSearchResults.error &&
                cardSearchResults.search_results?.length > 0
              ) {
                console.log(
                  `Found ${cardSearchResults.search_results.length} cards with ${mechanicSearch}`
                );
                break;
              }
            }

            // If still no results, try regular search
            if (
              !cardSearchResults ||
              cardSearchResults.message ||
              !cardSearchResults.search_results?.length
            ) {
              cardSearchResults = await searchMTGRules(searchTerm);
            }
          } else {
            cardSearchResults = await searchMTGRules(searchTerm);
          }
        }

        // If a specific card was mentioned, also fetch that card's data
        if (specificCardName) {
          try {
            console.log(`Attempting to fetch card: "${specificCardName}"`);
            const cardData = await getBestCardPrinting(specificCardName);
            if (cardData) {
              specificCardData = cardData;
              console.log(`Found specific card: ${cardData.name}`);
              console.log(`Oracle text: ${cardData.oracle_text}`);
            } else {
              console.log(`Could not find card data for: ${specificCardName}`);
            }
          } catch (err) {
            console.error("Error fetching specific card:", err);
          }
        }

        // Also fetch secondary card if mentioned
        if (secondaryCardName) {
          try {
            const cardData = await getBestCardPrinting(secondaryCardName);
            if (cardData) {
              secondaryCardData = cardData;
              console.log(`Found secondary card: ${cardData.name}`);
            }
          } catch (err) {
            console.error("Error fetching secondary card:", err);
          }
        }

        // Merge specific card data into search results if needed
        if (specificCardData || secondaryCardData) {
          if (!cardSearchResults) {
            cardSearchResults = { search_results: [] };
          }
          if (!cardSearchResults.search_results) {
            cardSearchResults.search_results = [];
          }

          // Add secondary card first (if exists)
          if (secondaryCardData) {
            cardSearchResults.search_results.unshift({
              name: secondaryCardData.name,
              oracle_text: secondaryCardData.oracle_text,
              type_line: secondaryCardData.type_line,
              set_name: secondaryCardData.set_name,
              mana_cost: secondaryCardData.mana_cost,
              is_secondary_card: true,
            });
          }

          // Add specific card at the beginning
          if (specificCardData) {
            cardSearchResults.search_results.unshift({
              name: specificCardData.name,
              oracle_text: specificCardData.oracle_text,
              type_line: specificCardData.type_line,
              set_name: specificCardData.set_name,
              mana_cost: specificCardData.mana_cost,
              is_specific_card: true,
            });
          }
        }
      }

      // For complex interactions or cards not in the database, always search web
      if (
        askingAboutInteraction &&
        !webSearchResults &&
        (lowerQuestion.includes("endstone") ||
          (lowerQuestion.includes("twice as much") &&
            lowerQuestion.includes("life")) ||
          (lowerQuestion.includes("double") &&
            lowerQuestion.includes("life gain")))
      ) {
        console.log("Searching web for complex card interaction...");
        webSearchResults = await searchMTGRulesUpdates(question);
        console.log("Web search results for interaction:", webSearchResults);
      }

      // Build context for the answer
      let context = "";
      let hasGoodContext = false;

      // Add comprehensive rules to context
      if (comprehensiveRules && comprehensiveRules.length > 0) {
        context += "Relevant Comprehensive Rules:\n";
        comprehensiveRules.forEach((rule) => {
          context += `Rule ${rule.number}: ${rule.text}\n`;
        });
        context += "\n";
        hasGoodContext = true;
      }

      // Add card search results to context
      if (cardSearchResults) {
        if (
          cardSearchResults.search_results &&
          cardSearchResults.search_results.length > 0
        ) {
          context += "Relevant Cards:\n";
          cardSearchResults.search_results.forEach((card) => {
            context += `${card.name}: ${
              card.oracle_text || "No oracle text"
            }\n`;
          });
          context += "\n";
          hasGoodContext = true;
        } else if (cardSearchResults.oracle_text) {
          context += `Card Oracle Text: ${cardSearchResults.oracle_text}\n\n`;
          hasGoodContext = true;
        }
      }

      // Add web search results to context if available
      if (webSearchResults && webSearchResults.results) {
        context += "Additional Information:\n";
        webSearchResults.results.slice(0, 2).forEach((result) => {
          if (result.content) {
            context += `${result.content.substring(0, 200)}...\n`;
          }
        });
        context += "\n";
      }

      let finalAnswer = "";

      // Load custom mechanics database for consistent answers
      let customMechanics = {};
      try {
        const fs = require("fs").promises;
        const path = require("path");
        const mechanicsPath = path.join(
          __dirname,
          "data",
          "customMechanics.json"
        );
        const mechanicsData = await fs.readFile(mechanicsPath, "utf8");
        customMechanics = JSON.parse(mechanicsData);
      } catch (error) {
        console.log("Custom mechanics database not found, using defaults");
      }

      // Always use a consistent approach for answer generation
      try {
        // Check if asking about a specific mechanic
        let mechanicInfo = null;
        const mechanicKeywords = Object.keys(customMechanics);

        for (const mechanic of mechanicKeywords) {
          if (lowerQuestion.includes(mechanic.toLowerCase())) {
            mechanicInfo = customMechanics[mechanic];
            break;
          }
        }

        // Check if this is about a specific mechanic that might not be in comprehensive rules
        const isAboutNewMechanic =
          lowerQuestion.includes("warp") ||
          lowerQuestion.includes("edge of eternities") ||
          lowerQuestion.includes("new cards") ||
          lowerQuestion.includes("new set");

        // PRIORITY: If we found a specific card that exists, use its oracle text with enhanced parsing
        if (cardExists && specificCardData) {
          console.log(
            "[ENHANCED LOGIC] Using OracleTextParser for card:",
            specificCardData.name
          );

          // Parse the oracle text for better accuracy
          const parsedData = OracleTextParser.parseCard(specificCardData);
          console.log("[PARSER] Warnings generated:", parsedData.warnings);
          console.log("[PARSER] Patterns detected:", parsedData.patterns);

          // Generate a strict prompt using the parser
          const cardPrompt = OracleTextParser.generateStrictPrompt(
            specificCardData,
            parsedData,
            question
          );
          console.log("[PROMPT] Using strict prompt with warnings");

          // First attempt with strict interpretation
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert Magic: The Gathering rules judge providing comprehensive, detailed explanations. You must explain cards EXACTLY as their oracle text states, without adding interpretations. Be extremely precise about cost reductions, life gain, damage, and all numerical effects. Never say 'per creature' unless the oracle text explicitly says 'for each'. Provide thorough explanations that include: 1) How the ability works step-by-step, 2) Important timing considerations, 3) Common interactions or edge cases, 4) Examples when helpful. Your answers should be educational and complete, typically 2-3 paragraphs minimum.",
              },
              {
                role: "user",
                content: cardPrompt,
              },
            ],
            temperature: 0.0, // Zero temperature for maximum accuracy
            max_tokens: 800, // Increased for longer responses
          });

          let generatedAnswer = response.choices[0].message.content;
          console.log("[ANSWER] Initial answer generated");

          // Validate the answer
          const validation = OracleTextParser.validateAnswer(
            specificCardData.oracle_text,
            generatedAnswer
          );

          // If validation fails, regenerate with even stricter prompt
          if (!validation.isValid) {
            console.log("Answer validation failed:", validation.errors);

            const stricterPrompt = `You are a Magic: The Gathering rules judge. 

CRITICAL: The previous answer had errors: ${validation.errors.join(", ")}

Card Information:
Name: ${specificCardData.name}
Type: ${specificCardData.type_line}
Oracle Text: "${specificCardData.oracle_text}"

${
  parsedData.warnings.length > 0
    ? `
IMPORTANT CLARIFICATIONS:
${parsedData.warnings.join("\n")}
`
    : ""
}

Explain this card's abilities EXACTLY as written. Do not add any interpretations. Be literal and precise.`;

            const retryResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a precise Magic: The Gathering oracle text interpreter providing detailed explanations. Explain abilities EXACTLY as written, with no interpretation or embellishment, but provide comprehensive context including timing, interactions, and examples. Aim for 2-3 paragraphs minimum.",
                },
                {
                  role: "user",
                  content: stricterPrompt,
                },
              ],
              temperature: 0.0,
              max_tokens: 800, // Increased for longer responses
            });

            generatedAnswer = retryResponse.choices[0].message.content;
          }

          // Add Scryfall rulings if available
          if (specificCardData.rulings_uri) {
            try {
              const rulingsRes = await fetch(specificCardData.rulings_uri);
              if (rulingsRes.ok) {
                const rulings = await rulingsRes.json();
                if (rulings.data && rulings.data.length > 0) {
                  generatedAnswer += "\n\n**Official Rulings:**\n";
                  generatedAnswer += rulings.data
                    .slice(0, 3)
                    .map((r) => `• ${r.comment}`)
                    .join("\n");
                }
              }
            } catch (err) {
              console.error("Failed to fetch rulings:", err);
            }
          }

          finalAnswer = generatedAnswer;
        } else if (mechanicInfo) {
          // Use the custom mechanics database for consistent answers
          const mechPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "${question}"

Here is the official information about this mechanic:
Name: ${mechanicInfo.name}
Description: ${mechanicInfo.description}
Example: ${mechanicInfo.example || "N/A"}
Rulings: ${
            mechanicInfo.rulings
              ? mechanicInfo.rulings.join("\n")
              : "No specific rulings"
          }
${
  mechanicInfo.comprehensiveRule
    ? `Comprehensive Rule: ${mechanicInfo.comprehensiveRule}`
    : ""
}

Please provide a clear, accurate answer based on this official information. Be consistent with this definition.`;

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert Magic: The Gathering rules judge providing comprehensive, educational answers. Always provide consistent, accurate answers based on the official information provided. Include detailed explanations with: 1) Complete description of how the mechanic works, 2) Step-by-step breakdown when relevant, 3) Common interactions and edge cases, 4) Examples of gameplay situations, 5) Any important timing or priority considerations. Aim for thorough, helpful responses of at least 2-3 paragraphs.",
              },
              {
                role: "user",
                content: mechPrompt,
              },
            ],
            temperature: 0.0, // Zero temperature for maximum consistency
            max_tokens: 800, // Increased for longer responses
          });

          finalAnswer = response.choices[0].message.content;
        } else if (isAboutNewMechanic && !hasGoodContext) {
          // For new mechanics not in our database, provide a general explanation
          const mechPrompt = `You are a Magic: The Gathering rules judge. The user is asking about: "${question}"

Important: If this is about "Warp", it's a keyword ability from the Edge of Eternities set that allows a player to cast a spell for its warp cost rather than its mana cost. When a player warps a spell, they may pay the warp cost instead of the mana cost. The spell is then exiled with a warp counter on it. The player may cast the exiled spell for its warp cost until the end of their next turn.

Please provide a clear, accurate answer. If you don't have specific information about a card or mechanic, explain that it may be from a newer set not yet in the comprehensive rules database.`;

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert Magic: The Gathering rules judge providing detailed, educational explanations. Always provide consistent, accurate answers. For mechanics not in the comprehensive rules, explain what you know and note if it's from a newer set. Include: 1) Complete explanation of the mechanic or rule, 2) How it works in practice with examples, 3) Important interactions or exceptions, 4) Common misconceptions if any, 5) Related rules or mechanics. Provide comprehensive answers of at least 2-3 paragraphs.",
              },
              {
                role: "user",
                content: mechPrompt,
              },
            ],
            temperature: 0.1, // Lower temperature for more consistent answers
            max_tokens: 800, // Increased for longer responses
          });

          finalAnswer = response.choices[0].message.content;
        } else if (context.trim() && hasGoodContext) {
          // Use context when we have good information
          const prompt = `You are a Magic: The Gathering rules judge. Based on the following context, answer this question: "${question}"

Context:
${context}

Provide a clear, accurate answer based on the information provided above. Be consistent with your answers.`;

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert Magic: The Gathering rules judge providing comprehensive, detailed explanations. Provide accurate, consistent answers based on the comprehensive rules and context provided. Your responses should be educational and thorough, including: 1) Complete explanation of the rule or interaction, 2) Step-by-step breakdown of complex processes, 3) Relevant examples and common scenarios, 4) Important exceptions or edge cases, 5) Related rules that might apply. Always cite specific rule numbers when available. Aim for detailed responses of at least 2-3 paragraphs that fully educate the player.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.1, // Lower temperature for consistency
            max_tokens: 800, // Increased for longer responses
          });

          finalAnswer = response.choices[0].message.content;
        } else {
          // Fallback when no good context is available
          const fallbackPrompt = `You are a Magic: The Gathering rules judge answering: "${question}"

If this is about a standard mechanic, explain it based on comprehensive rules. If it's about a newer mechanic or card not in the comprehensive rules database, provide the best information available and note that it may be from a newer set.`;

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert Magic: The Gathering rules judge providing comprehensive, educational responses. Provide consistent, helpful answers even when specific rule citations aren't available. Include: 1) A complete explanation of the concept or rule being asked about, 2) How it works in actual gameplay with examples, 3) Common situations where this comes up, 4) Any important related rules or interactions, 5) Tips for remembering or applying the rule correctly. Your goal is to thoroughly educate the player with detailed, helpful responses of at least 2-3 paragraphs.",
              },
              {
                role: "user",
                content: fallbackPrompt,
              },
            ],
            temperature: 0.1,
            max_tokens: 800, // Increased for longer responses
          });

          finalAnswer = response.choices[0].message.content;
        }
      } catch (error) {
        console.error("Error generating answer:", error);
        // Fallback to basic answer if API fails
        if (comprehensiveRules && comprehensiveRules.length > 0) {
          finalAnswer = comprehensiveRules[0].text;
        } else {
          finalAnswer =
            "I couldn't generate a proper answer. Please try rephrasing your question.";
        }
      }

      // Clear the loading interval
      if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
      }

      // Ensure we have a safe, non-empty answer before creating embeds
      if (typeof finalAnswer !== "string" || finalAnswer.trim().length === 0) {
        finalAnswer =
          "⚠️ I couldn't find a definitive ruling from the available sources. Try rephrasing your question or include exact card names/mechanics.";
      } else {
        finalAnswer = finalAnswer.trim();
        // Convert mana symbols in the answer to emojis
        finalAnswer = formatOracleText(finalAnswer);
      }

      // Use CardReferenceDetector to find and validate referenced cards
      console.log("[CARD REFERENCES] Detecting referenced cards in answer...");

      // Determine what card is being explained (if any)
      let cardBeingExplained = null;
      if (specificCardData) {
        cardBeingExplained = specificCardData.name;
        console.log(
          `[CARD REFERENCES] Card being explained: ${cardBeingExplained}`
        );
      }

      const potentialCardNames =
        CardReferenceDetector.extractPotentialCardNames(
          finalAnswer,
          cardBeingExplained
        );
      console.log(
        "[CARD REFERENCES] Potential cards found:",
        potentialCardNames
      );

      // Validate and fetch full card data for referenced cards
      const referencedCards = await CardReferenceDetector.validateCardNames(
        potentialCardNames,
        getBestCardPrinting
      );
      console.log(
        `[CARD REFERENCES] Validated ${referencedCards.length} referenced cards`
      );

      // Detect mechanic being asked about
      let mechanicIcon = "";
      let detectedMechanic = "";

      if (askingHowAbilityWorks) {
        // Try to find the mechanic in the question
        const mechanicWords = question
          .toLowerCase()
          .match(/\b(\w+)\s+(?:mechanic|ability|keyword)/);
        if (mechanicWords) {
          detectedMechanic = mechanicWords[1];
          mechanicIcon = getMechanicIcon(detectedMechanic);
        } else {
          // Check for specific mechanic names in the question
          for (const mechanic of Object.keys(mechanicIcons)) {
            if (question.toLowerCase().includes(mechanic)) {
              detectedMechanic = mechanic;
              mechanicIcon = getMechanicIcon(mechanic);
              break;
            }
          }
        }
      }

      // Create the main embed for the response
      const embedTitle = mechanicIcon
        ? `⚖️ Judge's Ruling ${mechanicIcon}`
        : "⚖️ Judge's Ruling";

      const mainEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(embedTitle)
        .setDescription(finalAnswer.substring(0, 4096));

      // Create embeds array starting with the main embed
      const embeds = [mainEmbed];

      // Add embeds for referenced cards if any were found
      if (referencedCards && referencedCards.length > 0) {
        console.log(
          `[CARD REFERENCES] Creating embeds for ${referencedCards.length} referenced cards`
        );

        for (const card of referencedCards) {
          // Create a full-size embed for each referenced card
          const cardEmbed = new EmbedBuilder()
            .setColor(0x8b4513) // Brown color for referenced cards
            .setTitle(
              `📋 ${card.name} ${
                card.mana_cost ? convertManaCost(card.mana_cost) : ""
              }`
            )
            .setURL(
              card.scryfall_uri ||
                `https://scryfall.com/search?q="${encodeURIComponent(
                  card.name
                )}"`
            );

          // Build description with formatted oracle text
          let cardDescription = "";

          // Add type line only (mana cost is now in title)
          if (card.type_line) {
            cardDescription += `**${card.type_line}**`;

            // Add power/toughness or loyalty if present
            if (card.power && card.toughness) {
              cardDescription += ` • ${card.power}/${card.toughness}`;
            } else if (card.loyalty) {
              cardDescription += ` • Loyalty: ${card.loyalty}`;
            }

            cardDescription += "\n\n";
          }

          // Add oracle text with formatting
          if (card.oracle_text) {
            cardDescription += `${formatOracleText(card.oracle_text)}`;
          }

          cardEmbed.setDescription(cardDescription.substring(0, 4096));

          // Use full-size image instead of thumbnail for better readability
          if (card.image_uri) {
            cardEmbed.setImage(card.image_uri);
          }

          // Add the card embed to the array
          embeds.push(cardEmbed);
        }
      }

      // Send the final response with all embeds
      try {
        console.log(`[RESPONSE] Sending ${embeds.length} embed(s) to Discord`);
        await thinkingMsg.edit({ content: null, embeds: embeds });
      } catch (editError) {
        console.error("Failed to edit message:", editError);
        // If edit fails, try deleting and sending a new message
        try {
          await thinkingMsg.delete();
          await message.channel.send({ embeds: embeds });
        } catch (fallbackError) {
          console.error("Failed to send response:", fallbackError);
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      // Clear interval if it exists
      if (loadingInterval) {
        clearInterval(loadingInterval);
        loadingInterval = null;
      }
      // Only send error message if we haven't already sent a successful response
      try {
        await thinkingMsg.edit(
          "⚠️ I couldn't find an answer for that. Please try again later."
        );
      } catch (editError) {
        console.error("Failed to edit message with error:", editError);
        // Try to delete the thinking message if edit fails
        try {
          await thinkingMsg.delete();
        } catch (deleteError) {
          console.error("Failed to delete thinking message:", deleteError);
        }
      }
    }
  }

  // !card command for Scryfall lookup (but not !cards)
  if (content.startsWith("!card") && !content.startsWith("!cards")) {
    // Parse the command to extract card name and optional set
    const { cardName, setIdentifier } = CardSetParser.parseCardCommand(content);

    if (!cardName) return message.reply("Please provide a card name.");

    try {
      let data = null;
      let isSpecificSet = false;

      // If a set was specified, try to get that specific printing
      if (setIdentifier) {
        console.log(
          `[CARD COMMAND] Looking for "${cardName}" in set "${setIdentifier}"`
        );
        data = await CardSetParser.getCardFromSet(cardName, setIdentifier);

        if (data) {
          isSpecificSet = true;
          console.log(
            `✅ Found specific printing: ${data.name} from ${data.set_name}`
          );
        } else {
          // Card not found in specified set - get available sets
          const availableSets = await CardSetParser.getCardSets(cardName);

          if (availableSets && availableSets.length > 0) {
            // Card exists but not in the specified set
            const setList = availableSets
              .slice(0, 5)
              .map((s) => `• ${s.name} (${s.code})`)
              .join("\n");

            return message.reply(
              `⚠️ **${cardName}** is not available in **${setIdentifier}**.\n\n` +
                `Available in these sets:\n${setList}` +
                (availableSets.length > 5
                  ? `\n...and ${availableSets.length - 5} more sets`
                  : "") +
                `\n\nTry: \`!card ${cardName} ${availableSets[0].code}\``
            );
          } else {
            // Card doesn't exist at all
            return message.reply(
              `⚠️ Card "${cardName}" not found. Please check the spelling.`
            );
          }
        }
      }

      // If no set specified or set search failed, use the original logic
      if (!data) {
        // Try to get the best printing (with USD price if possible)
        data = await getBestCardPrinting(cardName);

        // If no card found, try autocomplete
        if (!data) {
          const suggestions = await getCardSuggestions(cardName);

          if (suggestions.length === 0) {
            return message.reply("⚠️ No cards found matching that name.");
          }

          // If we have suggestions, show them to the user
          if (suggestions.length === 1) {
            // If only one suggestion, try getting best printing for that
            data = await getBestCardPrinting(suggestions[0]);
            if (!data) {
              return message.reply("⚠️ Failed to fetch card data.");
            }
          } else {
            // Multiple suggestions - show them to the user
            const suggestionList = suggestions
              .slice(0, 10)
              .map((s, i) => `${i + 1}. ${s}`)
              .join("\n");
            return message.reply(
              `⚠️ No exact match found for "${cardName}". Did you mean one of these?\n\`\`\`\n${suggestionList}\n\`\`\`\nTry: \`!card ${suggestions[0]}\``
            );
          }
        }
      }

      const cardImage =
        data.image_uris?.normal || data.card_faces?.[0]?.image_uris?.normal;

      // Create rich embed for card
      const embedTitle = isSpecificSet
        ? `${data.name} ${
            data.mana_cost ? convertManaCost(data.mana_cost) : ""
          } [${data.set.toUpperCase()}]`
        : `${data.name} ${
            data.mana_cost ? convertManaCost(data.mana_cost) : ""
          }`;

      const embed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setURL(data.scryfall_uri)
        .setColor(getRarityColor(data.rarity))
        .setImage(cardImage);

      // Add description with type line
      let description = `**${data.type_line}**`;
      if (data.power && data.toughness) {
        description += ` • ${data.power}/${data.toughness}`;
      } else if (data.loyalty) {
        description += ` • Loyalty: ${data.loyalty}`;
      }

      // Add collector number and rarity
      description += `\n${data.collector_number} • ${
        data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)
      }`;

      // Add oracle text
      if (data.oracle_text) {
        const formattedText = formatOracleText(data.oracle_text);
        description += `\n\n${formattedText}`;
      }

      // Add flavor text
      if (data.flavor_text) {
        description += `\n\n*${data.flavor_text}*`;
      }

      embed.setDescription(description.substring(0, 4096));

      // Add clickable links and info as fields
      embed.addFields(
        {
          name: "🔗 Links",
          value: `${
            data.purchase_uris?.tcgplayer
              ? `[**TCGPlayer**](${data.purchase_uris.tcgplayer})\n`
              : ""
          }[**Scryfall**](${data.scryfall_uri})\n[**EDHREC**](${
            data.related_uris?.edhrec ||
            `https://edhrec.com/cards/${encodeURIComponent(data.name)}`
          })`,
          inline: true,
        },
        {
          name: "💰 Price",
          value: (() => {
            let priceText = "";

            // TCGPlayer prices
            if (data.prices?.usd || data.prices?.usd_foil) {
              if (data.prices.usd) {
                priceText += `$${data.prices.usd}`;
              }
              if (data.prices.usd_foil) {
                priceText += ` • Foil: $${data.prices.usd_foil}`;
              }
            }

            return priceText || "Price N/A";
          })(),
          inline: true,
        },
        {
          name: "📦 Set",
          value: `${data.set_name}\n(${data.set.toUpperCase()})`,
          inline: true,
        }
      );

      // Add legality info
      if (data.legalities) {
        const keyFormats = [
          "standard",
          "pioneer",
          "modern",
          "legacy",
          "vintage",
          "commander",
        ];
        const legalFormats = keyFormats
          .filter((format) => data.legalities[format] === "legal")
          .map((format) => format.charAt(0).toUpperCase() + format.slice(1));

        if (legalFormats.length > 0) {
          embed.addFields({
            name: "✅ Legal in",
            value: legalFormats.join(", "),
            inline: false,
          });
        }
      }

      // Add rulings if available
      if (data.rulings_uri) {
        try {
          const rulingsRes = await fetch(data.rulings_uri);
          if (rulingsRes.ok) {
            const rulings = await rulingsRes.json();
            if (rulings.data && rulings.data.length > 0) {
              // Format each ruling with mana symbols
              const rulingText = rulings.data
                .slice(0, 2)
                .map((r) => `• ${formatOracleText(r.comment)}`)
                .join("\n");

              embed.addFields({
                name: "⚖️ Recent Rulings",
                value:
                  rulingText +
                  (rulings.data.length > 2
                    ? `\n*[+${rulings.data.length - 2} more on Scryfall](${
                        data.scryfall_uri
                      }#rulings)*`
                    : ""),
                inline: false,
              });
            }
          }
        } catch (err) {
          console.error("Failed to fetch rulings:", err);
        }
      }

      embed.setFooter({
        text: data.artist ? `Art by ${data.artist}` : "",
        iconURL: data.set_icon_svg_uri || null,
      });

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("❌ Scryfall Error:", err);
      message.reply("⚠️ Failed to fetch card data from Scryfall.");
    }
  }

  // !cards command for multiple card lookup
  if (content.startsWith("!cards")) {
    const cardNames = content.slice(6).trim();
    if (!cardNames)
      return message.reply(
        "Please provide card names separated by commas. Example: `!cards lightning bolt, counterspell, birds of paradise`"
      );

    // Parse card names (split by comma)
    const cardList = cardNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (cardList.length === 0) {
      return message.reply("Please provide at least one card name.");
    }

    if (cardList.length > 10) {
      return message.reply(
        "Maximum 10 cards at a time. Showing first 10 cards."
      );
    }

    try {
      const embeds = [];
      const errors = [];
      const cardDataList = [];

      // First, fetch all card data
      for (const cardName of cardList.slice(0, 10)) {
        try {
          // Try to get the best printing (with USD price if possible)
          let data = await getBestCardPrinting(cardName);

          if (!data) {
            // Try autocomplete for this card
            const suggestions = await getCardSuggestions(cardName);

            if (suggestions.length === 1) {
              // If only one suggestion, try getting best printing for that
              data = await getBestCardPrinting(suggestions[0]);
              if (!data) {
                errors.push(`❌ ${cardName}`);
                continue;
              }
            } else if (suggestions.length > 1) {
              errors.push(`❓ ${cardName} (did you mean: ${suggestions[0]}?)`);
              continue;
            } else {
              errors.push(`❌ ${cardName}`);
              continue;
            }
          }

          if (data) {
            cardDataList.push(data);
          }
        } catch (err) {
          console.error(`Error fetching ${cardName}:`, err);
          errors.push(`❌ ${cardName}`);
        }
      }

      if (cardDataList.length === 0) {
        return message.reply(
          "⚠️ No valid cards found. Please check the card names and try again."
        );
      }

      // Create embeds for each card with the same format as !card
      for (const data of cardDataList) {
        const cardImage =
          data.image_uris?.normal || data.card_faces?.[0]?.image_uris?.normal;

        // Create rich embed for card (exact same format as !card)
        const embed = new EmbedBuilder()
          .setTitle(
            `${data.name} ${
              data.mana_cost ? convertManaCost(data.mana_cost) : ""
            }`
          )
          .setURL(data.scryfall_uri)
          .setColor(getRarityColor(data.rarity))
          .setImage(cardImage);

        // Add description with type line
        let description = `**${data.type_line}**`;
        if (data.power && data.toughness) {
          description += ` • ${data.power}/${data.toughness}`;
        } else if (data.loyalty) {
          description += ` • Loyalty: ${data.loyalty}`;
        }

        // Add collector number and rarity
        description += `\n${data.collector_number} • ${
          data.rarity.charAt(0).toUpperCase() + data.rarity.slice(1)
        }`;

        // Add oracle text
        if (data.oracle_text) {
          const formattedText = formatOracleText(data.oracle_text);
          description += `\n\n${formattedText}`;
        }

        // Add flavor text
        if (data.flavor_text) {
          description += `\n\n*${data.flavor_text}*`;
        }

        embed.setDescription(description.substring(0, 4096));

        // Add clickable links and info as fields
        embed.addFields(
          {
            name: "🔗 Links",
            value: `${
              data.purchase_uris?.tcgplayer
                ? `[**TCGPlayer**](${data.purchase_uris.tcgplayer})\n`
                : ""
            }[**Scryfall**](${data.scryfall_uri})\n[**EDHREC**](${
              data.related_uris?.edhrec ||
              `https://edhrec.com/cards/${encodeURIComponent(data.name)}`
            })`,
            inline: true,
          },
          {
            name: "💰 Price",
            value: (() => {
              let priceText = "";

              // TCGPlayer prices
              if (data.prices?.usd || data.prices?.usd_foil) {
                if (data.prices.usd) {
                  priceText += `$${data.prices.usd}`;
                }
                if (data.prices.usd_foil) {
                  priceText += ` • Foil: $${data.prices.usd_foil}`;
                }
              }

              return priceText || "Price N/A";
            })(),
            inline: true,
          },
          {
            name: "📦 Set",
            value: `${data.set_name}\n(${data.set.toUpperCase()})`,
            inline: true,
          }
        );

        // Add legality info
        if (data.legalities) {
          const keyFormats = [
            "standard",
            "pioneer",
            "modern",
            "legacy",
            "vintage",
            "commander",
          ];
          const legalFormats = keyFormats
            .filter((format) => data.legalities[format] === "legal")
            .map((format) => format.charAt(0).toUpperCase() + format.slice(1));

          if (legalFormats.length > 0) {
            embed.addFields({
              name: "✅ Legal in",
              value: legalFormats.join(", "),
              inline: false,
            });
          }
        }

        embed.setFooter({
          text: data.artist ? `Art by ${data.artist}` : "",
          iconURL: data.set_icon_svg_uri || null,
        });

        embeds.push(embed);
      }

      // Send embeds (Discord allows up to 10 embeds per message)
      let responseMessage = { embeds: embeds };

      if (errors.length > 0) {
        responseMessage.content = `Could not find: ${errors.join(", ")}`;
      }

      await message.channel.send(responseMessage);
    } catch (err) {
      console.error("❌ Multiple Cards Error:", err);
      message.reply("⚠️ Failed to fetch card data.");
    }
  }
});

// Start bot
client.login(config.discord.token);
