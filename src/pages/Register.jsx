import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton
} from "@mui/material";
import Logo from "../components/Logo";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8faf9 0%, #e9efec 50%, #dbe4e0 100%)",
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: { xs: "480px", md: "960px" },
          minHeight: { md: "620px" },
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(229, 231, 235, 0.8)",
          bgcolor: "#ffffff",
          my: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            flex: 1.05,
            background: "linear-gradient(145deg, #163826 0%, #23573c 60%, #327552 100%)",
            color: "#ffffff",
            p: { xs: 2.5, sm: 3.5, md: 4.5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              px: { xs: 1.5, md: 2 },
              py: { xs: 0.4, md: 0.6 },
              borderRadius: "50px",
              backdropFilter: "blur(5px)",
              mb: { xs: 2, md: 4 },
            }}
          >
            <Typography sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" }, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
              Rumah Sahabat Qur'an
            </Typography>
          </Box>

          <Box sx={{ my: "auto" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.35rem", sm: "1.6rem", md: "2.1rem" },
                lineHeight: 1.3,
                mb: { xs: 1, md: 1.5 },
              }}
            >
              Pendaftaran Akun Peserta
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: { xs: "0.85rem", md: "0.92rem" },
                lineHeight: 1.6,
                display: { xs: "none", sm: "block" },
              }}
            >
              Daftarkan diri Anda sebagai peserta untuk menikmati kemudahan melihat katalog modul, memilih metode pengiriman, serta memantau status pemesanan.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, sm: 3.5, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "center" }}>
            <Logo />
          </Box>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.35rem", md: "1.5rem" } }}
            >
              Registrasi Akun Baru
            </Typography>
            <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.82rem", md: "0.88rem" }, mt: 0.3 }}>
              Lengkapi formulir berikut untuk mendaftar
            </Typography>
          </Box>

          <Box component="form" noValidate sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Nama Lengkap
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Masukkan Nama Lengkap"
              sx={{
                mb: 1.4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "#23573c" },
                },
              }}
            />

            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="nama@email.com"
              sx={{
                mb: 1.4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "#23573c" },
                },
              }}
            />

            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#4b5563" }}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1.4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "#23573c" },
                },
              }}
            />

            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Konfirmasi Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: "#4b5563" }}
                    >
                      {showConfirmPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "#23573c" },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="medium"
              sx={{
                py: 1.15,
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(135deg, #23573c 0%, #163826 100%)",
                boxShadow: "0 6px 18px rgba(35, 87, 60, 0.35)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #163826 0%, #0d2318 100%)",
                  boxShadow: "0 8px 20px rgba(22, 56, 38, 0.45)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Daftar
            </Button>

            <Box sx={{ mt: 2.2, textAlign: "center" }}>
              <Typography sx={{ color: "#4b5563", fontSize: "0.85rem" }}>
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  underline="hover"
                  sx={{ color: "#23573c", fontWeight: 700, transition: "color 0.2s ease", "&:hover": { color: "#163826" } }}
                >
                  Masuk di sini
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
