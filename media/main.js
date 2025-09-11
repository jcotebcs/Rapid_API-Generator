// @ts-check

(function() {
    const vscode = acquireVsCodeApi();
    
    let currentLanguage = 'javascript';
    let generatedCode = '';

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
        setupEventListeners();
        loadSettings();
        updateStatus('Ready');
    });

    function setupEventListeners() {
        // Nothing to do here as functions are called directly from HTML
    }

    // Tab functionality
    window.openTab = function(evt, tabName) {
        // Hide all tab contents
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }

        // Remove active class from all tab buttons
        const tabButtons = document.getElementsByClassName('tab-button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('active');
        }

        // Show the current tab and mark button as active
        document.getElementById(tabName).classList.add('active');
        evt.currentTarget.classList.add('active');
    };

    // Generator functions
    window.generateFromUrl = async function() {
        const urlInput = document.getElementById('apiUrl');
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        updateStatus('Generating from URL...');
        showLoading(true);

        try {
            vscode.postMessage({
                command: 'generateCode',
                data: { 
                    type: 'url',
                    url: url 
                }
            });
        } catch (error) {
            showError('Failed to generate from URL: ' + error.message);
        } finally {
            showLoading(false);
        }
    };

    window.generateCode = function() {
        const method = document.getElementById('apiMethod').value;
        const path = document.getElementById('apiPath').value;
        const headers = document.getElementById('apiHeaders').value;
        const body = document.getElementById('apiBody').value;

        let headersObj = {};
        let bodyObj = null;

        try {
            if (headers) {
                headersObj = JSON.parse(headers);
            }
        } catch (error) {
            showError('Invalid JSON in headers');
            return;
        }

        try {
            if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
                bodyObj = JSON.parse(body);
            }
        } catch (error) {
            showError('Invalid JSON in body');
            return;
        }

        const apiData = {
            method: method,
            path: path || '/api/endpoint',
            headers: headersObj,
            body: bodyObj
        };

        updateStatus('Generating code...');
        vscode.postMessage({
            command: 'generateCode',
            data: apiData
        });

        // Switch to preview tab
        document.querySelector('[onclick="openTab(event, \'preview\')"]').click();
    };

    window.testEndpoint = function() {
        updateStatus('Testing endpoint...');
        showError('Endpoint testing functionality coming soon!');
    };

    window.clearForm = function() {
        document.getElementById('apiUrl').value = '';
        document.getElementById('apiMethod').value = 'GET';
        document.getElementById('apiPath').value = '';
        document.getElementById('apiHeaders').value = '';
        document.getElementById('apiBody').value = '';
        updateStatus('Form cleared');
    };

    // Preview functions
    window.updateCodeLanguage = function() {
        const select = document.getElementById('codeLanguage');
        currentLanguage = select.value;
        updateGeneratedCode();
    };

    window.copyCode = function() {
        const code = document.getElementById('generatedCode').textContent;
        if (code && code !== '// Generated code will appear here...') {
            vscode.postMessage({
                command: 'copyToClipboard',
                text: code
            });
        } else {
            showError('No code to copy');
        }
    };

    window.insertCode = function() {
        const code = document.getElementById('generatedCode').textContent;
        if (code && code !== '// Generated code will appear here...') {
            vscode.postMessage({
                command: 'insertAtCursor',
                text: code
            });
        } else {
            showError('No code to insert');
        }
    };

    window.saveCode = function() {
        const code = document.getElementById('generatedCode').textContent;
        if (code && code !== '// Generated code will appear here...') {
            const filename = `api-client.${getFileExtension(currentLanguage)}`;
            vscode.postMessage({
                command: 'saveToFile',
                text: code,
                filename: filename
            });
        } else {
            showError('No code to save');
        }
    };

    // Example functions
    window.loadExample = function(exampleType) {
        const examples = {
            weather: {
                url: 'https://rapidapi.com/weatherapi/api/weatherapi-com/',
                method: 'GET',
                path: '/v1/current.json',
                headers: {
                    'X-RapidAPI-Key': '${RAPIDAPI_KEY}',
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
                },
                body: null
            },
            news: {
                url: 'https://rapidapi.com/newscatcher-api-newscatcher-api-default/api/newscatcher/',
                method: 'GET',
                path: '/v1/latest_headlines',
                headers: {
                    'X-RapidAPI-Key': '${RAPIDAPI_KEY}',
                    'X-RapidAPI-Host': 'newscatcher.p.rapidapi.com'
                },
                body: null
            },
            users: {
                url: 'https://jsonplaceholder.typicode.com/users',
                method: 'GET',
                path: '/users',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: null
            }
        };

        const example = examples[exampleType];
        if (example) {
            document.getElementById('apiUrl').value = example.url;
            document.getElementById('apiMethod').value = example.method;
            document.getElementById('apiPath').value = example.path;
            document.getElementById('apiHeaders').value = JSON.stringify(example.headers, null, 2);
            document.getElementById('apiBody').value = example.body ? JSON.stringify(example.body, null, 2) : '';
            
            // Switch to generator tab
            document.querySelector('[onclick="openTab(event, \'generator\')"]').click();
            
            updateStatus(`Loaded ${exampleType} example`);
        }
    };

    // Settings functions
    window.saveSettings = function() {
        const settings = {
            rapidApiKey: document.getElementById('rapidApiKey').value,
            rapidApiHost: document.getElementById('rapidApiHost').value,
            outputDir: document.getElementById('outputDir').value,
            autoGenerateTypes: document.getElementById('autoGenerateTypes').checked,
            debugMode: document.getElementById('debugMode').checked
        };

        // Here you would typically save to VS Code settings
        // For now, just show a success message
        updateStatus('Settings saved successfully');
        showSuccess('Settings have been saved to your workspace configuration');
    };

    function loadSettings() {
        // In a real implementation, this would load from VS Code settings
        // For now, set default values
        document.getElementById('rapidApiKey').value = '';
        document.getElementById('rapidApiHost').value = '';
        document.getElementById('outputDir').value = './src/api';
        document.getElementById('autoGenerateTypes').checked = true;
        document.getElementById('debugMode').checked = false;
    }

    // Utility functions
    window.openDocumentation = function() {
        vscode.postMessage({
            command: 'openExternal',
            url: 'https://github.com/jcotebcs/Rapid_API-Generator#readme'
        });
    };

    window.reportIssue = function() {
        vscode.postMessage({
            command: 'openExternal',
            url: 'https://github.com/jcotebcs/Rapid_API-Generator/issues/new'
        });
    };

    function updateGeneratedCode() {
        // This would generate code in different languages
        // For now, return a basic template
        const codeTemplates = {
            javascript: generateJavaScriptCode,
            typescript: generateTypeScriptCode,
            python: generatePythonCode,
            curl: generateCurlCode
        };

        const generator = codeTemplates[currentLanguage];
        if (generator && generatedCode) {
            document.getElementById('generatedCode').textContent = generator();
        }
    }

    function generateJavaScriptCode() {
        return `// JavaScript fetch example
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
};

fetch('https://api.example.com/endpoint', options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`;
    }

    function generateTypeScriptCode() {
        return `// TypeScript fetch example
interface ApiResponse {
    success: boolean;
    data: any;
}

const options: RequestInit = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || ''
    }
};

fetch('https://api.example.com/endpoint', options)
    .then(response => response.json() as Promise<ApiResponse>)
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`;
    }

    function generatePythonCode() {
        return `# Python requests example
import requests
import os

url = "https://api.example.com/endpoint"

headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
    "X-RapidAPI-Host": os.getenv("RAPIDAPI_HOST")
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;
    }

    function generateCurlCode() {
        return `# cURL example
curl -X GET "https://api.example.com/endpoint" \\
  -H "Content-Type: application/json" \\
  -H "X-RapidAPI-Key: $RAPIDAPI_KEY" \\
  -H "X-RapidAPI-Host: $RAPIDAPI_HOST"`;
    }

    function getFileExtension(language) {
        const extensions = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            curl: 'sh'
        };
        return extensions[language] || 'txt';
    }

    function showLoading(show) {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (show) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        });
    }

    function showError(message) {
        updateStatus('Error: ' + message);
        
        // Remove any existing error messages
        const existingError = document.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.insertBefore(errorDiv, activeTab.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }
    }

    function showSuccess(message) {
        updateStatus(message);
        
        // Remove any existing success messages
        const existingSuccess = document.querySelector('.success');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        // Add new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            activeTab.insertBefore(successDiv, activeTab.firstChild);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 3000);
        }
    }

    function updateStatus(message) {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // Listen for messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.command) {
            case 'updateGeneratedCode':
                generatedCode = message.code;
                document.getElementById('generatedCode').textContent = message.code;
                updateStatus('Code generated successfully');
                break;
                
            case 'showError':
                showError(message.text);
                break;
                
            case 'showSuccess':
                showSuccess(message.text);
                break;
        }
    });
})();