export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        parameters?: Array<{
          name: string;
          in: string;
          required?: boolean;
          schema: any;
        }>;
        responses: {
          [statusCode: string]: {
            description: string;
            content?: any;
          };
        };
      };
    };
  };
  components?: {
    schemas?: {
      [name: string]: any;
    };
  };
}

export interface GeneratedCode {
  types: string;
  client: string;
  examples: string;
  packageJson: string;
  readme: string;
}

export interface GenerationOptions {
  includeExamples: boolean;
  includeTests: boolean;
  outputFormat: 'typescript' | 'javascript';
  clientType: 'axios' | 'fetch';
}

export interface ApiEndpoint {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  parameters: Parameter[];
  responses: Response[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  location: 'query' | 'path' | 'header' | 'body';
  description?: string;
}

export interface Response {
  statusCode: string;
  description: string;
  schema?: any;
}

export interface GitHubConfig {
  token: string;
  username: string;
  repoName: string;
}

export interface NotionConfig {
  token: string;
  databaseId: string;
}