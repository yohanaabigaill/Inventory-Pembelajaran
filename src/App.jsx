import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import Dashboard from "./pages/admin-superadmin/Dashboard";
import DataModul from "./pages/admin-superadmin/DataModul";
import JenisModul from "./pages/admin-superadmin/JenisModul";
import StokOpname from "./pages/admin-superadmin/StokOpname";
import VerifikasiStokOpname from "./pages/admin-superadmin/VerifikasiStokOpname";
import ModulMasuk from "./pages/admin-superadmin/ModulMasuk";
import VerifikasiPembayaran from "./pages/admin-superadmin/VerifikasiPembayaran";
import StatusPengiriman from "./pages/admin-superadmin/StatusPengiriman";
import Profile from "./pages/admin-superadmin/Profile";
import LaporanStok from "./pages/admin-superadmin/LaporanStok";
import KatalogModul from "./pages/peserta/KatalogModul";
import PesananSaya from "./pages/peserta/PesananSaya";
import Keranjang from "./pages/peserta/Keranjang";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jenis-modul" element={<JenisModul />} />
        <Route path="/data-modul" element={<DataModul />} />
        <Route path="/modul-masuk" element={<ModulMasuk />} />
        <Route path="/stok-opname" element={<StokOpname />} />
        <Route path="/verifikasi-stok-opname" element={<VerifikasiStokOpname />} />
        <Route path="/pesanan-kirim" element={<VerifikasiPembayaran />} />
        <Route path="/verifikasi-pembayaran" element={<VerifikasiPembayaran />} />
        <Route path="/status-pengiriman" element={<StatusPengiriman />} />
        <Route path="/laporan-stok" element={<LaporanStok />} />
        <Route path="/katalog-modul" element={<KatalogModul />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/pesanan" element={<PesananSaya />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
