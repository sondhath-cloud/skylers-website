#!/bin/bash

# Deployment script for main website to SiteWorks
# Run this script from the canine-coaching-website directory

echo "🚀 Deploying Canine Coaching Main Website..."

# Check if we're in the right directory
if [ ! -d "main-site" ]; then
    echo "❌ Error: main-site directory not found. Run this script from the canine-coaching-website directory."
    exit 1
fi

echo "📁 Files to deploy:"
echo "  - main-site/index.html"
echo "  - main-site/styles.css" 
echo "  - main-site/script.js"
echo "  - main-site/api/ (PHP files)"
echo "  - main-site/config/ (database config)"
echo "  - main-site/assets/ (images and videos)"

echo ""
echo "📋 Manual deployment steps:"
echo "1. Upload ALL contents from main-site/ to: public_html/skylers-site/"
echo "2. This includes: index.html, styles.css, script.js, api/, config/, and assets/"
echo "3. Ensure database credentials are correct in config/database.php"
echo "4. Test the website at: https://sondrahathaway.com/skylers-site/"

echo ""
echo "✅ Deployment instructions ready!"
echo "📖 See README.md for detailed instructions"
