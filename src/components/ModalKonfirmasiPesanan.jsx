import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export default function ModalKonfirmasiPesanan({
  isOpen,
  onClose,
  items = [],
  canEditQty = false,
  onSuccess
}) {
  const navigate = useNavigate();
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    if (items && items.length > 0) {
      setLocalItems(items.map((it) => ({ ...it, qty: Number(it.qty) || 1 })));
    }
  }, [items, isOpen]);

  // Kunci scroll background
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Data Pembeli & Pengiriman
  const [recipientData, setRecipientData] = useState({
    nama: 'Ahmad Fauzi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru',
    catatan: ''
  });

  // Metode Pengiriman & Pembayaran
  const [metodePengiriman, setMetodePengiriman] = useState('Via Kurir');
  const [namaUstazah, setNamaUstazah] = useState('Ustazah Fatimah Azzahra');
  const [metodeBayar, setMetodeBayar] = useState('Transfer Bank');
  const [bankTujuan, setBankTujuan] = useState('BSI');
  const [buktiTransfer, setBuktiTransfer] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setBuktiTransfer(null);
    }
  }, [isOpen]);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validasi format file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format file harus berupa JPG, JPEG, atau PNG', 'error');
      e.target.value = '';
      return;
    }

    // Validasi ukuran file
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBuktiTransfer(reader.result);
      showToast('Bukti transfer berhasil ditambahkan', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleHapusBukti = () => {
    setBuktiTransfer(null);
    showToast('Bukti transfer berhasil dihapus', 'success');
  };

  // Toast
  const [toastNotification, setToastNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'error') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastNotification({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Pembayaran cash/tunai hanya berlaku jika metode pengiriman Ambil di RSQ atau Titip Ustazah
  const isCashAvailable =
    metodePengiriman === 'Ambil di RSQ Pusat' || metodePengiriman === 'Titip ke Ustazah';

  const handleSelectMetodePengiriman = (metode) => {
    setMetodePengiriman(metode);
    if (metode === 'Via Kurir' && metodeBayar === 'Tunai') {
      setMetodeBayar('Transfer Bank');
    }
  };

  const handleSelectMetodeBayar = (metode) => {
    if (metode === 'Tunai' && !isCashAvailable) {
      showToast('Pembayaran tunai tidak tersedia untuk pengiriman via kurir');
      return;
    }
    setMetodeBayar(metode);
  };

  if (!isOpen || localItems.length === 0) return null;

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Update qty
  const handleUpdateQty = (itemId, newQty) => {
    setLocalItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (newQty === '') return { ...item, qty: '' };
          const parsed = Number(newQty);
          const maxStok = item.stok || 999;
          if (parsed > maxStok) {
            showToast('Jumlah melebihi sisa stok');
          }
          const clamped = Math.max(1, Math.min(parsed, maxStok));
          return { ...item, qty: clamped };
        }
        return item;
      })
    );
  };

  // Hitung biaya
  const biayaKirim = metodePengiriman === 'Via Kurir' ? 10000 : 0;
  const subtotalModul = localItems.reduce(
    (sum, it) => sum + it.hargaJual * (Number(it.qty) || 1),
    0
  );
  const totalPembayaran = subtotalModul + biayaKirim;

  // Buat pesanan
  const handleConfirmOrder = () => {
    const finalItems = localItems.map((it) => ({
      id: it.id,
      nama: it.nama,
      kategori: it.kategori,
      hargaJual: it.hargaJual,
      qty: Number(it.qty) || 1,
      cover: it.cover
    }));

    const isTfWithoutProof = metodeBayar === 'Transfer Bank' && !buktiTransfer;
    const initialStatus = isTfWithoutProof ? 'Belum Bayar' : 'Menunggu Verifikasi';
    const statusColor = isTfWithoutProof ? '#2563eb' : '#d97706';
    const statusBg = isTfWithoutProof ? '#dbeafe' : '#fef3c7';

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      tanggal: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      status: initialStatus,
      statusPembayaran: initialStatus,
      statusColor: statusColor,
      statusBg: statusBg,
      namaPenerima: (recipientData.nama || 'Ahmad Fauzi').toUpperCase(),
      noHp: recipientData.noHp || '081234567890',
      metodePengiriman: metodePengiriman,
      alamat:
        metodePengiriman === 'Via Kurir'
          ? (recipientData.alamat || 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru')
          : (metodePengiriman === 'Ambil di RSQ Pusat'
            ? 'Kantor Pusat RSQ - Tiban Bukit Asri B no.20 RT 1 RW X, Kel. Tiban Baru, Kec. Sekupang, 29424'
            : `Titip ke ${namaUstazah || 'Ustazah Pembimbing'}`),
      ustazahNama: metodePengiriman === 'Titip ke Ustazah' ? (namaUstazah || 'Ustazah Fatimah Azzahra') : '',
      metodeBayar: metodeBayar,
      bankTujuan: metodeBayar === 'Transfer Bank' ? bankTujuan : '',
      buktiTf: buktiTransfer || null,
      catatan: recipientData.catatan || '',
      biayaKirim: biayaKirim,
      subtotalModul: subtotalModul,
      items: finalItems,
      totalHarga: totalPembayaran
    };

    try {
      localStorage.removeItem('inventory_rsq_pesanan');
    } catch (e) {
      console.error(e);
    }

    if (onSuccess) {
      onSuccess(newOrder);
    }

    onClose();
    navigate('/pesanan', { state: { newOrder } });
  };

  return (
    <div className="modal-overlay-responsive" style={styles.modalOverlay} onClick={onClose}>
      {/* Toast */}
      {toastNotification && (
        <div
          className="toast-responsive"
          style={{
            ...styles.toast,
            backgroundColor: toastNotification.type === 'success' ? '#23573c' : '#dc2626'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {toastNotification.type === 'success' ? (
            <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
          ) : (
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}

      <div className="modal-content-responsive" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header-responsive" style={styles.modalHeader}>
          <div>
            <h3 style={styles.modalHeaderTitle}>Konfirmasi Pemesanan Modul</h3>
            <span style={styles.modalHeaderSub}>
              Periksa kembali data pengiriman dan modul yang Anda pesan
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={styles.btnCloseModal}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Body Modal */}
        <div className="modal-body-responsive" style={styles.modalBody}>
          {/* Data Pembeli */}
          <div style={styles.checkoutSection}>
            <h4 style={styles.checkoutSectionTitle}>
              <span style={styles.sectionTitleIndicator} />
              Informasi Pembeli
            </h4>
            <div style={styles.checkoutFormGrid}>
              <div>
                <label style={styles.inputLabel}>Nama Pembeli</label>
                <input
                  type="text"
                  value={recipientData.nama}
                  onChange={(e) =>
                    setRecipientData({ ...recipientData, nama: e.target.value })
                  }
                  style={styles.checkoutInput}
                  placeholder="Nama lengkap..."
                />
              </div>
              <div>
                <label style={styles.inputLabel}>No WhatsApp / HP</label>
                <input
                  type="text"
                  value={recipientData.noHp}
                  onChange={(e) =>
                    setRecipientData({ ...recipientData, noHp: e.target.value })
                  }
                  style={styles.checkoutInput}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Metode Pengiriman */}
          <div style={styles.checkoutSection}>
            <h4 style={styles.checkoutSectionTitle}>
              <span style={styles.sectionTitleIndicator} />
              Metode Pengiriman
            </h4>
            <div style={styles.methodGrid}>
              {/* Via Kurir */}
              <div
                onClick={() => handleSelectMetodePengiriman('Via Kurir')}
                style={{
                  ...styles.methodCard,
                  border: metodePengiriman === 'Via Kurir' ? '1px solid #23573c' : '1px solid #e2e8f0',
                  backgroundColor: metodePengiriman === 'Via Kurir' ? '#f0fdf4' : '#ffffff',
                  boxShadow: 'none'
                }}
              >
                <div style={styles.methodCardHeader}>
                  <span style={styles.methodCardTitle}>Via Kurir</span>
                  <div
                    style={{
                      ...styles.methodRadioDot,
                      border: metodePengiriman === 'Via Kurir' ? '1.5px solid #23573c' : '1.5px solid #cbd5e1',
                      backgroundColor: metodePengiriman === 'Via Kurir' ? '#23573c' : '#ffffff'
                    }}
                  >
                    {metodePengiriman === 'Via Kurir' && <div style={styles.methodRadioInner} />}
                  </div>
                </div>
              </div>

              {/* Ambil di RSQ */}
              <div
                onClick={() => handleSelectMetodePengiriman('Ambil di RSQ Pusat')}
                style={{
                  ...styles.methodCard,
                  border: metodePengiriman === 'Ambil di RSQ Pusat' ? '1px solid #23573c' : '1px solid #e2e8f0',
                  backgroundColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#f0fdf4' : '#ffffff',
                  boxShadow: 'none'
                }}
              >
                <div style={styles.methodCardHeader}>
                  <span style={styles.methodCardTitle}>Ambil di RSQ</span>
                  <div
                    style={{
                      ...styles.methodRadioDot,
                      border: metodePengiriman === 'Ambil di RSQ Pusat' ? '1.5px solid #23573c' : '1.5px solid #cbd5e1',
                      backgroundColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#23573c' : '#ffffff'
                    }}
                  >
                    {metodePengiriman === 'Ambil di RSQ Pusat' && <div style={styles.methodRadioInner} />}
                  </div>
                </div>
              </div>

              {/* Titip ke Ustazah */}
              <div
                onClick={() => handleSelectMetodePengiriman('Titip ke Ustazah')}
                style={{
                  ...styles.methodCard,
                  border: metodePengiriman === 'Titip ke Ustazah' ? '1px solid #23573c' : '1px solid #e2e8f0',
                  backgroundColor: metodePengiriman === 'Titip ke Ustazah' ? '#f0fdf4' : '#ffffff',
                  boxShadow: 'none'
                }}
              >
                <div style={styles.methodCardHeader}>
                  <span style={styles.methodCardTitle}>Titip Ustazah</span>
                  <div
                    style={{
                      ...styles.methodRadioDot,
                      border: metodePengiriman === 'Titip ke Ustazah' ? '1.5px solid #23573c' : '1.5px solid #cbd5e1',
                      backgroundColor: metodePengiriman === 'Titip ke Ustazah' ? '#23573c' : '#ffffff'
                    }}
                  >
                    {metodePengiriman === 'Titip ke Ustazah' && <div style={styles.methodRadioInner} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Alamat/Kantor */}
            {metodePengiriman === 'Via Kurir' && (
              <div style={{ marginTop: '8px' }}>
                <label style={styles.inputLabel}>Alamat Pengiriman</label>
                <textarea
                  rows={2}
                  value={recipientData.alamat}
                  onChange={(e) =>
                    setRecipientData({ ...recipientData, alamat: e.target.value })
                  }
                  style={styles.checkoutTextarea}
                  placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota"
                />
              </div>
            )}

            {metodePengiriman === 'Ambil di RSQ Pusat' && (
              <div className="rsq-office-card" style={styles.rsqOfficeCard}>
                <div style={styles.rsqOfficeHeader}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 19, color: '#23573c' }} />
                  <span style={styles.rsqOfficeTitle}>Kantor Pusat RSQ</span>
                </div>
                <div style={styles.rsqOfficeContent}>
                  <div className="rsq-office-item" style={styles.rsqOfficeItem}>
                    <span className="rsq-office-label" style={styles.rsqOfficeLabel}>Alamat</span>
                    <span className="rsq-office-colon" style={styles.rsqOfficeColon}>:</span>
                    <span className="rsq-office-text" style={styles.rsqOfficeText}>
                      Tiban Bukit Asri B no.20 RT 1 RW X, Kel. Tiban Baru, Kec. Sekupang, 29424
                    </span>
                  </div>
                  <div className="rsq-office-item" style={styles.rsqOfficeItem}>
                    <span className="rsq-office-label" style={styles.rsqOfficeLabel}>Telepon</span>
                    <span className="rsq-office-colon" style={styles.rsqOfficeColon}>:</span>
                    <span className="rsq-office-text" style={styles.rsqOfficeText}>+62 852-7853-0536</span>
                  </div>
                  <div className="rsq-office-item" style={styles.rsqOfficeItem}>
                    <span className="rsq-office-label" style={styles.rsqOfficeLabel}>Email</span>
                    <span className="rsq-office-colon" style={styles.rsqOfficeColon}>:</span>
                    <span className="rsq-office-text" style={styles.rsqOfficeText}>info@rumahsahabatquran.com</span>
                  </div>
                  <div className="rsq-office-item" style={styles.rsqOfficeItem}>
                    <span className="rsq-office-label" style={styles.rsqOfficeLabel}>Jam operasional</span>
                    <span className="rsq-office-colon" style={styles.rsqOfficeColon}>:</span>
                    <span className="rsq-office-text" style={styles.rsqOfficeText}>Senin – Sabtu, Pukul 08:00 – 17:00 WIB</span>
                  </div>
                </div>
              </div>
            )}

            {metodePengiriman === 'Titip ke Ustazah' && (
              <div style={{ marginTop: '8px' }}>
                <label style={styles.inputLabel}>Nama Ustazah</label>
                <input
                  type="text"
                  value={namaUstazah}
                  onChange={(e) => setNamaUstazah(e.target.value)}
                  style={styles.checkoutInput}
                  placeholder="Contoh: Ustazah Fatimah Azzahra"
                />
              </div>
            )}
          </div>

          {/* Metode Pembayaran */}
          <div style={styles.checkoutSection}>
            <h4 style={styles.checkoutSectionTitle}>
              <span style={styles.sectionTitleIndicator} />
              Metode Pembayaran
            </h4>
            <div style={styles.methodGrid}>
              {/* Transfer Bank */}
              <div
                onClick={() => handleSelectMetodeBayar('Transfer Bank')}
                style={{
                  ...styles.methodCard,
                  border: metodeBayar === 'Transfer Bank' ? '1px solid #23573c' : '1px solid #e2e8f0',
                  backgroundColor: metodeBayar === 'Transfer Bank' ? '#f0fdf4' : '#ffffff',
                  boxShadow: 'none'
                }}
              >
                <div style={styles.methodCardHeader}>
                  <span style={styles.methodCardTitle}>Transfer Bank</span>
                  <div
                    style={{
                      ...styles.methodRadioDot,
                      border: metodeBayar === 'Transfer Bank' ? '1.5px solid #23573c' : '1.5px solid #cbd5e1',
                      backgroundColor: metodeBayar === 'Transfer Bank' ? '#23573c' : '#ffffff'
                    }}
                  >
                    {metodeBayar === 'Transfer Bank' && <div style={styles.methodRadioInner} />}
                  </div>
                </div>
              </div>

              {/* Tunai */}
              <div
                onClick={() => handleSelectMetodeBayar('Tunai')}
                style={{
                  ...styles.methodCard,
                  border: metodeBayar === 'Tunai' ? '1px solid #23573c' : '1px solid #e2e8f0',
                  backgroundColor: metodeBayar === 'Tunai' ? '#f0fdf4' : '#ffffff',
                  boxShadow: 'none'
                }}
              >
                <div style={styles.methodCardHeader}>
                  <span style={styles.methodCardTitle}>
                    Tunai / Cash
                  </span>
                  <div
                    style={{
                      ...styles.methodRadioDot,
                      border: metodeBayar === 'Tunai' ? '1.5px solid #23573c' : '1.5px solid #cbd5e1',
                      backgroundColor: metodeBayar === 'Tunai' ? '#23573c' : '#ffffff'
                    }}
                  >
                    {metodeBayar === 'Tunai' && <div style={styles.methodRadioInner} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Pembayaran */}
            {metodeBayar === 'Transfer Bank' ? (
              <div style={styles.bankInfoCard}>
                <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#166534' }}>
                  BANK SYARIAH INDONESIA (BSI)
                </span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f291e', letterSpacing: '0.8px' }}>
                  1155770003
                </div>
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  a.n. <strong>Rumah Sahabat Quran Batam</strong>
                </div>

                {/* Bukti Transfer */}
                <div style={styles.uploadTfSection}>
                  <div style={styles.uploadTfHeader}>
                    <span style={styles.uploadTfTitle}>Bukti Transfer</span>
                  </div>

                  {buktiTransfer ? (
                    <div style={styles.uploadTfPreviewWrap}>
                      <img
                        src={buktiTransfer}
                        alt="Bukti Transfer"
                        style={styles.uploadTfPreviewImg}
                      />
                      <div style={styles.uploadTfPreviewActions}>
                        <label style={styles.btnGantiBukti}>
                          Ganti Foto
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleHapusBukti}
                          style={styles.btnHapusBukti}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={styles.uploadTfDropzone}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#23573c" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div style={styles.uploadTfTextWrap}>
                        <span style={styles.uploadTfPromptBold}>Klik untuk unggah struk / bukti transfer</span>
                        <span style={styles.uploadTfPromptSub}>Format: JPG, JPEG, PNG (Maks. 5MB)</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.methodInfoBox}>
                <div style={{ fontWeight: '700', color: '#166534', marginBottom: '2px' }}>
                  Pembayaran Tunai:
                </div>
                <div>
                  Pembayaran dapat diserahkan langsung saat mengambil modul di RSQ Pusat
                </div>
              </div>
            )}
          </div>

          {/* Modul Dipesan */}
          <div style={styles.checkoutSection}>
            <h4 style={styles.checkoutSectionTitle}>
              <span style={styles.sectionTitleIndicator} />
              Modul yang Dipesan
            </h4>
            <div style={styles.checkoutItemsList}>
              {localItems.map((item) => (
                <div key={item.id} className="checkout-item-card" style={styles.checkoutItemRow}>
                  <div style={styles.checkoutItemTitle}>{item.nama}</div>
                  <div style={styles.checkoutItemBottom}>
                    {canEditQty ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', flexShrink: 0, minWidth: 0 }}>
                        <div className="stepper-container-responsive" style={styles.stepperContainer}>
                          <button
                            type="button"
                            className="stepper-btn-responsive"
                            disabled={Number(item.qty) <= 1}
                            onClick={() => handleUpdateQty(item.id, (Number(item.qty) || 1) - 1)}
                            style={{
                              ...styles.btnStepper,
                              opacity: Number(item.qty) <= 1 ? 0.35 : 1,
                              cursor: Number(item.qty) <= 1 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label="Kurang"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            className="stepper-input-responsive"
                            value={item.qty}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleUpdateQty(item.id, val);
                            }}
                            onBlur={() => {
                              if (!item.qty || Number(item.qty) < 1) {
                                handleUpdateQty(item.id, 1);
                              }
                            }}
                            style={styles.stepperInput}
                            aria-label="Jumlah"
                          />
                          <button
                            type="button"
                            className="stepper-btn-responsive"
                            onClick={() => {
                              const maxStok = item.stok || 999;
                              if (Number(item.qty) >= maxStok) {
                                showToast('Jumlah melebihi sisa stok');
                                return;
                              }
                              handleUpdateQty(item.id, (Number(item.qty) || 1) + 1);
                            }}
                            style={{
                              ...styles.btnStepper,
                              opacity: item.stok && Number(item.qty) >= item.stok ? 0.35 : 1,
                              cursor: item.stok && Number(item.qty) >= item.stok ? 'not-allowed' : 'pointer'
                            }}
                            aria-label="Tambah"
                          >
                            +
                          </button>
                        </div>
                        <span className="checkout-item-qty-price" style={styles.checkoutItemQtyPrice}>
                          x {formatRupiah(item.hargaJual)}
                        </span>
                      </div>
                    ) : (
                      <span className="checkout-item-qty-price" style={styles.checkoutItemQtyPrice}>
                        {item.qty} x {formatRupiah(item.hargaJual)}
                      </span>
                    )}

                    <span className="checkout-item-total" style={styles.checkoutItemTotal}>
                      {formatRupiah(item.hargaJual * (Number(item.qty) || 1))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Biaya */}
          <div style={styles.checkoutSummaryCard}>
            <div style={styles.checkoutSummaryRow}>
              <span>Biaya Pengiriman</span>
              {biayaKirim > 0 ? (
                <span style={{ fontWeight: '700', color: '#0f172a' }}>
                  {formatRupiah(biayaKirim)}
                </span>
              ) : (
                <span style={{ color: '#16a34a', fontWeight: '700' }}>Gratis</span>
              )}
            </div>
            <div style={styles.checkoutTotalRow}>
              <span>Total Pembayaran</span>
              <span style={styles.checkoutTotalValue}>
                {formatRupiah(totalPembayaran)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            style={styles.btnBatalCheckout}
          >
            Batal
          </button>
          <button
            id="btn-konfirmasi-buat-pesanan"
            type="button"
            onClick={handleConfirmOrder}
            style={styles.btnKonfirmasiPesanan}
          >
            <span>Buat Pesanan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
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
    zIndex: 10000,
    padding: '18px',
    overscrollBehavior: 'contain'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    width: '600px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  modalHeaderTitle: {
    fontSize: '16.5px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  modalHeaderSub: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
    display: 'block'
  },
  btnCloseModal: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px'
  },
  modalBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    overflowY: 'auto',
    overscrollBehavior: 'contain'
  },
  checkoutSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  checkoutSectionHeaderWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkoutSectionTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0
  },
  sectionTitleIndicator: {
    width: '4px',
    height: '14px',
    borderRadius: '2px',
    backgroundColor: '#23573c',
    display: 'inline-block'
  },
  badgeModulCount: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#23573c',
    backgroundColor: '#eaf4ee',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  checkoutFormGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  inputLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#475569',
    display: 'block',
    marginBottom: '4px'
  },
  checkoutInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  checkoutTextarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  methodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px'
  },
  methodCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.18s ease',
    userSelect: 'none'
  },
  methodCardActive: {
    border: '1px solid #23573c',
    backgroundColor: '#f0fdf4',
    boxShadow: 'none'
  },
  methodCardDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    boxShadow: 'none'
  },
  methodCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  methodCardTitle: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  methodCardDesc: {
    fontSize: '11px',
    color: '#64748b',
    lineHeight: '1.35',
    marginTop: '2px'
  },
  methodRadioDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  methodRadioDotActive: {
    border: '1.5px solid #23573c',
    backgroundColor: '#23573c'
  },
  methodRadioInner: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#ffffff'
  },
  methodInfoBox: {
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
    color: '#334155',
    lineHeight: '1.5',
    marginTop: '6px'
  },
  rsqOfficeCard: {
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: '#f2f8f4',
    border: '1.2px solid #b7dfc8',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  rsqOfficeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  rsqOfficeTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1b4332'
  },
  rsqOfficeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
    lineHeight: '1.5'
  },
  rsqOfficeItem: {
    display: 'flex',
    gap: '6px',
    alignItems: 'flex-start'
  },
  rsqOfficeLabel: {
    fontWeight: '700',
    color: '#2d6a4f',
    width: '95px',
    flexShrink: 0,
    fontSize: '11.5px'
  },
  rsqOfficeColon: {
    fontWeight: '700',
    color: '#2d6a4f',
    width: '6px',
    flexShrink: 0,
    textAlign: 'center'
  },
  rsqOfficeText: {
    flex: 1,
    minWidth: 0,
    color: '#334155',
    fontSize: '11.5px',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere'
  },
  bankInfoCard: {
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '6px'
  },
  uploadTfSection: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px dashed #bbf7d0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  uploadTfHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '4px'
  },
  uploadTfTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#166534'
  },
  uploadTfHint: {
    fontSize: '11px',
    color: '#64748b'
  },
  uploadTfDropzone: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1.5px dashed #86efac',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  uploadTfTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  uploadTfPromptBold: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#166534'
  },
  uploadTfPromptSub: {
    fontSize: '10.5px',
    color: '#64748b'
  },
  uploadTfPreviewWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #bbf7d0'
  },
  uploadTfPreviewImg: {
    width: '54px',
    height: '54px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e2e8f0'
  },
  uploadTfPreviewActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnGantiBukti: {
    padding: '5px 12px',
    borderRadius: '6px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  btnHapusBukti: {
    padding: '5px 12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    backgroundColor: '#fff5f5',
    color: '#dc2626',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  checkoutItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkoutItemRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px 12px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  checkoutItemTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.4',
    wordBreak: 'break-word'
  },
  checkoutItemBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
    flexWrap: 'nowrap',
    minWidth: 0
  },
  checkoutItemQtyPrice: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  checkoutItemTotal: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1b4332',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    flexShrink: 0
  },
  btnStepper: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: 'none',
    color: '#334155',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    userSelect: 'none'
  },
  stepperInput: {
    width: '28px',
    height: '24px',
    textAlign: 'center',
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: '1px solid #cbd5e1',
    borderRight: '1px solid #cbd5e1',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    outline: 'none',
    padding: 0
  },
  checkoutSummaryCard: {
    backgroundColor: '#f2f8f4',
    borderRadius: '10px',
    padding: '10px 14px',
    border: '1px solid #cce5d6',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  checkoutSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#475569'
  },
  checkoutTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#0f291e'
  },
  checkoutTotalValue: {
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '800'
  },
  modalFooter: {
    padding: '14px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    backgroundColor: '#f8fafc'
  },
  btnBatalCheckout: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnKonfirmasiPesanan: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.28)'
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 22px',
    borderRadius: '10px',
    color: '#ffffff',
    backgroundColor: '#dc2626',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
  }
};
