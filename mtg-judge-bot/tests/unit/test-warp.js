// Test searching for warp mechanic
async function testWarpSearch() {
  console.log("Testing search for Warp mechanic...\n");

  const searches = [
    'o:"warp {"',
    'o:"warp cost"',
    'o:"for its warp cost"',
    'o:"You may cast this card from your hand for its warp cost"',
    'o:warp o:"exile this creature"',
    '"Nova Hellkite"',
  ];

  for (const query of searches) {
    console.log(`\nTrying: ${query}`);
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        console.log(`✓ Found ${data.data.length} cards`);

        // Show first card's oracle text
        const firstCard = data.data[0];
        console.log(`\nFirst result: ${firstCard.name}`);
        console.log(`Oracle text: ${firstCard.oracle_text}`);

        // Check if it has the warp mechanic
        if (
          firstCard.oracle_text &&
          firstCard.oracle_text.toLowerCase().includes("warp")
        ) {
          console.log(">>> This card has the Warp mechanic!");
        }
      } else {
        console.log("✗ No results");
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

testWarpSearch();
