import axios from "axios";

async function testScryfallAPI() {
  try {
    const response = await axios.get(
      "https://api.scryfall.com/cards/named?exact=lightning+bolt"
    );
    const data = response.data;

    console.log("Available fields:");
    console.log("purchase_uris:", data.purchase_uris);
    console.log("related_uris:", data.related_uris);

    // Log all top-level keys
    console.log("\nAll fields:", Object.keys(data));
  } catch (error) {
    console.error("Error:", error);
  }
}

testScryfallAPI();
