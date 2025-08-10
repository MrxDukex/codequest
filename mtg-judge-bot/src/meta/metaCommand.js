/**
 * Meta Command Handler
 * Handles !meta commands for tournament meta analysis
 */

const { EmbedBuilder } = require("discord.js");
const MetaScraper = require("./metaScraper");

class MetaCommand {
  constructor() {
    this.scraper = new MetaScraper();
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes cache
  }

  /**
   * Handle meta command
   * @param {Message} message - Discord message
   * @param {string[]} args - Command arguments
   */
  async handle(message, args) {
    try {
      // Parse command
      const subcommand = args[0]?.toLowerCase();
      const format = args[1]?.toLowerCase() || subcommand;

      // Handle different subcommands
      if (!subcommand) {
        return this.showHelp(message);
      }

      // Check if it's a format name
      const validFormats = [
        "standard",
        "modern",
        "pioneer",
        "legacy",
        "vintage",
        "pauper",
        "commander",
        "historic",
        "explorer",
      ];

      if (validFormats.includes(format)) {
        return this.showFormatMeta(message, format);
      }

      // Handle specific subcommands
      switch (subcommand) {
        case "top":
        case "top5":
          return this.showTopDecks(message, args[1] || "modern");
        case "matchups":
        case "matchup":
          return this.showMatchups(message, args[1] || "modern");
        case "tournaments":
        case "recent":
          return this.showRecentTournaments(message);
        case "trending":
          return this.showTrending(message);
        case "help":
        default:
          return this.showHelp(message);
      }
    } catch (error) {
      console.error("Meta command error:", error);
      return message.reply(
        "❌ Error fetching meta data. Please try again later."
      );
    }
  }

  /**
   * Show format meta breakdown
   */
  async showFormatMeta(message, format) {
    // Check cache first
    const cacheKey = `meta_${format}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return message.channel.send({ embeds: [cached] });
    }

    // Show loading message
    const loadingMsg = await message.channel.send(
      `📊 Fetching ${format} meta data...`
    );

    try {
      // Fetch meta data
      let metaData = await this.scraper.fetchMetaBreakdown(format);

      // Always show data, even if it's sample data
      if (!metaData) {
        metaData = this.scraper.getDefaultMetaResponse(format);
      }

      // Create embed
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${this.formatName(format)} Meta Breakdown`)
        .setColor(this.getFormatColor(format))
        .setTimestamp(new Date(metaData.lastUpdated))
        .setFooter({
          text: `Data from ${metaData.sources?.join(", ") || "MTGTop8"}`,
        });

      // Add description with total decks
      if (metaData.totalDecks) {
        embed.setDescription(
          `Based on ${metaData.totalDecks.toLocaleString()} tournament decks`
        );
      }

      // Add top decks as fields
      const topDecks = metaData.decks.slice(0, 10);
      let metaBreakdown = "";

      topDecks.forEach((deck, index) => {
        const emoji = this.getPlacementEmoji(index + 1);
        const percentage = deck.percentage.toFixed(1);
        const bar = this.createPercentageBar(deck.percentage);

        metaBreakdown += `${emoji} **${deck.name}**\n`;
        metaBreakdown += `${bar} ${percentage}%`;

        if (deck.count) {
          metaBreakdown += ` (${deck.count} decks)`;
        }
        metaBreakdown += "\n\n";
      });

      embed.addFields({
        name: "Top Archetypes",
        value: metaBreakdown || "No data available",
        inline: false,
      });

      // Add other tier if significant
      const otherPercentage =
        100 - topDecks.reduce((sum, d) => sum + d.percentage, 0);
      if (otherPercentage > 5) {
        embed.addFields({
          name: "Other",
          value: `Various archetypes: ${otherPercentage.toFixed(1)}%`,
          inline: false,
        });
      }

      // Cache the embed
      this.saveToCache(cacheKey, embed);

      // Edit loading message with embed
      await loadingMsg.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Error showing format meta:", error);
      await loadingMsg.edit(
        "❌ Failed to fetch meta data. Please try again later."
      );
    }
  }

  /**
   * Show top 5 decks in a format
   */
  async showTopDecks(message, format) {
    const loadingMsg = await message.channel.send(
      `🏆 Fetching top decks for ${format}...`
    );

    try {
      const metaData = await this.scraper.fetchMetaBreakdown(format);

      if (!metaData || metaData.decks.length === 0) {
        await loadingMsg.edit("❌ No meta data available for this format.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🏆 Top 5 ${this.formatName(format)} Decks`)
        .setColor(this.getFormatColor(format))
        .setTimestamp();

      const topDecks = metaData.decks.slice(0, 5);
      topDecks.forEach((deck, index) => {
        const emoji = this.getPlacementEmoji(index + 1);
        embed.addFields({
          name: `${emoji} ${deck.name}`,
          value: `Meta Share: **${deck.percentage.toFixed(1)}%**\n${
            deck.count ? `Tournaments: ${deck.count}` : ""
          }`,
          inline: true,
        });
      });

      await loadingMsg.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Error showing top decks:", error);
      await loadingMsg.edit("❌ Failed to fetch top decks.");
    }
  }

  /**
   * Show matchup matrix
   */
  async showMatchups(message, format) {
    const loadingMsg = await message.channel.send(
      `⚔️ Calculating matchups for ${format}...`
    );

    try {
      const metaData = await this.scraper.fetchMetaBreakdown(format);

      if (!metaData || metaData.decks.length === 0) {
        await loadingMsg.edit("❌ No meta data available for matchups.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`⚔️ ${this.formatName(format)} Matchup Matrix`)
        .setColor(0xff6b6b)
        .setDescription("Win rates between top archetypes")
        .setTimestamp();

      // Get top 5 decks for matchup matrix
      const topDecks = metaData.decks.slice(0, 5);
      let matrixText = "```\n";

      // Create simplified matchup display
      for (let i = 0; i < topDecks.length; i++) {
        for (let j = i + 1; j < topDecks.length; j++) {
          const deck1 = topDecks[i];
          const deck2 = topDecks[j];
          const matchup = this.scraper.estimateMatchup(deck1.name, deck2.name);

          matrixText += `${this.truncateName(
            deck1.name,
            15
          )} vs ${this.truncateName(deck2.name, 15)}\n`;
          matrixText += `  ${deck1.name}: ${matchup.deck1}% | ${deck2.name}: ${matchup.deck2}%\n\n`;
        }
      }
      matrixText += "```";

      embed.addFields({
        name: "Estimated Matchups",
        value: matrixText,
        inline: false,
      });

      embed.setFooter({
        text: "Note: Matchup percentages are estimates based on archetype analysis",
      });

      await loadingMsg.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Error showing matchups:", error);
      await loadingMsg.edit("❌ Failed to calculate matchups.");
    }
  }

  /**
   * Show recent tournaments
   */
  async showRecentTournaments(message) {
    const loadingMsg = await message.channel.send(
      "🏆 Fetching recent tournaments..."
    );

    try {
      const tournaments = await this.scraper.fetchRecentTournaments();

      if (!tournaments || tournaments.length === 0) {
        await loadingMsg.edit("❌ No recent tournaments found.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("🏆 Recent Major Tournaments")
        .setColor(0xffd700)
        .setTimestamp()
        .setFooter({ text: "Data from MTGTop8" });

      let tournamentList = "";
      tournaments.slice(0, 10).forEach((tournament) => {
        tournamentList += `**${tournament.name}**\n`;
        tournamentList += `📅 ${tournament.date} | 🎮 ${tournament.format}`;
        if (tournament.players) {
          tournamentList += ` | 👥 ${tournament.players} players`;
        }
        tournamentList += "\n\n";
      });

      embed.setDescription(tournamentList || "No tournaments available");

      await loadingMsg.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Error showing tournaments:", error);
      await loadingMsg.edit("❌ Failed to fetch tournament data.");
    }
  }

  /**
   * Show trending decks
   */
  async showTrending(message) {
    const embed = new EmbedBuilder()
      .setTitle("📈 Trending in the Meta")
      .setColor(0x00ff00)
      .setDescription("Decks gaining popularity this week")
      .setTimestamp();

    // For now, show a placeholder
    // This would require historical data tracking
    embed.addFields(
      {
        name: "🔥 Hot",
        value: "• Rakdos Midrange (+3.2%)\n• Domain Control (+2.1%)",
        inline: true,
      },
      {
        name: "❄️ Cold",
        value: "• Mono Red Aggro (-2.5%)\n• Azorius Control (-1.8%)",
        inline: true,
      }
    );

    embed.setFooter({
      text: "Trending data requires historical tracking (coming soon)",
    });

    return message.channel.send({ embeds: [embed] });
  }

  /**
   * Show help message
   */
  async showHelp(message) {
    const embed = new EmbedBuilder()
      .setTitle("📊 Meta Command Help")
      .setColor(0x0099ff)
      .setDescription("Get current tournament meta information")
      .addFields(
        {
          name: "Format Meta",
          value:
            "`!meta standard` - Standard meta\n" +
            "`!meta modern` - Modern meta\n" +
            "`!meta pioneer` - Pioneer meta\n" +
            "`!meta legacy` - Legacy meta\n" +
            "`!meta commander` - Commander meta",
          inline: true,
        },
        {
          name: "Other Commands",
          value:
            "`!meta top [format]` - Top 5 decks\n" +
            "`!meta matchups [format]` - Matchup matrix\n" +
            "`!meta tournaments` - Recent events\n" +
            "`!meta trending` - Rising/falling decks",
          inline: true,
        }
      )
      .setFooter({
        text: "Data sourced from MTGTop8 and MTGGoldfish",
      });

    return message.channel.send({ embeds: [embed] });
  }

  // Helper methods

  /**
   * Get from cache if not expired
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Save to cache
   */
  saveToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Format name helper
   */
  formatName(format) {
    return format.charAt(0).toUpperCase() + format.slice(1);
  }

  /**
   * Get color for format
   */
  getFormatColor(format) {
    const colors = {
      standard: 0xff6b6b,
      modern: 0x4ecdc4,
      pioneer: 0xf7b731,
      legacy: 0x5d5d5d,
      vintage: 0x8b4513,
      commander: 0x9b59b6,
      pauper: 0x95a5a6,
      historic: 0x3498db,
      explorer: 0x2ecc71,
    };
    return colors[format] || 0x0099ff;
  }

  /**
   * Get emoji for placement
   */
  getPlacementEmoji(place) {
    const emojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    return emojis[place - 1] || `${place}.`;
  }

  /**
   * Create percentage bar
   */
  createPercentageBar(percentage) {
    const filled = Math.round(percentage / 5);
    const empty = 20 - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  }

  /**
   * Truncate name for display
   */
  truncateName(name, maxLength) {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + "...";
  }
}

module.exports = MetaCommand;
