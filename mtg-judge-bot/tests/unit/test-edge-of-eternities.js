/**
 * Test script to investigate the "edge of eternities" set issue
 */

const CardSetParser = require("../src/cardSetParser");

async function testEdgeOfEternities() {
  console.log('Testing "edge of eternities" set handling...\n');

  // Test 1: Parse the command
  const parsed = CardSetParser.parseCardCommand(
    "!card Sol Ring from edge of eternities"
  );
  console.log("1. Parsed command:", parsed);

  // Test 2: Try to fetch from "edge of eternities"
  console.log('\n2. Searching for Sol Ring in "edge of eternities"...');
  const result1 = await CardSetParser.getCardFromSet(
    "Sol Ring",
    "edge of eternities"
  );
  console.log("   Result:", result1 ? `Found: ${result1.name}` : "Not found");

  // Test 3: Try "eoc" as set code
  console.log('\n3. Searching for Sol Ring in "eoc"...');
  const result2 = await CardSetParser.getCardFromSet("Sol Ring", "eoc");
  console.log(
    "   Result:",
    result2 ? `Found: ${result2.name} from ${result2.set_name}` : "Not found"
  );

  // Test 4: Get all sets where Sol Ring appears
  console.log("\n4. Getting all sets with Sol Ring...");
  const sets = await CardSetParser.getCardSets("Sol Ring");
  console.log(`   Found in ${sets.length} sets`);

  // Check if any set contains "eternities" in the name
  const eternitiesSets = sets.filter(
    (s) =>
      s.name.toLowerCase().includes("eternities") ||
      s.code.toLowerCase().includes("eoc")
  );

  if (eternitiesSets.length > 0) {
    console.log('\n   Sets with "eternities" or "eoc":');
    eternitiesSets.forEach((s) => {
      console.log(`   - ${s.name} (${s.code})`);
    });
  } else {
    console.log('   No sets found with "eternities" in the name');
  }

  // Test 5: Check if "Edge of Eternities Commander" exists
  console.log("\n5. Checking various set name variations...");
  const variations = [
    "eoc",
    "edge of eternities",
    "edge of eternities commander",
    "oec", // Maybe it's reversed?
    "eoe", // Edge of Eternities?
  ];

  for (const variation of variations) {
    const result = await CardSetParser.getCardFromSet("Sol Ring", variation);
    if (result) {
      console.log(
        `   ✓ Found with "${variation}": ${result.set_name} (${result.set})`
      );
    } else {
      console.log(`   ✗ Not found with "${variation}"`);
    }
  }

  // Test 6: Direct Scryfall API test
  console.log("\n6. Direct Scryfall API tests...");
  try {
    // Test if EOC is a real set
    const eocUrl = "https://api.scryfall.com/sets/eoc";
    const eocResponse = await fetch(eocUrl);
    if (eocResponse.ok) {
      const eocData = await eocResponse.json();
      console.log(`   EOC set exists: ${eocData.name}`);
    } else {
      console.log("   EOC set does not exist in Scryfall");
    }
  } catch (error) {
    console.log("   Error checking EOC set:", error.message);
  }

  // Test 7: Search for any card in EOC
  try {
    const searchUrl = "https://api.scryfall.com/cards/search?q=set:eoc";
    const searchResponse = await fetch(searchUrl);
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`   Found ${searchData.total_cards || 0} cards in set:eoc`);
      if (searchData.data && searchData.data.length > 0) {
        console.log(
          `   First card: ${searchData.data[0].name} from ${searchData.data[0].set_name}`
        );
      }
    } else {
      const errorData = await searchResponse.json();
      console.log(
        "   Search for set:eoc failed:",
        errorData.details || errorData.warnings || "Unknown error"
      );
    }
  } catch (error) {
    console.log("   Error searching set:eoc:", error.message);
  }
}

// Run the tests
testEdgeOfEternities().catch(console.error);
