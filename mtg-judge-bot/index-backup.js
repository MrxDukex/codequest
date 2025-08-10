const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { OpenAI } = require("openai");
const config = require("./config");
const { searchMTGRulesUpdates } = require("./src/webSearch");
const rulesManager = require("./src/rulesManager");
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
  const content = message.content.trim();

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

      // Process each card reference
      for (const cardRef of parsedData.cards) {
        try {
          let cardData = null;

          // If a set is specified, try to get that specific printing
          if (cardRef.set) {
            cardData = await CardSetParser.getCardFromSet(
              cardRef.cleanName,
              cardRef.set
            );
          }

          // If no set specified or set search failed, get best printing
          if (!cardData) {
            cardData = await getBestCardPrinting(cardRef.cleanName);
          }

          if (cardData) {
            console.log(`[INLINE CARDS] Found card: ${cardData.name}`);

            // Create full embed for the card (same format as !card command)
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

            // Build description
            let description = `**${cardData.type_line}**`;
            if (cardData.power && cardData.toughness) {
              description += ` • ${cardData.power}/${cardData.toughness}`;
            } else if (cardData.loyalty) {
              description += ` • Loyalty: ${cardData.loyalty}`;
            }

            description += `\n${cardData.collector_number} • ${
              cardData.rarity.charAt(0).toUpperCase() + cardData.rarity.slice(1)
            }`;

            // Add oracle text
            if (cardData.oracle_text) {
              const formattedText = formatOracleText(cardData.oracle_text);
              description += `\n\n${formattedText}`;
            }

            // Add flavor text
            if (cardData.flavor_text) {
              description += `\n\n*${cardData.flavor_text}*`;
            }

            embed.setDescription(description.substring(0, 4096));

            // Add fields
            embed.addFields(
              {
                name: "🔗 Links",
                value: `${
                  cardData.purchase_uris?.tcgplayer
                    ? `[**TCGPlayer**](${cardData.purchase_uris.tcgplayer})\n`
                    : ""
                }[**Scryfall**](${cardData.scryfall_uri})\n[**EDHREC**](${
                  cardData.related_uris?.edhrec ||
                  `https://edhrec.com/cards/${encodeURIComponent(
                    cardData.name
                  )}`
                })`,
                inline: true,
              },
              {
                name: "💰 Price",
                value: (() => {
                  let priceText = "";
                  if (cardData.prices?.usd || cardData.prices?.usd_foil) {
                    if (cardData.prices.usd) {
                      priceText += `$${cardData.prices.usd}`;
                    }
                    if (cardData.prices.usd_foil) {
                      priceText += ` • Foil: $${cardData.prices.usd_foil}`;
                    }
                  }
                  return priceText || "Price N/A";
                })(),
                inline: true,
              },
              {
                name: "📦 Set",
                value: `${cardData.set_name}\n(${cardData.set.toUpperCase()})`,
                inline: true,
              }
            );

            // Add legality info
            if (cardData.legalities) {
              const keyFormats = [
                "standard",
                "pioneer",
                "modern",
                "legacy",
                "vintage",
                "commander",
              ];
              const legalFormats = keyFormats
                .filter((format) => cardData.legalities[format] === "legal")
                .map(
                  (format) => format.charAt(0).toUpperCase() + format.slice(1)
                );

              if (legalFormats.length > 0) {
                embed.addFields({
                  name: "✅ Legal in",
                  value: legalFormats.join(", "),
                  inline: false,
                });
              }
            }

            // Add rulings if available
            if (cardData.rulings_uri) {
              try {
                const rulingsRes = await fetch(cardData.rulings_uri);
                if (rulingsRes.ok) {
                  const rulings = await rulingsRes.json();
                  if (rulings.data && rulings.data.length > 0) {
                    const rulingText = rulings.data
                      .slice(0, 2)
                      .map((r) => `• ${formatOracleText(r.comment)}`)
                      .join("\n");

                    embed.addFields({
                      name: "⚖️ Recent Rulings",
                      value:
                        rulingText +
                        (rulings.data.length > 2
                          ? `\n*[+${
                              rulings.data.length - 2
                            } more on Scryfall](${
                              cardData.scryfall_uri
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
              text: cardData.artist ? `Art by ${cardData.artist}` : "",
              iconURL: cardData.set_icon_svg_uri || null,
            });

            embeds.push(embed);
          } else {
            console.log(`[INLINE CARDS] Card not found: ${cardRef.cleanName}`);

            // Try to get suggestions
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

      // Send the response
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

    // Don't process as a command if we found inline cards
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
        desc: "Get Magic: The Gathering rules clarifications powered by GPT-4/GPT-3.5.",
      },
      {
        cmd: "!card [card name]",
        desc: "Look up card information from Scryfall, including oracle text and images.",
      },
      {
        cmd: "!cards [names]",
        desc: "Look up multiple cards (comma-separated names). Max 10 cards.",
      },
      {
        cmd: "!meta [format]",
        desc: "Get current tournament meta breakdown for any format.",
      },
      {
        cmd: "!updaterules",
        desc: "Manually update/download the latest comprehensive rules from Wizards of the Coast.",
      },
      {
        cmd: "!rulestatus",
        desc: "Check the status and last update time of the comprehensive rules.",
      },
      {
        cmd: "[[card name]]",
        desc: "Inline card lookup - shows card details when you write [[Lightning Bolt]].",
      },
    ];
    let reply = "**Available Commands:**\n\n";
    for (const c of commandsList) {
      reply += `${c.cmd} — ${c.desc}\n`;
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
      let keywordData = null;
      let interactionData = null;
      let complexRuleData = null;

      // PRIORITY 1: Check for COMPLEX RULES first (most specific and accurate)
      console.log(
        "[COMPLEX RULES CHECK] Checking for complex rules topic:",
        question
      );
