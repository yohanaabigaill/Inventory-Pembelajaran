import React from 'react';

export default function Navbar({ title = 'Data Modul', onToggleSidebar }) {
  return (
    <header style={styles.navbar}>
      <div style={styles.titleSection}>
        <button onClick={onToggleSidebar} className="hamburger-btn" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" /> <line x1="3" y1="12" x2="21" y2="12" /> <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 style={styles.pageTitle}>{title}</h1>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    height: '68px',
    backgroundColor: '#23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 10px rgba(35, 87, 60, 0.2)'
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px'
  }
};
