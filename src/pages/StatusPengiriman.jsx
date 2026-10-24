import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import buktiSampaiImg from '../assets/bukti_pengiriman.jpg';

// Icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

// Konstanta
const ONGKIR_FLAT_KURIR = 10000;

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

const STATS_CONFIG = [
  { key: 'totalPerluDikirim', label: 'Perlu Dikirim', status: 'Perlu Dikirim', border: '#d97706', color: '#d97706', bg: '#fef3c7', icon: Inventory2OutlinedIcon },
  { key: 'totalDikirim', label: 'Dikirim', status: 'Dikirim', border: '#2563eb', color: '#2563eb', bg: '#dbeafe', icon: LocalShippingOutlinedIcon },
  { key: 'totalSelesai', label: 'Selesai', status: 'Selesai', border: '#16a34a', color: '#16a34a', bg: '#dcfce7', icon: TaskAltOutlinedIcon }
];

// Validasi Nominal Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number || 0);
};

// Data Pengiriman
const INITIAL_PENGIRIMAN = [
  {
    id: 'ORD-2026-001',
    idPesanan: 'ORD-2026-001',
    namaPembeli: 'Yohana Abigail',
    noHp: '0812-3456-7890',
    metode: 'Via Kurir',
    ongkirFlat: ONGKIR_FLAT_KURIR,
    alamat: 'Jl. Hang Kesturi, Nongsa',
    noKwitansi: '',
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
    alamat: 'Komplek Griya Indah Blok C3',
    noKwitansi: '',
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
    alamat: 'Kavling Baru, Batu Aji',
    noKwitansi: '',
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
    ongkirFlat: ONGKIR_FLAT_KURIR,
    alamat: 'Perumhan Taman Raya Blok B',
    noKwitansi: '',
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
    alamat: 'Perumahan Green Vienna Blok D',
    noKwitansi: '',
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
    alamat: 'Jl. Sukajadi No. 102, Sukasari',
    noKwitansi: '',
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
    ongkirFlat: ONGKIR_FLAT_KURIR,
    alamat: 'Jl. Antapani Raya No. 15',
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
    alamat: 'Komp. Margahayu Kencana Blok B2',
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

// Dropdown
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
        title={disabled ? 'Status sudah selesai (tidak dapat diubah lagi)' : undefined}
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
          ...selectStyle,
          ...(disabled
            ? {
              cursor: 'not-allowed',
              backgroundColor: '#f1f5f9',
              borderColor: '#cbd5e1',
              color: '#64748b',
              boxShadow: 'none'
            }
            : {})
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

// Responsif Mobile dan Desktop
function CustomDatePicker({
  value,
  onChange,
  disabled = false,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef(null);
  const activeYearRef = useRef(null);

  const [viewYear, setViewYear] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseInt(value.slice(0, 4), 10);
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseInt(value.slice(5, 7), 10) - 1;
    }
    return new Date().getMonth();
  });

  const [expandedYear, setExpandedYear] = useState(viewYear);

  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parts = value.split('-').map(Number);
      setViewYear(parts[0]);
      setViewMonth(parts[1] - 1);
      setExpandedYear(parts[0]);
    }
  }, [value]);

  useEffect(() => {
    setExpandedYear(viewYear);
  }, [viewYear, isMonthYearOpen]);

  useEffect(() => {
    if (isMonthYearOpen && activeYearRef.current) {
      activeYearRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isMonthYearOpen, expandedYear]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (window.innerWidth - rect.left < 285) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMonthYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const SHORT_MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const prevMonth = (e) => {
    e.stopPropagation();
    setIsMonthYearOpen(false);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setIsMonthYearOpen(false);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    if (disabled) return;
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const handleSelectPrevMonthDay = (day) => {
    if (disabled) return;
    let prevY = viewYear;
    let prevM = viewMonth - 1;
    if (prevM < 0) {
      prevM = 11;
      prevY -= 1;
    }
    const mStr = String(prevM + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${prevY}-${mStr}-${dStr}`);
    setViewYear(prevY);
    setViewMonth(prevM);
    setIsOpen(false);
  };

  const handleSelectNextMonthDay = (day) => {
    if (disabled) return;
    let nextY = viewYear;
    let nextM = viewMonth + 1;
    if (nextM > 11) {
      nextM = 0;
      nextY += 1;
    }
    const mStr = String(nextM + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${nextY}-${mStr}-${dStr}`);
    setViewYear(nextY);
    setViewMonth(nextM);
    setIsOpen(false);
  };

  const handleSetToday = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsMonthYearOpen(false);
    const now = new Date();
    const yStr = now.getFullYear();
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const dStr = String(now.getDate()).padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsMonthYearOpen(false);
    onChange('');
    setIsOpen(false);
  };

  // Kalender
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    prevDays.push(daysInPrevMonth - firstDayOfWeek + i + 1);
  }

  const currentDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentDays.push(i);
  }

  const remainingCells = 42 - (prevDays.length + currentDays.length);
  const nextDays = [];
  for (let i = 1; i <= remainingCells; i++) {
    nextDays.push(i);
  }

  let selY = null, selM = null, selD = null;
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split('-').map(Number);
    selY = parts[0];
    selM = parts[1] - 1;
    selD = parts[2];
  }

  const yearRange = [];
  for (let y = Math.min(2020, viewYear - 3); y <= Math.max(2035, viewYear + 6); y++) {
    yearRange.push(y);
  }

  const displayText = value && selY ? `${String(selD).padStart(2, '0')}/${String(selM + 1).padStart(2, '0')}/${selY}` : 'Pilih tanggal...';

  return (
    <div
      ref={containerRef}
      className="custom-datepicker-container"
      style={{ position: 'relative', width: '100%', userSelect: 'none', ...style }}
    >
      {/* Input Display Bar */}
      <div
        id="btn-datepicker-trigger"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsMonthYearOpen(false);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          padding: '6px 12px',
          minHeight: '34px',
          fontSize: '12.5px',
          fontWeight: '600',
          border: disabled ? '1px solid #cbd5e1' : '1px solid #23573c',
          borderRadius: '10px',
          backgroundColor: disabled ? '#f1f5f9' : '#f6faf7',
          color: disabled ? '#64748b' : value ? '#1e293b' : '#94a3b8',
          transition: 'all 0.2s ease',
          boxShadow:
            isOpen && !disabled
              ? '0 0 0 3px rgba(35, 87, 60, 0.15)'
              : isHovered && !disabled
                ? '0 0 0 3px rgba(35, 87, 60, 0.1)'
                : 'none'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayText}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={disabled ? '#94a3b8' : '#23573c'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: '6px' }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      {/* Popover Kalender */}
      {isOpen && !disabled && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: alignRight ? 'auto' : 0,
            right: alignRight ? 0 : 'auto',
            width: '272px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #dadce0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
            padding: '16px 14px 12px',
            boxSizing: 'border-box',
            zIndex: 10050,
            userSelect: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
          }}
        >
          {/* Header Kalender */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}
          >
            {/* Bulan dan Tahun dan Dropdown */}
            <button
              type="button"
              onClick={() => setIsMonthYearOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                padding: '2px 4px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
                color: '#202124',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title={isMonthYearOpen ? 'Kembali ke Kalender Hari' : 'Pilih Bulan & Tahun'}
            >
              <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <span
                style={{
                  fontSize: '9px',
                  color: '#3c4043',
                  display: 'inline-block',
                  transform: isMonthYearOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease'
                }}
              >
                ▼
              </span>
            </button>

            {!isMonthYearOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={prevMonth}
                  title="Bulan sebelumnya"
                  style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#202124',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={nextMonth}
                  title="Bulan berikutnya"
                  style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#202124',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {isMonthYearOpen ? (
            <div
              style={{
                maxHeight: '270px',
                overflowY: 'auto',
                paddingRight: '2px',
                borderTop: '1px solid #f1f3f4'
              }}
            >
              {yearRange.map((y) => {
                const isExpanded = y === expandedYear;

                return (
                  <div key={y} ref={isExpanded ? activeYearRef : null}>
                    <div
                      onClick={() => setExpandedYear(y)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13.5px',
                        fontWeight: isExpanded ? '600' : '400',
                        color: '#202124',
                        backgroundColor: isExpanded ? '#f1f3f4' : 'transparent',
                        borderBottom: '1px solid #e8eaed',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isExpanded) e.currentTarget.style.backgroundColor = '#f8faf9';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {y}
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '10px 4px',
                          padding: '12px 6px 14px',
                          backgroundColor: '#ffffff',
                          borderBottom: '1px solid #e8eaed'
                        }}
                      >
                        {SHORT_MONTHS.map((mShort, mIdx) => {
                          const isSelectedMonth =
                            (selY === y && selM === mIdx) || (y === viewYear && mIdx === viewMonth);

                          return (
                            <button
                              key={mShort}
                              type="button"
                              onClick={() => {
                                setViewYear(y);
                                setViewMonth(mIdx);
                                setIsMonthYearOpen(false);
                              }}
                              style={{
                                height: '32px',
                                width: '46px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: isSelectedMonth ? '700' : '400',
                                color: isSelectedMonth ? '#ffffff' : '#202124',
                                backgroundColor: isSelectedMonth ? '#3c4043' : 'transparent',
                                border: isSelectedMonth ? '2px solid #202124' : 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                boxSizing: 'border-box',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelectedMonth) e.currentTarget.style.backgroundColor = '#f1f3f4';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelectedMonth) e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              {mShort}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                {DAY_NAMES.map((d) => (
                  <div
                    key={d}
                    style={{
                      fontSize: '12.5px',
                      fontWeight: '500',
                      color: '#202124'
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  rowGap: '6px',
                  columnGap: '2px',
                  textAlign: 'center'
                }}
              >
                {prevDays.map((d, i) => (
                  <button
                    key={`prev-${i}`}
                    type="button"
                    onClick={() => handleSelectPrevMonthDay(d)}
                    style={{
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: '#70757a',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '3px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {d}
                  </button>
                ))}

                {currentDays.map((d) => {
                  const isSelected = selY === viewYear && selM === viewMonth && selD === d;

                  return (
                    <button
                      key={`day-${d}`}
                      type="button"
                      onClick={() => handleSelectDay(d)}
                      style={{
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: isSelected ? '700' : '400',
                        borderRadius: '3px',
                        border: isSelected ? '2px solid #202124' : 'none',
                        backgroundColor: isSelected ? '#3c4043' : 'transparent',
                        color: isSelected ? '#ffffff' : '#202124',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f3f4';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {d}
                    </button>
                  );
                })}

                {nextDays.map((d, i) => (
                  <button
                    key={`next-${i}`}
                    type="button"
                    onClick={() => handleSelectNextMonthDay(d)}
                    style={{
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: '#70757a',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '3px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '6px'
                }}
              >
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1a73e8',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleSetToday}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1a73e8',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f3f4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Today
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Modal Detail Pengiriman Modul  
function DetailPengirimanModal({
  selectedDetail,
  setSelectedDetail,
  pengirimanList,
  onClose,
  onSave,
  onPreviewProof
}) {
  const [isCopied, setIsCopied] = useState(false);

  const subtotalModul = useMemo(() => {
    return (selectedDetail.itemModul || []).reduce(
      (sum, item) => sum + (item.harga || 0) * (item.qty || 1),
      0
    );
  }, [selectedDetail.itemModul]);

  const ongkirKurir = selectedDetail.metode === 'Via Kurir' ? ONGKIR_FLAT_KURIR : 0;
  const totalHarga = subtotalModul + ongkirKurir;

  const originalStatus = useMemo(() => {
    return pengirimanList.find((p) => p.id === selectedDetail.id)?.status || selectedDetail.status;
  }, [pengirimanList, selectedDetail.id, selectedDetail.status]);

  const statusOptions = originalStatus === 'Perlu Dikirim'
    ? ['Perlu Dikirim', 'Dikirim']
    : ['Dikirim', 'Selesai'];

  const handleCopyKwitansi = async (kwitansi) => {
    if (!kwitansi) return;
    let success = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(kwitansi);
        success = true;
      }
    } catch {
      // Fallback
    }

    if (!success) {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = kwitansi;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        success = true;
      } catch { }
    }

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleStatusChange = (newStatus) => {
    setSelectedDetail((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const autoKwitansi =
        prev.noKwitansi || (prev.id ? prev.id.replace('ORD', 'KWT') : 'KWT-2026-001');
      const autoBuktiSampai =
        prev.buktiSampai || { fotoUrl: buktiSampaiImg };

      return {
        ...prev,
        status: newStatus,
        tanggalKirim:
          newStatus === 'Dikirim' && !prev.tanggalKirim ? today : prev.tanggalKirim,
        noKwitansi:
          newStatus === 'Selesai' ? autoKwitansi : prev.noKwitansi,
        buktiSampai:
          newStatus === 'Selesai' ? autoBuktiSampai : prev.buktiSampai
      };
    });
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={styles.modalContentDetail}
        className="modal-detail-responsive"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Detail Pengiriman Modul</h3>
          <button
            type="button"
            onClick={onClose}
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
              <div style={{ marginTop: '2px' }}>
                <CustomDatePicker
                  value={selectedDetail.tanggalKirim || ''}
                  onChange={(newDate) =>
                    setSelectedDetail((prev) => ({ ...prev, tanggalKirim: newDate }))
                  }
                  disabled={selectedDetail.status === 'Selesai'}
                />
              </div>
            </div>
            <div style={styles.detailMetaItem}>
              <span style={styles.detailMetaLabel}>
                {selectedDetail.status === 'Selesai' ? 'Status' : 'Ubah Status'}
              </span>
              <div style={{ marginTop: '2px' }}>
                <CustomDropdown
                  disabled={selectedDetail.status === 'Selesai'}
                  value={selectedDetail.status}
                  onChange={handleStatusChange}
                  options={statusOptions}
                  style={{ width: '100%' }}
                  selectStyle={{
                    padding: '6px 12px',
                    minHeight: '34px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Data Pembeli & Pengiriman */}
          <div style={styles.detailSection}>
            <div style={styles.detailSectionTitle}>Data Pembeli & Pengiriman</div>
            <div style={styles.detailRecipientGrid} className="modal-form-grid2">
              <div>
                <span style={styles.detailFieldLabel}>Nama Pembeli</span>
                <div style={styles.detailFieldValue}>{selectedDetail.namaPembeli}</div>
              </div>
              <div>
                <span style={styles.detailFieldLabel}>No.Hp</span>
                <div style={styles.detailFieldValue}>{selectedDetail.noHp}</div>
              </div>

              {selectedDetail.metode === 'Titip ke Ustazah' && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={styles.detailFieldLabel}>Nama Ustazah</span>
                  <div style={styles.detailFieldValue}>{selectedDetail.ustazahNama || '-'}</div>
                </div>
              )}

              {selectedDetail.metode === 'Ambil di RSQ Pusat' && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={styles.detailFieldLabel}>Lokasi Pengambilan</span>
                  <div style={styles.detailFieldValue}>Kantor RSQ Pusat</div>
                </div>
              )}

              {selectedDetail.metode === 'Via Kurir' && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={styles.detailFieldLabel}>Alamat Pengiriman</span>
                  <div style={styles.detailFieldValue}>{selectedDetail.alamat}</div>
                </div>
              )}

              {selectedDetail.status === 'Selesai' && (
                <div style={{ gridColumn: 'span 2' }}>
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
                        id="btn-copy-kwitansi"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyKwitansi(selectedDetail.noKwitansi);
                        }}
                        style={isCopied ? styles.btnCopySuccess : styles.btnCopyResiSimple}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#16a34a' }} />
                            <span style={{ color: '#16a34a', fontWeight: '700' }}>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rincian Modul & Total Harga */}
          <div style={styles.detailSection}>
            <div style={styles.detailSectionTitle}>Rincian Modul</div>

            {/* Desktop Table */}
            <div className="rincian-modul-desktop" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table style={styles.detailItemTable}>
                <thead>
                  <tr>
                    <th style={{ ...styles.detailTh, textAlign: 'left' }}>Judul Modul</th>
                    <th style={{ ...styles.detailTh, textAlign: 'center' }}>Jumlah</th>
                    <th style={{ ...styles.detailTh, textAlign: 'right' }}>Harga Satuan</th>
                    <th style={{ ...styles.detailTh, textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedDetail.itemModul || []).map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.detailTd}>{item.nama}</td>
                      <td style={{ ...styles.detailTd, textAlign: 'center' }}>{item.qty}</td>
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
                      <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(ONGKIR_FLAT_KURIR)}</td>
                      <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                        {formatRupiah(ONGKIR_FLAT_KURIR)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700' }}>
                      Total:
                    </td>
                    <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700', color: '#166534' }}>
                      {formatRupiah(totalHarga)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="rincian-modul-mobile">
              {(selectedDetail.itemModul || []).map((item, idx) => (
                <div key={idx} style={styles.mobileItemCard}>
                  <div style={styles.mobileItemName}>{item.nama}</div>
                  <div style={styles.mobileItemBottom}>
                    <span style={styles.mobileItemQtyPrice}>
                      {item.qty} × {formatRupiah(item.harga || 0)}
                    </span>
                    <span style={styles.mobileItemSubtotal}>
                      {formatRupiah((item.harga || 0) * (item.qty || 1))}
                    </span>
                  </div>
                </div>
              ))}
              {selectedDetail.metode === 'Via Kurir' && (
                <div style={styles.mobileItemCard}>
                  <div style={styles.mobileItemName}>Biaya Kurir</div>
                  <div style={styles.mobileItemBottom}>
                    <span style={styles.mobileItemQtyPrice}>Ongkir Flat</span>
                    <span style={styles.mobileItemSubtotal}>{formatRupiah(ONGKIR_FLAT_KURIR)}</span>
                  </div>
                </div>
              )}
              <div style={styles.mobileTotalRow}>
                <span style={styles.mobileTotalLabel}>Total:</span>
                <span style={styles.mobileTotalValue}>
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>
          </div>

          {/* Foto Bukti Diterima */}
          {(selectedDetail.status === 'Selesai' || selectedDetail.status === 'Terkirim') && (
            <div style={styles.detailSection}>
              <div style={styles.detailSectionTitle}>Foto Bukti Diterima</div>
              <div style={styles.detailReceiptWrapper}>
                <img
                  src={selectedDetail.buktiSampai?.fotoUrl || buktiSampaiImg}
                  alt="Foto Bukti Diterima"
                  style={{ ...styles.detailReceiptImg, cursor: 'pointer' }}
                  onClick={() => onPreviewProof(selectedDetail.buktiSampai?.fotoUrl || buktiSampaiImg)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tombol Batal & Simpan */}
        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            style={styles.btnModalClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => onSave(selectedDetail)}
            style={styles.btnModalSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// Halaman Utama Status Pengirima
export default function StatusPengiriman() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pengirimanList, setPengirimanList] = useState(INITIAL_PENGIRIMAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [metodeFilter, setMetodeFilter] = useState('Semua Metode');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [notification, setNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [previewProofImg, setPreviewProofImg] = useState(null);

  // Notifikasi
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

  // Filter Data
  const filteredPengiriman = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return pengirimanList.filter((item) => {
      const matchSearch =
        !query ||
        item.namaPembeli.toLowerCase().includes(query) ||
        (item.idPesanan && item.idPesanan.toLowerCase().includes(query));

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
      totalSelesai: pengirimanList.filter((p) => p.status === 'Selesai').length
    };
  }, [pengirimanList]);

  // Klik Kartu Statistik
  const handleStatCardClick = (targetStatus) => {
    setStatusFilter((prev) => (prev.toLowerCase() === targetStatus.toLowerCase() ? 'Semua Status' : targetStatus));
    setCurrentPage(1);
  };

  // Simpan Perubahan dari Pop-up Detail
  const handleSaveDetail = (updatedDetail) => {
    if (!updatedDetail) return;
    setPengirimanList((prevList) =>
      prevList.map((item) => (item.id === updatedDetail.id ? { ...updatedDetail } : item))
    );
    showToast('Status pengiriman berhasil diperbarui!', 'success');
    setSelectedDetail(null);
  };

  // Badge Status Kotak
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Perlu Dikirim':
        return <span style={styles.statusPerluDikirim}>Perlu Dikirim</span>;
      case 'Dikirim':
      case 'Sedang Dikirim':
        return <span style={styles.statusDikirim}>Dikirim</span>;
      case 'Selesai':
      case 'Terkirim':
        return <span style={styles.statusSelesai}>Selesai</span>;
      default:
        return <span style={styles.statusDefault}>{status}</span>;
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

          {/* Tab Navigasi */}
          <div style={styles.tabContainer} className="tab-container-responsive">
            <button
              type="button"
              onClick={() => navigate('/pesanan-kirim')}
              style={styles.tabButton}
            >
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Pembayaran</span>
            </button>

            <button
              type="button"
              style={{
                ...styles.tabButton,
                ...styles.tabButtonActive
              }}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Pengiriman</span>
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
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
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
                    <col style={{ width: '8%', minWidth: '55px' }} />
                    <col style={{ width: '38%', minWidth: '180px' }} />
                    <col style={{ width: '28%', minWidth: '150px' }} />
                    <col style={{ width: '26%', minWidth: '130px' }} />
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
                            onClick={() => setSelectedDetail(item)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8faf9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{ ...styles.tr, cursor: 'pointer' }}
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
                              {renderStatusBadge(item.status)}
                            </td>

                            {/* AKSI */}
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              <button
                                id={`btn-detail-${index + 1}`}
                                type="button"
                                onClick={() => setSelectedDetail(item)}
                                style={styles.btnActionDetailOnly}
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
      {selectedDetail && (
        <DetailPengirimanModal
          selectedDetail={selectedDetail}
          setSelectedDetail={setSelectedDetail}
          pengirimanList={pengirimanList}
          onClose={() => setSelectedDetail(null)}
          onSave={handleSaveDetail}
          onPreviewProof={(imgUrl) => setPreviewProofImg(imgUrl)}
        />
      )}

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
  tabContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '22px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '2px',
    boxSizing: 'border-box'
  },
  tabButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px 20px',
    fontSize: '14.5px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '8px 8px 0 0',
    boxSizing: 'border-box'
  },
  tabButtonActive: {
    color: '#23573c',
    fontWeight: '700',
    borderBottom: '3px solid #23573c',
    backgroundColor: 'rgba(35, 87, 60, 0.06)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    minWidth: '520px',
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
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  statusPerluDikirim: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
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
  statusDikirim: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #2563eb',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusSelesai: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
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
  statusDefault: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
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
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap'
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
  emptyTable: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
    fontSize: '14px'
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnCopySuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ecfdf5',
    color: '#16a34a',
    border: '1px solid #a7f3d0',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'default',
    transition: 'all 0.2s ease'
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
  mobileItemCard: {
    backgroundColor: '#f8faf9',
    borderRadius: '10px',
    border: '1px solid #eef2ef',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mobileItemName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a3e2b',
    lineHeight: '1.4'
  },
  mobileItemBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  mobileItemQtyPrice: {
    fontSize: '13.5px',
    color: '#475569',
    fontWeight: '600'
  },
  mobileItemSubtotal: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b'
  },
  mobileTotalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px 16px',
    marginTop: '6px'
  },
  mobileTotalLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#334155'
  },
  mobileTotalValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#166534'
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
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  btnModalClose: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnModalSave: {
    padding: '8px 22px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)',
    transition: 'all 0.2s ease'
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
  }
};
