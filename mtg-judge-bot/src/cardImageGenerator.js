const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const fs = require("fs");

// Card dimensions
const CARD_WIDTH = 600;
const CARD_HEIGHT = 250;
const BORDER_COLOR = "#5C3278"; // Purple border like the Python version
const BACKGROUND_COLOR = "#1E1E1E"; // Dark background
const TEXT_COLOR = "#FFFFFF";
const TITLE_COLOR = "#5EAFFF"; // Blue for card name
const TYPE_COLOR = "#FFFFFF";
const FLAVOR_COLOR = "#B4B4B4"; // Gray for flavor text

// Mana symbol mapping to Unicode or emoji
const MANA_SYMBOLS = {
  "{W}": "⚪",
  "{U}": "🔵",
  "{B}": "⚫",
  "{R}": "🔴",
  "{G}": "🟢",
  "{C}": "◇",
  "{X}": "Ⓧ",
  "{0}": "⓪",
  "{1}": "①",
  "{2}": "②",
  "{3}": "③",
  "{4}": "④",
  "{5}": "⑤",
  "{6}": "⑥",
  "{7}": "⑦",
  "{8}": "⑧",
  "{9}": "⑨",
  "{10}": "⑩",
  "{T}": "⟲",
  "{Q}": "⤵",
  "{S}": "❄",
  "{E}": "⚡",
};

// Convert mana cost to display format
function convertManaCost(manaCost) {
  if (!manaCost) return "";

  let displayCost = manaCost;
  Object.keys(MANA_SYMBOLS).forEach((symbol) => {
    displayCost = displayCost.replace(
      new RegExp(symbol.replace(/[{}]/g, "\\$&"), "g"),
      MANA_SYMBOLS[symbol]
    );
  });

  return displayCost;
}

// Word wrap function for text
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine = currentLine + " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Main function to create card preview
async function createCardPreview(cardData) {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Left border (like Scryfall)
  ctx.fillStyle = BORDER_COLOR;
  ctx.fillRect(0, 0, 4, CARD_HEIGHT);

  // Set up text rendering
  ctx.textBaseline = "top";
  ctx.fillStyle = TEXT_COLOR;

  // Title and mana cost
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = TITLE_COLOR;
  ctx.fillText(cardData.name, 15, 15);

  // Mana cost
  const titleWidth = ctx.measureText(cardData.name).width;
  if (cardData.mana_cost) {
    ctx.font = "18px Arial";
    ctx.fillStyle = TEXT_COLOR;
    const manaCost = convertManaCost(cardData.mana_cost);
    ctx.fillText(manaCost, titleWidth + 25, 16);
  }

  // Type line
  ctx.font = "16px Arial";
  ctx.fillStyle = TYPE_COLOR;
  let typeLine = cardData.type_line;
  if (cardData.power && cardData.toughness) {
    typeLine += ` — ${cardData.power}/${cardData.toughness}`;
  } else if (cardData.loyalty) {
    typeLine += ` — Loyalty: ${cardData.loyalty}`;
  }
  ctx.fillText(typeLine, 15, 45);

  // Oracle text
  if (cardData.oracle_text) {
    ctx.font = "14px Arial";
    ctx.fillStyle = TEXT_COLOR;

    // Clean up oracle text and convert mana symbols
    let oracleText = cardData.oracle_text;
    Object.keys(MANA_SYMBOLS).forEach((symbol) => {
      oracleText = oracleText.replace(
        new RegExp(symbol.replace(/[{}]/g, "\\$&"), "g"),
        MANA_SYMBOLS[symbol]
      );
    });

    const lines = wrapText(ctx, oracleText, CARD_WIDTH - 180); // Leave space for card image
    let y = 75;
    for (const line of lines) {
      ctx.fillText(line, 15, y);
      y += 18;
    }

    // Flavor text
    if (cardData.flavor_text && y < CARD_HEIGHT - 40) {
      ctx.font = "italic 13px Arial";
      ctx.fillStyle = FLAVOR_COLOR;
      const flavorLines = wrapText(ctx, cardData.flavor_text, CARD_WIDTH - 180);
      y += 10;
      for (const line of flavorLines) {
        if (y < CARD_HEIGHT - 20) {
          ctx.fillText(line, 15, y);
          y += 16;
        }
      }
    }
  }

  // Card image on the right
  if (cardData.image_url) {
    try {
      const cardImage = await loadImage(cardData.image_url);
      // Draw card art on the right side
      ctx.drawImage(cardImage, CARD_WIDTH - 120, 20, 110, 160);
    } catch (err) {
      console.error("Failed to load card image:", err);
      // Draw placeholder
      ctx.fillStyle = "#333333";
      ctx.fillRect(CARD_WIDTH - 120, 20, 110, 160);
      ctx.fillStyle = "#666666";
      ctx.font = "12px Arial";
      ctx.fillText("No Image", CARD_WIDTH - 85, 90);
    }
  }

  // Footer info
  ctx.font = "12px Arial";
  ctx.fillStyle = "#999999";
  const footerText = `${cardData.set_name} (${cardData.set}) • ${cardData.rarity}`;
  ctx.fillText(footerText, 15, CARD_HEIGHT - 20);

  // Price if available
  if (cardData.prices && cardData.prices.usd) {
    const priceText = `$${cardData.prices.usd}`;
    const priceWidth = ctx.measureText(priceText).width;
    ctx.fillText(priceText, CARD_WIDTH - 130 - priceWidth, CARD_HEIGHT - 20);
  }

  return canvas.toBuffer("image/png");
}

// Function to create multiple card previews in a grid
async function createMultipleCardPreviews(cardsData) {
  const maxCards = Math.min(cardsData.length, 4); // Limit to 4 cards max
  const columns = maxCards <= 2 ? 1 : 2; // 1 column for 1-2 cards, 2 columns for 3-4 cards
  const rows = Math.ceil(maxCards / columns);

  const gridWidth = CARD_WIDTH * columns + (columns - 1) * 10; // 10px gap between cards
  const gridHeight = CARD_HEIGHT * rows + (rows - 1) * 10; // 10px gap between cards

  const canvas = createCanvas(gridWidth, gridHeight);
  const ctx = canvas.getContext("2d");

  // Background for the entire grid
  ctx.fillStyle = "#0D0D0D"; // Darker background
  ctx.fillRect(0, 0, gridWidth, gridHeight);

  // Generate and place each card preview
  for (let i = 0; i < maxCards; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * (CARD_WIDTH + 10);
    const y = row * (CARD_HEIGHT + 10);

    try {
      // Generate individual card preview
      const cardBuffer = await createCardPreview(cardsData[i]);
      const cardImage = await loadImage(cardBuffer);

      // Draw the card preview at the calculated position
      ctx.drawImage(cardImage, x, y);
    } catch (err) {
      console.error(`Failed to generate preview for card ${i}:`, err);
      // Draw error placeholder
      ctx.fillStyle = "#333333";
      ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
      ctx.fillStyle = "#999999";
      ctx.font = "16px Arial";
      ctx.fillText(
        "Error loading card",
        x + CARD_WIDTH / 2 - 60,
        y + CARD_HEIGHT / 2
      );
    }
  }

  // Add a subtle border around the entire image
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, gridWidth - 2, gridHeight - 2);

  return canvas.toBuffer("image/png");
}

// Export for use in the main bot
module.exports = { createCardPreview, createMultipleCardPreviews };
