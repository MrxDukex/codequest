const Parser = require("rss-parser");
const NodeCache = require("node-cache");

class RSSMonitor {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ["content:encoded", "dc:creator", "media:content"],
      },
    });
    // Cache RSS feeds for 1 hour
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

    // MTG RSS feed sources - Updated with working feeds
    this.feedSources = {
      mtgGoldfish: {
        url: "https://www.mtggoldfish.com/feed",
        name: "MTGGoldfish",
        priority: 1,
      },
      scgArticles: {
        url: "https://articles.starcitygames.com/feed/",
        name: "StarCityGames Articles",
        priority: 2,
      },
      // Note: Some feeds may be temporarily unavailable or have changed URLs
      // We'll keep trying them but handle errors gracefully
    };
  }

  /**
   * Fetch and parse an RSS feed
   * @param {string} feedUrl - The RSS feed URL
   * @returns {Promise<Object>} - Parsed feed data
   */
  async fetchFeed(feedUrl) {
    try {
      // Check cache first
      const cached = this.cache.get(feedUrl);
      if (cached) {
        return cached;
      }

      const feed = await this.parser.parseURL(feedUrl);

      // Process and structure the feed items
      const processedFeed = {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        items: feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          creator: item.creator || item["dc:creator"],
          content: item.contentSnippet || item.content,
          fullContent: item["content:encoded"] || item.content,
          categories: item.categories || [],
          guid: item.guid,
        })),
        lastBuildDate: feed.lastBuildDate,
      };

      // Cache the processed feed
      this.cache.set(feedUrl, processedFeed);

      return processedFeed;
    } catch (error) {
      console.error(`Error fetching RSS feed from ${feedUrl}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch all MTG RSS feeds
   * @returns {Promise<Array>} - All feed data
   */
  async fetchAllFeeds() {
    const feedPromises = Object.entries(this.feedSources).map(
      async ([key, source]) => {
        const feed = await this.fetchFeed(source.url);
        if (feed) {
          return {
            ...feed,
            sourceName: source.name,
            sourceKey: key,
            priority: source.priority,
          };
        }
        return null;
      }
    );

    const feeds = await Promise.all(feedPromises);
    return feeds.filter((feed) => feed !== null);
  }

  /**
   * Get the latest MTG news from all sources
   * @param {number} limit - Maximum number of items to return
   * @returns {Promise<Array>} - Latest news items sorted by date
   */
  async getLatestNews(limit = 10) {
    const feeds = await this.fetchAllFeeds();

    // Combine all items from all feeds
    let allItems = [];
    feeds.forEach((feed) => {
      if (feed && feed.items) {
        feed.items.forEach((item) => {
          allItems.push({
            ...item,
            source: feed.sourceName,
            sourcePriority: feed.priority,
          });
        });
      }
    });

    // Sort by publication date (newest first)
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB - dateA;
    });

    // Return limited number of items
    return allItems.slice(0, limit);
  }

  /**
   * Search for specific topics in RSS feeds
   * @param {string} searchTerm - The term to search for
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} - Matching news items
   */
  async searchInFeeds(searchTerm, limit = 10) {
    const feeds = await this.fetchAllFeeds();
    const searchLower = searchTerm.toLowerCase();

    let matchingItems = [];

    feeds.forEach((feed) => {
      if (feed && feed.items) {
        feed.items.forEach((item) => {
          const titleMatch = item.title?.toLowerCase().includes(searchLower);
          const contentMatch = item.content
            ?.toLowerCase()
            .includes(searchLower);
          const categoryMatch = item.categories?.some((cat) =>
            cat.toLowerCase().includes(searchLower)
          );

          if (titleMatch || contentMatch || categoryMatch) {
            matchingItems.push({
              ...item,
              source: feed.sourceName,
              sourcePriority: feed.priority,
              relevanceScore:
                (titleMatch ? 3 : 0) +
                (contentMatch ? 1 : 0) +
                (categoryMatch ? 2 : 0),
            });
          }
        });
      }
    });

    // Sort by relevance and date
    matchingItems.sort((a, b) => {
      // First by relevance score
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Then by date
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB - dateA;
    });

    return matchingItems.slice(0, limit);
  }

  /**
   * Get news about upcoming sets and releases
   * @returns {Promise<Array>} - News about upcoming releases
   */
  async getUpcomingReleases() {
    const releaseKeywords = [
      "release",
      "preview",
      "spoiler",
      "announcement",
      "coming soon",
      "prerelease",
      "launch",
      "available",
      "set review",
      "first look",
    ];

    let releaseNews = [];
    const feeds = await this.fetchAllFeeds();

    feeds.forEach((feed) => {
      if (feed && feed.items) {
        feed.items.forEach((item) => {
          const hasReleaseKeyword = releaseKeywords.some((keyword) => {
            const titleHas = item.title?.toLowerCase().includes(keyword);
            const contentHas = item.content?.toLowerCase().includes(keyword);
            return titleHas || contentHas;
          });

          if (hasReleaseKeyword) {
            releaseNews.push({
              ...item,
              source: feed.sourceName,
              type: "release",
            });
          }
        });
      }
    });

    // Sort by date
    releaseNews.sort((a, b) => {
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB - dateA;
    });

    return releaseNews.slice(0, 20);
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

module.exports = RSSMonitor;
