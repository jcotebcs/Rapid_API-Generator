#!/usr/bin/env node
/**
 * RapidAPI Node.js Example
 * 
 * This example demonstrates how to securely use RapidAPI with environment variables.
 * Make sure to create a .env file with your RAPIDAPI_KEY before running this script.
 */

const axios = require('axios');
require('dotenv').config();

async function main() {
    // Get the API key from environment variables
    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey || apiKey === 'your_super_secret_api_key') {
        console.error('Error: Please set a valid RAPIDAPI_KEY in your .env file');
        console.error('Copy .env.example to .env and replace with your actual API key');
        return;
    }
    
    // Example API call using RapidAPI
    // This is a generic example - replace with your specific RapidAPI endpoint
    const url = 'https://api.rapidapi.com/example-endpoint';
    
    const headers = {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api.rapidapi.com'  // Replace with actual host
    };
    
    try {
        console.log('Making API request...');
        const response = await axios.get(url, { headers });
        
        console.log('Success! API Response:');
        console.log(response.data);
        
    } catch (error) {
        if (error.response) {
            console.error(`API request failed with status code: ${error.response.status}`);
            console.error(`Response: ${error.response.data}`);
        } else if (error.request) {
            console.error('No response received from API');
            console.error(error.message);
        } else {
            console.error('Error setting up API request:', error.message);
        }
    }
}

// Run the main function
main().catch(console.error);