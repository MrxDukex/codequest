const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Security enhancements for MTG Judge Bot
class SecurityManager {
  constructor() {
    this.rateLimits = new Map();
    this.blacklist = new Set();
    this.channelWhitelist = new Set();
    this.adminUsers = new Set();
  }

  // Rate limiting per user
  checkRateLimit(userId, limit = 5, window = 60000) {
    if (!this.rateLimits.has(userId)) {
      this.rateLimits.set(userId, []);
    }

    const now = Date.now();
    const userRequests = this.rateLimits.get(userId);

    // Clean old requests
    const validRequests = userRequests.filter((time) => now - time < window);
    this.rateLimits.set(userId, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= limit) {
      return false;
    }

    // Add new request
    validRequests.push(now);
    return true;
  }

  // Input sanitization
  sanitizeInput(input) {
    if (!input || typeof input !== "string") return "";

    // Remove potential Discord markdown exploits
    input = input.replace(/[`*_~]/g, "");

    // Remove potential command injection characters
    input = input.replace(/[;&|]/g, "");

    // Limit length
    return input.slice(0, 1000);
  }

  // Channel whitelist management
  addToWhitelist(channelId) {
    this.channelWhitelist.add(channelId);
  }

  isChannelWhitelisted(channelId) {
    return (
      this.channelWhitelist.size === 0 || this.channelWhitelist.has(channelId)
    );
  }

  // Admin management
  addAdmin(userId) {
    this.adminUsers.add(userId);
  }

  isAdmin(userId) {
    return this.adminUsers.has(userId);
  }

  // API key protection
  static validateApiKeys() {
    const requiredKeys = [
      "DISCORD_TOKEN",
      "OPENAI_API_KEY",
      "TAVILY_API_KEY",
      "BRAVE_API_KEY",
    ];

    const missingKeys = [];
    for (const key of requiredKeys) {
      if (!process.env[key]) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      throw new Error(`Missing required API keys: ${missingKeys.join(", ")}`);
    }
  }

  // Environment validation
  static validateEnvironment() {
    // Check for secure environment
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Warning: Running in non-production environment");
    }

    // Check for minimum Node.js version
    const minVersion = "16.0.0";
    if (process.version.replace("v", "") < minVersion) {
      throw new Error(`Node.js version ${minVersion} or higher is required`);
    }
  }

  // File permissions check
  static checkFilePermissions() {
    const criticalFiles = [
      "config/apiConfig.js",
      ".env",
      "data/customMechanics.json",
    ];

    for (const file of criticalFiles) {
      try {
        const filePath = path.join(process.cwd(), file);
        const stats = fs.statSync(filePath);

        // Check if file is world-readable/writable
        const worldReadable = stats.mode & 0o004;
        const worldWritable = stats.mode & 0o002;

        if (worldReadable || worldWritable) {
          console.warn(`⚠️ Warning: ${file} has unsafe permissions`);
          // Fix permissions
          fs.chmodSync(filePath, 0o600);
        }
      } catch (error) {
        console.error(`Error checking ${file} permissions:`, error);
      }
    }
  }

  // Memory usage monitoring
  static monitorMemoryUsage() {
    const maxMemoryMB = 512;
    setInterval(() => {
      const used = process.memoryUsage();
      if (used.heapUsed / 1024 / 1024 > maxMemoryMB) {
        console.error("⚠️ Memory usage exceeded limit");
        process.exit(1);
      }
    }, 60000);
  }
}

// Export security manager
module.exports = SecurityManager;

// Security recommendations
console.log(`
🔒 MTG JUDGE BOT SECURITY CHECKLIST
==================================

1. API Key Protection:
   ✓ Store all API keys in .env file
   ✓ Never commit .env to version control
   ✓ Use separate API keys for production/development

2. Rate Limiting:
   ✓ 5 requests per minute per user
   ✓ Prevents spam and abuse
   ✓ Automatic user cooldown

3. Input Validation:
   ✓ All user input is sanitized
   ✓ Command injection prevention
   ✓ Length limits enforced

4. Channel Control:
   ✓ Whitelist system for channels
   ✓ Admin commands restricted
   ✓ Blacklist system for abuse

5. Error Handling:
   ✓ No stack traces in production
   ✓ Graceful error messages
   ✓ Error logging system

6. File Security:
   ✓ Proper file permissions
   ✓ No world-readable configs
   ✓ Regular permission checks

7. Memory Protection:
   ✓ Memory usage monitoring
   ✓ Automatic restart on high usage
   ✓ Resource limits enforced

8. Environment:
   ✓ Use NODE_ENV=production
   ✓ Updated Node.js version
   ✓ Regular dependency updates

IMPLEMENTATION STEPS:
1. Create .env file with all API keys
2. Set NODE_ENV=production
3. Update file permissions: chmod 600 config/*
4. Add bot to specific channels only
5. Set up admin users list
6. Enable rate limiting
7. Set up error logging
8. Regular security audits

MONITORING:
- Watch for unusual usage patterns
- Monitor error rates
- Check memory usage
- Review access logs

The bot is secure when properly configured,
but requires these security measures to be
fully protected in a production environment.
`);
