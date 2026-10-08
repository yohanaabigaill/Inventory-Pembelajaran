import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

// Dropdown
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

// Daftar 47 Modul
const INITIAL_MODULS = [
  { id: 1, kategori: 'Al Haqq', nama: 'Asasi', stokSistem: 450 },
  { id: 2, kategori: 'Al Haqq', nama: 'Asasi 2', stokSistem: 280 },
  { id: 3, kategori: 'Al Haqq', nama: 'Tahmidi', stokSistem: 320 },
  { id: 4, kategori: 'Al Haqq', nama: 'Tawasuthi', stokSistem: 190 },
  { id: 5, kategori: 'Al Haqq', nama: 'Idadi', stokSistem: 215 },
  { id: 6, kategori: 'Al Haqq', nama: 'Tahsini', stokSistem: 180 },
  { id: 7, kategori: 'Al Haqq', nama: 'Tajwidi', stokSistem: 240 },
  { id: 8, kategori: 'Al Haqq', nama: 'Makhorijul Huruf', stokSistem: 160 },
  { id: 9, kategori: 'Al Haqq', nama: 'Tilawah Asasi', stokSistem: 175 },
  { id: 10, kategori: 'Al Haqq', nama: 'Buku Prestasi Dewasa', stokSistem: 310 },
  { id: 11, kategori: 'Al Haqq', nama: 'Buku Prestasi Anak', stokSistem: 420 },
  { id: 12, kategori: 'Al Haqq', nama: 'Anak 1', stokSistem: 260 },
  { id: 13, kategori: 'Al Haqq', nama: 'Anak 2', stokSistem: 250 },
  { id: 14, kategori: 'Al Haqq', nama: 'Anak 3', stokSistem: 230 },
  { id: 15, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A4', stokSistem: 140 },
  { id: 16, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A5', stokSistem: 195 },
  { id: 17, kategori: 'Al Hisan', nama: 'Panduan Guru', stokSistem: 95 },
  { id: 18, kategori: 'Al Hisan', nama: 'Al Hisan 1', stokSistem: 340 },
  { id: 19, kategori: 'Al Hisan', nama: 'Al Hisan 2', stokSistem: 310 },
  { id: 20, kategori: 'Al Hisan', nama: 'Al Hisan 3', stokSistem: 290 },
  { id: 21, kategori: 'Al Hisan', nama: 'Al Hisan 4', stokSistem: 275 },
  { id: 22, kategori: 'Al Hisan', nama: 'Kamus Juz 1', stokSistem: 180 },
  { id: 23, kategori: 'Al Hisan', nama: 'Kamus 30 juz', stokSistem: 150 },
  { id: 24, kategori: 'Umum', nama: 'Khat', stokSistem: 120 },
  { id: 25, kategori: 'Tahsin Usmani', nama: 'Utsmani 1', stokSistem: 230 },
  { id: 26, kategori: 'Tahsin Usmani', nama: 'Utsmani 2', stokSistem: 210 },
  { id: 27, kategori: 'Tahsin Usmani', nama: 'Ustmani 3', stokSistem: 195 },
  { id: 28, kategori: 'RSQ Kids', nama: 'Buku Doa', stokSistem: 380 },
  { id: 29, kategori: 'RSQ Kids', nama: 'Buku Hadist', stokSistem: 350 },
  { id: 30, kategori: 'RSQ Kids', nama: 'Buku Prestasi', stokSistem: 410 },
  { id: 31, kategori: 'Umum', nama: 'Matan Jazariyah', stokSistem: 165 },
  { id: 32, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 Terjemah', stokSistem: 220 },
  { id: 33, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokSistem: 190 },
  { id: 34, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 Terjemah', stokSistem: 175 },
  { id: 35, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokSistem: 160 },
  { id: 36, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 Terjemah', stokSistem: 130 },
  { id: 37, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokSistem: 115 },
  { id: 38, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 Terjemah', stokSistem: 145 },
  { id: 39, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 tanpa Terjemah', stokSistem: 140 },
  { id: 40, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 Terjemah', stokSistem: 310 },
  { id: 41, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokSistem: 280 },
  { id: 42, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 Terjemah', stokSistem: 260 },
  { id: 43, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokSistem: 240 },
  { id: 44, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 Terjemah', stokSistem: 185 },
  { id: 45, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokSistem: 170 },
  { id: 46, kategori: 'Al Quran', nama: 'Mushaf Al Mujib A6 Terjemah', stokSistem: 195 },
  { id: 47, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A6 tanpa Terjemah', stokSistem: 205 }
];

// Data Riwayat
const INITIAL_RIWAYAT = [
  {
    no: 1,
    tanggal: '31 Mar 2025',
    totalModul: '47 Judul',
    netSelisih: '-11',
    status: 'Menunggu Verifikasi',
    catatan: 'Sedang dalam antrean review oleh Super Admin'
  },
  {
    no: 2,
    tanggal: '28 Feb 2025',
    totalModul: '47 Judul',
    netSelisih: '0',
    status: 'Disetujui',
    catatan: 'Sesuai catatan fisik, stok sistem telah disinkronisasi.'
  },
  {
    no: 3,
    tanggal: '31 Jan 2026',
    totalModul: '47 Judul',
    netSelisih: '-28',
    status: 'Ditolak',
    catatan: 'Harap hitung ulang dan lampirkan foto fisik bukti perhitungan.'
  }
];

const STATUS_RIWAYAT_OPTIONS = [
  'Semua Status',
  'Menunggu Verifikasi',
  'Disetujui',
  'Ditolak'
];

const BULAN_RIWAYAT_OPTIONS = [
  'Semua Bulan',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const MONTH_CODE_MAP = {
  'jan': 'Januari',
  'feb': 'Februari',
  'mar': 'Maret',
  'apr': 'April',
  'mei': 'Mei',
  'may': 'Mei',
  'jun': 'Juni',
  'jul': 'Juli',
  'agu': 'Agustus',
  'aug': 'Agustus',
  'sep': 'September',
  'okt': 'Oktober',
  'oct': 'Oktober',
  'nov': 'November',
  'des': 'Desember',
  'dec': 'Desember'
};

export default function StokOpname() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  
  // Form Input Fisik
  const [opnameData, setOpnameData] = useState(() => {
    return INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: m.stokSistem,
      catatan: ''
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Jenis');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Riwayat
  const [riwayatList, setRiwayatList] = useState(INITIAL_RIWAYAT);
  const [selectedRiwayatTahun, setSelectedRiwayatTahun] = useState('Semua Tahun');
  const [selectedRiwayatBulan, setSelectedRiwayatBulan] = useState('Semua Bulan');
  const [selectedRiwayatStatus, setSelectedRiwayatStatus] = useState('Semua Status');
  const [notification, setNotification] = useState(null);

  // Generate Tahun Dinamis dari data riwayat dan tahun sekarang
  const tahunOptions = useMemo(() => {
    const yearsSet = new Set();
    const currentYear = new Date().getFullYear();
    yearsSet.add(String(currentYear));

    riwayatList.forEach((item) => {
      if (item.tanggal) {
        const match = item.tanggal.match(/\b(20\d{2})\b/);
        if (match) {
          yearsSet.add(match[1]);
        }
      }
    });

    const sortedYears = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
    return ['Semua Tahun', ...sortedYears];
  }, [riwayatList]);

  // Handler Perubahan Input Fisik
  const handleFisikChange = (id, val) => {
    const numericVal = val === '' ? '' : parseInt(val, 10);
    setOpnameData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inputFisik: numericVal } : item))
    );
  };

  // Catatan
  const handleCatatanChange = (id, val) => {
    setOpnameData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, catatan: val } : item))
    );
  };

  // Hitung Statistik Opname
  const stats = useMemo(() => {
    let totalSelisih = 0;
    let totalBeda = 0;

    opnameData.forEach((item) => {
      const fisik = item.inputFisik === '' ? item.stokSistem : Number(item.inputFisik);
      const selisih = fisik - item.stokSistem;
      totalSelisih += selisih;
      if (selisih !== 0) {
        totalBeda += 1;
      }
    });

    return { totalSelisih, totalBeda, totalModul: opnameData.length };
  }, [opnameData]);

  // Filter Data Modul
  const filteredData = useMemo(() => {
    return opnameData.filter((item) => {
      const matchCat = selectedCategory === 'Semua Jenis' || item.kategori === selectedCategory;
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [opnameData, selectedCategory, searchQuery]);

  // Filter Data Riwayat (Tahun, Bulan, Status)
  const filteredRiwayatList = useMemo(() => {
    return riwayatList.filter((item) => {
      // 1. Status
      const matchStatus =
        selectedRiwayatStatus === 'Semua Status' ||
        item.status.toLowerCase() === selectedRiwayatStatus.toLowerCase();

      // 2. Tahun
      const matchTahun =
        selectedRiwayatTahun === 'Semua Tahun' ||
        (item.tanggal && item.tanggal.includes(selectedRiwayatTahun));

      // 3. Bulan
      let matchBulan = true;
      if (selectedRiwayatBulan !== 'Semua Bulan') {
        const parts = item.tanggal ? item.tanggal.trim().split(' ') : [];
        if (parts.length >= 2) {
          const blnKey = parts[1].toLowerCase().slice(0, 3);
          const fullBln = MONTH_CODE_MAP[blnKey] || parts[1];
          matchBulan = fullBln.toLowerCase() === selectedRiwayatBulan.toLowerCase();
        } else {
          matchBulan = item.tanggal.toLowerCase().includes(selectedRiwayatBulan.toLowerCase());
        }
      }

      return matchStatus && matchTahun && matchBulan;
    });
  }, [riwayatList, selectedRiwayatStatus, selectedRiwayatBulan, selectedRiwayatTahun]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Simpan Draf
  const handleSimpanDraf = () => {
    showToast('Draf stok opname berhasil disimpan di lokal sistem.', 'success');
  };

  // Ajukan Verifikasi ke Super Admin
  const handleAjukanVerifikasi = () => {
    const newNo = riwayatList.length + 1;
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newRiwayatItem = {
      no: newNo,
      tanggal: dateStr,
      totalModul: `${opnameData.length} Judul`,
      netSelisih: stats.totalSelisih > 0 ? `+${stats.totalSelisih}` : `${stats.totalSelisih}`,
      status: 'Menunggu Verifikasi',
      catatan: stats.totalBeda > 0 ? `${stats.totalBeda} modul terdapat selisih fisik` : 'Semua stok fisik cocok 100%'
    };

    setRiwayatList([newRiwayatItem, ...riwayatList]);
    showToast('Pengajuan verifikasi stok opname berhasil diajukan ke Super Admin!', 'success');
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar Navigation */}
      <Sidebar
        role="admin"
        activeMenu="Stok Opname"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Stok Opname"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main style={styles.contentBody}>
          {/* Toast Notification */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#23573c' : '#dc2626'
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <span>{notification.message}</span>
            </div>
          )}

          {/* TAB NAVIGATION MENU */}
          <div style={styles.tabContainer}>
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'input' ? styles.tabButtonActive : {})
              }}
            >
              Input Stok Opname
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'riwayat' ? styles.tabButtonActive : {})
              }}
            >
              Riwayat Stok Opname
            </button>
          </div>

          {/* MENU FORM INPUT FISIK */}
          {activeTab === 'input' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Filter */}
              <div className="filter-card-responsive" style={styles.filterCard}>
                <div className="filter-left-responsive" style={styles.filterLeft}>
                  {/* Search Bar */}
                  <div className="search-wrapper-responsive" style={styles.searchWrapper}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b7566" strokeWidth="2" style={styles.searchIcon}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Cari judul modul..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="search-input-responsive"
                      style={styles.searchInput}
                    />
                  </div>

                  {/* Dropdown Jenis*/}
                  <CustomDropdown
                    value={selectedCategory}
                    onChange={(val) => {
                      setSelectedCategory(val);
                      setCurrentPage(1);
                    }}
                    options={KATEGORI_OPTIONS}
                    className="select-wrapper-responsive"
                    style={{ width: '180px' }}
                    selectStyle={styles.customSelect}
                    arrowColor="#1a3e2b"
                  />
                </div>

                {/* Tombol Simpan Draft dan Ajukan Verifikasi ke Super Admin */}
                <div style={styles.bottomActions}>
                  <button onClick={handleSimpanDraf} style={styles.btnDraf}>
                    <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Simpan Draf</span>
                  </button>
                  <button onClick={handleAjukanVerifikasi} style={styles.btnAjukan}>
                    <SendOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Ajukan Verifikasi ke Super Admin</span>
                  </button>
                </div>
              </div>

              <div style={styles.card}>
                {/* Tabel Input Fisik */}
                <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={{ ...styles.th, width: '48px', textAlign: 'center' }}>NO</th>
                    <th style={styles.th}>JUDUL MODUL</th>
                    <th style={{ ...styles.th, width: '140px' }}>JENIS</th>
                    <th style={{ ...styles.th, width: '110px', textAlign: 'center' }}>STOK SISTEM</th>
                    <th style={{ ...styles.th, width: '130px', textAlign: 'center' }}>INPUT FISIK</th>
                    <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>SELISIH</th>
                    <th style={{ ...styles.th, minWidth: '220px' }}>CATATAN</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => {
                      const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      const inputVal = item.inputFisik === '' ? '' : item.inputFisik;
                      const numericFisik = item.inputFisik === '' ? item.stokSistem : Number(item.inputFisik);
                      const selisih = numericFisik - item.stokSistem;
                      const isMatch = selisih === 0;

                      return (
                        <tr
                          key={item.id}
                          style={{
                            ...styles.tr,
                            backgroundColor: !isMatch ? '#fffdf7' : 'transparent'
                          }}
                        >
                          {/* NO */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {rowNumber}
                          </td>

                          {/* JUDUL MODUL */}
                          <td style={styles.td}>
                            <div style={styles.moduleNameMain}>{item.nama}</div>
                          </td>

                          {/* JENIS */}
                          <td style={styles.td}>
                            <span style={styles.jenisTextPlainBold}>{item.kategori}</span>
                          </td>

                          {/* STOK SISTEM */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', fontSize: '15px', color: '#1a3e2b' }}>
                            {item.stokSistem}
                          </td>

                          {/* INPUT FISIK */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <input
                              type="number"
                              min="0"
                              value={inputVal}
                              onChange={(e) => handleFisikChange(item.id, e.target.value)}
                              placeholder={String(item.stokSistem)}
                              style={{
                                ...styles.inputFisik,
                                borderColor: !isMatch ? '#f59e0b' : '#c7d9cd',
                                backgroundColor: !isMatch ? '#fffbeb' : '#ffffff'
                              }}
                            />
                          </td>

                          {/* SELISIH */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            {isMatch ? (
                              <span style={styles.badgeCocok}>0</span>
                            ) : (
                              <span style={{ ...styles.badgeSelisih, backgroundColor: selisih < 0 ? '#fef2f2' : '#f0fdf4', color: selisih < 0 ? '#dc2626' : '#16a34a' }}>
                                {selisih > 0 ? `+${selisih}` : selisih}
                              </span>
                            )}
                          </td>

                          {/* CATATAN */}
                          <td style={styles.td}>
                            <input
                              type="text"
                              value={item.catatan}
                              onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                              placeholder="Catatan"
                              style={{
                                ...styles.inputCatatan,
                                borderColor: !isMatch && !item.catatan ? '#fca5a5' : '#dce4de'
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                        Tidak ada modul yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-responsive" style={styles.cardFooter}>
              <div style={styles.pageInfo}>
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length}
              </div>
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
                  style={{ ...styles.btnPageArrow, opacity: currentPage === totalPages ? 0.4 : 1 }}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

          {/* MENU RIWAYAT STOK OPNAME */}
          {activeTab === 'riwayat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Filter Tahun, Bulan, Status */}
              <div className="filter-card-responsive" style={styles.filterCard}>
                <div className="filter-left-responsive" style={styles.filterLeft}>
                  {/* Dropdown Tahun */}
                  <CustomDropdown
                    value={selectedRiwayatTahun}
                    onChange={(val) => setSelectedRiwayatTahun(val)}
                    options={tahunOptions}
                    className="select-wrapper-responsive"
                    style={{ width: '160px' }}
                    selectStyle={styles.customSelect}
                    arrowColor="#1a3e2b"
                  />

                  {/* Dropdown Bulan */}
                  <CustomDropdown
                    value={selectedRiwayatBulan}
                    onChange={(val) => setSelectedRiwayatBulan(val)}
                    options={BULAN_RIWAYAT_OPTIONS}
                    className="select-wrapper-responsive"
                    style={{ width: '160px' }}
                    selectStyle={styles.customSelect}
                    arrowColor="#1a3e2b"
                  />

                  {/* Dropdown Status */}
                  <CustomDropdown
                    value={selectedRiwayatStatus}
                    onChange={(val) => setSelectedRiwayatStatus(val)}
                    options={STATUS_RIWAYAT_OPTIONS}
                    className="select-wrapper-responsive"
                    style={{ width: '190px' }}
                    selectStyle={styles.customSelect}
                    arrowColor="#1a3e2b"
                  />
                </div>
              </div>

              {/* Table Card Riwayat */}
              <div style={styles.card}>
                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={{ ...styles.th, width: '50px', textAlign: 'center' }}>NO</th>
                        <th style={{ ...styles.th, width: '150px', whiteSpace: 'nowrap' }}>TANGGAL</th>
                        <th style={{ ...styles.th, width: '130px', textAlign: 'center', whiteSpace: 'nowrap' }}>TOTAL MODUL</th>
                        <th style={{ ...styles.th, width: '110px', textAlign: 'center', whiteSpace: 'nowrap' }}>SELISIH</th>
                        <th style={{ ...styles.th, width: '190px', textAlign: 'center', whiteSpace: 'nowrap' }}>STATUS</th>
                        <th style={styles.th}>CATATAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRiwayatList.map((item, idx) => (
                        <tr key={idx} style={styles.tr}>
                          {/* NO */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {idx + 1}
                          </td>

                          {/* TANGGAL */}
                          <td style={{ ...styles.td, whiteSpace: 'nowrap', fontWeight: '700', color: '#1a3e2b' }}>
                            {item.tanggal}
                          </td>

                          {/* TOTAL MODUL */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: '#1a3e2b', whiteSpace: 'nowrap' }}>
                            {item.totalModul}
                          </td>

                          {/* SELISIH */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', whiteSpace: 'nowrap', color: item.netSelisih.startsWith('-') ? '#dc2626' : (item.netSelisih === '0' ? '#16a34a' : '#16a34a') }}>
                            {item.netSelisih}
                          </td>

                          {/* STATUS */}
                          <td style={{ ...styles.td, textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {(item.status === 'Menunggu Verifikasi' || item.status === 'MENUNGGU VERIFIKASI') && (
                              <span style={styles.badgeMenunggu}>
                                Menunggu Verifikasi
                              </span>
                            )}
                            {(item.status === 'Disetujui' || item.status === 'DISETUJUI') && (
                              <span style={styles.badgeDisetujui}>
                                Disetujui
                              </span>
                            )}
                            {(item.status === 'Ditolak' || item.status === 'DITOLAK') && (
                              <span style={styles.badgeDitolak}>
                                Ditolak
                              </span>
                            )}
                          </td>

                          {/* CATATAN */}
                          <td style={{ ...styles.td, color: '#334155', fontWeight: '600', fontSize: '13.5px' }}>
                            {item.catatan}
                          </td>
                        </tr>
                      ))}

                      {filteredRiwayatList.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                            Tidak ada riwayat stok opname.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination-responsive" style={styles.cardFooter}>
                  <div style={styles.pageInfo}>
                    1 - {filteredRiwayatList.length} dari {riwayatList.length}
                  </div>
                  <div style={styles.paginationButtons}>
                    <button
                      disabled
                      style={{ ...styles.btnPageArrow, opacity: 0.4 }}
                    >
                      &lt;
                    </button>
                    <button
                      style={{
                        ...styles.btnPageNum,
                        ...styles.btnPageNumActive
                      }}
                    >
                      1
                    </button>
                    <button
                      disabled
                      style={{ ...styles.btnPageArrow, opacity: 0.4 }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

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
    padding: '24px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    animation: 'fadeIn 0.2s ease'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
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
    left: '12px',
    pointerEvents: 'none'
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
    border: '1px solid #c7d9cd',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    color: '#1a3e2b',
    fontWeight: '600',
    fontFamily: 'inherit'
  },
  tableResponsive: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
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
    padding: '14px 18px',
    fontSize: '11.5px',
    fontWeight: '700',
    color: '#1d4632',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f5f2',
    transition: 'background 0.15s'
  },
  td: {
    padding: '14px 18px',
    fontSize: '13.5px',
    verticalAlign: 'middle'
  },
  moduleNameMain: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px'
  },
  jenisTextPlainBold: {
    fontSize: '13.5px',
    color: '#1a3e2b',
    fontWeight: '700'
  },
  inputFisik: {
    width: '80px',
    padding: '8px 10px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #c7d9cd',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a3e2b',
    outline: 'none'
  },
  badgeCocok: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    whiteSpace: 'nowrap'
  },
  badgeSelisih: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  inputCatatan: {
    width: '100%',
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    fontSize: '12.5px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  cardFooter: {
    minHeight: '64px',
    boxSizing: 'border-box',
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #edf2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
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
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s'
  },
  btnPageNum: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    backgroundColor: '#ffffff',
    color: '#3d5246',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s'
  },
  btnPageNumActive: {
    backgroundColor: '#23573c',
    border: 'none',
    color: '#ffffff',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.3)'
  },
  bottomActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  btnDraf: {
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1px solid #23573c',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s'
  },
  btnAjukan: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.25)',
    transition: 'transform 0.15s'
  },
  badgeMenunggu: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '165px',
    height: '28px',
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fef08a',
    boxSizing: 'border-box'
  },
  badgeDisetujui: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '165px',
    height: '28px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bbf7d0',
    boxSizing: 'border-box'
  },
  badgeDitolak: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '165px',
    height: '28px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fecaca',
    boxSizing: 'border-box'
  },
  tabContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '0px',
    backgroundColor: 'transparent',
    padding: 0,
    border: 'none'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#ffffff',
    border: '1px solid #dce4de',
    cursor: 'pointer',
    transition: 'all 0.18s ease'
  },
  tabButtonActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderColor: '#23573c',
    boxShadow: '0 2px 8px rgba(35, 87, 60, 0.22)'
  }
};
