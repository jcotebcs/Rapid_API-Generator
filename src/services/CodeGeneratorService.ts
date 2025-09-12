import { OpenAPISpec, GeneratedCode, GenerationOptions, ApiEndpoint, Parameter } from '../types';

export class CodeGeneratorService {
  /**
   * Generate TypeScript code from OpenAPI specification
   */
  static generateCode(spec: OpenAPISpec, options: GenerationOptions): GeneratedCode {
    const apiName = this.sanitizeApiName(spec.info.title);
    const endpoints = this.parseEndpoints(spec);
    
    return {
      types: this.generateTypes(spec, endpoints),
      client: this.generateClient(spec, endpoints, options),
      examples: options.includeExamples ? this.generateExamples(spec, endpoints) : '',
      packageJson: this.generatePackageJson(apiName, spec.info.version),
      readme: this.generateReadme(spec, endpoints)
    };
  }

  /**
   * Generate TypeScript type definitions
   */
  private static generateTypes(spec: OpenAPISpec, endpoints: ApiEndpoint[]): string {
    const apiName = this.sanitizeApiName(spec.info.title);
    
    let types = `// Generated TypeScript types for ${spec.info.title}
// Version: ${spec.info.version}
// Generated at: ${new Date().toISOString()}

export interface ${apiName}Config {
  baseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  response?: any;
}

`;

    // Generate interfaces for each endpoint's parameters and responses
    endpoints.forEach(endpoint => {
      const methodName = this.getMethodName(endpoint);
      
      // Parameters interface
      if (endpoint.parameters.length > 0) {
        types += `export interface ${methodName}Params {\n`;
        endpoint.parameters.forEach(param => {
          const optional = param.required ? '' : '?';
          types += `  ${param.name}${optional}: ${param.type};\n`;
        });
        types += '}\n\n';
      }

      // Response interface
      types += `export interface ${methodName}Response {\n`;
      types += '  [key: string]: any;\n';
      types += '}\n\n';
    });

    return types;
  }

  /**
   * Generate API client code
   */
  private static generateClient(spec: OpenAPISpec, endpoints: ApiEndpoint[], _options: GenerationOptions): string {
    const apiName = this.sanitizeApiName(spec.info.title);
    const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';

    let client = `// Generated API client for ${spec.info.title}
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ${apiName}Config, ApiResponse, ApiError`;

    // Import parameter and response types
    endpoints.forEach(endpoint => {
      const methodName = this.getMethodName(endpoint);
      if (endpoint.parameters.length > 0) {
        client += `, ${methodName}Params`;
      }
      client += `, ${methodName}Response`;
    });

    client += ` } from './types';

export class ${apiName}Client {
  private client: AxiosInstance;
  private config: ${apiName}Config;

  constructor(config: ${apiName}Config = {}) {
    this.config = {
      baseUrl: '${baseUrl}',
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey })
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          response: error.response?.data
        };
        return Promise.reject(apiError);
      }
    );
  }

`;

    // Generate methods for each endpoint
    endpoints.forEach(endpoint => {
      const methodName = this.getMethodName(endpoint);
      const hasParams = endpoint.parameters.length > 0;
      const paramsType = hasParams ? `params: ${methodName}Params` : '';
      
      client += `  /**
   * ${endpoint.summary || `${endpoint.method.toUpperCase()} ${endpoint.path}`}
   * ${endpoint.description || ''}
   */
  async ${methodName}(${paramsType}): Promise<ApiResponse<${methodName}Response>> {
`;

      // Build URL with path parameters
      let urlPath = endpoint.path;
      const pathParams = endpoint.parameters.filter(p => p.location === 'path');
      pathParams.forEach(param => {
        urlPath = urlPath.replace(`{${param.name}}`, `\${params.${param.name}}`);
      });

      // Build query parameters
      const queryParams = endpoint.parameters.filter(p => p.location === 'query');
      if (queryParams.length > 0) {
        client += `    const queryParams = new URLSearchParams();\n`;
        queryParams.forEach(param => {
          const condition = param.required ? '' : `if (params.${param.name} !== undefined) `;
          client += `    ${condition}queryParams.append('${param.name}', String(params.${param.name}));\n`;
        });
      }

      // Make the request
      const method = endpoint.method.toLowerCase();
      const url = queryParams.length > 0 ? `\`${urlPath}?\${queryParams.toString()}\`` : `\`${urlPath}\``;
      
      if (method === 'get' || method === 'delete') {
        client += `    const response = await this.client.${method}(${url});\n`;
      } else {
        const bodyParams = endpoint.parameters.filter(p => p.location === 'body');
        const bodyData = bodyParams.length > 0 ? 'params' : '{}';
        client += `    const response = await this.client.${method}(${url}, ${bodyData});\n`;
      }

      client += `    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }

`;
    });

    client += '}\n\nexport default ' + apiName + 'Client;';
    
    return client;
  }

  /**
   * Generate usage examples
   */
  private static generateExamples(spec: OpenAPISpec, endpoints: ApiEndpoint[]): string {
    const apiName = this.sanitizeApiName(spec.info.title);
    
    let examples = `// Usage examples for ${spec.info.title}
import { ${apiName}Client } from './${apiName.toLowerCase()}-client';

// Initialize the client
const client = new ${apiName}Client({
  apiKey: 'your-api-key-here',
  headers: {
    'X-Custom-Header': 'custom-value'
  }
});

// Example usage
async function examples() {
  try {
`;

    endpoints.slice(0, 3).forEach(endpoint => { // Show first 3 endpoints as examples
      const methodName = this.getMethodName(endpoint);
      examples += `    // ${endpoint.summary || endpoint.path}\n`;
      
      if (endpoint.parameters.length > 0) {
        examples += `    const ${methodName}Result = await client.${methodName}({\n`;
        endpoint.parameters.slice(0, 3).forEach(param => { // Show first 3 params
          const exampleValue = this.getExampleValue(param.type);
          examples += `      ${param.name}: ${exampleValue},\n`;
        });
        examples += `    });\n`;
      } else {
        examples += `    const ${methodName}Result = await client.${methodName}();\n`;
      }
      
      examples += `    console.log('${methodName}:', ${methodName}Result.data);\n\n`;
    });

    examples += `  } catch (error) {
    console.error('API Error:', error);
  }
}

examples();`;

    return examples;
  }

  /**
   * Generate package.json
   */
  private static generatePackageJson(apiName: string, version: string): string {
    const packageName = apiName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    return JSON.stringify({
      name: `${packageName}-client`,
      version: version || '1.0.0',
      description: `TypeScript client for ${apiName} API`,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        test: 'jest'
      },
      dependencies: {
        axios: '^1.6.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        typescript: '^5.0.0',
        jest: '^29.0.0',
        '@types/jest': '^29.0.0'
      },
      keywords: ['api', 'client', 'typescript', apiName.toLowerCase()],
      author: 'RapidAPI Generator',
      license: 'MIT'
    }, null, 2);
  }

  /**
   * Generate README.md
   */
  private static generateReadme(spec: OpenAPISpec, endpoints: ApiEndpoint[]): string {
    const apiName = this.sanitizeApiName(spec.info.title);
    
    return `# ${spec.info.title} TypeScript Client

${spec.info.description || 'Generated TypeScript client for ' + spec.info.title}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`typescript
import { ${apiName}Client } from './${apiName.toLowerCase()}-client';

const client = new ${apiName}Client({
  apiKey: 'your-api-key',
  baseUrl: '${spec.servers?.[0]?.url || 'https://api.example.com'}'
});

// Example usage
const result = await client.${this.getMethodName(endpoints[0] || { path: '/', method: 'get', summary: 'example', parameters: [], responses: [] })}();
console.log(result.data);
\`\`\`

## Available Methods

${endpoints.map(endpoint => {
  const methodName = this.getMethodName(endpoint);
  return `### ${methodName}
- **Path**: \`${endpoint.method.toUpperCase()} ${endpoint.path}\`
- **Description**: ${endpoint.description || endpoint.summary || 'No description available'}
${endpoint.parameters.length > 0 ? `- **Parameters**: ${endpoint.parameters.map(p => `\`${p.name}\` (${p.type})`).join(', ')}` : ''}`;
}).join('\n\n')}

## Configuration

\`\`\`typescript
const client = new ${apiName}Client({
  baseUrl: 'https://api.example.com',  // API base URL
  apiKey: 'your-api-key',              // API key for authentication
  headers: {                           // Additional headers
    'X-Custom-Header': 'value'
  }
});
\`\`\`

## Error Handling

\`\`\`typescript
try {
  const result = await client.someMethod();
  console.log(result.data);
} catch (error) {
  console.error('API Error:', error.message);
  console.error('Status:', error.status);
}
\`\`\`

## Generated by RapidAPI Generator

This client was automatically generated from the OpenAPI specification.
`;
  }

  /**
   * Parse endpoints from OpenAPI spec
   */
  private static parseEndpoints(spec: OpenAPISpec): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];

    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (typeof operation === 'object' && operation.responses) {
          const parameters: Parameter[] = [];
          
          // Parse parameters
          if (operation.parameters) {
            operation.parameters.forEach((param: any) => {
              parameters.push({
                name: param.name,
                type: this.getTypeFromSchema(param.schema),
                required: param.required || false,
                location: param.in as any,
                description: param.description
              });
            });
          }

          endpoints.push({
            path,
            method,
            summary: operation.summary,
            description: operation.description,
            parameters,
            responses: Object.entries(operation.responses).map(([statusCode, response]: [string, any]) => ({
              statusCode,
              description: response.description,
              schema: response.content
            }))
          });
        }
      });
    });

    return endpoints;
  }

  /**
   * Generate method name from endpoint
   */
  private static getMethodName(endpoint: ApiEndpoint): string {
    const pathParts = endpoint.path.split('/').filter(part => part && !part.startsWith('{'));
    const baseName = pathParts.join('_') || 'api';
    return endpoint.method + baseName.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, c => c.toUpperCase());
  }

  /**
   * Sanitize API name for class names
   */
  private static sanitizeApiName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Get TypeScript type from OpenAPI schema
   */
  private static getTypeFromSchema(schema: any): string {
    if (!schema) return 'any';
    
    switch (schema.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        return `${this.getTypeFromSchema(schema.items)}[]`;
      case 'object':
        return 'object';
      default:
        return 'any';
    }
  }

  /**
   * Get example value for parameter type
   */
  private static getExampleValue(type: string): string {
    switch (type) {
      case 'string':
        return "'example'";
      case 'number':
        return '123';
      case 'boolean':
        return 'true';
      default:
        return "'example'";
    }
  }
}