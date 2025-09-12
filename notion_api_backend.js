#!/usr/bin/env node
/**
 * Notion API Backend Proxy Example
 * 
 * This demonstrates how to create a secure serverless backend for Notion API access.
 * This addresses CORS issues and keeps API keys secure on the server side.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Notion API configuration
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_VERSION = process.env.NOTION_API_VERSION || '2022-06-28';
const NOTION_BASE_URL = 'https://api.notion.com/v1';

// Helper function to create Notion API headers
function createNotionHeaders() {
    return {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json'
    };
}

// Comprehensive error logging
function logDetailedError(endpoint, error, req) {
    console.error(`\n❌ Error in ${endpoint}:`);
    console.error(`   Timestamp: ${new Date().toISOString()}`);
    console.error(`   Request ID: ${req.headers['x-request-id'] || 'N/A'}`);
    
    if (error.response) {
        console.error(`   HTTP Status: ${error.response.status}`);
        console.error(`   Status Text: ${error.response.statusText}`);
        console.error(`   Error Details:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error(`   No response received from Notion API`);
        console.error(`   Request details:`, error.request);
    } else {
        console.error(`   Request setup error: ${error.message}`);
    }
    
    console.error(`   Stack trace:`, error.stack);
}

// Middleware to validate API key
function validateApiKey(req, res, next) {
    if (!NOTION_API_KEY || NOTION_API_KEY === 'your_notion_integration_secret_key_here') {
        return res.status(500).json({
            success: false,
            error: 'Server configuration error',
            message: 'NOTION_API_KEY is not properly configured',
            timestamp: new Date().toISOString()
        });
    }
    next();
}

// Debug endpoint to check environment configuration
app.get('/api/debug-env', (req, res) => {
    console.log('Debug endpoint accessed');
    
    const apiKey = process.env.NOTION_API_KEY;
    if (apiKey) {
        // Mask the key for security
        const maskedKey = apiKey.substring(0, 7) + '*'.repeat(20) + apiKey.substring(apiKey.length - 5);
        
        res.status(200).json({
            success: true,
            message: "API Key exists",
            apiKeyMasked: maskedKey,
            keyLength: apiKey.length,
            nodeEnv: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(500).json({
            success: false,
            message: "API Key missing",
            timestamp: new Date().toISOString()
        });
    }
});

// Test Notion API connection
app.get('/api/testConnection', validateApiKey, async (req, res) => {
    const { databaseId } = req.query;
    
    try {
        console.log(`Testing connection for database: ${databaseId || 'basic connection'}`);
        
        let endpoint;
        let testType;
        
        if (databaseId) {
            // Test specific database access
            endpoint = `${NOTION_BASE_URL}/databases/${databaseId}`;
            testType = 'database_access';
        } else {
            // Test basic API connection
            endpoint = `${NOTION_BASE_URL}/users/me`;
            testType = 'basic_connection';
        }
        
        const response = await axios.get(endpoint, {
            headers: createNotionHeaders()
        });
        
        console.log(`✅ ${testType} test successful`);
        
        res.status(200).json({
            success: true,
            testType,
            data: response.data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logDetailedError('/api/testConnection', error, req);
        
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null,
            timestamp: new Date().toISOString()
        });
    }
});

// Query database pages
app.get('/api/queryDatabase', validateApiKey, async (req, res) => {
    const { databaseId, pageSize = 10 } = req.query;
    
    if (!databaseId) {
        return res.status(400).json({
            success: false,
            error: 'Database ID is required',
            timestamp: new Date().toISOString()
        });
    }
    
    try {
        console.log(`Querying database: ${databaseId}`);
        
        const response = await axios.post(`${NOTION_BASE_URL}/databases/${databaseId}/query`, {
            page_size: parseInt(pageSize)
        }, {
            headers: createNotionHeaders()
        });
        
        console.log(`✅ Database query successful, ${response.data.results.length} results`);
        
        res.status(200).json({
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logDetailedError('/api/queryDatabase', error, req);
        
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null,
            timestamp: new Date().toISOString()
        });
    }
});

// Create page in database
app.post('/api/createPage', validateApiKey, async (req, res) => {
    const { databaseId, properties } = req.body;
    
    if (!databaseId) {
        return res.status(400).json({
            success: false,
            error: 'Database ID is required',
            timestamp: new Date().toISOString()
        });
    }
    
    if (!properties) {
        return res.status(400).json({
            success: false,
            error: 'Page properties are required',
            timestamp: new Date().toISOString()
        });
    }
    
    try {
        console.log(`Creating page in database: ${databaseId}`);
        
        const pageData = {
            parent: { database_id: databaseId },
            properties: properties
        };
        
        const response = await axios.post(`${NOTION_BASE_URL}/pages`, pageData, {
            headers: createNotionHeaders()
        });
        
        console.log(`✅ Page created successfully: ${response.data.id}`);
        
        res.status(200).json({
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logDetailedError('/api/createPage', error, req);
        
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null,
            timestamp: new Date().toISOString()
        });
    }
});

// Get database schema
app.get('/api/getDatabaseSchema', validateApiKey, async (req, res) => {
    const { databaseId } = req.query;
    
    if (!databaseId) {
        return res.status(400).json({
            success: false,
            error: 'Database ID is required',
            timestamp: new Date().toISOString()
        });
    }
    
    try {
        console.log(`Getting schema for database: ${databaseId}`);
        
        const response = await axios.get(`${NOTION_BASE_URL}/databases/${databaseId}`, {
            headers: createNotionHeaders()
        });
        
        // Extract and format schema information
        const schema = {
            title: response.data.title,
            properties: response.data.properties,
            created_time: response.data.created_time,
            last_edited_time: response.data.last_edited_time
        };
        
        console.log(`✅ Database schema retrieved successfully`);
        
        res.status(200).json({
            success: true,
            data: schema,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logDetailedError('/api/getDatabaseSchema', error, req);
        
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Notion API Proxy Server running on port ${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  /api/debug-env - Environment debug`);
    console.log(`   GET  /api/testConnection?databaseId=<id> - Test connection`);
    console.log(`   GET  /api/queryDatabase?databaseId=<id> - Query database`);
    console.log(`   POST /api/createPage - Create page`);
    console.log(`   GET  /api/getDatabaseSchema?databaseId=<id> - Get schema`);
    console.log(`\n🔧 Remember to set NOTION_API_KEY in your environment variables`);
});

module.exports = app;