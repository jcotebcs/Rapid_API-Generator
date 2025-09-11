import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as vscode from 'vscode';

export interface RapidApiConfig {
    apiKey?: string;
    host?: string;
    baseURL?: string;
    timeout?: number;
}

export interface RequestOptions extends AxiosRequestConfig {
    rapidApiKey?: string;
    rapidApiHost?: string;
}

export class RapidApiClient {
    private client: AxiosInstance;
    private config: RapidApiConfig;

    constructor(config?: RapidApiConfig) {
        this.config = this.loadConfig(config);
        this.client = this.createClient();
    }

    private loadConfig(userConfig?: RapidApiConfig): RapidApiConfig {
        const vscodeConfig = vscode.workspace.getConfiguration('rapidapi');
        
        return {
            apiKey: userConfig?.apiKey || vscodeConfig.get('apiKey') || process.env.RAPIDAPI_KEY,
            host: userConfig?.host || process.env.RAPIDAPI_HOST,
            baseURL: userConfig?.baseURL || 'https://rapidapi.com',
            timeout: userConfig?.timeout || 30000,
            ...userConfig
        };
    }

    private createClient(): AxiosInstance {
        const client = axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'RapidAPI-VSCode-Extension/1.0.0'
            }
        });

        // Request interceptor
        client.interceptors.request.use(
            (config) => {
                // Add RapidAPI headers if available
                if (this.config.apiKey) {
                    config.headers['X-RapidAPI-Key'] = this.config.apiKey;
                }
                if (this.config.host) {
                    config.headers['X-RapidAPI-Host'] = this.config.host;
                }

                // Log request details in development
                if (vscode.workspace.getConfiguration('rapidapi').get('debug', false)) {
                    console.log(`[RapidAPI] ${config.method?.toUpperCase()} ${config.url}`);
                }

                return config;
            },
            (error) => {
                console.error('[RapidAPI] Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        client.interceptors.response.use(
            (response) => {
                // Log response details in development
                if (vscode.workspace.getConfiguration('rapidapi').get('debug', false)) {
                    console.log(`[RapidAPI] Response ${response.status} from ${response.config.url}`);
                }

                return response;
            },
            (error) => {
                console.error('[RapidAPI] Response error:', error);
                
                // Handle common RapidAPI errors
                if (error.response) {
                    const { status, data } = error.response;
                    
                    switch (status) {
                        case 401:
                            vscode.window.showErrorMessage('RapidAPI: Invalid API key. Please check your configuration.');
                            break;
                        case 403:
                            vscode.window.showErrorMessage('RapidAPI: Access denied. Check your subscription or API limits.');
                            break;
                        case 429:
                            vscode.window.showErrorMessage('RapidAPI: Rate limit exceeded. Please wait before making more requests.');
                            break;
                        case 500:
                            vscode.window.showErrorMessage('RapidAPI: Server error. Please try again later.');
                            break;
                        default:
                            vscode.window.showErrorMessage(`RapidAPI: Error ${status} - ${data?.message || 'Unknown error'}`);
                    }
                }

                return Promise.reject(error);
            }
        );

        return client;
    }

    async request<T = any>(options: RequestOptions): Promise<T> {
        try {
            // Override RapidAPI headers if provided in options
            const headers: any = { ...options.headers };
            if (options.rapidApiKey) {
                headers['X-RapidAPI-Key'] = options.rapidApiKey;
            }
            if (options.rapidApiHost) {
                headers['X-RapidAPI-Host'] = options.rapidApiHost;
            }

            const config: AxiosRequestConfig = {
                ...options,
                headers
            };

            const response: AxiosResponse<T> = await this.client.request(config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async get<T = any>(url: string, config?: RequestOptions): Promise<T> {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    async post<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
        return this.request<T>({ ...config, method: 'POST', url, data });
    }

    async put<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
        return this.request<T>({ ...config, method: 'PUT', url, data });
    }

    async patch<T = any>(url: string, data?: any, config?: RequestOptions): Promise<T> {
        return this.request<T>({ ...config, method: 'PATCH', url, data });
    }

    async delete<T = any>(url: string, config?: RequestOptions): Promise<T> {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }

    // Specialized RapidAPI methods
    async testConnection(): Promise<boolean> {
        try {
            // Simple test to validate API key and connection
            await this.get('/ping');
            return true;
        } catch (error) {
            return false;
        }
    }

    async searchApis(query: string, category?: string): Promise<any[]> {
        try {
            const params: any = { search: query };
            if (category) {
                params.category = category;
            }

            const response = await this.get('/search/apis', { params });
            return response.results || [];
        } catch (error) {
            console.error('Error searching APIs:', error);
            return [];
        }
    }

    async getApiDetails(apiId: string): Promise<any> {
        try {
            return await this.get(`/apis/${apiId}`);
        } catch (error) {
            console.error('Error fetching API details:', error);
            throw error;
        }
    }

    async getApiEndpoints(apiId: string): Promise<any[]> {
        try {
            const response = await this.get(`/apis/${apiId}/endpoints`);
            return response.endpoints || [];
        } catch (error) {
            console.error('Error fetching API endpoints:', error);
            return [];
        }
    }

    async subscribeToApi(apiId: string, plan: string = 'free'): Promise<any> {
        try {
            return await this.post(`/apis/${apiId}/subscribe`, { plan });
        } catch (error) {
            console.error('Error subscribing to API:', error);
            throw error;
        }
    }

    async getSubscriptions(): Promise<any[]> {
        try {
            const response = await this.get('/subscriptions');
            return response.subscriptions || [];
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            return [];
        }
    }

    async getUsageStats(apiId?: string): Promise<any> {
        try {
            const endpoint = apiId ? `/usage/${apiId}` : '/usage';
            return await this.get(endpoint);
        } catch (error) {
            console.error('Error fetching usage stats:', error);
            return {};
        }
    }

    // Helper methods for common RapidAPI patterns
    generateCurlCommand(options: RequestOptions): string {
        const { method = 'GET', url, headers = {}, data } = options;
        
        let curlCommand = `curl -X ${method.toUpperCase()}`;
        
        // Add headers
        Object.entries(headers).forEach(([key, value]) => {
            curlCommand += ` -H "${key}: ${value}"`;
        });

        // Add RapidAPI headers
        if (this.config.apiKey) {
            curlCommand += ` -H "X-RapidAPI-Key: ${this.config.apiKey}"`;
        }
        if (this.config.host) {
            curlCommand += ` -H "X-RapidAPI-Host: ${this.config.host}"`;
        }

        // Add data for POST/PUT requests
        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            curlCommand += ` -d '${JSON.stringify(data)}'`;
        }

        curlCommand += ` "${url}"`;
        
        return curlCommand;
    }

    generateCodeSnippet(options: RequestOptions, language: 'javascript' | 'python' | 'curl' = 'javascript'): string {
        switch (language) {
            case 'curl':
                return this.generateCurlCommand(options);
            
            case 'python':
                return this.generatePythonSnippet(options);
            
            case 'javascript':
            default:
                return this.generateJavaScriptSnippet(options);
        }
    }

    private generateJavaScriptSnippet(options: RequestOptions): string {
        const { method = 'GET', url, headers = {}, data } = options;
        
        const headersObj: any = {
            'Content-Type': 'application/json',
            ...headers
        };
        
        if (this.config.apiKey) {
            headersObj['X-RapidAPI-Key'] = this.config.apiKey;
        }
        if (this.config.host) {
            headersObj['X-RapidAPI-Host'] = this.config.host;
        }

        let snippet = `const options = {
  method: '${method.toUpperCase()}',
  headers: ${JSON.stringify(headersObj, null, 2)}`;

        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            snippet += `,
  body: JSON.stringify(${JSON.stringify(data, null, 2)})`;
        }

        snippet += `
};

fetch('${url}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));`;

        return snippet;
    }

    private generatePythonSnippet(options: RequestOptions): string {
        const { method = 'GET', url, headers = {}, data } = options;
        
        const headersObj: any = {
            'Content-Type': 'application/json',
            ...headers
        };
        
        if (this.config.apiKey) {
            headersObj['X-RapidAPI-Key'] = this.config.apiKey;
        }
        if (this.config.host) {
            headersObj['X-RapidAPI-Host'] = this.config.host;
        }

        let snippet = `import requests

url = "${url}"

headers = ${JSON.stringify(headersObj, null, 2)}`;

        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            snippet += `

payload = ${JSON.stringify(data, null, 2)}

response = requests.request("${method.toUpperCase()}", url, json=payload, headers=headers)`;
        } else {
            snippet += `

response = requests.request("${method.toUpperCase()}", url, headers=headers)`;
        }

        snippet += `

print(response.text)`;

        return snippet;
    }

    private handleError(error: any): Error {
        if (error.response) {
            const message = error.response.data?.message || `HTTP ${error.response.status}`;
            return new Error(`RapidAPI Error: ${message}`);
        } else if (error.request) {
            return new Error('RapidAPI Error: Network error - please check your connection');
        } else {
            return new Error(`RapidAPI Error: ${error.message}`);
        }
    }

    // Update configuration
    updateConfig(newConfig: Partial<RapidApiConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.client = this.createClient();
    }

    // Get current configuration (without sensitive data)
    getConfig(): Omit<RapidApiConfig, 'apiKey'> {
        const { apiKey, ...safeConfig } = this.config;
        return safeConfig;
    }
}