import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import html2pdf from 'html2pdf.js';
import logoRsq from '../../assets/logo rsq.jpeg';

// Covers
import coverAsasi from '../../assets/asasi.jpg';
import { INITIAL_DEMO_PESANAN } from './PesananSaya';

export default function DetailPesanan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [newProofFile, setNewProofFile] = useState(null);
  const [showKwitansiModal, setShowKwitansiModal] = useState(false);

  // Toast
  const [notification, setNotification] = useState(null);
  const notifTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setNotification({ message, type });
    notifTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Ambil data order
  const [order, setOrder] = useState(() => {
    // 1. Dari location.state
    if (location.state?.order && (!id || location.state.order.id === id)) {
      return location.state.order;
    }

    // 2. Dari INITIAL_DEMO_PESANAN
    if (id) {
      const foundDemo = INITIAL_DEMO_PESANAN.find((o) => o.id === id);
      if (foundDemo) return foundDemo;
    }

    return null;
  });

  // Sinkronisasi jika id berubah
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!order && id) {
      const foundDemo = INITIAL_DEMO_PESANAN.find((o) => o.id === id);
      if (foundDemo) {
        setOrder(foundDemo);
      }
    }
  }, [id, order]);

  // Kunci scroll saat lightbox atau modal batal atau modal kuitansi terbuka
  useEffect(() => {
    if (showLightbox || isCancelling || showKwitansiModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showLightbox, isCancelling, showKwitansiModal]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      if (dateStr.includes('/')) {
        const datePart = dateStr.split(' ')[0];
        const parts = datePart.split('/');
        if (parts.length === 3) {
          const [d, m, y] = parts;
          return `${parseInt(d, 10)} ${monthNames[parseInt(m, 10) - 1] || m} ${y}`;
        }
      }
      if (dateStr.includes('-')) {
        const datePart = dateStr.split(' ')[0];
        const [year, month, day] = datePart.split('-');
        if (year && month && day) {
          return `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1] || month} ${year}`;
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Unduh PDF Kwitansi
  const handlePrintKwitansi = () => {
    const element = document.getElementById('printable-kwitansi');
    if (!element) return;
    const nomorKwitansi = order
      ? 'KWT-' + (order.id || '').replace(/^ORD-/, '')
      : 'Kuitansi';

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

  const isKwitansiAvailable = (status, statusPengiriman) => {
    const s = (status || '').toLowerCase().trim();
    const sp = (statusPengiriman || '').toLowerCase().trim();
    if (
      s === 'belum bayar' ||
      s === 'menunggu verifikasi' ||
      s === 'ditolak' ||
      s === 'pembayaran ditolak' ||
      s === 'dibatalkan' ||
      s === 'pesanan dibatalkan'
    ) {
      return false;
    }
    const allowed = ['perlu dikirim', 'diproses', 'dikirim', 'selesai', 'disetujui'];
    return allowed.includes(s) || allowed.includes(sp);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Belum Bayar':
        return {
          color: '#2563eb',
          bg: '#dbeafe',
          border: '#2563eb'
        };
      case 'Menunggu Verifikasi':
        return {
          color: '#d97706',
          bg: '#fef3c7',
          border: '#d97706'
        };
      case 'Disetujui':
        return {
          color: '#16a34a',
          bg: '#dcfce7',
          border: '#16a34a'
        };
      case 'Diproses':
      case 'Perlu Dikirim':
        return {
          color: '#d97706',
          bg: '#fef3c7',
          border: '#d97706'
        };
      case 'Dikirim':
        return {
          color: '#2563eb',
          bg: '#dbeafe',
          border: '#2563eb'
        };
      case 'Ditolak':
      case 'Pembayaran Ditolak':
        return {
          color: '#dc2626',
          bg: '#fee2e2',
          border: '#dc2626'
        };
      case 'Dibatalkan':
      case 'Pesanan Dibatalkan':
        return {
          color: '#64748b',
          bg: '#f1f5f9',
          border: '#cbd5e1'
        };
      case 'Selesai':
      default:
        return {
          color: '#16a34a',
          bg: '#dcfce7',
          border: '#16a34a'
        };
    }
  };

  const handleCopyRekening = () => {
    navigator.clipboard.writeText('1155770003');
    setCopiedBank(true);
    showToast('Nomor rekening BSI berhasil disalin', 'success');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleChooseProof = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format file harus berupa JPG, JPEG, atau PNG', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const updatedOrder = {
        ...order,
        buktiTf: reader.result,
        status: 'Menunggu Verifikasi',
        statusPembayaran: 'Menunggu Verifikasi',
        statusColor: '#d97706',
        statusBg: '#fef3c7'
      };
      setOrder(updatedOrder);
      setNewProofFile(null);
      showToast('Bukti transfer berhasil diunggah', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleHapusBukti = () => {
    setNewProofFile(null);
    setOrder((prev) => ({
      ...prev,
      buktiTf: null,
      status: 'Belum Bayar',
      statusPembayaran: 'Belum Bayar',
      statusColor: '#ef4444',
      statusBg: '#fef2f2'
    }));
    showToast('Bukti transfer berhasil dihapus', 'success');
  };

  const handleConfirmBatal = () => {
    const updatedOrder = {
      ...order,
      status: 'Dibatalkan',
      statusPembayaran: 'Dibatalkan',
      statusColor: '#64748b',
      statusBg: '#f1f5f9'
    };

    setOrder(updatedOrder);
    setIsCancelling(false);
    setNewProofFile(null);

    showToast('Pesanan berhasil dibatalkan', 'success');
  };

  const handlePesanLagi = () => {
    if (!order || !order.items) return;
    try {
      const savedCart = localStorage.getItem('inventory_rsq_cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];

      order.items.forEach((item) => {
        const found = cart.find((c) => c.id === item.id);
        if (found) {
          found.qty = (found.qty || 1) + item.qty;
          found.checked = true;
        } else {
          cart.push({ ...item, checked: true });
        }
      });

      localStorage.setItem('inventory_rsq_cart', JSON.stringify(cart));
      navigate('/katalog-modul');
    } catch (e) {
      navigate('/katalog-modul');
    }
  };

  if (!order) {
    return (
      <div style={styles.layoutContainer}>
        <Sidebar
          role="peserta"
          activeMenu="Pesanan"
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div style={styles.mainWrapper}>
          <Navbar
            title="Detail Pesanan"
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />
          <main style={styles.contentBody}>
            <div style={styles.emptyCard}>
              <div style={styles.emptyIconWrap}>
                <ShoppingBagOutlinedIcon sx={{ fontSize: 50, color: '#94a3b8' }} />
              </div>
              <h3 style={styles.emptyTitle}>Pesanan Tidak Ditemukan</h3>
              <p style={styles.emptySubtitle}>
                Pesanan dengan nomor <strong>{id}</strong> tidak dapat ditemukan atau telah dihapus.
              </p>
              <button
                type="button"
                onClick={() => navigate('/pesanan')}
                style={styles.btnPrimaryLg}
              >
                Kembali ke Pesanan Saya
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(order.status);
  const hasKwitansi = isKwitansiAvailable(order.status, order.statusPengiriman);
  const isBelumBayar =
    (order.status === 'Belum Bayar' || order.statusPembayaran === 'Belum Bayar') &&
    order.status !== 'Dibatalkan';
  const canEditProof =
    (order.status === 'Belum Bayar' ||
      order.status === 'Menunggu Verifikasi' ||
      order.statusPembayaran === 'Belum Bayar' ||
      order.statusPembayaran === 'Menunggu Verifikasi') &&
    order.status !== 'Dibatalkan';
  const canCancelOrder = canEditProof;
  const displayedProof = order.buktiTf || newProofFile;

  const ongkir =
    order.biayaKirim !== undefined
      ? order.biayaKirim
      : order.metodePengiriman === 'Via Kurir'
      ? 10000
      : 0;

  const totalModul = order.items.reduce((acc, it) => acc + it.hargaJual * it.qty, 0);

  return (
    <div style={styles.layoutContainer}>
      <Sidebar
        role="peserta"
        activeMenu="Pesanan"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title="Detail Pesanan"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="detail-pesanan-main-container content-body-responsive" style={styles.contentBody}>
          {/* Toast */}
          {notification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'error' ? '#dc2626' : '#23573c'
              }}
            >
              {notification.type === 'error' ? (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Page Header Bar */}
          <div style={styles.pageHeaderBar}>
            <button
              type="button"
              onClick={() => navigate('/pesanan')}
              style={styles.btnKembali}
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Kembali ke Pesanan Saya</span>
            </button>
          </div>

          <div className="detail-pesanan-grid-container" style={styles.gridContainer}>
            {/* Status Header Card */}
            <div className="detail-header-status-card" style={styles.headerStatusCard}>
              <div className="detail-header-top-row" style={styles.headerStatusTopRow}>
                <div className="detail-header-order-id-row" style={styles.headerOrderIdRow}>
                  <span className="detail-header-order-id-label" style={styles.headerOrderIdLabel}>NO PESANAN</span>
                  <span className="detail-header-order-id-value" style={styles.headerOrderIdValue}>{order.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {hasKwitansi && (
                    <button
                      type="button"
                      onClick={() => setShowKwitansiModal(true)}
                      style={styles.btnLihatKwitansiHeader}
                    >
                      <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />
                      <span>Lihat Kuitansi</span>
                    </button>
                  )}
                  <div
                    className="detail-status-badge"
                    style={{
                      ...styles.statusBadge,
                      color: badge.color,
                      backgroundColor: badge.bg,
                      border: `1px solid ${badge.border}`
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="detail-header-order-date-row" style={styles.headerOrderDateRow}>
                <span className="detail-header-order-date-label" style={styles.headerOrderDateLabel}>WAKTU PEMESANAN</span>
                <span className="detail-header-order-date-value" style={styles.headerOrderDateValue}>{order.tanggal}</span>
              </div>
            </div>

            {/* Notifikasi Ditolak */}
            {(order.status === 'Ditolak' || order.statusPembayaran === 'Ditolak') && (
              <div style={styles.alertReject}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 22, color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#991b1b' }}>
                    Pembayaran Ditolak oleh Admin
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '3px', lineHeight: '1.5' }}>
                    {order.alasanPenolakan || 'Bukti transfer tidak valid atau nominal tidak sesuai dengan tagihan. Silakan lakukan pemesanan ulang.'}
                  </div>
                </div>
              </div>
            )}

            {/* Notifikasi Dibatalkan */}
            {(order.status === 'Dibatalkan' || order.statusPembayaran === 'Dibatalkan') && (
              <div style={styles.alertCancel}>
                <CancelOutlinedIcon sx={{ fontSize: 22, color: '#64748b', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155' }}>
                    Pesanan Dibatalkan
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
                    Pesanan ini telah dibatalkan dan tidak akan diproses lebih lanjut.
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 1: Informasi Pembeli & Pengiriman */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionCardHeader}>
                <div style={styles.sectionIconBadge}>
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                </div>
                <h2 style={styles.sectionHeading}>Informasi Pembeli & Pengiriman</h2>
              </div>

              <div className="detail-info-grid" style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>NAMA LENGKAP PEMBELI</span>
                  <p style={styles.infoValue}>{order.namaPenerima || 'Fulan bin Fulan'}</p>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>NO. WhatsApp / HP</span>
                  <p style={styles.infoValue}>{order.noHp || '081234567890'}</p>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>METODE PENGIRIMAN</span>
                  <p style={styles.infoValue}>{order.metodePengiriman || 'Via Kurir'}</p>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>METODE PEMBAYARAN</span>
                  <p style={styles.infoValue}>{order.metodeBayar || 'Transfer Bank'}</p>
                </div>

                <div style={{ ...styles.infoItem, gridColumn: '1 / -1' }}>
                  <span style={styles.infoLabel}>
                    {order.metodePengiriman === 'Ambil di RSQ Pusat'
                      ? 'LOKASI PENGAMBILAN'
                      : order.metodePengiriman === 'Titip ke Ustazah'
                      ? 'KETERANGAN TITIP USTAZAH'
                      : 'ALAMAT LENGKAP PENGIRIMAN'}
                  </span>
                  <p style={{ ...styles.infoValue, lineHeight: '1.6' }}>
                    {order.alamat || 'Jl. Melati No. 45, RT 02/RW 05, Sukajadi, Pekanbaru'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Rekening Pembayaran & Bukti Transfer */}
            {(!order.metodeBayar || order.metodeBayar === 'Transfer Bank') && (
              <div style={styles.sectionCard}>
                <div style={styles.sectionCardHeader}>
                  <div style={styles.sectionIconBadge}>
                    <PaymentOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                  </div>
                  <h2 style={styles.sectionHeading}>Informasi Pembayaran & Bukti Transfer</h2>
                </div>

                <div style={styles.bankCardWrapper}>
                  {/* Rekening BSI Box + Bukti Transfer */}
                  <div style={styles.bankDetailCard}>
                    <div style={styles.bankInfoHead}>
                      <div>
                        <span style={styles.bankNameTag}>BANK SYARIAH INDONESIA (BSI)</span>
                        <div style={styles.rekeningNumRow}>
                          <span style={styles.rekeningNumber}>1155770003</span>
                          <button
                            type="button"
                            onClick={handleCopyRekening}
                            style={styles.btnSalinRekening}
                          >
                            <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>{copiedBank ? 'Tersalin!' : 'Salin'}</span>
                          </button>
                        </div>
                        <div style={styles.rekeningHolder}>
                          a.n. <strong>Rumah Sahabat Quran Batam</strong>
                        </div>
                      </div>
                    </div>

                    {/* Unggah Bukti Transfer */}
                    <div style={styles.uploadContainer}>
                      <div style={styles.uploadHeadRow}>
                        <span style={styles.uploadTitle}>Bukti Pembayaran / Transfer</span>
                      </div>

                      {displayedProof ? (
                        <div className="proof-preview-card" style={styles.proofPreviewCard}>
                          <div style={{ position: 'relative', width: 'fit-content' }}>
                            <img
                              src={displayedProof}
                              alt="Bukti Transfer"
                              style={styles.proofPreviewImg}
                              onClick={() => {
                                setLightboxImg(displayedProof);
                                setShowLightbox(true);
                              }}
                            />
                            <div style={styles.zoomBadge}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="11" y1="8" x2="11" y2="14" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                              </svg>
                            </div>
                          </div>
                          {canEditProof && (
                            <div style={styles.proofBtnGroup}>
                              <label style={styles.btnChangeProof}>
                                Ganti Foto
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg,image/webp"
                                  style={{ display: 'none' }}
                                  onChange={handleChooseProof}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={handleHapusBukti}
                                style={styles.btnDeleteProof}
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      ) : canEditProof ? (
                        <label style={styles.dropzoneWrap}>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleChooseProof}
                          />
                          <div style={styles.dropzoneIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#23573c" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </div>
                          <div style={styles.dropzoneTextBox}>
                            <span style={styles.dropzoneBold}>Klik untuk mengunggah struk / bukti transfer</span>
                            <span style={styles.dropzoneHint}>Format file yang didukung: JPG, JPEG, PNG (Maksimal 5MB)</span>
                          </div>
                        </label>
                      ) : (
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          Tidak ada bukti transfer yang terlampir.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: Daftar Modul & Rincian Tagihan */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionCardHeader}>
                <div style={styles.sectionIconBadge}>
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                </div>
                <div>
                  <h2 style={styles.sectionHeading}>Daftar Modul</h2>
                </div>
              </div>

              {/* List Item Modul */}
              <div style={styles.summaryItemsScroll}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.summaryItemRow}>
                    {item.cover && (
                      <img
                        src={item.cover || coverAsasi}
                        alt={item.nama}
                        style={styles.summaryItemThumb}
                      />
                    )}
                    <div style={styles.summaryItemInfo}>
                      {/* Baris 1: Nama Modul di kiri */}
                      <div style={styles.summaryItemTopRow}>
                        <div style={styles.summaryItemTitle}>{item.nama}</div>
                      </div>

                      {/* Baris 2: Harga Satuan di kiri, Total Harga di kanan */}
                      <div style={styles.summaryItemBottomRow}>
                        <span style={styles.summaryItemQtyPrice}>
                          {item.qty} x {formatRupiah(item.hargaJual)}
                        </span>
                        <div style={styles.summaryItemTotalRight}>
                          {formatRupiah((item.hargaJual || 0) * (Number(item.qty) || 1))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kalkulasi Biaya */}
              <div style={styles.calculationSection}>
                <div style={styles.calcRow}>
                  <span style={styles.calcLabel}>Biaya Pengiriman</span>
                  {ongkir > 0 ? (
                    <span style={styles.calcValue}>{formatRupiah(ongkir)}</span>
                  ) : (
                    <span style={styles.freeShippingTag}>Gratis</span>
                  )}
                </div>

                <div style={styles.totalPaymentRow}>
                  <span style={styles.totalPaymentLabel}>Total Tagihan</span>
                  <span style={styles.totalPaymentNumber}>
                    {formatRupiah(order.totalHarga)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Card */}
            {(canCancelOrder || order.status === 'Selesai') && (
              <div className="detail-bottom-actions" style={styles.bottomActionsCard}>
                {canCancelOrder && (
                  <button
                    type="button"
                    onClick={() => setIsCancelling(true)}
                    style={styles.btnBatalkanOrder}
                  >
                    Batalkan Pesanan
                  </button>
                )}

                {order.status === 'Selesai' && (
                  <button
                    type="button"
                    onClick={handlePesanLagi}
                    style={styles.btnPesanLagi}
                  >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Pesan Lagi</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL KONFIRMASI BATALKAN PESANAN */}
      {isCancelling && (
        <div style={styles.modalOverlay} onClick={() => setIsCancelling(false)}>
          <div style={styles.modalContentCancel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalCancelHeader}>
              <h3 style={styles.modalCancelTitle}>Konfirmasi Batalkan Pesanan</h3>
              <button
                type="button"
                onClick={() => setIsCancelling(false)}
                style={styles.modalCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div style={styles.modalCancelBody}>
              <p style={styles.modalCancelText}>
                Apakah Anda yakin ingin membatalkan pesanan <strong>{order.id}</strong>?
                Pesanan yang dibatalkan tidak dapat diproses lagi oleh admin.
              </p>
            </div>

            <div style={styles.modalCancelFooter}>
              <button
                type="button"
                onClick={() => setIsCancelling(false)}
                style={styles.btnBatalModal}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBatal}
                style={styles.btnConfirmCancelModal}
              >
                Ya, Batalkan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX BUKTI TRANSFER */}
      {showLightbox && (
        <div style={styles.lightboxOverlay} onClick={() => setShowLightbox(false)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.lightboxHeader}>
              <span style={styles.lightboxTitle}>Bukti Transfer - {order.id}</span>
              <button
                type="button"
                onClick={() => setShowLightbox(false)}
                style={styles.lightboxCloseBtn}
              >
                <CloseOutlinedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
            <div style={styles.lightboxImgWrap}>
              <img src={lightboxImg} alt="Bukti Transfer Penuh" style={styles.lightboxImg} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Kuitansi */}
      {showKwitansiModal && (
        <div style={{ ...styles.modalOverlay, zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.45)' }} onClick={() => setShowKwitansiModal(false)}>
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
                  onClick={() => setShowKwitansiModal(false)}
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
                      {`KWT/${(order.id || '').replace(/^ORD-/, '')}`}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Nama Pembeli</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {order.namaPenerima || order.namaPembeli || 'Fulan bin Fulan'}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Total Tagihan</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatRupiah(order.totalHarga || order.totalBayar || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Tanggal Pemesanan</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(order.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Tanggal Pembayaran</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(order.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.metaLabelCol}>Pembayaran Terverifikasi</td>
                    <td style={styles.metaColonCol}>:</td>
                    <td style={styles.metaValueCol}>
                      {formatTanggal(order.tanggal)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.metaLabelCol, verticalAlign: 'top' }}>Untuk Pembayaran</td>
                    <td style={{ ...styles.metaColonCol, verticalAlign: 'top' }}>:</td>
                    <td style={styles.metaValueCol}>
                      Pembayaran modul pembelajaran yang dipesan melalui Sistem Inventory RSQ dengan nomor pesanan {order.id}
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
    </div>
  );
}

const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8faf9',
    fontFamily: "'Poppins', sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: '100vh'
  },
  contentBody: {
    flex: 1,
    padding: '24px 32px 60px',
    maxWidth: '1080px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 10010,
    fontSize: '13.5px',
    fontWeight: '500'
  },
  pageHeaderBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  btnKembali: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 0',
    width: 'fit-content'
  },
  pageTitleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f291e',
    margin: 0,
    letterSpacing: '-0.2px'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#5b7566',
    margin: 0,
    lineHeight: '1.5'
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  headerStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  headerStatusTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    width: '100%'
  },
  headerOrderIdRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerOrderIdLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  headerOrderIdValue: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0f291e',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap'
  },
  headerOrderDateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerOrderDateLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  headerOrderDateValue: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#334155',
    whiteSpace: 'nowrap'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    height: '28px',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  alertReject: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '14px 16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  alertCancel: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '14px 16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  },
  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '14px',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9'
  },
  sectionIconBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#eaf4ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  sectionHeading: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f291e',
    margin: 0
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  bankCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  bankDetailCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  bankInfoHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px'
  },
  bankNameTag: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#166534',
    letterSpacing: '0.4px',
    display: 'block'
  },
  rekeningNumRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px'
  },
  rekeningNumber: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f291e',
    letterSpacing: '1px'
  },
  btnSalinRekening: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #166534',
    color: '#166534',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  rekeningHolder: {
    fontSize: '12px',
    color: '#475569',
    marginTop: '2px'
  },
  uploadContainer: {
    borderTop: '1px dashed #bbf7d0',
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  uploadHeadRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  uploadTitle: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#166534'
  },
  dropzoneWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1.5px dashed #86efac',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  dropzoneIconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#eaf4ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  dropzoneTextBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  dropzoneBold: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#166534'
  },
  dropzoneHint: {
    fontSize: '11px',
    color: '#64748b'
  },
  proofPreviewCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #bbf7d0',
    width: 'fit-content'
  },
  proofPreviewImg: {
    width: '180px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    flexShrink: 0,
    cursor: 'pointer'
  },
  zoomBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  proofBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '180px'
  },
  btnChangeProof: {
    flex: 1,
    textAlign: 'center',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDeleteProof: {
    flex: 1,
    textAlign: 'center',
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    backgroundColor: '#fff5f5',
    color: '#dc2626',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  btnSaveProofInline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(35, 87, 60, 0.2)',
    width: '180px'
  },
  summaryItemsScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  summaryItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 14px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '1.2px solid #eef2f6',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },
  summaryItemThumb: {
    width: '46px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    flexShrink: 0
  },
  summaryItemInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '4px'
  },
  summaryItemTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: '100%'
  },
  summaryItemBottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: '100%',
    marginTop: '6px'
  },
  summaryItemTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.3',
    flex: 1
  },
  summaryItemQtyPrice: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  summaryItemTotalRight: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#23573c',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    textAlign: 'right'
  },
  calculationSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '14px 16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '14px'
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13.5px'
  },
  calcLabel: {
    color: '#475569',
    fontWeight: '500',
    fontSize: '13.5px'
  },
  calcValue: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#23573c'
  },
  freeShippingTag: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: '13px'
  },
  totalPaymentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '4px'
  },
  totalPaymentLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    display: 'block'
  },
  totalPaymentNumber: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#23573c'
  },
  bottomActionsCard: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0
  },
  btnBatalkanOrder: {
    width: '100%',
    padding: '11px 20px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    backgroundColor: '#fff5f5',
    color: '#dc2626',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease'
  },
  btnPesanLagi: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '60px 24px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  emptyIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f291e',
    margin: '0 0 6px'
  },
  emptySubtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 20px',
    maxWidth: '420px',
    lineHeight: '1.5'
  },
  btnPrimaryLg: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  // Modal Cancel
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10006,
    padding: '16px'
  },
  modalContentCancel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    maxWidth: '440px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
  },
  modalCancelHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalCancelTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f291e',
    margin: 0
  },
  modalCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#64748b',
    padding: '4px'
  },
  modalCancelBody: {
    padding: '20px'
  },
  modalCancelText: {
    fontSize: '13px',
    color: '#334155',
    lineHeight: '1.6',
    margin: 0
  },
  modalCancelFooter: {
    padding: '14px 20px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnBatalModal: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnConfirmCancelModal: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  // Lightbox
  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10008,
    padding: '20px'
  },
  lightboxContent: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  lightboxHeader: {
    padding: '12px 18px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  lightboxTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f291e'
  },
  lightboxCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#64748b',
    padding: '4px'
  },
  lightboxImgWrap: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    overflow: 'auto'
  },
  lightboxImg: {
    maxWidth: '100%',
    maxHeight: '75vh',
    objectFit: 'contain'
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
  btnLihatKwitansiHeader: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 16px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)'
  }
};
