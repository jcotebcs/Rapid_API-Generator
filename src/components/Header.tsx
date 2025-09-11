import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <span className="logo">🚀</span>
          <span className="brand-text">RapidAPI Generator</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#examples" className="nav-link">Examples</a>
          <a href="https://github.com/jcotebcs/Rapid_API-Generator" target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header