#!/usr/bin/env node

/**
 * Test Runner Script
 * Runs all test suites in organized categories
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const testCategories = {
  unit: "tests/unit",
  integration: "tests/integration",
  stress: "tests/stress",
};

async function runTests(category) {
  const testDir = path.join(__dirname, "..", testCategories[category]);

  if (!fs.existsSync(testDir)) {
    console.log(`No ${category} tests found`);
    return;
  }

  const files = fs.readdirSync(testDir).filter((f) => f.endsWith(".js"));

  console.log(`\n=== Running ${category.toUpperCase()} Tests ===\n`);

  for (const file of files) {
    console.log(`Running: ${file}`);
    await new Promise((resolve) => {
      const child = spawn("node", [path.join(testDir, file)], {
        stdio: "inherit",
      });
      child.on("close", resolve);
    });
  }
}

async function main() {
  const category = process.argv[2];

  if (category && testCategories[category]) {
    await runTests(category);
  } else {
    // Run all tests
    for (const cat of Object.keys(testCategories)) {
      await runTests(cat);
    }
  }
}

main().catch(console.error);
