const config = require("./config");

console.log("Current Scryfall base URL:");
console.log(config.scryfall.baseUrl);
console.log("\nExpected: https://api.scryfall.com/cards/named?exact=");
console.log(
  "Is correct:",
  config.scryfall.baseUrl === "https://api.scryfall.com/cards/named?exact="
);
