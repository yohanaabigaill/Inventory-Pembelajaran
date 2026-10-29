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
const INITIAL_DEMO_PESANAN = [
  // Belum Bayar
  {
    id: 'ORD-73305405',
    tanggal: '28/10/2026 14:41',
    status: 'Belum Bayar',
    statusPembayaran: 'Belum Bayar',
    statusPengiriman: null,
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    namaPenerima: 'AHMAD FAUZI',
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
    namaPenerima: 'YOHANA ABIGAIL',
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
    namaPenerima: 'RIRIN ANISA',
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
    namaPenerima: 'HENDRA PRATAMA',
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
    namaPenerima: 'UST. RIDWAN KAMIL',
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
    namaPenerima: 'DEWI LESTARI',
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
    namaPenerima: 'AHMAD FAUZI',
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
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  // State bukti bayar
  const [rincianProofFile, setRincianProofFile] = useState(null);

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



  // Upload bukti transfer
  const handleChooseProofForRincian = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format file harus berupa JPG, JPEG, atau PNG', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRincianProofFile(reader.result);
      showToast('Bukti transfer berhasil dipilih', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Simpan bukti transfer
  const handleSimpanProofFromRincian = () => {
    if (!rincianProofFile) {
      showToast('Silakan pilih foto bukti transfer terlebih dahulu', 'error');
      return;
    }

    const targetId = selectedOrderModal.id;
    const updatedOrders = orders.map((ord) => {
      if (ord.id === targetId) {
        return {
          ...ord,
          buktiTf: rincianProofFile,
          status: 'Menunggu Verifikasi',
          statusPembayaran: 'Menunggu Verifikasi',
          statusColor: '#d97706',
          statusBg: '#fef3c7'
        };
      }
      return ord;
    });

    setOrders(updatedOrders);
    setSelectedOrderModal(null);
    setRincianProofFile(null);
    showToast('Bukti transfer berhasil disimpan', 'success');
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
    if (selectedOrderModal && selectedOrderModal.id === targetId) {
      setSelectedOrderModal({
        ...selectedOrderModal,
        status: 'Dibatalkan',
        statusPembayaran: 'Dibatalkan',
        statusColor: '#64748b',
        statusBg: '#f1f5f9'
      });
      setRincianProofFile(null);

      // Tutup modal setelah toast
      setTimeout(() => {
        setSelectedOrderModal((prev) => (prev && prev.id === targetId ? null : prev));
      }, 1500);
    }
    showToast('Pesanan berhasil dibatalkan', 'success');
  };

  // Reset data dummy 
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      localStorage.removeItem('inventory_rsq_pesanan');
    } catch (e) {
      console.error(e);
    }
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Kunci scroll background
  useEffect(() => {
    if (selectedOrderModal || cancellingOrder) {
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
  }, [selectedOrderModal, cancellingOrder]);

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

        <main style={styles.contentBody}>
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
          <div style={styles.filterCard}>
            <div style={styles.filterRow}>
              {/* Search */}
              <div style={styles.searchWrapper}>
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
                  placeholder="Cari nomor pesanan atau nama modul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Status Pembayaran */}
              <div style={styles.filterDropdownWrap}>
                <span style={styles.filterLabel}>Status Pembayaran:</span>
                <CustomDropdown
                  value={statusBayarFilter}
                  onChange={(val) => setStatusBayarFilter(val)}
                  options={STATUS_BAYAR_OPTIONS}
                  style={{ minWidth: '175px' }}
                />
              </div>

              {/* Status Pengiriman */}
              <div style={styles.filterDropdownWrap}>
                <span style={styles.filterLabel}>Status Pengiriman:</span>
                <CustomDropdown
                  value={statusKirimFilter}
                  onChange={(val) => setStatusKirimFilter(val)}
                  options={STATUS_PENGIRIMAN_OPTIONS}
                  style={{ minWidth: '165px' }}
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
                      setSelectedOrderModal(order);
                      setRincianProofFile(null);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = '#c7d9cd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                    style={styles.orderCard}
                  >
                    {/* Header Card */}
                    <div style={styles.orderCardHeader}>
                      <div style={styles.orderCardHeaderLeft}>
                        <span style={styles.orderNumberLabel}>No Pesanan:</span>
                        <span style={styles.orderNumber}>{order.id}</span>
                      </div>
                      <div
                        style={{
                          ...styles.statusBadge,
                          color: badge.color,
                          backgroundColor: badge.bg,
                          border: `1px solid ${badge.border}`
                        }}
                      >
                        {badge.icon}
                        <span>{order.status}</span>
                      </div>
                    </div>

                    {/* Daftar item */}
                    <div style={styles.orderItemsList}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={styles.orderItemCardRow}>
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
                          <div style={styles.orderItemCardTotal}>
                            {formatRupiah(item.hargaJual * item.qty)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Card */}
                    <div style={styles.orderCardFooter}>
                      <div style={styles.footerTotalWrap}>
                        <span style={styles.footerTotalLabel}>
                          Total:
                        </span>
                        <span style={styles.footerTotalValue}>
                          {formatRupiah(order.totalHarga)}
                        </span>
                      </div>
                      <div style={styles.footerActions}>
                        {(order.status === 'Belum Bayar' || order.statusPembayaran === 'Belum Bayar') && order.status !== 'Dibatalkan' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancellingOrder(order);
                            }}
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

      {/* Modal Detail */}
      {selectedOrderModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => {
            setSelectedOrderModal(null);
            setRincianProofFile(null);
          }}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Rincian Pesanan</h3>
                <span style={styles.modalSubtitle}>
                  No Pesanan: {selectedOrderModal.id} • {selectedOrderModal.tanggal}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderModal(null);
                  setRincianProofFile(null);
                }}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Notif Ditolak */}
              {(selectedOrderModal.status === 'Ditolak' || selectedOrderModal.statusPembayaran === 'Ditolak') && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: 20, color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#991b1b' }}>
                      Status Pembayaran: Ditolak
                    </div>
                    <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '2px' }}>
                      {selectedOrderModal.alasanPenolakan || 'Bukti transfer tidak valid atau dana belum masuk ke rekening kami.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Notif Dibatalkan */}
              {(selectedOrderModal.status === 'Dibatalkan' || selectedOrderModal.statusPembayaran === 'Dibatalkan') && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <CancelOutlinedIcon sx={{ fontSize: 20, color: '#64748b', flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>
                      Status Pesanan: Dibatalkan
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Pesanan ini telah dibatalkan.
                    </div>
                  </div>
                </div>
              )}

              {/* Info Pengiriman */}
              <div style={styles.infoSection}>
                <h4 style={styles.sectionTitle}>Informasi Pembeli & Pengiriman</h4>
                <div style={styles.infoGrid}>
                  <div>
                    <span style={styles.infoLabel}>NAMA PEMBELI</span>
                    <p style={styles.infoValue}>
                      {selectedOrderModal.namaPenerima || 'Fulan bin Fulan'}
                    </p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>NO. HANDPHONE</span>
                    <p style={styles.infoValue}>
                      {selectedOrderModal.noHp || '081234567890'}
                    </p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>METODE PENGIRIMAN</span>
                    <p style={styles.infoValue}>
                      {selectedOrderModal.metodePengiriman || 'Via Kurir'}
                    </p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>METODE PEMBAYARAN</span>
                    <p style={styles.infoValue}>
                      {selectedOrderModal.metodeBayar || 'Transfer Bank'}
                    </p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={styles.infoLabel}>
                      {selectedOrderModal.metodePengiriman === 'Ambil di RSQ Pusat'
                        ? 'LOKASI PENGAMBILAN'
                        : selectedOrderModal.metodePengiriman === 'Titip ke Ustazah'
                          ? 'KETERANGAN TITIP USTAZAH'
                          : 'ALAMAT PENGIRIMAN'}
                    </span>
                    <p style={styles.infoValue}>
                      {selectedOrderModal.alamat ||
                        'Jl. Melati No. 45, RT 02/RW 05, Sukajadi, Pekanbaru'}
                    </p>
                  </div>
                  {(!selectedOrderModal.metodeBayar || selectedOrderModal.metodeBayar === 'Transfer Bank') && (
                    <div style={styles.bankInfoCardDetail}>
                      <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#166534' }}>
                        BANK SYARIAH INDONESIA (BSI)
                      </span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f291e', letterSpacing: '0.8px' }}>
                        1155770003
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        a.n. <strong>Rumah Sahabat Quran Batam</strong>
                      </div>

                      {/* Bukti Transfer */}
                      {selectedOrderModal.buktiTf ? (
                        <div style={styles.detailBuktiBox}>
                          <div style={styles.detailBuktiHeader}>
                            <span style={styles.detailBuktiTitle}>Bukti Transfer</span>
                          </div>
                          <img
                            src={selectedOrderModal.buktiTf}
                            alt="Bukti Transfer"
                            style={styles.detailBuktiImg}
                            onClick={() => window.open(selectedOrderModal.buktiTf, '_blank')}
                          />
                        </div>
                      ) : selectedOrderModal.status === 'Belum Bayar' ? (
                        rincianProofFile ? (
                          <div style={styles.detailBuktiBox}>
                            <div style={styles.detailBuktiHeader}>
                              <span style={styles.detailBuktiTitle}>Bukti Transfer</span>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <label style={styles.btnGantiBuktiSmall}>
                                  Ganti Foto
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    style={{ display: 'none' }}
                                    onChange={handleChooseProofForRincian}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRincianProofFile(null);
                                    showToast('Bukti transfer berhasil dihapus', 'success');
                                  }}
                                  style={{
                                    ...styles.btnGantiBuktiSmall,
                                    borderColor: '#fecaca',
                                    color: '#dc2626',
                                    backgroundColor: '#fff5f5'
                                  }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                            <img
                              src={rincianProofFile}
                              alt="Bukti Transfer"
                              style={styles.detailBuktiImg}
                              onClick={() => window.open(rincianProofFile, '_blank')}
                            />
                          </div>
                        ) : (
                          <div style={styles.detailBelumBayarSection}>
                            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#166534' }}>
                              Belum Ada Bukti Pembayaran
                            </div>
                            <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0 10px' }}>
                              Silakan transfer ke nomor rekening BSI di atas dan unggah bukti transfer agar pesanan dapat diverifikasi oleh admin.
                            </p>
                            <label style={styles.uploadTfDropzone}>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                style={{ display: 'none' }}
                                onChange={handleChooseProofForRincian}
                              />
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#23573c" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <div style={styles.uploadTfTextWrap}>
                                <span style={styles.uploadTfPromptBold}>Klik untuk unggah struk / bukti transfer</span>
                                <span style={styles.uploadTfPromptSub}>Format: JPG, JPEG, PNG (Maks. 5MB)</span>
                              </div>
                            </label>
                          </div>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {/* Daftar Modul */}
              <div style={styles.infoSection}>
                <h4 style={styles.sectionTitle}>Daftar Modul</h4>
                <div style={styles.modalItemsList}>
                  {selectedOrderModal.items.map((it, idx) => (
                    <div key={idx} style={styles.modalItemRow}>
                      <img
                        src={it.cover || coverAsasi}
                        alt={it.nama}
                        style={styles.modalItemThumb}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={styles.modalItemTitle}>{it.nama}</div>
                        <div style={styles.modalItemSub}>
                          {it.qty} x {formatRupiah(it.hargaJual)}
                        </div>
                      </div>
                      <div style={styles.modalItemTotal}>
                        {formatRupiah(it.hargaJual * it.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Biaya */}
              {(() => {
                const ongkir = selectedOrderModal.biayaKirim !== undefined
                  ? selectedOrderModal.biayaKirim
                  : (selectedOrderModal.metodePengiriman === 'Via Kurir' ? 10000 : 0);

                return (
                  <div style={styles.summaryBox}>
                    <div style={styles.summaryItem}>
                      <span>Biaya Pengiriman</span>
                      {ongkir > 0 ? (
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatRupiah(ongkir)}</span>
                      ) : (
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>Gratis</span>
                      )}
                    </div>
                    <div style={styles.summaryDivider} />
                    <div style={styles.summaryTotalRow}>
                      <span>Total Pembayaran</span>
                      <span style={styles.summaryTotalVal}>
                        {formatRupiah(selectedOrderModal.totalHarga)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={styles.modalFooter}>
              {(selectedOrderModal.status === 'Belum Bayar' || selectedOrderModal.statusPembayaran === 'Belum Bayar') && selectedOrderModal.status !== 'Dibatalkan' ? (
                <div style={styles.modalFooterBelumBayar}>
                  <button
                    type="button"
                    onClick={() => setCancellingOrder(selectedOrderModal)}
                    style={styles.btnBatalkanPesananModal}
                  >
                    Batalkan Pesanan
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderModal(null);
                        setRincianProofFile(null);
                      }}
                      style={styles.btnBatalModal}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSimpanProofFromRincian}
                      style={styles.btnSimpanModal}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderModal(null);
                    setRincianProofFile(null);
                  }}
                  style={styles.btnTutupModalPrimary}
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '380px',
    maxWidth: '100%',
    padding: '10px 34px 10px 38px',
    fontSize: '13px',
    border: '1px solid #23573c',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    fontFamily: "'Poppins', sans-serif",
    color: '#1a3e2b',
    boxSizing: 'border-box'
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
    gap: '8px'
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
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
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
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    width: '560px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    overscrollBehavior: 'contain'
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  modalTitle: {
    fontSize: '16.5px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '3px',
    display: 'block'
  },
  modalCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '18px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overscrollBehavior: 'contain'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    backgroundColor: '#f8fafc',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0'
  },
  infoLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#64748b',
    display: 'block',
    marginBottom: '2px',
    letterSpacing: '0.2px'
  },
  infoValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '2px 0 0 0'
  },
  modalItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  modalItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  modalItemThumb: {
    width: '40px',
    height: '54px',
    borderRadius: '4px',
    objectFit: 'cover'
  },
  modalItemTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  modalItemSub: {
    fontSize: '12px',
    color: '#64748b'
  },
  modalItemTotal: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#23573c'
  },
  summaryBox: {
    backgroundColor: '#eaf7ef',
    borderRadius: '10px',
    padding: '14px 16px',
    border: '1px solid #c7d9cd',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#334155'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#c7d9cd',
    margin: '4px 0'
  },
  summaryTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f291e'
  },
  summaryTotalVal: {
    color: '#23573c',
    fontSize: '16.5px'
  },
  modalFooter: {
    padding: '14px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f8fafc'
  },
  btnBatalModal: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnSimpanModal: {
    padding: '8px 20px',
    borderRadius: '6px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  modalFooterBelumBayar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  btnBatalkanPesananModal: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1.5px solid #dc2626',
    backgroundColor: '#ffffff',
    color: '#dc2626',
    fontSize: '12.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnBatalkanPesananCard: {
    padding: '7px 14px',
    borderRadius: '6px',
    border: '1.5px solid #dc2626',
    backgroundColor: '#ffffff',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
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
  btnTutupModalPrimary: {
    padding: '8px 20px',
    borderRadius: '6px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnTutupModal: {
    padding: '8px 22px',
    borderRadius: '8px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  methodBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#0f291e',
    backgroundColor: '#eaf7ef',
    border: '1px solid #c7d9cd',
    padding: '2px 8px',
    borderRadius: '6px'
  },
  btnUploadBukti: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ea580c',
    color: '#ffffff',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)'
  },
  btnGantiBuktiSmall: {
    padding: '3px 10px',
    borderRadius: '6px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  bankInfoCardDetail: {
    gridColumn: '1 / -1',
    backgroundColor: '#f0fdf4',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #bbf7d0',
    marginTop: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  detailBuktiBox: {
    borderTop: '1px dashed #bbf7d0',
    paddingTop: '10px',
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailBuktiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  detailBuktiTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#166534'
  },
  detailBuktiImg: {
    width: '100%',
    maxHeight: '180px',
    objectFit: 'contain',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  detailBelumBayarSection: {
    borderTop: '1px dashed #bbf7d0',
    paddingTop: '10px',
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    boxSizing: 'border-box'
  },
  uploadTfDropzone: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1.5px dashed #86efac',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  uploadTfTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  uploadTfPromptBold: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#166534'
  },
  uploadTfPromptSub: {
    fontSize: '10.5px',
    color: '#64748b'
  },
  uploadModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    width: '480px',
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
  },
  uploadModalBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalBankBox: {
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  uploadModalDropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px 16px',
    borderRadius: '12px',
    backgroundColor: '#f8faf9',
    border: '2px dashed #86efac',
    cursor: 'pointer',
    textAlign: 'center'
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
