import React, { useEffect } from 'react';

interface StatusMessageProps {
  error: string | null;
  success: string | null;
  onClear: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  error,
  success,
  onClear
}) => {
  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(onClear, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, onClear]);

  if (!error && !success) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {error && (
        <div className="error" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>❌ {error}</span>
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              marginLeft: '1rem'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {success && (
        <div className="success" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{success}</span>
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#86efac',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              marginLeft: '1rem'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};