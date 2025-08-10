// Using global fetch (Node 18+)

async function testCardSearch() {
  const cards = ["sol ring", "black lotus", "mox sapphire"];

  for (const card of cards) {
    console.log(`\nTesting: "${card}"`);

    // Try exact match
    try {
      const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
        card
      )}`;
      console.log(`Exact URL: ${exactUrl}`);
      const exactRes = await fetch(exactUrl);
      console.log(`Exact match status: ${exactRes.status}`);

      if (!exactRes.ok) {
        // Try fuzzy match
        const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
          card
        )}`;
        console.log(`Fuzzy URL: ${fuzzyUrl}`);
        const fuzzyRes = await fetch(fuzzyUrl);
        console.log(`Fuzzy match status: ${fuzzyRes.status}`);

        if (fuzzyRes.ok) {
          const data = await fuzzyRes.json();
          console.log(`Found via fuzzy: ${data.name}`);
        }
      } else {
        const data = await exactRes.json();
        console.log(`Found via exact: ${data.name}`);
      }

      // Also test autocomplete
      const autocompleteUrl = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(
        card
      )}`;
      console.log(`Autocomplete URL: ${autocompleteUrl}`);
      const autocompleteRes = await fetch(autocompleteUrl);
      const suggestions = await autocompleteRes.json();
      console.log(
        `Autocomplete suggestions: ${JSON.stringify(suggestions.data)}`
      );
    } catch (error) {
      console.error(`Error with ${card}:`, error.message);
    }
  }
}

testCardSearch();
