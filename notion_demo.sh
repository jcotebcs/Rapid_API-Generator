#!/bin/bash

# Notion API Demo Script
# This script demonstrates the complete workflow for debugging Notion API issues

echo "🔧 Notion API Debugging Demo"
echo "=============================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ to continue."
    exit 1
fi

echo "✅ Node.js is available"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies are installed"
echo

# Show environment variable status
echo "🔍 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    if grep -q "NOTION_API_KEY=secret_" .env; then
        echo "✅ NOTION_API_KEY appears to be configured"
    elif grep -q "NOTION_API_KEY=your_notion_integration_secret_key_here" .env; then
        echo "⚠️  NOTION_API_KEY is using placeholder value"
        echo "   Please update .env with your actual Notion integration key"
    else
        echo "❌ NOTION_API_KEY may not be properly configured"
    fi
else
    echo "⚠️  .env file not found"
    echo "   Creating .env from template..."
    cp .env.example.notion .env
    echo "✅ Created .env file - please edit it with your actual API key"
fi

echo
echo "🚀 Available Commands:"
echo "----------------------"
echo "npm run debug:notion              - Run CLI diagnostic tool"
echo "npm run debug:notion <db-id>      - Run CLI diagnostic with database ID"
echo "npm run start:notion-backend      - Start backend proxy server"
echo "open notion_api_debugger_web.html - Open web debugging interface"
echo

echo "📋 Quick Test Commands:"
echo "-----------------------"
echo "# Test basic diagnostic (no database):"
echo "npm run debug:notion"
echo
echo "# Test with database ID:"
echo "npm run debug:notion xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
echo
echo "# Start backend server and test endpoints:"
echo "npm run start:notion-backend &"
echo "curl http://localhost:3000/health"
echo "curl http://localhost:3000/api/debug-env"
echo

echo "🔗 Helpful Links:"
echo "-----------------"
echo "Notion Integrations: https://www.notion.so/my-integrations"
echo "Notion API Docs:     https://developers.notion.com/"
echo "Complete Guide:      ./NOTION_API_GUIDE.md"
echo

echo "✨ Demo complete! Follow the steps above to debug your Notion API connection."