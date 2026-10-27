import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

const MONTH_NAMES = [
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

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();

// Custom Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  style = {},
  selectStyle = {},
  arrowColor = '#1a3e2b',
  className = '',
  icon = null,
  labelPrefix = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const selectedOpt = options.find((o) => (typeof o === 'object' ? o.value === value : o === value));
  const rawLabel = selectedOpt
    ? (typeof selectedOpt === 'object' ? selectedOpt.label : selectedOpt)
    : (typeof value === 'string' ? value : (value?.label || value));
  const displayLabel = labelPrefix ? `${labelPrefix}${rawLabel}` : rawLabel;

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', ...style }}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayLabel}
          </span>
        </div>
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

// Dropdown Kalender Bulan & Tahun
function MonthYearCalendarPicker({
  selectedMonth,
  selectedYear,
  onSelect,
  style = {},
  selectStyle = {},
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => Number(selectedYear) || CURRENT_YEAR);
  const containerRef = useRef(null);

  const handleToggle = () => {
    if (!isOpen) {
      setViewYear(Number(selectedYear) || CURRENT_YEAR);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMonthClick = (m) => {
    onSelect(m, String(viewYear));
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', ...style }}
    >
      <div
        onClick={handleToggle}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#23573c" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedMonth} {selectedYear}
          </span>
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a3e2b"
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
          className="calendar-picker-popup"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #c7d9cd',
            borderRadius: '14px',
            boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.16)',
            zIndex: 9999,
            width: '270px',
            maxWidth: 'calc(100vw - 32px)',
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Kalender */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid #f0f4f1'
            }}
          >
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.max(2024, y - 1))}
              disabled={viewYear <= 2024}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid #dce4de',
                backgroundColor: viewYear <= 2024 ? '#f8faf9' : '#ffffff',
                color: viewYear <= 2024 ? '#94a3b8' : '#1a3e2b',
                cursor: viewYear <= 2024 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.15s ease'
              }}
            >
              &lt;
            </button>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1a3e2b', letterSpacing: '0.3px' }}>
              {viewYear}
            </span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid #dce4de',
                backgroundColor: '#ffffff',
                color: '#1a3e2b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.15s ease'
              }}
            >
              &gt;
            </button>
          </div>

          {/* Grid 12 Bulan */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}
          >
            {MONTH_NAMES.map((m) => {
              const isSelected = selectedMonth === m && String(viewYear) === String(selectedYear);
              const isCurrentCalendarMonth = m === 'Oktober' && viewYear === CURRENT_YEAR;

              return (
                <div
                  key={m}
                  onClick={() => handleMonthClick(m)}
                  style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? '#ffffff' : (isCurrentCalendarMonth ? '#23573c' : '#1e293b'),
                    backgroundColor: isSelected ? '#23573c' : (isCurrentCalendarMonth ? '#ebf5ee' : '#f8faf9'),
                    border: isSelected ? '1px solid #23573c' : (isCurrentCalendarMonth ? '1px solid #b7d6c2' : '1px solid #eef3f0'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(35, 87, 60, 0.25)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#e2eee6';
                      e.currentTarget.style.borderColor = '#23573c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isCurrentCalendarMonth ? '#ebf5ee' : '#f8faf9';
                      e.currentTarget.style.borderColor = isCurrentCalendarMonth ? '#b7d6c2' : '#eef3f0';
                    }
                  }}
                >
                  {m.slice(0, 3)}
                </div>
              );
            })}
          </div>
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

const getInitialMonthlyVerificationData = () => {
  const defaults = {};

  // September 2026: Status Menunggu Verifikasi (Ada 2 modul dengan selisih yang diinput Admin)
  defaults['2026-09'] = {
    statusPeriode: 'Menunggu Verifikasi',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: INITIAL_MODULS.map((m) => {
      if (m.id === 1) {
        return { ...m, inputFisik: 445, catatan: '5 buku rusak di rak bawah karena lembap', status: 'Menunggu Verifikasi' };
      }
      if (m.id === 3) {
        return { ...m, inputFisik: 314, catatan: 'Kurang 6 eks saat pengiriman distributor', status: 'Menunggu Verifikasi' };
      }
      return { ...m, inputFisik: m.stokSistem, catatan: '', status: 'Menunggu Verifikasi' };
    })
  };

  // Agustus 2026: Status Disetujui
  defaults['2026-08'] = {
    statusPeriode: 'Disetujui',
    catatanPenolakan: '',
    tanggalVerifikasi: '31 Agustus 2026, 16:45 WIB',
    items: INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: m.stokSistem,
      catatan: '',
      status: 'Disetujui'
    }))
  };


  // Oktober 2026: Bulan berjalan (Belum Diinput oleh Admin)
  defaults['2026-10'] = {
    statusPeriode: 'Belum Diinput',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: '',
      catatan: '',
      status: 'Belum Diinput'
    }))
  };

  return defaults;
};

export default function VerifikasiStokOpname() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [selectedBulan, setSelectedBulan] = useState('September');

  const [monthlyData, setMonthlyData] = useState(getInitialMonthlyVerificationData);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua Jenis');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Checkboxes
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  // Dialog / Modal States
  const [isModalKirimVerifikasiOpen, setIsModalKirimVerifikasiOpen] = useState(false);
  const [alasanPenolakan, setAlasanPenolakan] = useState('');
  const [errorAlasan, setErrorAlasan] = useState('');

  // Toast Notification
  const [notification, setNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setNotification({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const effectiveBulan = selectedBulan === 'Bulan' ? 'September' : selectedBulan;
  const effectiveYear = selectedTahun === 'Tahun' ? '2026' : selectedTahun;
  const monthNumber = String(MONTH_NAMES.indexOf(effectiveBulan) + 1).padStart(2, '0');
  const periodKey = `${effectiveYear}-${monthNumber}`;

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Ambil data periode aktif
  const currentPeriodData = useMemo(() => {
    if (monthlyData[periodKey]) {
      return monthlyData[periodKey];
    }
    return {
      statusPeriode: 'Belum Diinput',
      catatanPenolakan: '',
      tanggalVerifikasi: null,
      items: INITIAL_MODULS.map((m) => ({
        ...m,
        inputFisik: '',
        catatan: '',
        status: 'Belum Diinput'
      }))
    };
  }, [monthlyData, periodKey]);

  const currentItems = currentPeriodData.items;
  const statusPeriode = currentPeriodData.statusPeriode;

  const disetujuiCount = useMemo(() => {
    return currentItems.filter((it) => it.status === 'Disetujui').length;
  }, [currentItems]);

  const ditolakCount = useMemo(() => {
    return currentItems.filter((it) => it.status === 'Ditolak').length;
  }, [currentItems]);

  const isPeriodFinalized = statusPeriode === 'Disetujui' || statusPeriode === 'Ditolak';
  const isNotSubmitted = statusPeriode === 'Belum Diinput';
  const isCanVerify = statusPeriode === 'Menunggu Verifikasi';
  const isAllVerified = isCanVerify && currentItems.length > 0 && (disetujuiCount + ditolakCount === currentItems.length);
  const belumDiverifikasiCount = currentItems.length - (disetujuiCount + ditolakCount);

  // Filter Data
  const filteredData = useMemo(() => {
    return currentItems.filter((item) => {
      // Filter Kategori
      if (selectedCategory !== 'Semua Jenis' && item.kategori !== selectedCategory) {
        return false;
      }

      // Search Query: hanya mencari berdasarkan judul modul (nama)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.nama.toLowerCase().includes(q);
      }

      return true;
    });
  }, [currentItems, selectedCategory, searchQuery]);

  // Modul yang masih dapat dipilih (hanya jika periode Menunggu Verifikasi dan modul tidak dikunci)
  const selectableItems = useMemo(() => {
    if (!isCanVerify) return [];
    return filteredData.filter((it) => !it.isLocked);
  }, [filteredData, isCanVerify]);

  const isAllSelectableChecked = selectableItems.length > 0 && selectableItems.every((it) => selectedItemIds.has(it.id));
  const isSelectAllDisabled = !isCanVerify || selectableItems.length === 0;

  // Reset pilihan centang ketika periode berganti atau ketika status periode tidak dapat diverifikasi
  useEffect(() => {
    setSelectedItemIds(new Set());
  }, [periodKey, isCanVerify, isPeriodFinalized]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Tandai status modul yang dicentang secara langsung (Disetujui / Ditolak)
  const handleTandaiStatusTerpilih = (targetStatus) => {
    if (!isCanVerify) {
      if (isNotSubmitted) {
        showToast('Admin belum menginput atau mengajukan stok opname untuk periode ini.', 'error');
      }
      return;
    }
    if (selectedItemIds.size === 0) return;

    setMonthlyData((prev) => {
      const existing = prev[periodKey] || currentPeriodData;
      const updatedItems = existing.items.map((it) => {
        // Modul yang sudah dikunci dari putaran verifikasi sebelumnya tidak dapat diubah
        if (selectedItemIds.has(it.id) && !it.isLocked) {
          return { ...it, status: targetStatus };
        }
        return it;
      });

      return {
        ...prev,
        [periodKey]: {
          ...existing,
          items: updatedItems
        }
      };
    });

    setSelectedItemIds(new Set());
  };

  // Handler Simulasi: Admin Mengajukan Ulang Revisi Modul yang Ditolak
  const handleSimulasiAdminAjukanRevisi = () => {
    setMonthlyData((prev) => {
      const existing = prev[periodKey] || currentPeriodData;
      const updatedItems = existing.items.map((it) => {
        if (it.status === 'Ditolak') {
          return {
            ...it,
            inputFisik: it.stokSistem, // Admin mengoreksi angka fisik
            catatan: 'Telah dihitung ulang fisik oleh Admin dan telah sesuai.',
            status: 'Menunggu Verifikasi',
            isLocked: false
          };
        }
        return it;
      });

      return {
        ...prev,
        [periodKey]: {
          ...existing,
          statusPeriode: 'Menunggu Verifikasi',
          items: updatedItems
        }
      };
    });

    setSelectedItemIds(new Set());
    showToast('Admin telah mengajukan ulang hasil hitung fisik. Modul siap diperiksa dan disetujui kembali oleh Super Admin.', 'info');
  };

  // Handler: Kirim Verifikasi Final ke Admin
  const handleKirimVerifikasiFinal = () => {
    if (!isAllVerified) {
      setErrorAlasan(`Masih ada ${belumDiverifikasiCount} modul yang belum diverifikasi.`);
      return;
    }

    if (ditolakCount > 0 && !alasanPenolakan.trim()) {
      setErrorAlasan('Catatan wajib diisi');
      return;
    }

    const nowStr = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    setMonthlyData((prev) => {
      const existing = prev[periodKey] || currentPeriodData;
      const finalPeriodStatus = ditolakCount > 0 ? 'Ditolak' : 'Disetujui';
      // Kunci modul yang sudah Disetujui jika periode ini ditolak agar saat revisi modul tersebut tetap sah
      const updatedItems = existing.items.map((it) => {
        if (it.status === 'Disetujui') {
          return { ...it, isLocked: true };
        }
        return it;
      });

      return {
        ...prev,
        [periodKey]: {
          ...existing,
          statusPeriode: finalPeriodStatus,
          tanggalVerifikasi: nowStr,
          catatanPenolakan: ditolakCount > 0 ? alasanPenolakan.trim() : '',
          items: updatedItems
        }
      };
    });

    setSelectedItemIds(new Set());
    setIsModalKirimVerifikasiOpen(false);
    setAlasanPenolakan('');
    setErrorAlasan('');
    showToast('Hasil verifikasi stok opname berhasil dikirim!', 'success');
  };

  // Render Badge Status Periode
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span style={{ ...styles.badgeStatus, backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <span style={{ ...styles.badgeDot, backgroundColor: '#16a34a' }} />
            Disetujui
          </span>
        );
      case 'Menunggu Verifikasi':
        return (
          <span style={{ ...styles.badgeStatus, backgroundColor: '#fef3c7', color: '#d97706' }}>
            <span style={{ ...styles.badgeDot, backgroundColor: '#d97706' }} />
            Menunggu Verifikasi
          </span>
        );
      case 'Ditolak':
        return (
          <span style={{ ...styles.badgeStatus, backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <span style={{ ...styles.badgeDot, backgroundColor: '#dc2626' }} />
            Ditolak
          </span>
        );
      default:
        return (
          <span style={{ ...styles.badgeStatus, backgroundColor: '#f1f5f9', color: '#64748b' }}>
            <span style={{ ...styles.badgeDot, backgroundColor: '#94a3b8' }} />
            Belum Diinput
          </span>
        );
    }
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar Role Super Admin */}
      <Sidebar
        role="super_admin"
        activeMenu="Verifikasi Stok Opname"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Verifikasi Stok Opname"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main className="content-body-responsive" style={styles.contentBody}>
          {/* Toast Notification */}
          {notification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#23573c' : '#dc2626'
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

          {statusPeriode === 'Disetujui' && (
            <div style={styles.bannerApproved}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircleOutlinedIcon sx={{ fontSize: 22, color: '#15803d' }} />
                <div>
                  <strong style={{ color: '#166534', fontSize: '13.5px' }}>Hasil Stok Opname Telah Disetujui</strong>
                  <div style={{ color: '#15803d', fontSize: '12.5px', marginTop: '2px' }}>
                    Stok opname periode {effectiveBulan} {effectiveYear} telah disetujui.
                  </div>
                </div>
              </div>
            </div>
          )}

          {statusPeriode === 'Ditolak' && (
            <div style={styles.bannerRejected}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CancelOutlinedIcon sx={{ fontSize: 22, color: '#b91c1c', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#991b1b', fontSize: '13.5px' }}>Stok Opname Ditolak</strong>
                    <div style={{ color: '#b91c1c', fontSize: '12.5px', marginTop: '2px' }}>
                      Alasan Penolakan: <em>"{currentPeriodData.catatanPenolakan || 'Mohon cek ulang fisik modul.'}"</em>
                    </div>
                  </div>
                </div>

                {/* Tombol Simulasi Pengajuan Ulang dari Admin */}
                <button
                  type="button"
                  onClick={handleSimulasiAdminAjukanRevisi}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #f87171',
                    borderRadius: '7px',
                    color: '#b91c1c',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RefreshOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Simulasi: Admin Ajukan Revisi</span>
                </button>
              </div>
            </div>
          )}

          {statusPeriode === 'Belum Diinput' && (
            <div style={styles.bannerEmpty}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 22, color: '#64748b' }} />
                <div style={{ color: '#475569', fontSize: '13px' }}>
                  Admin belum menginput atau mengajukan stok opname untuk periode <strong>{effectiveBulan} {effectiveYear}</strong>.
                </div>
              </div>
            </div>
          )}

          {/* Filter Card & Action Bar */}
          <div className="filter-card-responsive" style={styles.filterCard}>
            <div className="filter-left-responsive" style={styles.filterLeft}>
              {/* Search Bar */}
              <div
                style={{
                  ...styles.searchWrapper,
                  boxShadow: isSearchFocused
                    ? '0 0 0 3px rgba(35, 87, 60, 0.15)'
                    : isSearchHovered
                    ? '0 0 0 3px rgba(35, 87, 60, 0.1)'
                    : 'none',
                  borderColor: '#23573c'
                }}
                onMouseEnter={() => setIsSearchHovered(true)}
                onMouseLeave={() => setIsSearchHovered(false)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsSearchFocused(false);
                  }
                }}
                className="search-wrapper-responsive"
              >
                <SearchOutlinedIcon sx={{ color: '#23573c', fontSize: 20, flexShrink: 0 }} />
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
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    aria-label="Hapus pencarian"
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>

              {/* Dropdown Jenis Modul */}
              <CustomDropdown
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
                options={KATEGORI_OPTIONS}
                className="select-wrapper-responsive"
                style={{ minWidth: '155px', flex: '0 1 auto' }}
                selectStyle={styles.customSelect}
                arrowColor="#1a3e2b"
              />


              {/* Filter Kalender Periode */}
              <MonthYearCalendarPicker
                selectedMonth={effectiveBulan}
                selectedYear={effectiveYear}
                onSelect={(m, y) => {
                  setSelectedBulan(m);
                  setSelectedTahun(y);
                  setCurrentPage(1);
                }}
                className="select-wrapper-responsive"
                style={{ minWidth: '185px', flex: '0 1 auto' }}
                selectStyle={styles.customSelect}
              />
            </div>

            {/* Tombol Aksi Verifikasi Super Admin (FR-06) */}
            <div className="action-buttons-responsive" style={styles.actionButtonsSuperAdmin}>
              {selectedItemIds.size > 0 && isCanVerify ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleTandaiStatusTerpilih('Ditolak')}
                    style={styles.btnTolak}
                  >
                    <HighlightOffOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Tolak ({selectedItemIds.size})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTandaiStatusTerpilih('Disetujui')}
                    style={styles.btnSetujui}
                  >
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Setujui ({selectedItemIds.size})</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isNotSubmitted}
                    onClick={() => {
                      if (isNotSubmitted) {
                        showToast('Admin belum menginput atau mengajukan stok opname untuk periode ini.', 'error');
                        return;
                      }
                      if (ditolakCount > 0) {
                        showToast(`${ditolakCount} modul saat ini berstatus Ditolak.`, 'error');
                      } else {
                        showToast('Centang modul di tabel untuk menandai status Ditolak.', 'info');
                      }
                    }}
                    style={{
                      ...styles.btnTolak,
                      ...(isNotSubmitted ? {
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        color: '#94a3b8',
                        cursor: 'not-allowed',
                        boxShadow: 'none'
                      } : {
                        backgroundColor: ditolakCount > 0 ? '#fee2e2' : '#fef2f2',
                        border: 'none',
                        outline: 'none',
                        color: '#dc2626'
                      }),
                      fontWeight: '700'
                    }}
                  >
                    <HighlightOffOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>{ditolakCount > 0 ? `${ditolakCount} Tolak` : '0 Tolak'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isNotSubmitted}
                    onClick={() => {
                      if (isNotSubmitted) {
                        showToast('Admin belum menginput atau mengajukan stok opname untuk periode ini.', 'error');
                        return;
                      }
                      if (disetujuiCount > 0) {
                        showToast(`${disetujuiCount} modul saat ini berstatus Disetujui.`, 'success');
                      } else {
                        showToast('Centang modul di tabel untuk menandai status Disetujui.', 'info');
                      }
                    }}
                    style={{
                      ...styles.btnSetujui,
                      ...(isNotSubmitted ? {
                        backgroundColor: '#e2e8f0',
                        border: '1px solid #cbd5e1',
                        color: '#94a3b8',
                        cursor: 'not-allowed',
                        boxShadow: 'none'
                      } : {
                        backgroundColor: '#23573c',
                        color: '#ffffff'
                      }),
                      fontWeight: '700'
                    }}
                  >
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>{disetujuiCount > 0 ? `${disetujuiCount} Setujui` : '0 Setujui'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div style={styles.card}>
            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <colgroup>
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '45px' }} />
                  <col style={{ width: '265px' }} />
                  <col style={{ width: '165px' }} />
                  <col style={{ width: '105px' }} />
                  <col style={{ width: '105px' }} />
                  <col style={{ width: '85px' }} />
                  <col style={{ width: '200px' }} />
                </colgroup>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={{ ...styles.th, width: '70px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: isSelectAllDisabled ? 'not-allowed' : 'pointer',
                          margin: 0,
                          userSelect: 'none',
                          opacity: isSelectAllDisabled ? 0.5 : 1
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled={isSelectAllDisabled}
                          checked={isAllSelectableChecked}
                          onChange={(e) => {
                            if (isSelectAllDisabled) return;
                            if (e.target.checked) {
                              const next = new Set(selectedItemIds);
                              selectableItems.forEach((it) => next.add(it.id));
                              setSelectedItemIds(next);
                            } else {
                              const next = new Set(selectedItemIds);
                              selectableItems.forEach((it) => next.delete(it.id));
                              setSelectedItemIds(next);
                            }
                          }}
                          style={{
                            cursor: isSelectAllDisabled ? 'not-allowed' : 'pointer',
                            width: '16px',
                            height: '16px',
                            accentColor: '#23573c'
                          }}
                        />
                        <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#23573c', letterSpacing: '0.3px' }}>
                          SEMUA
                        </span>
                      </label>
                    </th>
                    <th style={{ ...styles.th, width: '45px', textAlign: 'center' }}>NO</th>
                    <th style={{ ...styles.th, width: '265px' }}>JUDUL MODUL</th>
                    <th style={{ ...styles.th, width: '165px' }}>JENIS</th>
                    <th style={{ ...styles.th, width: '105px', textAlign: 'center' }}>STOK SISTEM</th>
                    <th style={{ ...styles.th, width: '105px', textAlign: 'center' }}>INPUT FISIK</th>
                    <th style={{ ...styles.th, width: '85px', textAlign: 'center' }}>SELISIH</th>
                    <th style={{ ...styles.th, width: '200px', textAlign: 'center', paddingRight: '20px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => {
                      const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      const hasInputFisik = item.inputFisik !== '' && item.inputFisik !== null && item.inputFisik !== undefined;
                      const numericFisik = hasInputFisik ? Number(item.inputFisik) : item.stokSistem;
                      const selisih = hasInputFisik ? numericFisik - item.stokSistem : 0;
                      const isMatch = selisih === 0;
                      const isSelected = selectedItemIds.has(item.id);
                      const isItemLocked = !isCanVerify || Boolean(item.isLocked);

                      return (
                        <tr
                          key={item.id}
                          style={styles.tr}
                        >
                          {/* CHECKBOX */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              disabled={isItemLocked}
                              checked={isCanVerify && isSelected}
                              onChange={(e) => {
                                if (isItemLocked) return;
                                const next = new Set(selectedItemIds);
                                if (e.target.checked) {
                                  next.add(item.id);
                                } else {
                                  next.delete(item.id);
                                }
                                setSelectedItemIds(next);
                              }}
                              style={{
                                cursor: isItemLocked ? 'not-allowed' : 'pointer',
                                width: '16px',
                                height: '16px',
                                accentColor: '#23573c',
                                opacity: isItemLocked ? 0.45 : 1
                              }}
                            />
                          </td>

                          {/* NO */}
                          <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                            {rowNumber}
                          </td>

                          {/* JUDUL MODUL */}
                          <td style={styles.td}>
                            <div style={styles.moduleNameMain}>
                              {item.nama}
                            </div>
                          </td>

                          {/* JENIS */}
                          <td style={styles.td}>
                            <span style={styles.jenisTextPlainBold}>{item.kategori}</span>
                          </td>

                          {/* STOK SISTEM */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', color: '#1e293b' }}>
                            {item.stokSistem}
                          </td>

                          {/* FISIK (ADMIN) */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                minWidth: '45px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: hasInputFisik ? '#f8faf9' : '#f1f5f9',
                                border: hasInputFisik ? '1px solid #dce4de' : '1px dashed #cbd5e1',
                                fontWeight: '700',
                                color: hasInputFisik ? '#1a3e2b' : '#94a3b8',
                                fontSize: '13px'
                              }}
                            >
                              {hasInputFisik ? item.inputFisik : '-'}
                            </span>
                          </td>

                          {/* SELISIH */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            {!hasInputFisik ? (
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>
                            ) : isMatch ? (
                              <span style={{ ...styles.badgeSelisih, backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                0
                              </span>
                            ) : (
                              <span
                                style={{
                                  ...styles.badgeSelisih,
                                  backgroundColor: selisih < 0 ? '#fef2f2' : '#eff6ff',
                                  color: selisih < 0 ? '#dc2626' : '#2563eb'
                                }}
                              >
                                {selisih > 0 ? `+${selisih}` : selisih}
                              </span>
                            )}
                          </td>

                          {/* STATUS */}
                          <td style={{ ...styles.td, textAlign: 'center', paddingRight: '20px' }}>
                            {renderStatusBadge(item.status)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                        Tidak ada data modul yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Tombol Kirim Verifikasi */}
            <div className="pagination-responsive" style={styles.cardFooter}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={styles.pageInfo}>
                  {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length}
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

              {/* Tombol Kirim Verifikasi di Paling Bawah Tabel */}
              <button
                type="button"
                className="btn-kirim-responsive"
                disabled={isPeriodFinalized}
                onClick={() => {
                  if (isNotSubmitted) {
                    showToast('Admin belum menginput atau mengajukan stok opname untuk periode ini.', 'error');
                    return;
                  }
                  if (isPeriodFinalized) {
                    showToast('Hasil verifikasi stok opname untuk periode ini sudah dikirim.', 'info');
                    return;
                  }
                  if (!isCanVerify) return;
                  if (!isAllVerified) {
                    showToast(`Masih ada ${belumDiverifikasiCount} modul yang belum diverifikasi.`, 'error');
                    return;
                  }
                  setAlasanPenolakan('');
                  setErrorAlasan('');
                  setIsModalKirimVerifikasiOpen(true);
                }}
                style={{
                  ...styles.btnKirimVerifikasi,
                  ...(!isCanVerify || !isAllVerified ? {
                    backgroundColor: '#94a3b8',
                    cursor: 'not-allowed',
                    boxShadow: 'none',
                    opacity: 0.65
                  } : {})
                }}
              >
                <SendOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Kirim Verifikasi</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Kirim Verifikasi */}
      {isModalKirimVerifikasiOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    ...styles.modalIconBox,
                    backgroundColor: ditolakCount > 0 ? '#fee2e2' : '#dcfce7',
                    color: ditolakCount > 0 ? '#dc2626' : '#16a34a'
                  }}
                >
                  {ditolakCount > 0 ? (
                    <HighlightOffOutlinedIcon sx={{ fontSize: 24 }} />
                  ) : (
                    <CheckCircleOutlinedIcon sx={{ fontSize: 24 }} />
                  )}
                </div>
                <h3 style={styles.modalTitle}>Kirim Hasil Verifikasi</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalKirimVerifikasiOpen(false);
                  setErrorAlasan('');
                }}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                Hasil verifikasi stok opname periode <strong>{effectiveBulan} {effectiveYear}</strong>:
              </p>

              <div style={styles.modalSummaryBox}>
                <div style={styles.modalSummaryRow}>
                  <span>Total Modul:</span>
                  <strong>{currentItems.length} modul</strong>
                </div>
                <div style={styles.modalSummaryRow}>
                  <span>Modul Disetujui:</span>
                  <strong style={{ color: '#16a34a' }}>{disetujuiCount} modul</strong>
                </div>
                <div style={styles.modalSummaryRow}>
                  <span>Modul Ditolak:</span>
                  <strong style={{ color: ditolakCount > 0 ? '#dc2626' : '#64748b' }}>
                    {ditolakCount} modul
                  </strong>
                </div>
              </div>

              {ditolakCount > 0 ? (
                <div style={{ marginTop: '14px' }}>
                  <label
                    style={{
                      fontSize: '12.5px',
                      fontWeight: '600',
                      color: '#1e293b',
                      display: 'block',
                      marginBottom: '6px'
                    }}
                  >
                    Catatan
                  </label>
                  <textarea
                    rows={4}
                    value={alasanPenolakan}
                    onChange={(e) => {
                      setAlasanPenolakan(e.target.value);
                      if (errorAlasan) setErrorAlasan('');
                    }}
                    placeholder="Contoh: Mohon hitung ulang fisik modul Asasi karena ada selisih. Modul lainnya sudah sesuai."
                    className="input-focus-green"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${errorAlasan ? '#dc2626' : '#dce4de'}`,
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                  {errorAlasan && (
                    <span style={{ fontSize: '12px', color: '#dc2626', display: 'block', marginTop: '4px' }}>
                      {errorAlasan}
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => {
                  setIsModalKirimVerifikasiOpen(false);
                  setErrorAlasan('');
                }}
                style={styles.btnModalBatal}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleKirimVerifikasiFinal}
                style={styles.btnModalConfirmSetujui}
              >
                <SendOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Kirim Sekarang</span>
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
    padding: '24px 32px 100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
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
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
  },

  // Banners
  bannerApproved: {
    padding: '14px 18px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderLeft: '4px solid #16a34a',
    borderRadius: '10px'
  },
  bannerRejected: {
    padding: '14px 18px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderLeft: '4px solid #dc2626',
    borderRadius: '10px'
  },
  bannerEmpty: {
    padding: '14px 18px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderLeft: '4px solid #94a3b8',
    borderRadius: '10px'
  },

  // Filter Card
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #eef2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    flexWrap: 'wrap'
  },
  filterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: '1 1 auto',
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
    minWidth: '220px',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13.5px',
    width: '100%',
    color: '#1a3e2b'
  },
  customSelect: {
    height: '40px',
    padding: '0 12px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #23573c',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1a3e2b'
  },

  // Action Buttons Super Admin
  actionButtonsSuperAdmin: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0
  },
  btnSetujui: {
    height: '40px',
    padding: '0 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  btnTolak: {
    height: '40px',
    padding: '0 16px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    outline: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },

  // Table Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #eef2ef',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    minWidth: '980px',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    fontSize: '13.5px',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#ebf2ed',
    borderBottom: '2px solid #dce4de'
  },
  th: {
    backgroundColor: '#ebf2ed',
    padding: '14px 10px',
    fontSize: '11.5px',
    fontWeight: '700',
    color: '#23573c',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #eef2ef',
    transition: 'background-color 0.12s ease'
  },
  td: {
    padding: '12px 10px',
    verticalAlign: 'middle',
    color: '#334155'
  },
  moduleNameMain: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '13.5px',
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  jenisTextPlainBold: {
    fontSize: '14px',
    color: '#1a3e2b',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  badgeSelisih: {
    display: 'inline-block',
    minWidth: '28px',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center'
  },
  badgeStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '11.5px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0
  },

  // Pagination
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #eef2ef'
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
  btnKirimVerifikasi: {
    height: '40px',
    padding: '0 20px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)',
    transition: 'all 0.15s ease'
  },

  // Modals
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
    zIndex: 99999,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease'
  },
  modalHeader: {
    padding: '18px 22px',
    borderBottom: '1px solid #eef2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  modalCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  modalBody: {
    padding: '20px 22px'
  },
  modalSummaryBox: {
    backgroundColor: '#f8faf9',
    border: '1px solid #eef2ef',
    borderRadius: '10px',
    padding: '12px 14px',
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  modalSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12.5px',
    color: '#475569'
  },
  modalFooter: {
    padding: '14px 22px',
    backgroundColor: '#f8faf9',
    borderTop: '1px solid #eef2ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnModalBatal: {
    height: '38px',
    padding: '0 16px',
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1.5px solid #23573c',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnModalConfirmSetujui: {
    height: '38px',
    padding: '0 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
};
