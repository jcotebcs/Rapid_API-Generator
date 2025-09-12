import { OpenAPISpec } from '../types';

export class ApiSpecService {
  /**
   * Fetch and parse OpenAPI specification from a RapidAPI URL
   */
  static async fetchOpenApiSpec(rapidApiUrl: string): Promise<OpenAPISpec> {
    try {
      // Extract API information from RapidAPI URL
      const apiInfo = this.parseRapidApiUrl(rapidApiUrl);
      
      // Try to fetch OpenAPI spec from the URL directly if it looks like a spec URL
      if (this.isOpenApiSpecUrl(rapidApiUrl)) {
        try {
          const response = await fetch(rapidApiUrl, {
            headers: {
              'Accept': 'application/json, application/yaml',
              'User-Agent': 'RapidAPI-Generator/1.0.0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && (data.openapi || data.swagger)) {
              return this.validateAndNormalizeSpec(data);
            }
          }
        } catch (error) {
          console.warn('Direct URL fetch failed:', error);
        }
      }

      // Try to fetch OpenAPI spec from common endpoints
      const possibleUrls = [
        `https://${apiInfo.host}/openapi.json`,
        `https://${apiInfo.host}/swagger.json`,
        `https://${apiInfo.host}/v1/openapi.json`,
        `https://${apiInfo.host}/api/openapi.json`,
        `https://${apiInfo.host}/docs/openapi.json`,
      ];

      for (const url of possibleUrls) {
        try {
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'RapidAPI-Generator/1.0.0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && (data.openapi || data.swagger)) {
              return this.validateAndNormalizeSpec(data);
            }
          }
        } catch (error) {
          // Continue to next URL
          continue;
        }
      }

      // If no OpenAPI spec found, create a basic one
      return this.createBasicSpec(apiInfo);
    } catch (error) {
      throw new Error(`Failed to fetch OpenAPI specification: ${error}`);
    }
  }

  /**
   * Check if URL looks like an OpenAPI specification URL
   */
  private static isOpenApiSpecUrl(url: string): boolean {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('openapi') || 
           lowerUrl.includes('swagger') || 
           lowerUrl.endsWith('.json') || 
           lowerUrl.endsWith('.yaml') || 
           lowerUrl.endsWith('.yml');
  }

  /**
   * Validate and normalize OpenAPI specification
   */
  private static validateAndNormalizeSpec(spec: any): OpenAPISpec {
    // Basic validation and normalization
    const normalizedSpec: OpenAPISpec = {
      openapi: spec.openapi || '3.0.0',
      info: {
        title: spec.info?.title || 'API',
        version: spec.info?.version || '1.0.0',
        description: spec.info?.description
      },
      servers: spec.servers || [{ url: 'https://api.example.com' }],
      paths: spec.paths || {},
      components: spec.components
    };

    return normalizedSpec;
  }

  /**
   * Parse RapidAPI URL to extract API information
   */
  private static parseRapidApiUrl(url: string) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      
      return {
        host: urlObj.hostname,
        apiName: pathParts[0] || 'unknown-api',
        version: pathParts[1] || 'v1',
        fullUrl: url
      };
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Create a basic OpenAPI spec when one cannot be fetched
   */
  private static createBasicSpec(apiInfo: any): OpenAPISpec {
    return {
      openapi: '3.0.0',
      info: {
        title: apiInfo.apiName.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) + ' API',
        version: '1.0.0',
        description: `Generated specification for ${apiInfo.apiName} API`
      },
      servers: [
        {
          url: `https://${apiInfo.host}`,
          description: 'API Server'
        }
      ],
      paths: {
        '/': {
          get: {
            summary: 'Get API information',
            description: 'Retrieve basic API information and status',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          example: 'ok'
                        },
                        message: {
                          type: 'string',
                          example: 'API is running'
                        },
                        version: {
                          type: 'string',
                          example: '1.0.0'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/health': {
          get: {
            summary: 'Health check',
            description: 'Check API health and availability',
            responses: {
              '200': {
                description: 'API is healthy',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          example: 'healthy'
                        },
                        timestamp: {
                          type: 'string',
                          format: 'date-time'
                        }
                      }
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

  /**
   * Validate if a URL looks like a valid API URL
   */
  static isValidRapidApiUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  }
}