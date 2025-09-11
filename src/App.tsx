import React, { useState } from 'react'
import Header from './components/Header'
import URLInput from './components/URLInput'
import CodePreview from './components/CodePreview'
import DownloadSection from './components/DownloadSection'
import { generateTypeScriptCode } from './utils/codeGenerator'
import { GeneratedCode } from './types'
import './styles/App.css'

function App() {
  const [rapidApiUrl, setRapidApiUrl] = useState<string>('')
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateCode = async (url: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const code = await generateTypeScriptCode(url)
      setGeneratedCode(code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating code')
      setGeneratedCode(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <section className="hero-section">
          <h1>RapidAPI Generator</h1>
          <p>Convert RapidAPI URLs to production-ready TypeScript code instantly</p>
        </section>

        <div className="generator-container">
          <URLInput
            value={rapidApiUrl}
            onChange={setRapidApiUrl}
            onGenerate={handleGenerateCode}
            isLoading={isLoading}
          />

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {generatedCode && (
            <>
              <CodePreview code={generatedCode} />
              <DownloadSection code={generatedCode} />
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Built with ❤️ by <a href="https://github.com/jcotebcs" target="_blank" rel="noopener noreferrer">jcotebcs</a></p>
        <p>
          <a href="https://github.com/jcotebcs/Rapid_API-Generator" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App