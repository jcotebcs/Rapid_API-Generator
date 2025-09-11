import React from 'react'
import { GeneratedCode } from '../types'

interface DownloadSectionProps {
  code: GeneratedCode
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ code }) => {
  const downloadAsZip = () => {
    // Create a simple zip-like structure as a text file for now
    // In a real implementation, you'd use a library like JSZip
    const allFiles = code.files.map(file => 
      `// File: ${file.name}\n${file.content}\n\n${'='.repeat(50)}\n\n`
    ).join('')
    
    const projectContent = `# ${code.projectName}\n\n${code.description}\n\n## Generated Files\n\n${allFiles}`
    
    const blob = new Blob([projectContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${code.projectName.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyProjectStructure = async () => {
    const structure = code.files.map(file => file.name).join('\n')
    try {
      await navigator.clipboard.writeText(structure)
    } catch (err) {
      console.error('Failed to copy project structure:', err)
    }
  }

  return (
    <div className="download-section">
      <h2>Download Options</h2>
      
      <div className="download-options">
        <div className="download-option">
          <div className="option-content">
            <h3>📁 Download Project</h3>
            <p>Get all generated files as a downloadable package</p>
            <button onClick={downloadAsZip} className="download-button primary">
              Download ZIP
            </button>
          </div>
        </div>

        <div className="download-option">
          <div className="option-content">
            <h3>📋 Copy Structure</h3>
            <p>Copy the project file structure to clipboard</p>
            <button onClick={copyProjectStructure} className="download-button secondary">
              Copy Structure
            </button>
          </div>
        </div>

        <div className="download-option">
          <div className="option-content">
            <h3>🔗 Create GitHub Repo</h3>
            <p>Automatically create a new GitHub repository (Coming Soon)</p>
            <button disabled className="download-button disabled">
              Create Repo
            </button>
          </div>
        </div>

        <div className="download-option">
          <div className="option-content">
            <h3>📊 Save to Notion</h3>
            <p>Save project documentation to Notion database (Coming Soon)</p>
            <button disabled className="download-button disabled">
              Save to Notion
            </button>
          </div>
        </div>
      </div>

      <div className="usage-instructions">
        <h3>🚀 Getting Started</h3>
        <ol>
          <li>Download the generated project files</li>
          <li>Run <code>npm install</code> to install dependencies</li>
          <li>Update the API key in the configuration</li>
          <li>Start building your application!</li>
        </ol>
      </div>
    </div>
  )
}

export default DownloadSection