import { GeneratedCode, RapidApiSpec, ApiEndpoint, TypeScriptInterface } from '../types'

export const generateTypeScriptCode = async (url: string): Promise<GeneratedCode> => {
  // For demo purposes, we'll simulate API spec parsing
  // In a real implementation, this would fetch and parse the actual OpenAPI spec
  
  const mockApiSpec = await simulateApiSpecFetch(url)
  const projectName = mockApiSpec.info.title.replace(/[^a-zA-Z0-9]/g, '') + 'Client'
  
  // Generate TypeScript interfaces
  const interfaces = generateInterfaces(mockApiSpec)
  
  // Generate API client
  const apiClient = generateApiClient(mockApiSpec, interfaces)
  
  // Generate types file
  const typesFile = generateTypesFile(interfaces)
  
  // Generate package.json
  const packageJson = generatePackageJson(projectName, mockApiSpec.info.description || '')
  
  // Generate README
  const readme = generateReadme(projectName, mockApiSpec)
  
  // Generate example usage
  const examples = generateExamples(projectName, mockApiSpec)

  return {
    files: [
      {
        name: 'package.json',
        content: packageJson,
        type: 'json'
      },
      {
        name: 'src/types.ts',
        content: typesFile,
        type: 'typescript'
      },
      {
        name: 'src/api-client.ts',
        content: apiClient,
        type: 'typescript'
      },
      {
        name: 'src/examples.ts',
        content: examples,
        type: 'typescript'
      },
      {
        name: 'README.md',
        content: readme,
        type: 'markdown'
      }
    ],
    projectName,
    description: mockApiSpec.info.description || 'Generated TypeScript API client',
    apiUrl: url
  }
}

const simulateApiSpecFetch = async (url: string): Promise<RapidApiSpec> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Extract API name from URL for demo
  let apiName = 'Demo API'
  if (url.includes('weather')) {
    apiName = 'Weather API'
  } else if (url.includes('finance')) {
    apiName = 'Yahoo Finance API'
  } else if (url.includes('geocoding')) {
    apiName = 'Geocoding API'
  }
  
  return {
    openapi: '3.0.0',
    info: {
      title: apiName,
      description: `Generated client for ${apiName}`,
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    paths: {
      '/data': {
        get: {
          summary: 'Get data',
          description: 'Retrieve data from the API',
          parameters: [
            {
              name: 'query',
              in: 'query',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array' },
                      status: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        DataResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { type: 'object' }
            },
            status: { type: 'string' }
          }
        }
      }
    }
  }
}

const generateInterfaces = (spec: RapidApiSpec): TypeScriptInterface[] => {
  const interfaces: TypeScriptInterface[] = []
  
  // Generate base response interface
  interfaces.push({
    name: 'ApiResponse',
    properties: {
      data: 'any',
      status: 'string',
      'message?': 'string'
    },
    description: 'Base API response interface'
  })
  
  // Generate interfaces from schemas
  if (spec.components?.schemas) {
    Object.entries(spec.components.schemas).forEach(([name, schema]) => {
      if (schema.type === 'object' && schema.properties) {
        const properties: Record<string, string> = {}
        Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
          properties[propName] = mapSchemaTypeToTS(propSchema)
        })
        
        interfaces.push({
          name,
          properties,
          description: schema.description
        })
      }
    })
  }
  
  return interfaces
}

const mapSchemaTypeToTS = (schema: any): string => {
  switch (schema.type) {
    case 'string': return 'string'
    case 'number': return 'number'
    case 'integer': return 'number'
    case 'boolean': return 'boolean'
    case 'array': return `${mapSchemaTypeToTS(schema.items)}[]`
    case 'object': return 'object'
    default: return 'any'
  }
}

const generateTypesFile = (interfaces: TypeScriptInterface[]): string => {
  let content = '// Generated TypeScript types\n\n'
  
  interfaces.forEach(iface => {
    if (iface.description) {
      content += `/**\n * ${iface.description}\n */\n`
    }
    content += `export interface ${iface.name} {\n`
    Object.entries(iface.properties).forEach(([prop, type]) => {
      const optional = prop.endsWith('?') ? '?' : ''
      const cleanProp = prop.replace('?', '')
      content += `  ${cleanProp}${optional}: ${type};\n`
    })
    content += '}\n\n'
  })
  
  return content
}

const generateApiClient = (spec: RapidApiSpec, interfaces: TypeScriptInterface[]): string => {
  const className = spec.info.title.replace(/[^a-zA-Z0-9]/g, '') + 'Client'
  
  return `// Generated API Client
import { ApiResponse } from './types';

export class ${className} {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, baseUrl = '${spec.servers[0]?.url || 'https://api.example.com'}') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': new URL(this.baseUrl).hostname,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get data from the API
   */
  async getData(query: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(\`/data?query=\${encodeURIComponent(query)}\`);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/health');
  }
}

export default ${className};`
}

const generatePackageJson = (projectName: string, description: string): string => {
  const packageObj = {
    name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    version: '1.0.0',
    description,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      build: 'tsc',
      dev: 'tsc --watch',
      test: 'jest',
      start: 'node dist/index.js'
    },
    dependencies: {
      'cross-fetch': '^3.1.5'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      jest: '^29.0.0',
      '@types/jest': '^29.0.0'
    },
    keywords: ['api', 'client', 'typescript', 'rapidapi'],
    author: 'Generated by RapidAPI Generator',
    license: 'MIT'
  }
  
  return JSON.stringify(packageObj, null, 2)
}

const generateReadme = (projectName: string, spec: RapidApiSpec): string => {
  return `# ${projectName}

${spec.info.description || 'Generated TypeScript API client'}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`typescript
import ${projectName} from './${projectName.toLowerCase()}';

const client = new ${projectName}('your-api-key');

// Example usage
async function example() {
  try {
    const data = await client.getData('example query');
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Configuration

Set your RapidAPI key:

\`\`\`typescript
const client = new ${projectName}('YOUR_RAPIDAPI_KEY');
\`\`\`

## API Methods

### getData(query: string)

Retrieve data from the API.

**Parameters:**
- \`query\` (string): Search query parameter

**Returns:** Promise<ApiResponse>

## Generated by

This client was generated using [RapidAPI Generator](https://jcotebcs.github.io/Rapid_API-Generator/).
`
}

const generateExamples = (projectName: string, spec: RapidApiSpec): string => {
  return `// Example usage of ${projectName}
import ${projectName} from './api-client';

// Initialize the client
const client = new ${projectName}('your-rapidapi-key-here');

// Example 1: Basic data retrieval
async function example1() {
  try {
    const result = await client.getData('example query');
    console.log('Data received:', result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Example 2: Health check
async function example2() {
  try {
    const health = await client.healthCheck();
    console.log('Service status:', health.status);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Example 3: Error handling
async function example3() {
  try {
    const result = await client.getData('test');
    
    // Process successful response
    if (result.status === 'success') {
      console.log('Success:', result.data);
    } else {
      console.log('API returned error:', result.message);
    }
  } catch (error) {
    // Handle network or HTTP errors
    if (error instanceof Error) {
      console.error('Request failed:', error.message);
    }
  }
}

// Run examples
if (require.main === module) {
  console.log('Running ${projectName} examples...');
  example1();
  example2();
  example3();
}

export { example1, example2, example3 };`
}