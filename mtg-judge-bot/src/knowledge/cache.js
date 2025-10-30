const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs").promises;

class KnowledgeCache {
  constructor(dbPath = null) {
    this.dbPath = dbPath || path.join(__dirname, "../../data/cache.db");
    this.db = null;
  }

  /**
   * Initialize the database and create tables if needed
   */
  async initialize() {
    // Ensure data directory exists
    const dir = path.dirname(this.dbPath);
    await fs.mkdir(dir, { recursive: true });

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create tables if they don't exist
        this.db.serialize(() => {
          // Search results cache
          this.db.run(`
            CREATE TABLE IF NOT EXISTS search_cache (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              query TEXT NOT NULL,
              result TEXT NOT NULL,
              sources TEXT,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              expiry DATETIME,
              UNIQUE(query)
            )
          `);

          // Upcoming sets information
          this.db.run(`
            CREATE TABLE IF NOT EXISTS upcoming_sets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              set_name TEXT NOT NULL UNIQUE,
              release_date TEXT,
              prerelease_date TEXT,
              products TEXT,
              mechanics TEXT,
              themes TEXT,
              description TEXT,
              last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);

          // Spoiled cards cache
          this.db.run(`
            CREATE TABLE IF NOT EXISTS spoiled_cards (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              card_name TEXT NOT NULL,
              set_name TEXT,
              mana_cost TEXT,
              type_line TEXT,
              oracle_text TEXT,
              power TEXT,
              toughness TEXT,
              rarity TEXT,
              spoiled_date DATETIME,
              image_url TEXT,
              last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(card_name, set_name)
            )
          `);

          // News and announcements
          this.db.run(`
            CREATE TABLE IF NOT EXISTS news_cache (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              content TEXT,
              url TEXT,
              source TEXT,
              category TEXT,
              pub_date DATETIME,
              cached_date DATETIME DEFAULT CURRENT_TIMESTAMP,
              UNIQUE(url)
            )
          `);

          // Create indexes for better performance
          this.db.run(
            "CREATE INDEX IF NOT EXISTS idx_search_query ON search_cache(query)"
          );
          this.db.run(
            "CREATE INDEX IF NOT EXISTS idx_search_expiry ON search_cache(expiry)"
          );
          this.db.run(
            "CREATE INDEX IF NOT EXISTS idx_news_category ON news_cache(category)"
          );
          this.db.run(
            "CREATE INDEX IF NOT EXISTS idx_news_date ON news_cache(pub_date)"
          );

          resolve();
        });
      });
    });
  }

  /**
   * Cache a search result
   * @param {string} query - The search query
   * @param {Object} result - The search result
   * @param {number} ttl - Time to live in seconds (default 24 hours)
   */
  async cacheSearchResult(query, result, ttl = 86400) {
    const expiryDate = new Date(Date.now() + ttl * 1000).toISOString();
    const resultJson = JSON.stringify(result);
    const sources = result.sources ? result.sources.join(",") : "";

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO search_cache (query, result, sources, expiry) 
         VALUES (?, ?, ?, ?)`,
        [query, resultJson, sources, expiryDate],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get cached search result
   * @param {string} query - The search query
   * @returns {Promise<Object|null>} - Cached result or null if expired/not found
   */
  async getCachedSearch(query) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT result, expiry FROM search_cache 
         WHERE query = ? AND expiry > datetime('now')`,
        [query],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(JSON.parse(row.result));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Store information about an upcoming set
   * @param {Object} setInfo - Set information
   */
  async storeUpcomingSet(setInfo) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO upcoming_sets 
         (set_name, release_date, prerelease_date, products, mechanics, themes, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          setInfo.setName,
          setInfo.releaseDate,
          setInfo.prereleaseDate,
          JSON.stringify(setInfo.products || []),
          JSON.stringify(setInfo.mechanics || []),
          JSON.stringify(setInfo.themes || []),
          setInfo.description,
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get information about an upcoming set
   * @param {string} setName - The set name
   * @returns {Promise<Object|null>} - Set information or null
   */
  async getUpcomingSet(setName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM upcoming_sets WHERE set_name LIKE ?`,
        [`%${setName}%`],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve({
              ...row,
              products: JSON.parse(row.products || "[]"),
              mechanics: JSON.parse(row.mechanics || "[]"),
              themes: JSON.parse(row.themes || "[]"),
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Store a spoiled card
   * @param {Object} cardInfo - Card information
   */
  async storeSpoiledCard(cardInfo) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO spoiled_cards 
         (card_name, set_name, mana_cost, type_line, oracle_text, power, toughness, rarity, spoiled_date, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cardInfo.name,
          cardInfo.setName,
          cardInfo.manaCost,
          cardInfo.typeLine,
          cardInfo.oracleText,
          cardInfo.power,
          cardInfo.toughness,
          cardInfo.rarity,
          cardInfo.spoiledDate || new Date().toISOString(),
          cardInfo.imageUrl,
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get spoiled cards for a set
   * @param {string} setName - The set name
   * @returns {Promise<Array>} - Array of spoiled cards
   */
  async getSpoiledCards(setName) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM spoiled_cards WHERE set_name LIKE ? ORDER BY spoiled_date DESC`,
        [`%${setName}%`],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  /**
   * Cache news item
   * @param {Object} newsItem - News item to cache
   */
  async cacheNews(newsItem) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR IGNORE INTO news_cache 
         (title, content, url, source, category, pub_date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newsItem.title,
          newsItem.content,
          newsItem.url,
          newsItem.source,
          newsItem.category,
          newsItem.pubDate || new Date().toISOString(),
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  /**
   * Get recent news by category
   * @param {string} category - News category (e.g., 'announcement', 'spoiler')
   * @param {number} limit - Number of items to return
   * @returns {Promise<Array>} - Array of news items
   */
  async getNewsByCategory(category, limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM news_cache 
         WHERE category = ? 
         ORDER BY pub_date DESC 
         LIMIT ?`,
        [category, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpired() {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM search_cache WHERE expiry < datetime('now')`,
        (err) => {
          if (err) reject(err);
          else {
            // Also clean up old news (older than 30 days)
            this.db.run(
              `DELETE FROM news_cache 
               WHERE cached_date < datetime('now', '-30 days')`,
              (err2) => {
                if (err2) reject(err2);
                else resolve();
              }
            );
          }
        }
      );
    });
  }

  /**
   * Get cache statistics
   * @returns {Promise<Object>} - Cache statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const stats = {};

      this.db.serialize(() => {
        this.db.get(
          "SELECT COUNT(*) as count FROM search_cache WHERE expiry > datetime('now')",
          (err, row) => {
            if (err) reject(err);
            stats.activeSearches = row.count;
          }
        );

        this.db.get(
          "SELECT COUNT(*) as count FROM upcoming_sets",
          (err, row) => {
            if (err) reject(err);
            stats.upcomingSets = row.count;
          }
        );

        this.db.get(
          "SELECT COUNT(*) as count FROM spoiled_cards",
          (err, row) => {
            if (err) reject(err);
            stats.spoiledCards = row.count;
          }
        );

        this.db.get("SELECT COUNT(*) as count FROM news_cache", (err, row) => {
          if (err) reject(err);
          stats.newsItems = row.count;
          resolve(stats);
        });
      });
    });
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = KnowledgeCache;
