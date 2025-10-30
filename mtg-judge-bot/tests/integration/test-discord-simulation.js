/**
 * Discord Bot Simulation Test
 * Tests the actual bot behavior with set-specific card searches
 */

const CardSetParser = require("../src/cardSetParser");

// Color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

async function simulateDiscordCommand(command) {
  console.log(`\n${YELLOW}Discord Command: ${command}${RESET}`);

  // Parse the command
  const { cardName, setIdentifier } = CardSetParser.parseCardCommand(command);

  if (!cardName) {
    console.log(`${RED}❌ No card name provided${RESET}`);
    return false;
  }

  console.log(`  Parsed: Card="${cardName}", Set="${setIdentifier || "any"}"`);

  // Try to fetch the card
  if (setIdentifier) {
    const card = await CardSetParser.getCardFromSet(cardName, setIdentifier);

    if (card) {
      console.log(
        `${GREEN}✅ SUCCESS: Found ${card.name} from ${card.set_name} (${card.set})${RESET}`
      );
      return true;
    } else {
      // Get available sets for helpful error message
      const availableSets = await CardSetParser.getCardSets(cardName);

      if (availableSets && availableSets.length > 0) {
        console.log(
          `${RED}❌ FAIL: ${cardName} not in "${setIdentifier}"${RESET}`
        );
        console.log(
          `  Available in: ${availableSets
            .slice(0, 3)
            .map((s) => `${s.name} (${s.code})`)
            .join(", ")}`
        );
      } else {
        console.log(`${RED}❌ FAIL: Card "${cardName}" not found${RESET}`);
      }
      return false;
    }
  } else {
    // No set specified - would use getBestCardPrinting in real bot
    console.log(
      `${GREEN}✅ Would fetch best printing of "${cardName}"${RESET}`
    );
    return true;
  }
}

async function runDiscordSimulation() {
  console.log("============================================================");
  console.log("Discord Bot Simulation - Set-Specific Card Search");
  console.log("============================================================");

  const testCommands = [
    // Working commands
    {
      cmd: "!card Sol Ring from edge of eternities",
      expect: true,
      desc: "Partial set name match",
    },
    { cmd: "!card Sol Ring eoc", expect: true, desc: "Set code" },
    {
      cmd: "!card Lightning Bolt from m21",
      expect: false,
      desc: "Card not in set (Lightning Bolt not in M21)",
    },
    {
      cmd: "!card Sol Ring from Commander Legends",
      expect: true,
      desc: "Full set name",
    },
    {
      cmd: "!card The Ur-Dragon from c17",
      expect: true,
      desc: "Complex card name with set",
    },
    { cmd: "!card Walking Ballista", expect: true, desc: "No set specified" },
    {
      cmd: "!card Gift of Estates from c14",
      expect: true,
      desc: 'Card with "Gift" in name from C14',
    },
    {
      cmd: "!card Force of Will 2xm",
      expect: true,
      desc: "Set code with number",
    },

    // Edge cases
    {
      cmd: "!card Sol Ring from eoc",
      expect: true,
      desc: 'Using set code with "from"',
    },
    {
      cmd: "!card Mox Opal",
      expect: true,
      desc: "Card name that could be confused with set",
    },
    { cmd: "!card Lightning Axe soi", expect: true, desc: "Short set code" },

    // Error cases
    {
      cmd: "!card Fake Card Name from m21",
      expect: false,
      desc: "Non-existent card",
    },
    {
      cmd: "!card Sol Ring from fakeset",
      expect: false,
      desc: "Non-existent set",
    },
    { cmd: "!card Sol Ring from xyz", expect: false, desc: "Invalid set code" },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testCommands) {
    console.log(`\n--- Test: ${test.desc} ---`);
    const result = await simulateDiscordCommand(test.cmd);

    if (result === test.expect) {
      passed++;
      console.log(`  ${GREEN}✓ Test passed as expected${RESET}`);
    } else {
      failed++;
      console.log(
        `  ${RED}✗ Test failed! Expected: ${test.expect}, Got: ${result}${RESET}`
      );
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n============================================================");
  console.log("Final Results");
  console.log("============================================================");
  console.log(`Total Tests: ${testCommands.length}`);
  console.log(`${GREEN}Passed: ${passed}${RESET}`);
  console.log(`${RED}Failed: ${failed}${RESET}`);
  console.log(
    `Success Rate: ${((passed / testCommands.length) * 100).toFixed(1)}%`
  );

  if (failed === 0) {
    console.log(
      `\n${GREEN}🎉 ALL TESTS PASSED! Bot is ready for production!${RESET}`
    );
  } else {
    console.log(
      `\n${YELLOW}⚠️ Some tests failed. Review the failures above.${RESET}`
    );
  }
}

// Run the simulation
runDiscordSimulation().catch(console.error);
