import React, { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

// Jenis Modul
const INITIAL_JENIS = [
  { id: 1, nama: 'Al Haqq' },
  { id: 2, nama: 'Al Hisan' },
  { id: 3, nama: 'Tahsin Usmani' },
  { id: 4, nama: 'RSQ Kids' },
  { id: 5, nama: 'Umum' },
  { id: 6, nama: 'Al Quran Wakaf' },
  { id: 7, nama: 'Al Quran' }
];

export default function JenisModul() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [jenisList, setJenisList] = useState(INITIAL_JENIS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal Tambah dan Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ id: null, nama: '' });
  const [formErrors, setFormErrors] = useState({});

  // Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Notifikasi
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

  // Filter Data
  const filteredList = useMemo(() => {
    return jenisList.filter((item) => {
      const q = searchQuery.toLowerCase();
      return item.nama.toLowerCase().includes(q);
    });
  }, [jenisList, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  // Open Modal Tambah
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ id: null, nama: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Modal Edit
  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setFormData({
      id: item.id,
      nama: item.nama
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Tombol Simpan
  const handleSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.nama.trim()) {
      errors.nama = 'Nama jenis modul wajib diisi';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const trimmedNama = formData.nama.trim();

    if (modalMode === 'add') {
      const newId = Date.now();
      const newItem = {
        id: newId,
        nama: trimmedNama
      };
      setJenisList((prev) => [newItem, ...prev]);
      showToast(`Jenis modul "${newItem.nama}" berhasil ditambahkan!`, 'success');
    } else {
      setJenisList((prev) =>
        prev.map((item) =>
          item.id === formData.id
            ? { ...item, nama: trimmedNama }
            : item
        )
      );
      showToast(`Jenis modul "${trimmedNama}" berhasil diperbarui!`, 'success');
    }

    setIsModalOpen(false);
  };

  // Request Delete
  const handleRequestDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Konfirmasi Hapus
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setJenisList((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    showToast(`Jenis modul "${itemToDelete.nama}" berhasil dihapus.`, 'success');
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        role="admin"
        activeMenu="Jenis Modul"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Jenis Modul"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main style={styles.contentBody}>
          {/* Notifikasi */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#23573c' : '#dc2626'
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
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
                  placeholder="Cari jenis modul..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input-responsive"
                  style={styles.searchInput}
                />
              </div>
            </div>

            {/* Tombol Tambah Jenis Modul */}
            <button onClick={handleOpenAdd} className="btn-add-responsive" style={styles.btnAdd}>
              <AddOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Tambah Jenis Modul</span>
            </button>
          </div>

          {/* Table Card */}
          <div style={styles.card}>
            <div style={styles.tableResponsive}>
              <table style={styles.table} className="table-jenis-modul">
                <colgroup>
                  <col className="col-no" style={{ width: '130px' }} />
                  <col className="col-jenis" style={{ width: 'auto' }} />
                  <col className="col-aksi" style={{ width: '260px' }} />
                </colgroup>
                <thead>
                  <tr style={styles.thRow}>
                    <th className="th-no" style={{ ...styles.th, width: '130px', textAlign: 'center' }}>NO</th>
                    <th className="th-jenis" style={styles.th}>JENIS</th>
                    <th className="th-aksi" style={{ ...styles.th, width: '260px', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length > 0 ? (
                    paginatedList.map((item, index) => {
                      const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      return (
                        <tr key={item.id} style={styles.tr}>
                          {/* NO */}
                          <td className="td-no" style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                            {rowNumber}
                          </td>

                          {/* NAMA JENIS */}
                          <td className="td-jenis" style={styles.td}>
                            <div style={styles.namaJenisText}>{item.nama}</div>
                          </td>

                          {/* AKSI */}
                          <td className="td-aksi" style={{ ...styles.td, textAlign: 'center' }}>
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
                                onClick={() => handleRequestDelete(item)}
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
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px' }}>
                        Tidak ada jenis modul yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-responsive" style={styles.cardFooter}>
              <div style={styles.pageInfo}>
                {filteredList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredList.length)} dari {filteredList.length}
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

      {/* MODAL TAMBAH DAN EDIT */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {modalMode === 'add' ? 'Tambah Jenis Modul' : 'Edit Jenis Modul'}
              </h2>
            </div>

            <form noValidate onSubmit={handleSave} style={styles.modalFormWrapper}>
              <div style={styles.modalFormBody}>
                {/* Nama Jenis Modul */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Jenis Modul</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => {
                      setFormData({ ...formData, nama: e.target.value });
                      if (formErrors.nama) {
                        setFormErrors((prev) => ({ ...prev, nama: '' }));
                      }
                    }}
                    placeholder="Masukkan nama jenis modul"
                    style={{
                      ...styles.modalInput,
                      borderColor: formErrors.nama ? '#ef4444' : '#23573c'
                    }}
                  />
                  {formErrors.nama && (
                    <span style={styles.errorText}>{formErrors.nama}</span>
                  )}
                </div>
              </div>

              {/* Tombol Simpan dan Batal */}
              <div style={styles.modalFooterBar}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.btnModalCancel}
                >
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

      {/* MODAL KONFIRMASI HAPUS */}
      {isDeleteModalOpen && itemToDelete && (
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
              Apakah Anda yakin ingin menghapus jenis modul ini?
            </p>
            <div style={styles.deleteModalActions}>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                style={styles.btnDeleteCancel}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={styles.btnDeleteConfirm}
              >
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
    gap: '14px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '300px',
    padding: '10px 14px 10px 38px',
    fontSize: '13px',
    border: '1px solid #23573c',
    borderRadius: '10px',
    outline: 'none',
    backgroundColor: '#f6faf7',
    fontFamily: 'inherit'
  },
  btnAdd: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.25)',
    transition: 'transform 0.15s'
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
  tableResponsive: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
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
    fontSize: '13.5px',
    verticalAlign: 'middle'
  },
  namaJenisText: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px',
    wordBreak: 'break-word',
    lineHeight: '1.4'
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

  // Modal Styles
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
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
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
  errorText: {
    color: '#ef4444',
    fontSize: '11.5px',
    fontWeight: '500',
    marginTop: '4px',
    display: 'block'
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

  // Delete Modal
  deleteModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '380px',
    maxWidth: '100%',
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
