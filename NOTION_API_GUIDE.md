# Notion API Debugging and Connection Guide

This repository now includes comprehensive tools for debugging Notion API connection issues, specifically addressing the common problems described in your issue where API keys are rejected after implementing a serverless backend proxy.

## 🛠️ Tools Included

### 1. Command Line Debugger (`notion_api_debugger.js`)
A comprehensive CLI tool that systematically tests your Notion API configuration.

### 2. Backend Proxy Server (`notion_api_backend.js`)
A secure Express.js server that acts as a proxy for Notion API calls, solving CORS issues.

### 3. Web Interface (`notion_api_debugger_web.html`)
A beautiful web interface for testing and debugging Notion API connections.

## 🚀 Quick Start

### Prerequisites
1. Node.js 14+ installed
2. A Notion integration created at [notion.so/my-integrations](https://www.notion.so/my-integrations)
3. A Notion database shared with your integration

### Installation
```bash
git clone https://github.com/jcotebcs/Rapid_API-Generator.git
cd Rapid_API-Generator
npm install
```

### Environment Setup
```bash
# Copy the Notion-specific environment template
cp .env.example.notion .env

# Edit .env and add your actual Notion API key
NOTION_API_KEY=secret_your_actual_key_here
```

## 🔍 Debugging Your Connection Issues

### Step 1: Run Basic Diagnostic
```bash
# Test basic API connection
npm run debug:notion

# Test with specific database
npm run debug:notion YOUR_DATABASE_ID
```

### Step 2: Start Backend Proxy (if needed)
```bash
# Start the proxy server
npm run start:notion-backend
```

### Step 3: Use Web Interface
Open `notion_api_debugger_web.html` in your browser for a guided debugging experience.

## 📋 Systematic Debugging Approach

The tools implement the comprehensive debugging approach from your issue:

### ✅ Environment Verification
- Validates `NOTION_API_KEY` is set and correct length
- Checks key format (should start with `secret_`)
- Tests key accessibility in runtime environment

### ✅ Authentication & Authorization Testing
- Tests basic API connection with `/users/me` endpoint
- Validates integration permissions
- Provides specific error guidance for 401/403 responses

### ✅ Database ID Integrity Check
- Validates UUID format (32 hex characters)
- Tests database access permissions
- Checks database existence and accessibility

### ✅ Backend Endpoint Testing
- Comprehensive proxy server with detailed logging
- Individual endpoint testing capabilities
- Error isolation and detailed reporting

### ✅ Frontend Review Tools
- Web interface that handles API keys securely
- No direct frontend API key exposure
- CORS-safe implementation examples

### ✅ Deployment Configuration Audit
- Environment variable validation
- Configuration debugging endpoints
- Server health check capabilities

## 🔧 Backend Proxy Server Features

The `notion_api_backend.js` includes all the endpoints mentioned in your debugging approach:

### Available Endpoints
- `GET /health` - Health check
- `GET /api/debug-env` - Environment variable validation
- `GET /api/testConnection` - Basic connection test
- `GET /api/testConnection?databaseId=<id>` - Database-specific test
- `GET /api/queryDatabase?databaseId=<id>` - Database query test
- `POST /api/createPage` - Page creation test
- `GET /api/getDatabaseSchema?databaseId=<id>` - Schema retrieval

### Enhanced Error Logging
Each endpoint provides:
- Detailed error messages with HTTP status codes
- Complete Notion API response data
- Timestamp and request tracking
- Specific guidance based on error types

## 🐛 Common Issues & Solutions

### Issue: "API Key Rejected"
**Causes:**
- Environment variable not set in deployment
- Key format incorrect (missing `secret_` prefix)
- Integration not shared with database

**Solutions:**
1. Run: `curl YOUR_BACKEND_URL/api/debug-env` to verify key
2. Check integration sharing in Notion database
3. Verify key format and length (should be 32+ chars)

### Issue: 403 Forbidden
**Causes:**
- Integration not shared with database
- Insufficient permissions

**Solutions:**
1. Go to Notion database → Share → Invite integration
2. Grant "Edit" permissions
3. Confirm integration appears in database sharing

### Issue: CORS Errors
**Causes:**
- Direct frontend API calls to Notion
- Browser security restrictions

**Solutions:**
1. Use the included backend proxy
2. Deploy `notion_api_backend.js` to your serverless platform
3. Update frontend to call proxy instead of Notion directly

## 🚀 Deployment Examples

### Vercel Deployment
```json
{
  "functions": {
    "notion_api_backend.js": {
      "memory": 512
    }
  },
  "env": {
    "NOTION_API_KEY": "@notion-api-key"
  }
}
```

### Railway Deployment
```toml
[build]
command = "npm install"

[deploy]
startCommand = "npm run start:notion-backend"

[[env]]
name = "NOTION_API_KEY"
value = "secret_your_key_here"
```

### Render Deployment
```yaml
services:
  - type: web
    name: notion-api-backend
    env: node
    buildCommand: npm install
    startCommand: npm run start:notion-backend
    envVars:
      - key: NOTION_API_KEY
        value: secret_your_key_here
```

## 🧪 Testing with curl

### Test Basic Connection
```bash
curl -X GET "https://your-backend.com/api/testConnection" \
  -H "Content-Type: application/json"
```

### Test Database Access
```bash
curl -X GET "https://your-backend.com/api/testConnection?databaseId=YOUR_DB_ID" \
  -H "Content-Type: application/json"
```

### Test Environment Variables
```bash
curl -X GET "https://your-backend.com/api/debug-env" \
  -H "Content-Type: application/json"
```

## 📊 Diagnostic Output Examples

### Successful Connection
```
🚀 NOTION API COMPREHENSIVE DIAGNOSTIC
============================================================

🔍 STEP 1: Verifying NOTION_API_KEY Environment Variable
============================================================
✅ API Key exists in environment variables
✅ API Key length is correct (32 characters)
✅ API Key format: secr****************************abcd

🔍 STEP 3: Testing Basic Notion API Connection
============================================================
✅ Basic API connection successful
   User ID: 12345678-1234-1234-1234-123456789012
   User Type: person
   User Name: John Doe

📊 DIAGNOSTIC SUMMARY
============================================================
Environment Variable Check: ✅ PASS
Basic API Connection: ✅ PASS
Database Access: ✅ PASS
Database Query: ✅ PASS
Page Creation: ✅ PASS

Overall: 5/5 tests passed

🎉 All tests passed! Your Notion API configuration is working correctly.
```

### Failed Connection with Guidance
```
❌ Basic API connection failed
   HTTP Status: 401
   Status Text: Unauthorized
   Error Details: {
     "object": "error",
     "status": 401,
     "code": "unauthorized",
     "message": "API token is invalid."
   }

💡 GUIDANCE: Authentication failed
   - Check that your NOTION_API_KEY is correct
   - Ensure the integration is not disabled
   - Verify the API key hasn't expired
```

## 🔄 Integration with Existing RapidAPI Tools

These Notion API tools integrate seamlessly with the existing RapidAPI Generator:

- Use the same secure environment variable patterns
- Follow the same error handling approaches
- Compatible with existing Docker configurations
- Extend the web interface capabilities

## 📞 Support

If you continue to experience issues after using these tools:

1. Check the detailed error logs from the diagnostic tools
2. Verify your Notion integration settings
3. Test with the provided curl examples
4. Review the troubleshooting guide in the web interface

The tools provide comprehensive error reporting to help identify exactly where the connection is failing.