import React from 'react';

interface ActionButtonsProps {
  onDownload: () => void;
  onGitHubPush: () => void;
  onNotionSave: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownload,
  onGitHubPush,
  onNotionSave,
  disabled = false
}) => {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        🚀 Choose Your Action
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {/* Download Button */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Download Files</h4>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Download all generated TypeScript files to your computer
          </p>
          <button
            className="button"
            onClick={onDownload}
            disabled={disabled}
            style={{ width: '100%' }}
          >
            📥 Download ZIP
          </button>
        </div>

        {/* GitHub Button */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐙</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Push to GitHub</h4>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Create a new repository and push the generated code
          </p>
          <button
            className="button"
            onClick={onGitHubPush}
            disabled={disabled}
            style={{ width: '100%' }}
          >
            🚀 Create Repo
          </button>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginTop: '0.5rem' 
          }}>
            Coming Soon
          </div>
        </div>

        {/* Notion Button */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Save to Notion</h4>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Document the API in your Notion database
          </p>
          <button
            className="button"
            onClick={onNotionSave}
            disabled={disabled}
            style={{ width: '100%' }}
          >
            📝 Save Docs
          </button>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            marginTop: '0.5rem' 
          }}>
            Coming Soon
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#a5b4fc' }}>
          💡 Pro Tips:
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1.5rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <li>Download files first to review the generated code</li>
          <li>The client includes error handling and TypeScript types</li>
          <li>Examples show you exactly how to use each API endpoint</li>
          <li>GitHub integration will create a complete, ready-to-use repository</li>
        </ul>
      </div>
    </div>
  );
};