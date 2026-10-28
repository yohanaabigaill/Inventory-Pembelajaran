import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ModalKonfirmasiPesanan from '../../components/ModalKonfirmasiPesanan';

// Cover Modul
import coverAsasi from '../../assets/asasi.jpg';
import coverTahmidi from '../../assets/tahmidi.jpg';
import coverAlHisan1 from '../../assets/alhisan1.jpg';
import coverBukuDoa from '../../assets/bukudoa.jpg';
import coverMushafAshShahibA5 from '../../assets/mushaf_ash_shahib_a5.jpg';
import coverMushafAlKamilA5 from '../../assets/mushaf_al_kamil_a5.jpg';
import coverMushafAshShahibA6 from '../../assets/mushaf_ash_shahib_a6.jpg';
import coverUtsmani1 from '../../assets/utsmani1.jpg';

// Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

// Custom Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  style = {},
  selectStyle = {},
  arrowColor = '#1a3e2b',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const displayLabel = typeof value === 'string' ? value : (value?.label || value);

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', ...style }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          ...selectStyle,
          borderColor: isOpen ? '#23573c' : (selectStyle.borderColor || '#23573c'),
          boxShadow: isOpen ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayLabel}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={arrowColor}
          strokeWidth="2.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '8px'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && (
        <div
          className="custom-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #23573c',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: 0
          }}
        >
          {options.map((opt, idx) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;
            const isFirst = idx === 0;
            const isLast = idx === options.length - 1;

            return (
              <div
                key={idx}
                onClick={() => handleSelect(optVal)}
                className="custom-dropdown-item"
                style={{
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  backgroundColor: isSelected ? '#23573c' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  borderTopLeftRadius: isFirst ? '9px' : '0',
                  borderTopRightRadius: isFirst ? '9px' : '0',
                  borderBottomLeftRadius: isLast ? '9px' : '0',
                  borderBottomRightRadius: isLast ? '9px' : '0'
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Filter jenis modul
const KATEGORI_OPTIONS = [
  'Semua Jenis',
  'Al Haqq',
  'Al Hisan',
  'Tahsin Usmani',
  'RSQ Kids',
  'Umum',
  'Al Quran Wakaf',
  'Al Quran'
];

// Data Modul
const INITIAL_MODULS = [
  {
    id: 1,
    nama: 'Asasi',
    kategori: 'Al Haqq',
    hargaJual: 40000,
    stok: 85,
    cover: coverAsasi
  },
  {
    id: 2,
    nama: 'Tahmidi',
    kategori: 'Al Haqq',
    hargaJual: 40000,
    stok: 60,
    cover: coverTahmidi
  },
  {
    id: 3,
    nama: 'Al Hisan 1',
    kategori: 'Al Hisan',
    hargaJual: 25000,
    stok: 150,
    cover: coverAlHisan1
  },
  {
    id: 4,
    nama: 'Utsmani 1',
    kategori: 'Tahsin Usmani',
    hargaJual: 25000,
    stok: 0,
    cover: coverUtsmani1
  },
  {
    id: 5,
    nama: 'Buku Doa',
    kategori: 'RSQ Kids',
    hargaJual: 15000,
    stok: 4,
    cover: coverBukuDoa
  },
  {
    id: 6,
    nama: 'Mushaf Ash Shahib A5 Terjemah',
    kategori: 'Al Quran Wakaf',
    hargaJual: 115000,
    stok: 220,
    cover: coverMushafAshShahibA5
  },
  {
    id: 7,
    nama: 'Mushaf Al Kamil A5 Terjemah',
    kategori: 'Al Quran',
    hargaJual: 115000,
    stok: 115,
    cover: coverMushafAlKamilA5
  },
  {
    id: 8,
    nama: 'Mushaf Ash Shahib A6 Terjemah',
    kategori: 'Al Quran',
    hargaJual: 80000,
    stok: 95,
    cover: coverMushafAshShahibA6
  }
];

export default function KatalogModul() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Jenis');
  const [onlyAvailableStock, setOnlyAvailableStock] = useState(false);

  // Cart State 
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('inventory_rsq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Toast Notifikasi
  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  // Simpan keranjang ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('inventory_rsq_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  }, [cartItems]);

  // Filter modul berdasarkan pencarian, kategori, dan stok tersedia
  const filteredModuls = INITIAL_MODULS.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = selectedKategori === 'Semua Jenis' || item.kategori === selectedKategori;
    const matchStock = !onlyAvailableStock || item.stok > 0;
    return matchSearch && matchKategori && matchStock;
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Total item di keranjang (seluruh kuantitas)
  const totalItemsInCart = cartItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  // Tambah modul ke keranjang 
  const handleAddToCart = (modul) => {
    if (modul.stok === 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === modul.id);
      if (existing) {
        const nextQty = Math.min((Number(existing.qty) || 0) + 1, modul.stok);
        return prev.map((item) =>
          item.id === modul.id ? { ...item, qty: nextQty } : item
        );
      }
      return [...prev, { ...modul, qty: 1, checked: false }];
    });

    showToast('Berhasil ditambahkan ke keranjang');
  };

  // Beli Langsung Buka Modal Konfirmasi Pemesanan Modul
  const handleBuyNow = (modul) => {
    if (modul.stok === 0) return;
    setCheckoutItem(modul);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar role peserta */}
      <Sidebar
        role="peserta"
        activeMenu="Katalog Modul"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Katalog Modul"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main style={styles.contentBody}>
          {/* Toast Notifikasi */}
          {notification && (
            <div className="toast-responsive" style={styles.toast}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <span>{notification}</span>
            </div>
          )}

          {/* Filter Card */}
          <div className="filter-card-responsive" style={styles.filterCard}>
            <div className="filter-left-responsive" style={styles.filterLeft}>
              {/* Search Bar */}
              <div className="search-wrapper-responsive" style={styles.searchWrapper}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5b7566"
                  strokeWidth="2"
                  style={styles.searchIcon}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari judul modul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-responsive"
                  style={styles.searchInput}
                />
              </div>

              {/* Dropdown Jenis Modul */}
              <CustomDropdown
                value={selectedKategori}
                onChange={(val) => setSelectedKategori(val)}
                options={KATEGORI_OPTIONS}
                className="select-wrapper-responsive"
                style={{ width: '180px' }}
                selectStyle={styles.customSelect}
                arrowColor="#1a3e2b"
              />

              {/* Checkbox Stok Tersedia */}
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={onlyAvailableStock}
                    onChange={(e) => setOnlyAvailableStock(e.target.checked)}
                    sx={{
                      color: '#23573c',
                      '&.Mui-checked': { color: '#23573c' },
                      padding: '4px'
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{ color: '#162a20', fontSize: '13px', fontWeight: 600, userSelect: 'none' }}
                  >
                    Stok Tersedia
                  </Typography>
                }
                sx={{ ml: { xs: 0, sm: 0.5 }, mr: 0, userSelect: 'none' }}
              />
            </div>
          </div>

          {/* Grid Modul */}
          <div className="catalog-grid-responsive" style={styles.catalogGrid}>
            {filteredModuls.map((item) => {
              return (
                <div
                  key={item.id}
                  className="modul-card-hover"
                  style={styles.modulCard}
                >
                  {/* Gambar Cover Modul */}
                  <div style={styles.coverWrapper}>
                    <img src={item.cover} alt={item.nama} style={styles.coverImage} />
                  </div>

                  {/* Isi Card */}
                  <div style={styles.cardContent}>
                    {/* Baris Atas: Kategori (kiri) & Stok (kanan) */}
                    <div style={styles.cardTopRow}>
                      <span style={styles.cardJenis}>{item.kategori}</span>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '600',
                          color: item.stok > 0 ? '#475569' : '#dc2626'
                        }}
                      >
                        {item.stok > 0 ? `Stok: ${item.stok}` : 'Habis'}
                      </span>
                    </div>

                    <h3 style={styles.modulTitle}>
                      {item.nama}
                    </h3>

                    {/* Harga Jual */}
                    <div style={styles.priceRow}>
                      <span style={styles.priceValue}>{formatRupiah(item.hargaJual)}</span>
                    </div>

                    {/* Tombol Aksi */}
                    {item.stok === 0 ? (
                      <button
                        type="button"
                        disabled
                        style={{ ...styles.btnStokHabis, cursor: 'not-allowed' }}
                      >
                        <span>Stok Habis</span>
                      </button>
                    ) : (
                      <div style={styles.cardActionRow}>
                        {/* Tombol + Keranjang */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          style={styles.btnTambahKeranjang}
                        >
                          <AddShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
                          <span>Keranjang</span>
                        </button>

                        {/* Tombol Beli Langsung  */}
                        <button
                          type="button"
                          onClick={() => handleBuyNow(item)}
                          style={styles.btnBeliLangsung}
                        >
                          <LocalMallOutlinedIcon sx={{ fontSize: 17 }} />
                          <span>Beli</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredModuls.length === 0 && (
              <div style={styles.emptyContainer}>
                <p style={{ margin: 0, fontWeight: '600', color: '#475569', fontSize: '14px' }}>
                  Tidak ada modul yang sesuai dengan pencarian.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>


      <button
        type="button"
        onClick={() => navigate('/keranjang')}
        className="cart-floating-btn"
        style={styles.floatingCartBtn}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 26, color: '#ffffff' }} />
      </button>

      {/* Modal Konfirmasi Checkout Langsung */}
      <ModalKonfirmasiPesanan
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={checkoutItem ? [{ ...checkoutItem, qty: 1 }] : []}
        canEditQty={true}
      />
    </div>
  );
}

const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8faf9',
    fontFamily: "'Poppins', sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    backgroundColor: '#f8faf9'
  },
  contentBody: {
    padding: '24px 32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    flexWrap: 'wrap',
    gap: '12px'
  },
  filterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px'
  },
  searchInput: {
    width: '300px',
    padding: '10px 14px 10px 38px',
    fontSize: '13px',
    border: '1px solid #23573c',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    fontFamily: 'inherit'
  },
  customSelect: {
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #c7d9cd',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    color: '#1a3e2b',
    cursor: 'pointer'
  },
  btnKeranjangHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.22)',
    transition: 'all 0.2s ease',
    marginLeft: 'auto'
  },
  cartBadgeCount: {
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '11.5px',
    fontWeight: '800',
    padding: '1px 7px',
    borderRadius: '12px',
    marginLeft: '2px'
  },
  catalogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '22px',
    width: '100%'
  },
  modulCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
  },
  coverWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1.38',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    boxSizing: 'border-box'
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.35s ease'
  },
  cardContent: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  cardTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px'
  },
  cardJenis: {
    display: 'inline-block',
    backgroundColor: '#eaf7ef',
    border: '1px solid #23573c',
    borderRadius: '8px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#23573c'
  },
  modulTitle: {
    fontSize: '16.5px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
    lineHeight: 1.3
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '14px'
  },
  priceValue: {
    fontSize: '17px',
    fontWeight: '800',
    color: '#23573c',
    lineHeight: 1.2
  },
  cardActionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'auto'
  },
  btnTambahKeranjang: {
    flex: 1.15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 10px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    backgroundColor: '#eaf7ef',
    color: '#23573c',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit'
  },
  btnBeliLangsung: {
    flex: 0.85,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 3px 8px rgba(35, 87, 60, 0.22)',
    fontFamily: 'inherit'
  },
  btnStokHabis: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '11px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: 'auto',
    cursor: 'not-allowed',
    fontFamily: 'inherit'
  },
  emptyContainer: {
    gridColumn: '1 / -1',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '40px 20px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  floatingCartBtn: {
    position: 'fixed',
    bottom: '28px',
    right: '32px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#23573c',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(35, 87, 60, 0.38)',
    zIndex: 990,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  floatingCartBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '11.5px',
    fontWeight: '800',
    minWidth: '22px',
    height: '22px',
    borderRadius: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    border: '2px solid #ffffff'
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 22px',
    borderRadius: '10px',
    color: '#ffffff',
    backgroundColor: '#23573c',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
  }
};
