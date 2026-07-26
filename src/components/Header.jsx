import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="window-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
      </div>

      <div className="header-title">
        hey clicky — Edited
      </div>

      <div className="header-right">
        <span className="nav-item">Essentials ▾</span>
      </div>
    </header>
  );
}
