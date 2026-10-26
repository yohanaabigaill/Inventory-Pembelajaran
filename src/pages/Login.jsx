import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setToast("Berhasil masuk!");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

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
          maxWidth: { xs: "480px", md: "880px" },
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
              Pengelolaan Inventory Pembelajaran
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: { xs: "0.85rem", md: "0.92rem" },
                lineHeight: 1.6,
                display: { xs: "none", sm: "block" },
              }}
            >
              Sistem terpadu untuk pencatatan stok modul, pengelolaan data modul masuk, serta kemudahan transaksi pemesanan modul bagi seluruh santri dan peserta.
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
              Selamat Datang!
            </Typography>
            <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.82rem", md: "0.88rem" }, mt: 0.3 }}>
              Silakan masukkan akun Anda untuk masuk
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0.5 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              placeholder="nama@gmail.com"
              sx={{
                mb: errors.email ? 0.6 : 1.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: errors.email ? "#dc2626" : "#e5e7eb" },
                  "&:hover fieldset": { borderColor: errors.email ? "#dc2626" : "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: errors.email ? "#dc2626" : "#23573c" },
                },
              }}
            />
            {errors.email && (
              <Typography sx={{ color: "#dc2626", fontSize: "0.8rem", fontWeight: 500, mb: 1.2, ml: 0.3 }}>
                * {errors.email}
              </Typography>
            )}

            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              placeholder="••••••••"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                        sx={{ color: "#4b5563" }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                      sx={{ color: "#4b5563" }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: errors.password ? 0.6 : 1.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f9fafb",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: errors.password ? "#dc2626" : "#e5e7eb" },
                  "&:hover fieldset": { borderColor: errors.password ? "#dc2626" : "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: errors.password ? "#dc2626" : "#23573c" },
                },
              }}
            />
            {errors.password && (
              <Typography sx={{ color: "#dc2626", fontSize: "0.8rem", fontWeight: 500, mb: 1.2, ml: 0.3 }}>
                * {errors.password}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    sx={{
                      color: "#6b7280",
                      "&.Mui-checked": { color: "#23573c" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "#374151", fontSize: "0.85rem", fontWeight: 500 }}>
                    Ingat saya
                  </Typography>
                }
              />
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{ color: "#23573c", fontSize: "0.82rem", fontWeight: 600 }}
              >
                Lupa password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
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
              Masuk
            </Button>

            <Box sx={{ mt: 2.2, textAlign: "center" }}>
              <Typography sx={{ color: "#4b5563", fontSize: "0.85rem" }}>
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ color: "#23573c", fontWeight: 700, transition: "color 0.2s ease", "&:hover": { color: "#163826" } }}
                >
                  Daftar Sekarang
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Toast Notification */}
      {toast && (
        <div
          className="toast-responsive"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 22px",
            borderRadius: "10px",
            color: "#ffffff",
            backgroundColor: "#23573c",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 8px 28px rgba(0, 0, 0, 0.22)",
            animation: "fadeIn 0.25s ease",
            maxWidth: "calc(100vw - 48px)",
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: "#ffffff" }} />
          <span>{toast}</span>
        </div>
      )}
    </Box>
  );
}
