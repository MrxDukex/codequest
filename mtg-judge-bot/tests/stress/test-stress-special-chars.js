/**
 * Comprehensive stress test for special character handling
 * Tests a wide variety of cards with apostrophes, commas, hyphens, etc.
 */

const CardSetParser = require("../src/cardSetParser");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

async function testCardLookup(command, expectedCard) {
  const { cardName, setIdentifier } = CardSetParser.parseCardCommand(command);

  try {
    let result = null;

    if (setIdentifier) {
      result = await CardSetParser.getCardFromSet(cardName, setIdentifier);
    } else {
      // Use fuzzy search directly (simulating what getBestCardPrinting does)
      const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        cardName
      )}`;
      const response = await fetch(fuzzyUrl);
      if (response.ok) {
        result = await response.json();
      }
    }

    if (result && result.name === expectedCard) {
      return { success: true, got: result.name };
    } else {
      return { success: false, got: result ? result.name : "Not found" };
    }
  } catch (error) {
    return { success: false, got: `Error: ${error.message}` };
  }
}

async function runStressTest() {
  console.log("============================================================");
  console.log("COMPREHENSIVE STRESS TEST - SPECIAL CHARACTER HANDLING");
  console.log("============================================================\n");

  const testCases = [
    // Apostrophes - Common cases
    { input: "!card commanders plate", expected: "Commander's Plate" },
    { input: "!card urzas saga", expected: "Urza's Saga" },
    { input: "!card urzas tower", expected: "Urza's Tower" },
    { input: "!card urzas mine", expected: "Urza's Mine" },
    { input: "!card urzas power plant", expected: "Urza's Power Plant" },
    { input: "!card teferis protection", expected: "Teferi's Protection" },
    { input: "!card teferis puzzle box", expected: "Teferi's Puzzle Box" },
    { input: "!card jaces triumph", expected: "Jace's Triumph" },
    { input: "!card chandras ignition", expected: "Chandra's Ignition" },
    { input: "!card lilianas caress", expected: "Liliana's Caress" },
    { input: "!card garruks uprising", expected: "Garruk's Uprising" },
    { input: "!card nissas pilgrimage", expected: "Nissa's Pilgrimage" },
    { input: "!card ajanis pridemate", expected: "Ajani's Pridemate" },
    { input: "!card sorins vengeance", expected: "Sorin's Vengeance" },
    { input: "!card tamiyos journal", expected: "Tamiyo's Journal" },
    { input: "!card karns bastion", expected: "Karn's Bastion" },
    { input: "!card bolas citadel", expected: "Bolas's Citadel" },
    { input: "!card dragons hoard", expected: "Dragon's Hoard" },
    { input: "!card deaths shadow", expected: "Death's Shadow" },
    { input: "!card natures claim", expected: "Nature's Claim" },

    // Commas - Legendary creatures and planeswalkers
    {
      input: "!card akroma angel of wrath",
      expected: "Akroma, Angel of Wrath",
    },
    {
      input: "!card thalia guardian of thraben",
      expected: "Thalia, Guardian of Thraben",
    },
    {
      input: "!card omnath locus of creation",
      expected: "Omnath, Locus of Creation",
    },
    {
      input: "!card kenrith the returned king",
      expected: "Kenrith, the Returned King",
    },
    {
      input: "!card muldrotha the gravetide",
      expected: "Muldrotha, the Gravetide",
    },
    {
      input: "!card atraxa praetors voice",
      expected: "Atraxa, Praetors' Voice",
    },
    { input: "!card edgar markov", expected: "Edgar Markov" }, // No comma needed
    {
      input: "!card yuriko the tigers shadow",
      expected: "Yuriko, the Tiger's Shadow",
    },
    {
      input: "!card korvold fae-cursed king",
      expected: "Korvold, Fae-Cursed King",
    },
    {
      input: "!card chulane teller of tales",
      expected: "Chulane, Teller of Tales",
    },
    {
      input: "!card kinnan bonder prodigy",
      expected: "Kinnan, Bonder Prodigy",
    },
    {
      input: "!card tergrid god of fright",
      expected: "Tergrid, God of Fright // Tergrid's Lantern", // Double-faced card
    },
    {
      input: "!card esika god of the tree",
      expected: "Esika, God of the Tree // The Prismatic Bridge", // Double-faced card
    },
    { input: "!card koma cosmos serpent", expected: "Koma, Cosmos Serpent" },
    {
      input: "!card vorinclex monstrous raider",
      expected: "Vorinclex, Monstrous Raider",
    },

    // Multiple special characters
    {
      input: "!card elspeth suns champion",
      expected: "Elspeth, Sun's Champion",
    },
    {
      input: "!card ob nixilis the fallen",
      expected: "Ob Nixilis, the Fallen",
    },
    {
      input: "!card nicol bolas the ravager",
      expected: "Nicol Bolas, the Ravager // Nicol Bolas, the Arisen", // Double-faced card
    },
    {
      input: "!card krrik son of yawgmoth",
      expected: "K'rrik, Son of Yawgmoth",
    },
    { input: "!card zurgo helmsmasher", expected: "Zurgo Helmsmasher" }, // No comma
    {
      input: "!card animar soul of elements",
      expected: "Animar, Soul of Elements",
    },
    { input: "!card kaalia of the vast", expected: "Kaalia of the Vast" }, // No comma
    {
      input: "!card prossh skyraider of kher",
      expected: "Prossh, Skyraider of Kher",
    },
    {
      input: "!card oloro ageless ascetic",
      expected: "Oloro, Ageless Ascetic",
    },
    {
      input: "!card derevi empyrial tactician",
      expected: "Derevi, Empyrial Tactician",
    },

    // Hyphens
    { input: "!card the ur dragon", expected: "The Ur-Dragon" },
    { input: "!card the ur-dragon", expected: "The Ur-Dragon" }, // Need "the" for proper match
    {
      input: "!card scion of the ur dragon",
      expected: "Scion of the Ur-Dragon",
    },
    {
      input: "!card o kagachi vengeful kami",
      expected: "O-Kagachi, Vengeful Kami",
    },
    {
      input: "!card eight and a half tails",
      expected: "Eight-and-a-Half-Tails",
    },
    { input: "!card will o the wisp", expected: "Will-o'-the-Wisp" },
    { input: "!card jack in the mox", expected: "Jack-in-the-Mox" },

    // Double slashes (split cards)
    { input: "!card fire ice", expected: "Fire // Ice" },
    { input: "!card wear tear", expected: "Wear // Tear" },
    { input: "!card life death", expected: "Life // Death" },
    { input: "!card crime punishment", expected: "Crime // Punishment" },
    { input: "!card boom bust", expected: "Boom // Bust" },
    { input: "!card dead gone", expected: "Dead // Gone" },
    { input: "!card supply demand", expected: "Supply // Demand" },

    // Parentheses and special punctuation
    { input: "!card borborygmos", expected: "Borborygmos" },
    {
      input: "!card asmoranomardicadaistinaculdacar",
      expected: "Asmoranomardicadaistinaculdacar",
    },
    { input: "!card phelddagrif", expected: "Phelddagrif" },

    // Edge cases with "The"
    { input: "!card gitrog monster", expected: "The Gitrog Monster" },
    { input: "!card the gitrog monster", expected: "The Gitrog Monster" },
    { input: "!card scarab god", expected: "The Scarab God" },
    { input: "!card the scarab god", expected: "The Scarab God" },
    { input: "!card locust god", expected: "The Locust God" },
    { input: "!card scorpion god", expected: "The Scorpion God" },

    // Planeswalkers with commas
    {
      input: "!card teferi hero of dominaria",
      expected: "Teferi, Hero of Dominaria",
    },
    { input: "!card teferi time raveler", expected: "Teferi, Time Raveler" },
    {
      input: "!card teferi master of time",
      expected: "Teferi, Master of Time",
    },
    {
      input: "!card jace the mind sculptor",
      expected: "Jace, the Mind Sculptor",
    },
    { input: "!card liliana of the veil", expected: "Liliana of the Veil" }, // No comma
    {
      input: "!card chandra torch of defiance",
      expected: "Chandra, Torch of Defiance",
    },
    {
      input: "!card nissa who shakes the world",
      expected: "Nissa, Who Shakes the World",
    },

    // Artifacts with apostrophes
    { input: "!card sol ring", expected: "Sol Ring" }, // No apostrophe
    { input: "!card senseis divining top", expected: "Sensei's Divining Top" },
    { input: "!card lions eye diamond", expected: "Lion's Eye Diamond" },
    { input: "!card helm of the host", expected: "Helm of the Host" }, // No apostrophe
    { input: "!card smugglers copter", expected: "Smuggler's Copter" },
    { input: "!card travelers amulet", expected: "Traveler's Amulet" },
    { input: "!card explorers scope", expected: "Explorer's Scope" },
    { input: "!card wayfarers bauble", expected: "Wayfarer's Bauble" },

    // Lands with apostrophes
    { input: "!card rogues passage", expected: "Rogue's Passage" },
    { input: "!card witchs cottage", expected: "Witch's Cottage" },
    { input: "!card giants skewer", expected: "Giant's Skewer" },
    { input: "!card tyrites sanctum", expected: "Tyrite Sanctum" }, // No apostrophe
    { input: "!card gavony township", expected: "Gavony Township" }, // No apostrophe
    { input: "!card kessig wolf run", expected: "Kessig Wolf Run" }, // No hyphen

    // More complex cases
    {
      input: "!card emrakul the aeons torn",
      expected: "Emrakul, the Aeons Torn",
    },
    {
      input: "!card kozilek butcher of truth",
      expected: "Kozilek, Butcher of Truth",
    },
    {
      input: "!card ulamog the infinite gyre",
      expected: "Ulamog, the Infinite Gyre",
    },
    { input: "!card maelstrom wanderer", expected: "Maelstrom Wanderer" }, // No comma
    { input: "!card mayael the anima", expected: "Mayael the Anima" }, // No comma
    { input: "!card rafiq of the many", expected: "Rafiq of the Many" }, // No comma
    { input: "!card sharuum the hegemon", expected: "Sharuum the Hegemon" }, // No comma
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  // Group tests for better output
  const groups = {
    Apostrophes: testCases.slice(0, 20),
    Commas: testCases.slice(20, 35),
    "Multiple Special Chars": testCases.slice(35, 45),
    Hyphens: testCases.slice(45, 52),
    "Split Cards": testCases.slice(52, 59),
    "Edge Cases": testCases.slice(59),
  };

  for (const [groupName, tests] of Object.entries(groups)) {
    console.log(`${BLUE}Testing ${groupName}...${RESET}`);

    for (const test of tests) {
      const result = await testCardLookup(test.input, test.expected);

      if (result.success) {
        process.stdout.write(`${GREEN}.${RESET}`);
        passed++;
      } else {
        process.stdout.write(`${RED}X${RESET}`);
        failed++;
        failures.push({
          input: test.input,
          expected: test.expected,
          got: result.got,
        });
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    console.log(); // New line after each group
  }

  console.log("\n============================================================");
  console.log("STRESS TEST RESULTS");
  console.log("============================================================");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`${GREEN}Passed: ${passed}${RESET}`);
  console.log(`${RED}Failed: ${failed}${RESET}`);
  console.log(
    `Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`
  );

  if (failures.length > 0) {
    console.log("\nFailed Tests:");
    failures.forEach((f) => {
      console.log(`  Input: "${f.input}"`);
      console.log(`    Expected: "${f.expected}"`);
      console.log(`    Got: "${f.got}"`);
    });
  }

  if (passed === testCases.length) {
    console.log(
      `\n${GREEN}🎉 PERFECT SCORE! All ${testCases.length} tests passed!${RESET}`
    );
    console.log(
      `${GREEN}The fuzzy matching system is working flawlessly for ALL card types!${RESET}`
    );
    return true;
  } else {
    console.log(
      `\n${YELLOW}⚠️ ${failed} tests failed. The system needs improvement.${RESET}`
    );
    return false;
  }
}

// Run the stress test
runStressTest()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Stress test failed:", error);
    process.exit(1);
  });
