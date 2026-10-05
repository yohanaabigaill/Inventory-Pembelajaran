import React from 'react';
import logoRsq from '../assets/logo-rsq.png';

export default function Sidebar({ activeMenu = 'Data Modul', isOpen = false, onClose = () => {} }) {
  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        {
          name: 'Dashboard',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'MASTER & LOGISTIK',
      items: [
        {
          name: 'Data Modul',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
            </svg>
          )
        },
        {
          name: 'Modul Masuk',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="12" y2="12" />
              <line x1="15" y1="15" x2="12" y2="12" />
            </svg>
          )
        },
        {
          name: 'Stok Opname',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          )
        },
        {
          name: 'Pesanan & Kirim',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'REKAPITULASI',
      items: [
        {
          name: 'Laporan Stok',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div onClick={onClose} className="sidebar-backdrop" />
      )}

      <aside className={`sidebar-aside ${isOpen ? 'sidebar-open' : ''}`} style={styles.sidebar}>
        <div style={styles.brandContainer}>
          <div style={styles.brandLogoWrapper}>
            <img src={logoRsq} alt="Logo Rumah Sahabat Qur'an" style={styles.logoImage} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={styles.brandTitle}>Inventory RSQ</div>
          </div>
          <button onClick={onClose} className="mobile-close-btn">&times;</button>
        </div>

        {/* Menu Navigasi */}
        <div style={styles.navScroll}>
          {menuSections.map((section, idx) => (
            <div key={idx} style={styles.sectionContainer}>
              <div style={styles.sectionTitle}>{section.title}</div>
              {section.items.map((item, itemIdx) => {
                const isActive = item.name === activeMenu;
                return (
                  <div
                    key={itemIdx}
                    onClick={onClose}
                    style={{
                      ...styles.navItem,
                      ...(isActive ? styles.navItemActive : {})
                    }}
                  >
                    <span style={isActive ? styles.navIconActive : styles.navIcon}>{item.icon}</span>
                    <span style={styles.navLabel}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Account Section */}
        <div style={styles.sidebarFooter}>
          <div style={styles.footerItem}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profil Saya</span>
          </div>
          <div style={{ ...styles.footerItem, color: '#c62828' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Keluar</span>
          </div>
        </div>
      </aside>
    </>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    minWidth: '260px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #dce4de',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'sticky',
    top: 0,
    boxShadow: '2px 0 10px rgba(0,0,0,0.02)',
    userSelect: 'none'
  },
  brandContainer: {
    padding: '12px 20px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  brandLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoImage: {
    width: '54px',
    height: '54px',
    objectFit: 'contain'
  },
  brandTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a3e2b',
    lineHeight: '1.2'
  },
  navScroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 12px 16px'
  },
  sectionContainer: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#8da897',
    letterSpacing: '1px',
    padding: '0 12px',
    marginBottom: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '10px',
    color: '#3d5246',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px'
  },
  navItemActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.22)'
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    color: '#5b7566'
  },
  navIconActive: {
    display: 'flex',
    alignItems: 'center',
    color: '#ffffff'
  },
  navLabel: {
    fontSize: '13.5px'
  },
  sidebarFooter: {
    borderTop: '1px solid #dce4de',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#3d5246',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};
