import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import DataModul from "./pages/DataModul";
import StokOpname from "./pages/StokOpname";
import ModulMasuk from "./pages/ModulMasuk";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        <Route path="/data-modul" element={<DataModul />} />
        <Route path="/DataModul" element={<DataModul />} />
        <Route path="/dashboard" element={<DataModul />} />
        <Route path="/modul-masuk" element={<ModulMasuk />} />
        <Route path="/stok-opname" element={<StokOpname />} />
        <Route path="/verifikasi-stok-opname" element={<StokOpname />} />
        <Route path="/" element={<DataModul />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
