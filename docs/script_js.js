// RapidAPI Demo - Client-side API testing
// No secret keys stored in this file - all keys entered at runtime

// Configuration and utility functions
const API_CONFIG = {
    rapidApiBaseUrl: 'https://rapidapi.com',
    defaultTimeout: 10000,
    maxRetries: 3
};

// Utility function to show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="response-container">
            <span class="loading"></span>Loading...
        </div>
    `;
}

// Utility function to display response
function displayResponse(containerId, data, isError = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const className = isError ? 'error' : 'success';
    const icon = isError ? '❌' : '✅';
    const title = isError ? 'Error' : 'Response';
    
    container.innerHTML = `
        <div class="response-container ${className}">
            <h4>${icon} ${title}</h4>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
}

// Clear response function
function clearResponse(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// Get API credentials from user input
function getApiCredentials() {
    const keyInput = document.getElementById('rapidapi-key');
    const hostInput = document.getElementById('rapidapi-host');
    
    if (!keyInput || !hostInput) {
        console.error('API credential inputs not found');
        return null;
    }
    
    const key = keyInput.value.trim();
    const host = hostInput.value.trim();
    
    if (!key || !host) {
        alert('Please enter both RapidAPI key and host before making requests.');
        return null;
    }
    
    return { key, host };
}

// Validate API key format (basic validation)
function validateApiKey(key) {
    // RapidAPI keys are typically 50+ characters and contain alphanumeric characters
    const keyRegex = /^[a-zA-Z0-9]{40,}$/;
    return keyRegex.test(key);
}

// Create standard fetch options for RapidAPI requests
function createFetchOptions(credentials, method = 'GET', body = null) {
    const options = {
        method: method.toUpperCase(),
        headers: {
            'X-RapidAPI-Key': credentials.key,
            'X-RapidAPI-Host': credentials.host,
            'Content-Type': 'application/json'
        }
    };
    
    if (body && method.toUpperCase() !== 'GET') {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    return options;
}

// Generic API request handler with error handling
async function makeApiRequest(url, options, responseContainerId) {
    try {
        showLoading(responseContainerId);
        
        const response = await fetch(url, options);
        
        // Handle different response types
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { 
                text: await response.text(),
                status: response.status,
                statusText: response.statusText
            };
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        displayResponse(responseContainerId, data);
        return data;
        
    } catch (error) {
        const errorData = {
            error: error.message,
            timestamp: new Date().toISOString(),
            url: url.replace(/key=[^&]+/gi, 'key=***HIDDEN***') // Hide API key in logs
        };
        
        console.error('API Request failed:', errorData);
        displayResponse(responseContainerId, errorData, true);
        return null;
    }
}

// Weather API function
async function getWeather() {
    const credentials = getApiCredentials();
    if (!credentials) return;
    
    if (!validateApiKey(credentials.key)) {
        alert('API key format appears invalid. Please check your key.');
        return;
    }
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput ? cityInput.value.trim() || 'London' : 'London';
    
    // Construct the API endpoint
    const endpoint = `https://${credentials.host}/current.json?q=${encodeURIComponent(city)}`;
    const options = createFetchOptions(credentials, 'GET');
    
    await makeApiRequest(endpoint, options, 'weather-response');
}

// Quote API function
async function getQuote() {
    const credentials = getApiCredentials();
    if (!credentials) return;
    
    if (!validateApiKey(credentials.key)) {
        alert('API key format appears invalid. Please check your key.');
        return;
    }
    
    const categorySelect = document.getElementById('quote-category');
    const category = categorySelect ? categorySelect.value : '';
    
    // Construct the API endpoint
    let endpoint = `https://${credentials.host}/`;
    if (category) {
        endpoint += `?category=${encodeURIComponent(category)}`;
    }
    
    const options = createFetchOptions(credentials, 'GET');
    
    await makeApiRequest(endpoint, options, 'quote-response');
}

// Custom API request function
async function makeCustomRequest() {
    const credentials = getApiCredentials();
    if (!credentials) return;
    
    if (!validateApiKey(credentials.key)) {
        alert('API key format appears invalid. Please check your key.');
        return;
    }
    
    // Get form values
    const endpointInput = document.getElementById('custom-endpoint');
    const methodSelect = document.getElementById('http-method');
    const bodyTextarea = document.getElementById('request-body');
    
    if (!endpointInput) {
        alert('Endpoint input not found.');
        return;
    }
    
    const endpoint = endpointInput.value.trim();
    const method = methodSelect ? methodSelect.value : 'GET';
    const requestBody = bodyTextarea ? bodyTextarea.value.trim() : '';
    
    if (!endpoint) {
        alert('Please enter an endpoint URL.');
        return;
    }
    
    // Validate URL format
    try {
        new URL(endpoint);
    } catch (e) {
        alert('Please enter a valid URL.');
        return;
    }
    
    // Validate JSON body if provided
    let bodyData = null;
    if (method !== 'GET' && requestBody) {
        try {
            bodyData = JSON.parse(requestBody);
        } catch (e) {
            alert('Invalid JSON in request body. Please check your syntax.');
            return;
        }
    }
    
    const options = createFetchOptions(credentials, method, bodyData);
    
    await makeApiRequest(endpoint, options, 'custom-response');
}

// Initialize demo data and event listeners
function initializeDemo() {
    // Set default values for demo
    const hostInput = document.getElementById('rapidapi-host');
    const customEndpointInput = document.getElementById('custom-endpoint');
    
    if (hostInput && !hostInput.value) {
        hostInput.value = 'weatherapi-com.p.rapidapi.com';
    }
    
    if (customEndpointInput && !customEndpointInput.value) {
        customEndpointInput.value = 'https://weatherapi-com.p.rapidapi.com/current.json?q=Paris';
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + Enter to submit forms
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement) {
                const section = activeElement.closest('.api-section');
                if (section) {
                    const button = section.querySelector('.btn:not(.btn-secondary)');
                    if (button) {
                        button.click();
                    }
                }
            }
        }
    });
    
    // Add input validation
    const apiKeyInput = document.getElementById('rapidapi-key');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', function() {
            const key = this.value.trim();
            if (key.length > 10 && !validateApiKey(key)) {
                this.style.borderColor = '#dc3545';
                this.title = 'API key format appears invalid';
            } else {
                this.style.borderColor = '';
                this.title = '';
            }
        });
    }
    
    console.log('RapidAPI Demo initialized successfully');
}

// Popular API endpoints configuration (for reference)
const POPULAR_APIS = {
    weather: {
        host: 'weatherapi-com.p.rapidapi.com',
        endpoints: {
            current: '/current.json?q={location}',
            forecast: '/forecast.json?q={location}&days={days}',
            search: '/search.json?q={query}'
        }
    },
    quotes: {
        host: 'famous-quotes4.p.rapidapi.com',
        endpoints: {
            random: '/',
            byCategory: '/?category={category}',
            byAuthor: '/?author={author}'
        }
    },
    news: {
        host: 'newscatcher.p.rapidapi.com',
        endpoints: {
            latest: '/v1/latest_headlines',
            search: '/v1/search?q={query}',
            sources: '/v1/sources'
        }
    }
};

// Helper function to get popular API suggestions
function getApiSuggestions(category) {
    return POPULAR_APIS[category] || null;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDemo);

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getApiCredentials,
        validateApiKey,
        createFetchOptions,
        makeApiRequest,
        getApiSuggestions
    };
}