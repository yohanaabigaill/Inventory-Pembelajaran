import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRsq from '../assets/logo rsq.jpeg';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function Sidebar({
  role = 'admin', // admin / super_admin / peserta
  activeMenu = 'Data Modul',
  isOpen = false,
  onClose = () => {},
  onSelectMenu
}) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isSuperAdmin = role === 'super_admin' || role === 'SUPER ADMIN' || role === 'superadmin';
  const isPeserta = role === 'peserta' || role === 'PESERTA' || role === 'santri';

  const handleMenuClick = (item) => {
    if (onSelectMenu) {
      onSelectMenu(item.name);
    }
    if (item.path) {
      navigate(item.path);
    }
    onClose();
  };

  const adminMenuSections = [
    {
      title: 'UTAMA',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <HomeOutlinedIcon sx={{ fontSize: 23 }} />
        }
      ]
    },
    {
      title: 'MASTER & LOGISTIK',
      items: [
        {
          name: 'Jenis Modul',
          path: '/jenis-modul',
          icon: <GridViewOutlinedIcon sx={{ fontSize: 20 }} />
        },
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
          path: '/verifikasi-pembayaran',
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

  const pesertaMenuSections = [
    {
      title: '',
      items: [
        {
          name: 'Katalog Modul',
          path: '/katalog-modul',
          icon: <MenuBookOutlinedIcon sx={{ fontSize: 20 }} />
        },
        {
          name: 'Pesanan',
          path: '/pesanan',
          icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />
        }
      ]
    }
  ];

  const menuSections = isPeserta ? pesertaMenuSections : adminMenuSections;

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
              {section.title ? <div style={styles.sectionTitle}>{section.title}</div> : null}
              {section.items.map((item, itemIdx) => {
                const isActive = !showLogoutModal && item.name === activeMenu;
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

        {/* Profil & Logout */}
        <div style={styles.sidebarFooter}>
          <div
            style={{
              ...styles.footerItem,
              ...(!showLogoutModal && activeMenu === 'Profil Saya' ? styles.footerItemActive : {})
            }}
            onClick={() => navigate('/profil')}
          >
            <span style={!showLogoutModal && activeMenu === 'Profil Saya' ? styles.navIconActive : styles.navIcon}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
            <span style={styles.footerLabel}>Profil Saya</span>
          </div>
          <div
            style={{
              ...styles.footerItem,
              ...(showLogoutModal ? styles.footerItemActive : { color: '#c62828' })
            }}
            onClick={() => {
              onClose();
              setShowLogoutModal(true);
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', color: showLogoutModal ? '#ffffff' : '#c62828' }}>
              <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
            </span>
            <span style={{ ...styles.footerLabel, color: showLogoutModal ? '#ffffff' : '#c62828' }}>Keluar</span>
          </div>
        </div>
      </aside>

      {/* Modal Pop Up Konfirmasi Keluar */}
      {showLogoutModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalBody}>
              <div style={styles.modalIconBox}>
                <LogoutOutlinedIcon sx={{ fontSize: 32, color: '#23573c' }} />
              </div>
              <h3 style={styles.modalTitle}>Konfirmasi Keluar</h3>
              <p style={styles.modalDesc}>
                Apakah Anda yakin ingin keluar dari sistem? Anda harus masuk kembali untuk mengakses akun Anda.
              </p>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={styles.btnModalBatal}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  navigate('/login');
                }}
                style={styles.btnModalKeluar}
              >
                <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
    borderTop: '1px solid #edf2ef',
    padding: '12px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px',
    boxSizing: 'border-box'
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '11px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#3d5246',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '4px',
    boxSizing: 'border-box'
  },
  footerItemActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(35, 87, 60, 0.28)'
  },
  footerLabel: {
    fontSize: '14px',
    fontWeight: 'inherit'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif"
  },
  modalBody: {
    padding: '28px 24px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalIconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a3e2b',
    margin: '0 0 8px 0'
  },
  modalDesc: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5'
  },
  modalFooter: {
    padding: '16px 24px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  btnModalBatal: {
    flex: 1,
    height: '42px',
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1.5px solid #23573c',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnModalKeluar: {
    flex: 1,
    height: '42px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
    transition: 'all 0.15s ease'
  }
};
