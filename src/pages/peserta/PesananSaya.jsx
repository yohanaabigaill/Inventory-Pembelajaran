import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Covers
import coverAsasi from '../../assets/asasi.jpg';
import coverTahmidi from '../../assets/tahmidi.jpg';
import coverAlHisan1 from '../../assets/alhisan1.jpg';
import coverMushafAshShahibA5 from '../../assets/mushaf_ash_shahib_a5.jpg';
import contohBuktiTf from '../../assets/contoh bukti tf.jpeg';

// Data pesanan demo
export const INITIAL_DEMO_PESANAN = [
  // Belum Bayar
  {
    id: 'ORD-73305405',
    tanggal: '28/10/2026 14:41',
    status: 'Belum Bayar',
    statusPembayaran: 'Belum Bayar',
    statusPengiriman: null,
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    namaPenerima: 'Ahmad Fauzi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: null,
    biayaKirim: 10000,
    items: [
      {
        id: 4,
        nama: 'Mushaf Ash Shahib A5 Terjemah',
        kategori: 'Mushaf',
        hargaJual: 115000,
        qty: 1,
        cover: coverMushafAshShahibA5
      }
    ],
    totalHarga: 125000
  },
  // Menunggu Verifikasi
  {
    id: 'ORD-69269714',
    tanggal: '28/10/2026 13:34',
    status: 'Menunggu Verifikasi',
    statusPembayaran: 'Menunggu Verifikasi',
    statusPengiriman: null,
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    namaPenerima: 'Yohana Abigail',
    noHp: '081298765432',
    alamat: 'Jl. Anggrek No. 12, Batam Center, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 85,
        cover: coverAsasi
      },
      {
        id: 3,
        nama: 'Al Hisan 1',
        kategori: 'Al Hisan',
        hargaJual: 25000,
        qty: 2,
        cover: coverAlHisan1
      }
    ],
    totalHarga: 3460000
  },
  // Perlu Dikirim
  {
    id: 'ORD-58210342',
    tanggal: '27/10/2026 09:20',
    status: 'Perlu Dikirim',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Perlu Dikirim',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    namaPenerima: 'Ririn Anisa',
    noHp: '081377889900',
    alamat: 'Jl. Dahlia No. 18, RT 01/RW 03, Sukajadi, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 3,
        cover: coverTahmidi
      }
    ],
    totalHarga: 130000
  },
  // Dikirim
  {
    id: 'ORD-51920873',
    tanggal: '26/10/2026 11:15',
    status: 'Dikirim',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Dikirim',
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    namaPenerima: 'Hendra Pratama',
    noHp: '085211223344',
    alamat: 'Perumahan Graha Indah Blok C3 No. 5, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 2,
        cover: coverAsasi
      },
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 2,
        cover: coverTahmidi
      }
    ],
    totalHarga: 170000
  },
  // Selesai
  {
    id: 'ORD-44018293',
    tanggal: '24/10/2026 15:40',
    status: 'Selesai',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Selesai',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    namaPenerima: 'Ust. Ridwan Kamil',
    noHp: '081122334455',
    alamat: 'Komp. Masjid Raya Baiturrahman, Batam',
    metodePengiriman: 'Ambil di RSQ Pusat',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 0,
    items: [
      {
        id: 3,
        nama: 'Al Hisan 1',
        kategori: 'Al Hisan',
        hargaJual: 25000,
        qty: 4,
        cover: coverAlHisan1
      }
    ],
    totalHarga: 100000
  },
  // Ditolak
  {
    id: 'ORD-39182746',
    tanggal: '22/10/2026 08:50',
    status: 'Ditolak',
    statusPembayaran: 'Ditolak',
    statusPengiriman: null,
    statusColor: '#dc2626',
    statusBg: '#fee2e2',
    namaPenerima: 'Dewi Lestari',
    noHp: '081399887766',
    alamat: 'Jl. Merpati No. 7, Tiban, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    alasanPenolakan: 'Nominal transfer di bukti struk tidak sesuai dengan total tagihan pesanan.',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 1,
        cover: coverAsasi
      }
    ],
    totalHarga: 50000
  },
  // Dibatalkan
  {
    id: 'ORD-28491038',
    tanggal: '20/10/2026 10:15',
    status: 'Dibatalkan',
    statusPembayaran: 'Dibatalkan',
    statusPengiriman: null,
    statusColor: '#64748b',
    statusBg: '#f1f5f9',
    namaPenerima: 'Ahmad Fauzi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: null,
    biayaKirim: 10000,
    items: [
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 1,
        cover: coverTahmidi
      }
    ],
    totalHarga: 50000
  }
];

// Opsi filter
const STATUS_BAYAR_OPTIONS = [
  'Semua Status',
  'Belum Bayar',
  'Menunggu Verifikasi',
  'Disetujui',
  'Ditolak',
  'Dibatalkan'
];

const STATUS_PENGIRIMAN_OPTIONS = [
  'Semua Status',
  'Perlu Dikirim',
  'Dikirim',
  'Selesai'
];

function CustomDropdown({
  value,
  onChange,
  options = [],
  style = {},
  selectStyle = {},
  arrowColor = '#23573c',
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  const currentOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  const displayLabel = typeof currentOption === 'object' ? currentOption.label : (currentOption || value);

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', ...style }}
    >
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          padding: '8px 14px',
          minHeight: '38px',
          fontSize: '13.5px',
          fontWeight: '600',
          border: '1px solid #23573c',
          borderRadius: '10px',
          backgroundColor: '#f6faf7',
          color: '#1a3e2b',
          transition: 'all 0.2s ease',
          borderColor: isOpen && !disabled ? '#23573c' : (selectStyle.borderColor || '#23573c'),
          boxShadow:
            isOpen && !disabled
              ? '0 0 0 3px rgba(35, 87, 60, 0.15)'
              : isHovered && !disabled
                ? '0 0 0 3px rgba(35, 87, 60, 0.1)'
                : 'none',
          ...selectStyle
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
          stroke={disabled ? '#94a3b8' : arrowColor}
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

      {isOpen && !disabled && (
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
            zIndex: 10005,
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
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f3';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
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

export default function PesananSaya() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [statusBayarFilter, setStatusBayarFilter] = useState('Semua Status');
  const [statusKirimFilter, setStatusKirimFilter] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(() => {
    if (location.state?.newOrder) {
      return [location.state.newOrder, ...INITIAL_DEMO_PESANAN];
    }
    return INITIAL_DEMO_PESANAN;
  });

  const [cancellingOrder, setCancellingOrder] = useState(null);

  // Toast
  const [notification, setNotification] = useState(null);
  const notifTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setNotification({ message, type });
    notifTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Batalkan pesanan
  const handleConfirmBatalPesanan = (orderToCancel) => {
    if (!orderToCancel) return;
    const targetId = orderToCancel.id;
    const updatedOrders = orders.map((ord) => {
      if (ord.id === targetId) {
        return {
          ...ord,
          status: 'Dibatalkan',
          statusPembayaran: 'Dibatalkan',
          statusColor: '#64748b',
          statusBg: '#f1f5f9'
        };
      }
      return ord;
    });

    setOrders(updatedOrders);
    setCancellingOrder(null);
    showToast('Pesanan berhasil dibatalkan', 'success');
  };

  // Reset data dummy saat refresh
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      localStorage.removeItem('inventory_rsq_pesanan');
      localStorage.removeItem('inventory_rsq_pesanan_list');
    } catch (e) {
      console.error(e);
    }
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Kunci scroll background saat modal konfirmasi batal terbuka
  useEffect(() => {
    if (cancellingOrder) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [cancellingOrder]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const getOrderPaymentStatus = (order) => {
    if (order.statusBayar) return order.statusBayar;
    if (order.statusPembayaran) return order.statusPembayaran;
    const s = (order.status || '').trim();
    if (s === 'Belum Bayar') return 'Belum Bayar';
    if (s === 'Menunggu Verifikasi') return 'Menunggu Verifikasi';
    if (s === 'Ditolak') return 'Ditolak';
    if (s === 'Dibatalkan') return 'Dibatalkan';
    if (['Disetujui', 'Diproses', 'Perlu Dikirim', 'Dikirim', 'Selesai'].includes(s)) {
      return 'Disetujui';
    }
    return s;
  };

  const getOrderShippingStatus = (order) => {
    if (order.statusPengiriman) return order.statusPengiriman;
    if (order.statusKirim) return order.statusKirim;
    const s = (order.status || '').trim();
    if (['Diproses', 'Perlu Dikirim', 'Disetujui'].includes(s)) {
      return 'Perlu Dikirim';
    }
    if (s === 'Dikirim') return 'Dikirim';
    if (s === 'Selesai') return 'Selesai';
    return null;
  };

  const filteredOrders = orders.filter((order) => {
    const paymentStatus = getOrderPaymentStatus(order);
    const shippingStatus = getOrderShippingStatus(order);

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.items.some((it) => (it.nama || '').toLowerCase().includes(q)) ||
      (order.namaPenerima || '').toLowerCase().includes(q);

    const matchPayment =
      statusBayarFilter === 'Semua Status' ||
      paymentStatus.toLowerCase() === statusBayarFilter.toLowerCase();

    const matchShipping =
      statusKirimFilter === 'Semua Status' ||
      (shippingStatus && shippingStatus.toLowerCase() === statusKirimFilter.toLowerCase());

    return matchSearch && matchPayment && matchShipping;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Belum Bayar':
        return {
          icon: <PaymentOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#2563eb',
          bg: '#dbeafe',
          border: '#2563eb'
        };
      case 'Menunggu Verifikasi':
        return {
          icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#d97706',
          bg: '#fef3c7',
          border: '#d97706'
        };
      case 'Disetujui':
        return {
          icon: <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#16a34a',
          bg: '#dcfce7',
          border: '#16a34a'
        };
      case 'Diproses':
      case 'Perlu Dikirim':
        return {
          icon: <Inventory2OutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#d97706',
          bg: '#fef3c7',
          border: '#d97706'
        };
      case 'Dikirim':
        return {
          icon: <LocalShippingOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#2563eb',
          bg: '#dbeafe',
          border: '#2563eb'
        };
      case 'Ditolak':
      case 'Pembayaran Ditolak':
        return {
          icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#dc2626',
          bg: '#fee2e2',
          border: '#dc2626'
        };
      case 'Dibatalkan':
      case 'Pesanan Dibatalkan':
        return {
          icon: <CancelOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#64748b',
          bg: '#f1f5f9',
          border: '#cbd5e1'
        };
      case 'Selesai':
      default:
        return {
          icon: <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />,
          color: '#16a34a',
          bg: '#dcfce7',
          border: '#16a34a'
        };
    }
  };

  // Pesan lagi
  const handlePesanLagi = (order) => {
    try {
      const existingCartStr = localStorage.getItem('inventory_rsq_cart');
      let cart = existingCartStr ? JSON.parse(existingCartStr) : [];

      order.items.forEach((item) => {
        const found = cart.find((c) => c.id === item.id);
        if (found) {
          found.qty = (found.qty || 1) + item.qty;
          found.checked = true;
        } else {
          cart.push({ ...item, checked: true });
        }
      });

      localStorage.setItem('inventory_rsq_cart', JSON.stringify(cart));
      navigate('/katalog-modul');
    } catch (e) {
      navigate('/katalog-modul');
    }
  };

  return (
    <div style={styles.layoutContainer}>
      <Sidebar
        role="peserta"
        activeMenu="Pesanan"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title="Pesanan Saya"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="pesanan-content-body content-body-responsive" style={styles.contentBody}>
          {/* Toast */}
          {notification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'error' ? '#dc2626' : '#23573c'
              }}
            >
              {notification.type === 'error' ? (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Filter */}
          <div className="pesanan-filter-card" style={styles.filterCard}>
            {/* Search Bar (Baris 1) */}
            <div className="pesanan-search-wrap" style={styles.searchWrapper}>
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
                placeholder="Cari no pesanan atau nama modul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pesanan-search-input"
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}
                >
                  <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                </button>
              )}
            </div>

            {/* Dropdown Filters (Baris 2) */}
            <div className="pesanan-filter-bottom-row" style={styles.filterBottomRow}>
              {/* Status Pembayaran */}
              <div className="pesanan-filter-item" style={styles.filterDropdownWrap}>
                <span className="pesanan-filter-label" style={styles.filterLabel}>Status Pembayaran:</span>
                <CustomDropdown
                  value={statusBayarFilter}
                  onChange={(val) => setStatusBayarFilter(val)}
                  options={STATUS_BAYAR_OPTIONS}
                  className="pesanan-dropdown-custom"
                  style={{ flex: 1, minWidth: '130px' }}
                />
              </div>

              {/* Status Pengiriman */}
              <div className="pesanan-filter-item" style={styles.filterDropdownWrap}>
                <span className="pesanan-filter-label" style={styles.filterLabel}>Status Pengiriman:</span>
                <CustomDropdown
                  value={statusKirimFilter}
                  onChange={(val) => setStatusKirimFilter(val)}
                  options={STATUS_PENGIRIMAN_OPTIONS}
                  className="pesanan-dropdown-custom"
                  style={{ flex: 1, minWidth: '130px' }}
                />
              </div>

              {/* Reset filter */}
              {(statusBayarFilter !== 'Semua Status' || statusKirimFilter !== 'Semua Status' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusBayarFilter('Semua Status');
                    setStatusKirimFilter('Semua Status');
                    setSearchQuery('');
                  }}
                  className="pesanan-btn-reset"
                  style={styles.btnResetFilter}
                >
                  <CloseOutlinedIcon sx={{ fontSize: 13 }} />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Daftar Pesanan */}
          <div style={styles.ordersList}>
            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIconWrap}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 44, color: '#94a3b8' }} />
                </div>
                <h3 style={styles.emptyTitle}>Belum Ada Pesanan</h3>
                <p style={styles.emptyText}>
                  {statusBayarFilter === 'Semua Status' && statusKirimFilter === 'Semua Status' && !searchQuery
                    ? 'Anda belum pernah melakukan pemesanan modul.'
                    : 'Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian.'}
                </p>
                <button
                  onClick={() => {
                    setStatusBayarFilter('Semua Status');
                    setStatusKirimFilter('Semua Status');
                    setSearchQuery('');
                    navigate('/katalog-modul');
                  }}
                  style={styles.btnExplore}
                >
                  Buka Katalog Modul
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const isBelumBayar = (order.status === 'Belum Bayar' || order.statusPembayaran === 'Belum Bayar') && order.status !== 'Dibatalkan';

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      navigate(`/pesanan/${order.id}`, { state: { order } });
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = '#c7d9cd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                    className="pesanan-order-card"
                    style={styles.orderCard}
                  >
                    {/* Header Card */}
                    <div className="pesanan-order-header" style={styles.orderCardHeader}>
                      <div className="pesanan-order-header-left" style={styles.orderCardHeaderLeft}>
                        <span className="pesanan-order-number-label" style={styles.orderNumberLabel}>No Pesanan:</span>
                        <span className="pesanan-order-number" style={styles.orderNumber}>{order.id}</span>
                      </div>
                      <div
                        className="pesanan-status-badge"
                        style={{
                          ...styles.statusBadge,
                          color: badge.color,
                          backgroundColor: badge.bg,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        {order.status}
                      </div>
                    </div>

                    {/* Daftar item */}
                    <div className="pesanan-order-items" style={styles.orderItemsList}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pesanan-order-item-row" style={styles.orderItemCardRow}>
                          <img
                            src={item.cover || coverAsasi}
                            alt={item.nama}
                            style={styles.orderItemCardThumb}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.orderItemCardTitle}>{item.nama}</div>
                            <div style={styles.orderItemCardSub}>
                              {item.qty} x {formatRupiah(item.hargaJual)}
                            </div>
                          </div>
                          <div className="pesanan-item-row-total" style={styles.orderItemCardTotal}>
                            {formatRupiah(item.hargaJual * item.qty)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Card */}
                    <div className="pesanan-order-footer" style={styles.orderCardFooter}>
                      <div className="pesanan-footer-total" style={styles.footerTotalWrap}>
                        <span style={styles.footerTotalLabel}>
                          Total:
                        </span>
                        <span style={styles.footerTotalValue}>
                          {formatRupiah(order.totalHarga)}
                        </span>
                      </div>
                      <div className="pesanan-footer-actions" style={styles.footerActions}>
                        {(order.status === 'Belum Bayar' || order.statusPembayaran === 'Belum Bayar') && order.status !== 'Dibatalkan' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancellingOrder(order);
                            }}
                            className="pesanan-btn-action"
                            style={styles.btnBatalkanPesananCard}
                          >
                            <span>Batalkan Pesanan</span>
                          </button>
                        )}
                        {order.status === 'Selesai' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePesanLagi(order);
                            }}
                            className="pesanan-btn-action"
                            style={styles.btnPesanLagi}
                          >
                            <span>Pesan Lagi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>



      {/* Modal Batal */}
      {cancellingOrder && (
        <div
          style={{ ...styles.modalOverlay, zIndex: 10002 }}
          onClick={() => setCancellingOrder(null)}
        >
          <div
            style={styles.modalContentSimpleReject}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeaderSimple}>
              <h3 style={styles.modalTitleSimple}>Konfirmasi Batalkan Pesanan</h3>
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.simpleModalBody}>
              <p style={{ ...styles.simpleConfirmText, marginBottom: 0 }}>
                Apakah Anda yakin ingin membatalkan pesanan <strong>{cancellingOrder.id}</strong>? Pesanan yang dibatalkan tidak dapat diproses lagi.
              </p>
            </div>

            <div style={styles.simpleModalFooter}>
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                style={styles.btnBatalModal}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmBatalPesanan(cancellingOrder)}
                style={styles.btnConfirmBatal}
              >
                Ya, Batalkan
              </button>
            </div>
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  filterBottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 34px 10px 38px',
    fontSize: '13px',
    border: '1px solid #23573c',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    fontFamily: "'Poppins', sans-serif",
    color: '#1a3e2b'
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#94a3b8',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterDropdownWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: 0
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    whiteSpace: 'nowrap'
  },
  btnResetFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  orderCardHeader: {
    padding: '14px 20px',
    backgroundColor: '#fbfdfc',
    borderBottom: '1px solid #edf2ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px'
  },
  orderCardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  orderNumberLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b'
  },
  orderNumber: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f291e',
    letterSpacing: '0.2px'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    height: '28px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  orderItemsList: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  orderItemCardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: '#fbfcfc',
    border: '1px solid #edf2ee'
  },
  orderItemCardThumb: {
    width: '46px',
    height: '64px',
    borderRadius: '6px',
    objectFit: 'cover',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    flexShrink: 0
  },
  orderItemCardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  orderItemCardSub: {
    fontSize: '12.5px',
    color: '#64748b',
    fontWeight: '500'
  },
  orderItemCardTotal: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
    flexShrink: 0
  },
  orderCardFooter: {
    padding: '14px 20px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px'
  },
  footerTotalWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  footerTotalLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  footerTotalValue: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#23573c'
  },
  footerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  btnBatalkanPesananCard: {
    padding: '7px 16px',
    borderRadius: '8px',
    border: '1.5px solid #ef4444',
    backgroundColor: '#ffffff',
    color: '#ef4444',
    fontSize: '12.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnPesanLagi: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '60px 20px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  emptyIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  emptyText: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: 0,
    maxWidth: '380px'
  },
  btnExplore: {
    marginTop: '8px',
    padding: '10px 24px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
    overscrollBehavior: 'contain'
  },
  modalContentSimpleReject: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '440px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    boxSizing: 'border-box'
  },
  modalHeaderSimple: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0'
  },
  modalTitleSimple: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#dc2626',
    margin: 0
  },
  modalCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  simpleModalBody: {
    fontSize: '13.5px',
    color: '#334155'
  },
  simpleConfirmText: {
    margin: '0 0 12px',
    lineHeight: '1.5'
  },
  simpleModalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px'
  },
  btnBatalModal: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnConfirmBatal: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
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
