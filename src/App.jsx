import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { authRoutes } from "./routes/authRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>{authRoutes}</Routes>
    </BrowserRouter>
  );
}

export default App;
