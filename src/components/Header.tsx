import React from 'react';

export const Header: React.FC = () => {
  return (
    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 'bold', 
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem'
      }}>
        ⚡ RapidAPI Generator
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: 'rgba(255, 255, 255, 0.8)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        Convert any API URL into production-ready TypeScript code instantly
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          ✅ TypeScript Generated
        </span>
        <span style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          🚀 Zero Setup Required
        </span>
        <span style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          📁 Instant Download
        </span>
      </div>
    </header>
  );
};