#!/bin/bash

echo "🔒 FRP Bypass - Protected Deployment"
echo "====================================="

# 1. Create directory structure
echo "📁 Creating directory structure..."
mkdir -p assets css js protection .github/workflows

# 2. Minify CSS
echo "🎨 Minifying CSS..."
npx clean-css-cli -o css/style.min.css style.css

# 3. Obfuscate JavaScript
echo "🔐 Obfuscating JavaScript..."
npx javascript-obfuscator script.js \
  --output js/script.min.js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --debug-protection true \
  --disable-console-output true \
  --identifier-names-generator mangled \
  --rename-globals true \
  --string-array true \
  --string-array-encoding true \
  --string-array-threshold 1 \
  --unicode-escape-sequence true

# 4. Remove source files
echo "🗑️ Removing source files..."
rm -f style.css
rm -f script.js

# 5. Copy protection files
echo "🛡️ Copying protection scripts..."
cp protection/*.js js/

# 6. Set permissions
echo "🔧 Setting permissions..."
chmod 644 index.html
chmod 644 robots.txt
chmod 644 404.html
chmod 644 _config.yml

# 7. Deploy to GitHub
echo "🚀 Deploying to GitHub..."
git add .
git commit -m "Protected deployment: $(date +'%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 https://yourusername.github.io/frp-bypass-ashish"
echo ""
echo "⚠️  IMPORTANT: Your code is now PROTECTED!"
echo "   - JavaScript obfuscated"
echo "   - CSS minified"
echo "   - Source files removed"
echo "   - Anti-download active"
echo "   - DevTools blocked"