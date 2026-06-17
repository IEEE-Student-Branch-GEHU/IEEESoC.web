'use client';

import React from 'react';

export default function Header({ currentView, onViewChange }) {
  const isDarkTheme = currentView === 'command';

  return (
    <header className={`header-custom ${isDarkTheme ? 'dark' : ''}`}>
      <div className="logo-container">
        <div className="logo-monogram">S</div>
        <div className="logo-text">IEEEsoc&apos;26</div>
      </div>
      
      <nav className="nav-links">
        <button 
          onClick={() => onViewChange('editorial')} 
          className={`nav-link ${currentView === 'editorial' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', fontStyle: 'inherit' }}
        >
          Manifesto
        </button>
        <button 
          onClick={() => onViewChange('command')} 
          className={`nav-link ${currentView === 'command' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', fontStyle: 'inherit' }}
        >
          Command Center
        </button>
      </nav>
    </header>
  );
}
