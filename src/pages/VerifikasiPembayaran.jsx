import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import contohBuktiTf from '../assets/contoh bukti tf.jpeg';

// Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined';

// Data Awal
const INITIAL_PESANAN = [
  {
    id: 'ORD-2026-001',
    tanggal: '2026-10-12',
    namaPembeli: 'Yohana Abigail',
    noHp: '0812-3456-7890',
    alamat: 'Jl. Pesantren No. 14, RT 02/05, Bandung',
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 5, harga: 25000 },
      { nama: 'Tajwidi', qty: 3, harga: 30000 }
    ],
    totalBayar: 215000,
    metodeBayar: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-002',
    tanggal: '2026-10-12',
    namaPembeli: 'Ririn Anisa',
    noHp: '0857-9876-5432',
    alamat: 'Komplek Griya Indah Blok C3, Cimahi',
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 10, harga: 15000 },
      { nama: 'Anak 1', qty: 10, harga: 20000 }
    ],
    totalBayar: 350000,
    metodeBayar: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-003',
    tanggal: '2026-10-11',
    namaPembeli: 'Hendra Pratama',
    noHp: '0821-5566-7788',
    alamat: 'Jl. Cihampelas No. 45, Kota Bandung',
    itemModul: [
      { nama: 'Tahmidi', qty: 4, harga: 28000 }
    ],
    totalBayar: 112000,
    metodeBayar: 'Tunai',
    status: 'Menunggu Verifikasi',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-004',
    tanggal: '2026-10-10',
    namaPembeli: 'Ust. Ridwan Kamil',
    noHp: '0813-1122-3344',
    alamat: 'Pondok Pesantren Al-Hidayah, Kab. Sumedang',
    itemModul: [
      { nama: 'Mushaf Ash Shahib A5 Terjemah', qty: 8, harga: 75000 },
      { nama: 'Panduan Guru', qty: 2, harga: 40000 }
    ],
    totalBayar: 680000,
    metodeBayar: 'Transfer Bank',
    status: 'Disetujui',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-005',
    tanggal: '2026-10-09',
    namaPembeli: 'Budi Santoso',
    noHp: '0878-4455-6677',
    alamat: 'Jl. Riau No. 88, Kota Bandung',
    itemModul: [
      { nama: 'Khat', qty: 4, harga: 22000 }
    ],
    totalBayar: 88000,
    metodeBayar: 'Transfer Bank',
    status: 'Ditolak',
    alasanPenolakan: 'Nominal transfer di bukti struk tidak sesuai dengan total tagihan.'
  },
  {
    id: 'ORD-2026-006',
    tanggal: '2026-10-08',
    namaPembeli: 'Farhan Ramadhan',
    noHp: '0812-7788-9900',
    alamat: 'Jl. Sukajadi No. 102, Sukasari, Bandung',
    itemModul: [
      { nama: 'Tahsin Dewasa', qty: 3, harga: 35000 },
      { nama: 'Tajwidi', qty: 1, harga: 30000 }
    ],
    totalBayar: 135000,
    metodeBayar: 'Transfer Bank',
    status: 'Belum Bayar',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-007',
    tanggal: '2026-09-25',
    namaPembeli: 'Dewi Lestari',
    noHp: '0852-3344-5566',
    alamat: 'Jl. Antapani Raya No. 15, Bandung',
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 5, harga: 15000 }
    ],
    totalBayar: 75000,
    metodeBayar: 'Transfer Bank',
    status: 'Dibatalkan',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-008',
    tanggal: '2026-08-14',
    namaPembeli: 'Rian Hidayat',
    noHp: '0877-6655-4433',
    alamat: 'Komp. Margahayu Kencana Blok B2, Kab. Bandung',
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 4, harga: 25000 },
      { nama: 'Khat', qty: 2, harga: 22000 }
    ],
    totalBayar: 144000,
    metodeBayar: 'Tunai',
    status: 'Kedaluwarsa',
    alasanPenolakan: ''
  }
];

// Card Statistik
const STATS_CONFIG = [
  { key: 'totalMenunggu', label: 'Menunggu Verifikasi', status: 'Menunggu Verifikasi', border: '#d97706', color: '#d97706', bg: '#fef3c7', icon: PendingActionsOutlinedIcon },
  { key: 'totalDisetujui', label: 'Disetujui', status: 'Disetujui', border: '#16a34a', color: '#16a34a', bg: '#dcfce7', icon: TaskAltOutlinedIcon },
  { key: 'totalDitolak', label: 'Ditolak', status: 'Ditolak', border: '#dc2626', color: '#dc2626', bg: '#fee2e2', icon: CancelOutlinedIcon },
  { key: 'totalBelumBayar', label: 'Belum Bayar', status: 'Belum Bayar', border: '#2563eb', color: '#2563eb', bg: '#dbeafe', icon: AccessTimeOutlinedIcon },
  { key: 'totalDibatalkan', label: 'Dibatalkan', status: 'Dibatalkan', border: '#94a3b8', color: '#94a3b8', bg: '#f1f5f9', icon: RemoveCircleOutlineOutlinedIcon },
  { key: 'totalKedaluwarsa', label: 'Kedaluwarsa', status: 'Kedaluwarsa', border: '#64748b', color: '#64748b', bg: '#e2e8f0', icon: TimerOffOutlinedIcon }
];

export default function VerifikasiPembayaran() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('verifikasi');
  
  // Data State
  const [pesananList, setPesananList] = useState(INITIAL_PESANAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [notification, setNotification] = useState(null);

  // Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [approvingOrder, setApprovingOrder] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [alasanTolak, setAlasanTolak] = useState('');
  const [alasanError, setAlasanError] = useState('');

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
  const filteredPesanan = useMemo(() => {
    return pesananList.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaPembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemModul.some((m) => m.nama.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'Semua Status' ||
        item.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'Ditolak' && (item.status === 'Pembayaran Ditolak' || item.status === 'Ditolak'));

      const matchDateRange =
        (!startDate || item.tanggal >= startDate) &&
        (!endDate || item.tanggal <= endDate);

      return matchSearch && matchStatus && matchDateRange;
    });
  }, [pesananList, searchQuery, statusFilter, startDate, endDate]);

  // Pagination
  const totalPages = Math.ceil(filteredPesanan.length / itemsPerPage) || 1;
  const paginatedPesanan = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPesanan.slice(start, start + itemsPerPage);
  }, [filteredPesanan, currentPage]);

  // Statistik
  const stats = useMemo(() => {
    return {
      totalMenunggu: pesananList.filter((p) => p.status === 'Menunggu Verifikasi').length,
      totalDisetujui: pesananList.filter((p) => p.status === 'Disetujui').length,
      totalDitolak: pesananList.filter((p) => p.status === 'Ditolak' || p.status === 'Pembayaran Ditolak').length,
      totalBelumBayar: pesananList.filter((p) => p.status === 'Belum Bayar').length,
      totalDibatalkan: pesananList.filter((p) => p.status === 'Dibatalkan').length,
      totalKedaluwarsa: pesananList.filter((p) => p.status === 'Kedaluwarsa').length
    };
  }, [pesananList]);

  // Klik Kartu Statistik
  const handleStatCardClick = (targetStatus) => {
    setStatusFilter((prev) => (prev.toLowerCase() === targetStatus.toLowerCase() ? 'Semua Status' : targetStatus));
    setCurrentPage(1);
  };

  // Warna Dot Status
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Menunggu Verifikasi': return '#d97706';
      case 'Disetujui': return '#16a34a';
      case 'Ditolak':
      case 'Pembayaran Ditolak': return '#dc2626';
      case 'Belum Bayar': return '#2563eb';
      case 'Dibatalkan': return '#94a3b8';
      case 'Kedaluwarsa': return '#64748b';
      default: return '#94a3b8';
    }
  };

  // Setujui Pembayaran
  const handleSetujuiPembayaran = (order) => {
    setPesananList((prev) =>
      prev.map((item) => (item.id === order.id ? { ...item, status: 'Disetujui', alasanPenolakan: '' } : item))
    );
    if (selectedDetail && selectedDetail.id === order.id) {
      setSelectedDetail((prev) => ({ ...prev, status: 'Disetujui', alasanPenolakan: '' }));
    }
    showToast(`Pembayaran ${order.id} berhasil disetujui!`, 'success');
  };

  // Buka Modal Tolak
  const handleOpenTolakModal = (order) => {
    setRejectingOrder(order);
    setAlasanTolak('');
    setAlasanError('');
  };

  // Konfirmasi Tolak
  const handleConfirmTolak = () => {
    if (!alasanTolak.trim()) {
      setAlasanError('Alasan penolakan harus diisi');
      return;
    }
    setPesananList((prev) =>
      prev.map((item) =>
        item.id === rejectingOrder.id ? { ...item, status: 'Ditolak', alasanPenolakan: alasanTolak.trim() } : item
      )
    );
    const orderId = rejectingOrder.id;
    if (selectedDetail && selectedDetail.id === orderId) {
      setSelectedDetail((prev) => ({ ...prev, status: 'Ditolak', alasanPenolakan: alasanTolak.trim() }));
    }
    setRejectingOrder(null);
    showToast(`Pembayaran ${orderId} telah ditolak.`, 'error');
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
          {/* Notifikasi Toast */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#166534' : '#991b1b'
              }}
            >
              {notification.type === 'success' ? (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Tab Navigasi */}
          <div style={styles.tabContainer} className="tab-container-responsive">
            <button
              type="button"
              onClick={() => setActiveTab('verifikasi')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'verifikasi' ? styles.tabButtonActive : {})
              }}
            >
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Verifikasi Pembayaran</span>
              {stats.totalMenunggu > 0 && (
                <span style={styles.tabBadgeWarning}>{stats.totalMenunggu}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/status-pengiriman')}
              style={styles.tabButton}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Status Pengiriman</span>
            </button>
          </div>

          {/* Tab 1: Verifikasi Pembayaran */}
          {activeTab === 'verifikasi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Kartu Statistik */}
              <div style={styles.statsGrid} className="stats-grid-responsive">
                {STATS_CONFIG.map((cfg) => {
                  const IconComp = cfg.icon;
                  const isActive = statusFilter === cfg.status;
                  return (
                    <div
                      key={cfg.status}
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

              {/* Pencarian & Filter */}
              <div style={styles.filterCard} className="filter-card-responsive">
                {/* Pencarian Nama Pembeli */}
                <div style={styles.searchWrapper} className="search-wrapper-responsive">
                  <SearchOutlinedIcon sx={{ color: '#23573c', fontSize: 20 }} />
                  <input
                    type="text"
                    placeholder="Cari nama pembeli..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={styles.searchInput}
                    className="search-input-responsive"
                  />
                </div>

                {/* Filter Rentang Tanggal (dd/mm/yyyy) */}
                <div style={styles.dateRangeWrapper} className="date-range-responsive">
                  <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClick={(e) => {
                      try { e.target.showPicker?.(); } catch {}
                    }}
                    style={styles.dateInput}
                    className="date-input-clean"
                    title="Tanggal Mulai (dd/mm/yyyy)"
                  />
                  <span style={styles.dateSeparator}>s/d</span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClick={(e) => {
                      try { e.target.showPicker?.(); } catch {}
                    }}
                    style={styles.dateInput}
                    className="date-input-clean"
                    title="Tanggal Akhir (dd/mm/yyyy)"
                  />
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setCurrentPage(1);
                      }}
                      style={styles.dateClearBtn}
                      title="Reset filter rentang tanggal"
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                    </button>
                  )}
                </div>

                <div style={styles.filterRight} className="filter-right-responsive">
                  <div style={styles.customSelectContainer} className="select-wrapper-responsive">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={styles.selectFilterPill}
                      className="select-responsive"
                      title="Filter berdasarkan Status"
                    >
                      <option value="Semua Status">Semua Status</option>
                      <option value="Belum Bayar">Belum Bayar</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Disetujui">Disetujui</option>
                      <option value="Ditolak">Ditolak</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                      <option value="Kedaluwarsa">Kedaluwarsa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tabel Pesanan */}
              <div style={styles.tableCard}>
                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={{ ...styles.th, width: '5%', textAlign: 'center' }}>NO</th>
                        <th style={{ ...styles.th, width: '15%' }}>TANGGAL</th>
                        <th style={{ ...styles.th, width: '26%' }}>PEMBELI</th>
                        <th style={{ ...styles.th, width: '23%' }}>STATUS</th>
                        <th style={{ ...styles.th, width: '18%' }}>TOTAL</th>
                        <th style={{ ...styles.th, width: '13%', textAlign: 'center' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPesanan.map((item, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        const isMenunggu = item.status === 'Menunggu Verifikasi';

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedDetail(item)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8faf9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{ ...styles.tr, cursor: 'pointer' }}
                            title="Klik baris untuk melihat detail lengkap pesanan"
                          >
                            {/* NO */}
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                              {rowNumber}
                            </td>

                            {/* TANGGAL */}
                            <td style={{ ...styles.td, color: '#1a3e2b', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' }}>
                              {formatTanggal(item.tanggal)}
                            </td>

                            {/* PEMBELI */}
                            <td style={styles.td}>
                              <div style={styles.buyerNameText}>{item.namaPembeli}</div>
                            </td>

                            {/* STATUS */}
                            <td style={styles.td}>
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

                            {/* TOTAL */}
                            <td style={styles.td}>
                              <div style={styles.totalPriceText}>{formatRupiah(item.totalBayar)}</div>
                            </td>

                            {/* AKSI */}
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              {isMenunggu ? (
                                <div style={styles.actionButtonsWrapper} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setApprovingOrder(item);
                                    }}
                                    style={styles.btnApprove}
                                    title="Setujui Pembayaran"
                                  >
                                    <CheckCircleOutlinedIcon sx={{ fontSize: 21 }} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenTolakModal(item);
                                    }}
                                    style={styles.btnReject}
                                    title="Tolak Pembayaran"
                                  >
                                    <CancelOutlinedIcon sx={{ fontSize: 21 }} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontWeight: '500' }}>-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {filteredPesanan.length === 0 && (
                        <tr>
                          <td colSpan={6} style={styles.emptyTable}>
                            Tidak ada pesanan yang sesuai dengan pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-responsive" style={styles.cardFooter}>
                  <div style={styles.pageInfo}>
                    {filteredPesanan.length > 0 ? (
                      <>
                        {(currentPage - 1) * itemsPerPage + 1} -{' '}
                        {Math.min(currentPage * itemsPerPage, filteredPesanan.length)} dari{' '}
                        {filteredPesanan.length}
                      </>
                    ) : (
                      '0 dari 0'
                    )}
                  </div>

                  {filteredPesanan.length > 10 ? (
                    <div style={styles.paginationButtons}>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        style={{ ...styles.btnPageArrow, opacity: currentPage === 1 ? 0.4 : 1 }}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          style={{
                            ...styles.btnPageNum,
                            ...(currentPage === num ? styles.btnPageNumActive : {})
                          }}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        style={{
                          ...styles.btnPageArrow,
                          opacity: currentPage === totalPages ? 0.4 : 1
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                  ) : (
                    <div style={styles.paginationButtons}>
                      <button disabled style={{ ...styles.btnPageArrow, opacity: 0.4 }}>&lt;</button>
                      <button style={{ ...styles.btnPageNum, ...styles.btnPageNumActive }}>1</button>
                      <button disabled style={{ ...styles.btnPageArrow, opacity: 0.4 }}>&gt;</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Status Pengiriman */}
          {activeTab === 'pengiriman' && (
            <div style={styles.emptyTabContent} />
          )}
        </main>
      </div>

      {/* Modal 1: Konfirmasi Setujui */}
      {approvingOrder && (
        <div style={{ ...styles.modalOverlay, zIndex: 10001 }} onClick={() => setApprovingOrder(null)}>
          <div style={styles.modalContentSimpleReject} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeaderSimple}>
              <h3 style={styles.modalTitleSimpleGreen}>Konfirmasi Setujui Pembayaran</h3>
              <button
                type="button"
                onClick={() => setApprovingOrder(null)}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.simpleModalBody}>
              <p style={{ ...styles.simpleConfirmText, marginBottom: 0 }}>
                Apakah Anda yakin ingin menyetujui pembayaran?
              </p>
            </div>

            <div style={styles.simpleModalFooter}>
              <button
                type="button"
                onClick={() => setApprovingOrder(null)}
                style={styles.btnSimpleCancel}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSetujuiPembayaran(approvingOrder);
                  setApprovingOrder(null);
                }}
                style={styles.btnSimpleConfirmApprove}
              >
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Konfirmasi Tolak */}
      {rejectingOrder && (
        <div style={{ ...styles.modalOverlay, zIndex: 10001 }} onClick={() => setRejectingOrder(null)}>
          <div style={styles.modalContentSimpleReject} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeaderSimple}>
              <h3 style={styles.modalTitleSimple}>Konfirmasi Tolak Pembayaran</h3>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.simpleModalBody}>
              <p style={{ ...styles.simpleConfirmText, marginBottom: 0 }}>
                Apakah Anda yakin ingin menolak pembayaran?
              </p>

              <div style={{ marginTop: '12px' }}>
                <label style={styles.simpleInputLabel}>
                  Alasan Penolakan <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={alasanTolak}
                  onChange={(e) => {
                    setAlasanTolak(e.target.value);
                    if (e.target.value.trim()) setAlasanError('');
                  }}
                  placeholder="Masukkan alasan penolakan pembayaran..."
                  style={{
                    ...styles.simpleTextarea,
                    borderColor: alasanError ? '#dc2626' : '#cbd5e1'
                  }}
                />
                {alasanError && (
                  <span style={styles.simpleErrorText}>{alasanError}</span>
                )}
              </div>
            </div>

            <div style={styles.simpleModalFooter}>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                style={styles.btnSimpleCancel}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmTolak}
                style={styles.btnSimpleConfirm}
              >
                Tolak Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Detail Pesanan */}
      {selectedDetail && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDetail(null)}>
          <div style={styles.modalContentDetail} className="modal-detail-responsive" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detail Pesanan</h3>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.detailBody}>
              {/* Metadata Pesanan */}
              <div style={styles.detailMetaCard}>
                <div style={styles.detailMetaItem}>
                  <span style={styles.detailMetaLabel}>No. Pesanan</span>
                  <span style={styles.detailMetaValueGreen}>{selectedDetail.id}</span>
                </div>
                <div style={styles.detailMetaItem}>
                  <span style={styles.detailMetaLabel}>Tanggal</span>
                  <span style={styles.detailMetaValue}>{formatTanggal(selectedDetail.tanggal)}</span>
                </div>
                <div style={styles.detailMetaItem}>
                  <span style={styles.detailMetaLabel}>Metode Pembayaran</span>
                  <span style={styles.detailMetaValue}>{selectedDetail.metodeBayar}</span>
                </div>
                <div style={styles.detailMetaItem}>
                  <span style={styles.detailMetaLabel}>Status Transaksi</span>
                  <div style={styles.detailStatusWrapper}>
                    <span
                      style={{
                        ...styles.statusDot,
                        backgroundColor: getStatusDotColor(selectedDetail.status)
                      }}
                    />
                    <span style={styles.detailStatusText}>{selectedDetail.status}</span>
                  </div>
                </div>
              </div>

              {/* Data Pemesan & Pengiriman */}
              <div style={styles.detailSection}>
                <div style={styles.detailSectionTitle}>Data Pemesan & Pengiriman</div>
                <div style={styles.detailRecipientGrid} className="modal-form-grid2">
                  <div>
                    <span style={styles.detailFieldLabel}>Nama Pemesan</span>
                    <div style={styles.detailFieldValue}>{selectedDetail.namaPembeli}</div>
                  </div>
                  <div>
                    <span style={styles.detailFieldLabel}>No.Hp</span>
                    <div style={styles.detailFieldValue}>{selectedDetail.noHp}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={styles.detailFieldLabel}>Alamat Pengiriman</span>
                    <div style={styles.detailFieldValue}>{selectedDetail.alamat}</div>
                  </div>
                  {selectedDetail.alasanPenolakan && (
                    <div style={{ gridColumn: 'span 2', ...styles.detailRejectAlert }}>
                      <strong>Alasan Ditolak:</strong> {selectedDetail.alasanPenolakan}
                    </div>
                  )}
                </div>
              </div>

              {/* Rincian Modul */}
              <div style={styles.detailSection}>
                <div style={styles.detailSectionTitle}>Rincian Modul</div>
                <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                  <table style={styles.detailItemTable}>
                    <thead>
                      <tr>
                        <th style={styles.detailTh}>Judul Modul</th>
                        <th style={{ ...styles.detailTh, textAlign: 'center' }}>Jumlah</th>
                        <th style={{ ...styles.detailTh, textAlign: 'right' }}>Harga</th>
                        <th style={{ ...styles.detailTh, textAlign: 'right' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDetail.itemModul.map((item, idx) => (
                        <tr key={idx}>
                          <td style={styles.detailTd}>{item.nama}</td>
                          <td style={{ ...styles.detailTd, textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(item.harga)}</td>
                          <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                            {formatRupiah(item.harga * item.qty)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700' }}>
                          Total:
                        </td>
                        <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700', color: '#166534' }}>
                          {formatRupiah(selectedDetail.totalBayar)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bukti Transfer Bank */}
              {selectedDetail.metodeBayar === 'Transfer Bank' &&
                selectedDetail.status !== 'Belum Bayar' &&
                selectedDetail.status !== 'Dibatalkan' &&
                selectedDetail.status !== 'Kedaluwarsa' && (
                  <div style={styles.detailSection}>
                    <div style={styles.detailSectionTitle}>Bukti Transfer Bank</div>
                    <div style={styles.detailReceiptWrapper}>
                      <img src={contohBuktiTf} alt="Bukti Transfer" style={styles.detailReceiptImg} />
                    </div>
                  </div>
                )}
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                style={styles.btnModalClose}
              >
                Batal
              </button>

              {/* Tombol Aksi Verifikasi Langsung dari Modal Detail */}
              {selectedDetail.status === 'Menunggu Verifikasi' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenTolakModal(selectedDetail)}
                    style={styles.btnModalReject}
                    title="Tolak Pembayaran"
                  >
                    <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApprovingOrder(selectedDetail)}
                    style={styles.btnModalApprove}
                    title="Setujui Pembayaran"
                  >
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Setujui</span>
                  </button>
                </>
              )}
            </div>
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
    gap: '10px',
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
    backgroundColor: '#d97706',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700'
  },
  emptyTabContent: {
    minHeight: '300px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
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
    borderRadius: '12px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #eef2ef'
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
    minWidth: '220px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13.5px',
    width: '100%',
    color: '#1a3e2b'
  },
  dateRangeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f6faf7',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    boxSizing: 'border-box'
  },
  dateInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    fontFamily: 'inherit',
    color: '#1a3e2b',
    cursor: 'pointer',
    width: '110px',
    padding: 0
  },
  dateSeparator: {
    fontSize: '12px',
    color: '#23573c',
    fontWeight: '600',
    userSelect: 'none'
  },
  dateClearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    borderRadius: '50%',
    marginLeft: '2px'
  },
  filterRight: {
    display: 'flex',
    alignItems: 'center'
  },
  customSelectContainer: {
    position: 'relative'
  },
  selectFilterPill: {
    padding: '8px 36px 8px 16px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    backgroundColor: '#f6faf7',
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1a3e2b',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2323573c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '14px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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
  totalPriceText: {
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
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  btnApprove: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f0f5f2',
    color: '#23573c',
    cursor: 'pointer'
  },
  btnReject: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    cursor: 'pointer'
  },
  emptyTable: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontSize: '14px'
  },
  cardFooter: {
    padding: '16px 24px',
    minHeight: '64px',
    boxSizing: 'border-box',
    borderTop: '1px solid #edf2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '400'
  },
  paginationButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnPageArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    backgroundColor: '#ffffff',
    color: '#3d5246',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.15s'
  },
  btnPageNum: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    backgroundColor: '#ffffff',
    color: '#3d5246',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s'
  },
  btnPageNumActive: {
    backgroundColor: '#23573c',
    border: 'none',
    color: '#ffffff',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.3)'
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
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a3e2b',
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
    borderRadius: '6px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnModalApprove: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnModalReject: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1.2px solid #ef4444',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modalContentSimpleReject: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
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
  modalTitleSimpleGreen: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#23573c',
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
  simpleInputLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '6px'
  },
  simpleTextarea: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none'
  },
  simpleErrorText: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  simpleModalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px'
  },
  btnSimpleCancel: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSimpleConfirm: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSimpleConfirmApprove: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modalContentDetail: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '540px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '22px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    boxSizing: 'border-box'
  },
  detailBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailMetaCard: {
    backgroundColor: '#f8faf9',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '12px 16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 18px'
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
  detailStatusWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  detailStatusText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
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
    marginBottom: '2px'
  },
  detailFieldValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: '1.4'
  },
  detailRejectAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12.5px',
    color: '#b91c1c',
    marginTop: '4px'
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
    padding: '16px',
    border: '1px solid #e2e8f0',
    marginTop: '4px'
  },
  detailReceiptImg: {
    width: '100%',
    maxWidth: '380px',
    maxHeight: '480px',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  }
};
