// Quick test for specific card/set combinations
async function testSpecificCards() {
  const tests = [
    { card: "Commander's Plate", set: "znr" },
    { card: "Akroma, Angel of Wrath", set: "tsr" },
  ];

  for (const test of tests) {
    const url = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
      test.card
    )}" set:${test.set}`;
    console.log(`\nChecking: ${test.card} in ${test.set}`);
    console.log(`URL: ${url}`);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        console.log(
          `✅ Found: ${data.data[0].name} in ${data.data[0].set_name}`
        );
      } else {
        console.log(`❌ Not found in set ${test.set}`);

        // Try to find what sets it IS in
        const allSetsUrl = `https://api.scryfall.com/cards/search?q="${encodeURIComponent(
          test.card
        )}"&unique=prints`;
        const allSetsResponse = await fetch(allSetsUrl);
        const allSetsData = await allSetsResponse.json();

        if (allSetsData.data && allSetsData.data.length > 0) {
          const sets = [
            ...new Set(allSetsData.data.map((c) => `${c.set_name} (${c.set})`)),
          ];
          console.log(`   Available in: ${sets.slice(0, 5).join(", ")}`);
        }
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testSpecificCards();
