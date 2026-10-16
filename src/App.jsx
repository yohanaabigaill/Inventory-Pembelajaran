import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";
import DataModul from "./pages/DataModul";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes}
        <Route path="/data-modul" element={<DataModul />} />
        <Route path="/" element={<DataModul />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
