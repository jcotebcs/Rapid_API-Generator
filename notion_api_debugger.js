#!/usr/bin/env node
/**
 * Notion API Debugger and Connection Tester
 * 
 * This script provides comprehensive debugging tools for Notion API connection issues.
 * It implements the systematic debugging approach for resolving Notion API key rejection
 * and other connection problems.
 */

const axios = require('axios');
require('dotenv').config();

class NotionApiDebugger {
    constructor() {
        this.apiKey = process.env.NOTION_API_KEY;
        this.baseUrl = 'https://api.notion.com/v1';
        this.version = '2022-06-28'; // Notion API version
    }

    /**
     * Action 1: Verify NOTION_API_KEY Environment Variable
     */
    verifyEnvironmentVariable() {
        console.log('\n🔍 STEP 1: Verifying NOTION_API_KEY Environment Variable');
        console.log('=' .repeat(60));
        
        if (!this.apiKey) {
            console.error('❌ CRITICAL: NOTION_API_KEY environment variable is not set');
            console.error('   Solution: Set NOTION_API_KEY in your .env file');
            return false;
        }

        console.log('✅ API Key exists in environment variables');
        
        // Validate key length (Notion integration keys are typically 32 chars)
        if (this.apiKey.length !== 32) {
            console.error(`❌ WARNING: API key length is ${this.apiKey.length} characters, expected 32`);
            console.error('   Notion integration keys should be exactly 32 characters');
            return false;
        }

        console.log('✅ API Key length is correct (32 characters)');
        
        // Mask the key for security logging
        const maskedKey = this.apiKey.substring(0, 4) + '****************************' + this.apiKey.substring(28);
        console.log(`✅ API Key format: ${maskedKey}`);
        
        return true;
    }

    /**
     * Validate Database ID Format
     */
    validateDatabaseId(databaseId) {
        console.log('\n🔍 STEP 2: Validating Database ID Format');
        console.log('=' .repeat(60));
        
        if (!databaseId) {
            console.error('❌ Database ID is required');
            return false;
        }

        // Remove hyphens for validation
        const cleanId = databaseId.replace(/-/g, '');
        
        // Notion database IDs should be 32 hex characters
        const uuidRegex = /^[0-9a-f]{32}$/i;
        if (!uuidRegex.test(cleanId)) {
            console.error('❌ Invalid database ID format');
            console.error('   Expected: 32-character UUID (with or without hyphens)');
            console.error(`   Received: ${databaseId}`);
            console.error('   Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
            return false;
        }

        console.log('✅ Database ID format is valid');
        console.log(`   Database ID: ${databaseId}`);
        return true;
    }

    /**
     * Test Basic Notion API Connection
     */
    async testBasicConnection() {
        console.log('\n🔍 STEP 3: Testing Basic Notion API Connection');
        console.log('=' .repeat(60));
        
        try {
            const response = await axios.get(`${this.baseUrl}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Basic API connection successful');
            console.log(`   User ID: ${response.data.id}`);
            console.log(`   User Type: ${response.data.type}`);
            console.log(`   User Name: ${response.data.name || 'N/A'}`);
            
            return true;
        } catch (error) {
            console.error('❌ Basic API connection failed');
            this.logDetailedError(error);
            return false;
        }
    }

    /**
     * Test Database Access
     */
    async testDatabaseAccess(databaseId) {
        console.log('\n🔍 STEP 4: Testing Database Access');
        console.log('=' .repeat(60));
        
        if (!this.validateDatabaseId(databaseId)) {
            return false;
        }

        try {
            const response = await axios.get(`${this.baseUrl}/databases/${databaseId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Database access successful');
            console.log(`   Database Title: ${response.data.title[0]?.plain_text || 'Untitled'}`);
            console.log(`   Database ID: ${response.data.id}`);
            console.log(`   Created Time: ${response.data.created_time}`);
            console.log(`   Last Edited: ${response.data.last_edited_time}`);
            
            return true;
        } catch (error) {
            console.error('❌ Database access failed');
            this.logDetailedError(error);
            this.suggestDatabasePermissionsFix();
            return false;
        }
    }

    /**
     * Test Database Query
     */
    async testDatabaseQuery(databaseId) {
        console.log('\n🔍 STEP 5: Testing Database Query');
        console.log('=' .repeat(60));
        
        try {
            const response = await axios.post(`${this.baseUrl}/databases/${databaseId}/query`, {
                page_size: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Database query successful');
            console.log(`   Total results: ${response.data.results.length}`);
            console.log(`   Has more: ${response.data.has_more}`);
            
            return true;
        } catch (error) {
            console.error('❌ Database query failed');
            this.logDetailedError(error);
            return false;
        }
    }

    /**
     * Test Page Creation
     */
    async testPageCreation(databaseId) {
        console.log('\n🔍 STEP 6: Testing Page Creation');
        console.log('=' .repeat(60));
        
        try {
            const testPageData = {
                parent: { database_id: databaseId },
                properties: {
                    // Use a generic title property that should exist in most databases
                    title: {
                        title: [
                            {
                                text: {
                                    content: `Test Page - ${new Date().toISOString()}`
                                }
                            }
                        ]
                    }
                }
            };

            const response = await axios.post(`${this.baseUrl}/pages`, testPageData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Page creation successful');
            console.log(`   Page ID: ${response.data.id}`);
            console.log(`   Page URL: ${response.data.url}`);
            
            // Clean up - delete the test page
            await this.deleteTestPage(response.data.id);
            
            return true;
        } catch (error) {
            console.error('❌ Page creation failed');
            this.logDetailedError(error);
            this.suggestPageCreationFix();
            return false;
        }
    }

    /**
     * Delete test page (cleanup)
     */
    async deleteTestPage(pageId) {
        try {
            await axios.patch(`${this.baseUrl}/pages/${pageId}`, {
                archived: true
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Notion-Version': this.version,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Test page cleaned up successfully');
        } catch (error) {
            console.warn(`⚠️  Could not clean up test page ${pageId}: ${error.message}`);
        }
    }

    /**
     * Log detailed error information
     */
    logDetailedError(error) {
        if (error.response) {
            console.error(`   HTTP Status: ${error.response.status}`);
            console.error(`   Status Text: ${error.response.statusText}`);
            
            if (error.response.data) {
                console.error('   Error Details:', JSON.stringify(error.response.data, null, 2));
                
                // Provide specific guidance based on error codes
                this.provideErrorGuidance(error.response.status, error.response.data);
            }
        } else if (error.request) {
            console.error('   No response received from Notion API');
            console.error('   This may indicate a network issue or API outage');
        } else {
            console.error(`   Request setup error: ${error.message}`);
        }
    }

    /**
     * Provide specific guidance based on error responses
     */
    provideErrorGuidance(status, errorData) {
        switch (status) {
            case 401:
                console.error('\n💡 GUIDANCE: Authentication failed');
                console.error('   - Check that your NOTION_API_KEY is correct');
                console.error('   - Ensure the integration is not disabled');
                console.error('   - Verify the API key hasn\'t expired');
                break;
            case 403:
                console.error('\n💡 GUIDANCE: Permission denied');
                console.error('   - The integration needs to be shared with the database');
                console.error('   - Check database permissions in Notion');
                console.error('   - Ensure the integration has the required capabilities');
                break;
            case 404:
                console.error('\n💡 GUIDANCE: Resource not found');
                console.error('   - Verify the database ID is correct');
                console.error('   - Check that the database exists and is accessible');
                console.error('   - Ensure the integration has access to the database');
                break;
            case 429:
                console.error('\n💡 GUIDANCE: Rate limit exceeded');
                console.error('   - Wait before making more requests');
                console.error('   - Implement exponential backoff in your application');
                break;
            case 500:
            case 502:
            case 503:
                console.error('\n💡 GUIDANCE: Server error');
                console.error('   - This is likely a temporary Notion API issue');
                console.error('   - Check Notion API status: https://status.notion.so/');
                console.error('   - Retry the request after a brief delay');
                break;
        }
    }

    /**
     * Suggest database permissions fix
     */
    suggestDatabasePermissionsFix() {
        console.error('\n🔧 DATABASE PERMISSIONS FIX:');
        console.error('   1. Open your Notion database');
        console.error('   2. Click "Share" in the top right corner');
        console.error('   3. Click "Invite" and search for your integration name');
        console.error('   4. Select your integration and give it "Edit" permissions');
        console.error('   5. Click "Invite" to confirm');
    }

    /**
     * Suggest page creation fix
     */
    suggestPageCreationFix() {
        console.error('\n🔧 PAGE CREATION FIX:');
        console.error('   1. Check that the database has the required properties');
        console.error('   2. Ensure the integration has "Insert content" capability');
        console.error('   3. Verify the page properties match the database schema');
        console.error('   4. Check for required properties that must be filled');
    }

    /**
     * Generate curl examples for manual testing
     */
    generateCurlExamples(databaseId) {
        console.log('\n📋 CURL EXAMPLES FOR MANUAL TESTING');
        console.log('=' .repeat(60));
        
        const maskedKey = 'secret_' + '*'.repeat(20);
        
        console.log('Test basic connection:');
        console.log(`curl -X GET "${this.baseUrl}/users/me" \\`);
        console.log(`  -H "Authorization: Bearer ${maskedKey}" \\`);
        console.log(`  -H "Notion-Version: ${this.version}"`);
        
        console.log('\nTest database access:');
        console.log(`curl -X GET "${this.baseUrl}/databases/${databaseId}" \\`);
        console.log(`  -H "Authorization: Bearer ${maskedKey}" \\`);
        console.log(`  -H "Notion-Version: ${this.version}"`);
        
        console.log('\nTest database query:');
        console.log(`curl -X POST "${this.baseUrl}/databases/${databaseId}/query" \\`);
        console.log(`  -H "Authorization: Bearer ${maskedKey}" \\`);
        console.log(`  -H "Notion-Version: ${this.version}" \\`);
        console.log(`  -H "Content-Type: application/json" \\`);
        console.log(`  -d '{"page_size": 1}'`);
    }

    /**
     * Run comprehensive diagnostic
     */
    async runDiagnostic(databaseId) {
        console.log('🚀 NOTION API COMPREHENSIVE DIAGNOSTIC');
        console.log('=' .repeat(60));
        console.log('This tool will systematically test your Notion API configuration');
        console.log('and provide specific guidance for any issues found.\n');
        
        const results = {
            envCheck: false,
            basicConnection: false,
            databaseAccess: false,
            databaseQuery: false,
            pageCreation: false
        };
        
        // Step 1: Environment Variable Check
        results.envCheck = this.verifyEnvironmentVariable();
        if (!results.envCheck) {
            console.log('\n❌ Cannot continue without valid NOTION_API_KEY');
            return results;
        }
        
        // Step 2: Basic Connection Test
        results.basicConnection = await this.testBasicConnection();
        if (!results.basicConnection) {
            console.log('\n❌ Cannot continue without basic API connection');
            return results;
        }
        
        // Steps 3-6: Database specific tests (if database ID provided)
        if (databaseId) {
            results.databaseAccess = await this.testDatabaseAccess(databaseId);
            
            if (results.databaseAccess) {
                results.databaseQuery = await this.testDatabaseQuery(databaseId);
                results.pageCreation = await this.testPageCreation(databaseId);
            }
            
            // Generate curl examples for manual testing
            this.generateCurlExamples(databaseId);
        } else {
            console.log('\n⚠️  No database ID provided - skipping database-specific tests');
            console.log('   Usage: node notion_api_debugger.js <database-id>');
        }
        
        // Summary
        this.printSummary(results);
        
        return results;
    }

    /**
     * Print diagnostic summary
     */
    printSummary(results) {
        console.log('\n📊 DIAGNOSTIC SUMMARY');
        console.log('=' .repeat(60));
        
        const status = (passed) => passed ? '✅ PASS' : '❌ FAIL';
        
        console.log(`Environment Variable Check: ${status(results.envCheck)}`);
        console.log(`Basic API Connection: ${status(results.basicConnection)}`);
        console.log(`Database Access: ${status(results.databaseAccess)}`);
        console.log(`Database Query: ${status(results.databaseQuery)}`);
        console.log(`Page Creation: ${status(results.pageCreation)}`);
        
        const passCount = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        
        console.log(`\nOverall: ${passCount}/${totalTests} tests passed`);
        
        if (passCount === totalTests) {
            console.log('\n🎉 All tests passed! Your Notion API configuration is working correctly.');
        } else {
            console.log('\n🔧 Some tests failed. Please address the issues above and run the diagnostic again.');
        }
    }
}

// CLI interface
async function main() {
    const notionDebugger = new NotionApiDebugger();
    const databaseId = process.argv[2];
    
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        console.log('Notion API Debugger');
        console.log('Usage: node notion_api_debugger.js [database-id]');
        console.log('\nOptions:');
        console.log('  database-id    Optional Notion database ID to test');
        console.log('  --help, -h     Show this help message');
        console.log('\nEnvironment Variables:');
        console.log('  NOTION_API_KEY    Your Notion integration API key (required)');
        return;
    }
    
    await notionDebugger.runDiagnostic(databaseId);
}

// Export for use as a module
module.exports = NotionApiDebugger;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}