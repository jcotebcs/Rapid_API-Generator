// RapidAPI Client Template
const axios = require('axios');

class RapidAPIClient {
    constructor(apiKey, host) {
        this.apiKey = apiKey;
        this.host = host;
        this.baseURL = 'https://' + host;
    }
    
    async get(endpoint, params = {}) {
        return this.makeRequest('GET', endpoint, { params });
    }
    
    async post(endpoint, data = {}) {
        return this.makeRequest('POST', endpoint, { data });
    }
    
    async makeRequest(method, endpoint, options = {}) {
        try {
            const config = {
                method,
                url: this.baseURL + endpoint,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.host,
                    'Content-Type': 'application/json'
                },
                ...options
            };
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`RapidAPI ${method} request failed:`, error.message);
            throw error;
        }
    }
}

module.exports = RapidAPIClient;