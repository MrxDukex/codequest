const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config");

// Test client to monitor bot responses
const testClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let responseCount = {};
let responseContent = {};

console.log("🔍 MTG Judge Bot Issue Detector");
console.log("================================\n");

testClient.once("ready", () => {
  console.log(`✅ Test monitor connected as ${testClient.user.tag}`);
  console.log(
    "📊 Monitoring for multiple responses and incorrect answers...\n"
  );
});

testClient.on("messageCreate", async (message) => {
  // Skip bot messages that aren't from our Judge bot
  if (!message.author.bot) return;
  if (!message.author.username.toLowerCase().includes("judge")) return;

  const key = `${message.channel.id}-${Date.now()}`;

  // Track response counts per channel
  const channelId = message.channel.id;
  if (!responseCount[channelId]) {
    responseCount[channelId] = { count: 0, messages: [] };
  }

  responseCount[channelId].count++;
  responseCount[channelId].messages.push({
    time: new Date().toISOString(),
    content: message.content?.substring(0, 100) || "[Embed]",
    embeds: message.embeds.length,
  });

  // Check for multiple responses in quick succession
  if (responseCount[channelId].count > 1) {
    console.log(`⚠️ MULTIPLE RESPONSES DETECTED in channel ${channelId}`);
    console.log(
      `   Response #${
        responseCount[channelId].count
      } at ${new Date().toISOString()}`
    );
    console.log(
      `   Content: ${message.content?.substring(0, 50) || "[Embed response]"}`
    );
    console.log(`   Embeds: ${message.embeds.length}`);
  }

  // Reset counter after 5 seconds
  setTimeout(() => {
    if (responseCount[channelId] && responseCount[channelId].count > 1) {
      console.log(`\n📊 SUMMARY for channel ${channelId}:`);
      console.log(`   Total responses: ${responseCount[channelId].count}`);
      console.log(`   Messages:`, responseCount[channelId].messages);
    }
    responseCount[channelId] = { count: 0, messages: [] };
  }, 5000);
});

testClient.on("messageUpdate", async (oldMessage, newMessage) => {
  // Track message edits from the bot
  if (!newMessage.author.bot) return;
  if (!newMessage.author.username.toLowerCase().includes("judge")) return;

  console.log(`📝 Message EDITED in channel ${newMessage.channel.id}`);
  console.log(`   Old: ${oldMessage.content?.substring(0, 50) || "[Embed]"}`);
  console.log(`   New: ${newMessage.content?.substring(0, 50) || "[Embed]"}`);
});

// Login with test client
testClient.login(config.discord.token).catch((err) => {
  console.error("Failed to start test monitor:", err);
});

// Keep the process running
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down test monitor...");
  testClient.destroy();
  process.exit(0);
});
