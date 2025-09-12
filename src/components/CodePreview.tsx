import React, { useState } from 'react';
import { GeneratedCode } from '../types';

interface CodePreviewProps {
  generatedCode: GeneratedCode;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ generatedCode }) => {
  const [activeTab, setActiveTab] = useState<keyof GeneratedCode>('client');

  const tabs: Array<{ key: keyof GeneratedCode; label: string; icon: string }> = [
    { key: 'types', label: 'Types', icon: '🔧' },
    { key: 'client', label: 'Client', icon: '⚡' },
    { key: 'examples', label: 'Examples', icon: '📖' },
    { key: 'packageJson', label: 'Package.json', icon: '📦' },
    { key: 'readme', label: 'README', icon: '📝' }
  ];

  const getLanguage = (key: keyof GeneratedCode) => {
    switch (key) {
      case 'packageJson':
        return 'json';
      case 'readme':
        return 'markdown';
      default:
        return 'typescript';
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        ✨ Generated Code Preview
      </h2>
      
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key 
                ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Code Content */}
      <div className="code-preview">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {tabs.find(t => t.key === activeTab)?.label} ({getLanguage(activeTab)})
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedCode[activeTab]);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            📋 Copy
          </button>
        </div>
        
        <pre style={{
          margin: 0,
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '0.85rem',
          lineHeight: '1.4'
        }}>
          <code>{generatedCode[activeTab]}</code>
        </pre>
      </div>

      {/* File Structure Info */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <strong>📁 Generated Files:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          <li><code>types.ts</code> - TypeScript interface definitions</li>
          <li><code>client.ts</code> - API client with full CRUD operations</li>
          <li><code>examples.ts</code> - Usage examples and demos</li>
          <li><code>package.json</code> - Project dependencies and scripts</li>
          <li><code>README.md</code> - Complete documentation</li>
        </ul>
      </div>
    </div>
  );
};