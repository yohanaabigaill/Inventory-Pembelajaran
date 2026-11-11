// Utilitas data dan sinkronisasi in-memory untuk Stok Opname & Verifikasi Stok Opname
// Data tidak disimpan di localStorage agar saat halaman di-refresh otomatis kembali ke data awal.
export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export const KATEGORI_OPTIONS = [
  'Semua Jenis',
  'Al Haqq',
  'Al Hisan',
  'Tahsin Usmani',
  'RSQ Kids',
  'Umum',
  'Al Quran Wakaf',
  'Al Quran'
];

// Daftar 47 Modul Baku
export const INITIAL_MODULS = [
  { id: 1, kategori: 'Al Haqq', nama: 'Asasi', stokSistem: 450 },
  { id: 2, kategori: 'Al Haqq', nama: 'Asasi 2', stokSistem: 280 },
  { id: 3, kategori: 'Al Haqq', nama: 'Tahmidi', stokSistem: 320 },
  { id: 4, kategori: 'Al Haqq', nama: 'Tawasuthi', stokSistem: 190 },
  { id: 5, kategori: 'Al Haqq', nama: 'Idadi', stokSistem: 215 },
  { id: 6, kategori: 'Al Haqq', nama: 'Tahsini', stokSistem: 180 },
  { id: 7, kategori: 'Al Haqq', nama: 'Tajwidi', stokSistem: 240 },
  { id: 8, kategori: 'Al Haqq', nama: 'Makhorijul Huruf', stokSistem: 160 },
  { id: 9, kategori: 'Al Haqq', nama: 'Tilawah Asasi', stokSistem: 175 },
  { id: 10, kategori: 'Al Haqq', nama: 'Buku Prestasi Dewasa', stokSistem: 310 },
  { id: 11, kategori: 'Al Haqq', nama: 'Buku Prestasi Anak', stokSistem: 420 },
  { id: 12, kategori: 'Al Haqq', nama: 'Anak 1', stokSistem: 260 },
  { id: 13, kategori: 'Al Haqq', nama: 'Anak 2', stokSistem: 250 },
  { id: 14, kategori: 'Al Haqq', nama: 'Anak 3', stokSistem: 230 },
  { id: 15, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A4', stokSistem: 140 },
  { id: 16, kategori: 'Al Haqq', nama: 'Syarh Tuhfatul Athfal A5', stokSistem: 195 },
  { id: 17, kategori: 'Al Hisan', nama: 'Panduan Guru', stokSistem: 95 },
  { id: 18, kategori: 'Al Hisan', nama: 'Al Hisan 1', stokSistem: 340 },
  { id: 19, kategori: 'Al Hisan', nama: 'Al Hisan 2', stokSistem: 310 },
  { id: 20, kategori: 'Al Hisan', nama: 'Al Hisan 3', stokSistem: 290 },
  { id: 21, kategori: 'Al Hisan', nama: 'Al Hisan 4', stokSistem: 275 },
  { id: 22, kategori: 'Al Hisan', nama: 'Kamus Juz 1', stokSistem: 180 },
  { id: 23, kategori: 'Al Hisan', nama: 'Kamus 30 juz', stokSistem: 150 },
  { id: 24, kategori: 'Umum', nama: 'Khat', stokSistem: 120 },
  { id: 25, kategori: 'Tahsin Usmani', nama: 'Utsmani 1', stokSistem: 230 },
  { id: 26, kategori: 'Tahsin Usmani', nama: 'Utsmani 2', stokSistem: 210 },
  { id: 27, kategori: 'Tahsin Usmani', nama: 'Ustmani 3', stokSistem: 195 },
  { id: 28, kategori: 'RSQ Kids', nama: 'Buku Doa', stokSistem: 380 },
  { id: 29, kategori: 'RSQ Kids', nama: 'Buku Hadist', stokSistem: 350 },
  { id: 30, kategori: 'RSQ Kids', nama: 'Buku Prestasi', stokSistem: 410 },
  { id: 31, kategori: 'Umum', nama: 'Matan Jazariyah', stokSistem: 165 },
  { id: 32, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 Terjemah', stokSistem: 220 },
  { id: 33, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokSistem: 190 },
  { id: 34, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 Terjemah', stokSistem: 175 },
  { id: 35, kategori: 'Al Quran Wakaf', nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokSistem: 160 },
  { id: 36, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 Terjemah', stokSistem: 130 },
  { id: 37, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokSistem: 115 },
  { id: 38, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 Terjemah', stokSistem: 145 },
  { id: 39, kategori: 'Al Quran Wakaf', nama: 'Mushaf Ash Shahib A6 tanpa Terjemah', stokSistem: 140 },
  { id: 40, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 Terjemah', stokSistem: 310 },
  { id: 41, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A5 tanpa Terjemah', stokSistem: 280 },
  { id: 42, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 Terjemah', stokSistem: 260 },
  { id: 43, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A5 tanpa Terjemah', stokSistem: 240 },
  { id: 44, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 Terjemah', stokSistem: 185 },
  { id: 45, kategori: 'Al Quran', nama: 'Mushaf Ash Shahib A4 tanpa Terjemah', stokSistem: 170 },
  { id: 46, kategori: 'Al Quran', nama: 'Mushaf Al Mujib A6 Terjemah', stokSistem: 195 },
  { id: 47, kategori: 'Al Quran', nama: 'Mushaf Al Kamil A6 tanpa Terjemah', stokSistem: 205 }
];

export const createDefaultModulData = (defaultStatus = 'Belum Diinput') =>
  INITIAL_MODULS.map((m) => ({
    ...m,
    inputFisik: '',
    catatan: '',
    status: defaultStatus
  }));

// Data awal bersama yang 100% sinkron
export const getInitialMonthlyData = () => {
  const defaults = {};

  // Oktober 2026: Menunggu Verifikasi (Ada 2 modul dengan selisih yang diinput Admin)
  defaults['2026-10'] = {
    statusPeriode: 'Menunggu Verifikasi',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: INITIAL_MODULS.map((m) => {
      if (m.id === 1) {
        return {
          ...m,
          inputFisik: 445,
          catatan: '5 buku rusak di rak bawah karena lembap',
          status: 'Menunggu Verifikasi'
        };
      }
      if (m.id === 3) {
        return {
          ...m,
          inputFisik: 314,
          catatan: 'Kurang 6 eks saat pengiriman distributor',
          status: 'Menunggu Verifikasi'
        };
      }
      return {
        ...m,
        inputFisik: m.stokSistem,
        catatan: '',
        status: 'Menunggu Verifikasi'
      };
    })
  };

  // September 2026: Disetujui
  defaults['2026-09'] = {
    statusPeriode: 'Disetujui',
    catatanPenolakan: '',
    tanggalVerifikasi: '30 September 2026, 16:00 WIB',
    items: INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: m.stokSistem,
      catatan: '',
      status: 'Disetujui',
      isLocked: true
    }))
  };

  // Agustus 2026: Disetujui
  defaults['2026-08'] = {
    statusPeriode: 'Disetujui',
    catatanPenolakan: '',
    tanggalVerifikasi: '31 Agustus 2026, 16:45 WIB',
    items: INITIAL_MODULS.map((m) => ({
      ...m,
      inputFisik: m.stokSistem,
      catatan: '',
      status: 'Disetujui',
      isLocked: true
    }))
  };

  // Juli 2026: Ditolak dengan Catatan Super Admin
  defaults['2026-07'] = {
    statusPeriode: 'Ditolak',
    catatanPenolakan: 'Mohon hitung ulang fisik modul Asasi karena ada selisih 8 modul.',
    tanggalVerifikasi: '31 Juli 2026, 15:30 WIB',
    items: INITIAL_MODULS.map((m) => {
      if (m.id === 1) {
        return {
          ...m,
          inputFisik: 442,
          catatan: 'Fisik awal 442 di rak bawah, selisih 8 modul',
          status: 'Ditolak',
          isLocked: false
        };
      }
      return {
        ...m,
        inputFisik: m.stokSistem,
        catatan: '',
        status: 'Disetujui',
        isLocked: true
      };
    })
  };

  // November 2026: Belum Diinput
  defaults['2026-11'] = {
    statusPeriode: 'Belum Diinput',
    catatanPenolakan: '',
    tanggalVerifikasi: null,
    items: createDefaultModulData('Belum Diinput')
  };

  return defaults;
};

export const STOK_OPNAME_STORAGE_KEY = 'inventory_stok_opname_data';
export const STOK_OPNAME_UPDATE_EVENT = 'inventory_stok_opname_updated';
export const STOK_OPNAME_MONTH_KEY = 'inventory_stok_opname_active_month';
export const STOK_OPNAME_YEAR_KEY = 'inventory_stok_opname_active_year';
const STOK_OPNAME_CHANNEL_NAME = 'inventory_stok_opname_channel';

// Hapus sisa data di localStorage jika sebelumnya pernah tersimpan,
// agar saat refresh data selalu kembali ke kondisi demo awal.
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STOK_OPNAME_STORAGE_KEY);
    localStorage.removeItem(STOK_OPNAME_MONTH_KEY);
    localStorage.removeItem(STOK_OPNAME_YEAR_KEY);
  }
} catch {
  // ignore
}

// State disimpan di memori (bukan localStorage)
let memoryMonthlyData = getInitialMonthlyData();
let memoryActiveMonth = 'Oktober';
let memoryActiveYear = '2026';

let broadcastChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel(STOK_OPNAME_CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      const payload = event?.data;
      if (!payload || typeof payload !== 'object') return;
      if (payload.type === 'DATA_UPDATE' && payload.data) {
        memoryMonthlyData = payload.data;
        window.dispatchEvent(new Event(STOK_OPNAME_UPDATE_EVENT));
      } else if (payload.type === 'MONTH_UPDATE' && payload.month) {
        memoryActiveMonth = payload.month;
        window.dispatchEvent(new Event(STOK_OPNAME_UPDATE_EVENT));
      } else if (payload.type === 'YEAR_UPDATE' && payload.year) {
        memoryActiveYear = payload.year;
        window.dispatchEvent(new Event(STOK_OPNAME_UPDATE_EVENT));
      }
    };
  }
} catch {
  // ignore
}

const emitSyncEvent = () => {
  if (typeof window === 'undefined') return;
  queueMicrotask(() => {
    window.dispatchEvent(new Event(STOK_OPNAME_UPDATE_EVENT));
  });
};

export const loadMonthlyData = () => memoryMonthlyData;

export const saveMonthlyData = (data) => {
  memoryMonthlyData = data;
  try {
    broadcastChannel?.postMessage({ type: 'DATA_UPDATE', data });
  } catch {
    // ignore
  }
  emitSyncEvent();
};

export const getStoredActiveMonth = () => memoryActiveMonth;

export const saveStoredActiveMonth = (month) => {
  memoryActiveMonth = month;
  try {
    broadcastChannel?.postMessage({ type: 'MONTH_UPDATE', month });
  } catch {
    // ignore
  }
  emitSyncEvent();
};

export const getStoredActiveYear = () => memoryActiveYear;

export const saveStoredActiveYear = (year) => {
  memoryActiveYear = year;
  try {
    broadcastChannel?.postMessage({ type: 'YEAR_UPDATE', year });
  } catch {
    // ignore
  }
  emitSyncEvent();
};
