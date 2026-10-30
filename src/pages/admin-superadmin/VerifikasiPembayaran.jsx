import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import contohBuktiTf from '../../assets/contoh bukti tf.jpeg';
import logoRsq from '../../assets/logo rsq.jpeg';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import html2pdf from 'html2pdf.js';

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

// Filter Status
const STATUS_OPTIONS = [
  'Semua Status',
  'Belum Bayar',
  'Menunggu Verifikasi',
  'Disetujui',
  'Ditolak'
];

// Filter Metode Pembayaran
const METODE_OPTIONS = [
  'Semua Metode',
  'Transfer Bank',
  'Tunai'
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

// Konstanta
const ONGKIR_FLAT_KURIR = 10000;

// Data Awal
const INITIAL_PESANAN = [
  {
    id: 'ORD-2026-001',
    tanggal: '2026-10-12',
    namaPembeli: 'Yohana Abigail',
    noHp: '0812-3456-7890',
    alamat: 'Jl. Hang Kesturi, Nongsa',
    metodePengiriman: 'Via Kurir',
    ongkirFlat: ONGKIR_FLAT_KURIR,
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 5, harga: 25000 },
      { nama: 'Tajwidi', qty: 3, harga: 30000 }
    ],
    totalBayar: 225000,
    metodeBayar: 'Transfer Bank',
    status: 'Menunggu Verifikasi',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-002',
    tanggal: '2026-10-12',
    namaPembeli: 'Ririn Anisa',
    noHp: '0857-9876-5432',
    alamat: 'Komplek Griya Indah Blok C3',
    metodePengiriman: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
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
    alamat: 'Kavling Baru, Batu Aji',
    metodePengiriman: 'Titip ke Ustazah',
    ongkirFlat: 0,
    ustazahNama: 'Ustazah Fatimah Azzahra',
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
    alamat: 'Perumhan Taman Raya Blok B',
    metodePengiriman: 'Via Kurir',
    ongkirFlat: ONGKIR_FLAT_KURIR,
    itemModul: [
      { nama: 'Mushaf Ash Shahib A5 Terjemah', qty: 8, harga: 75000 },
      { nama: 'Panduan Guru', qty: 2, harga: 40000 }
    ],
    totalBayar: 690000,
    metodeBayar: 'Transfer Bank',
    status: 'Disetujui',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-005',
    tanggal: '2026-10-09',
    namaPembeli: 'Budi Santoso',
    noHp: '0878-4455-6677',
    alamat: 'Perumahan Green Vienna Blok D',
    metodePengiriman: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
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
    alamat: 'Jl. Sukajadi No. 102, Sukasari',
    metodePengiriman: 'Titip ke Ustazah',
    ongkirFlat: 0,
    ustazahNama: 'Ustazah Maryam S.Pd.I',
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
    tanggal: '2026-10-07',
    namaPembeli: 'Dewi Lestari',
    noHp: '0852-3344-5566',
    alamat: 'Jl. Antapani Raya No. 15',
    metodePengiriman: 'Via Kurir',
    ongkirFlat: ONGKIR_FLAT_KURIR,
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 5, harga: 15000 }
    ],
    totalBayar: 85000,
    metodeBayar: 'Transfer Bank',
    status: 'Disetujui',
    alasanPenolakan: ''
  },
  {
    id: 'ORD-2026-008',
    tanggal: '2026-10-06',
    namaPembeli: 'Rian Hidayat',
    noHp: '0877-6655-4433',
    alamat: 'Komp. Margahayu Kencana Blok B2',
    metodePengiriman: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 4, harga: 25000 },
      { nama: 'Khat', qty: 2, harga: 22000 }
    ],
    totalBayar: 144000,
    metodeBayar: 'Transfer Bank',
    status: 'Disetujui',
    alasanPenolakan: ''
  }
];

// Card Statistik
const STATS_CONFIG = [
  { key: 'totalMenunggu', label: 'Menunggu Verifikasi', status: 'Menunggu Verifikasi', border: '#d97706', color: '#d97706', bg: '#fef3c7', icon: PendingActionsOutlinedIcon },
  { key: 'totalDisetujui', label: 'Disetujui', status: 'Disetujui', border: '#16a34a', color: '#16a34a', bg: '#dcfce7', icon: TaskAltOutlinedIcon },
  { key: 'totalDitolak', label: 'Ditolak', status: 'Ditolak', border: '#dc2626', color: '#dc2626', bg: '#fee2e2', icon: CancelOutlinedIcon },
  { key: 'totalBelumBayar', label: 'Belum Bayar', status: 'Belum Bayar', border: '#2563eb', color: '#2563eb', bg: '#dbeafe', icon: AccessTimeOutlinedIcon }
];

const CALENDAR_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CALENDAR_SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
];

const CALENDAR_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Kalender Responsive
function LaporanPengirimanDatePickerInput({
  value,
  onChange,
  onOpen,
  onClose,
  alignRight = false,
  placeholder = 'dd/mm/yyyy'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const [computedAlignRight, setComputedAlignRight] = useState(alignRight);
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
      if (alignRight || window.innerWidth - rect.left < 285) {
        setComputedAlignRight(true);
      } else {
        setComputedAlignRight(false);
      }
    }
  }, [isOpen, alignRight]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMonthYearOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

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
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mStr}-${dStr}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleSelectPrevMonthDay = (day) => {
    let y = viewYear;
    let m = viewMonth - 1;
    if (m < 0) { m = 11; y -= 1; }
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${y}-${mStr}-${dStr}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleSelectNextMonthDay = (day) => {
    let y = viewYear;
    let m = viewMonth + 1;
    if (m > 11) { m = 0; y += 1; }
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${y}-${mStr}-${dStr}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleSetToday = (e) => {
    e.stopPropagation();
    setIsMonthYearOpen(false);
    const now = new Date();
    const yStr = now.getFullYear();
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const dStr = String(now.getDate()).padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setIsOpen(false);
    onClose?.();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setIsMonthYearOpen(false);
    onChange('');
    setIsOpen(false);
    onClose?.();
  };

  const formatDisplay = (dStr) => {
    if (!dStr) return '';
    try {
      const [y, m, d] = dStr.split('-');
      if (!y || !m || !d) return dStr;
      return `${String(parseInt(d, 10)).padStart(2, '0')}/${String(parseInt(m, 10)).padStart(2, '0')}/${y}`;
    } catch {
      return dStr;
    }
  };

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

  const yearRange = [];
  for (let y = Math.min(2020, viewYear - 3); y <= Math.max(2035, viewYear + 6); y++) {
    yearRange.push(y);
  }

  let selY = null, selM = null, selD = null;
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split('-').map(Number);
    selY = parts[0];
    selM = parts[1] - 1;
    selD = parts[2];
  }

  return (
    <div
      ref={containerRef}
      className="laporan-datepicker-input-wrapper"
      onClick={() => {
        setIsOpen((prev) => {
          const next = !prev;
          if (next) onOpen?.();
          else onClose?.();
          return next;
        });
        setIsMonthYearOpen(false);
      }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        flex: 1,
        minWidth: 0,
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontFamily: 'inherit',
          color: '#1a3e2b',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          letterSpacing: '0.2px'
        }}
      >
        {formatDisplay(value) || placeholder}
      </span>

      <svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        fill="none"
        stroke="#4a5568"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, opacity: 0.85 }}
      >
        <rect x="2.5" y="4" width="15" height="13" rx="2" fill="#ffffff" />
        <line x1="2.5" y1="8" x2="17.5" y2="8" stroke="#4a5568" strokeWidth="1.5" />
        <line x1="6" y1="2" x2="6" y2="4.5" stroke="#4a5568" strokeWidth="1.5" />
        <line x1="14" y1="2" x2="14" y2="4.5" stroke="#4a5568" strokeWidth="1.5" />
        <circle cx="6" cy="11" r="0.75" fill="#4a5568" stroke="none" />
        <circle cx="10" cy="11" r="0.75" fill="#4a5568" stroke="none" />
        <circle cx="14" cy="11" r="0.75" fill="#4a5568" stroke="none" />
        <circle cx="6" cy="14" r="0.75" fill="#4a5568" stroke="none" />
        <circle cx="10" cy="14" r="0.75" fill="#4a5568" stroke="none" />
        <circle cx="14" cy="14" r="0.75" fill="#4a5568" stroke="none" />
      </svg>

      {isOpen && (
        <div
          className="laporan-calendar-popover"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: computedAlignRight ? 'auto' : 0,
            right: computedAlignRight ? 0 : 'auto',
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
            >
              <span>{CALENDAR_MONTH_NAMES[viewMonth]} {viewYear}</span>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={nextMonth}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                        {CALENDAR_SHORT_MONTHS.map((mShort, mIdx) => {
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
              {/* Nama Hari */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                {CALENDAR_DAY_NAMES.map((d) => (
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

              {/* Grid Tanggal */}
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

export default function VerifikasiPembayaran() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('verifikasi');

  // Data State
  const [pesananList, setPesananList] = useState(INITIAL_PESANAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [metodeFilter, setMetodeFilter] = useState('Semua Metode');
  const [startDate, setStartDate] = useState('');
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [endDate, setEndDate] = useState('');
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isDateHovered, setIsDateHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [notification, setNotification] = useState(null);

  // Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedKwitansi, setSelectedKwitansi] = useState(null);
  const [approvingOrder, setApprovingOrder] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [alasanTolak, setAlasanTolak] = useState('');
  const [alasanError, setAlasanError] = useState('');

  // Toast Notifikasi
  const toastTimeoutRef = useRef(null);
  const autoCloseModalTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setNotification({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleCloseDetailModal = () => {
    if (autoCloseModalTimeoutRef.current) {
      clearTimeout(autoCloseModalTimeoutRef.current);
    }
    setSelectedDetail(null);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      if (autoCloseModalTimeoutRef.current) {
        clearTimeout(autoCloseModalTimeoutRef.current);
      }
    };
  }, []);

  // Format Rupiah
  const terbilang = (nominal) => {
    const angka = Math.floor(Math.abs(Number(nominal) || 0));
    const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    if (angka < 12) return bilangan[angka];
    if (angka < 20) return terbilang(angka - 10) + ' Belas';
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + ' Puluh' + (angka % 10 !== 0 ? ' ' + terbilang(angka % 10) : '');
    if (angka < 200) return 'Seratus' + (angka % 100 !== 0 ? ' ' + terbilang(angka % 100) : '');
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + ' Ratus' + (angka % 100 !== 0 ? ' ' + terbilang(angka % 100) : '');
    if (angka < 2000) return 'Seribu' + (angka % 1000 !== 0 ? ' ' + terbilang(angka % 1000) : '');
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + ' Ribu' + (angka % 1000 !== 0 ? ' ' + terbilang(angka % 1000) : '');
    if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + ' Juta' + (angka % 1000000 !== 0 ? ' ' + terbilang(angka % 1000000) : '');
    return terbilang(Math.floor(angka / 1000000000)) + ' Miliar' + (angka % 1000000000 !== 0 ? ' ' + terbilang(angka % 1000000000) : '');
  };

  // Cetak / Unduh PDF Kwitansi
  const handlePrintKwitansi = () => {
    const element = document.getElementById('printable-kwitansi');
    if (!element) return;
    const nomorKwitansi = selectedKwitansi
      ? 'KWT-' + (selectedKwitansi.id || '').replace(/^ORD-/, '')
      : 'Kuitansi';

    // Buat clone offscreen khusus untuk PDF agar tampilan website tidak berubah sama sekali,
    // namun di hasil PDF tulisannya melebar ke ujung kiri & kanan secara proporsional
    const offscreen = document.createElement('div');
    offscreen.style.position = 'fixed';
    offscreen.style.left = '-9999px';
    offscreen.style.top = '0';
    offscreen.style.width = '700px';
    offscreen.style.backgroundColor = '#ffffff';
    offscreen.style.zIndex = '-9999';

    const clone = element.cloneNode(true);
    clone.style.width = '700px';
    clone.style.maxWidth = '700px';
    clone.style.padding = '0';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';

    offscreen.appendChild(clone);
    document.body.appendChild(offscreen);

    const opt = {
      margin: [12, 20, 12, 20],
      filename: nomorKwitansi + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: 700 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const cleanup = () => {
      if (document.body.contains(offscreen)) {
        document.body.removeChild(offscreen);
      }
    };

    try {
      const exporter = typeof html2pdf === 'function' ? html2pdf : (html2pdf && html2pdf.default ? html2pdf.default : window.html2pdf);
      if (typeof exporter === 'function') {
        exporter()
          .set(opt)
          .from(clone)
          .save()
          .then(cleanup)
          .catch((err) => {
            console.error('Error in save:', err);
            cleanup();
          });
      } else {
        cleanup();
        window.print();
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      cleanup();
      window.print();
    }
  };

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
      const matchSearch = item.namaPembeli
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      const matchStatus =
        statusFilter === 'Semua Status' ||
        item.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'Ditolak' && (item.status === 'Pembayaran Ditolak' || item.status === 'Ditolak'));

      const matchMetode =
        metodeFilter === 'Semua Metode' ||
        item.metodeBayar.toLowerCase() === metodeFilter.toLowerCase();

      const matchDateRange =
        (!startDate || item.tanggal >= startDate) &&
        (!endDate || item.tanggal <= endDate);

      return matchSearch && matchStatus && matchMetode && matchDateRange;
    });
  }, [pesananList, searchQuery, statusFilter, metodeFilter, startDate, endDate]);

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
      totalBelumBayar: pesananList.filter((p) => p.status === 'Belum Bayar').length
    };
  }, [pesananList]);

  // Klik Kartu Statistik
  const handleStatCardClick = (targetStatus) => {
    setStatusFilter((prev) => (prev.toLowerCase() === targetStatus.toLowerCase() ? 'Semua Status' : targetStatus));
    setCurrentPage(1);
  };

  // Badge Status
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return <span style={styles.statusMenunggu}>Menunggu Verifikasi</span>;
      case 'Disetujui':
        return <span style={styles.statusDisetujui}>Disetujui</span>;
      case 'Ditolak':
      case 'Pembayaran Ditolak':
        return <span style={styles.statusDitolak}>Ditolak</span>;
      case 'Belum Bayar':
        return <span style={styles.statusBelumBayar}>Belum Bayar</span>;
      default:
        return <span style={styles.statusDefault}>{status}</span>;
    }
  };

  // Setujui Pembayaran
  const handleSetujuiPembayaran = (order) => {
    setPesananList((prev) =>
      prev.map((item) => (item.id === order.id ? { ...item, status: 'Disetujui', alasanPenolakan: '' } : item))
    );
    setApprovingOrder(null);
    showToast('Pembayaran berhasil disetujui!', 'success');

    if (selectedDetail && selectedDetail.id === order.id) {
      setSelectedDetail((prev) => ({ ...prev, status: 'Disetujui', alasanPenolakan: '' }));
      if (autoCloseModalTimeoutRef.current) clearTimeout(autoCloseModalTimeoutRef.current);
      autoCloseModalTimeoutRef.current = setTimeout(() => {
        setSelectedDetail(null);
      }, 1500);
    }
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
    const orderId = rejectingOrder.id;
    const alasan = alasanTolak.trim();
    setPesananList((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, status: 'Ditolak', alasanPenolakan: alasan } : item
      )
    );
    setRejectingOrder(null);
    setAlasanTolak('');
    setAlasanError('');
    showToast('Pembayaran telah ditolak', 'error');

    if (selectedDetail && selectedDetail.id === orderId) {
      setSelectedDetail((prev) => ({ ...prev, status: 'Ditolak', alasanPenolakan: alasan }));
      if (autoCloseModalTimeoutRef.current) clearTimeout(autoCloseModalTimeoutRef.current);
      autoCloseModalTimeoutRef.current = setTimeout(() => {
        setSelectedDetail(null);
      }, 1500);
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
          {/* Notifikasi Toast */}
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
              onClick={() => setActiveTab('verifikasi')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'verifikasi' ? styles.tabButtonActive : {})
              }}
            >
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Pembayaran</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/status-pengiriman')}
              style={styles.tabButton}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Pengiriman</span>
            </button>
          </div>

          {/* Tab Pembayaran */}
          {activeTab === 'verifikasi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Card Statistik */}
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

              {/* Filter Bar */}
              <div style={styles.filterCard} className="filter-card-responsive">
                {/* Pencarian */}
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

                {/* Rentang Tanggal */}
                <div
                  style={{
                    ...styles.dateRangeWrapper,
                    boxShadow: isDateFocused
                      ? '0 0 0 3px rgba(35, 87, 60, 0.15)'
                      : isDateHovered
                        ? '0 0 0 3px rgba(35, 87, 60, 0.1)'
                        : 'none',
                    borderColor: '#23573c'
                  }}
                  onMouseEnter={() => setIsDateHovered(true)}
                  onMouseLeave={() => setIsDateHovered(false)}
                  onFocus={() => setIsDateFocused(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setIsDateFocused(false);
                    }
                  }}
                  className="date-range-responsive"
                >
                  <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                  <LaporanPengirimanDatePickerInput
                    value={startDate}
                    onChange={(val) => {
                      setStartDate(val);
                      setCurrentPage(1);
                    }}
                    onOpen={() => setIsDateFocused(true)}
                    onClose={() => setIsDateFocused(false)}
                  />
                  <span style={styles.dateSeparator}>s/d</span>
                  <LaporanPengirimanDatePickerInput
                    value={endDate}
                    onChange={(val) => {
                      setEndDate(val);
                      setCurrentPage(1);
                    }}
                    onOpen={() => setIsDateFocused(true)}
                    onClose={() => setIsDateFocused(false)}
                    alignRight={true}
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
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                    </button>
                  )}
                </div>

                <div style={styles.filterRight} className="filter-right-responsive">
                  {/* Dropdown Metode */}
                  <CustomDropdown
                    value={metodeFilter}
                    onChange={(val) => {
                      setMetodeFilter(val);
                      setCurrentPage(1);
                    }}
                    options={METODE_OPTIONS}
                    className="select-wrapper-responsive"
                    style={{ minWidth: '160px' }}
                  />

                  {/* Dropdown Status */}
                  <CustomDropdown
                    value={statusFilter}
                    onChange={(val) => {
                      setStatusFilter(val);
                      setCurrentPage(1);
                    }}
                    options={STATUS_OPTIONS}
                    className="select-wrapper-responsive"
                    style={{ minWidth: '170px' }}
                  />
                </div>
              </div>

              {/* Tabel */}
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
                              {renderStatusBadge(item.status)}
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

                  <div style={styles.paginationButtons}>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      style={{
                        ...styles.btnPageArrow,
                        opacity: currentPage === 1 ? 0.35 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                      className="btn-page-arrow"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCurrentPage(num)}
                        style={{
                          ...styles.btnPageNum,
                          ...(currentPage === num ? styles.btnPageNumActive : {})
                        }}
                        className={`btn-page-num ${currentPage === num ? 'active' : ''}`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      style={{
                        ...styles.btnPageArrow,
                        opacity: currentPage === totalPages ? 0.35 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                      className="btn-page-arrow"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Pengiriman */}
          {activeTab === 'pengiriman' && (
            <div style={styles.emptyTabContent} />
          )}
        </main>
      </div>

      {/* Modal Setujui */}
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

      {/* Modal Tolak */}
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

      {/* Modal Pratinjau Kuitansi */}
      {selectedKwitansi && (
        <div style={{ ...styles.modalOverlay, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.45)' }} onClick={() => setSelectedKwitansi(null)}>
          <div
            style={styles.kwitansiModalContainer}
            onClick={(e) => e.stopPropagation()}
            className="kwitansi-modal-wrapper"
          >
            {/* Action Bar (Download PDF) */}
            <div style={styles.kwitansiActionBar} className="no-print">
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a3e2b' }}>Pratinjau Kuitansi</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handlePrintKwitansi}
                  style={styles.btnDownloadPdf}
                >
                  <FileDownloadOutlinedIcon sx={{ fontSize: 19 }} />
                  <span>Unduh Kuitansi (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedKwitansi(null)}
                  style={styles.modalCloseBtn}
                >
                  <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>

            <div id="printable-kwitansi" style={styles.kwitansiPaper} className="printable-kwitansi-sheet">
              <div style={styles.kwitansiHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={logoRsq} alt="Logo RSQ" style={styles.kwitansiLogo} />
                  <div>
                    <div style={styles.kwitansiBrandName}>RUMAH SAHABAT QUR'AN</div>
                  </div>
                </div>
              </div>

              <div style={styles.kwitansiDivider} />

              <h2 style={styles.kwitansiTitle}>Kuitansi/Bukti Pembayaran</h2>
              <table style={styles.kwitansiMetaTable}>
                <tbody>
                  <tr>
                    <td style={styles.metaLabelCol}>Nomor</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {`KWT/${(selectedKwitansi.id || '').replace(/^ORD-/, '')}`}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Nama Pembeli</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {selectedKwitansi.namaPembeli}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Total Tagihan</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatRupiah(selectedKwitansi.totalBayar)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Tanggal Pemesanan</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(selectedKwitansi.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Tanggal Pembayaran</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(selectedKwitansi.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Pembayaran Terverifikasi</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(selectedKwitansi.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.metaLabelCol, verticalAlign: 'top' }}>Untuk Pembayaran</td>
                    <td style={{ ...styles.metaColonCol, verticalAlign: 'top' }}>:</td>
                    <td style={styles.metaValueCol}>
                      Pembayaran modul pembelajaran yang dipesan melalui Sistem Inventory RSQ dengan nomor pesanan {selectedKwitansi.id}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Diterbitkan Atas Nama */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '28px' }}>
                <div style={{ textAlign: 'left', minWidth: '220px' }}>
                  <div style={{ fontSize: '12.5px', color: '#334155' }}>Diterbitkan Atas Nama</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginTop: '3px' }}>
                    RUMAH SAHABAT QUR'AN
                  </div>
                  
                  {/* Ruang Tanda Tangan */}
                  <div style={{ height: '90px' }} />

                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textDecoration: 'underline' }}>
                    Ekowati
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Bendahara RSQ Pusat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-kwitansi, #printable-kwitansi * {
            visibility: visible !important;
          }
          #printable-kwitansi {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            z-index: 9999999 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Modal Detail */}
      {selectedDetail && (
        <div style={styles.modalOverlay} onClick={handleCloseDetailModal}>
          <div style={styles.modalContentDetail} className="modal-detail-responsive" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Detail Pesanan</h3>
              <button
                type="button"
                onClick={handleCloseDetailModal}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <div style={styles.detailBody}>
              {/* Metadata */}
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
                  <div style={{ marginTop: '2px' }}>
                    {renderStatusBadge(selectedDetail.status)}
                  </div>
                </div>
              </div>

              {/* Data Pembeli & Pengiriman */}
              <div style={styles.detailSection}>
                <div style={styles.detailSectionTitle}>Data Pembeli & Pengiriman</div>
                <div style={styles.detailRecipientGrid} className="modal-form-grid2">
                  <div>
                    <span style={styles.detailFieldLabel}>NAMA PEMBELI</span>
                    <div style={styles.detailFieldValue}>{selectedDetail.namaPembeli}</div>
                  </div>
                  <div>
                    <span style={styles.detailFieldLabel}>NO.HP</span>
                    <div style={styles.detailFieldValue}>{selectedDetail.noHp}</div>
                  </div>
                  {selectedDetail.metodePengiriman && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={styles.detailFieldLabel}>METODE PENGIRIMAN</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.metodePengiriman}</div>
                    </div>
                  )}
                  {selectedDetail.metodePengiriman === 'Titip ke Ustazah' && selectedDetail.ustazahNama && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={styles.detailFieldLabel}>NAMA USTAZAH</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.ustazahNama}</div>
                    </div>
                  )}
                  {selectedDetail.metodePengiriman === 'Ambil di RSQ Pusat' && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={styles.detailFieldLabel}>LOKASI PENGAMBILAN</span>
                      <div style={styles.detailFieldValue}>Kantor RSQ Pusat</div>
                    </div>
                  )}
                  {(!selectedDetail.metodePengiriman || selectedDetail.metodePengiriman === 'Via Kurir') && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={styles.detailFieldLabel}>ALAMAT PENGIRIMAN</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.alamat}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rincian Modul */}
              <div style={styles.detailSection}>
                <div style={styles.detailSectionTitle}>Rincian Modul</div>

                {/* Desktop */}
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
                      {selectedDetail.metodePengiriman === 'Via Kurir' ? (
                        <tr>
                          <td style={styles.detailTd}>Biaya Kurir</td>
                          <td style={{ ...styles.detailTd, textAlign: 'center' }}>-</td>
                          <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(ONGKIR_FLAT_KURIR)}</td>
                          <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                            {formatRupiah(ONGKIR_FLAT_KURIR)}
                          </td>
                        </tr>
                      ) : null}
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

                {/* Mobile */}
                <div className="rincian-modul-mobile">
                  {selectedDetail.itemModul.map((item, idx) => (
                    <div key={idx} style={styles.mobileItemCard}>
                      <div style={styles.mobileItemName}>{item.nama}</div>
                      <div style={styles.mobileItemBottom}>
                        <span style={styles.mobileItemQtyPrice}>
                          {item.qty} × {formatRupiah(item.harga)}
                        </span>
                        <span style={styles.mobileItemSubtotal}>
                          {formatRupiah(item.harga * item.qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {selectedDetail.metodePengiriman === 'Via Kurir' ? (
                    <div style={styles.mobileItemCard}>
                      <div style={styles.mobileItemName}>Biaya Kurir</div>
                      <div style={styles.mobileItemBottom}>
                        <span style={styles.mobileItemQtyPrice}>Ongkir Flat</span>
                        <span style={styles.mobileItemSubtotal}>
                          {formatRupiah(ONGKIR_FLAT_KURIR)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  <div style={styles.mobileTotalRow}>
                    <span style={styles.mobileTotalLabel}>Total:</span>
                    <span style={styles.mobileTotalValue}>
                      {formatRupiah(selectedDetail.totalBayar)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bukti Transfer Bank */}
              {selectedDetail.metodeBayar === 'Transfer Bank' &&
                selectedDetail.status !== 'Belum Bayar' && (
                  <div style={styles.detailSection}>
                    <div style={styles.detailSectionTitle}>Bukti Transfer Bank</div>
                    <div style={styles.detailReceiptWrapper}>
                      <img src={contohBuktiTf} alt="Bukti Transfer" style={styles.detailReceiptImg} />
                    </div>
                    {/* Alasan Ditolak */}
                    {selectedDetail.alasanPenolakan && (
                      <div style={styles.detailRejectAlert}>
                        <strong>Alasan Ditolak:</strong> {selectedDetail.alasanPenolakan}
                      </div>
                    )}
                  </div>
                )}

              {/* Alasan Ditolak */}
              {selectedDetail.metodeBayar !== 'Transfer Bank' && selectedDetail.alasanPenolakan && (
                <div style={styles.detailSection}>
                  <div style={styles.detailRejectAlert}>
                    <strong>Alasan Ditolak:</strong> {selectedDetail.alasanPenolakan}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={handleCloseDetailModal}
                style={styles.btnModalClose}
              >
                {selectedDetail.status === 'Menunggu Verifikasi' ? 'Batal' : 'Tutup'}
              </button>

              {selectedDetail.status === 'Disetujui' && (
                <button
                  type="button"
                  onClick={() => {
                    const detail = selectedDetail;
                    setSelectedDetail(null);
                    setSelectedKwitansi(detail);
                  }}
                  style={styles.btnModalKwitansi}
                >
                  <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />
                  <span>Lihat Kuitansi</span>
                </button>
              )}
              {/*
                </button>
              )}

              </button>

              */}{/* Tombol Aksi */}
              {selectedDetail.status === 'Menunggu Verifikasi' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenTolakModal(selectedDetail)}
                    style={styles.btnModalReject}
                  >
                    <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApprovingOrder(selectedDetail)}
                    style={styles.btnModalApprove}
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
    gridTemplateColumns: 'repeat(4, 1fr)',
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
    minWidth: '220px',
    transition: 'all 0.2s ease'
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
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
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
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
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
  statusMenunggu: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
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
  statusDisetujui: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
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
  statusDitolak: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    height: '28px',
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
  statusBelumBayar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
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
  statusDefault: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
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
    border: '1px solid #23573c',
    color: '#ffffff',
    fontWeight: '700',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)'
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
    fontWeight: '600',
    textAlign: 'left'
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
  btnTableKwitansi: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#e8f5ed',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    fontSize: '12.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnModalKwitansi: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(35, 87, 60, 0.25)'
  },
  kwitansiModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '95%',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden'
  },
  kwitansiActionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxSizing: 'border-box'
  },
  btnDownloadPdf: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(35, 87, 60, 0.25)',
    transition: 'background-color 0.2s ease'
  },
  kwitansiPaper: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 30px 28px',
    width: '100%',
    maxWidth: '560px',
    boxSizing: 'border-box',
    borderRadius: '0 0 16px 16px',
    boxShadow: 'none',
    overflowY: 'auto',
    fontFamily: "'Times New Roman', Times, serif, 'Poppins', sans-serif"
  },
  kwitansiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },
  kwitansiLogo: {
    width: '68px',
    height: '68px',
    objectFit: 'contain'
  },
  kwitansiBrandName: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1a3e2b',
    letterSpacing: '0.5px',
    fontFamily: "'Poppins', sans-serif"
  },
  kwitansiBrandSub: {
    fontSize: '11px',
    color: '#64748b',
    fontFamily: "'Poppins', sans-serif"
  },
  kwitansiDocType: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '1px'
  },
  kwitansiDocDate: {
    fontSize: '11.5px',
    color: '#64748b',
    marginTop: '2px'
  },
  kwitansiDivider: {
    height: '2px',
    backgroundColor: '#1a3e2b',
    margin: '14px 0 16px',
    width: '100%'
  },
  kwitansiTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
    textAlign: 'left'
  },
  kwitansiMetaTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#1e293b'
  },
  metaLabelCol: {
    width: '210px',
    color: '#475569',
    fontWeight: '500',
    padding: '3px 0'
  },
  metaColonCol: {
    width: '14px',
    color: '#475569',
    fontWeight: '600',
    padding: '3px 0',
    textAlign: 'center'
  },
  metaValueCol: {
    color: '#0f172a',
    padding: '3px 0'
  },
  kwitansiItemTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12.5px',
    marginTop: '4px'
  },
  kwitansiItemThRow: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #cbd5e1',
    borderBottom: '1px solid #cbd5e1'
  },
  kwitansiItemTh: {
    padding: '8px 10px',
    fontWeight: '700',
    color: '#334155',
    fontSize: '12px',
    textTransform: 'uppercase'
  },
  kwitansiItemTr: {
    borderBottom: '1px solid #e2e8f0'
  },
  kwitansiItemTd: {
    padding: '8px 10px',
    color: '#1e293b'
  },
  kwitansiGrandTotalLabel: {
    padding: '10px',
    fontWeight: '800',
    textAlign: 'right',
    color: '#0f172a',
    fontSize: '13px',
    borderTop: '2px solid #0f172a'
  },
  kwitansiGrandTotalValue: {
    padding: '10px',
    fontWeight: '800',
    textAlign: 'right',
    color: '#166534',
    fontSize: '14px',
    borderTop: '2px solid #0f172a'
  },
  kwitansiLunasBanner: {
    backgroundColor: '#f0fdf4',
    borderLeft: '4px solid #16a34a',
    padding: '12px 18px',
    borderRadius: '4px',
    margin: '18px 0',
    boxSizing: 'border-box'
  },
  kwitansiLunasNominal: {
    fontSize: '19px',
    fontWeight: '800',
    color: '#15803d',
    margin: '2px 0'
  },
  kwitansiLunasTerbilang: {
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#166534',
    fontWeight: '500'
  },
  kwitansiFooterSign: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: '22px',
    paddingTop: '10px'
  },
  kwitansiStampBox: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '6px 0'
  },
  kwitansiStampBadge: {
    border: '2px solid #16a34a',
    color: '#16a34a',
    padding: '4px 14px',
    borderRadius: '6px',
    transform: 'rotate(-5deg)',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.05)'
  },
  kwitansiBottomUrlRow: {
    marginTop: '36px',
    paddingTop: '8px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#94a3b8'
  },
  mobileTotalValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#166534'
  }
};
