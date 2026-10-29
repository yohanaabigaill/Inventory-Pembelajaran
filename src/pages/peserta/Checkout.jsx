import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Ambil data items dari location.state atau sessionStorage
  const [checkoutItems, setCheckoutItems] = useState(() => {
    if (location.state?.items && location.state.items.length > 0) {
      try {
        sessionStorage.setItem('inventory_checkout_items', JSON.stringify(location.state.items));
        if (location.state.from) {
          sessionStorage.setItem('inventory_checkout_from', location.state.from);
        }
        if (location.state.canEditQty !== undefined) {
          sessionStorage.setItem('inventory_checkout_can_edit', String(location.state.canEditQty));
        } else if (location.state.from) {
          sessionStorage.setItem('inventory_checkout_can_edit', String(location.state.from === 'katalog'));
        }
      } catch (e) {
        console.error(e);
      }
      return location.state.items.map((it) => ({ ...it, qty: Number(it.qty) || 1 }));
    }

    try {
      const saved = sessionStorage.getItem('inventory_checkout_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((it) => ({ ...it, qty: Number(it.qty) || 1 }));
        }
      }
    } catch (e) {
      console.error(e);
    }

    return [];
  });

  const fromSource = location.state?.from || sessionStorage.getItem('inventory_checkout_from') || 'keranjang';
  const canEditQty =
    location.state?.canEditQty !== undefined
      ? location.state.canEditQty
      : (sessionStorage.getItem('inventory_checkout_can_edit') === 'true' || fromSource === 'katalog');

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
  const [bankTujuan] = useState('BSI');
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const namaInputRef = useRef(null);
  const noHpInputRef = useRef(null);
  const alamatInputRef = useRef(null);
  const ustazahInputRef = useRef(null);

  // State error validasi form
  const [formErrors, setFormErrors] = useState({});

  // State loading saat buat pesanan
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTimeoutRef = useRef(null);

  // Toast Notifikasi
  const [toastNotification, setToastNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastNotification({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastNotification(null);
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Upload bukti transfer
  const handleFileUpload = (e) => {
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
      setBuktiTransfer(reader.result);
      showToast('Bukti transfer berhasil diunggah', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleHapusBukti = () => {
    setBuktiTransfer(null);
    showToast('Bukti transfer berhasil dihapus', 'success');
  };

  // Salin no rekening
  const handleCopyRekening = () => {
    navigator.clipboard?.writeText('1155770003');
    setCopiedBank(true);
    showToast('Nomor rekening berhasil disalin', 'success');
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // Switch Pengiriman & Pembayaran
  const isCashAvailable =
    metodePengiriman === 'Ambil di RSQ Pusat' || metodePengiriman === 'Titip ke Ustazah';

  const handleSelectMetodePengiriman = (metode) => {
    setMetodePengiriman(metode);
    if (metode === 'Via Kurir' && metodeBayar === 'Tunai') {
      setMetodeBayar('Transfer Bank');
    }
    setFormErrors((prev) => ({ ...prev, alamat: null, namaUstazah: null }));
  };

  const handleSelectMetodeBayar = (metode) => {
    if (metode === 'Tunai' && !isCashAvailable) {
      showToast('Pembayaran tunai tidak tersedia untuk pengiriman via kurir', 'error');
      return;
    }
    setMetodeBayar(metode);
  };

  // Update Qty
  const handleUpdateQty = (itemId, newQty) => {
    setCheckoutItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (newQty === '') return { ...item, qty: '' };
          const parsed = Number(newQty);
          const maxStok = item.stok || 999;
          if (parsed > maxStok) {
            showToast('Jumlah melebihi sisa stok', 'error');
          }
          const clamped = Math.max(1, Math.min(parsed, maxStok));
          return { ...item, qty: clamped };
        }
        return item;
      })
    );
  };

  // Hitung Biaya
  const biayaKirim = metodePengiriman === 'Via Kurir' ? 10000 : 0;
  const subtotalModul = checkoutItems.reduce(
    (sum, it) => sum + (it.hargaJual || 0) * (Number(it.qty) || 1),
    0
  );
  const totalPembayaran = subtotalModul + biayaKirim;
  const totalItemCount = checkoutItems.reduce(
    (sum, it) => sum + (Number(it.qty) || 1),
    0
  );

  // Buat Pesanan
  const handleConfirmOrder = () => {
    if (isSubmitting) return;

    if (checkoutItems.length === 0) {
      showToast('Tidak ada item yang dipesan', 'error');
      return;
    }

    const errors = {};

    if (!recipientData.nama.trim()) {
      errors.nama = 'Nama pembeli wajib diisi';
    }

    if (!recipientData.noHp.trim()) {
      errors.noHp = 'Nomor WhatsApp / Hp wajib diisi';
    } else if (recipientData.noHp.length < 10 || recipientData.noHp.length > 13) {
      errors.noHp = 'Nomor WhatsApp / Hp harus 10 - 13 digit angka';
    }

    if (metodePengiriman === 'Via Kurir' && !recipientData.alamat.trim()) {
      errors.alamat = 'Alamat pengiriman wajib diisi';
    }

    if (metodePengiriman === 'Titip ke Ustazah' && !namaUstazah.trim()) {
      errors.namaUstazah = 'Nama ustazah wajib diisi';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Mohon lengkapi isian formulir pemesanan', 'error');

      // Auto-focus & scroll ke kolom pertama yang error
      if (errors.nama) {
        namaInputRef.current?.focus();
        namaInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errors.noHp) {
        noHpInputRef.current?.focus();
        noHpInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errors.alamat) {
        alamatInputRef.current?.focus();
        alamatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errors.namaUstazah) {
        ustazahInputRef.current?.focus();
        ustazahInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const finalItems = checkoutItems.map((it) => ({
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

    // Bersihkan cart di localStorage jika pesanan berasal dari keranjang
    try {
      const savedCart = localStorage.getItem('inventory_rsq_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const orderedIds = new Set(finalItems.map((it) => it.id));
        const updatedCart = parsed.filter((item) => !orderedIds.has(item.id));
        localStorage.setItem('inventory_rsq_cart', JSON.stringify(updatedCart));
      }
      sessionStorage.removeItem('inventory_checkout_items');
      sessionStorage.removeItem('inventory_checkout_from');
    } catch (e) {
      console.error(e);
    }

    // Tampilkan notifikasi toast pesanan berhasil dibuat
    showToast('Pesanan berhasil dibuat', 'success');

    // Beri jeda 2 detik sebelum diarahkan ke halaman pesanan saya
    redirectTimeoutRef.current = setTimeout(() => {
      window.scrollTo(0, 0);
      navigate('/pesanan', { state: { newOrder } });
    }, 2000);
  };

  return (
    <div style={styles.layoutContainer}>
      <Sidebar
        role="peserta"
        activeMenu=""
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title="Konfirmasi Pemesanan"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="checkout-main-container" style={styles.contentBody}>
          {/* Toast */}
          {toastNotification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor: toastNotification.type === 'success' ? '#23573c' : '#dc2626'
              }}
            >
              {toastNotification.type === 'success' ? (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{toastNotification.message}</span>
            </div>
          )}

          {/* Tombol Kembali & Header Halaman */}
          <div style={styles.pageHeaderBar}>
            <button
              type="button"
              onClick={() => {
                if (fromSource === 'katalog') {
                  navigate('/katalog-modul');
                } else {
                  navigate('/keranjang');
                }
              }}
              style={styles.btnKembali}
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
              <span>
                {fromSource === 'katalog' ? 'Kembali ke Katalog' : 'Kembali ke Keranjang'}
              </span>
            </button>
          </div>

          {checkoutItems.length === 0 ? (
            /* State kosong jika tidak ada item */
            <div style={styles.emptyCard}>
              <div style={styles.emptyIconWrap}>
                <RemoveShoppingCartOutlinedIcon sx={{ fontSize: 56, color: '#94a3b8' }} />
              </div>
              <h3 style={styles.emptyTitle}>Tidak Ada Modul untuk Dipesan</h3>
              <p style={styles.emptySubtitle}>
                Silakan pilih modul terlebih dahulu di katalog atau keranjang Anda.
              </p>
              <button
                type="button"
                onClick={() => navigate('/katalog-modul')}
                style={styles.btnPrimaryLg}
              >
                Jelajahi Katalog Modul
              </button>
            </div>
          ) : (
            /* Checkout 1 Kolom */
            <div className="checkout-single-column" style={styles.singleColumnContainer}>
              {/* 1. Informasi Pembeli */}
              <div style={styles.sectionCard}>
                  <div style={styles.sectionCardHeader}>
                    <div style={styles.sectionIconBadge}>
                      <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                    </div>
                    <div>
                      <h2 style={styles.sectionHeading}>Informasi Pembeli</h2>
                    </div>
                  </div>

                  <div className="checkout-form-row-grid" style={styles.formRowGrid}>
                    <div>
                      <label style={styles.inputLabel}>
                        Nama Pembeli <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        ref={namaInputRef}
                        type="text"
                        value={recipientData.nama}
                        onChange={(e) => {
                          setRecipientData({ ...recipientData, nama: e.target.value });
                          if (formErrors.nama) {
                            setFormErrors((prev) => ({ ...prev, nama: null }));
                          }
                        }}
                        style={{
                          ...styles.formInput,
                          borderColor: formErrors.nama ? '#ef4444' : '#cbd5e1'
                        }}
                        placeholder="Masukkan nama lengkap"
                      />
                      {formErrors.nama && (
                        <div style={styles.fieldErrorText}>{formErrors.nama}</div>
                      )}
                    </div>
                    <div>
                      <label style={styles.inputLabel}>
                        No. WhatsApp / HP <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        ref={noHpInputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={13}
                        value={recipientData.noHp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 13) {
                            setRecipientData({ ...recipientData, noHp: val });
                          }
                          if (formErrors.noHp) {
                            setFormErrors((prev) => ({ ...prev, noHp: null }));
                          }
                        }}
                        style={{
                          ...styles.formInput,
                          borderColor: formErrors.noHp ? '#ef4444' : '#cbd5e1'
                        }}
                        placeholder="Contoh: 081234567890"
                      />
                      {formErrors.noHp && (
                        <div style={styles.fieldErrorText}>{formErrors.noHp}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Metode Pengiriman */}
                <div style={styles.sectionCard}>
                  <div style={styles.sectionCardHeader}>
                    <div style={styles.sectionIconBadge}>
                      <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                    </div>
                    <div>
                      <h2 style={styles.sectionHeading}>Metode Pengiriman</h2>
                    </div>
                  </div>

                  {/* Pilihan Metode Pengiriman */}
                  <div style={styles.optionsGrid}>
                    {/* Via Kurir */}
                    <div
                      onClick={() => handleSelectMetodePengiriman('Via Kurir')}
                      style={{
                        ...styles.optionCard,
                        borderColor: metodePengiriman === 'Via Kurir' ? '#23573c' : '#e2e8f0',
                        backgroundColor: metodePengiriman === 'Via Kurir' ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div style={styles.optionCardTop}>
                        <div style={styles.optionTitleRow}>
                          <LocalShippingOutlinedIcon
                            sx={{
                              fontSize: 20,
                              color: metodePengiriman === 'Via Kurir' ? '#23573c' : '#64748b'
                            }}
                          />
                          <span style={styles.optionTitle}>Via Kurir</span>
                        </div>
                        <div
                          style={{
                            ...styles.radioCircle,
                            borderColor: metodePengiriman === 'Via Kurir' ? '#23573c' : '#cbd5e1',
                            backgroundColor: metodePengiriman === 'Via Kurir' ? '#23573c' : '#ffffff'
                          }}
                        >
                          {metodePengiriman === 'Via Kurir' && <div style={styles.radioInner} />}
                        </div>
                      </div>
                      <span style={styles.optionPriceBadge}>+ Rp 10.000</span>
                    </div>

                    {/* Ambil di RSQ */}
                    <div
                      onClick={() => handleSelectMetodePengiriman('Ambil di RSQ Pusat')}
                      style={{
                        ...styles.optionCard,
                        borderColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#23573c' : '#e2e8f0',
                        backgroundColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div style={styles.optionCardTop}>
                        <div style={styles.optionTitleRow}>
                          <StorefrontOutlinedIcon
                            sx={{
                              fontSize: 20,
                              color: metodePengiriman === 'Ambil di RSQ Pusat' ? '#23573c' : '#64748b'
                            }}
                          />
                          <span style={styles.optionTitle}>Ambil di RSQ</span>
                        </div>
                        <div
                          style={{
                            ...styles.radioCircle,
                            borderColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#23573c' : '#cbd5e1',
                            backgroundColor: metodePengiriman === 'Ambil di RSQ Pusat' ? '#23573c' : '#ffffff'
                          }}
                        >
                          {metodePengiriman === 'Ambil di RSQ Pusat' && <div style={styles.radioInner} />}
                        </div>
                      </div>
                      <span style={styles.optionFreeBadge}>Gratis Biaya Kirim</span>
                    </div>

                    {/* Titip ke Ustazah */}
                    <div
                      onClick={() => handleSelectMetodePengiriman('Titip ke Ustazah')}
                      style={{
                        ...styles.optionCard,
                        borderColor: metodePengiriman === 'Titip ke Ustazah' ? '#23573c' : '#e2e8f0',
                        backgroundColor: metodePengiriman === 'Titip ke Ustazah' ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div style={styles.optionCardTop}>
                        <div style={styles.optionTitleRow}>
                          <PersonOutlineOutlinedIcon
                            sx={{
                              fontSize: 20,
                              color: metodePengiriman === 'Titip ke Ustazah' ? '#23573c' : '#64748b'
                            }}
                          />
                          <span style={styles.optionTitle}>Titip Ustazah</span>
                        </div>
                        <div
                          style={{
                            ...styles.radioCircle,
                            borderColor: metodePengiriman === 'Titip ke Ustazah' ? '#23573c' : '#cbd5e1',
                            backgroundColor: metodePengiriman === 'Titip ke Ustazah' ? '#23573c' : '#ffffff'
                          }}
                        >
                          {metodePengiriman === 'Titip ke Ustazah' && <div style={styles.radioInner} />}
                        </div>
                      </div>
                      <span style={styles.optionFreeBadge}>Gratis Biaya Kirim</span>
                    </div>
                  </div>

                  {/* Detail Tambahan Berdasarkan Pilihan Pengiriman */}
                  {metodePengiriman === 'Via Kurir' && (
                    <div style={styles.deliveryDetailBox}>
                      <label style={styles.inputLabel}>
                        Alamat Pengiriman Lengkap <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <textarea
                        ref={alamatInputRef}
                        rows={3}
                        value={recipientData.alamat}
                        onChange={(e) => {
                          setRecipientData({ ...recipientData, alamat: e.target.value });
                          if (formErrors.alamat) {
                            setFormErrors((prev) => ({ ...prev, alamat: null }));
                          }
                        }}
                        style={{
                          ...styles.formTextarea,
                          borderColor: formErrors.alamat ? '#ef4444' : '#cbd5e1'
                        }}
                        placeholder="Contoh: Jl. Melati No. 45, RT 02/RW 05, Kelurahan Tiban Baru, Kec. Sekupang, Kota Batam"
                      />
                      {formErrors.alamat && (
                        <div style={styles.fieldErrorText}>{formErrors.alamat}</div>
                      )}
                    </div>
                  )}

                  {metodePengiriman === 'Ambil di RSQ Pusat' && (
                    <div style={styles.rsqOfficeBox}>
                      <div style={styles.rsqOfficeHeader}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, color: '#23573c' }} />
                        <span style={styles.rsqOfficeHeading}>Kantor Pusat RSQ</span>
                      </div>
                      <div style={styles.rsqOfficeList}>
                        <div style={styles.rsqOfficeRow}>
                          <span style={styles.rsqOfficeRowLabel}>Alamat</span>
                          <span style={styles.rsqOfficeRowColon}>:</span>
                          <span style={styles.rsqOfficeRowVal}>
                            Tiban Bukit Asri B no.20 RT 1 RW X, Kel. Tiban Baru, Kec. Sekupang, 29424
                          </span>
                        </div>
                        <div style={styles.rsqOfficeRow}>
                          <span style={styles.rsqOfficeRowLabel}>Telepon</span>
                          <span style={styles.rsqOfficeRowColon}>:</span>
                          <span style={styles.rsqOfficeRowVal}>+62 852-7853-0536</span>
                        </div>
                        <div style={styles.rsqOfficeRow}>
                          <span style={styles.rsqOfficeRowLabel}>Email</span>
                          <span style={styles.rsqOfficeRowColon}>:</span>
                          <span style={styles.rsqOfficeRowVal}>info@rumahsahabatquran.com</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {metodePengiriman === 'Titip ke Ustazah' && (
                    <div style={styles.deliveryDetailBox}>
                      <label style={styles.inputLabel}>
                        Nama Ustazah <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        ref={ustazahInputRef}
                        type="text"
                        value={namaUstazah}
                        onChange={(e) => {
                          setNamaUstazah(e.target.value);
                          if (formErrors.namaUstazah) {
                            setFormErrors((prev) => ({ ...prev, namaUstazah: null }));
                          }
                        }}
                        style={{
                          ...styles.formInput,
                          borderColor: formErrors.namaUstazah ? '#ef4444' : '#cbd5e1'
                        }}
                        placeholder="Contoh: Ustazah Fatimah Azzahra"
                      />
                      {formErrors.namaUstazah && (
                        <div style={styles.fieldErrorText}>{formErrors.namaUstazah}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Metode Pembayaran */}
                <div style={styles.sectionCard}>
                  <div style={styles.sectionCardHeader}>
                    <div style={styles.sectionIconBadge}>
                      <PaymentsOutlinedIcon sx={{ fontSize: 18, color: '#23573c' }} />
                    </div>
                    <div>
                      <h2 style={styles.sectionHeading}>Metode Pembayaran</h2>
                    </div>
                  </div>

                  {/* Pilihan Metode Pembayaran */}
                  <div style={styles.optionsGrid}>
                    {/* Transfer Bank */}
                    <div
                      onClick={() => handleSelectMetodeBayar('Transfer Bank')}
                      style={{
                        ...styles.optionCard,
                        borderColor: metodeBayar === 'Transfer Bank' ? '#23573c' : '#e2e8f0',
                        backgroundColor: metodeBayar === 'Transfer Bank' ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div style={styles.optionCardTop}>
                        <div style={styles.optionTitleRow}>
                          <AccountBalanceOutlinedIcon
                            sx={{
                              fontSize: 20,
                              color: metodeBayar === 'Transfer Bank' ? '#23573c' : '#64748b'
                            }}
                          />
                          <span style={styles.optionTitle}>Transfer Bank</span>
                        </div>
                        <div
                          style={{
                            ...styles.radioCircle,
                            borderColor: metodeBayar === 'Transfer Bank' ? '#23573c' : '#cbd5e1',
                            backgroundColor: metodeBayar === 'Transfer Bank' ? '#23573c' : '#ffffff'
                          }}
                        >
                          {metodeBayar === 'Transfer Bank' && <div style={styles.radioInner} />}
                        </div>
                      </div>
                      <span style={styles.optionSubtitle}>BSI (Bank Syariah Indonesia)</span>
                      <p style={styles.optionDesc}>Unggah struk atau bukti transfer untuk verifikasi</p>
                    </div>

                    {/* Tunai */}
                    <div
                      onClick={() => handleSelectMetodeBayar('Tunai')}
                      style={{
                        ...styles.optionCard,
                        borderColor: metodeBayar === 'Tunai' ? '#23573c' : '#e2e8f0',
                        backgroundColor: metodeBayar === 'Tunai' ? '#f0fdf4' : '#ffffff',
                        opacity: isCashAvailable ? 1 : 0.5,
                        cursor: isCashAvailable ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <div style={styles.optionCardTop}>
                        <div style={styles.optionTitleRow}>
                          <PaymentsOutlinedIcon
                            sx={{
                              fontSize: 20,
                              color: metodeBayar === 'Tunai' ? '#23573c' : '#64748b'
                            }}
                          />
                          <span style={styles.optionTitle}>Tunai / Cash</span>
                        </div>
                        <div
                          style={{
                            ...styles.radioCircle,
                            borderColor: metodeBayar === 'Tunai' ? '#23573c' : '#cbd5e1',
                            backgroundColor: metodeBayar === 'Tunai' ? '#23573c' : '#ffffff'
                          }}
                        >
                          {metodeBayar === 'Tunai' && <div style={styles.radioInner} />}
                        </div>
                      </div>
                      <span style={styles.optionSubtitle}>Bayar di Tempat</span>
                      <p style={styles.optionDesc}>
                        {isCashAvailable
                          ? 'Bayar langsung saat pengambilan di RSQ / ke Ustazah'
                          : 'Hanya untuk ambil di RSQ / Titip Ustazah'}
                      </p>
                    </div>
                  </div>

                  {/* Detail Transfer Bank & Bukti Transfer */}
                  {metodeBayar === 'Transfer Bank' ? (
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

                        {buktiTransfer ? (
                          <div className="proof-preview-card" style={styles.proofPreviewCard}>
                            <div style={{ position: 'relative', width: 'fit-content' }}>
                              <img
                                src={buktiTransfer}
                                alt="Bukti Transfer"
                                style={styles.proofPreviewImg}
                                onClick={() => setShowLightbox(true)}
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
                            <div style={styles.proofBtnGroup}>
                              <label style={styles.btnChangeProof}>
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
                                style={styles.btnDeleteProof}
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label style={styles.dropzoneWrap}>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg,image/webp"
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
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
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={styles.cashNoticeBox}>
                      <span style={styles.cashNoticeTitle}>Petunjuk Pembayaran Tunai:</span>
                      <p style={styles.cashNoticeText}>
                        Silakan siapkan uang tunai sesuai dengan total pembayaran saat mengambil modul di kantor RSQ Pusat atau ketika modul diserahkan oleh ustazah.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Daftar Modul & Rincian Pembayaran */}
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
                    {checkoutItems.map((item) => (
                      <div key={item.id} style={styles.summaryItemRow}>
                        {item.cover && (
                          <img
                            src={item.cover}
                            alt={item.nama}
                            style={styles.summaryItemThumb}
                          />
                        )}
                        <div style={styles.summaryItemInfo}>
                          {/* Baris 1: Nama Modul di kiri, Tombol Atur Qty di kanan */}
                          <div style={styles.summaryItemTopRow}>
                            <div style={styles.summaryItemTitle}>{item.nama}</div>
                            {canEditQty && (
                              <div style={styles.stepperContainer}>
                                <button
                                  type="button"
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
                                  onClick={() => {
                                    const maxStok = item.stok || 999;
                                    if (Number(item.qty) >= maxStok) {
                                      showToast('Jumlah melebihi sisa stok', 'error');
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
                            )}
                          </div>

                          {/* Baris 2: Harga Satuan di kiri, Total Harga di kanan */}
                          <div style={styles.summaryItemBottomRow}>
                            <span style={styles.summaryItemQtyPrice}>
                              {canEditQty
                                ? `x ${formatRupiah(item.hargaJual)}`
                                : `${item.qty} x ${formatRupiah(item.hargaJual)}`}
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
                      {biayaKirim > 0 ? (
                        <span style={styles.calcValue}>{formatRupiah(biayaKirim)}</span>
                      ) : (
                        <span style={styles.freeShippingTag}>Gratis</span>
                      )}
                    </div>

                    <div style={styles.totalPaymentRow}>
                      <span style={styles.totalPaymentLabel}>Total Tagihan</span>
                      <span style={styles.totalPaymentNumber}>
                        {formatRupiah(totalPembayaran)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Buat Pesanan */}
                  <div className="checkout-action-btn-group" style={styles.actionButtonGroup}>
                    <button
                      type="button"
                      className="btn-checkout-cancel"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (isSubmitting) return;
                        if (fromSource === 'katalog') {
                          navigate('/katalog-modul');
                        } else {
                          navigate('/keranjang');
                        }
                      }}
                      style={{
                        ...styles.btnCancelOrder,
                        ...(isSubmitting ? { opacity: 0.55, cursor: 'not-allowed' } : {})
                      }}
                    >
                      Batal
                    </button>
                    <button
                      id="btn-selesaikan-pesanan"
                      type="button"
                      className="btn-checkout-confirm"
                      onClick={handleConfirmOrder}
                      disabled={isSubmitting}
                      style={{
                        ...styles.btnConfirmOrder,
                        ...(isSubmitting
                          ? {
                              opacity: 0.82,
                              cursor: 'not-allowed'
                            }
                          : {})
                      }}
                    >
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                      <span>Buat Pesanan Sekarang</span>
                    </button>
                  </div>
                </div>
            </div>
          )}
        </main>
      </div>
      {/* Lightbox Preview Bukti Transfer */}
      {showLightbox && buktiTransfer && (
        <div
          style={styles.lightboxOverlay}
          onClick={() => setShowLightbox(false)}
        >
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              style={styles.lightboxCloseBtn}
            >
              ✕
            </button>
            <img
              src={buktiTransfer}
              alt="Preview Bukti Transfer"
              style={styles.lightboxImg}
            />
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
    fontFamily: "'Poppins', sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    minWidth: 0
  },
  contentBody: {
    flex: 1,
    padding: '24px 32px 40px',
    width: '100%',
    boxSizing: 'border-box'
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
    fontWeight: '800',
    color: '#0f291e',
    margin: 0,
    letterSpacing: '-0.3px'
  },
  pageSubtitle: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5'
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '60px 24px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  emptyIconWrap: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  emptySubtitle: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: 0,
    maxWidth: '400px'
  },
  btnPrimaryLg: {
    marginTop: '12px',
    padding: '11px 24px',
    borderRadius: '10px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.28)'
  },
  singleColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%'
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '22px 24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sectionIconBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
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
  sectionSubHeading: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    display: 'block'
  },
  formRowGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px'
  },
  inputLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    display: 'block',
    marginBottom: '6px'
  },
  formInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '9px',
    border: '1.2px solid #cbd5e1',
    fontSize: '13.5px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease'
  },
  formTextarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '9px',
    border: '1.2px solid #cbd5e1',
    fontSize: '13.5px',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.15s ease'
  },
  fieldErrorText: {
    fontSize: '11.5px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '4px'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  optionCard: {
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    transition: 'all 0.18s ease',
    userSelect: 'none'
  },
  optionCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  optionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  optionTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  optionSubtitle: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#23573c'
  },
  optionPriceBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: '#e2e8f0',
    padding: '2px 8px',
    borderRadius: '6px',
    width: 'fit-content'
  },
  optionFreeBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#166534',
    backgroundColor: '#dcfce7',
    padding: '2px 8px',
    borderRadius: '6px',
    width: 'fit-content'
  },
  optionDesc: {
    fontSize: '11px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4'
  },
  radioCircle: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  radioInner: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#ffffff'
  },
  deliveryDetailBox: {
    marginTop: '6px'
  },
  rsqOfficeBox: {
    marginTop: '6px',
    padding: '14px 16px',
    borderRadius: '12px',
    backgroundColor: '#f2f8f4',
    border: '1.2px solid #b7dfc8',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  rsqOfficeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rsqOfficeHeading: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#1b4332'
  },
  rsqOfficeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12.5px',
    lineHeight: '1.5'
  },
  rsqOfficeRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start'
  },
  rsqOfficeRowLabel: {
    fontWeight: '700',
    color: '#2d6a4f',
    width: '65px',
    flexShrink: 0,
    fontSize: '12px'
  },
  rsqOfficeRowColon: {
    fontWeight: '700',
    color: '#2d6a4f',
    width: '6px',
    flexShrink: 0,
    textAlign: 'center'
  },
  rsqOfficeRowVal: {
    flex: 1,
    color: '#334155',
    fontSize: '12px',
    wordBreak: 'break-word'
  },
  bankDetailCard: {
    marginTop: '8px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f0fdf4',
    border: '1.2px solid #bbf7d0',
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
  uploadOptional: {
    fontSize: '11px',
    color: '#64748b'
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
  proofActionsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  proofMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  proofSuccessText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#166534'
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
  cashNoticeBox: {
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    marginTop: '8px'
  },
  cashNoticeTitle: {
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#166534',
    display: 'block',
    marginBottom: '2px'
  },
  cashNoticeText: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
    lineHeight: '1.45'
  },
  summaryCardSticky: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '22px 24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  summaryCardHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  summaryHeadLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  summaryHeadTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f291e',
    margin: 0
  },
  badgeItemCount: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#23573c',
    backgroundColor: '#eaf4ee',
    padding: '3px 8px',
    borderRadius: '6px'
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
  calculationSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '14px 16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
  calcDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '4px 0'
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
  taxInclusiveText: {
    fontSize: '11px',
    color: '#94a3b8',
    display: 'block'
  },
  totalPaymentNumber: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#23573c'
  },
  actionButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    width: '100%'
  },
  btnConfirmOrder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: 1,
    padding: '12px 18px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(35, 87, 60, 0.28)'
  },
  btnCancelOrder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '12px 18px',
    borderRadius: '10px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  securityFooterNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#64748b',
    textAlign: 'center',
    paddingTop: '4px'
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
    backgroundColor: '#23573c',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
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
  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 9999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    cursor: 'pointer'
  },
  lightboxContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    cursor: 'default'
  },
  lightboxCloseBtn: {
    position: 'absolute',
    top: '-16px',
    right: '-16px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1
  },
  lightboxImg: {
    maxWidth: '90vw',
    maxHeight: '85vh',
    objectFit: 'contain',
    borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
  }
};
