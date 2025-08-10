import axios from "axios";

async function checkPurchaseUrls() {
  try {
    // Test with The Ur-Dragon
    const response = await axios.get(
      "https://api.scryfall.com/cards/named?exact=the+ur-dragon"
    );
    const data = response.data;

    console.log("Card:", data.name);
    console.log("\nAvailable purchase URLs:");
    console.log("purchase_uris:", JSON.stringify(data.purchase_uris, null, 2));

    console.log("\nChecking specific URLs:");
    console.log("TCGPlayer:", data.purchase_uris?.tcgplayer || "NOT AVAILABLE");
    console.log(
      "Card Kingdom:",
      data.purchase_uris?.cardkingdom || "NOT AVAILABLE"
    );
    console.log(
      "CardMarket:",
      data.purchase_uris?.cardmarket || "NOT AVAILABLE"
    );

    // Also check what other URLs might be available
    console.log("\nAll available keys in purchase_uris:");
    if (data.purchase_uris) {
      console.log(Object.keys(data.purchase_uris));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkPurchaseUrls();
