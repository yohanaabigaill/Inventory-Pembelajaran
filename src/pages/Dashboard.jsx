import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

// Data Modul Awal
const INITIAL_DASHBOARD_MODULS = [
  { id: 1, nama: 'Asasi', kategori: 'Al Haqq', stok: 240 },
  { id: 2, nama: 'Asasi 2', kategori: 'Al Haqq', stok: 180 },
  { id: 3, nama: 'Tahmidi', kategori: 'Al Haqq', stok: 3 },
  { id: 4, nama: 'Tawasuthi', kategori: 'Al Haqq', stok: 95 },
  { id: 5, nama: 'Idadi', kategori: 'Al Haqq', stok: 1 },
  { id: 6, nama: 'Tahsini', kategori: 'Al Haqq', stok: 85 },
  { id: 7, nama: 'Al Hisan 1', kategori: 'Al Hisan', stok: 150 },
  { id: 8, nama: 'Al Hisan 2', kategori: 'Al Hisan', stok: 4 },
  { id: 9, nama: 'Al Hisan 3', kategori: 'Al Hisan', stok: 4 },
  { id: 10, nama: 'Utsmani 1', kategori: 'Tahsin Usmani', stok: 0 },
  { id: 11, nama: 'Utsmani 2', kategori: 'Tahsin Usmani', stok: 70 },
  { id: 12, nama: 'Buku Doa', kategori: 'RSQ Kids', stok: 2 },
  { id: 13, nama: 'Buku Hadist', kategori: 'RSQ Kids', stok: 90 },
  { id: 14, nama: 'Khat', kategori: 'Umum', stok: 2 },
  { id: 15, nama: 'Mushaf Ash Shahib A5 Terjemah', kategori: 'Al Quran Wakaf', stok: 320 },
  { id: 16, nama: 'Mushaf Al Kamil A5 Terjemah', kategori: 'Al Quran', stok: 210 }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [modulList] = useState(INITIAL_DASHBOARD_MODULS);
  const [isExpandedLowStock, setIsExpandedLowStock] = useState(false);

  // Filter modul stok menipis dan diurutkan dari stok terkecil ke terbesar
  const lowStockModuls = useMemo(() => {
    return modulList
      .filter((m) => m.stok < 5)
      .sort((a, b) => a.stok - b.stok);
  }, [modulList]);

  // Daftar yang ditampilkan (maksimal 5 terendah jika belum klik 'Lihat Selengkapnya')
  const displayedLowStockModuls = useMemo(() => {
    if (isExpandedLowStock) {
      return lowStockModuls;
    }
    return lowStockModuls.slice(0, 5);
  }, [lowStockModuls, isExpandedLowStock]);

  // Statistik Utama
  const totalJudulModul = modulList.length;
  const totalStokFisik = useMemo(() => {
    return modulList.reduce((sum, item) => sum + Number(item.stok || 0), 0);
  }, [modulList]);
  const totalPembeli = 24;

  // Distribusi per Kategori
  const categoryStats = useMemo(() => {
    const counts = {};
    modulList.forEach((item) => {
      counts[item.kategori] = (counts[item.kategori] || 0) + Number(item.stok || 0);
    });

    return Object.entries(counts).map(([kategori, stok]) => ({
      kategori,
      stok,
      persen: totalStokFisik > 0 ? Math.round((stok / totalStokFisik) * 100) : 0
    })).sort((a, b) => b.stok - a.stok);
  }, [modulList, totalStokFisik]);

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        role="admin"
        activeMenu="Dashboard"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Dashboard"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main style={styles.contentBody} className="content-body-responsive">
          {/* 3 KARTU STATISTIK */}
          <div style={styles.statsGrid} className="stats-grid-responsive">
            {/* Card 1: Total Judul Modul */}
            <div style={styles.statCard}>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Total Judul Modul</div>
                <div style={styles.statValue}>{totalJudulModul}</div>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#e8f5ed', color: '#23573c' }}>
                <MenuBookOutlinedIcon sx={{ fontSize: 26 }} />
              </div>
            </div>

            {/* Card 2: Total Stok Fisik */}
            <div style={styles.statCard}>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Total Stok Fisik</div>
                <div style={styles.statValue}>{totalStokFisik.toLocaleString('id-ID')}</div>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#e8f5ed', color: '#23573c' }}>
                <Inventory2OutlinedIcon sx={{ fontSize: 26 }} />
              </div>
            </div>

            {/* Card 3: Total Pembeli */}
            <div style={styles.statCard}>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>Total Pembeli</div>
                <div style={styles.statValue}>{totalPembeli}</div>
              </div>
              <div style={{ ...styles.statIconBox, backgroundColor: '#e8f5ed', color: '#23573c' }}>
                <PeopleAltOutlinedIcon sx={{ fontSize: 26 }} />
              </div>
            </div>
          </div>

          {/* DUA KOLOM KONTEN UTAMA */}
          <div className="dashboard-main-grid-responsive">
            {/* KOLOM KIRI: DAFTAR MODUL DENGAN STOK MENIPIS*/}
            <div style={styles.cardSection}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={styles.sectionIconBoxWarning}>
                    <WarningAmberRoundedIcon sx={{ fontSize: 20, color: '#dc2626' }} />
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>Daftar Modul Stok Menipis</h2>
                  </div>
                </div>
              </div>

              {lowStockModuls.length > 0 ? (
                <>
                  <div style={styles.tableContainer}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.thRow}>
                          <th style={{ ...styles.th, width: '40px', textAlign: 'center' }}>NO</th>
                          <th style={styles.th}>JUDUL MODUL</th>
                          <th style={styles.th}>KATEGORI</th>
                          <th style={{ ...styles.th, textAlign: 'center' }}>SISA STOK</th>
                          <th style={styles.th}>STATUS</th>
                          <th style={{ ...styles.th, textAlign: 'center' }}>AKSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedLowStockModuls.map((modul, idx) => {
                          const isHabis = modul.stok === 0;

                          return (
                            <tr key={modul.id} style={styles.tr}>
                              <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                                {idx + 1}
                              </td>
                              <td style={styles.td}>
                                <div style={styles.namaModulOnly}>
                                  {modul.nama}
                                </div>
                              </td>
                              <td style={styles.td}>
                                <div style={styles.jenisTextPlainBold}>
                                  {modul.kategori}
                                </div>
                              </td>
                              <td style={{ ...styles.td, textAlign: 'center' }}>
                                <span style={styles.stokValue}>
                                  {modul.stok}
                                </span>
                              </td>
                              <td style={styles.td}>
                                {isHabis ? (
                                  <span style={styles.statusHabisNoDot}>Habis</span>
                                ) : (
                                  <span style={styles.statusMenipisNoDot}>Stok Menipis</span>
                                )}
                              </td>
                              <td style={{ ...styles.td, textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => navigate('/modul-masuk')}
                                  style={styles.btnRestockTable}
                                >
                                  <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                  <span>Tambah</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {lowStockModuls.length > 5 && (
                    <div style={styles.viewMoreContainer}>
                      <span style={styles.viewMoreInfo}>
                        1 - {displayedLowStockModuls.length} dari {lowStockModuls.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsExpandedLowStock((prev) => !prev)}
                        style={styles.btnViewMore}
                      >
                        <span>
                          {isExpandedLowStock
                            ? 'Tampilkan Lebih Sedikit'
                            : 'Lihat Selengkapnya'}
                        </span>
                        {isExpandedLowStock ? (
                          <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.emptyBox}>
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 44, color: '#16a34a', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', color: '#166534', fontSize: '15px' }}>
                    Semua Stok Modul Terpenuhi
                  </div>
                  <p style={{ color: '#475569', fontSize: '13px', margin: '4px 0 0' }}>
                    Tidak ada modul yang memiliki stok kurang dari 5.
                  </p>
                </div>
              )}
            </div>

            {/* KOLOM KANAN: DISTRIBUSI KATEGORI */}
            <div style={styles.rightCol}>

              {/* Card Distribusi Stok per Kategori */}
              <div style={styles.cardSection}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.sectionIconBoxGreen}>
                      <CategoryOutlinedIcon sx={{ fontSize: 20, color: '#23573c' }} />
                    </div>
                    <div>
                      <h2 style={styles.cardTitle}>Stok per Kategori</h2>
                    </div>
                  </div>
                </div>

                <div style={styles.categoryList}>
                  {categoryStats.map((cat, idx) => (
                    <div key={idx} style={styles.categoryItem}>
                      <div style={styles.categoryHeader}>
                        <span style={styles.namaModulOnly}>{cat.kategori}</span>
                        <span style={styles.stokValue}>
                          {cat.stok.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div style={styles.progressBarTrack}>
                        <div
                          style={{
                            ...styles.progressBarFill,
                            width: `${Math.max(cat.persen, 4)}%`,
                            backgroundColor: idx === 0 ? '#23573c' : idx === 1 ? '#0284c7' : idx === 2 ? '#16a34a' : '#d97706'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Status Badge
const baseStatusBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '105px',
  height: '28px',
  borderRadius: '6px',
  fontSize: '11.5px',
  fontWeight: '700',
  letterSpacing: '0.4px',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box'
};

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
    overflowX: 'hidden',
    backgroundColor: '#f8faf9'
  },
  contentBody: {
    padding: '24px 32px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #eef2ef',
    borderLeft: '4px solid #23573c',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '14px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    lineHeight: '1.3'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a3e2b',
    lineHeight: '1.2'
  },
  statIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #edf2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap'
  },
  sectionIconBoxWarning: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  sectionIconBoxGreen: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#e8f5ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1a3e2b',
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    lineHeight: 1.2
  },
  tableContainer: {
    overflowX: 'auto',
    width: '100%'
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
    fontSize: '13.5px',
    verticalAlign: 'middle'
  },
  namaModulOnly: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px'
  },
  jenisTextPlainBold: {
    fontSize: '14px',
    color: '#1a3e2b',
    fontWeight: '700'
  },
  stokValue: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#162a20'
  },
  statusMenipisNoDot: {
    ...baseStatusBadge,
    backgroundColor: '#fef3c7',
    color: '#d97706',
    border: '1px solid #d97706'
  },
  statusHabisNoDot: {
    ...baseStatusBadge,
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #dc2626'
  },
  btnRestockTable: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(35, 87, 60, 0.2)',
    transition: 'all 0.15s ease'
  },
  emptyBox: {
    padding: '36px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  viewMoreContainer: {
    padding: '12px 20px',
    borderTop: '1px solid #edf2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafbfc',
    flexWrap: 'wrap',
    gap: '10px'
  },
  viewMoreInfo: {
    fontSize: '13.5px',
    color: '#64748b',
    fontWeight: '400'
  },
  btnViewMore: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
  },
  categoryList: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  progressBarTrack: {
    height: '9px',
    backgroundColor: '#eef2ef',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.4s ease'
  }
};
