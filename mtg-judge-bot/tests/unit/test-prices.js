// Test pricing data from Scryfall - check all printings
async function testPrices() {
  const cards = ["black lotus", "mox sapphire"];

  for (const card of cards) {
    try {
      // First try the exact endpoint
      console.log(`\nTrying exact search for "${card}"...`);
      const exactRes = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(card)}`
      );
      const exactData = await exactRes.json();
      console.log(
        `Default result: ${exactData.set_name} (${exactData.set}) - USD: ${
          exactData.prices?.usd || "null"
        }`
      );

      // Then search for all printings of the card
      const searchRes = await fetch(
        `https://api.scryfall.com/cards/search?q=!"${encodeURIComponent(
          card
        )}" -is:digital&order=released&dir=asc`
      );
      const searchData = await searchRes.json();

      console.log(`\n=== ${card.toUpperCase()} ===`);
      console.log(`Total printings found: ${searchData.total_cards}`);

      // Check prices for each printing
      let foundWithPrice = false;
      for (const printing of searchData.data) {
        if (printing.prices?.usd || printing.prices?.usd_foil) {
          console.log(`\n✓ ${printing.set_name} (${printing.set}):`);
          console.log(`  USD: $${printing.prices.usd || "N/A"}`);
          console.log(`  USD Foil: $${printing.prices.usd_foil || "N/A"}`);
          console.log(`  Released: ${printing.released_at}`);
          console.log(`  Collector #: ${printing.collector_number}`);
          foundWithPrice = true;
        }
      }

      if (!foundWithPrice) {
        console.log("No printings found with USD prices!");

        // Show what we did find
        console.log("\nAll printings:");
        for (const printing of searchData.data.slice(0, 5)) {
          console.log(
            `- ${printing.set_name} (${printing.set}): ${
              printing.prices?.usd ? "$" + printing.prices.usd : "No USD price"
            }`
          );
        }
      }
    } catch (error) {
      console.error(`Error with ${card}:`, error.message);
    }
  }
}

testPrices();
