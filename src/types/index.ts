export interface RapidApiSpec {
  openapi: string
  info: {
    title: string
    description?: string
    version: string
  }
  servers: Array<{
    url: string
    description?: string
  }>
  paths: Record<string, any>
  components?: {
    schemas?: Record<string, any>
  }
}

export interface GeneratedFile {
  name: string
  content: string
  type: 'typescript' | 'json' | 'markdown'
}

export interface GeneratedCode {
  files: GeneratedFile[]
  projectName: string
  description: string
  apiUrl: string
}

export interface ApiEndpoint {
  method: string
  path: string
  summary?: string
  description?: string
  parameters?: any[]
  requestBody?: any
  responses?: any
}

export interface TypeScriptInterface {
  name: string
  properties: Record<string, string>
  description?: string
}