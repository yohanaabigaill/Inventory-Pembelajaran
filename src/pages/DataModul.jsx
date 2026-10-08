import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import coverModul from '../assets/fotomodul.jpg';

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

const MODAL_KATEGORI_OPTIONS = [
  'Al Haqq',
  'Al Hisan',
  'Tahsin Usmani',
  'RSQ Kids',
  'Umum',
  'Al Quran Wakaf',
  'Al Quran'
];

const STATUS_OPTIONS = [
  'Semua Status',
  'Tersedia',
  'Stok Menipis',
  'Habis'
];

export default function DataModul() {
  const fileInputRef = useRef(null);
  const [modulList, setModulList] = useState([
    {
      id: 1,
      sku: 'HQ-AS-01',
      nama: 'Asasi',
      kategori: 'Al Haqq',
      hpp: 35000,
      hargaJual: 50000,
      stok: 240,
      status: 'Tersedia'
    },
    {
      id: 2,
      sku: 'HQ-TH-02',
      nama: 'Tahmidi',
      kategori: 'Al Haqq',
      hpp: 40000,
      hargaJual: 60000,
      stok: 5,
      status: 'Stok Menipis'
    },
    {
      id: 3,
      sku: 'HS-01-01',
      nama: 'Al Hisan 1',
      kategori: 'Al Hisan',
      hpp: 45000,
      hargaJual: 65000,
      stok: 150,
      status: 'Tersedia'
    },
    {
      id: 4,
      sku: 'US-UT-01',
      nama: 'Utsmani 1',
      kategori: 'Tahsin Usmani',
      hpp: 50000,
      hargaJual: 75000,
      stok: 0,
      status: 'Habis'
    },
    {
      id: 5,
      sku: 'RK-BD-01',
      nama: 'Buku Doa',
      kategori: 'RSQ Kids',
      hpp: 25000,
      hargaJual: 40000,
      stok: 180,
      status: 'Tersedia'
    }
  ]);

  //Filters dan Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Jenis');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  // Modal Tambah dan Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModul, setEditingModul] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    nama: '',
    kategori: 'Al Haqq',
    hpp: '',
    hargaJual: '',
    stok: '',
    minRestock: 50,
    deskripsi: ''
  });
  const [formErrors, setFormErrors] = useState({
    nama: '',
    hpp: '',
    hargaJual: '',
    stok: '',
    cover: ''
  });

  // Modal Hapus State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const formatNumberDots = (val) => {
    if (!val && val !== 0) return '';
    const raw = String(val).replace(/\D/g, '');
    if (!raw) return '';
    return new Intl.NumberFormat('id-ID').format(raw);
  };

  const parseNumberOnly = (val) => {
    return Number(String(val).replace(/\D/g, '')) || 0;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        cover: imageUrl,
        fileName: file.name
      }));
      setFormErrors(prev => ({ ...prev, cover: '' }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Tambah Modul
  const handleOpenAdd = () => {
    setEditingModul(null);
    setFormErrors({ nama: '', hpp: '', hargaJual: '', stok: '', cover: '' });
    setFormData({
      sku: '',
      nama: '',
      kategori: 'Al Haqq',
      hpp: '',
      hargaJual: '',
      stok: '',
      minRestock: 50,
      deskripsi: '',
      cover: null,
      fileName: ''
    });
    setIsModalOpen(true);
  };

  // Edit Modul
  const handleOpenEdit = (modul) => {
    setEditingModul(modul);
    setFormErrors({ nama: '', hpp: '', hargaJual: '', stok: '', cover: '' });
    setFormData({
      sku: modul.sku || '',
      nama: modul.nama || '',
      kategori: modul.kategori || 'Al Haqq',
      hpp: modul.hpp ? formatNumberDots(modul.hpp) : '',
      hargaJual: modul.hargaJual ? formatNumberDots(modul.hargaJual) : '',
      stok: modul.stok !== undefined ? modul.stok : '',
      minRestock: modul.minRestock || 50,
      deskripsi: modul.deskripsi || '',
      cover: modul.cover || coverModul,
      fileName: modul.fileName || ''
    });
    setIsModalOpen(true);
  };

  // Modal Hapus
  const handleRequestDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      setModulList(prev => prev.filter(item => item.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.nama || !formData.nama.trim()) {
      errors.nama = 'Judul modul wajib diisi';
    }
    if (formData.hpp === '' || formData.hpp === null || formData.hpp === undefined) {
      errors.hpp = 'HPP wajib diisi';
    }
    if (formData.hargaJual === '' || formData.hargaJual === null || formData.hargaJual === undefined) {
      errors.hargaJual = 'Harga jual wajib diisi';
    }
    if (formData.stok === '' || formData.stok === null || formData.stok === undefined) {
      errors.stok = 'Stok modul wajib diisi';
    }
    if (!formData.cover) {
      errors.cover = 'Foto modul wajib diunggah';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({ nama: '', hpp: '', hargaJual: '', stok: '', cover: '' });

    const hppNum = parseNumberOnly(formData.hpp);
    const hargaNum = parseNumberOnly(formData.hargaJual);
    const stokNum = Number(formData.stok);
    const minRestockNum = Number(formData.minRestock) || 50;

    let status = 'Tersedia';
    if (stokNum === 0) status = 'Habis';
    else if (stokNum <= minRestockNum) status = 'Stok Menipis';

    if (editingModul) {
      setModulList(prev =>
        prev.map(item =>
          item.id === editingModul.id
            ? { ...formData, hpp: hppNum, hargaJual: hargaNum, stok: stokNum, minRestock: minRestockNum, status }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        sku: formData.sku || `RSQ-TH-0${modulList.length + 1}`,
        ...formData,
        hpp: hppNum,
        hargaJual: hargaNum,
        stok: stokNum,
        minRestock: minRestockNum,
        status
      };
      setModulList(prev => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Filter
  const filteredList = modulList.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = selectedKategori === 'Semua Jenis' || item.kategori === selectedKategori;
    const matchStatus = selectedStatus === 'Semua Status' || item.status === selectedStatus;
    return matchSearch && matchKategori && matchStatus;
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        activeMenu="Data Modul"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Data Modul"
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        <main style={styles.contentBody}>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-responsive"
                  style={styles.searchInput}
                />
              </div>

              {/* Dropdown */}
              <CustomDropdown
                value={selectedKategori}
                onChange={(val) => setSelectedKategori(val)}
                options={KATEGORI_OPTIONS}
                className="select-wrapper-responsive"
                style={{ width: '180px' }}
                selectStyle={styles.customSelect}
                arrowColor="#1a3e2b"
              />

              <CustomDropdown
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                options={STATUS_OPTIONS}
                className="select-wrapper-responsive"
                style={{ width: '160px' }}
                selectStyle={styles.customSelect}
                arrowColor="#1a3e2b"
              />
            </div>

            {/* Tombol Tambah */}
            <button onClick={handleOpenAdd} className="btn-add-responsive" style={styles.btnAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Tambah Modul</span>
            </button>
          </div>

          {/* Data Table */}
          <div style={styles.tableContainer}>
            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={{ ...styles.th, width: '48px', textAlign: 'center' }}>NO</th>
                    <th style={{ ...styles.th, width: '70px', textAlign: 'center' }}>FOTO</th>
                    <th style={styles.th}>JUDUL MODUL</th>
                    <th style={styles.th}>JENIS</th>
                    <th style={styles.th}>HPP</th>
                    <th style={styles.th}>HARGA JUAL</th>
                    <th style={styles.th}>STOK MODUL</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item, index) => {
                    return (
                      <tr key={item.id} style={styles.tr}>
                        {/* NO */}
                        <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                          {index + 1}
                        </td>

                        {/* FOTO */}
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <img
                            src={coverModul}
                            alt="Cover Modul"
                            style={styles.coverThumb}
                          />
                        </td>

                        {/* Judul Modul */}
                        <td style={styles.td}>
                          <div style={styles.namaModulOnly}>{item.nama}</div>
                        </td>

                        {/* Jenis */}
                        <td style={styles.td}>
                          <div style={styles.jenisTextPlainBold}>{item.kategori}</div>
                        </td>

                        {/* HPP */}
                        <td style={styles.td}>
                          <div style={styles.priceHighlight}>{formatRupiah(item.hpp)}</div>
                        </td>

                        {/* Harga Jual */}
                        <td style={styles.td}>
                          <div style={styles.priceHighlight}>{formatRupiah(item.hargaJual)}</div>
                        </td>

                        {/* Stok Modul */}
                        <td style={styles.td}>
                          <span style={styles.stokValue}>{item.stok}</span>
                        </td>

                        {/* Status */}
                        <td style={styles.td}>
                          {item.status === 'Tersedia' && (
                            <span style={styles.statusTersediaNoDot}>Tersedia</span>
                          )}
                          {item.status === 'Stok Menipis' && (
                            <span style={styles.statusMenipisNoDot}>Stok Menipis</span>
                          )}
                          {item.status === 'Habis' && (
                            <span style={styles.statusHabisNoDot}>Habis</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <div style={styles.actionFlex}>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Modul"
                              style={styles.btnActionEdit}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRequestDelete(item.id)}
                              title="Hapus Modul"
                              style={styles.btnActionDelete}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                        Tidak ada data modul yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-responsive" style={styles.paginationRow}>
              <div style={styles.pageInfoPlain}>
                1 - {filteredList.length} dari {modulList.length}
              </div>
              <div style={styles.pageButtons}>
                <button style={styles.btnPageArrowWhite}>&lt;</button>
                <button style={styles.btnPageNumGreen}>1</button>
                <button style={styles.btnPageArrowWhite}>&gt;</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah dan Edit */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingModul ? 'Edit Modul' : 'Tambah Modul'}
              </h2>
            </div>

            <form noValidate onSubmit={handleSave} style={styles.modalFormWrapper}>
              <div style={styles.modalFormBody}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {/* Judul Modul */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Judul Modul</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => handleInputChange('nama', e.target.value)}
                    placeholder="Masukkan judul modul"
                    style={{
                      ...styles.modalInput,
                      borderColor: formErrors.nama ? '#ef4444' : '#23573c'
                    }}
                  />
                  {formErrors.nama && (
                    <span style={styles.errorText}>{formErrors.nama}</span>
                  )}
                </div>

                {/* Jenis */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Jenis</label>
                  <CustomDropdown
                    value={formData.kategori}
                    onChange={(val) => handleInputChange('kategori', val)}
                    options={MODAL_KATEGORI_OPTIONS}
                    selectStyle={styles.modalSelect}
                    arrowColor="#23573c"
                  />
                </div>

                {/* HPP and Harga Jual */}
                <div className="modal-form-grid2" style={styles.formGrid2}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>HPP (Harga Pokok Produksi)</label>
                    <input
                      type="text"
                      value={formData.hpp}
                      onChange={(e) => handleInputChange('hpp', formatNumberDots(e.target.value))}
                      placeholder="Rp 00.000"
                      style={{
                        ...styles.modalInput,
                        borderColor: formErrors.hpp ? '#ef4444' : '#23573c'
                      }}
                    />
                    {formErrors.hpp && (
                      <span style={styles.errorText}>{formErrors.hpp}</span>
                    )}
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Harga Jual</label>
                    <input
                      type="text"
                      value={formData.hargaJual}
                      onChange={(e) => handleInputChange('hargaJual', formatNumberDots(e.target.value))}
                      placeholder="Rp 00.000"
                      style={{
                        ...styles.modalInput,
                        borderColor: formErrors.hargaJual ? '#ef4444' : '#23573c'
                      }}
                    />
                    {formErrors.hargaJual && (
                      <span style={styles.errorText}>{formErrors.hargaJual}</span>
                    )}
                  </div>
                </div>

                {/* Stok Modul */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Stok Modul</label>
                  <input
                    type="number"
                    value={formData.stok}
                    onChange={(e) => handleInputChange('stok', e.target.value)}
                    placeholder="100"
                    style={{
                      ...styles.modalInput,
                      borderColor: formErrors.stok ? '#ef4444' : '#23573c'
                    }}
                  />
                  {formErrors.stok && (
                    <span style={styles.errorText}>{formErrors.stok}</span>
                  )}
                </div>

                {/* Foto Modul */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Foto Modul</label>
                  <div
                    onClick={handleUploadClick}
                    style={{
                      ...styles.uploadDropzone,
                      borderColor: formErrors.cover ? '#ef4444' : '#23573c'
                    }}
                  >
                    {formData.cover ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={formData.cover}
                          alt="Preview"
                          style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                          <span style={styles.uploadMainText}>{formData.fileName || 'Foto Modul Terpilih'}</span>
                          <p style={{ fontSize: '11.5px', color: '#23573c', margin: '2px 0 0 0', fontWeight: '600' }}>Klik untuk mengganti foto</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ marginBottom: '4px' }}>
                          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                          <polyline points="12 13 12 8 10 10" />
                          <polyline points="12 8 14 10" />
                        </svg>
                        <span style={styles.uploadMainText}>Unggah foto</span>
                        <span style={styles.uploadSubText}>Format JPG/PNG, maks. 2MB</span>
                      </>
                    )}
                  </div>
                  {formErrors.cover && (
                    <span style={styles.errorText}>{formErrors.cover}</span>
                  )}
                </div>
              </div>

              {/* Tombol Simpan dan Batal */}
              <div style={styles.modalFooterBar}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.btnModalCancel}>
                  Batal
                </button>
                <button type="submit" style={styles.btnModalSave}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Modal Hapus */}
      {deleteConfirmId && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteModalContent}>
            <div style={styles.deleteIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 style={styles.deleteModalTitle}>Konfirmasi Hapus</h3>
            <p style={styles.deleteModalText}>
              Apakah Anda yakin ingin menghapus modul ini?
            </p>
            <div style={styles.deleteModalActions}>
              <button onClick={handleCancelDelete} style={styles.btnDeleteCancel}>
                Batal
              </button>
              <button onClick={handleConfirmDelete} style={styles.btnDeleteConfirm}>
                Hapus
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
    backgroundColor: '#f8faf9'
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
    gap: '20px',
    backgroundColor: '#f8faf9'
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
    gap: '12px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px'
  },
  searchInput: {
    width: '300px',
    padding: '10px 14px 10px 38px',
    fontSize: '13px',
    border: '1px solid #23573c',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7'
  },

  customSelect: {
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #c7d9cd',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    color: '#1a3e2b',
    cursor: 'pointer'
  },

  btnAdd: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.25)'
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  tableResponsive: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    minWidth: '720px',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  tableHeaderRow: {
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
    fontSize: '13.5px',
    verticalAlign: 'middle'
  },
  coverThumb: {
    width: '38px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  namaModulOnly: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px'
  },

  jenisTextPlainBold: {
    fontSize: '14px',
    color: '#1a3e2b',
    fontWeight: '700'
  },

  priceHighlight: {
    fontWeight: '700',
    color: '#1a3e2b'
  },
  stokValue: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#162a20'
  },

  statusTersediaNoDot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bbf7d0',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusMenipisNoDot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fef08a',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusHabisNoDot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '105px',
    height: '28px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fecaca',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },

  actionFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  btnActionEdit: {
    backgroundColor: '#f0f5f2',
    color: '#23573c',
    border: 'none',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  btnActionDelete: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: 'none',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  paginationRow: {
    padding: '16px 24px',
    minHeight: '64px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #edf2ef'
  },
  pageInfoPlain: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '400'
  },
  pageButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnPageArrowWhite: {
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
    justifyContent: 'center'
  },
  btnPageNumGreen: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '11.5px',
    fontWeight: '500',
    marginTop: '4px',
    display: 'block'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '540px',
    maxWidth: '100%',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden'
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  modalHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  modalHeaderIconBox: {
    width: '36px',
    height: '36px',
    backgroundColor: '#18181b',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  modalSubtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: '2px 0 0 0'
  },
  btnModalClose: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px'
  },
  modalFormWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  modalFormBody: {
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: 'calc(92vh - 140px)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b'
  },
  requiredStar: {
    color: '#ef4444',
    marginLeft: '2px'
  },
  modalInput: {
    padding: '11px 14px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontFamily: 'inherit'
  },
  modalSelectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  modalSelect: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    cursor: 'pointer'
  },
  modalSelectArrow: {
    position: 'absolute',
    right: '14px',
    pointerEvents: 'none'
  },
  formGrid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px'
  },
  restockInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  modalInputRestock: {
    flex: 1,
    padding: '11px 14px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b'
  },
  unitText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b'
  },
  subHelpText: {
    fontSize: '11.5px',
    color: '#64748b',
    margin: '2px 0 0 0'
  },
  modalTextarea: {
    padding: '11px 14px',
    fontSize: '13px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  uploadDropzone: {
    backgroundColor: '#ffffff',
    border: '1px dashed #23573c',
    borderRadius: '10px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer'
  },
  uploadMainText: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e293b'
  },
  uploadSubText: {
    fontSize: '11.5px',
    color: '#64748b'
  },
  modalFooterBar: {
    padding: '14px 24px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnModalCancel: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnModalSave: {
    padding: '9px 22px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '400px',
    maxWidth: '90%',
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  deleteIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteModalTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  deleteModalText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  deleteModalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '12px',
    width: '100%'
  },
  btnDeleteCancel: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDeleteConfirm: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
