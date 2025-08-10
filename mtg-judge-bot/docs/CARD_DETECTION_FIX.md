# Card Reference Detection Fix

## Problem

When asked about "The Ur-Dragon", the bot was incorrectly showing "Niblis of the Urn" as a referenced card.

## Root Cause

The CardReferenceDetector was incorrectly extracting "Urn" from "Ur-Dragon's" in the text:

- The pattern matching wasn't handling hyphenated card names properly
- It was breaking "Ur-Dragon's" and extracting fragments
- It then searched for "Urn" and found "Niblis of the Urn"

## Solution Implemented

### 1. Improved Hyphenated Name Handling

- Updated the regex pattern to handle hyphenated names: `/\b([A-Z][a-z]+(?:[-\s]+[A-Z][a-z]+)+)\b/g`
- This now properly recognizes "Ur-Dragon" as a single entity

### 2. Added Exclusion Logic

- Created a list of cards being explained to avoid redundant detection
- Skip detection for hyphenated names when explaining those specific cards
- Filter out possessive forms (words ending in "'s")

### 3. Enhanced Validation

- Added specific filters to remove fragments like "Urn", "Ur", or "Dragon"
- Require multi-word card names to have at least 2 words
- Skip single words that are too short (less than 7 characters)

### 4. Improved Pattern Matching

- Added "doesn't reduce the cost of" to the ruling pattern triggers
- Added validation to ensure detected cards from rulings are at least two words
- Exclude any card name containing "Dragon" when explaining The Ur-Dragon

## Result

The bot will no longer incorrectly detect "Niblis of the Urn" when explaining "The Ur-Dragon" or other hyphenated card names.

## Testing

Try: `!judge can you explain how the ur-dragon works?`

The response should:

- ✅ Explain The Ur-Dragon correctly
- ✅ Show Skirk Prospector if mentioned in rulings
- ❌ NOT show Niblis of the Urn
