import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import buktiSampaiImg from '../assets/bukti_sampai.jpg';

// Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  style = {},
  selectStyle = {},
  arrowColor = '#23573c',
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
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          padding: '8px 16px',
          minHeight: '38px',
          fontSize: '13.5px',
          fontWeight: '600',
          border: '1px solid #23573c',
          borderRadius: '10px',
          backgroundColor: '#f6faf7',
          color: '#1a3e2b',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none',
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
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.16)',
            zIndex: 10005,
            maxHeight: '260px',
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
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f3';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{
                  padding: '11px 14px',
                  fontSize: '13px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  backgroundColor: isSelected ? '#23573c' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  borderTopLeftRadius: isFirst ? '8px' : '0',
                  borderTopRightRadius: isFirst ? '8px' : '0',
                  borderBottomLeftRadius: isLast ? '8px' : '0',
                  borderBottomRightRadius: isLast ? '8px' : '0'
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

const METODE_OPTIONS = [
  'Semua Metode',
  'Ambil di RSQ Pusat',
  'Via Kurir',
  'Titip ke Ustazah'
];

const STATUS_FILTER_OPTIONS = [
  'Semua Status',
  'Perlu Dikirim',
  'Dikirim',
  'Selesai'
];

// Icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

// Data Pengiriman
const INITIAL_PENGIRIMAN = [
  {
    id: 'ORD-2026-001',
    idPesanan: 'ORD-2026-001',
    namaPembeli: 'Yohana Abigail',
    noHp: '0812-3456-7890',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Jl. Pesantren No. 14, RT 02/05, Bandung',
    noKwitansi: 'KWT-2026-001',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 5, harga: 25000 },
      { nama: 'Tajwidi', qty: 3, harga: 30000 }
    ]
  },
  {
    id: 'ORD-2026-002',
    idPesanan: 'ORD-2026-002',
    namaPembeli: 'Ririn Anisa',
    noHp: '0857-9876-5432',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Komplek Griya Indah Blok C3, Cimahi',
    noKwitansi: 'KWT-2026-002',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 10, harga: 15000 },
      { nama: 'Anak 1', qty: 10, harga: 20000 }
    ]
  },
  {
    id: 'ORD-2026-003',
    idPesanan: 'ORD-2026-003',
    namaPembeli: 'Hendra Pratama',
    noHp: '0821-5566-7788',
    metode: 'Titip ke Ustazah',
    ongkirFlat: 0,
    alamat: 'Jl. Cihampelas No. 45, Kota Bandung',
    noKwitansi: 'KWT-2026-003',
    ustazahNama: 'Ustazah Fatimah Azzahra',
    lokasiAmbil: '',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Tahmidi', qty: 4, harga: 28000 }
    ]
  },
  {
    id: 'ORD-2026-004',
    idPesanan: 'ORD-2026-004',
    namaPembeli: 'Ust. Ridwan Kamil',
    noHp: '0813-1122-3344',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Pondok Pesantren Al-Hidayah, Kab. Sumedang',
    noKwitansi: 'KWT-2026-004',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-11',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Mushaf Ash Shahib A5 Terjemah', qty: 8, harga: 75000 },
      { nama: 'Panduan Guru', qty: 2, harga: 40000 }
    ]
  },
  {
    id: 'ORD-2026-005',
    idPesanan: 'ORD-2026-005',
    namaPembeli: 'Budi Santoso',
    noHp: '0878-4455-6677',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Jl. Riau No. 88, Kota Bandung',
    noKwitansi: 'KWT-2026-005',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '2026-10-12',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Khat', qty: 4, harga: 22000 }
    ]
  },
  {
    id: 'ORD-2026-006',
    idPesanan: 'ORD-2026-006',
    namaPembeli: 'Farhan Ramadhan',
    noHp: '0812-7788-9900',
    metode: 'Titip ke Ustazah',
    ongkirFlat: 0,
    alamat: 'Jl. Sukajadi No. 102, Sukasari, Bandung',
    noKwitansi: 'KWT-2026-006',
    ustazahNama: 'Ustazah Maryam S.Pd.I',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-13',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Tahsin Dewasa', qty: 3, harga: 35000 },
      { nama: 'Tajwidi', qty: 1, harga: 30000 }
    ]
  },
  {
    id: 'ORD-2026-007',
    idPesanan: 'ORD-2026-007',
    namaPembeli: 'Dewi Lestari',
    noHp: '0852-3344-5566',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Jl. Antapani Raya No. 15, Bandung',
    noKwitansi: 'KWT-2026-007',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-10',
    status: 'Selesai',
    buktiSampai: {
      fotoUrl: buktiSampaiImg
    },
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 5, harga: 15000 }
    ]
  },
  {
    id: 'ORD-2026-008',
    idPesanan: 'ORD-2026-008',
    namaPembeli: 'Rian Hidayat',
    noHp: '0877-6655-4433',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Komp. Margahayu Kencana Blok B2, Kab. Bandung',
    noKwitansi: 'KWT-2026-008',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '2026-10-09',
    status: 'Selesai',
    buktiSampai: {
      fotoUrl: buktiSampaiImg
    },
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 4, harga: 25000 },
      { nama: 'Khat', qty: 2, harga: 22000 }
    ]
  }
];

// Card Statistik
const STATS_CONFIG = [
  { key: 'totalPerluDikirim', label: 'Perlu Dikirim', status: 'Perlu Dikirim', border: '#f59e0b', color: '#b45309', bg: '#fef3c7', icon: Inventory2OutlinedIcon },
  { key: 'totalDikirim', label: 'Dikirim', status: 'Dikirim', border: '#0284c7', color: '#0369a1', bg: '#e0f2fe', icon: LocalShippingOutlinedIcon },
  { key: 'totalSelesai', label: 'Selesai', status: 'Selesai', border: '#22c55e', color: '#15803d', bg: '#dcfce7', icon: TaskAltOutlinedIcon }
];

export default function StatusPengiriman() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data State
  const [pengirimanList, setPengirimanList] = useState(INITIAL_PENGIRIMAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [metodeFilter, setMetodeFilter] = useState('Semua Metode');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [notification, setNotification] = useState(null);

  // Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [previewProofImg, setPreviewProofImg] = useState(null);

  // Toast Notifikasi
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Format Tanggal
  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1] || month} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Filter Data
  const filteredPengiriman = useMemo(() => {
    return pengirimanList.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.idPesanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaPembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.noKwitansi && item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.noResi && item.noResi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ustazahNama && item.ustazahNama.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'Semua Status' || item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchMetode =
        metodeFilter === 'Semua Metode' || item.metode.toLowerCase() === metodeFilter.toLowerCase();

      return matchSearch && matchStatus && matchMetode;
    });
  }, [pengirimanList, searchQuery, statusFilter, metodeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPengiriman.length / itemsPerPage) || 1;
  const paginatedPengiriman = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPengiriman.slice(start, start + itemsPerPage);
  }, [filteredPengiriman, currentPage]);

  // Statistik (3 Status Sesuai Tabel)
  const stats = useMemo(() => {
    return {
      totalPerluDikirim: pengirimanList.filter((p) => p.status === 'Perlu Dikirim').length,
      totalDikirim: pengirimanList.filter((p) => p.status === 'Dikirim').length,
      totalSelesai: pengirimanList.filter((p) => p.status === 'Selesai').length,
      totalSemua: pengirimanList.length,
      totalKurir: pengirimanList.filter((p) => p.metode === 'Via Kurir').length,
      totalRsqPusat: pengirimanList.filter((p) => p.metode === 'Ambil di RSQ Pusat').length,
      totalUstazah: pengirimanList.filter((p) => p.metode === 'Titip ke Ustazah').length
    };
  }, [pengirimanList]);

  // Klik Kartu Statistik
  const handleStatCardClick = (targetStatus) => {
    setStatusFilter((prev) => (prev.toLowerCase() === targetStatus.toLowerCase() ? 'Semua Status' : targetStatus));
    setCurrentPage(1);
  };

  // Salin No. Kwitansi
  const handleCopyKwitansi = (kwitansi) => {
    if (!kwitansi) return;
    navigator.clipboard.writeText(kwitansi);
    showToast(`Nomor kwitansi ${kwitansi} berhasil disalin!`, 'success');
  };

  // Simpan Perubahan dari Pop-up Detail
  const handleSaveDetail = () => {
    if (!selectedDetail) return;
    setPengirimanList((prevList) =>
      prevList.map((item) => (item.id === selectedDetail.id ? { ...selectedDetail } : item))
    );
    showToast(`Perubahan data pengiriman ${selectedDetail.id} berhasil disimpan!`, 'success');
    setSelectedDetail(null);
  };

  // Warna
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Perlu Dikirim':
        return '#d97706';
      case 'Dikirim':
      case 'Sedang Dikirim':
        return '#0284c7';
      case 'Selesai':
      case 'Terkirim':
        return '#16a34a';
      default:
        return '#94a3b8';
    }
  };

  // Render Badge Metode Pengiriman
  const renderMetodeBadge = (metode) => {
    switch (metode) {
      case 'Ambil di RSQ Pusat':
        return <span style={styles.badgeRsqPusat}>🏢 RSQ Pusat</span>;
      case 'Via Kurir':
        return <span style={styles.badgeKurir}>🚚 Via Kurir</span>;
      case 'Titip ke Ustazah':
        return <span style={styles.badgeUstazah}>🧕 Titip Ustazah</span>;
      default:
        return <span style={styles.badgeKurir}>{metode || 'Via Kurir'}</span>;
    }
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        activeMenu="Pesanan & Kirim"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Pesanan & Pengiriman"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main style={styles.contentBody} className="content-body-responsive">
          {/* Toast Notifikasi */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#166534' : '#991b1b'
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <span>{notification.message}</span>
            </div>
          )}

          {/* Tab Navigasi */}
          <div style={styles.tabContainer} className="tab-container-responsive">
            <button
              type="button"
              onClick={() => navigate('/pesanan-kirim')}
              style={styles.tabButton}
            >
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Verifikasi Pembayaran</span>
            </button>

            <button
              type="button"
              style={{
                ...styles.tabButton,
                ...styles.tabButtonActive
              }}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Status Pengiriman</span>
              {stats.totalPerluDikirim > 0 && (
                <span style={styles.tabBadgeWarning}>{stats.totalPerluDikirim}</span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3 Kartu Statistik */}
            <div style={styles.statsGrid} className="stats-grid-responsive">
              {STATS_CONFIG.map((cfg) => {
                const IconComp = cfg.icon;
                const isActive = statusFilter === cfg.status;
                return (
                  <div
                    key={cfg.key}
                    onClick={() => handleStatCardClick(cfg.status)}
                    className="stat-card-responsive"
                    style={{
                      ...styles.statCard,
                      borderLeft: `4px solid ${cfg.border}`,
                      boxShadow: isActive
                        ? `0 0 0 2px ${cfg.border}, 0 4px 12px rgba(0,0,0,0.06)`
                        : '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    title={`Klik untuk filter: ${cfg.label}`}
                  >
                    <div style={{ ...styles.statIconWrapper, backgroundColor: cfg.bg }}>
                      <IconComp sx={{ fontSize: 22, color: cfg.color }} />
                    </div>
                    <div>
                      <div style={styles.statLabel}>{cfg.label}</div>
                      <div style={styles.statValue}>{stats[cfg.key]}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter & Pencarian */}
            <div className="filter-card-responsive" style={styles.filterCard}>
              <div className="filter-left-responsive" style={styles.filterLeft}>
                {/* Search Bar */}
                <div className="search-wrapper-responsive" style={styles.searchWrapper}>
                  <SearchOutlinedIcon sx={{ color: '#23573c', fontSize: 20, flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Cari nama pembeli..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input-responsive"
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={styles.searchClearBtn}
                      title="Hapus pencarian"
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="filter-right-responsive" style={styles.filterRight}>
                {/* Dropdown Metode Pengiriman */}
                <CustomDropdown
                  value={metodeFilter}
                  onChange={(val) => {
                    setMetodeFilter(val);
                    setCurrentPage(1);
                  }}
                  options={METODE_OPTIONS}
                  className="select-wrapper-responsive"
                  style={{ minWidth: '185px' }}
                />

                {/* Dropdown Status */}
                <CustomDropdown
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  options={STATUS_FILTER_OPTIONS}
                  className="select-wrapper-responsive"
                  style={{ minWidth: '160px' }}
                />
              </div>
            </div>

            {/* Tabel Pengiriman */}
            <div style={styles.tableCard}>
              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '31%' }} />
                  </colgroup>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, textAlign: 'center' }}>NO</th>
                      <th style={{ ...styles.th, paddingLeft: '20px' }}>PEMBELI</th>
                      <th style={{ ...styles.th, paddingLeft: '20px' }}>STATUS</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPengiriman.length > 0 ? (
                      paginatedPengiriman.map((item, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        return (
                          <tr
                            key={item.id}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8faf9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={styles.tr}
                          >
                            {/* NO */}
                            <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                              {rowNumber}
                            </td>

                            {/* PEMBELI */}
                            <td style={{ ...styles.td, paddingLeft: '20px' }}>
                              <div style={styles.buyerNameText}>{item.namaPembeli}</div>
                            </td>

                            {/* STATUS */}
                            <td style={{ ...styles.td, paddingLeft: '20px' }}>
                              <div style={styles.statusIndicatorWrapper}>
                                <span
                                  style={{
                                    ...styles.statusDot,
                                    backgroundColor: getStatusDotColor(item.status)
                                  }}
                                />
                                <span style={styles.statusText}>{item.status}</span>
                              </div>
                            </td>

                            {/* AKSI */}
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedDetail(item)}
                                style={styles.btnActionDetailOnly}
                                title="Lihat Detail Lengkap Pengiriman"
                              >
                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Detail</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} style={styles.emptyTable}>
                          Tidak ada data pengiriman yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={styles.cardFooter} className="pagination-responsive">
                <div style={styles.pageInfo}>
                  {filteredPengiriman.length > 0
                    ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredPengiriman.length)} dari ${filteredPengiriman.length}`
                    : '0 dari 0'}
                </div>

                <div style={styles.paginationButtons}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    style={{
                      ...styles.btnPageArrow,
                      opacity: currentPage === 1 ? 0.4 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      style={{
                        ...styles.btnPageNum,
                        ...(currentPage === page ? styles.btnPageNumActive : {})
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    style={{
                      ...styles.btnPageArrow,
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail Pengiriman Modul */}
      {selectedDetail && (() => {
        const subtotalModul = (selectedDetail.itemModul || []).reduce(
          (sum, item) => sum + (item.harga || 0) * (item.qty || 1),
          0
        );
        const ongkirKurir = selectedDetail.metode === 'Via Kurir' ? 10000 : 0;
        const totalHarga = subtotalModul + ongkirKurir;

        return (
          <div style={styles.modalOverlay} onClick={() => setSelectedDetail(null)}>
            <div style={styles.modalContentDetail} className="modal-detail-responsive" onClick={(e) => e.stopPropagation()}>
              {/* Header Modal */}
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Detail Pengiriman Modul</h3>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  style={styles.modalCloseBtn}
                  title="Tutup Modal"
                >
                  <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              <div style={styles.detailBody}>
                {/* Metadata Pesanan & Status */}
                <div style={styles.detailMetaCard}>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>No. Pesanan</span>
                    <span style={styles.detailMetaValueGreen}>{selectedDetail.id}</span>
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>Metode Pengiriman</span>
                    <span style={styles.detailMetaValue}>{selectedDetail.metode}</span>
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>Tanggal Pengiriman</span>
                    <input
                      type="date"
                      value={selectedDetail.tanggalKirim || ''}
                      onChange={(e) =>
                        setSelectedDetail((prev) => ({ ...prev, tanggalKirim: e.target.value }))
                      }
                      style={styles.metaDateInput}
                      title="Pilih atau ubah tanggal pengiriman"
                    />
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>Ubah Status</span>
                    <div style={{ marginTop: '2px' }}>
                      <CustomDropdown
                        value={selectedDetail.status}
                        onChange={(newStatus) =>
                          setSelectedDetail((prev) => {
                            const today = new Date().toISOString().split('T')[0];
                            return {
                              ...prev,
                              status: newStatus,
                              tanggalKirim:
                                newStatus === 'Dikirim' && !prev.tanggalKirim ? today : prev.tanggalKirim
                            };
                          })
                        }
                        options={['Perlu Dikirim', 'Dikirim', 'Selesai']}
                        style={{ width: '100%' }}
                        selectStyle={{
                          padding: '6px 12px',
                          minHeight: '34px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          backgroundColor: '#f6faf7',
                          border: '1px solid #23573c',
                          color: '#1a3e2b',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Pemesan & Pengiriman */}
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>Data Pemesan & Pengiriman</div>
                  <div style={styles.detailRecipientGrid} className="modal-form-grid2">
                    <div>
                      <span style={styles.detailFieldLabel}>Nama Pembeli</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.namaPembeli}</div>
                    </div>
                    <div>
                      <span style={styles.detailFieldLabel}>Kontak / No. HP</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.noHp}</div>
                    </div>

                    {selectedDetail.metode === 'Titip ke Ustazah' && (
                      <div>
                        <span style={styles.detailFieldLabel}>Nama Ustazah</span>
                        <div style={styles.detailFieldValue}>{selectedDetail.ustazahNama || '-'}</div>
                      </div>
                    )}

                    {selectedDetail.metode === 'Ambil di RSQ Pusat' && (
                      <div>
                        <span style={styles.detailFieldLabel}>Lokasi Pengambilan</span>
                        <div style={styles.detailFieldValue}>Kantor RSQ Pusat</div>
                      </div>
                    )}

                    {selectedDetail.metode === 'Via Kurir' && (
                      <>
                        <div>
                          <span style={styles.detailFieldLabel}>No. Kwitansi</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <input
                              type="text"
                              placeholder="Masukkan no. kwitansi..."
                              value={selectedDetail.noKwitansi || ''}
                              onChange={(e) =>
                                setSelectedDetail((prev) => ({ ...prev, noKwitansi: e.target.value }))
                              }
                              style={styles.metaTextInput}
                            />
                            {selectedDetail.noKwitansi && (
                              <button
                                type="button"
                                onClick={() => handleCopyKwitansi(selectedDetail.noKwitansi)}
                                style={styles.btnCopyResiSimple}
                                title="Salin No. Kwitansi"
                              >
                                <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
                                <span>Salin</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={styles.detailFieldLabel}>Alamat Pengiriman</span>
                          <div style={styles.detailFieldValue}>{selectedDetail.alamat}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Rincian Modul & Total Harga */}
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>Rincian Modul</div>
                  <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                    <table style={styles.detailItemTable}>
                      <thead>
                        <tr>
                          <th style={styles.detailTh}>Judul Modul</th>
                          <th style={{ ...styles.detailTh, textAlign: 'center' }}>Jumlah</th>
                          <th style={{ ...styles.detailTh, textAlign: 'right' }}>Harga Satuan</th>
                          <th style={{ ...styles.detailTh, textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedDetail.itemModul || []).map((item, idx) => (
                          <tr key={idx}>
                            <td style={styles.detailTd}>{item.nama}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'center' }}>{item.qty} Buku</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(item.harga || 0)}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                              {formatRupiah((item.harga || 0) * (item.qty || 1))}
                            </td>
                          </tr>
                        ))}
                        {selectedDetail.metode === 'Via Kurir' && (
                          <tr>
                            <td style={styles.detailTd}>Biaya Kurir</td>
                            <td style={{ ...styles.detailTd, textAlign: 'center' }}>-</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(10000)}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                              {formatRupiah(10000)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={3} style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700' }}>
                            Total:
                          </td>
                          <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700', color: '#166534', fontSize: '13.5px' }}>
                            {formatRupiah(totalHarga)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bukti Paket Diterima */}
                {(selectedDetail.status === 'Selesai' || selectedDetail.status === 'Terkirim') && selectedDetail.buktiSampai && (
                  <div style={styles.detailSection}>
                    <div style={styles.detailSectionTitle}>Bukti Paket Diterima</div>
                    <div style={styles.detailReceiptWrapper}>
                      <img
                        src={selectedDetail.buktiSampai.fotoUrl}
                        alt="Bukti Paket Diterima"
                        style={{ ...styles.detailReceiptImg, cursor: 'pointer' }}
                        onClick={() => setPreviewProofImg(selectedDetail.buktiSampai.fotoUrl)}
                        title="Klik untuk memperbesar foto bukti"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Tutup & Simpan */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  style={styles.btnModalClose}
                >
                  Tutup
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetail}
                  style={styles.btnModalSave}
                >
                  <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Simpan</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}



      {/* Preview Foto Bukti Penerimaan */}
      {previewProofImg && (
        <div style={{ ...styles.modalOverlay, zIndex: 10005 }} onClick={() => setPreviewProofImg(null)}>
          <div style={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
            <img src={previewProofImg} alt="Preview Bukti Paket Sampai" style={styles.lightboxImg} />
            <button
              type="button"
              onClick={() => setPreviewProofImg(null)}
              style={styles.lightboxCloseBtn}
              title="Tutup Preview Foto"
            >
              <CloseOutlinedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8faf9',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  contentBody: {
    flex: 1,
    padding: '24px 32px 48px',
    maxWidth: '1440px',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto'
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '22px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '2px'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '6px 6px 0 0'
  },
  tabButtonActive: {
    color: '#23573c',
    borderBottom: '3px solid #23573c',
    backgroundColor: 'rgba(35, 87, 60, 0.06)'
  },
  tabBadgeWarning: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #eef2ef',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none'
  },
  statIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#64748b',
    lineHeight: '1.2'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginTop: '2px'
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
    gap: '14px'
  },
  filterLeft: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '220px'
  },
  filterRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f6faf7',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    flex: 1,
    width: '100%',
    minWidth: '220px',
    minHeight: '38px',
    boxSizing: 'border-box'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13.5px',
    width: '100%',
    flex: 1,
    color: '#1a3e2b',
    padding: 0,
    fontFamily: 'inherit'
  },
  searchClearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    border: '1px solid #dce4de',
    overflow: 'hidden'
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#ebf2ed',
    borderBottom: '1px solid #dce4de'
  },
  th: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1d4632',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f5f2',
    transition: 'background 0.15s'
  },
  td: {
    padding: '14px 20px',
    fontSize: '14px',
    color: '#1a3e2b',
    verticalAlign: 'middle'
  },
  buyerNameText: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px'
  },
  statusIndicatorWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px'
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a3e2b'
  },
  badgeRsqPusat: {
    display: 'inline-block',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeKurir: {
    display: 'inline-block',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeUstazah: {
    display: 'inline-block',
    backgroundColor: '#f5f3ff',
    color: '#6d28d9',
    border: '1px solid #ddd6fe',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeDefault: {
    display: 'inline-block',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  subBadgeKurir: {
    display: 'inline-block',
    backgroundColor: 'rgba(35, 87, 60, 0.08)',
    color: '#23573c',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  noResiBadge: {
    display: 'inline-block',
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  btnCopyResi: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    padding: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.2s'
  },
  addressLine: {
    fontSize: '11.5px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    maxWidth: '250px'
  },
  statusSelesaiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95px',
    height: '28px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bbf7d0',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusDikirimBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95px',
    height: '28px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bae6fd',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusPerluDikirimBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '115px',
    height: '28px',
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fef08a',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  btnActionDetail: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f0f5f2',
    color: '#23573c',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnActionSend: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnActionComplete: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  badgeDoneIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    color: '#16a34a'
  },
  emptyTable: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
    fontSize: '14px'
  },
  cardFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcfdfd'
  },
  pageInfo: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  paginationButtons: {
    display: 'flex',
    gap: '6px'
  },
  btnPageArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  btnPageNum: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  btnPageNumActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderColor: '#23573c'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  },
  modalContentLarge: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '820px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalContentDetail: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '18px 22px 20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    boxSizing: 'border-box'
  },
  modalContentForm: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalContentSimpleReject: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '22px 24px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0'
  },
  modalHeaderSimple: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a3e2b',
    margin: 0
  },
  modalTitleSimpleGreen: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#166534',
    margin: 0
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px'
  },
  modalBodyScroll: {
    overflowY: 'auto',
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8faf9',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #eef2ef'
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 1
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '6px',
    transition: 'all 0.2s ease'
  },
  stepTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.2'
  },
  stepSubtitle: {
    fontSize: '10px',
    color: '#64748b',
    marginTop: '2px'
  },
  stepLine: {
    flex: 1,
    height: '3px',
    margin: '0 6px',
    marginTop: '-20px',
    borderRadius: '2px',
    transition: 'all 0.2s ease'
  },
  detailBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailMetaCard: {
    backgroundColor: '#f8faf9',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '12px 16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 18px',
    alignItems: 'center'
  },
  detailMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  detailMetaLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  detailMetaValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b'
  },
  detailMetaValueGreen: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#166534'
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailSectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a3e2b',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '5px'
  },
  detailRecipientGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 18px',
    fontSize: '13px'
  },
  detailFieldLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#64748b',
    display: 'block',
    marginBottom: '2px',
    textTransform: 'uppercase'
  },
  detailFieldValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: '1.4'
  },
  detailItemTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12.5px'
  },
  detailTh: {
    backgroundColor: '#f8fafc',
    padding: '6px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    fontWeight: '600'
  },
  detailTd: {
    padding: '6px 8px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155'
  },
  detailReceiptWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    marginTop: '6px'
  },
  detailReceiptImg: {
    width: '100%',
    maxWidth: '320px',
    maxHeight: '260px',
    objectFit: 'cover',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0'
  },
  btnCopyResiSimple: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  metaDateInput: {
    marginTop: '2px',
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '170px'
  },
  metaTextInput: {
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    maxWidth: '220px',
    boxSizing: 'border-box'
  },
  btnActionDetailOnly: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ecfdf5',
    color: '#166534',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  metodeFixedBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '8px'
  },
  lightboxContainer: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  lightboxImg: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  lightboxCloseBtn: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  btnModalClose: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnModalSave: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)',
    transition: 'all 0.2s ease'
  },
  btnModalPrimary: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)',
    transition: 'all 0.2s ease'
  },
  btnModalApprove: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  summaryInfoCard: {
    backgroundColor: '#f8faf9',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  metodeRadioGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px',
    marginTop: '6px'
  },
  metodeRadioCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  metodeRadioCardActiveGreen: {
    borderColor: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.05)'
  },
  metodeRadioCardActiveBlue: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.05)'
  },
  metodeRadioCardActivePurple: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124, 58, 237, 0.05)'
  },
  formSectionBoxBlue: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formSectionBoxGreen: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formSectionBoxPurple: {
    backgroundColor: '#f5f3ff',
    border: '1px solid #ddd6fe',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    display: 'block',
    marginBottom: '5px'
  },
  formInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  formSelect: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  formTextarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '11.5px',
    marginTop: '4px',
    display: 'block'
  },
  simpleModalBody: {
    padding: '10px 0 16px'
  },
  simpleConfirmText: {
    fontSize: '13.5px',
    color: '#334155',
    lineHeight: '1.5'
  },
  simpleModalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnSimpleCancel: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSimpleConfirmApprove: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
