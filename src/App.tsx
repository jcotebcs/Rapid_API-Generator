import { useState } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { CodePreview } from './components/CodePreview';
import { ActionButtons } from './components/ActionButtons';
import { StatusMessage } from './components/StatusMessage';
import { ApiSpecService } from './services/ApiSpecService';
import { CodeGeneratorService } from './services/CodeGeneratorService';
import { GeneratedCode, GenerationOptions } from './types';

interface AppState {
  url: string;
  isLoading: boolean;
  generatedCode: GeneratedCode | null;
  error: string | null;
  success: string | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    url: '',
    isLoading: false,
    generatedCode: null,
    error: null,
    success: null
  });

  const handleUrlChange = (url: string) => {
    setState(prev => ({ ...prev, url, error: null, success: null }));
  };

  const handleGenerate = async () => {
    if (!state.url.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a valid RapidAPI URL' }));
      return;
    }

    if (!ApiSpecService.isValidRapidApiUrl(state.url)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid API URL' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      // Fetch OpenAPI specification
      const spec = await ApiSpecService.fetchOpenApiSpec(state.url);
      
      // Generate TypeScript code
      const options: GenerationOptions = {
        includeExamples: true,
        includeTests: false,
        outputFormat: 'typescript',
        clientType: 'axios'
      };
      
      const generatedCode = CodeGeneratorService.generateCode(spec, options);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        generatedCode,
        success: 'Code generated successfully! 🎉'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  const handleDownload = () => {
    if (!state.generatedCode) return;

    // Create a ZIP-like structure by downloading multiple files
    const files = [
      { name: 'types.ts', content: state.generatedCode.types },
      { name: 'client.ts', content: state.generatedCode.client },
      { name: 'examples.ts', content: state.generatedCode.examples },
      { name: 'package.json', content: state.generatedCode.packageJson },
      { name: 'README.md', content: state.generatedCode.readme }
    ];

    files.forEach(file => {
      if (file.content) {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    setState(prev => ({ 
      ...prev, 
      success: 'Files downloaded successfully! 📁' 
    }));
  };

  const handleGitHubPush = async () => {
    // This would be implemented with GitHub API integration
    setState(prev => ({ 
      ...prev, 
      success: 'GitHub integration coming soon! 🚀' 
    }));
  };

  const handleNotionSave = async () => {
    // This would be implemented with Notion API integration
    setState(prev => ({ 
      ...prev, 
      success: 'Notion integration coming soon! 📊' 
    }));
  };

  const clearMessages = () => {
    setState(prev => ({ ...prev, error: null, success: null }));
  };

  return (
    <div className="container">
      <Header />
      
      <div className="card">
        <UrlInput
          value={state.url}
          onChange={handleUrlChange}
          onGenerate={handleGenerate}
          isLoading={state.isLoading}
          placeholder="https://api.example.com/openapi.json or any API URL"
        />
      </div>

      <StatusMessage
        error={state.error}
        success={state.success}
        onClear={clearMessages}
      />

      {state.generatedCode && (
        <>
          <CodePreview generatedCode={state.generatedCode} />
          
          <ActionButtons
            onDownload={handleDownload}
            onGitHubPush={handleGitHubPush}
            onNotionSave={handleNotionSave}
            disabled={!state.generatedCode}
          />
        </>
      )}
    </div>
  );
}

export default App;