import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Opsi Modul
const MODUL_OPTIONS = [
  'Asasi',
  'Asasi 2',
  'Tahmidi',
  'Tawasuthi',
  'Idadi',
  'Tahsini',
  'Tajwidi',
  'Makhorijul Huruf',
  'Tilawah Asasi',
  'Buku Prestasi Dewasa',
  'Buku Prestasi Anak',
  'Anak 1',
  'Anak 2',
  'Anak 3',
  'Syarh Tuhfatul Athfal A4',
  'Syarh Tuhfatul Athfal A5',
  'Panduan Guru',
  'Al Hisan 1',
  'Al Hisan 2',
  'Al Hisan 3',
  'Al Hisan 4',
  'Kamus Juz 1',
  'Kamus 30 juz',
  'Khat',
  'Utsmani 1',
  'Utsmani 2',
  'Ustmani 3',
  'Buku Doa',
  'Buku Hadist',
  'Buku Prestasi',
  'Matan Jazariyah',
  'Mushaf Ash Shahib A5 Terjemah',
  'Mushaf Ash Shahib A5 tanpa Terjemah',
  'Mushaf Al Kamil A5 Terjemah',
  'Mushaf Al Kamil A5 tanpa Terjemah',
  'Mushaf Ash Shahib A4 Terjemah',
  'Mushaf Ash Shahib A4 tanpa Terjemah',
  'Mushaf Ash Shahib A6 Terjemah',
  'Mushaf Ash Shahib A6 tanpa Terjemah',
  'Mushaf Al Mujib A6 Terjemah',
  'Mushaf Al Kamil A6 tanpa Terjemah'
];

// Custom Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  disabledOptions = [],
  placeholder = 'Pilih Judul Modul',
  style = {},
  selectStyle = {},
  arrowColor = '#1a3e2b',
  className = ''
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          <div style={{ padding: '6px 8px', borderBottom: '1px solid #eef2ef', backgroundColor: '#f8faf9' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari judul modul..."
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

          {/* Opsi */}
          <div style={{ maxHeight: '130px', overflowY: 'auto' }}>
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
    { id: 1, judulModul: '', jumlahDiterima: '' }
  ]);

  // Errors
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});

  // Toast
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Total Form
  const totalQtyForm = useMemo(() => {
    return modulItems.reduce((sum, it) => sum + (Number(it.jumlahDiterima) || 0), 0);
  }, [modulItems]);

  // Tambah Baris
  const handleTambahBaris = () => {
    setModulItems((prev) => [
      ...prev,
      { id: Date.now(), judulModul: '', jumlahDiterima: '' }
    ]);
  };

  // Hapus Baris
  const handleHapusBaris = (id) => {
    if (modulItems.length === 1) {
      setModulItems([{ id: Date.now(), judulModul: '', jumlahDiterima: '' }]);
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
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
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
    setModulItems([{ id: Date.now(), judulModul: '', jumlahDiterima: '' }]);
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
      return;
    }

    const addedTotal = modulItems.reduce((sum, it) => sum + Number(it.jumlahDiterima), 0);
    setTotalModulMasukBulanIni((prev) => prev + addedTotal);

    // Reset
    setTanggalMasuk('');
    setModulItems([{ id: Date.now(), judulModul: '', jumlahDiterima: '' }]);
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
        <main style={styles.contentBody}>
          {/* Toast */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#23573c' : '#0284c7'
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <span>{notification.message}</span>
            </div>
          )}

          {/* Card Total */}
          <div style={styles.statCard}>
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
            {/* Header */}
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <div style={styles.headerIconBox}>
                  <PostAddOutlinedIcon sx={{ fontSize: 20, color: '#ffffff' }} />
                </div>
                <h2 style={styles.cardTitle}>Formulir Modul Masuk</h2>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSimpan} noValidate style={styles.formContainer}>
              {/* Tanggal Masuk */}
              <div style={styles.tanggalMasukWrapper}>
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

              {/* Tabel Input Modul Items */}
              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '220px' }} />
                    <col style={{ width: '80px' }} />
                  </colgroup>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, textAlign: 'center' }}>NO</th>
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

                      return (
                        <tr key={item.id} style={styles.tr}>
                          {/* NO */}
                          <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {index + 1}
                          </td>

                          {/* Judul Modul */}
                          <td style={styles.td}>
                            <CustomDropdown
                              value={item.judulModul}
                              onChange={(val) => handleItemChange(item.id, 'judulModul', val)}
                              placeholder="Pilih Judul Modul"
                              options={MODUL_OPTIONS}
                              disabledOptions={otherSelectedTitles}
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

                          {/* Jumlah Diterima */}
                          <td style={styles.td}>
                            <input
                              type="number"
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

                          {/* AKSI (HAPUS) */}
                          <td style={{ ...styles.td, textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleHapusBaris(item.id)}
                              style={styles.btnActionDelete}
                              title="Hapus baris ini"
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

              {/* Tambah Baris */}
              <div>
                <button
                  type="button"
                  onClick={handleTambahBaris}
                  style={styles.btnTambahBaris}
                >
                  <AddCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Modul Masuk</span>
                </button>
              </div>

              {/* Aksi */}
              <div style={styles.formActions}>
                {modulItems.length > 1 && totalQtyForm > 0 && (
                  <div style={styles.itemsSummary}>
                    Total: <strong>{modulItems.length}</strong> judul modul ({totalQtyForm.toLocaleString('id-ID')} modul)
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleBatal}
                  style={styles.btnBatal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={styles.btnSimpan}
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
  cardHeader: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ebf2ed',
    borderBottom: '1px solid #dce4de',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px'
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIconBox: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    backgroundColor: '#23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1d4632',
    margin: 0
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
  itemsSummary: {
    marginRight: 'auto',
    fontSize: '13.5px',
    color: '#64748b',
    fontWeight: '500'
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
