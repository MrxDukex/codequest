# MTG Judge Bot Documentation

## Project Structure

```
mtg-judge-bot/
├── index.js                 # Main bot entry point
├── package.json            # Dependencies and scripts
├── .gitignore             # Git ignore rules
├── .env                   # Environment variables (not in repo)
│
├── config/                # Configuration files
│   ├── index.js          # Main config loader
│   └── apiConfig.js      # API configuration
│
├── src/                  # Source code
│   ├── cardImageGenerator.js    # Card image generation
│   ├── cardReferenceDetector.js # Detects card references in text
│   ├── cardSetParser.js         # Parses set-specific card commands
│   ├── manaSymbols.js           # Mana symbol handling
│   ├── oracleParser.js          # Oracle text parsing
│   ├── rag.js                   # RAG system implementation
│   ├── rulesManager.js          # Comprehensive rules management
│   ├── webSearch.js             # Web search functionality
│   │
│   ├── knowledge/               # Knowledge management
│   │   └── cache.js            # Knowledge caching system
│   │
│   └── webSearch/              # Web search modules
│       ├── braveSearch.js      # Brave search integration
│       ├── rssMonitor.js       # RSS feed monitoring
│       ├── searchAggregator.js # Search result aggregation
│       └── tavilySearch.js     # Tavily search integration
│
├── data/                        # Data files
│   ├── MagicCompRules.txt     # Comprehensive rules
│   ├── rulesIndex.json        # Rules index
│   ├── lastRulesUpdate.json   # Last update timestamp
│   ├── customMechanics.json   # Custom mechanics database
│   └── cache.db               # Cache database
│
├── tests/                      # Test suites
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   ├── stress/               # Stress tests
│   └── README.md             # Test documentation
│
├── scripts/                   # Utility scripts
│   └── run-tests.js          # Test runner
│
├── utils/                    # Utility functions (future)
│
└── docs/                     # Documentation
    ├── README.md            # This file
    └── *.md                 # Various documentation files
```

## Features

### 1. Discord Commands

- `!judge [question]` - Get MTG rules clarifications
- `!card [card name]` - Look up card information
- `!card [card name] from [set]` - Look up specific printing
- `!cards [list]` - Look up multiple cards (comma-separated)
- `!updaterules` - Update comprehensive rules
- `!rulestatus` - Check rules database status
- `!commands` - List all available commands

### 2. Special Features

#### Fuzzy Card Matching

The bot intelligently handles misspelled card names and missing special characters:

- Missing apostrophes: `commanders plate` → `Commander's Plate`
- Missing commas: `akroma angel of wrath` → `Akroma, Angel of Wrath`
- Missing hyphens: `ur dragon` → `The Ur-Dragon`
- Split cards: `fire ice` → `Fire // Ice`

#### Set-Specific Searches

Users can search for cards from specific sets:

- By set code: `!card Sol Ring eoc`
- By set name: `!card Sol Ring from edge of eternities`
- Partial matching: `edge of eternities` matches `Edge of Eternities Commander`

#### Enhanced Answer Generation

- Comprehensive 2-3 paragraph responses
- Step-by-step explanations
- Common interactions and edge cases
- Official rulings integration

## Setup Instructions

### Prerequisites

- Node.js v18+
- Discord Bot Token
- OpenAI API Key
- Optional: Tavily API Key (for web search)
- Optional: Brave API Key (for web search)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   DISCORD_TOKEN=your_discord_token
   OPENAI_API_KEY=your_openai_key
   TAVILY_API_KEY=your_tavily_key (optional)
   BRAVE_API_KEY=your_brave_key (optional)
   ```

4. Start the bot:
   ```bash
   npm start
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test category
npm run test:unit
npm run test:integration
npm run test:stress

# Run specific test file
node tests/unit/test-fuzzy-matching.js
```

## API Integrations

### Scryfall API

- Card data fetching
- Fuzzy search
- Set-specific queries
- Price information
- Rulings

### OpenAI API

- Answer generation
- Rules interpretation
- Card interaction explanations

### Web Search APIs (Optional)

- Tavily Search
- Brave Search
- RSS Feed monitoring

## Development

### Adding New Features

1. Create feature in appropriate `src/` module
2. Add unit tests in `tests/unit/`
3. Add integration tests in `tests/integration/`
4. Update documentation

### Code Style

- Use ES6+ features
- Async/await for asynchronous code
- Comprehensive error handling
- Clear console logging for debugging

### Testing Guidelines

- Unit tests for individual functions
- Integration tests for command flows
- Stress tests for performance
- 100% pass rate required for production

## Troubleshooting

### Common Issues

1. **Bot not responding**

   - Check Discord token in `.env`
   - Verify bot has message content intent enabled
   - Check console for error messages

2. **Card not found errors**

   - Fuzzy matching should handle most cases
   - Check Scryfall API status
   - Verify internet connection

3. **Rules not loading**
   - Run `!updaterules` command
   - Check `data/` folder permissions
   - Verify sufficient disk space

## Recent Updates

### Version 2.0 (Current)

- ✅ Complete project reorganization
- ✅ Enhanced fuzzy card matching (100% test coverage)
- ✅ Set-specific card searches
- ✅ Improved answer generation
- ✅ Better error handling

### Version 1.0

- Initial release
- Basic card lookup
- Rules clarification
- Discord integration

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:

- Check documentation in `/docs`
- Review test files for examples
- Submit GitHub issues for bugs
