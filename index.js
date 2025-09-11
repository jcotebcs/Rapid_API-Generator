#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Creates or updates a file with user confirmation
 * @param {string} filePath - Path to the file to create or update
 * @param {string} content - Content to write to the file
 * @param {boolean} force - Skip confirmation if true
 * @returns {Promise<boolean>} - True if file was created/updated, false if cancelled
 */
async function create_or_update_file(filePath, content, force = false) {
    const fileExists = fs.existsSync(filePath);
    const action = fileExists ? 'update' : 'create';
    
    console.log(`\n📝 File Operation Request:`);
    console.log(`   Action: ${action.toUpperCase()}`);
    console.log(`   Path: ${filePath}`);
    if (fileExists) {
        const stats = fs.statSync(filePath);
        console.log(`   Current size: ${stats.size} bytes`);
        console.log(`   Last modified: ${stats.mtime.toISOString()}`);
    }
    console.log(`   New content size: ${content.length} bytes\n`);

    if (!force) {
        const confirmed = await askConfirmation(`Are you sure you wish to execute the "create_or_update_file" tool?`);
        if (!confirmed) {
            console.log('❌ Operation cancelled by user.');
            return false;
        }
    }

    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        }

        // Write the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ File ${action}d successfully: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error ${action}ing file:`, error.message);
        return false;
    }
}

/**
 * Asks user for confirmation with a yes/no prompt
 * @param {string} message - The question to ask
 * @returns {Promise<boolean>} - True if user confirms, false otherwise
 */
function askConfirmation(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`${message} (y/N): `, (answer) => {
            rl.close();
            const confirmed = answer.toLowerCase().trim() === 'y' || answer.toLowerCase().trim() === 'yes';
            resolve(confirmed);
        });
    });
}

/**
 * Demo function to show the tool in action
 */
async function demo() {
    console.log('🚀 RapidAPI Generator - File Creation Tool Demo\n');
    
    const testFile = './example-api.js';
    const apiCode = `// Generated RapidAPI integration code
const axios = require('axios');

class RapidAPIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://rapidapi.com';
    }
    
    async makeRequest(endpoint, options = {}) {
        try {
            const response = await axios({
                url: endpoint,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': options.host || 'api.rapidapi.com',
                    ...options.headers
                },
                ...options
            });
            return response.data;
        } catch (error) {
            console.error('API request failed:', error.message);
            throw error;
        }
    }
}

module.exports = RapidAPIClient;
`;

    await create_or_update_file(testFile, apiCode);
    
    // Show another example with updating the same file
    if (fs.existsSync(testFile)) {
        console.log('\n📝 Now attempting to update the same file...\n');
        const updatedCode = apiCode + '\n// Updated with additional functionality\nconsole.log("File updated!");';
        await create_or_update_file(testFile, updatedCode);
    }
}

module.exports = {
    create_or_update_file,
    askConfirmation,
    demo
};

// Run demo if this file is executed directly
if (require.main === module) {
    demo().catch(console.error);
}