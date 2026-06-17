'use client';

import React from 'react';

export default function Footer({ currentView }) {
  const isDark = currentView === 'command';

  return (
    <footer className={`footer-custom ${isDark ? 'dark' : ''}`}>
      <div className="container-custom">
        <div className="footer-grid">
          <div className="footer-left">
            <h3 className="footer-brand">IEEEsoc&apos;26</h3>
            <p className="footer-text">
              The official command deck and portal for the 2026 Open-Source Fellowship. 
              Subtle craftsmanship built on classical foundations.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-link-group">
              <span className="footer-link-title">Ecosystem</span>
              <a href="#hero" className="footer-link">Forum</a>
              <a href="#manifesto" className="footer-link">Manifesto</a>
              <a href="#tracks" className="footer-link">Disciplines</a>
            </div>
            
            <div className="footer-link-group">
              <span className="footer-link-title">Resources</span>
              <a 
                href="https://github.com/IEEE-Student-Branch-GEHU/IEEESoC.web" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
              >
                GitHub Repo
              </a>
              <a href="#timeline" className="footer-link">Timeline</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
