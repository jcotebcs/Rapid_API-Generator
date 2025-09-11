import React, { useState } from 'react'
import { GeneratedCode } from '../types'

interface CodePreviewProps {
  code: GeneratedCode
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState(0)

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="code-preview-section">
      <div className="preview-header">
        <h2>Generated Code Preview</h2>
        <div className="project-info">
          <h3>{code.projectName}</h3>
          <p>{code.description}</p>
        </div>
      </div>

      <div className="code-tabs">
        <div className="tab-headers">
          {code.files.map((file, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`tab-header ${activeTab === index ? 'active' : ''}`}
            >
              <span className="file-icon">
                {file.type === 'typescript' ? '📝' : file.type === 'json' ? '⚙️' : '📄'}
              </span>
              {file.name}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {code.files.map((file, index) => (
            <div
              key={index}
              className={`tab-panel ${activeTab === index ? 'active' : ''}`}
            >
              <div className="code-header">
                <span className="file-name">{file.name}</span>
                <button
                  onClick={() => copyToClipboard(file.content)}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              </div>
              <pre className="code-content">
                <code className={`language-${file.type}`}>
                  {file.content}
                </code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-stats">
        <div className="stat">
          <span className="stat-value">{code.files.length}</span>
          <span className="stat-label">Files Generated</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {code.files.reduce((total, file) => total + file.content.split('\n').length, 0)}
          </span>
          <span className="stat-label">Lines of Code</span>
        </div>
        <div className="stat">
          <span className="stat-value">TypeScript</span>
          <span className="stat-label">Language</span>
        </div>
      </div>
    </div>
  )
}

export default CodePreview