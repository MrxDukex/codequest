# MTG Judge Bot - Test Suite

This folder contains all test files for the MTG Judge Bot.

## Test Files

### Core Functionality Tests

- **test-answer-generation.js** - Tests the bot's answer generation system with comprehensive rules
- **test-consistency.js** - Verifies that the bot gives consistent answers for the same questions (especially for custom mechanics like "warp")
- **test-config.js** - Tests configuration loading and API key validation

### API Integration Tests

- **test-api.js** - Tests Scryfall API integration
- **test-cards.js** - Tests card lookup functionality
- **test-prices.js** - Tests card pricing data retrieval
- **check-purchase-urls.js** - Validates purchase URLs from Scryfall

### Specific Feature Tests

- **test-warp.js** - Tests the custom "warp" mechanic implementation
- **index-gemini.js** - Alternative bot implementation using Gemini API (not currently in use)

## Running Tests

To run a specific test:

```bash
cd mtg-judge-bot
node tests/test-consistency.js
```

## Test Results

All tests should pass with:

- ✅ Consistent answers for repeated questions
- ✅ Proper comprehensive rules integration (1300+ rules)
- ✅ Custom mechanics database working correctly
- ✅ Single response per question (no duplicates)
