import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import Dashboard from "./pages/Dashboard";
import DataModul from "./pages/DataModul";
import JenisModul from "./pages/JenisModul";
import StokOpname from "./pages/StokOpname";
import VerifikasiStokOpname from "./pages/VerifikasiStokOpname";
import ModulMasuk from "./pages/ModulMasuk";
import VerifikasiPembayaran from "./pages/VerifikasiPembayaran";
import StatusPengiriman from "./pages/StatusPengiriman";
import Profile from "./pages/Profile";
import LaporanStok from "./pages/LaporanStok";
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
        <Route path="/profil" element={<Profile />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
