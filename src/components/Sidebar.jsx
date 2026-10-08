import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoRsq from '../assets/logo rsq.jpeg';

import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function Sidebar({
  role = 'admin', //admin/super admin
  activeMenu = 'Data Modul',
  isOpen = false,
  onClose = () => {},
  onSelectMenu
}) {
  const navigate = useNavigate();
  const isSuperAdmin = role === 'super_admin' || role === 'SUPER ADMIN' || role === 'superadmin';

  const handleMenuClick = (item) => {
    if (onSelectMenu) {
      onSelectMenu(item.name);
    }
    if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  const menuSections = [
    {
      title: 'UTAMA',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <GridViewOutlinedIcon sx={{ fontSize: 20 }} />
        }
      ]
    },
    {
      title: 'MASTER & LOGISTIK',
      items: [
        {
          name: 'Data Modul',
          path: '/data-modul',
          icon: <MenuBookOutlinedIcon sx={{ fontSize: 20 }} />
        },
        {
          name: 'Modul Masuk',
          path: '/modul-masuk',
          icon: <UploadFileOutlinedIcon sx={{ fontSize: 20 }} />
        },
        // Jika Super Admin Verifikasi Stok Opname, Jika Admin Stok Opname
        isSuperAdmin
          ? {
              name: 'Verifikasi Stok Opname',
              path: '/verifikasi-stok-opname',
              icon: <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
            }
          : {
              name: 'Stok Opname',
              path: '/stok-opname',
              icon: <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
            },
        {
          name: 'Pesanan & Kirim',
          path: '/pesanan-kirim',
          icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
        }
      ]
    },
    {
      title: 'REKAPITULASI',
      items: [
        {
          name: 'Laporan Stok',
          path: '/laporan-stok',
          icon: <BarChartOutlinedIcon sx={{ fontSize: 20 }} />
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
        {/* Header Logo & Judul*/}
        <div style={styles.brandContainer}>
          <div style={styles.brandLogoWrapper}>
            <img src={logoRsq} alt="Logo RSQ" style={styles.logoImage} />
          </div>
          <div style={styles.brandTitle}>Inventory RSQ</div>
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
                    onClick={() => handleMenuClick(item)}
                    style={{
                      ...styles.navItem,
                      ...(isActive ? styles.navItemActive : {})
                    }}
                  >
                    <span style={isActive ? styles.navIconActive : styles.navIcon}>
                      {item.icon}
                    </span>
                    <span style={styles.navLabel}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Profil & Logout */}
        <div style={styles.sidebarFooter}>
          <div style={styles.footerItem} onClick={() => navigate('/profil')}>
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20, color: '#3d5246' }} />
            <span style={styles.footerLabel}>Profil Saya</span>
          </div>
          <div style={{ ...styles.footerItem, color: '#c62828' }} onClick={() => navigate('/login')}>
            <LogoutOutlinedIcon sx={{ fontSize: 20, color: '#c62828' }} />
            <span style={{ ...styles.footerLabel, color: '#c62828' }}>Keluar</span>
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
    minHeight: '100vh',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #eef2ef',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    userSelect: 'none',
    boxSizing: 'border-box'
  },
  brandContainer: {
    height: '74px',
    padding: '0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxSizing: 'border-box'
  },
  brandLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  logoImage: {
    width: '56px',
    height: '56px',
    objectFit: 'contain'
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a3e2b',
    letterSpacing: '-0.2px',
    whiteSpace: 'nowrap'
  },
  navScroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 16px 20px'
  },
  sectionContainer: {
    marginBottom: '22px'
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#8da897',
    letterSpacing: '0.8px',
    padding: '0 8px',
    marginBottom: '10px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '11px 16px',
    borderRadius: '12px',
    color: '#3d5246',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px'
  },
  navItemActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(35, 87, 60, 0.28)'
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    color: '#4a6555'
  },
  navIconActive: {
    display: 'flex',
    alignItems: 'center',
    color: '#ffffff'
  },
  navLabel: {
    fontSize: '14px',
    fontWeight: 'inherit'
  },
  sidebarFooter: {
    marginTop: 'auto',
    height: '97px',
    borderTop: '1px solid #edf2ef',
    padding: '10px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    boxSizing: 'border-box'
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '500',
    color: '#3d5246',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  footerLabel: {
    fontSize: '13.5px',
    fontWeight: '500'
  }
};
