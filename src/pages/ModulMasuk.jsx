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
              <div style={styles.formGroup}>
                <label style={styles.label}>Tanggal Masuk</label>
                <input
                  type="date"
                  value={tanggalMasuk}
                  onChange={(e) => {
                    setTanggalMasuk(e.target.value);
                    if (errors.tanggalMasuk) {
                      setErrors({ ...errors, tanggalMasuk: null });
                    }
                  }}
                  style={{
                    ...styles.inputField,
                    borderColor: errors.tanggalMasuk ? '#dc2626' : '#dce4de'
                  }}
                />
                {errors.tanggalMasuk && (
                  <span style={styles.errorText}>{errors.tanggalMasuk}</span>
                )}
              </div>

              {/* Modul Items */}
              <div style={styles.itemsSection}>
                <div style={styles.itemsHeaderRow}>
                  <label style={{ ...styles.label, flex: 2.5 }}>Pilih Judul Modul</label>
                  <label style={{ ...styles.label, flex: 1, minWidth: '180px' }}>Jumlah Diterima</label>
                  <div style={{ width: '44px' }} />
                </div>

                {modulItems.map((item) => {
                  const rowErr = itemErrors[item.id] || {};
                  const otherSelectedTitles = modulItems
                    .filter((it) => it.id !== item.id && it.judulModul)
                    .map((it) => it.judulModul);

                  return (
                    <div key={item.id} style={styles.itemRow}>
                      {/* Dropdown */}
                      <div style={{ flex: 2.5, position: 'relative' }}>
                        <CustomDropdown
                          value={item.judulModul}
                          onChange={(val) => handleItemChange(item.id, 'judulModul', val)}
                          placeholder="Pilih Judul Modul"
                          options={MODUL_OPTIONS}
                          disabledOptions={otherSelectedTitles}
                          selectStyle={{
                            height: '44px',
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

                      {/* Jumlah Diterima */}
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <input
                          type="number"
                          placeholder="Contoh: 100"
                          value={item.jumlahDiterima}
                          onChange={(e) => handleItemChange(item.id, 'jumlahDiterima', e.target.value)}
                          style={{
                            ...styles.inputField,
                            borderColor: rowErr.jumlahDiterima ? '#dc2626' : '#dce4de'
                          }}
                        />
                        {rowErr.jumlahDiterima && (
                          <span style={styles.errorText}>{rowErr.jumlahDiterima}</span>
                        )}
                      </div>

                      {/* Hapus */}
                      <button
                        type="button"
                        onClick={() => handleHapusBaris(item.id)}
                        style={styles.btnHapusBaris}
                        title="Hapus baris modul ini"
                      >
                        <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                      </button>
                    </div>
                  );
                })}

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
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    width: 'fit-content',
    minWidth: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '28px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
  },
  statLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.6px',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px',
    lineHeight: 1.1
  },
  statIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: '#f1f5f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
    overflow: 'visible',
    position: 'relative'
  },
  cardHeader: {
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px'
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  headerIconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#1a3e2b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflow: 'visible'
  },
  itemsHeaderRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center'
  },
  itemRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    overflow: 'visible'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b'
  },
  inputField: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    borderRadius: '8px',
    border: '1px solid #dce4de',
    fontSize: '13.5px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
  },
  btnHapusBaris: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.15s ease'
  },
  btnTambahBaris: {
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1.5px dashed #23573c',
    padding: '9px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease'
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
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9'
  },
  itemsSummary: {
    marginRight: 'auto',
    fontSize: '13px',
    color: '#475569'
  },
  btnBatal: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #cbd5e1',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
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
    boxShadow: '0 2px 8px rgba(35, 87, 60, 0.25)',
    transition: 'transform 0.15s ease, background-color 0.15s ease'
  }
};
