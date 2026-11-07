import contohBuktiTf from '../assets/contoh bukti tf.jpeg';
import coverAsasi from '../assets/asasi.jpg';
import coverTahmidi from '../assets/tahmidi.jpg';
import coverAlHisan1 from '../assets/alhisan1.jpg';
import coverUtsmani1 from '../assets/utsmani1.jpg';
import coverBukuDoa from '../assets/bukudoa.jpg';
import coverMushafAshShahibA5 from '../assets/mushaf_ash_shahib_a5.jpg';
import coverMushafAlKamilA5 from '../assets/mushaf_al_kamil_a5.jpg';
import coverMushafAshShahibA6 from '../assets/mushaf_ash_shahib_a6.jpg';

// Storage Key
const MODULS_STORAGE_KEY = 'inventory_rsq_moduls';
export const ORDERS_STORAGE_KEY = 'inventory_rsq_orders';

// Reset otomatis ke data demo awal saat aplikasi di-refresh
try {
  localStorage.removeItem(MODULS_STORAGE_KEY);
  localStorage.removeItem(ORDERS_STORAGE_KEY);
} catch (e) {
  // ignore
}

// Data Modul Awal
export const DEFAULT_MODULS = [
  {
    id: 1,
    nama: 'Asasi',
    kategori: 'Al Haqq',
    hpp: 40000,
    hargaJual: 40000,
    stokFisik: 86,
    stokReserved: 1,
    stok: 86,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverAsasi
  },
  {
    id: 2,
    nama: 'Tahmidi',
    kategori: 'Al Haqq',
    hpp: 40000,
    hargaJual: 40000,
    stokFisik: 60,
    stokReserved: 0,
    stok: 60,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverTahmidi
  },
  {
    id: 3,
    nama: 'Al Hisan 1',
    kategori: 'Al Hisan',
    hpp: 25000,
    hargaJual: 25000,
    stokFisik: 150,
    stokReserved: 0,
    stok: 150,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverAlHisan1
  },
  {
    id: 4,
    nama: 'Utsmani 1',
    kategori: 'Tahsin Usmani',
    hpp: 25000,
    hargaJual: 25000,
    stokFisik: 0,
    stokReserved: 0,
    stok: 0,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverUtsmani1
  },
  {
    id: 5,
    nama: 'Buku Doa',
    kategori: 'RSQ Kids',
    hpp: 15000,
    hargaJual: 15000,
    stokFisik: 4,
    stokReserved: 0,
    stok: 4,
    minRestock: 10,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverBukuDoa
  },
  {
    id: 6,
    nama: 'Mushaf Ash Shahib A5 Terjemah',
    kategori: 'Al Quran Wakaf',
    hpp: 115000,
    hargaJual: 115000,
    stokFisik: 220,
    stokReserved: 0,
    stok: 220,
    minRestock: 30,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverMushafAshShahibA5
  },
  {
    id: 7,
    nama: 'Mushaf Al Kamil A5 Terjemah',
    kategori: 'Al Quran',
    hpp: 115000,
    hargaJual: 115000,
    stokFisik: 115,
    stokReserved: 0,
    stok: 115,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverMushafAlKamilA5
  },
  {
    id: 8,
    nama: 'Mushaf Ash Shahib A6 Terjemah',
    kategori: 'Al Quran',
    hpp: 80000,
    hargaJual: 80000,
    stokFisik: 95,
    stokReserved: 0,
    stok: 95,
    minRestock: 20,
    allowPo: true,
    estimasiPo: '7-14 hari kerja',
    cover: coverMushafAshShahibA6
  }
];

// Helper Hitung Stok Tersedia
export const getStokTersedia = (modul) => {
  if (!modul) return 0;
  const fisik = Number(modul.stokFisik !== undefined ? modul.stokFisik : (modul.stok || 0));
  const reserved = Number(modul.stokReserved || 0);
  return Math.max(0, fisik - reserved);
};

// Ambil Data Modul dari Storage
export const getStoredModuls = () => {
  try {
    const raw = localStorage.getItem(MODULS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MODULS_STORAGE_KEY, JSON.stringify(DEFAULT_MODULS));
      return DEFAULT_MODULS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(MODULS_STORAGE_KEY, JSON.stringify(DEFAULT_MODULS));
      return DEFAULT_MODULS;
    }
    return parsed.map((m, idx) => {
      const fallback = DEFAULT_MODULS[idx] || {};
      const fisik = Number(m.stokFisik !== undefined ? m.stokFisik : (m.stok !== undefined ? m.stok : (fallback.stokFisik || 0)));
      const reserved = Number(m.stokReserved || 0);
      return {
        ...fallback,
        ...m,
        stokFisik: fisik,
        stokReserved: reserved,
        stok: fisik,
        cover: m.cover || fallback.cover
      };
    });
  } catch (e) {
    console.error('Gagal membaca data modul:', e);
    return DEFAULT_MODULS;
  }
};

// Simpan Data Modul ke Storage
export const saveStoredModuls = (moduls) => {
  try {
    localStorage.setItem(MODULS_STORAGE_KEY, JSON.stringify(moduls));
    window.dispatchEvent(new Event('inventory_moduls_updated'));
  } catch (e) {
    console.error('Gagal menyimpan data modul:', e);
  }
};

// Kurangi Stok Fisik & Stok Reserved Saat Pesanan Berubah Status Jadi "Dikirim"
export const potongStokSaatDikirim = (items = []) => {
  if (!items || items.length === 0) return;
  const currentModuls = getStoredModuls();

  const updated = currentModuls.map((m) => {
    // Cocokkan id atau nama modul
    const match = items.find(
      (it) => it.id === m.id || (it.nama && it.nama.trim().toLowerCase() === m.nama.trim().toLowerCase())
    );
    if (!match) return m;

    const qty = Number(match.qty) || 1;
    // Stok fisik berkurang saat dikirim
    const newFisik = Math.max(0, (m.stokFisik || 0) - qty);
    // Stok reserved juga berkurang karena barang sudah keluar
    const newReserved = Math.max(0, (m.stokReserved || 0) - qty);

    return {
      ...m,
      stokFisik: newFisik,
      stokReserved: newReserved,
      stok: newFisik
    };
  });

  saveStoredModuls(updated);
  return updated;
};

// Tambahkan Stok Reserved Saat Pesanan Masuk (Dipesan / Checkout)
export const cadangkanStokPesanan = (items = []) => {
  if (!items || items.length === 0) return;
  const currentModuls = getStoredModuls();

  const updated = currentModuls.map((m) => {
    const match = items.find(
      (it) => it.id === m.id || (it.nama && it.nama.trim().toLowerCase() === m.nama.trim().toLowerCase())
    );
    if (!match) return m;

    const qty = Number(match.qty) || 1;
    return {
      ...m,
      stokReserved: (m.stokReserved || 0) + qty
    };
  });

  saveStoredModuls(updated);
  return updated;
};

// Lepas Stok Reserved (dipesan) Saat Pesanan Dibatalkan
export const lepasCadanganStok = (items = []) => {
  if (!items || items.length === 0) return;
  const currentModuls = getStoredModuls();

  const updated = currentModuls.map((m) => {
    const match = items.find(
      (it) => it.id === m.id || (it.nama && it.nama.trim().toLowerCase() === m.nama.trim().toLowerCase())
    );
    if (!match) return m;

    const qty = Number(match.qty) || 1;
    return {
      ...m,
      stokReserved: Math.max(0, (m.stokReserved || 0) - qty)
    };
  });

  saveStoredModuls(updated);
  return updated;
};

// Tambah Stok Fisik Saat Modul Masuk
export const tambahStokFisikModul = (modulNamaOrId, qty) => {
  const currentModuls = getStoredModuls();
  const addedQty = Number(qty) || 0;

  const updated = currentModuls.map((m) => {
    const match = m.id === modulNamaOrId || m.nama.trim().toLowerCase() === String(modulNamaOrId).trim().toLowerCase();
    if (!match) return m;
    const newFisik = (m.stokFisik || 0) + addedQty;
    return {
      ...m,
      stokFisik: newFisik,
      stok: newFisik
    };
  });

  saveStoredModuls(updated);
  return updated;
};

// Baca Pesanan dari Storage
export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.error('Gagal membaca data pesanan:', e);
    return null;
  }
};

// Simpan Pesanan ke Storage
export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('inventory_orders_updated'));
  } catch (e) {
    console.error('Gagal menyimpan data pesanan:', e);
  }
};

// Tambah Pesanan Baru
export const simpanPesananBaru = (newOrder, fallback = []) => {
  try {
    const existing = getStoredOrders() || fallback || [];
    const filtered = existing.filter((o) => o.id !== newOrder.id);
    const updated = [newOrder, ...filtered];
    saveStoredOrders(updated);
    return updated;
  } catch (e) {
    console.error('Gagal menyimpan pesanan baru:', e);
  }
};

// Update Pesanan berdasarkan ID
export const updateStoredOrder = (updatedOrder) => {
  try {
    const existing = getStoredOrders() || [];
    const updated = existing.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    saveStoredOrders(updated);
    return updated;
  } catch (e) {
    console.error('Gagal memperbarui pesanan:', e);
  }
};
// Reset Semua Data Demo ke Kondisi Awal
export const resetAllDemoData = () => {
  try {
    localStorage.removeItem(MODULS_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    window.dispatchEvent(new Event('inventory_moduls_updated'));
    window.dispatchEvent(new Event('inventory_orders_updated'));
  } catch (e) {
    // ignore
  }
};

// Memory Cache Pesanan Sesi Aktif (Tahan saat pindah halaman/kembali, tapi otomatis reset saat Refresh F5)
let sessionOrdersCache = null;

export const getSessionOrders = (fallback = []) => {
  if (sessionOrdersCache !== null) {
    return sessionOrdersCache;
  }
  return fallback;
};

export const setSessionOrders = (orders) => {
  sessionOrdersCache = orders;
  window.dispatchEvent(new Event('inventory_orders_updated'));
};

export const addSessionOrder = (newOrder, fallback = []) => {
  const current = sessionOrdersCache !== null ? sessionOrdersCache : fallback;
  const filtered = current.filter((o) => o.id !== newOrder.id);
  sessionOrdersCache = [newOrder, ...filtered];
  window.dispatchEvent(new Event('inventory_orders_updated'));
  return sessionOrdersCache;
};

export const updateSessionOrder = (updatedOrder) => {
  if (!sessionOrdersCache) return;
  sessionOrdersCache = sessionOrdersCache.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
  window.dispatchEvent(new Event('inventory_orders_updated'));
};

// Data pesanan demo
export const INITIAL_DEMO_PESANAN = [
  // Belum Bayar
  {
    id: 'ORD-73305405',
    tanggal: '28/10/2026 14:41',
    status: 'Belum Bayar',
    statusPembayaran: 'Belum Bayar',
    statusPengiriman: null,
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    namaPenerima: 'Ahmad Fauzi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: null,
    biayaKirim: 10000,
    items: [
      {
        id: 4,
        nama: 'Mushaf Ash Shahib A5 Terjemah',
        kategori: 'Mushaf',
        hargaJual: 115000,
        qty: 1,
        cover: coverMushafAshShahibA5
      }
    ],
    totalHarga: 125000
  },
  // Menunggu Verifikasi
  {
    id: 'ORD-69269714',
    tanggal: '28/10/2026 13:34',
    status: 'Menunggu Verifikasi',
    statusPembayaran: 'Menunggu Verifikasi',
    statusPengiriman: null,
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    namaPenerima: 'Yohana Abigail',
    noHp: '081298765432',
    alamat: 'Jl. Anggrek No. 12, Batam Center, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 1,
        cover: coverAsasi
      },
      {
        id: 3,
        nama: 'Al Hisan 1',
        kategori: 'Al Hisan',
        hargaJual: 25000,
        qty: 2,
        cover: coverAlHisan1
      }
    ],
    totalHarga: 100000
  },
  // Perlu Dikirim
  {
    id: 'ORD-58210342',
    tanggal: '27/10/2026 09:20',
    status: 'Perlu Dikirim',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Perlu Dikirim',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    namaPenerima: 'Ririn Anisa',
    noHp: '081377889900',
    alamat: 'Jl. Dahlia No. 18, RT 01/RW 03, Sukajadi, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 3,
        cover: coverTahmidi
      }
    ],
    totalHarga: 130000
  },
  // Dikirim
  {
    id: 'ORD-51920873',
    tanggal: '26/10/2026 11:15',
    status: 'Dikirim',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Dikirim',
    statusColor: '#2563eb',
    statusBg: '#dbeafe',
    namaPenerima: 'Hendra Pratama',
    noHp: '085211223344',
    alamat: 'Perumahan Graha Indah Blok C3 No. 5, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 2,
        cover: coverAsasi
      },
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 2,
        cover: coverTahmidi
      }
    ],
    totalHarga: 170000
  },
  // Selesai
  {
    id: 'ORD-44018293',
    tanggal: '24/10/2026 15:40',
    status: 'Selesai',
    statusPembayaran: 'Disetujui',
    statusPengiriman: 'Selesai',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    namaPenerima: 'Ust. Ridwan Kamil',
    noHp: '081122334455',
    alamat: 'Komp. Masjid Raya Baiturrahman, Batam',
    metodePengiriman: 'Ambil di RSQ Pusat',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: contohBuktiTf,
    biayaKirim: 0,
    items: [
      {
        id: 3,
        nama: 'Al Hisan 1',
        kategori: 'Al Hisan',
        hargaJual: 25000,
        qty: 4,
        cover: coverAlHisan1
      }
    ],
    totalHarga: 100000
  },
  // Ditolak
  {
    id: 'ORD-39182746',
    tanggal: '22/10/2026 08:50',
    status: 'Ditolak',
    statusPembayaran: 'Ditolak',
    statusPengiriman: null,
    statusColor: '#dc2626',
    statusBg: '#fee2e2',
    namaPenerima: 'Dewi Lestari',
    noHp: '081399887766',
    alamat: 'Jl. Merpati No. 7, Tiban, Batam',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    alasanPenolakan: 'Nominal transfer di bukti struk tidak sesuai dengan total tagihan pesanan.',
    buktiTf: contohBuktiTf,
    biayaKirim: 10000,
    items: [
      {
        id: 1,
        nama: 'Asasi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 1,
        cover: coverAsasi
      }
    ],
    totalHarga: 50000
  },
  // Dibatalkan
  {
    id: 'ORD-28491038',
    tanggal: '20/10/2026 10:15',
    status: 'Dibatalkan',
    statusPembayaran: 'Dibatalkan',
    statusPengiriman: null,
    statusColor: '#64748b',
    statusBg: '#f1f5f9',
    namaPenerima: 'Ahmad Fauzi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 45, RT 02/RW 05, Pekanbaru',
    metodePengiriman: 'Via Kurir',
    metodeBayar: 'Transfer Bank',
    bankTujuan: '',
    buktiTf: null,
    biayaKirim: 10000,
    items: [
      {
        id: 2,
        nama: 'Tahmidi',
        kategori: 'Al Haqq',
        hargaJual: 40000,
        qty: 1,
        cover: coverTahmidi
      }
    ],
    totalHarga: 50000
  }
];


