import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Opsi Kategori / Jenis Modul
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

// Daftar 47 Modul dengan Kategori
const MASTER_MODULS = [
  { id: 1, kategori: 'Al Haqq', nama: 'Asasi' },
  { id: 2, kategori: 'Al Haqq', nama: 'Asasi 2' },
  { id: 3, kategori: 'Al Haqq', nama: 'Tahmidi' },
  { id: 4, kategori: 'Al Haqq', nama: 'Tawasuthi' },
  { id: 5, kategori: 'Al Haqq', nama: 'Idadi' },
  { id: 6, kategori: 'Al Haqq', nama: 'Tahsini' },
  { id: 7, kategori: 'Al Haqq', nama: 'Tajwidi' },
  { id: 8, kategori: 'Al Haqq', nama: 'Makhorijul Huruf' },
  { id: 9, kategori: 'Al Haqq', nama: 'Tilawah Asasi' },
  { id: 10, kategori: 'Al Haqq', nama: 'Buku Prestasi Dewasa' },
  { id: 11, kategori: 'Al Haqq', nama: 'Buku Prestasi Anak' },
  { id: 12, kategori: 'Al Haqq', nama: 'Anak 1' },
  { id: 13, kategori: 'Al Haqq', nama: 'Anak 2' },
  { id: 14, kategori: 'Al Haqq', nama: 'Anak 3' },
  { id: 15, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A4' },
  { id: 16, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A5' },
  { id: 17, kategori: 'Al Hisan', nama: 'Panduan Guru' },
  { id: 18, kategori: 'Al Hisan', nama: 'Al Hisan 1' },
  { id: 19, kategori: 'Al Hisan', nama: 'Al Hisan 2' },
  { id: 20, kategori: 'Al Hisan', nama: 'Al Hisan 3' },
  { id: 21, kategori: 'Al Hisan', nama: 'Al Hisan 4' },
  { id: 22, kategori: 'Al Hisan', nama: 'Kamus Juz 1' },
  { id: 23, kategori: 'Al Hisan', nama: 'Kamus 30 juz' },
  { id: 24, kategori: 'Umum', nama: 'Khat' },
  { id: 25, kategori: 'Tahsin Usmani', nama: 'Utsmani 1' },
  { id: 26, kategori: 'Tahsin Usmani', nama: 'Utsmani 2' },
  { id: 27, kategori: 'Tahsin Usmani', nama: 'Ustmani 3' },
  { id: 28, kategori: 'RSQ Kids', nama: 'Buku Doa' },
  { id: 29, kategori: 'RSQ Kids', nama: 'Buku Hadist' },
  { id: 30, kategori: 'RSQ Kids', nama: 'Buku Prestasi' },
  { id: 31, kategori: 'Umum', nama: 'Matan Jazariyah' },
  { id: 32, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 Terjemah' },
  { id: 33, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah' },
  { id: 34, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 Terjemah' },
  { id: 35, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 tanpa Terjemah' },
  { id: 36, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 Terjemah' },
  { id: 37, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah' },
  { id: 38, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 Terjemah' },
  { id: 39, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 tanpa Terjemah' },
  { id: 40, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 Terjemah' },
  { id: 41, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah' },
  { id: 42, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 Terjemah' },
  { id: 43, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 tanpa Terjemah' },
  { id: 44, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 Terjemah' },
  { id: 45, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah' },
  { id: 46, kategori: 'Al Quran', nama: 'Mushaf Al Mujib A6 Terjemah' },
  { id: 47, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A6 tanpa Terjemah' }
];

// Custom Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  disabledOptions = [],
  placeholder = 'Pilih...',
  searchPlaceholder = 'Cari...',
  style = {},
  selectStyle = {},
  arrowColor = '#1a3e2b',
  className = '',
  withSearch = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredOptions = options.filter((opt) => {
    const label = typeof opt === 'object' ? opt.label : opt;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayLabel = typeof value === 'object' ? value?.label : value;

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', zIndex: isOpen ? 100 : 1, ...style }}
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
          borderColor: isOpen ? '#23573c' : (selectStyle.borderColor || '#dce4de'),
          boxShadow: isOpen ? '0 0 0 3px rgba(35, 87, 60, 0.12)' : 'none'
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: displayLabel ? '#1e293b' : '#94a3b8'
          }}
        >
          {displayLabel || placeholder}
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
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Search */}
          {withSearch && (
            <div style={{ padding: '6px 8px', borderBottom: '1px solid #eef2ef', backgroundColor: '#f8faf9' }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12px',
                  border: '1px solid #dce4de',
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Opsi */}
          <div style={{ maxHeight: withSearch ? '140px' : '180px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                const isSelected = optVal === value;
                const isDisabled = disabledOptions.includes(optVal);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isDisabled) handleSelect(optVal);
                    }}
                    className="custom-dropdown-item"
                    style={{
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected
                        ? '#ffffff'
                        : isDisabled
                          ? '#94a3b8'
                          : '#1e293b',
                      backgroundColor: isSelected
                        ? '#23573c'
                        : isDisabled
                          ? '#f8fafc'
                          : 'transparent',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease, color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isDisabled) {
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isDisabled) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>{optLabel}</span>
                    {isDisabled && (
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                        Sudah dipilih
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '10px 12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Tidak ada judul modul yang cocok
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModulMasuk() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State Total
  const [totalModulMasukBulanIni, setTotalModulMasukBulanIni] = useState(2800);

  // Form State
  const [tanggalMasuk, setTanggalMasuk] = useState('');

  // Items
  const [modulItems, setModulItems] = useState([
    { id: 1, jenisModul: 'Semua Jenis', judulModul: '', jumlahDiterima: '' }
  ]);

  // Errors
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});

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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Tambah Baris
  const handleTambahBaris = () => {
    setModulItems((prev) => [
      ...prev,
      { id: Date.now(), jenisModul: 'Semua Jenis', judulModul: '', jumlahDiterima: '' }
    ]);
  };

  // Hapus Baris
  const handleHapusBaris = (id) => {
    if (modulItems.length === 1) {
      setModulItems([{ id: Date.now(), jenisModul: 'Semua Jenis', judulModul: '', jumlahDiterima: '' }]);
      setItemErrors({});
    } else {
      setModulItems((prev) => prev.filter((item) => item.id !== id));
      setItemErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // Change Item
  const handleItemChange = (id, field, val) => {
    setModulItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === 'jenisModul') {
          // Jika jenis modul diubah dan judulModul saat ini tidak ada di kategori baru (dan bukan 'Semua Jenis'), reset judul
          let nextJudul = item.judulModul;
          if (val !== 'Semua Jenis' && nextJudul) {
            const isValid = MASTER_MODULS.some(
              (m) => m.nama === nextJudul && m.kategori === val
            );
            if (!isValid) {
              nextJudul = '';
            }
          }
          return { ...item, jenisModul: val, judulModul: nextJudul };
        }

        if (field === 'judulModul') {
          // Jika user memilih judul modul saat jenisModul adalah 'Semua Jenis',
          // sinkronkan jenisModul otomatis ke kategori aslinya jika ada
          let nextJenis = item.jenisModul || 'Semua Jenis';
          if (nextJenis === 'Semua Jenis' && val) {
            const foundModul = MASTER_MODULS.find((m) => m.nama === val);
            if (foundModul) {
              nextJenis = foundModul.kategori;
            }
          }
          return { ...item, judulModul: val, jenisModul: nextJenis };
        }

        return { ...item, [field]: val };
      })
    );

    // Cek Duplikat
    if (field === 'judulModul') {
      const isDuplicate = modulItems.some(
        (it) => it.id !== id && it.judulModul === val && val !== ''
      );
      if (isDuplicate) {
        setItemErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], judulModul: 'Judul modul sudah dipilih di baris lain' }
        }));
        showToast('Judul modul sudah dipilih di baris lain.', 'error');
        return;
      }
    }

    if (itemErrors[id]?.[field]) {
      setItemErrors((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: null }
      }));
    }
  };

  // Batal
  const handleBatal = () => {
    setTanggalMasuk('');
    setModulItems([{ id: Date.now(), jenisModul: 'Semua Jenis', judulModul: '', jumlahDiterima: '' }]);
    setErrors({});
    setItemErrors({});
  };

  // Simpan
  const handleSimpan = (e) => {
    if (e) e.preventDefault();

    const err = {};
    if (!tanggalMasuk) err.tanggalMasuk = 'Tanggal masuk wajib diisi';

    const rowErrs = {};
    let hasRowErr = false;
    const seenTitles = new Set();

    modulItems.forEach((item) => {
      const r = {};
      if (!item.judulModul) {
        r.judulModul = 'Judul modul wajib dipilih';
        hasRowErr = true;
      } else if (seenTitles.has(item.judulModul)) {
        r.judulModul = 'Judul modul sudah dipilih di baris lain';
        hasRowErr = true;
      } else {
        seenTitles.add(item.judulModul);
      }

      if (!item.jumlahDiterima || String(item.jumlahDiterima).trim() === '') {
        r.jumlahDiterima = 'Jumlah diterima wajib diisi';
        hasRowErr = true;
      } else if (Number(item.jumlahDiterima) <= 0) {
        r.jumlahDiterima = 'Jumlah minimal 1';
        hasRowErr = true;
      }
      if (Object.keys(r).length > 0) {
        rowErrs[item.id] = r;
      }
    });

    if (Object.keys(err).length > 0 || hasRowErr) {
      setErrors(err);
      setItemErrors(rowErrs);
      showToast('Mohon lengkapi seluruh formulir', 'error');
      return;
    }

    const addedTotal = modulItems.reduce((sum, it) => sum + Number(it.jumlahDiterima), 0);
    setTotalModulMasukBulanIni((prev) => prev + addedTotal);

    // Reset
    setTanggalMasuk('');
    setModulItems([{ id: Date.now(), jenisModul: 'Semua Jenis', judulModul: '', jumlahDiterima: '' }]);
    setErrors({});
    setItemErrors({});

    showToast(
      'Berhasil menyimpan. Stok fisik telah diperbarui.',
      'success'
    );
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        role="admin"
        activeMenu="Modul Masuk"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Modul Masuk"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content */}
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

          {/* Card Total */}
          <div style={styles.statCard} className="stat-card-responsive-modul">
            <div style={styles.statLeft}>
              <div style={styles.statLabel}>TOTAL MODUL MASUK BULAN INI</div>
              <div style={styles.statValue}>
                {totalModulMasukBulanIni.toLocaleString('id-ID')}
              </div>
            </div>
            <div style={styles.statIconBox}>
              <ArchiveOutlinedIcon sx={{ fontSize: 24, color: '#3d5246' }} />
            </div>
          </div>

          {/* Card Form */}
          <div style={styles.card}>
            {/* Form */}
            <form onSubmit={handleSimpan} noValidate style={styles.formContainer} className="form-container-responsive">
              {/* Tanggal Masuk */}
              <div style={styles.tanggalMasukWrapper} className="tanggal-masuk-wrapper-responsive">
                <label style={styles.label}>Tanggal Masuk</label>
                <input
                  type="date"
                  className="input-focus-green"
                  value={tanggalMasuk}
                  onChange={(e) => {
                    setTanggalMasuk(e.target.value);
                    if (errors.tanggalMasuk) {
                      setErrors({ ...errors, tanggalMasuk: null });
                    }
                  }}
                  onClick={(e) => {
                    try { e.target.showPicker?.(); } catch {}
                  }}
                  style={{
                    ...styles.inputTanggal,
                    borderColor: errors.tanggalMasuk ? '#dc2626' : '#23573c'
                  }}
                />
                {errors.tanggalMasuk && (
                  <span style={styles.errorText}>{errors.tanggalMasuk}</span>
                )}
              </div>

              {/* Desktop */}
              <div style={styles.tableResponsive} className="modul-masuk-desktop-table">
                <table style={styles.table}>
                  <colgroup>
                    <col style={{ width: '50px' }} />
                    <col style={{ width: '190px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '65px' }} />
                  </colgroup>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, textAlign: 'center' }}>NO</th>
                      <th style={styles.th}>JENIS MODUL</th>
                      <th style={styles.th}>PILIH JUDUL MODUL</th>
                      <th style={styles.th}>JUMLAH DITERIMA</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulItems.map((item, index) => {
                      const rowErr = itemErrors[item.id] || {};
                      const otherSelectedTitles = modulItems
                        .filter((it) => it.id !== item.id && it.judulModul)
                        .map((it) => it.judulModul);

                      // Filter modul
                      const availableModuls = (!item.jenisModul || item.jenisModul === 'Semua Jenis')
                        ? MASTER_MODULS
                        : MASTER_MODULS.filter((m) => m.kategori === item.jenisModul);

                      // Opsi judul unik
                      const modulTitleOptions = Array.from(new Set(availableModuls.map((m) => m.nama)));

                      return (
                        <tr key={item.id} style={styles.tr}>
                          {/* No */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {index + 1}
                          </td>

                          {/* Jenis */}
                          <td style={styles.td}>
                            <CustomDropdown
                              value={item.jenisModul || 'Semua Jenis'}
                              onChange={(val) => handleItemChange(item.id, 'jenisModul', val)}
                              placeholder="Pilih Jenis"
                              options={KATEGORI_OPTIONS}
                              withSearch={false}
                              selectStyle={{
                                height: '42px',
                                padding: '0 14px',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #dce4de',
                                fontSize: '13.5px',
                                color: '#1e293b'
                              }}
                            />
                          </td>

                          {/* Judul */}
                          <td style={styles.td}>
                            <CustomDropdown
                              value={item.judulModul}
                              onChange={(val) => handleItemChange(item.id, 'judulModul', val)}
                              placeholder="Pilih Judul Modul"
                              searchPlaceholder="Cari judul modul..."
                              options={modulTitleOptions}
                              disabledOptions={otherSelectedTitles}
                              withSearch={true}
                              selectStyle={{
                                height: '42px',
                                padding: '0 14px',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff',
                                border: `1px solid ${rowErr.judulModul ? '#dc2626' : '#dce4de'}`,
                                fontSize: '13.5px',
                                color: item.judulModul ? '#1e293b' : '#94a3b8'
                              }}
                            />
                            {rowErr.judulModul && (
                              <span style={styles.errorText}>{rowErr.judulModul}</span>
                            )}
                          </td>

                          {/* Jumlah */}
                          <td style={styles.td}>
                            <input
                              type="number"
                              min="1"
                              className="input-focus-green"
                              placeholder="Contoh: 100"
                              value={item.jumlahDiterima}
                              onChange={(e) => handleItemChange(item.id, 'jumlahDiterima', e.target.value)}
                              style={{
                                ...styles.inputJumlah,
                                borderColor: rowErr.jumlahDiterima ? '#dc2626' : '#dce4de'
                              }}
                            />
                            {rowErr.jumlahDiterima && (
                              <span style={styles.errorText}>{rowErr.jumlahDiterima}</span>
                            )}
                          </td>

                          {/* Aksi */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleHapusBaris(item.id)}
                              style={styles.btnActionDelete}
                            >
                              <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="modul-masuk-mobile-cards">
                {modulItems.map((item, index) => {
                  const rowErr = itemErrors[item.id] || {};
                  const otherSelectedTitles = modulItems
                    .filter((it) => it.id !== item.id && it.judulModul)
                    .map((it) => it.judulModul);

                  // Filter modul
                  const availableModuls = (!item.jenisModul || item.jenisModul === 'Semua Jenis')
                    ? MASTER_MODULS
                    : MASTER_MODULS.filter((m) => m.kategori === item.jenisModul);

                  // Opsi judul unik
                  const modulTitleOptions = Array.from(new Set(availableModuls.map((m) => m.nama)));

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #dce4de',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#23573c', backgroundColor: '#eaf4ee', padding: '3px 10px', borderRadius: '6px' }}>
                          Modul {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleHapusBaris(item.id)}
                          style={styles.btnActionDelete}
                        >
                          <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>

                      {/* Jenis */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#1a3e2b', textTransform: 'uppercase' }}>
                          Jenis Modul
                        </label>
                        <CustomDropdown
                          value={item.jenisModul || 'Semua Jenis'}
                          onChange={(val) => handleItemChange(item.id, 'jenisModul', val)}
                          placeholder="Pilih Jenis"
                          options={KATEGORI_OPTIONS}
                          withSearch={false}
                          selectStyle={{
                            height: '42px',
                            padding: '0 14px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #dce4de',
                            fontSize: '13.5px',
                            color: '#1e293b'
                          }}
                        />
                      </div>

                      {/* Judul */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#1a3e2b', textTransform: 'uppercase' }}>
                          Pilih Judul Modul
                        </label>
                        <CustomDropdown
                          value={item.judulModul}
                          onChange={(val) => handleItemChange(item.id, 'judulModul', val)}
                          placeholder="Pilih Judul Modul"
                          searchPlaceholder="Cari judul modul..."
                          options={modulTitleOptions}
                          disabledOptions={otherSelectedTitles}
                          withSearch={true}
                          selectStyle={{
                            height: '42px',
                            padding: '0 14px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: `1px solid ${rowErr.judulModul ? '#dc2626' : '#dce4de'}`,
                            fontSize: '13.5px',
                            color: item.judulModul ? '#1e293b' : '#94a3b8'
                          }}
                        />
                        {rowErr.judulModul && (
                          <span style={styles.errorText}>{rowErr.judulModul}</span>
                        )}
                      </div>

                      {/* Jumlah */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '11.5px', fontWeight: '700', color: '#1a3e2b', textTransform: 'uppercase' }}>
                          Jumlah Diterima
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="input-focus-green"
                          placeholder="Contoh: 100"
                          value={item.jumlahDiterima}
                          onChange={(e) => handleItemChange(item.id, 'jumlahDiterima', e.target.value)}
                          style={{
                            ...styles.inputJumlah,
                            borderColor: rowErr.jumlahDiterima ? '#dc2626' : '#dce4de'
                          }}
                        />
                        {rowErr.jumlahDiterima && (
                          <span style={styles.errorText}>{rowErr.jumlahDiterima}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tambah Baris */}
              <div>
                <button
                  type="button"
                  onClick={handleTambahBaris}
                  style={styles.btnTambahBaris}
                  className="btn-tambah-baris-responsive"
                >
                  <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Modul Masuk</span>
                </button>
              </div>

              {/* Aksi */}
              <div style={styles.formActions} className="form-actions-responsive">
                <button
                  type="button"
                  onClick={handleBatal}
                  style={styles.btnBatal}
                  className="btn-batal-responsive"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={styles.btnSimpan}
                  className="btn-simpan-responsive"
                >
                  <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                  <span>Simpan & Update Stok Fisik</span>
                </button>
              </div>
            </form>
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
    padding: '28px 36px 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
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
  // Card Total
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #eef2ef',
    borderLeft: '4px solid #23573c',
    padding: '16px 20px',
    width: 'fit-content',
    minWidth: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
  },
  statLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a3e2b',
    lineHeight: 1.1
  },
  statIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
    overflow: 'visible',
    position: 'relative'
  },
  // Form
  formContainer: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflow: 'visible'
  },
  tanggalMasukWrapper: {
    maxWidth: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a3e2b'
  },
  inputTanggal: {
    width: '100%',
    height: '42px',
    padding: '0 14px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    backgroundColor: '#f6faf7',
    fontSize: '13.5px',
    color: '#1a3e2b',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
  },
  tableResponsive: {
    width: '100%',
    overflow: 'visible',
    border: '1px solid #dce4de',
    borderRadius: '12px'
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
    fontSize: '12px',
    fontWeight: '700',
    color: '#1d4632',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f5f2'
  },
  td: {
    padding: '12px 18px',
    fontSize: '14px',
    color: '#1a3e2b',
    verticalAlign: 'middle'
  },
  inputJumlah: {
    width: '100%',
    height: '42px',
    padding: '0 14px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    fontSize: '13.5px',
    color: '#1a3e2b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
  },
  btnActionDelete: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    padding: 0,
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    cursor: 'pointer'
  },
  btnTambahBaris: {
    backgroundColor: '#f6faf7',
    color: '#23573c',
    border: '1.5px dashed #23573c',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    fontWeight: '500',
    marginTop: '4px',
    display: 'block'
  },
  formActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    paddingTop: '18px',
    borderTop: '1px solid #edf2ef'
  },
  btnBatal: {
    backgroundColor: '#ffffff',
    color: '#3d5246',
    border: '1px solid #dce4de',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSimpan: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)'
  }
};
