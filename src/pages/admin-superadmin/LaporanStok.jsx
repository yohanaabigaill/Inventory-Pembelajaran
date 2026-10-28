import React, { useState, useRef, useEffect, useMemo } from 'react';
import XLSX from 'xlsx-js-style';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

// Jenis Laporan
const REPORT_TYPES = [
  { id: 'stok_card', label: '1. Stok Card', icon: AssessmentOutlinedIcon },
  { id: 'stok_balance', label: '2. Stok Balance', icon: Inventory2OutlinedIcon },
  { id: 'belum_dikirim', label: '3. Belum Dikirim', icon: PendingActionsOutlinedIcon },
  { id: 'sudah_dikirim', label: '4. Sudah Dikirim', icon: LocalShippingOutlinedIcon },
  { id: 'modul_masuk', label: '5. Modul Masuk', icon: ArrowDownwardOutlinedIcon },
  { id: 'modul_keluar', label: '6. Modul Keluar', icon: ArrowUpwardOutlinedIcon }
];

// Data 47 Modul
const MASTER_MODULS = [
  { id: 1, nama: 'Asasi', stokAwal: 200 },
  { id: 2, nama: 'Asasi 2', stokAwal: 280 },
  { id: 3, nama: 'Tahmidi', stokAwal: 15 },
  { id: 4, nama: 'Tawasuthi', stokAwal: 190 },
  { id: 5, nama: 'Idadi', stokAwal: 215 },
  { id: 6, nama: 'Tahsini', stokAwal: 180 },
  { id: 7, nama: 'Tajwidi', stokAwal: 180 },
  { id: 8, nama: 'Makhorijul Huruf', stokAwal: 160 },
  { id: 9, nama: 'Tilawah Asasi', stokAwal: 300 },
  { id: 10, nama: 'Buku Prestasi Dewasa', stokAwal: 310 },
  { id: 11, nama: 'Buku Prestasi Anak', stokAwal: 250 },
  { id: 12, nama: 'Anak 1', stokAwal: 120 },
  { id: 13, nama: 'Anak 2', stokAwal: 250 },
  { id: 14, nama: 'Anak 3', stokAwal: 230 },
  { id: 15, nama: 'Syarh Tuhfatul Athfal A4', stokAwal: 140 },
  { id: 16, nama: 'Syarh Tuhfatul Athfal A5', stokAwal: 195 },
  { id: 17, nama: 'Panduan Guru', stokAwal: 50 },
  { id: 18, nama: 'Al Hisan 1', stokAwal: 140 },
  { id: 19, nama: 'Al Hisan 2', stokAwal: 310 },
  { id: 20, nama: 'Al Hisan 3', stokAwal: 290 },
  { id: 21, nama: 'Al Hisan 4', stokAwal: 275 },
  { id: 22, nama: 'Kamus Juz 1', stokAwal: 180 },
  { id: 23, nama: 'Kamus 30 juz', stokAwal: 150 },
  { id: 24, nama: 'Khat', stokAwal: 90 },
  { id: 25, nama: 'Utsmani 1', stokAwal: 10 },
  { id: 26, nama: 'Utsmani 2', stokAwal: 210 },
  { id: 27, nama: 'Ustmani 3', stokAwal: 195 },
  { id: 28, nama: 'Buku Doa', stokAwal: 20 },
  { id: 29, nama: 'Buku Hadist', stokAwal: 350 },
  { id: 30, nama: 'Buku Prestasi', stokAwal: 410 },
  { id: 31, nama: 'Matan Jazariyah', stokAwal: 165 },
  { id: 32, nama: 'Mushaf Ash Shahib A5 Terjemah', stokAwal: 80 },
  { id: 33, nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokAwal: 190 },
  { id: 34, nama: 'Mushaf Al Kamil A5 Terjemah', stokAwal: 175 },
  { id: 35, nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokAwal: 160 },
  { id: 36, nama: 'Mushaf Ash Shahib A4 Terjemah', stokAwal: 130 },
  { id: 37, nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokAwal: 115 },
  { id: 38, nama: 'Mushaf Ash Shahib A6 Terjemah', stokAwal: 145 },
  { id: 39, nama: 'Mushaf Ash Shahib A6 tanpa Terjemah', stokAwal: 140 },
  { id: 40, nama: 'Mushaf Ash Shahib A5 Terjemah', stokAwal: 310 },
  { id: 41, nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokAwal: 280 },
  { id: 42, nama: 'Mushaf Al Kamil A5 Terjemah', stokAwal: 260 },
  { id: 43, nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokAwal: 240 },
  { id: 44, nama: 'Mushaf Ash Shahib A4 Terjemah', stokAwal: 185 },
  { id: 45, nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokAwal: 170 },
  { id: 46, nama: 'Mushaf Al Mujib A6 Terjemah', stokAwal: 195 },
  { id: 47, nama: 'Mushaf Al Kamil A6 tanpa Terjemah', stokAwal: 205 }
];

// Transaksi Mutasi Riwayat
const TRANSAKSI_MUTASI = [
  { tanggal: '2026-10-01', namaModul: 'Asasi', tipe: 'MASUK', qtyMasuk: 50, qtyKeluar: 0, keterangan: 'Pembelian' },
  { tanggal: '2026-10-02', namaModul: 'Tilawah Asasi', tipe: 'MASUK', qtyMasuk: 100, qtyKeluar: 0, keterangan: 'Pembelian' },
  { tanggal: '2026-10-03', namaModul: 'Tajwidi', tipe: 'MASUK', qtyMasuk: 60, qtyKeluar: 0, keterangan: 'Pembelian' },
  { tanggal: '2026-10-06', namaModul: 'Tilawah Asasi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 4, keterangan: 'Penjualan customer rian hidayat' },
  { tanggal: '2026-10-06', namaModul: 'Khat', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 2, keterangan: 'Penjualan customer rian hidayat' },
  { tanggal: '2026-10-07', namaModul: 'Buku Prestasi Anak', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 5, keterangan: 'Penjualan customer dewi lestari' },
  { tanggal: '2026-10-08', namaModul: 'Tajwidi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 1, keterangan: 'Penjualan customer farhan ramadhan' },
  { tanggal: '2026-10-09', namaModul: 'Khat', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 4, keterangan: 'Penjualan customer budi santoso' },
  { tanggal: '2026-10-10', namaModul: 'Mushaf Ash Shahib A5 Terjemah', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 8, keterangan: 'Penjualan customer ust. ridwan kamil' },
  { tanggal: '2026-10-10', namaModul: 'Panduan Guru', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 2, keterangan: 'Penjualan customer ust. ridwan kamil' },
  { tanggal: '2026-10-11', namaModul: 'Tahmidi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 4, keterangan: 'Penjualan customer hendra pratama' },
  { tanggal: '2026-10-12', namaModul: 'Buku Prestasi Anak', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 10, keterangan: 'Penjualan customer ririn anisa' },
  { tanggal: '2026-10-12', namaModul: 'Anak 1', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 10, keterangan: 'Penjualan customer ririn anisa' },
  { tanggal: '2026-10-12', namaModul: 'Tilawah Asasi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 5, keterangan: 'Penjualan customer yohana abigail' },
  { tanggal: '2026-10-12', namaModul: 'Tajwidi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 3, keterangan: 'Penjualan customer yohana abigail' },
  { tanggal: '2026-10-14', namaModul: 'Mushaf Ash Shahib A5 Terjemah', tipe: 'MASUK', qtyMasuk: 50, qtyKeluar: 0, keterangan: 'Pembelian' },
  { tanggal: '2026-10-15', namaModul: 'Al Hisan 1', tipe: 'MASUK', qtyMasuk: 40, qtyKeluar: 0, keterangan: 'Pembelian' },
  { tanggal: '2026-10-31', namaModul: 'Asasi', tipe: 'KELUAR', qtyMasuk: 0, qtyKeluar: 2, keterangan: 'Stok opname' }
];

// Data Pesanan Customer
const DATA_PESANAN_PENGIRIMAN = [
  {
    idPesanan: 'ORD-2026-001',
    tanggalPesan: '2026-10-12',
    tanggalKirim: '',
    namaPembeli: 'Yohana Abigail',
    metode: 'Via Kurir',
    alamat: 'Jl. Hang Kesturi, Nongsa',
    status: 'Belum dikirim',
    items: [
      { nama: 'Tilawah Asasi', qty: 5 },
      { nama: 'Tajwidi', qty: 3 }
    ]
  },
  {
    idPesanan: 'ORD-2026-002',
    tanggalPesan: '2026-10-12',
    tanggalKirim: '',
    namaPembeli: 'Ririn Anisa',
    metode: 'Ambil di RSQ Pusat',
    alamat: 'Kantor RSQ Pusat',
    status: 'Belum dikirim',
    items: [
      { nama: 'Buku Prestasi Anak', qty: 10 },
      { nama: 'Anak 1', qty: 10 }
    ]
  },
  {
    idPesanan: 'ORD-2026-003',
    tanggalPesan: '2026-10-11',
    tanggalKirim: '',
    namaPembeli: 'Hendra Pratama',
    metode: 'Titip ke Ustazah',
    alamat: 'Titip ke Ustazah Fatimah Azzahra',
    status: 'Belum dikirim',
    items: [
      { nama: 'Tahmidi', qty: 4 }
    ]
  },
  {
    idPesanan: 'ORD-2026-004',
    tanggalPesan: '2026-10-10',
    tanggalKirim: '2026-10-11',
    namaPembeli: 'Ust. Ridwan Kamil',
    metode: 'Via Kurir',
    alamat: 'Perumhan Taman Raya Blok B',
    status: 'Sudah dikirim',
    items: [
      { nama: 'Mushaf Ash Shahib A5 Terjemah', qty: 8 },
      { nama: 'Panduan Guru', qty: 2 }
    ]
  },
  {
    idPesanan: 'ORD-2026-005',
    tanggalPesan: '2026-10-09',
    tanggalKirim: '2026-10-12',
    namaPembeli: 'Budi Santoso',
    metode: 'Ambil di RSQ Pusat',
    alamat: 'Kantor RSQ Pusat',
    status: 'Sudah dikirim',
    items: [
      { nama: 'Khat', qty: 4 }
    ]
  },
  {
    idPesanan: 'ORD-2026-006',
    tanggalPesan: '2026-10-08',
    tanggalKirim: '2026-10-13',
    namaPembeli: 'Farhan Ramadhan',
    metode: 'Titip ke Ustazah',
    alamat: 'Titip ke Ustazah Maryam',
    status: 'Sudah dikirim',
    items: [
      { nama: 'Tajwidi', qty: 3 }
    ]
  },
  {
    idPesanan: 'ORD-2026-007',
    tanggalPesan: '2026-10-07',
    tanggalKirim: '2026-10-10',
    namaPembeli: 'Dewi Lestari',
    metode: 'Via Kurir',
    alamat: 'Jl. Antapani Raya No. 15',
    status: 'Sudah dikirim',
    items: [
      { nama: 'Buku Prestasi Anak', qty: 5 }
    ]
  },
  {
    idPesanan: 'ORD-2026-008',
    tanggalPesan: '2026-10-06',
    tanggalKirim: '2026-10-09',
    namaPembeli: 'Rian Hidayat',
    metode: 'Ambil di RSQ Pusat',
    alamat: 'Kantor RSQ Pusat',
    status: 'Sudah dikirim',
    items: [
      { nama: 'Tilawah Asasi', qty: 4 },
      { nama: 'Khat', qty: 2 }
    ]
  }
];

const INDO_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Format Tanggal (D/M/YYYY)
const formatTanggalSingkat = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

// Format Periode Banner
const formatPeriodeBanner = (startStr, endStr, isSingle) => {
  if (isSingle) {
    if (!startStr) return '';
    try {
      const [y, m, d] = startStr.split('-');
      return `Per Tanggal ${parseInt(d, 10)} ${INDO_MONTH_NAMES[parseInt(m, 10) - 1] || ''} ${y}`;
    } catch {
      return `Per Tanggal ${startStr}`;
    }
  }

  if (!startStr || !endStr) return '';
  try {
    const [y1, m1, d1] = startStr.split('-');
    const [y2, m2, d2] = endStr.split('-');

    if (m1 === m2 && y1 === y2) {
      return `Per Tanggal ${parseInt(d1, 10)} - ${parseInt(d2, 10)} ${INDO_MONTH_NAMES[parseInt(m1, 10) - 1] || ''} ${y1}`;
    }
    return `Per Tanggal ${parseInt(d1, 10)} ${INDO_MONTH_NAMES[parseInt(m1, 10) - 1] || ''} ${y1} - ${parseInt(d2, 10)} ${INDO_MONTH_NAMES[parseInt(m2, 10) - 1] || ''} ${y2}`;
  } catch {
    return `Per Tanggal ${startStr} s/d ${endStr}`;
  }
};

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

// Dropdown Filter Modul Multi-Select
function SearchableModulDropdown({ value, onChange, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const selectedValues = useMemo(() => {
    if (!value) return ['ALL'];
    if (Array.isArray(value)) {
      return value.length === 0 ? ['ALL'] : value;
    }
    return [value];
  }, [value]);

  const isAllSelected = selectedValues.includes('ALL') || selectedValues.length === 0;

  // Label tombol dropdown
  const displayLabel = useMemo(() => {
    if (isAllSelected) return 'Semua Modul';
    if (selectedValues.length === 1) {
      const opt = options.find((o) => o.value === selectedValues[0]);
      return opt ? opt.label : selectedValues[0];
    }
    return `${selectedValues.length} Modul Terpilih`;
  }, [isAllSelected, selectedValues, options]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const handleToggleItem = (val) => {
    if (val === 'ALL') {
      onChange(['ALL']);
      return;
    }

    let nextValues;
    if (isAllSelected) {
      nextValues = [val];
    } else {
      if (selectedValues.includes(val)) {
        nextValues = selectedValues.filter((v) => v !== val && v !== 'ALL');
        if (nextValues.length === 0) {
          nextValues = ['ALL'];
        }
      } else {
        nextValues = [...selectedValues.filter((v) => v !== 'ALL'), val];
      }
    }

    onChange(nextValues);
  };

  const handleTriggerClick = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setSearch('');
      }
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      className="laporan-dropdown-container"
      style={{ position: 'relative', userSelect: 'none' }}
    >
      <div
        onClick={handleTriggerClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          minHeight: '38px',
          height: '38px',
          padding: '0 12px',
          borderRadius: '10px',
          backgroundColor: '#f6faf7',
          border: '1px solid #23573c',
          boxSizing: 'border-box',
          boxShadow: isOpen ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          fontSize: '13px',
          fontWeight: '600',
          color: '#1a3e2b',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', minWidth: 0, flex: 1 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayLabel}
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
            flexShrink: 0
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
            minWidth: '240px',
            backgroundColor: '#ffffff',
            border: '1px solid #23573c',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Input Pencarian */}
          <div style={{ padding: '6px 8px', borderBottom: '1px solid #eef2ef', backgroundColor: '#ffffff' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari modul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12.5px',
                border: '1px solid #dce4de',
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                backgroundColor: '#f8faf9',
                color: '#1a3e2b'
              }}
            />
          </div>

          {/* Opsi Modul */}
          <div style={{ maxHeight: '230px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '10px 14px', fontSize: '13px', color: '#94a3b8' }}>
                Modul tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isItemAll = opt.value === 'ALL';
                const isSelected = isItemAll ? isAllSelected : selectedValues.includes(opt.value);

                return (
                  <div
                    key={opt.value}
                    onClick={() => handleToggleItem(opt.value)}
                    className={`laporan-modul-multiselect-item ${isSelected ? 'selected' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '9px 12px',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? '#1b4332' : '#1e293b',
                      backgroundColor: isSelected ? '#f2f8f4' : 'transparent',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: isSelected ? '1px solid #23573c' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#23573c' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected && (
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LaporanStok() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State Laporan & Filter
  const [selectedReport, setSelectedReport] = useState('stok_card');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [singleDate, setSingleDate] = useState('2026-10-31');
  const [selectedModulFilter, setSelectedModulFilter] = useState(['ALL']);

  // State Focus Filter Tanggal
  const [isDateFocused, setIsDateFocused] = useState(false);


  const isSingleDateReport = selectedReport === 'stok_balance';

  // Judul Header Banner
  const reportBannerTitle = useMemo(() => {
    switch (selectedReport) {
      case 'stok_card': return 'Laporan Stok Card';
      case 'stok_balance': return 'Laporan Stok Balance';
      case 'belum_dikirim': return 'Laporan Customer Belum Dikirim';
      case 'sudah_dikirim': return 'Laporan Customer Sudah Dikirim';
      case 'modul_masuk': return 'Laporan Modul Masuk';
      case 'modul_keluar': return 'Laporan Modul Keluar';
      default: return 'Laporan';
    }
  }, [selectedReport]);

  const reportBannerSubtitle = useMemo(() => {
    return formatPeriodeBanner(isSingleDateReport ? singleDate : startDate, endDate, isSingleDateReport);
  }, [startDate, endDate, singleDate, isSingleDateReport]);

  // Max width untuk tabel di web
  const reportMaxWidth = useMemo(() => {
    switch (selectedReport) {
      case 'stok_card': return '840px';
      case 'stok_balance': return '580px';
      case 'modul_masuk':
      case 'modul_keluar': return '750px';
      case 'sudah_dikirim':
      case 'belum_dikirim': return '1060px';
      default: return '100%';
    }
  }, [selectedReport]);

  // Options Dropdown Filter Modul
  const modulDropdownOptions = useMemo(() => {
    const list = [{ value: 'ALL', label: 'Semua Modul' }];
    MASTER_MODULS.forEach((m) => {
      list.push({ value: m.nama, label: m.nama });
    });
    return list;
  }, []);

  // 1. Data Stok Card
  const stokCardData = useMemo(() => {
    const targetModuls = MASTER_MODULS.filter((m) => {
      if (selectedModulFilter && selectedModulFilter.length > 0 && !selectedModulFilter.includes('ALL')) {
        return selectedModulFilter.includes(m.nama);
      }
      return true;
    });

    return targetModuls.map((m) => {
      const rawMutasi = TRANSAKSI_MUTASI.filter((t) => {
        const matchModul = t.namaModul === m.nama;
        const matchDate = (!startDate || t.tanggal >= startDate) && (!endDate || t.tanggal <= endDate);
        return matchModul && matchDate;
      }).sort((a, b) => (a.tanggal > b.tanggal ? 1 : -1));

      let runningSaldo = m.stokAwal;
      const historyRows = rawMutasi.map((t) => {
        const masuk = t.qtyMasuk > 0 ? t.qtyMasuk : null;
        const keluar = t.qtyKeluar > 0 ? t.qtyKeluar : null;
        runningSaldo = runningSaldo + (t.qtyMasuk || 0) - (t.qtyKeluar || 0);

        return {
          tanggal: t.tanggal,
          keterangan: t.keterangan,
          masuk,
          keluar,
          saldo: runningSaldo
        };
      });

      // Cek akhir bulan
      const isEndMonth = (() => {
        if (!endDate) return false;
        try {
          const [y, m, d] = endDate.split('-').map(Number);
          const lastDay = new Date(y, m, 0).getDate();
          return d >= lastDay;
        } catch {
          return false;
        }
      })();

      const hasStokOpname = historyRows.some(
        (r) => r.keterangan && r.keterangan.toLowerCase().includes('stok opname')
      );

      if (isEndMonth && !hasStokOpname) {
        historyRows.push({
          tanggal: endDate,
          keterangan: 'Stok opname',
          masuk: null,
          keluar: null,
          saldo: runningSaldo
        });
      }

      return {
        id: m.id,
        namaModul: m.nama,
        stokAwal: m.stokAwal,
        rows: historyRows
      };
    });
  }, [startDate, endDate, selectedModulFilter]);

  // 2. Data Stok Balance
  const stokBalanceData = useMemo(() => {
    const targetDate = singleDate || '2026-10-31';

    const targetModuls = MASTER_MODULS.filter((m) => {
      if (selectedModulFilter && selectedModulFilter.length > 0 && !selectedModulFilter.includes('ALL')) {
        return selectedModulFilter.includes(m.nama);
      }
      return true;
    });

    return targetModuls.map((m, idx) => {
      const mutasi = TRANSAKSI_MUTASI.filter((t) => t.namaModul === m.nama && t.tanggal <= targetDate);
      const totalMasuk = mutasi.reduce((acc, curr) => acc + curr.qtyMasuk, 0);
      const totalKeluar = mutasi.reduce((acc, curr) => acc + curr.qtyKeluar, 0);
      const stokAkhir = Math.max(0, m.stokAwal + totalMasuk - totalKeluar);

      return {
        no: idx + 1,
        id: m.id,
        namaModul: m.nama,
        stokAkhir
      };
    });
  }, [singleDate, selectedModulFilter]);

  // 3 & 4. Data Customer Sudah/Belum Dikirim
  const customerShippingData = useMemo(() => {
    const targetStatus = selectedReport === 'belum_dikirim' ? 'Belum dikirim' : 'Sudah dikirim';

    return DATA_PESANAN_PENGIRIMAN.filter((p) => {
      if (p.status !== targetStatus) return false;
      const refDate = selectedReport === 'belum_dikirim' ? p.tanggalPesan : (p.tanggalKirim || p.tanggalPesan);
      const matchDate = (!startDate || refDate >= startDate) && (!endDate || refDate <= endDate);
      return matchDate;
    }).map((order) => ({
      tanggal: selectedReport === 'belum_dikirim' ? order.tanggalPesan : (order.tanggalKirim || order.tanggalPesan),
      noPesanan: order.idPesanan,
      nama: order.namaPembeli,
      metode: order.metode,
      alamat: order.alamat,
      status: order.status,
      items: order.items
    }));
  }, [selectedReport, startDate, endDate]);

  // 5 & 6. Data Modul Masuk & Keluar
  const modulMutasiGroupedData = useMemo(() => {
    const isMasuk = selectedReport === 'modul_masuk';
    const targetType = isMasuk ? 'MASUK' : 'KELUAR';

    const targetModuls = MASTER_MODULS.filter((m) => {
      if (selectedModulFilter && selectedModulFilter.length > 0 && !selectedModulFilter.includes('ALL')) {
        return selectedModulFilter.includes(m.nama);
      }
      return true;
    });

    return targetModuls.map((m) => {
      const records = TRANSAKSI_MUTASI.filter((t) => {
        const matchModul = t.namaModul === m.nama;
        const matchType = t.tipe === targetType;
        const matchDate = (!startDate || t.tanggal >= startDate) && (!endDate || t.tanggal <= endDate);
        return matchModul && matchType && matchDate;
      }).sort((a, b) => (a.tanggal > b.tanggal ? 1 : -1));

      const totalJumlah = records.reduce((acc, curr) => acc + (isMasuk ? curr.qtyMasuk : curr.qtyKeluar), 0);

      return {
        id: m.id,
        namaModul: m.nama,
        rows: records.map((r) => ({
          tanggal: r.tanggal,
          keterangan: r.keterangan,
          jumlah: isMasuk ? r.qtyMasuk : r.qtyKeluar
        })),
        totalJumlah
      };
    });
  }, [selectedReport, startDate, endDate, selectedModulFilter]);

  // Ekspor Excel (.xlsx)
  const handleExportExcel = () => {
    let aoa = [];
    let fileName = '';
    let sheetName = reportBannerTitle.substring(0, 31);
    let colWidths = [];
    let merges = [];

    const thinBorder = {
      top: { style: 'thin', color: { rgb: 'CBD5E1' } },
      bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
      left: { style: 'thin', color: { rgb: 'CBD5E1' } },
      right: { style: 'thin', color: { rgb: 'CBD5E1' } }
    };

    const cellTitle = (v) => ({
      v: v ?? '',
      t: 's',
      s: {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { name: 'Calibri', sz: 13, bold: true, color: { rgb: '1A3E2B' } }
      }
    });

    const cellSubtitle = (v) => ({
      v: v ?? '',
      t: 's',
      s: {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { name: 'Calibri', sz: 10.5, bold: false, color: { rgb: '475569' } }
      }
    });

    const cellHeader = (v, align = 'center') => ({
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: {
        alignment: { horizontal: align, vertical: 'center', wrapText: true },
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '0F172A' } },
        border: thinBorder
      }
    });

    const cellCenter = (v, isBold = false) => ({
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { name: 'Calibri', sz: 11, bold: isBold, color: { rgb: '1E293B' } },
        border: thinBorder
      }
    });

    const cellLeft = (v, isBold = false) => ({
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: {
        alignment: { horizontal: 'left', vertical: 'center' },
        font: { name: 'Calibri', sz: 11, bold: isBold, color: { rgb: '1E293B' } },
        border: thinBorder
      }
    });

    const cellRight = (v, isBold = false) => ({
      v: v ?? '',
      t: typeof v === 'number' ? 'n' : 's',
      s: {
        alignment: { horizontal: 'right', vertical: 'center' },
        font: { name: 'Calibri', sz: 11, bold: isBold, color: { rgb: '1E293B' } },
        border: thinBorder
      }
    });

    const cellEmpty = () => ({
      v: '',
      t: 's',
      s: {
        alignment: { horizontal: 'center', vertical: 'center' },
        border: thinBorder
      }
    });

    // 1. STOK CARD
    if (selectedReport === 'stok_card') {
      fileName = `Laporan_Stok_Card_${startDate}_sd_${endDate}.xlsx`;

      aoa.push([cellTitle('Laporan Stok Card'), '', '', '', '']);
      aoa.push([cellSubtitle(reportBannerSubtitle), '', '', '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 4 } });

      stokCardData.forEach((modul) => {
        aoa.push([
          cellHeader('Tanggal', 'center'),
          cellHeader(modul.namaModul, 'left'),
          cellHeader('Masuk', 'center'),
          cellHeader('Keluar', 'center'),
          cellHeader('Saldo', 'center')
        ]);

        aoa.push([
          cellCenter(formatTanggalSingkat(startDate)),
          cellLeft('Stok awal', true),
          cellCenter(''),
          cellCenter(''),
          cellCenter(modul.stokAwal, true)
        ]);

        modul.rows.forEach((r) => {
          aoa.push([
            cellCenter(formatTanggalSingkat(r.tanggal)),
            cellLeft(r.keterangan),
            cellCenter(r.masuk !== null ? r.masuk : ''),
            cellCenter(r.keluar !== null ? r.keluar : ''),
            cellCenter(r.saldo)
          ]);
        });

        aoa.push([]);
      });

      colWidths = [{ wch: 15 }, { wch: 42 }, { wch: 10 }, { wch: 10 }, { wch: 14 }];
    }

    // 2. STOK BALANCE
    else if (selectedReport === 'stok_balance') {
      fileName = `Laporan_Stok_Balance_Per_${singleDate}.xlsx`;

      aoa.push([cellTitle('Laporan Stok Balance'), '', '']);
      aoa.push([cellSubtitle(reportBannerSubtitle), '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });

      aoa.push([
        cellHeader('No', 'center'),
        cellHeader('Nama Modul', 'left'),
        cellHeader('Jumlah', 'center')
      ]);

      stokBalanceData.forEach((r) => {
        aoa.push([
          cellCenter(r.no),
          cellLeft(r.namaModul),
          cellCenter(r.stokAkhir)
        ]);
      });

      colWidths = [{ wch: 8 }, { wch: 45 }, { wch: 16 }];
    }

    // 3 & 4. CUSTOMER SUDAH / BELUM DIKIRIM
    else if (selectedReport === 'sudah_dikirim' || selectedReport === 'belum_dikirim') {
      const isSudah = selectedReport === 'sudah_dikirim';
      const title = isSudah ? 'Laporan Customer Sudah Dikirim' : 'Laporan Customer Belum Dikirim';
      fileName = isSudah ? `Laporan_Customer_Sudah_Dikirim_${startDate}_sd_${endDate}.xlsx` : `Laporan_Customer_Belum_Dikirim_${startDate}_sd_${endDate}.xlsx`;

      aoa.push([cellTitle(title), '', '', '', '', '', '', '']);
      aoa.push([cellSubtitle(reportBannerSubtitle), '', '', '', '', '', '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } });

      const dateHeader = isSudah ? 'Tanggal Kirim' : 'Tanggal Pesan';
      aoa.push([
        cellHeader(dateHeader, 'center'),
        cellHeader('No Pesanan', 'center'),
        cellHeader('Nama', 'left'),
        cellHeader('Metode Pengiriman', 'left'),
        cellHeader('Pesanan', 'left'),
        cellHeader('Jumlah', 'center'),
        cellHeader('Alamat', 'left'),
        cellHeader('Status', 'center')
      ]);

      customerShippingData.forEach((order) => {
        const startRowIdx = aoa.length;
        const count = order.items.length;

        order.items.forEach((item, itemIdx) => {
          if (itemIdx === 0) {
            aoa.push([
              cellCenter(formatTanggalSingkat(order.tanggal)),
              cellCenter(order.noPesanan),
              cellLeft(order.nama),
              cellLeft(order.metode),
              cellLeft(item.nama),
              cellCenter(item.qty),
              cellLeft(order.alamat),
              cellCenter(order.status, false)
            ]);
          } else {
            aoa.push([
              cellEmpty(),
              cellEmpty(),
              cellEmpty(),
              cellEmpty(),
              cellLeft(item.nama),
              cellCenter(item.qty),
              cellEmpty(),
              cellEmpty()
            ]);
          }
        });

        if (count > 1) {
          const endRowIdx = startRowIdx + count - 1;
          merges.push({ s: { r: startRowIdx, c: 0 }, e: { r: endRowIdx, c: 0 } });
          merges.push({ s: { r: startRowIdx, c: 1 }, e: { r: endRowIdx, c: 1 } });
          merges.push({ s: { r: startRowIdx, c: 2 }, e: { r: endRowIdx, c: 2 } });
          merges.push({ s: { r: startRowIdx, c: 3 }, e: { r: endRowIdx, c: 3 } });
          merges.push({ s: { r: startRowIdx, c: 6 }, e: { r: endRowIdx, c: 6 } });
          merges.push({ s: { r: startRowIdx, c: 7 }, e: { r: endRowIdx, c: 7 } });
        }
      });

      colWidths = [{ wch: 15 }, { wch: 16 }, { wch: 22 }, { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 38 }, { wch: 16 }];
    }

    // 5 & 6. MODUL MASUK & MODUL KELUAR
    else if (selectedReport === 'modul_masuk' || selectedReport === 'modul_keluar') {
      const isMasuk = selectedReport === 'modul_masuk';
      const title = isMasuk ? 'Laporan Modul Masuk' : 'Laporan Modul Keluar';
      fileName = isMasuk ? `Laporan_Modul_Masuk_${startDate}_sd_${endDate}.xlsx` : `Laporan_Modul_Keluar_${startDate}_sd_${endDate}.xlsx`;

      aoa.push([cellTitle(title), '', '']);
      aoa.push([cellSubtitle(reportBannerSubtitle), '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });

      modulMutasiGroupedData.forEach((modul) => {
        const modulTitleRowIdx = aoa.length;
        aoa.push([cellHeader(modul.namaModul, 'left'), cellEmpty(), cellEmpty()]);
        merges.push({ s: { r: modulTitleRowIdx, c: 0 }, e: { r: modulTitleRowIdx, c: 2 } });

        aoa.push([
          cellHeader('Tanggal', 'center'),
          cellHeader('Keterangan', 'left'),
          cellHeader('Jumlah', 'center')
        ]);

        if (modul.rows.length === 0) {
          aoa.push([cellCenter('-'), cellCenter('-'), cellCenter(0)]);
        } else {
          modul.rows.forEach((r) => {
            aoa.push([
              cellCenter(formatTanggalSingkat(r.tanggal)),
              cellLeft(r.keterangan),
              cellCenter(r.jumlah)
            ]);
          });
        }

        const totalRowIdx = aoa.length;
        aoa.push([
          cellRight('Total', false),
          cellEmpty(),
          cellCenter(modul.totalJumlah, false)
        ]);
        merges.push({ s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: 1 } });

        aoa.push([]);
      });

      colWidths = [{ wch: 16 }, { wch: 38 }, { wch: 14 }];
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = merges;
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={styles.layoutContainer}>
      <Sidebar
        activeMenu="Laporan Stok"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title="Laporan Stok"
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div style={styles.contentArea} className="content-body-responsive">
          {/* Jenis Laporan (Card Statistik) */}
          <div style={styles.statsGrid} className="stats-grid-responsive">
            {REPORT_TYPES.map((type) => {
              const isSelected = selectedReport === type.id;
              const IconComp = type.icon;

              return (
                <div
                  key={type.id}
                  onClick={() => {
                    setSelectedReport(type.id);
                    setSelectedModulFilter(['ALL']);
                    setStartDate('2026-10-01');
                    setEndDate('2026-10-31');
                    setSingleDate('2026-10-31');
                  }}
                  className="stat-card-responsive"
                  style={{
                    ...styles.statCard,
                    borderLeft: '4px solid #23573c',
                    backgroundColor: '#ffffff',
                    boxShadow: isSelected
                      ? '0 0 0 2px #23573c, 0 4px 12px rgba(35, 87, 60, 0.08)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={styles.statIconWrapper}>
                    <IconComp sx={{ fontSize: 24, color: '#23573c' }} />
                  </div>
                  <div style={styles.cardTitleText}>{type.label}</div>
                </div>
              );
            })}
          </div>

          {/* Toolbar Filter */}
          <div style={styles.toolbarCard} className="laporan-toolbar-card">
            <div style={styles.toolbarFlex} className="laporan-toolbar-flex">
              {/* Filter Tanggal */}
              <div style={styles.dateFilterContainer} className="laporan-date-container">
                {isSingleDateReport ? (
                  <div
                    className="laporan-date-box"
                    style={{
                      ...styles.dateRangeWrapper,
                      boxShadow: isDateFocused ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                    <LaporanPengirimanDatePickerInput
                      value={singleDate}
                      onChange={(val) => setSingleDate(val)}
                      onOpen={() => setIsDateFocused(true)}
                      onClose={() => setIsDateFocused(false)}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                ) : (
                  <div
                    className="laporan-date-box"
                    style={{
                      ...styles.dateRangeWrapper,
                      boxShadow: isDateFocused ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                    <LaporanPengirimanDatePickerInput
                      value={startDate}
                      onChange={(val) => setStartDate(val)}
                      onOpen={() => setIsDateFocused(true)}
                      onClose={() => setIsDateFocused(false)}
                      alignRight={false}
                      placeholder="dd/mm/yyyy"
                    />
                    <span style={styles.dateSeparator}>s/d</span>
                    <LaporanPengirimanDatePickerInput
                      value={endDate}
                      onChange={(val) => setEndDate(val)}
                      onOpen={() => setIsDateFocused(true)}
                      onClose={() => setIsDateFocused(false)}
                      alignRight={true}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                )}
              </div>

              {/* Filter Modul */}
              {(selectedReport === 'stok_card' || selectedReport === 'modul_masuk' || selectedReport === 'modul_keluar') && (
                <div style={styles.modulFilterWrapper} className="laporan-modul-filter-wrapper">
                  <SearchableModulDropdown
                    value={selectedModulFilter}
                    onChange={(val) => setSelectedModulFilter(val)}
                    options={modulDropdownOptions}
                  />
                </div>
              )}

              {/* Unduh Excel */}
              <div className="laporan-export-wrapper" style={{ marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="laporan-export-btn"
                  style={styles.btnExportExcel}
                >
                  <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tampilan Tabel */}
          <div style={styles.tableCard} className="laporan-table-card">
            {/* Banner Header */}
            <div style={{ ...styles.pdfBannerBox, maxWidth: reportMaxWidth }} className="laporan-banner-box">
              <div style={styles.pdfBannerTitle} className="laporan-banner-title">{reportBannerTitle}</div>
              <div style={styles.pdfBannerSubtitle} className="laporan-banner-subtitle">{reportBannerSubtitle}</div>
            </div>

            <div style={styles.tableResponsive} className="laporan-table-responsive">
              {/* 1. Stok Card */}
              {selectedReport === 'stok_card' && (
                <div className="laporan-table-content" style={{ padding: '0 20px 20px 20px' }}>
                  {stokCardData.length === 0 ? (
                    <div style={styles.emptyState}>Tidak ada data modul yang sesuai.</div>
                  ) : (
                    <>
                      {stokCardData.map((modul) => (
                        <div key={modul.id} style={{ ...styles.modulCardTableWrapper, maxWidth: reportMaxWidth, margin: '0 auto 24px auto' }}>
                          <table style={styles.pdfTable} className="laporan-pdf-table table-stok-card">
                            <thead>
                              <tr style={styles.pdfThRow}>
                                <th style={{ ...styles.pdfTh, width: '16%', textAlign: 'center' }} className="th-stok-tanggal">Tanggal</th>
                                <th style={{ ...styles.pdfTh, width: '42%' }} className="th-stok-nama">{modul.namaModul}</th>
                                <th style={{ ...styles.pdfTh, width: '14%', textAlign: 'center' }} className="th-stok-m">Masuk</th>
                                <th style={{ ...styles.pdfTh, width: '14%', textAlign: 'center' }} className="th-stok-k">Keluar</th>
                                <th style={{ ...styles.pdfTh, width: '14%', textAlign: 'center' }} className="th-stok-saldo">Saldo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Stok Awal */}
                              <tr style={styles.pdfTr}>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-stok-tanggal">{formatTanggalSingkat(startDate)}</td>
                                <td style={{ ...styles.pdfTd, fontWeight: '600' }} className="td-stok-nama">Stok awal</td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-stok-m"></td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-stok-k"></td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-stok-saldo">{modul.stokAwal}</td>
                              </tr>
                              {/* Riwayat Mutasi */}
                              {modul.rows.map((row, rIdx) => (
                                <tr key={rIdx} style={styles.pdfTr}>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-stok-tanggal">{formatTanggalSingkat(row.tanggal)}</td>
                                  <td style={styles.pdfTd} className="td-stok-nama">{row.keterangan}</td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-stok-m">
                                    {row.masuk || ''}
                                  </td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-stok-k">
                                    {row.keluar || ''}
                                  </td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-stok-saldo">{row.saldo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* 2. Stok Balance */}
              {selectedReport === 'stok_balance' && (
                <div className="laporan-table-content" style={{ padding: '0 20px 20px 20px' }}>
                  <table style={{ ...styles.pdfTable, maxWidth: reportMaxWidth, margin: '0 auto' }} className="laporan-pdf-table table-stok-balance">
                    <thead>
                      <tr style={styles.pdfThRow}>
                        <th style={{ ...styles.pdfTh, width: '10%', textAlign: 'center' }} className="th-balance-no">No</th>
                        <th style={{ ...styles.pdfTh, width: '68%' }} className="th-balance-nama">Nama Modul</th>
                        <th style={{ ...styles.pdfTh, width: '22%', textAlign: 'center' }} className="th-balance-jumlah">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stokBalanceData.length === 0 ? (
                        <tr>
                          <td colSpan={3} style={styles.emptyState}>Tidak ada data stok modul.</td>
                        </tr>
                      ) : (
                        stokBalanceData.map((row) => (
                          <tr key={row.id} style={styles.pdfTr}>
                            <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-balance-no">{row.no}</td>
                            <td style={styles.pdfTd} className="td-balance-nama">{row.namaModul}</td>
                            <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-balance-jumlah">
                              {row.stokAkhir}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3 & 4. Customer Sudah/Belum Dikirim */}
              {(selectedReport === 'sudah_dikirim' || selectedReport === 'belum_dikirim') && (
                <div className="laporan-table-content" style={{ padding: '0 20px 24px 20px' }}>
                  {/* Desktop Table */}
                  <div className="laporan-customer-desktop-table" style={{ maxWidth: reportMaxWidth, margin: '0 auto' }}>
                    <table style={styles.pdfTable} className="laporan-pdf-table">
                      <thead>
                        <tr style={styles.pdfThRow}>
                          <th style={{ ...styles.pdfTh, width: '11%', textAlign: 'center' }}>
                            {selectedReport === 'sudah_dikirim' ? 'Tanggal Kirim' : 'Tanggal Pesan'}
                          </th>
                          <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>No Pesanan</th>
                          <th style={{ ...styles.pdfTh, width: '15%' }}>Nama</th>
                          <th style={{ ...styles.pdfTh, width: '14%' }}>Metode Pengiriman</th>
                          <th style={{ ...styles.pdfTh, width: '16%' }}>Pesanan</th>
                          <th style={{ ...styles.pdfTh, width: '6%', textAlign: 'center' }}>Jumlah</th>
                          <th style={{ ...styles.pdfTh, width: '14%' }}>Alamat</th>
                          <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center', minWidth: '105px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerShippingData.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={styles.emptyState}>
                              Tidak ada data customer {selectedReport === 'sudah_dikirim' ? 'sudah dikirim' : 'belum dikirim'} pada periode ini.
                            </td>
                          </tr>
                        ) : (
                          customerShippingData.map((order) => {
                            const rowSpan = order.items.length;

                            return order.items.map((item, itemIdx) => {
                              const isFirstItem = itemIdx === 0;

                              return (
                                <tr key={`${order.noPesanan}-${itemIdx}`} style={styles.pdfTr}>
                                  {isFirstItem && (
                                    <>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          textAlign: 'center',
                                          verticalAlign: 'middle'
                                        }}
                                      >
                                        {formatTanggalSingkat(order.tanggal)}
                                      </td>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          textAlign: 'center',
                                          verticalAlign: 'middle'
                                        }}
                                      >
                                        {order.noPesanan}
                                      </td>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          verticalAlign: 'middle'
                                        }}
                                      >
                                        {order.nama}
                                      </td>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          verticalAlign: 'middle'
                                        }}
                                      >
                                        {order.metode}
                                      </td>
                                    </>
                                  )}

                                  {/* Pesanan & Qty */}
                                  <td style={styles.pdfTd}>
                                    {item.nama}
                                  </td>
                                  <td
                                    style={{
                                      ...styles.pdfTd,
                                      textAlign: 'center'
                                    }}
                                  >
                                    {item.qty}
                                  </td>

                                  {isFirstItem && (
                                    <>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          verticalAlign: 'middle'
                                        }}
                                      >
                                        {order.alamat}
                                      </td>
                                      <td
                                        rowSpan={rowSpan}
                                        style={{
                                          ...styles.pdfTd,
                                          textAlign: 'center',
                                          verticalAlign: 'middle',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        <span style={order.status === 'Sudah dikirim' ? styles.statusPillGreen : styles.statusPillYellow}>
                                          {order.status}
                                        </span>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            });
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Responsive Mobile Card */}
                  <div className="laporan-customer-mobile-cards">
                    {customerShippingData.length === 0 ? (
                      <div style={styles.emptyState}>
                        Tidak ada data customer {selectedReport === 'sudah_dikirim' ? 'sudah dikirim' : 'belum dikirim'} pada periode ini.
                      </div>
                    ) : (
                      customerShippingData.map((order) => (
                        <div key={order.noPesanan} className="laporan-order-card-item">
                          <div className="laporan-order-card-header">
                            <div>
                              <span className="laporan-order-no">{order.noPesanan}</span>
                              <span className="laporan-order-date"> • {formatTanggalSingkat(order.tanggal)}</span>
                            </div>
                            <span style={order.status === 'Sudah dikirim' ? styles.statusPillGreen : styles.statusPillYellow}>
                              {order.status}
                            </span>
                          </div>

                          <div className="laporan-order-card-body">
                            <div className="laporan-order-name">{order.nama}</div>
                            <div className="laporan-order-method">{order.metode}</div>
                            <div className="laporan-order-address">{order.alamat}</div>

                            <div className="laporan-order-items-wrapper">
                              <div className="laporan-order-items-title">Pesanan:</div>
                              {order.items.map((it, idx) => (
                                  <div key={idx} className="laporan-order-item-row">
                                    <span className="laporan-order-item-nama">{it.nama}</span>
                                    <span className="laporan-order-item-qty">{it.qty}</span>
                                  </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5 & 6. Modul Masuk & Keluar */}
              {(selectedReport === 'modul_masuk' || selectedReport === 'modul_keluar') && (
                <div className="laporan-table-content" style={{ padding: '0 20px 24px 20px' }}>
                  {modulMutasiGroupedData.length === 0 ? (
                    <div style={styles.emptyState}>Tidak ada data modul yang sesuai.</div>
                  ) : (
                    <>
                      {modulMutasiGroupedData.map((modul) => (
                        <div key={modul.id} style={{ ...styles.modulCardTableWrapper, maxWidth: reportMaxWidth, margin: '0 auto 24px auto' }}>
                          {/* Nama Modul */}
                          <div style={styles.modulSectionHeader}>
                            {modul.namaModul}
                          </div>

                          <table style={styles.pdfTable} className="laporan-pdf-table table-modul-mutasi">
                            <thead>
                              <tr style={styles.pdfThRow}>
                                <th style={{ ...styles.pdfTh, width: '22%', textAlign: 'center' }} className="th-mutasi-tanggal">Tanggal</th>
                                <th style={{ ...styles.pdfTh, width: '58%' }} className="th-mutasi-keterangan">Keterangan</th>
                                <th style={{ ...styles.pdfTh, width: '20%', textAlign: 'center' }} className="th-mutasi-jumlah">Jumlah</th>
                              </tr>
                            </thead>
                            <tbody>
                              {modul.rows.length === 0 ? (
                                <tr style={styles.pdfTr}>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', color: '#64748b' }} className="td-mutasi-tanggal">-</td>
                                  <td style={{ ...styles.pdfTd, color: '#64748b' }} className="td-mutasi-keterangan">-</td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-mutasi-jumlah">0</td>
                                </tr>
                              ) : (
                                modul.rows.map((row, rIdx) => (
                                  <tr key={rIdx} style={styles.pdfTr}>
                                    <td style={{ ...styles.pdfTd, textAlign: 'center' }} className="td-mutasi-tanggal">{formatTanggalSingkat(row.tanggal)}</td>
                                    <td style={styles.pdfTd} className="td-mutasi-keterangan">{row.keterangan}</td>
                                    <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }} className="td-mutasi-jumlah">{row.jumlah}</td>
                                  </tr>
                                ))
                              )}
                              {/* Total */}
                              <tr style={styles.totalRow}>
                                <td
                                  colSpan={2}
                                  className="td-mutasi-total-label"
                                  style={{
                                    ...styles.pdfTd,
                                    fontWeight: '700',
                                    textAlign: 'right',
                                    paddingRight: '20px'
                                  }}
                                >
                                  Total
                                </td>
                                <td
                                  className="td-mutasi-total-val"
                                  style={{
                                    ...styles.pdfTd,
                                    textAlign: 'center',
                                    fontWeight: '700'
                                  }}
                                >
                                  {modul.totalJumlah}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif'
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  contentArea: {
    padding: '24px',
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    marginBottom: '20px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #eef2ef',
    borderLeft: '4px solid #23573c',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    boxSizing: 'border-box'
  },
  statIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#e8f5ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardTitleText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a3e2b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  toolbarCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '14px 20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  },
  toolbarFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap'
  },
  dateFilterContainer: {
    display: 'flex',
    alignItems: 'center'
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
    transition: 'all 0.2s ease',
    minHeight: '38px',
    height: '38px'
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
    padding: 0,
    fontWeight: '500'
  },
  dateSeparator: {
    fontSize: '12px',
    color: '#23573c',
    fontWeight: '600',
    userSelect: 'none'
  },
  modulFilterWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  btnExportExcel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    minHeight: '38px',
    height: '38px'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    overflow: 'hidden'
  },
  pdfBannerBox: {
    backgroundColor: '#c6efce',
    border: '1px solid #b2dfbb',
    borderRadius: '8px',
    padding: '12px 18px',
    margin: '20px auto 18px auto',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  pdfBannerTitle: {
    fontSize: '15.5px',
    fontWeight: '800',
    color: '#006100',
    marginBottom: '4px',
    letterSpacing: '0.01em'
  },
  pdfBannerSubtitle: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#006100'
  },
  modulCardTableWrapper: {
    marginBottom: '24px'
  },
  modulSectionHeader: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '5px 12px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '8px'
  },
  tableResponsive: {
    overflowX: 'auto',
    width: '100%',
    WebkitOverflowScrolling: 'touch'
  },
  pdfTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '12.5px',
    border: '1px solid #94a3b8'
  },
  pdfThRow: {
    backgroundColor: '#f1f5f9'
  },
  pdfTh: {
    border: '1px solid #94a3b8',
    padding: '7px 10px',
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#0f172a',
    whiteSpace: 'nowrap'
  },
  pdfTr: {
    backgroundColor: '#ffffff'
  },
  pdfTd: {
    border: '1px solid #94a3b8',
    padding: '6px 10px',
    fontSize: '12px',
    color: '#1e293b',
    verticalAlign: 'middle'
  },
  totalRow: {
    backgroundColor: '#f8fafc'
  },
  statusPillGreen: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    border: '1px solid #16a34a',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusPillYellow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    border: '1px solid #d97706',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  emptyState: {
    textAlign: 'center',
    padding: '36px 20px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500'
  }
};
