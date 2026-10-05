import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import DataModulPage from "./pages/DataModulPage";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        <Route path="/data-modul" element={<DataModulPage />} />
        <Route path="/" element={<DataModulPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
