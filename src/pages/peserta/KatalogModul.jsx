import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Jenis');
  const [onlyAvailableStock, setOnlyAvailableStock] = useState(false);

  // Daftar Modul yang sedang dipesan
  const [orderItems, setOrderItems] = useState([]);

  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Toast Notifikasi
  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

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

  // Hitung total buku dan total harga
  const totalBuku = orderItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const totalHarga = orderItems.reduce(
    (sum, item) => sum + item.hargaJual * (Number(item.qty) || 0),
    0
  );

  // Tambah modul ke pesanan & langsung buka modal
  const handleCardClick = (modul) => {
    if (modul.stok === 0) {
      return;
    }

    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === modul.id);
      if (existing) {
        // Jika sudah ada, tetap pertahankan kuantitasnya
        return prev;
      }
      // Jika baru, tambahkan dengan kuantitas 1
      return [...prev, { ...modul, qty: 1 }];
    });

    setIsOrderModalOpen(true);
  };

  // Update kuantitas item di pesanan
  const handleUpdateQty = (modulId, newQty) => {
    setOrderItems((prev) => {
      return prev.map((item) => {
        if (item.id === modulId) {
          if (newQty === '') {
            return { ...item, qty: '' };
          }
          const parsed = Number(newQty);
          const clamped = Math.max(1, Math.min(parsed, item.stok));
          return { ...item, qty: clamped };
        }
        return item;
      });
    });
  };

  // Hapus modul dari pesanan
  const handleRemoveItem = (modulId) => {
    setOrderItems((prev) => {
      const updated = prev.filter((item) => item.id !== modulId);
      if (updated.length === 0) {
        setIsOrderModalOpen(false);
        showToast('Semua modul telah dihapus dari pesanan.');
      }
      return updated;
    });
  };

  // Tombol tambah modul lain dari katalog
  const handleTambahModulLain = () => {
    setIsOrderModalOpen(false);
    showToast('Silakan klik modul lain untuk menambahkannya ke pesanan ini.');
  };

  // Konfirmasi Checkout Pesanan
  const handleKonfirmasiPesanan = () => {
    setIsOrderModalOpen(false);
    setOrderItems([]);
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar khusus role peserta */}
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

            {/* Tombol Lihat Pesanan jika sudah ada item yang dipilih */}
            {orderItems.length > 0 && (
              <button
                id="btn-lihat-pesanan-header"
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                style={styles.btnLihatPesananHeader}
                title="Buka kembali daftar pesanan Anda"
              >
                <span>Lihat Pesanan ({totalBuku})</span>
              </button>
            )}
          </div>

          {/* Grid 4 Card */}
          <div className="catalog-grid-responsive" style={styles.catalogGrid}>
            {filteredModuls.map((item) => {
              return (
                <div
                  key={item.id}
                  className="modul-card-hover"
                  onClick={() => {
                    if (item.stok > 0) {
                      handleCardClick(item);
                    }
                  }}
                  style={{
                    ...styles.modulCard,
                    cursor: item.stok === 0 ? 'default' : 'pointer'
                  }}
                >
                  {/* Gambar Cover Modul */}
                  <div style={styles.coverWrapper}>
                    <img src={item.cover} alt={item.nama} style={styles.coverImage} />
                  </div>

                  {/* Isi Card */}
                  <div style={styles.cardContent}>
                    <span style={styles.cardJenis}>{item.kategori}</span>
                    <h3 style={styles.modulTitle} title={item.nama}>
                      {item.nama}
                    </h3>

                    {/* Harga Jual */}
                    <div style={styles.priceRow}>
                      <div style={styles.priceBlock}>
                        <span style={styles.priceLabel}>Harga</span>
                        <span style={styles.priceValue}>{formatRupiah(item.hargaJual)}</span>
                      </div>
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(item);
                        }}
                        style={styles.btnPilihModul}
                      >
                        <span>Pesan Modul</span>
                      </button>
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

      {/* Modal Pesanan Modul */}
      {isOrderModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsOrderModalOpen(false)}>
          <div style={styles.modalOrderContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalHeaderTitle}>Detail Pesanan Modul</h3>
            </div>
            <div style={styles.modalOrderBody}>
              {orderItems.length === 0 ? (
                <div style={styles.emptyOrderBox}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    Belum ada modul di dalam pesanan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    style={styles.btnPilihDariKatalog}
                  >
                    + Pilih Modul dari Katalog
                  </button>
                </div>
              ) : (
                <>
                  {/* Daftar Baris Modul */}
                  <div style={styles.orderRowsList}>
                    {orderItems.map((item) => (
                      <div key={item.id} className="order-row-item-responsive" style={styles.orderRowItem}>
                        {/* Cover Modul */}
                        <img
                          src={item.cover}
                          alt={item.nama}
                          className="order-row-thumb-responsive"
                          style={styles.orderRowThumb}
                        />
                        <div className="order-row-content-responsive" style={styles.orderRowContentWrap}>
                          <div style={styles.orderRowInfo}>
                            <span style={styles.orderRowStok}>
                              Stok: <strong style={{ userSelect: 'text' }}>{item.stok}</strong>
                            </span>
                            <h4
                              className="order-row-title-responsive"
                              style={styles.orderRowTitle}
                              title={item.nama}
                            >
                              {item.nama}
                            </h4>
                            <div style={styles.orderRowStepperWrap}>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(item.id, (Number(item.qty) || 1) - 1)}
                                style={styles.btnRowStepper}
                                aria-label="Kurangi"
                              >
                                -
                              </button>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={item.qty}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  if (val === '') {
                                    handleUpdateQty(item.id, '');
                                  } else {
                                    handleUpdateQty(item.id, parseInt(val, 10));
                                  }
                                }}
                                onBlur={() => {
                                  if (!item.qty || Number(item.qty) < 1) {
                                    handleUpdateQty(item.id, 1);
                                  }
                                }}
                                style={styles.rowStepperInput}
                                aria-label="Jumlah pesanan"
                              />
                              <button
                                type="button"
                                disabled={Number(item.qty) >= item.stok}
                                onClick={() => handleUpdateQty(item.id, (Number(item.qty) || 0) + 1)}
                                style={{
                                  ...styles.btnRowStepper,
                                  opacity: Number(item.qty) >= item.stok ? 0.35 : 1,
                                  cursor: Number(item.qty) >= item.stok ? 'not-allowed' : 'pointer'
                                }}
                                aria-label="Tambah"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="order-row-controls-responsive" style={styles.orderRowControls}>
                            <div style={styles.orderRowUnitPrice}>
                              {formatRupiah(item.hargaJual)}
                            </div>

                            {/* Tombol Hapus Baris */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              style={styles.btnRowDelete}
                              title={`Hapus ${item.nama}`}
                              aria-label="Hapus"
                            >
                              <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Tambah Pesanan */}
                  <button
                    id="btn-tambah-pesanan"
                    type="button"
                    onClick={handleTambahModulLain}
                    style={styles.btnTambahLain}
                  >
                    <AddCircleOutlineOutlinedIcon sx={{ fontSize: 19 }} />
                    <span>Tambah Pesanan</span>
                  </button>

                  {/* Ringkasan Total Pembayaran */}
                  <div style={styles.orderSummaryCard}>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryTotalLabel}>Total Pembayaran</span>
                      <span style={styles.summaryTotalValue}>{formatRupiah(totalHarga)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {orderItems.length > 0 && (
              <div style={styles.modalFooter}>
                <button
                  id="btn-batal-pesanan"
                  type="button"
                  onClick={() => {
                    setOrderItems([]);
                    setIsOrderModalOpen(false);
                  }}
                  style={styles.btnBatalModal}
                >
                  Batal
                </button>
                <button
                  id="btn-konfirmasi-pesanan"
                  type="button"
                  onClick={handleKonfirmasiPesanan}
                  style={styles.btnKonfirmasiModal}
                >
                  <span>Buat Pesanan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
  btnLihatPesananHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.22)',
    transition: 'all 0.2s ease',
    marginLeft: 'auto'
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
    cursor: 'pointer',
    userSelect: 'none',
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
  selectedBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderRadius: '20px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    zIndex: 2,
    backdropFilter: 'blur(4px)'
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
  cardJenis: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    backgroundColor: '#eaf7ef',
    border: '1px solid #23573c',
    borderRadius: '8px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#23573c',
    marginBottom: '6px'
  },
  modulTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
    lineHeight: 1.3
  },
  priceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '14px'
  },
  priceBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  priceLabel: {
    fontSize: '11.5px',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '2px'
  },
  priceValue: {
    fontSize: '17px',
    fontWeight: '800',
    color: '#23573c',
    lineHeight: 1.2
  },
  btnPilihModul: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '11px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '14.5px',
    fontWeight: '700',
    marginTop: 'auto',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
    fontSize: '14.5px',
    fontWeight: '700',
    marginTop: 'auto',
    cursor: 'pointer',
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
  // Modal Base Overlay
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
    zIndex: 9999,
    padding: '18px'
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  modalHeaderTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  modalHeaderSub: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '2px',
    display: 'block'
  },
  btnCloseModal: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex'
  },
  // Modal Order Content (Lebar & Berbaris)
  modalOrderContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    width: '640px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)',
    display: 'flex',
    flexDirection: 'column'
  },
  modalOrderBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto'
  },
  orderRowsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '340px',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  orderRowItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 14px',
    backgroundColor: '#f8faf9',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'border-color 0.15s ease'
  },
  orderRowThumb: {
    width: '54px',
    height: '74px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  orderRowContentWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minWidth: 0,
    gap: '14px'
  },
  orderRowInfo: {
    flex: 1,
    minWidth: 0
  },
  orderRowStok: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#475569',
    userSelect: 'text',
    display: 'inline-block',
    marginBottom: '2px'
  },
  orderRowTitle: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  orderRowControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexShrink: 0
  },
  orderRowUnitPrice: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#23573c'
  },
  orderRowStepperWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
    flexShrink: 0
  },
  btnRowStepper: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease'
  },
  rowStepperInput: {
    width: '42px',
    textAlign: 'center',
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '4px 0',
    fontFamily: 'inherit',
    userSelect: 'text'
  },
  btnRowDelete: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    backgroundColor: '#fff5f5',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s ease'
  },
  btnTambahLain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid #23573c',
    backgroundColor: '#f6faf7',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  orderSummaryCard: {
    backgroundColor: '#f6faf7',
    border: '1px solid #23573c',
    borderRadius: '12px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column'
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summaryTotalLabel: {
    fontSize: '16.5px',
    fontWeight: '800',
    color: '#0f291e'
  },
  summaryTotalValue: {
    fontSize: '21px',
    fontWeight: '800',
    color: '#23573c'
  },
  emptyOrderBox: {
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  btnPilihDariKatalog: {
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modalFooter: {
    padding: '14px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    backgroundColor: '#f8fafc'
  },
  btnBatalModal: {
    padding: '9px 22px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnKonfirmasiModal: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: '9px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(35, 87, 60, 0.28)'
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
