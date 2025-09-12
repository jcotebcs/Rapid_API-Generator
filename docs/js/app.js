// RapidAPI Generator - Interactive Frontend
// JavaScript for handling API requests and UI interactions

class RapidAPITester {
    constructor() {
        this.apiKey = '';
        this.currentRequest = null;
        this.requestStartTime = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadAPIExamples();
    }

    initializeElements() {
        // Get all DOM elements
        this.elements = {
            apiKey: document.getElementById('apiKey'),
            toggleKey: document.getElementById('toggleKey'),
            apiSelect: document.getElementById('apiSelect'),
            customEndpoint: document.getElementById('customEndpoint'),
            customUrl: document.getElementById('customUrl'),
            customHost: document.getElementById('customHost'),
            requestMethod: document.getElementById('requestMethod'),
            requestBody: document.getElementById('requestBody'),
            bodyContent: document.getElementById('bodyContent'),
            testApi: document.getElementById('testApi'),
            clearResults: document.getElementById('clearResults'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            responseContainer: document.getElementById('responseContainer'),
            responseMetadata: document.getElementById('responseMetadata'),
            responseStatus: document.getElementById('responseStatus'),
            responseTime: document.getElementById('responseTime'),
            responseSize: document.getElementById('responseSize')
        };
    }

    bindEvents() {
        // API Key input and validation
        this.elements.apiKey.addEventListener('input', () => {
            this.validateApiKey();
        });

        // Toggle API key visibility
        this.elements.toggleKey.addEventListener('click', () => {
            this.toggleKeyVisibility();
        });

        // API selection dropdown
        this.elements.apiSelect.addEventListener('change', () => {
            this.handleApiSelection();
        });

        // Request method change
        this.elements.requestMethod.addEventListener('change', () => {
            this.handleMethodChange();
        });

        // Test API button
        this.elements.testApi.addEventListener('click', () => {
            this.testAPI();
        });

        // Clear results button
        this.elements.clearResults.addEventListener('click', () => {
            this.clearResults();
        });
    }

    loadAPIExamples() {
        this.apiExamples = {
            weather: {
                name: 'Weather API',
                url: 'https://weatherapi-com.p.rapidapi.com/current.json',
                host: 'weatherapi-com.p.rapidapi.com',
                method: 'GET',
                params: '?q=London&aqi=no',
                description: 'Get current weather data for a city'
            },
            quotes: {
                name: 'Random Quotes API',
                url: 'https://famous-quotes4.p.rapidapi.com/random',
                host: 'famous-quotes4.p.rapidapi.com',
                method: 'GET',
                params: '?category=inspirational&count=1',
                description: 'Get random inspirational quotes'
            },
            joke: {
                name: 'Dad Jokes API',
                url: 'https://dad-jokes.p.rapidapi.com/random/joke',
                host: 'dad-jokes.p.rapidapi.com',
                method: 'GET',
                params: '',
                description: 'Get a random dad joke'
            },
            trivia: {
                name: 'Trivia Questions API',
                url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
                host: 'trivia-by-api-ninjas.p.rapidapi.com',
                method: 'GET',
                params: '?category=general',
                description: 'Get random trivia questions'
            },
            currency: {
                name: 'Currency Exchange API',
                url: 'https://currency-exchange.p.rapidapi.com/exchange',
                host: 'currency-exchange.p.rapidapi.com',
                method: 'GET',
                params: '?from=USD&to=EUR&q=1.0',
                description: 'Convert currency rates'
            }
        };
    }

    validateApiKey() {
        const apiKey = this.elements.apiKey.value.trim();
        this.apiKey = apiKey;
        
        // Enable/disable test button based on API key presence
        const isValid = apiKey.length > 10; // Basic validation
        this.elements.testApi.disabled = !isValid;
        
        if (isValid) {
            this.elements.apiKey.style.borderColor = '#27ae60';
        } else if (apiKey.length > 0) {
            this.elements.apiKey.style.borderColor = '#e74c3c';
        } else {
            this.elements.apiKey.style.borderColor = '#ecf0f1';
        }
    }

    toggleKeyVisibility() {
        const isPassword = this.elements.apiKey.type === 'password';
        this.elements.apiKey.type = isPassword ? 'text' : 'password';
        this.elements.toggleKey.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    }

    handleApiSelection() {
        const selectedApi = this.elements.apiSelect.value;
        
        if (selectedApi === 'custom') {
            this.elements.customEndpoint.style.display = 'block';
        } else {
            this.elements.customEndpoint.style.display = 'none';
            
            if (selectedApi && this.apiExamples[selectedApi]) {
                const example = this.apiExamples[selectedApi];
                this.elements.requestMethod.value = example.method;
                this.handleMethodChange();
            }
        }
    }

    handleMethodChange() {
        const method = this.elements.requestMethod.value;
        const showBody = method === 'POST' || method === 'PUT';
        this.elements.requestBody.style.display = showBody ? 'block' : 'none';
        
        if (showBody && !this.elements.bodyContent.value) {
            this.elements.bodyContent.value = '{\n  "example": "value"\n}';
        }
    }

    async testAPI() {
        if (!this.apiKey) {
            this.showError('Please enter a valid API key');
            return;
        }

        const selectedApi = this.elements.apiSelect.value;
        if (!selectedApi) {
            this.showError('Please select an API to test');
            return;
        }

        this.showLoading();
        this.requestStartTime = Date.now();

        try {
            let url, headers;
            
            if (selectedApi === 'custom') {
                url = this.elements.customUrl.value;
                const host = this.elements.customHost.value;
                
                if (!url || !host) {
                    this.showError('Please provide both custom URL and host');
                    return;
                }
                
                headers = {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': host
                };
            } else {
                const example = this.apiExamples[selectedApi];
                url = example.url + (example.params || '');
                headers = {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': example.host
                };
            }

            const method = this.elements.requestMethod.value;
            const options = {
                method: method,
                headers: headers
            };

            // Add body for POST/PUT requests
            if ((method === 'POST' || method === 'PUT') && this.elements.bodyContent.value) {
                try {
                    options.body = JSON.stringify(JSON.parse(this.elements.bodyContent.value));
                    options.headers['Content-Type'] = 'application/json';
                } catch (e) {
                    this.showError('Invalid JSON in request body');
                    return;
                }
            }

            console.log('Making API request to:', url);
            console.log('Options:', options);

            const response = await fetch(url, options);
            const responseTime = Date.now() - this.requestStartTime;
            
            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            this.showResponse(response, responseData, responseTime);

        } catch (error) {
            console.error('API request failed:', error);
            this.showError(`Request failed: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        this.elements.loadingIndicator.style.display = 'block';
        this.elements.responseContainer.style.display = 'none';
        this.elements.responseMetadata.style.display = 'none';
        this.elements.testApi.disabled = true;
    }

    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
        this.elements.testApi.disabled = false;
    }

    showResponse(response, data, responseTime) {
        // Show response container
        this.elements.responseContainer.style.display = 'block';
        this.elements.responseMetadata.style.display = 'block';

        // Format and display response data
        const responseDiv = document.createElement('div');
        responseDiv.className = `response-content ${response.ok ? 'response-success' : 'response-error'}`;
        
        let formattedData;
        if (typeof data === 'object') {
            formattedData = this.formatJSON(data);
        } else {
            formattedData = data;
        }
        
        responseDiv.innerHTML = formattedData;
        
        // Clear previous response and add new one
        this.elements.responseContainer.innerHTML = '';
        this.elements.responseContainer.appendChild(responseDiv);

        // Update metadata
        this.elements.responseStatus.textContent = `${response.status} ${response.statusText}`;
        this.elements.responseStatus.className = `value ${response.ok ? 'status-success' : 'status-error'}`;
        this.elements.responseTime.textContent = `${responseTime}ms`;
        
        // Calculate response size
        const responseSize = JSON.stringify(data).length;
        this.elements.responseSize.textContent = this.formatBytes(responseSize);
    }

    showError(message) {
        this.elements.responseContainer.style.display = 'block';
        this.elements.responseMetadata.style.display = 'none';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'response-content response-error';
        errorDiv.textContent = message;
        
        this.elements.responseContainer.innerHTML = '';
        this.elements.responseContainer.appendChild(errorDiv);
    }

    clearResults() {
        this.elements.responseContainer.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-cloud"></i>
                <p>API response will appear here after making a request</p>
            </div>
        `;
        this.elements.responseMetadata.style.display = 'none';
    }

    formatJSON(obj) {
        const jsonString = JSON.stringify(obj, null, 2);
        return this.syntaxHighlight(jsonString);
    }

    syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RapidAPITester();
    
    // Add some nice console messages for developers
    console.log('%c🚀 RapidAPI Generator loaded successfully!', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c⚠️ Remember: Never share your API keys publicly!', 'color: #f39c12; font-size: 12px;');
    console.log('%c📚 Visit https://docs.rapidapi.com/ for more information', 'color: #27ae60; font-size: 12px;');
});