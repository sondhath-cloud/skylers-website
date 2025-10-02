#!/bin/bash

# Deployment script for shepherd dog game to SiteWorks
# Run this script from the canine-coaching-website directory

echo "🎮 Deploying Shepherd Dog Game..."

# Check if we're in the right directory
if [ ! -d "shepherd-game" ]; then
    echo "❌ Error: shepherd-game directory not found. Run this script from the canine-coaching-website directory."
    exit 1
fi

echo "📁 Files to deploy:"
echo "  - shepherd-game/index.html"
echo "  - shepherd-game/styles.css"
echo "  - shepherd-game/script.js"
echo "  - shepherd-game/README.md"

echo ""
echo "📋 Manual deployment steps:"
echo "1. Upload shepherd-game/ contents to: public_html/shepherd-game/"
echo "2. Test the game at: https://sondrahathaway.com/shepherd-game/"

echo ""
echo "✅ Game deployment instructions ready!"
echo "📖 See shepherd-game/README.md for game-specific documentation"
