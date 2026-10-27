import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

// Bulan
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
const CURRENT_MONTH_INDEX = NOW.getMonth();

// Dropdown
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

// Dropdown kalender
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
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Header Kalender: Navigasi Tahun */}
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

const createDefaultModulData = (defaultStatus = 'Belum Diinput') =>
  INITIAL_MODULS.map((m) => ({
    ...m,
    inputFisik: '',
    catatan: '',
    status: defaultStatus
  }));

const getInitialMonthlyData = () => {
  const defaults = {};

  // September 2026 (Menunggu Verifikasi)
  defaults['2026-09'] = {
    statusPeriode: 'Menunggu Verifikasi',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: INITIAL_MODULS.map((m) => {
      if (m.id === 1) {
        return { ...m, inputFisik: 445, catatan: '5 buku rusak di rak bawah', status: 'Menunggu Verifikasi' };
      }
      if (m.id === 3) {
        return { ...m, inputFisik: 314, catatan: 'Kurang 6 eks saat pengiriman', status: 'Menunggu Verifikasi' };
      }
      return { ...m, inputFisik: m.stokSistem, catatan: '', status: 'Menunggu Verifikasi' };
    })
  };

  // Agustus 2026 (Disetujui)
  defaults['2026-08'] = {
    statusPeriode: 'Disetujui',
    catatanPenolakan: '',
    tanggalVerifikasi: '31 Agustus 2026, 16:45 WIB',
    items: INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: m.stokSistem,
      catatan: '',
      status: 'Disetujui',
      isLocked: true
    }))
  };

  // Juli 2026 (Ditolak dengan Catatan Super Admin)
  defaults['2026-07'] = {
    statusPeriode: 'Ditolak',
    catatanPenolakan: 'Mohon hitung ulang fisik modul Asasi karena ada selisih 8 modul.',
    tanggalVerifikasi: '31 Juli 2026, 15:30 WIB',
    items: INITIAL_MODULS.map((m) => {
      if (m.id === 1) {
        return { ...m, inputFisik: 442, catatan: 'Fisik awal 442 di rak bawah, selisih 8 modul', status: 'Ditolak', isLocked: false };
      }
      return { ...m, inputFisik: m.stokSistem, catatan: '', status: 'Disetujui', isLocked: true };
    })
  };

  // Oktober 2026 (Belum Diinput)
  defaults['2026-10'] = {
    statusPeriode: 'Belum Diinput',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: createDefaultModulData('Belum Diinput')
  };

  return defaults;
};

export default function StokOpname() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState('2026');
  const [selectedBulan, setSelectedBulan] = useState('Oktober');

  // jika Super Admin menolak stok opname
  const [monthlyData, setMonthlyData] = useState(() => getInitialMonthlyData());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Jenis');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const effectiveBulan = selectedBulan === 'Bulan' ? 'Oktober' : selectedBulan;
  const effectiveYear = selectedTahun === 'Tahun' ? '2026' : selectedTahun;

  const selectedMonthIndex = useMemo(() => {
    const idx = MONTH_NAMES.indexOf(effectiveBulan);
    return idx >= 0 ? idx : 9;
  }, [effectiveBulan]);

  const selectedYearNum = Number(effectiveYear) || 2026;

  const isPastMonth = useMemo(() => {
    if (selectedYearNum < CURRENT_YEAR) return true;
    if (selectedYearNum === CURRENT_YEAR && selectedMonthIndex < CURRENT_MONTH_INDEX) return true;
    return false;
  }, [selectedYearNum, selectedMonthIndex]);

  const selectedMonthKey = useMemo(() => {
    return `${effectiveYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
  }, [effectiveYear, selectedMonthIndex]);

  // Ambil data untuk periode yang dipilih
  const currentPeriodData = useMemo(() => {
    const raw = monthlyData[selectedMonthKey];
    if (!raw) {
      return {
        statusPeriode: 'Belum Diinput',
        catatanPenolakan: '',
        tanggalVerifikasi: null,
        items: createDefaultModulData('Belum Diinput')
      };
    }
    if (Array.isArray(raw)) {
      const hasDitolak = raw.some((i) => i.status === 'Ditolak');
      const hasMenunggu = raw.some((i) => i.status === 'Menunggu Verifikasi');
      const hasDisetujui = raw.every((i) => i.status === 'Disetujui');
      return {
        statusPeriode: hasDitolak ? 'Ditolak' : hasMenunggu ? 'Menunggu Verifikasi' : hasDisetujui ? 'Disetujui' : 'Belum Diinput',
        catatanPenolakan: hasDitolak ? 'Mohon hitung ulang fisik modul yang memiliki selisih fisik.' : '',
        tanggalVerifikasi: hasDitolak || hasDisetujui ? '19 Oktober 2026, 23:15 WIB' : null,
        items: raw
      };
    }
    return raw;
  }, [monthlyData, selectedMonthKey]);

  const currentModulList = useMemo(() => currentPeriodData.items || [], [currentPeriodData]);
  const statusPeriode = currentPeriodData.statusPeriode || 'Belum Diinput';
  const isPeriodDitolak = statusPeriode === 'Ditolak' || currentModulList.some((it) => it.status === 'Ditolak');
  const isPeriodMenunggu = statusPeriode === 'Menunggu Verifikasi' || (!isPeriodDitolak && currentModulList.every((it) => it.status === 'Menunggu Verifikasi'));
  const isPeriodDisetujui = statusPeriode === 'Disetujui' || (!isPeriodDitolak && !isPeriodMenunggu && currentModulList.every((it) => it.status === 'Disetujui'));

  // Handler Perubahan Input Fisik (jika modul ditolak)
  const handleFisikChange = (id, val) => {
    const numericVal = val === '' ? '' : parseInt(val, 10);
    if (numericVal !== '' && isNaN(numericVal)) return;

    setMonthlyData((prev) => {
      const existing = prev[selectedMonthKey] || {
        statusPeriode: 'Belum Diinput',
        catatanPenolakan: '',
        tanggalVerifikasi: null,
        items: createDefaultModulData('Belum Diinput')
      };
      const itemsList = Array.isArray(existing) ? existing : existing.items;

      const updatedItems = itemsList.map((item) => {
        if (item.id === id) {
          // Modul yang terkunci / sudah disetujui / sedang menunggu verifikasi
          if (item.isLocked || item.status === 'Disetujui' || item.status === 'Menunggu Verifikasi') {
            return item;
          }
          return {
            ...item,
            inputFisik: numericVal,
            status: numericVal === '' && item.status === 'Draf' ? 'Belum Diinput' : item.status
          };
        }
        return item;
      });

      const nextData = {
        ...prev,
        [selectedMonthKey]: Array.isArray(existing)
          ? updatedItems
          : { ...existing, items: updatedItems }
      };

      return nextData;
    });
  };

  // Handler Perubahan Catatan
  const _handleCatatanChange = (id, val) => {
    setMonthlyData((prev) => {
      const existing = prev[selectedMonthKey] || {
        statusPeriode: 'Belum Diinput',
        catatanPenolakan: '',
        tanggalVerifikasi: null,
        items: createDefaultModulData('Belum Diinput')
      };
      const itemsList = Array.isArray(existing) ? existing : existing.items;

      const updatedItems = itemsList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            catatan: val,
            status: item.status === 'Belum Diinput' ? 'Draf' : item.status
          };
        }
        return item;
      });

      const nextData = {
        ...prev,
        [selectedMonthKey]: Array.isArray(existing)
          ? updatedItems
          : { ...existing, items: updatedItems }
      };

      return nextData;
    });
  };

  // Filter Jenis Modul
  const filteredData = useMemo(() => {
    return currentModulList.filter((item) => {
      const matchCat = selectedCategory === 'Semua Jenis' || item.kategori === selectedCategory;
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [currentModulList, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Simpan Draf (bisa untuk 1 modul atau beberapa modul)
  const handleSimpanDraf = () => {
    if (isPeriodDisetujui || isPeriodMenunggu) return;
    const filledCount = currentModulList.filter((item) => item.inputFisik !== '').length;

    if (filledCount === 0) {
      showToast('Belum ada stok fisik modul yang diisi untuk disimpan sebagai draf.', 'error');
      return;
    }

    setMonthlyData((prev) => {
      const existing = prev[selectedMonthKey] || {
        statusPeriode: 'Belum Diinput',
        catatanPenolakan: '',
        tanggalVerifikasi: null,
        items: createDefaultModulData('Belum Diinput')
      };
      const itemsList = Array.isArray(existing) ? existing : existing.items;

      const updatedList = itemsList.map((item) => {
        if (item.isLocked || item.status === 'Disetujui' || item.status === 'Menunggu Verifikasi') {
          return item;
        }
        return {
          ...item,
          status: item.inputFisik !== '' ? 'Draf' : 'Belum Diinput'
        };
      });

      const nextData = {
        ...prev,
        [selectedMonthKey]: Array.isArray(existing)
          ? updatedList
          : { ...existing, items: updatedList }
      };

      return nextData;
    });
    showToast('Draf berhasil disimpan', 'success');
  };

  // Ajukan Verifikasi / Ajukan Verifikasi Ulang
  const handleAjukanVerifikasi = () => {
    if (isPeriodDisetujui || isPeriodMenunggu) return;
    const uncompletedItems = currentModulList.filter((item) => item.inputFisik === '');

    if (uncompletedItems.length > 0) {
      showToast('Semua modul wajib diisi sebelum mengajukan verifikasi.', 'error');
      return;
    }

    setMonthlyData((prev) => {
      const existing = prev[selectedMonthKey] || {
        statusPeriode: 'Belum Diinput',
        catatanPenolakan: '',
        tanggalVerifikasi: null,
        items: createDefaultModulData('Belum Diinput')
      };
      const itemsList = Array.isArray(existing) ? existing : existing.items;

      const updatedList = itemsList.map((item) => {
        if (item.status === 'Disetujui') {
          return { ...item, isLocked: true };
        }
        return {
          ...item,
          status: 'Menunggu Verifikasi'
        };
      });

      const nextData = {
        ...prev,
        [selectedMonthKey]: {
          ...(Array.isArray(existing) ? {} : existing),
          statusPeriode: 'Menunggu Verifikasi',
          catatanPenolakan: '',
          items: updatedList
        }
      };

      return nextData;
    });

    if (isPeriodDitolak) {
      showToast('Revisi stok opname berhasil diajukan ulang ke Super Admin!', 'success');
    } else {
      showToast('Pengajuan verifikasi stok opname berhasil diajukan! Status diubah menjadi Menunggu Verifikasi.', 'success');
    }
  };

  // Render Status
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Disetujui':
        return <span style={styles.badgeDisetujui}>Disetujui</span>;
      case 'Menunggu Verifikasi':
      case 'Menunggu':
        return <span style={styles.badgeMenunggu}>Menunggu Verifikasi</span>;
      case 'Ditolak':
        return <span style={styles.badgeDitolak}>Ditolak</span>;
      case 'Draf':
        return <span style={styles.badgeDraf}>Draf</span>;
      case 'Belum Diinput':
      default:
        return <span style={styles.badgeBelumDiinput}>{status || 'Belum Diinput'}</span>;
    }
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

          {/* Filter Card */}
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

              {/* Dropdown Jenis */}
              <CustomDropdown
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
                options={KATEGORI_OPTIONS}
                className="select-wrapper-responsive"
                style={{ width: '135px', flexShrink: 0 }}
                selectStyle={styles.customSelect}
                arrowColor="#1a3e2b"
              />

              {/* Filter Kalender */}
              <MonthYearCalendarPicker
                selectedMonth={effectiveBulan}
                selectedYear={effectiveYear}
                onSelect={(m, y) => {
                  setSelectedBulan(m);
                  setSelectedTahun(y);
                  setCurrentPage(1);
                }}
                className="select-wrapper-responsive"
                style={{ width: '175px', flexShrink: 0 }}
                selectStyle={styles.customSelect}
              />
            </div>

            {/* Tombol Simpan Draf dan Ajukan Verifikasi */}
            <div className="bottom-actions-responsive" style={styles.bottomActions}>
              <button
                disabled={isPeriodDisetujui || isPeriodMenunggu || (isPastMonth && !isPeriodDitolak)}
                onClick={handleSimpanDraf}
                style={{
                  ...styles.btnDraf,
                  ...(isPeriodDisetujui || isPeriodMenunggu || (isPastMonth && !isPeriodDitolak) ? styles.btnActionDisabled : {})
                }}
              >
                <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Simpan Draf</span>
              </button>
              <button
                disabled={isPeriodDisetujui || isPeriodMenunggu || (isPastMonth && !isPeriodDitolak)}
                onClick={handleAjukanVerifikasi}
                style={{
                  ...styles.btnAjukan,
                  ...(isPeriodDisetujui || isPeriodMenunggu || (isPastMonth && !isPeriodDitolak) ? styles.btnActionDisabled : {}),
                  ...(isPeriodDitolak ? { backgroundColor: '#23573c', color: '#ffffff' } : {})
                }}
              >
                <SendOutlinedIcon sx={{ fontSize: 16 }} />
                <span>
                  {isPeriodDitolak
                    ? 'Ajukan Verifikasi Ulang'
                    : isPeriodMenunggu
                    ? 'Menunggu Verifikasi'
                    : isPeriodDisetujui
                    ? 'Telah Disetujui'
                    : 'Ajukan Verifikasi'}
                </span>
              </button>
            </div>
          </div>

          {/* Rejection Alert Banner (Hanya muncul jika periode Ditolak / Perlu Revisi) */}
          {isPeriodDitolak && (
            <div style={styles.rejectionBanner}>
              <div style={styles.rejectionBannerHeader}>
                <div style={styles.rejectionBannerTitleWrapper}>
                  <div>
                    <h3 style={styles.rejectionBannerTitle}>
                      Pengajuan Stok Opname Ditolak oleh Super Admin
                    </h3>
                  </div>
                </div>
              </div>

              {/* Isi Catatan Super Admin */}
              <div style={styles.rejectionNoteBox}>
                <div style={styles.rejectionNoteLabel}>
                  <span>Catatan Super Admin:</span>
                </div>
                <p style={styles.rejectionNoteText}>
                  {currentPeriodData.catatanPenolakan || 'Mohon hitung ulang fisik modul Asasi karena ada selisih 8 modul.'}
                </p>
              </div>
            </div>
          )}

          {/* Table Card */}
          <div style={styles.card}>
            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <colgroup>
                  <col style={{ width: '50px' }} />
                  <col style={{ width: '270px' }} />
                  <col style={{ width: '160px' }} />
                  <col style={{ width: '105px' }} />
                  <col style={{ width: '105px' }} />
                  <col style={{ width: '85px' }} />
                  <col style={{ width: '200px' }} />
                </colgroup>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={{ ...styles.th, width: '50px', textAlign: 'center' }}>NO</th>
                    <th style={{ ...styles.th, width: '270px', paddingLeft: '16px' }}>JUDUL MODUL</th>
                    <th style={{ ...styles.th, width: '160px' }}>JENIS</th>
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
                      const isInputted = item.inputFisik !== '' && item.inputFisik !== null && item.inputFisik !== undefined;
                      const inputVal = isInputted ? item.inputFisik : '';
                      const numericFisik = isInputted ? Number(item.inputFisik) : null;
                      const selisih = isInputted ? numericFisik - item.stokSistem : null;
                      const isMatch = isInputted && selisih === 0;

                      return (
                        <tr
                          key={item.id}
                          style={{
                            ...styles.tr,
                            backgroundColor:
                              item.status === 'Ditolak'
                                ? '#fffaf8'
                                : item.status === 'Disetujui'
                                ? '#fafcfb'
                                : isInputted && !isMatch
                                ? '#fffdf7'
                                : 'transparent'
                          }}
                        >
                          {/* NO */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {rowNumber}
                          </td>

                          {/* JUDUL MODUL */}
                          <td style={{ ...styles.td, paddingLeft: '16px' }}>
                            <div style={styles.moduleNameMain} className="stok-opname-module-name">{item.nama}</div>
                          </td>

                          {/* JENIS */}
                          <td style={styles.td}>
                            <span style={styles.jenisTextPlainBold}>{item.kategori}</span>
                          </td>

                          {/* STOK SISTEM */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', fontSize: '14px', color: '#162a20' }}>
                            {item.stokSistem}
                          </td>

                          {/* INPUT FISIK */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            {(() => {
                              const isLocked = item.isLocked || item.status === 'Disetujui';
                              const isWaiting = item.status === 'Menunggu Verifikasi';
                              const isRejected = item.status === 'Ditolak';
                              const isDisabled = isLocked || isWaiting || (isPastMonth && !isRejected);

                              return (
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    disabled={isDisabled}
                                    value={inputVal}
                                    onChange={(e) => handleFisikChange(item.id, e.target.value)}
                                    placeholder="0"
                                    style={{
                                      ...styles.inputFisik,
                                      borderColor: isRejected
                                        ? '#ef4444'
                                        : isDisabled
                                        ? '#dce4de'
                                        : (isInputted && !isMatch ? '#f59e0b' : '#c7d9cd'),
                                      backgroundColor: isRejected
                                        ? '#fff5f5'
                                        : isDisabled
                                        ? '#f8fafc'
                                        : (isInputted && !isMatch ? '#fffbeb' : '#ffffff'),
                                      color: isDisabled ? '#64748b' : (isRejected ? '#991b1b' : '#1a3e2b'),
                                      cursor: isDisabled ? 'not-allowed' : 'text',
                                      boxShadow: isRejected ? '0 0 0 2px rgba(239, 68, 68, 0.15)' : 'none'
                                    }}
                                  />
                                </div>
                              );
                            })()}
                          </td>

                          {/* SELISIH */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            {!isInputted ? (
                              <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '13px' }}>-</span>
                            ) : isMatch ? (
                              <span style={styles.badgeCocok}>0</span>
                            ) : (
                              <span
                                style={{
                                  ...styles.badgeSelisih,
                                  backgroundColor: selisih < 0 ? '#fef2f2' : '#f0fdf4',
                                  color: selisih < 0 ? '#dc2626' : '#16a34a'
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
          </div>
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    flexWrap: 'nowrap',
    gap: '12px'
  },
  filterLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'nowrap',
    flex: '1 1 auto',
    minWidth: 0
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 200px',
    minWidth: '140px',
    maxWidth: '260px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
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
  bottomActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'nowrap',
    flexShrink: 0
  },
  btnDraf: {
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1px solid #23573c',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s'
  },
  btnAjukan: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.25)',
    transition: 'transform 0.15s'
  },
  btnActionDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    boxShadow: 'none',
    pointerEvents: 'none'
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    minWidth: '975px',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#ebf2ed',
    borderBottom: '1px solid #dce4de'
  },
  th: {
    padding: '16px 12px',
    fontSize: '11.5px',
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
    padding: '14px 12px',
    fontSize: '13.5px',
    verticalAlign: 'middle'
  },
  moduleNameMain: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '13.5px',
    lineHeight: '1.4',
    whiteSpace: 'nowrap'
  },
  jenisTextPlainBold: {
    fontSize: '14px',
    color: '#1a3e2b',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  inputFisik: {
    width: '64px',
    padding: '7px 4px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #c7d9cd',
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#1a3e2b',
    outline: 'none',
    boxSizing: 'border-box'
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
    padding: '7px 10px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1a3e2b',
    boxSizing: 'border-box'
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
  badgeDisetujui: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '105px',
    height: '28px',
    padding: '0 12px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #16a34a',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  badgeMenunggu: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '105px',
    height: '28px',
    padding: '0 12px',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #d97706',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  badgeDitolak: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '105px',
    height: '28px',
    padding: '0 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #dc2626',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  badgeDraf: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '105px',
    height: '28px',
    padding: '0 12px',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #0284c7',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  badgeBelumDiinput: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '105px',
    height: '28px',
    padding: '0 12px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '600',
    letterSpacing: '0.4px',
    border: '1px solid #94a3b8',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },

  rejectionBanner: {
    backgroundColor: '#fff8f6',
    borderRadius: '14px',
    border: '1px solid #fed7aa',
    borderLeft: '5px solid #dc2626',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.06)'
  },
  rejectionBannerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px'
  },
  rejectionBannerTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rejectionBannerTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#991b1b',
    margin: 0,
    letterSpacing: '-0.2px'
  },
  rejectionNoteBox: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '12px 16px',
    border: '1px solid #fecaca',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  rejectionNoteLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  rejectionNoteText: {
    fontSize: '13.5px',
    color: '#1e293b',
    lineHeight: '1.5',
    margin: 0,
    fontStyle: 'normal'
  }
};
