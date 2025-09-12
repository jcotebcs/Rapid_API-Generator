import React from 'react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  value,
  onChange,
  onGenerate,
  isLoading,
  placeholder = "Enter API URL here..."
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label 
          htmlFor="api-url" 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}
        >
          🔗 API URL
        </label>
        <input
          id="api-url"
          type="url"
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          style={{ marginBottom: '1rem' }}
        />
      </div>
      
      <button
        type="submit"
        className="button"
        disabled={isLoading || !value.trim()}
        style={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        {isLoading ? (
          <>
            <div className="loading"></div>
            Generating Code...
          </>
        ) : (
          <>
            ⚡ Generate TypeScript Code
          </>
        )}
      </button>
      
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <strong>💡 Supported URLs:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>OpenAPI/Swagger specification URLs (.json, .yaml)</li>
          <li>RapidAPI marketplace URLs</li>
          <li>API documentation URLs</li>
          <li>Direct API endpoints (we'll try to find the spec)</li>
        </ul>
      </div>
    </form>
  );
};