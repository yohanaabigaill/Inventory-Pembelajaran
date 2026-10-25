import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
  { id: 40, nama: 'Mushaf Ash Shahib A5 Terjemah (Reguler)', stokAwal: 310 },
  { id: 41, nama: 'Mushaf Ash Shahib A5 tanpa Terjemah (Reguler)', stokAwal: 280 },
  { id: 42, nama: 'Mushaf Al Kamil A5 Terjemah (Reguler)', stokAwal: 260 },
  { id: 43, nama: 'Mushaf Al Kamil A5 tanpa Terjemah (Reguler)', stokAwal: 240 },
  { id: 44, nama: 'Mushaf Ash Shahib A4 Terjemah (Reguler)', stokAwal: 185 },
  { id: 45, nama: 'Mushaf Ash Shahib A4 tanpa Terjemah (Reguler)', stokAwal: 170 },
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
    alamat: 'Titip ke Ustazah Fatimah Azzahra (Kavling Baru)',
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
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (isSingle) {
    if (!startStr) return '';
    try {
      const [y, m, d] = startStr.split('-');
      return `Per Tanggal ${parseInt(d, 10)} ${monthNames[parseInt(m, 10) - 1] || ''} ${y}`;
    } catch {
      return `Per Tanggal ${startStr}`;
    }
  }

  if (!startStr || !endStr) return '';
  try {
    const [y1, m1, d1] = startStr.split('-');
    const [y2, m2, d2] = endStr.split('-');

    if (m1 === m2 && y1 === y2) {
      return `Per Tanggal ${parseInt(d1, 10)} - ${parseInt(d2, 10)} ${monthNames[parseInt(m1, 10) - 1] || ''} ${y1}`;
    }
    return `Per Tanggal ${parseInt(d1, 10)} ${monthNames[parseInt(m1, 10) - 1] || ''} ${y1} - ${parseInt(d2, 10)} ${monthNames[parseInt(m2, 10) - 1] || ''} ${y2}`;
  } catch {
    return `Per Tanggal ${startStr} s/d ${endStr}`;
  }
};

// Dropdown Filter Modul
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

  const selectedOpt = options.find((o) => o.value === value);
  const displayLabel = selectedOpt ? selectedOpt.label : 'Semua Modul';

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
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
    <div ref={containerRef} style={{ position: 'relative', userSelect: 'none', minWidth: '170px' }}>
      <div
        onClick={handleTriggerClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          minHeight: '38px',
          height: '38px',
          padding: '0 14px',
          borderRadius: '10px',
          backgroundColor: '#f6faf7',
          border: '1px solid #23573c',
          boxSizing: 'border-box',
          boxShadow: isOpen ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          fontSize: '13.5px',
          fontWeight: '600',
          color: '#1a3e2b'
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
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Input Pencarian */}
          <div style={{ padding: '6px 8px', borderBottom: '1px solid #eef2ef', backgroundColor: '#f8faf9' }}>
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
                backgroundColor: '#ffffff',
                color: '#1a3e2b'
              }}
            />
          </div>

          {/* Opsi Modul */}
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '10px 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                Modul tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;

                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="custom-dropdown-item"
                    style={{
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? '#ffffff' : '#1e293b',
                      backgroundColor: isSelected ? '#23573c' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, color 0.15s ease'
                    }}
                  >
                    {opt.label}
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
  const [selectedModulFilter, setSelectedModulFilter] = useState('ALL');

  // State Focus Filter Tanggal
  const [isDateFocused, setIsDateFocused] = useState(false);

  // State Pagination
  const [currentModulPage, setCurrentModulPage] = useState(1);
  const itemsPerPage = 5;
  const itemsPerPageBalance = 10;

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
      if (selectedModulFilter !== 'ALL' && m.nama !== selectedModulFilter) return false;
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

  // Pagination Stok Card
  const totalModulPages = Math.ceil(stokCardData.length / itemsPerPage) || 1;
  const paginatedStokCard = useMemo(() => {
    const start = (currentModulPage - 1) * itemsPerPage;
    return stokCardData.slice(start, start + itemsPerPage);
  }, [stokCardData, currentModulPage, itemsPerPage]);

  // 2. Data Stok Balance
  const stokBalanceData = useMemo(() => {
    const targetDate = singleDate || '2026-10-31';

    const targetModuls = MASTER_MODULS.filter((m) => {
      if (selectedModulFilter !== 'ALL' && m.nama !== selectedModulFilter) return false;
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

  // Pagination Stok Balance
  const totalBalancePages = Math.ceil(stokBalanceData.length / itemsPerPageBalance) || 1;
  const paginatedStokBalance = useMemo(() => {
    const start = (currentModulPage - 1) * itemsPerPageBalance;
    return stokBalanceData.slice(start, start + itemsPerPageBalance);
  }, [stokBalanceData, currentModulPage, itemsPerPageBalance]);

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
      if (selectedModulFilter !== 'ALL' && m.nama !== selectedModulFilter) return false;
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

  // Pagination Modul 
  const totalMutasiPages = Math.ceil(modulMutasiGroupedData.length / itemsPerPage) || 1;
  const paginatedModulMutasi = useMemo(() => {
    const start = (currentModulPage - 1) * itemsPerPage;
    return modulMutasiGroupedData.slice(start, start + itemsPerPage);
  }, [modulMutasiGroupedData, currentModulPage, itemsPerPage]);

  // Ekspor Excel (.xlsx)
  const handleExportExcel = () => {
    let aoa = [];
    let fileName = '';
    let sheetName = reportBannerTitle.substring(0, 31);
    let colWidths = [];
    let merges = [];

    // 1. STOK CARD
    if (selectedReport === 'stok_card') {
      fileName = `Laporan_Stok_Card_${startDate}_sd_${endDate}.xlsx`;
      
      aoa.push(['', '', 'Laporan Stok Card', '', '']);
      aoa.push(['', '', `Per Tanggal ${formatPeriodeBanner(startDate, endDate, false).replace('Per Tanggal ', '')}`, '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 1 }, e: { r: 0, c: 3 } });
      merges.push({ s: { r: 1, c: 1 }, e: { r: 1, c: 3 } });

      stokCardData.forEach((modul) => {
        aoa.push(['Tanggal', modul.namaModul, 'M', 'K', 'Saldo']);
        aoa.push([formatTanggalSingkat(startDate), 'Stok awal', '', '', modul.stokAwal]);

        modul.rows.forEach((r) => {
          aoa.push([
            formatTanggalSingkat(r.tanggal),
            r.keterangan,
            r.masuk !== null ? r.masuk : '',
            r.keluar !== null ? r.keluar : '',
            r.saldo
          ]);
        });

        aoa.push([]);
      });

      colWidths = [{ wch: 15 }, { wch: 42 }, { wch: 8 }, { wch: 8 }, { wch: 12 }];
    }

    // 2. STOK BALANCE
    else if (selectedReport === 'stok_balance') {
      fileName = `Laporan_Stok_Balance_Per_${singleDate}.xlsx`;

      aoa.push(['', 'Laporan Stok Balance', '']);
      aoa.push(['', formatPeriodeBanner(singleDate, '', true), '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });

      aoa.push(['No', 'Nama Modul', 'Jumlah']);
      stokBalanceData.forEach((r) => {
        aoa.push([
          r.no,
          r.namaModul,
          r.stokAkhir
        ]);
      });

      colWidths = [{ wch: 8 }, { wch: 40 }, { wch: 14 }];
    }

    // 3 & 4. CUSTOMER SUDAH / BELUM DIKIRIM
    else if (selectedReport === 'sudah_dikirim' || selectedReport === 'belum_dikirim') {
      const isSudah = selectedReport === 'sudah_dikirim';
      const title = isSudah ? 'Laporan Customer Sudah Dikirim' : 'Laporan Customer Belum Dikirim';
      fileName = isSudah ? `Laporan_Customer_Sudah_Dikirim_${startDate}_sd_${endDate}.xlsx` : `Laporan_Customer_Belum_Dikirim_${startDate}_sd_${endDate}.xlsx`;

      aoa.push(['', '', '', title, '', '', '', '']);
      aoa.push(['', '', '', formatPeriodeBanner(startDate, endDate, false), '', '', '', '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 2 }, e: { r: 0, c: 5 } });
      merges.push({ s: { r: 1, c: 2 }, e: { r: 1, c: 5 } });

      const dateHeader = isSudah ? 'Tanggal Kirim' : 'Tanggal Pesan';
      aoa.push([dateHeader, 'No Pesanan', 'Nama', 'Metode Pengiriman', 'Pesanan', 'Jumlah', 'Alamat', 'Status']);

      customerShippingData.forEach((order) => {
        const startRowIdx = aoa.length;
        const count = order.items.length;

        order.items.forEach((item, itemIdx) => {
          if (itemIdx === 0) {
            aoa.push([
              formatTanggalSingkat(order.tanggal),
              order.noPesanan,
              order.nama,
              order.metode,
              item.nama,
              item.qty,
              order.alamat,
              order.status
            ]);
          } else {
            aoa.push([
              '',
              '',
              '',
              '',
              item.nama,
              item.qty,
              '',
              ''
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

      aoa.push(['', title, '']);
      aoa.push(['', formatPeriodeBanner(startDate, endDate, false), '']);
      aoa.push([]);

      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } });
      merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });

      modulMutasiGroupedData.forEach((modul) => {
        const modulTitleRowIdx = aoa.length;
        aoa.push([modul.namaModul, '', '']);
        merges.push({ s: { r: modulTitleRowIdx, c: 0 }, e: { r: modulTitleRowIdx, c: 2 } });

        aoa.push(['Tanggal', 'Keterangan', 'Jumlah']);

        if (modul.rows.length === 0) {
          aoa.push(['-', '-', 0]);
        } else {
          modul.rows.forEach((r) => {
            aoa.push([formatTanggalSingkat(r.tanggal), r.keterangan, r.jumlah]);
          });
        }

        const totalRowIdx = aoa.length;
        aoa.push(['Total', '', modul.totalJumlah]);
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

        <div style={styles.contentArea}>
          {/* Jenis Laporan */}
          <div style={styles.reportTypesGrid}>
            {REPORT_TYPES.map((type) => {
              const isSelected = selectedReport === type.id;
              const IconComp = type.icon;

              return (
                <div
                  key={type.id}
                  onClick={() => {
                    setSelectedReport(type.id);
                    setSelectedModulFilter('ALL');
                    setCurrentModulPage(1);
                  }}
                  style={{
                    ...styles.reportCard,
                    borderColor: isSelected ? '#23573c' : '#e2e8f0',
                    backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                    boxShadow: isSelected ? '0 4px 14px rgba(35, 87, 60, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={styles.cardHeaderRow}>
                    <div
                      style={{
                        ...styles.cardIconBox,
                        backgroundColor: isSelected ? '#23573c' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569'
                      }}
                    >
                      <IconComp sx={{ fontSize: 22 }} />
                    </div>
                  </div>
                  <div style={styles.cardTitleText}>{type.label}</div>
                </div>
              );
            })}
          </div>

          {/* Toolbar Filter */}
          <div style={styles.toolbarCard}>
            <div style={styles.toolbarFlex}>
              {/* Filter Tanggal */}
              <div style={styles.dateFilterContainer}>
                {isSingleDateReport ? (
                  <div
                    style={{
                      ...styles.dateRangeWrapper,
                      boxShadow: isDateFocused ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
                    }}
                    onClick={() => setIsDateFocused(true)}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsDateFocused(false);
                      }
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                    <input
                      type="date"
                      value={singleDate}
                      onChange={(e) => {
                        setSingleDate(e.target.value);
                        setCurrentModulPage(1);
                      }}
                      onClick={(e) => {
                        setIsDateFocused(true);
                        try { e.target.showPicker?.(); } catch {}
                      }}
                      style={styles.dateInput}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      ...styles.dateRangeWrapper,
                      boxShadow: isDateFocused ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
                    }}
                    onClick={() => setIsDateFocused(true)}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsDateFocused(false);
                      }
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ color: '#23573c', fontSize: 18, flexShrink: 0 }} />
                    <input
                      type="date"
                      value={startDate}
                      max={endDate || undefined}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setCurrentModulPage(1);
                      }}
                      onClick={(e) => {
                        setIsDateFocused(true);
                        try { e.target.showPicker?.(); } catch {}
                      }}
                      style={styles.dateInput}
                    />
                    <span style={styles.dateSeparator}>s/d</span>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setCurrentModulPage(1);
                      }}
                      onClick={(e) => {
                        setIsDateFocused(true);
                        try { e.target.showPicker?.(); } catch {}
                      }}
                      style={styles.dateInput}
                    />
                  </div>
                )}
              </div>

              {/* Filter Modul */}
              {(selectedReport === 'stok_card' || selectedReport === 'modul_masuk' || selectedReport === 'modul_keluar') && (
                <div style={styles.modulFilterWrapper}>
                  <SearchableModulDropdown
                    value={selectedModulFilter}
                    onChange={(val) => {
                      setSelectedModulFilter(val);
                      setCurrentModulPage(1);
                    }}
                    options={modulDropdownOptions}
                  />
                </div>
              )}

              {/* Unduh Excel */}
              <div style={{ marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  style={styles.btnExportExcel}
                >
                  <FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />
                  <span>Unduh Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tampilan Tabel */}
          <div style={styles.tableCard}>
            {/* Banner Header */}
            <div style={styles.pdfBannerBox}>
              <div style={styles.pdfBannerTitle}>{reportBannerTitle}</div>
              <div style={styles.pdfBannerSubtitle}>{reportBannerSubtitle}</div>
            </div>

            <div style={styles.tableResponsive}>
              {/* 1. Stok Card */}
              {selectedReport === 'stok_card' && (
                <div style={{ padding: '0 20px 20px 20px' }}>
                  {stokCardData.length === 0 ? (
                    <div style={styles.emptyState}>Tidak ada data modul yang sesuai.</div>
                  ) : (
                    <>
                      {paginatedStokCard.map((modul) => (
                        <div key={modul.id} style={styles.modulCardTableWrapper}>
                          <table style={styles.pdfTable}>
                            <thead>
                              <tr style={styles.pdfThRow}>
                                <th style={{ ...styles.pdfTh, width: '18%', textAlign: 'center' }}>Tanggal</th>
                                <th style={{ ...styles.pdfTh, width: '46%' }}>{modul.namaModul}</th>
                                <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>M</th>
                                <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>K</th>
                                <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>Saldo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Stok Awal */}
                              <tr style={styles.pdfTr}>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }}>{formatTanggalSingkat(startDate)}</td>
                                <td style={{ ...styles.pdfTd, fontWeight: '600' }}>Stok awal</td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }}></td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center' }}></td>
                                <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>{modul.stokAwal}</td>
                              </tr>
                              {/* Riwayat Mutasi */}
                              {modul.rows.map((row, rIdx) => (
                                <tr key={rIdx} style={styles.pdfTr}>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center' }}>{formatTanggalSingkat(row.tanggal)}</td>
                                  <td style={styles.pdfTd}>{row.keterangan}</td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>
                                    {row.masuk || ''}
                                  </td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>
                                    {row.keluar || ''}
                                  </td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>{row.saldo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}

                      {/* Pagination Stok Card */}
                      {stokCardData.length > itemsPerPage && (
                        <div style={styles.cardFooter}>
                          <div style={styles.pageInfo}>
                            {stokCardData.length > 0 ? (currentModulPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentModulPage * itemsPerPage, stokCardData.length)} dari {stokCardData.length}
                          </div>
                          <div style={styles.paginationButtons}>
                            <button
                              type="button"
                              disabled={currentModulPage === 1}
                              onClick={() => setCurrentModulPage((p) => Math.max(1, p - 1))}
                              style={{
                                ...styles.btnPageArrow,
                                opacity: currentModulPage === 1 ? 0.4 : 1,
                                cursor: currentModulPage === 1 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              &lt;
                            </button>

                            {Array.from({ length: totalModulPages }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setCurrentModulPage(num)}
                                style={{
                                  ...styles.btnPageNum,
                                  ...(currentModulPage === num ? styles.btnPageNumActive : {})
                                }}
                              >
                                {num}
                              </button>
                            ))}

                            <button
                              type="button"
                              disabled={currentModulPage === totalModulPages}
                              onClick={() => setCurrentModulPage((p) => Math.min(totalModulPages, p + 1))}
                              style={{
                                ...styles.btnPageArrow,
                                opacity: currentModulPage === totalModulPages ? 0.4 : 1,
                                cursor: currentModulPage === totalModulPages ? 'not-allowed' : 'pointer'
                              }}
                            >
                              &gt;
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* 2. Stok Balance */}
              {selectedReport === 'stok_balance' && (
                <div style={{ padding: '0 20px 20px 20px' }}>
                  <table style={styles.pdfTable}>
                    <thead>
                      <tr style={styles.pdfThRow}>
                        <th style={{ ...styles.pdfTh, width: '10%', textAlign: 'center' }}>No</th>
                        <th style={{ ...styles.pdfTh, width: '68%' }}>Nama Modul</th>
                        <th style={{ ...styles.pdfTh, width: '22%', textAlign: 'center' }}>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stokBalanceData.length === 0 ? (
                        <tr>
                          <td colSpan={3} style={styles.emptyState}>Tidak ada data stok modul.</td>
                        </tr>
                      ) : (
                        paginatedStokBalance.map((row) => (
                          <tr key={row.id} style={styles.pdfTr}>
                            <td style={{ ...styles.pdfTd, textAlign: 'center' }}>{row.no}</td>
                            <td style={styles.pdfTd}>{row.namaModul}</td>
                            <td style={{ ...styles.pdfTd, textAlign: 'center' }}>
                              {row.stokAkhir}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Stok Balance */}
                  {stokBalanceData.length > itemsPerPageBalance && (
                    <div style={styles.cardFooter}>
                      <div style={styles.pageInfo}>
                        {stokBalanceData.length > 0 ? (currentModulPage - 1) * itemsPerPageBalance + 1 : 0} - {Math.min(currentModulPage * itemsPerPageBalance, stokBalanceData.length)} dari {stokBalanceData.length}
                      </div>
                      <div style={styles.paginationButtons}>
                        <button
                          type="button"
                          disabled={currentModulPage === 1}
                          onClick={() => setCurrentModulPage((p) => Math.max(1, p - 1))}
                          style={{
                            ...styles.btnPageArrow,
                            opacity: currentModulPage === 1 ? 0.4 : 1,
                            cursor: currentModulPage === 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          &lt;
                        </button>

                        {Array.from({ length: totalBalancePages }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCurrentModulPage(num)}
                            style={{
                              ...styles.btnPageNum,
                              ...(currentModulPage === num ? styles.btnPageNumActive : {})
                            }}
                          >
                            {num}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={currentModulPage === totalBalancePages}
                          onClick={() => setCurrentModulPage((p) => Math.min(totalBalancePages, p + 1))}
                          style={{
                            ...styles.btnPageArrow,
                            opacity: currentModulPage === totalBalancePages ? 0.4 : 1,
                            cursor: currentModulPage === totalBalancePages ? 'not-allowed' : 'pointer'
                          }}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3 & 4. Customer Sudah/Belum Dikirim */}
              {(selectedReport === 'sudah_dikirim' || selectedReport === 'belum_dikirim') && (
                <div style={{ padding: '0 20px 24px 20px' }}>
                  <table style={styles.pdfTable}>
                    <thead>
                      <tr style={styles.pdfThRow}>
                        <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>
                          {selectedReport === 'sudah_dikirim' ? 'Tanggal Kirim' : 'Tanggal Pesan'}
                        </th>
                        <th style={{ ...styles.pdfTh, width: '12%', textAlign: 'center' }}>No Pesanan</th>
                        <th style={{ ...styles.pdfTh, width: '16%' }}>Nama</th>
                        <th style={{ ...styles.pdfTh, width: '14%' }}>Metode Pengiriman</th>
                        <th style={{ ...styles.pdfTh, width: '18%' }}>Pesanan</th>
                        <th style={{ ...styles.pdfTh, width: '6%', textAlign: 'center' }}>Jumlah</th>
                        <th style={{ ...styles.pdfTh, width: '22%' }}>Alamat</th>
                        <th style={{ ...styles.pdfTh, width: '10%', textAlign: 'center' }}>Status</th>
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
                                        verticalAlign: 'middle'
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
              )}

              {/* 5 & 6. Modul Masuk & Keluar */}
              {(selectedReport === 'modul_masuk' || selectedReport === 'modul_keluar') && (
                <div style={{ padding: '0 20px 24px 20px' }}>
                  {modulMutasiGroupedData.length === 0 ? (
                    <div style={styles.emptyState}>Tidak ada data modul yang sesuai.</div>
                  ) : (
                    <>
                      {paginatedModulMutasi.map((modul) => (
                        <div key={modul.id} style={styles.modulCardTableWrapper}>
                          {/* Nama Modul */}
                          <div style={styles.modulSectionHeader}>
                            {modul.namaModul}
                          </div>

                          <table style={styles.pdfTable}>
                            <thead>
                              <tr style={styles.pdfThRow}>
                                <th style={{ ...styles.pdfTh, width: '22%', textAlign: 'center' }}>Tanggal</th>
                                <th style={{ ...styles.pdfTh, width: '58%' }}>Keterangan</th>
                                <th style={{ ...styles.pdfTh, width: '20%', textAlign: 'center' }}>Jumlah</th>
                              </tr>
                            </thead>
                            <tbody>
                              {modul.rows.length === 0 ? (
                                <tr style={styles.pdfTr}>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', color: '#64748b' }}>-</td>
                                  <td style={{ ...styles.pdfTd, color: '#64748b' }}>-</td>
                                  <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>0</td>
                                </tr>
                              ) : (
                                modul.rows.map((row, rIdx) => (
                                  <tr key={rIdx} style={styles.pdfTr}>
                                    <td style={{ ...styles.pdfTd, textAlign: 'center' }}>{formatTanggalSingkat(row.tanggal)}</td>
                                    <td style={styles.pdfTd}>{row.keterangan}</td>
                                    <td style={{ ...styles.pdfTd, textAlign: 'center', fontWeight: '600' }}>{row.jumlah}</td>
                                  </tr>
                                ))
                              )}
                              {/* Total */}
                              <tr style={styles.totalRow}>
                                <td
                                  colSpan={2}
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

                      {/* Pagination Modul Mutasi */}
                      {modulMutasiGroupedData.length > itemsPerPage && (
                        <div style={styles.cardFooter}>
                          <div style={styles.pageInfo}>
                            {modulMutasiGroupedData.length > 0 ? (currentModulPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentModulPage * itemsPerPage, modulMutasiGroupedData.length)} dari {modulMutasiGroupedData.length}
                          </div>
                          <div style={styles.paginationButtons}>
                            <button
                              type="button"
                              disabled={currentModulPage === 1}
                              onClick={() => setCurrentModulPage((p) => Math.max(1, p - 1))}
                              style={{
                                ...styles.btnPageArrow,
                                opacity: currentModulPage === 1 ? 0.4 : 1,
                                cursor: currentModulPage === 1 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              &lt;
                            </button>

                            {Array.from({ length: totalMutasiPages }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setCurrentModulPage(num)}
                                style={{
                                  ...styles.btnPageNum,
                                  ...(currentModulPage === num ? styles.btnPageNumActive : {})
                                }}
                              >
                                {num}
                              </button>
                            ))}

                            <button
                              type="button"
                              disabled={currentModulPage === totalMutasiPages}
                              onClick={() => setCurrentModulPage((p) => Math.min(totalMutasiPages, p + 1))}
                              style={{
                                ...styles.btnPageArrow,
                                opacity: currentModulPage === totalMutasiPages ? 0.4 : 1,
                                cursor: currentModulPage === totalMutasiPages ? 'not-allowed' : 'pointer'
                              }}
                            >
                              &gt;
                            </button>
                          </div>
                        </div>
                      )}
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

// Styles
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
  reportTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '20px'
  },
  reportCard: {
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px'
  },
  cardIconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  cardTitleText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
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
    padding: '14px 20px',
    margin: '20px 20px 20px 20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  pdfBannerTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#006100',
    marginBottom: '4px',
    letterSpacing: '0.01em'
  },
  pdfBannerSubtitle: {
    fontSize: '13px',
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
    padding: '6px 14px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '8px'
  },
  tableResponsive: {
    overflowX: 'auto',
    width: '100%'
  },
  pdfTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
    border: '1px solid #94a3b8'
  },
  pdfThRow: {
    backgroundColor: '#f1f5f9'
  },
  pdfTh: {
    border: '1px solid #94a3b8',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    whiteSpace: 'nowrap'
  },
  pdfTr: {
    backgroundColor: '#ffffff'
  },
  pdfTd: {
    border: '1px solid #94a3b8',
    padding: '8px 12px',
    color: '#1e293b',
    verticalAlign: 'middle'
  },
  totalRow: {
    backgroundColor: '#f8fafc'
  },
  statusPillGreen: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  statusPillYellow: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px',
    color: '#64748b',
    fontSize: '13.5px',
    fontStyle: 'italic'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 4px 6px 4px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #eef2ef',
    flexWrap: 'wrap',
    gap: '12px'
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
  }
};
