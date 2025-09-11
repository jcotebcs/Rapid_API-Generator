import * as vscode from 'vscode';
import axios from 'axios';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-typescript';

export interface GeneratedEndpoint {
    name: string;
    path: string;
    method: string;
    parameters: Parameter[];
    responses: Response[];
    security?: SecurityRequirement[];
    examples: Example[];
    schema?: OpenAPIV3.Document;
}

export interface Parameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required: boolean;
    type: string;
    description?: string;
    example?: any;
}

export interface Response {
    statusCode: string;
    description: string;
    schema?: any;
    examples?: any;
}

export interface Example {
    name: string;
    request: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body?: any;
    };
    response: {
        status: number;
        headers: Record<string, string>;
        body: any;
    };
}

export interface SecurityRequirement {
    type: 'apiKey' | 'oauth2' | 'http';
    scheme?: string;
    name?: string;
    in?: 'query' | 'header' | 'cookie';
}

export class Generator {
    private outputDir: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('rapidapi');
        this.outputDir = config.get('outputDirectory', './src/api');
    }

    async generateFromUrl(url: string): Promise<GeneratedEndpoint> {
        try {
            // Parse RapidAPI URL to extract API information
            const apiInfo = this.parseRapidApiUrl(url);
            
            // Fetch OpenAPI specification
            const spec = await this.fetchOpenApiSpec(apiInfo);
            
            // Generate endpoint from spec
            return this.generateEndpointFromSpec(spec, apiInfo);
        } catch (error) {
            throw new Error(`Failed to generate from URL: ${error}`);
        }
    }

    private parseRapidApiUrl(url: string): any {
        // Extract API name and endpoint from RapidAPI URL
        const rapidApiMatch = url.match(/rapidapi\.com\/([^\/]+)\/([^\/]+)/);
        if (rapidApiMatch) {
            return {
                provider: rapidApiMatch[1],
                apiName: rapidApiMatch[2],
                isRapidApi: true,
                originalUrl: url
            };
        }

        // Handle direct OpenAPI spec URLs
        return {
            apiName: 'api',
            isRapidApi: false,
            specUrl: url,
            originalUrl: url
        };
    }

    private async fetchOpenApiSpec(apiInfo: any): Promise<OpenAPIV3.Document> {
        let specUrl = apiInfo.specUrl;

        if (apiInfo.isRapidApi) {
            // For RapidAPI, try to find the OpenAPI spec
            // This would typically require RapidAPI integration
            specUrl = `https://rapidapi.com/api/v1/apis/${apiInfo.provider}/${apiInfo.apiName}/openapi`;
        }

        try {
            const response = await axios.get(specUrl, {
                headers: {
                    'Accept': 'application/json, application/yaml, text/yaml'
                }
            });

            let spec: OpenAPIV3.Document;
            
            if (typeof response.data === 'string') {
                // Try parsing as YAML first, then JSON
                try {
                    spec = yaml.parse(response.data);
                } catch {
                    spec = JSON.parse(response.data);
                }
            } else {
                spec = response.data;
            }

            return spec;
        } catch (error) {
            // Fallback: generate a basic spec structure
            return this.generateBasicSpec(apiInfo);
        }
    }

    private generateBasicSpec(apiInfo: any): OpenAPIV3.Document {
        return {
            openapi: '3.0.0',
            info: {
                title: apiInfo.apiName,
                version: '1.0.0',
                description: `Generated API client for ${apiInfo.apiName}`
            },
            servers: [
                {
                    url: apiInfo.isRapidApi ? 'https://rapidapi.com' : apiInfo.originalUrl
                }
            ],
            paths: {
                '/': {
                    get: {
                        summary: 'Default endpoint',
                        responses: {
                            '200': {
                                description: 'Success',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    private generateEndpointFromSpec(spec: OpenAPIV3.Document, apiInfo: any): GeneratedEndpoint {
        const paths = spec.paths;
        const firstPath = Object.keys(paths)[0];
        const pathItem = paths[firstPath];
        const method = Object.keys(pathItem!)[0] as any;
        const operation = (pathItem as any)[method];

        const parameters: Parameter[] = [];
        if (operation.parameters) {
            operation.parameters.forEach((param: any) => {
                parameters.push({
                    name: param.name,
                    in: param.in,
                    required: param.required || false,
                    type: param.schema?.type || 'string',
                    description: param.description,
                    example: param.example
                });
            });
        }

        const responses: Response[] = [];
        if (operation.responses) {
            Object.keys(operation.responses).forEach(statusCode => {
                const response = operation.responses[statusCode];
                responses.push({
                    statusCode,
                    description: response.description,
                    schema: response.content?.['application/json']?.schema,
                    examples: response.content?.['application/json']?.examples
                });
            });
        }

        const examples = this.generateExamples(firstPath, method, parameters, spec);

        return {
            name: apiInfo.apiName,
            path: firstPath,
            method: method.toUpperCase(),
            parameters,
            responses,
            examples,
            schema: spec
        };
    }

    private generateExamples(path: string, method: string, parameters: Parameter[], spec: OpenAPIV3.Document): Example[] {
        const examples: Example[] = [];
        
        const baseUrl = spec.servers?.[0]?.url || 'https://api.example.com';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        // Add RapidAPI headers if applicable
        if (baseUrl.includes('rapidapi')) {
            headers['X-RapidAPI-Key'] = '${RAPIDAPI_KEY}';
            headers['X-RapidAPI-Host'] = '${RAPIDAPI_HOST}';
        }

        examples.push({
            name: 'Basic Request',
            request: {
                url: `${baseUrl}${path}`,
                method: method.toUpperCase(),
                headers,
                body: method.toLowerCase() === 'post' ? {} : undefined
            },
            response: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: { message: 'Success' }
            }
        });

        return examples;
    }

    async generateTypes(schema?: OpenAPIV3.Document): Promise<void> {
        if (!schema) return;

        const config = vscode.workspace.getConfiguration('rapidapi');
        if (!config.get('autoGenerateTypes', true)) return;

        try {
            await this.ensureOutputDirectory();
            
            const typesContent = this.generateTypeScriptInterfaces(schema);
            const typesPath = path.join(vscode.workspace.rootPath || '', this.outputDir, 'types.ts');
            
            await fs.promises.writeFile(typesPath, typesContent);
            vscode.window.showInformationMessage(`Types generated at ${typesPath}`);
        } catch (error) {
            throw new Error(`Failed to generate types: ${error}`);
        }
    }

    private generateTypeScriptInterfaces(schema: OpenAPIV3.Document): string {
        let interfaces = `// Generated TypeScript interfaces from OpenAPI schema\n\n`;
        
        if (schema.components?.schemas) {
            Object.keys(schema.components.schemas).forEach(schemaName => {
                const schemaObj = schema.components!.schemas![schemaName] as OpenAPIV3.SchemaObject;
                interfaces += this.schemaToInterface(schemaName, schemaObj);
            });
        }

        return interfaces;
    }

    private schemaToInterface(name: string, schema: OpenAPIV3.SchemaObject): string {
        let interfaceStr = `export interface ${name} {\n`;
        
        if (schema.properties) {
            Object.keys(schema.properties).forEach(propName => {
                const prop = schema.properties![propName] as OpenAPIV3.SchemaObject;
                const isRequired = schema.required?.includes(propName);
                const tsType = this.openApiTypeToTsType(prop);
                
                interfaceStr += `  ${propName}${isRequired ? '' : '?'}: ${tsType};\n`;
            });
        }
        
        interfaceStr += '}\n\n';
        return interfaceStr;
    }

    private openApiTypeToTsType(schema: OpenAPIV3.SchemaObject): string {
        switch (schema.type) {
            case 'string':
                return 'string';
            case 'number':
            case 'integer':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'array':
                if (schema.items) {
                    const itemType = this.openApiTypeToTsType(schema.items as OpenAPIV3.SchemaObject);
                    return `${itemType}[]`;
                }
                return 'any[]';
            case 'object':
                return 'object';
            default:
                return 'any';
        }
    }

    async generateClient(endpoint: GeneratedEndpoint): Promise<void> {
        try {
            await this.ensureOutputDirectory();
            
            const clientContent = this.generateClientCode(endpoint);
            const clientPath = path.join(vscode.workspace.rootPath || '', this.outputDir, `${endpoint.name}Client.ts`);
            
            await fs.promises.writeFile(clientPath, clientContent);
            vscode.window.showInformationMessage(`Client generated at ${clientPath}`);
        } catch (error) {
            throw new Error(`Failed to generate client: ${error}`);
        }
    }

    private generateClientCode(endpoint: GeneratedEndpoint): string {
        return `// Generated API client for ${endpoint.name}
import { RapidApiClient } from '../rapidapiClient';

export class ${endpoint.name}Client {
    private client: RapidApiClient;

    constructor() {
        this.client = new RapidApiClient();
    }

    async ${endpoint.method.toLowerCase()}${endpoint.name}(${this.generateParameterList(endpoint.parameters)}): Promise<any> {
        const options = {
            method: '${endpoint.method}',
            url: '${endpoint.path}',
            params: {${this.generateParamsObject(endpoint.parameters.filter(p => p.in === 'query'))}},
            headers: {${this.generateHeadersObject(endpoint.parameters.filter(p => p.in === 'header'))}}
        };

        return this.client.request(options);
    }

    // Example usage:
    ${this.generateExampleUsage(endpoint)}
}
`;
    }

    private generateParameterList(parameters: Parameter[]): string {
        return parameters
            .map(p => `${p.name}${p.required ? '' : '?'}: ${p.type}`)
            .join(', ');
    }

    private generateParamsObject(params: Parameter[]): string {
        return params
            .map(p => `${p.name}`)
            .join(', ');
    }

    private generateHeadersObject(headers: Parameter[]): string {
        return headers
            .map(h => `'${h.name}': ${h.name}`)
            .join(', ');
    }

    private generateExampleUsage(endpoint: GeneratedEndpoint): string {
        const example = endpoint.examples[0];
        if (!example) return '// No examples available';

        return `
    /*
    Example usage:
    const client = new ${endpoint.name}Client();
    const result = await client.${endpoint.method.toLowerCase()}${endpoint.name}(${this.generateExampleParams(endpoint.parameters)});
    console.log(result);
    */`;
    }

    private generateExampleParams(parameters: Parameter[]): string {
        return parameters
            .map(p => p.example !== undefined ? `${p.example}` : `'example_${p.name}'`)
            .join(', ');
    }

    generateApiCall(endpoint: any): string {
        return `// RapidAPI call for ${endpoint.name}
const response = await fetch('${endpoint.url}', {
    method: '${endpoint.method}',
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
});

const data = await response.json();
console.log(data);`;
    }

    private async ensureOutputDirectory(): Promise<void> {
        const fullPath = path.join(vscode.workspace.rootPath || '', this.outputDir);
        await fs.promises.mkdir(fullPath, { recursive: true });
    }
}