import React, { useState, useEffect } from "react";
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

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setStep(2);
      setTimer(60);
      setCanResend(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join("").length === 6) {
      setErrorMessage("");
      setStep(3);
    } else {
      setErrorMessage("Silakan masukkan 6 digit kode OTP secara lengkap");
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Silakan lengkapi kata sandi baru Anda");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Kata sandi minimal harus 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok");
      return;
    }
    setErrorMessage("");
    setStep(4);
  };

  const handleResendOtp = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
    }
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
              Pemulihan Kata Sandi
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: { xs: "0.85rem", md: "0.92rem" },
                lineHeight: 1.6,
                display: { xs: "none", sm: "block" },
              }}
            >
              Jangan khawatir, ikuti beberapa langkah mudah dengan kode verifikasi OTP yang kami kirimkan ke email Anda untuk memulihkan akses akun.
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

          {/* Masukkan Email */}
          {step === 1 && (
            <>
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.35rem", md: "1.5rem" } }}
                >
                  Lupa Kata Sandi?
                </Typography>
                <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.82rem", md: "0.88rem" }, mt: 0.3 }}>
                  Masukkan email terdaftar untuk menerima kode verifikasi OTP
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSendEmail} noValidate>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  sx={{
                    mb: 2.2,
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
                  Kirim Kode OTP
                </Button>

                <Box sx={{ mt: 2.5, textAlign: "center" }}>
                  <Typography sx={{ color: "#4b5563", fontSize: "0.85rem" }}>
                    Ingat kata sandi Anda?{" "}
                    <Link
                      href="/login"
                      underline="hover"
                      sx={{ color: "#23573c", fontWeight: 700, transition: "color 0.2s ease", "&:hover": { color: "#163826" } }}
                    >
                      Kembali ke Masuk
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Verifikasi Kode OTP */}
          {step === 2 && (
            <>
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.35rem", md: "1.5rem" } }}
                >
                  Verifikasi Kode OTP
                </Typography>
                <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.82rem", md: "0.88rem" }, mt: 0.3 }}>
                  Kode 6 digit telah dikirimkan ke <b>{email}</b>
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleVerifyOtp} noValidate>
                {/* 6 Digit OTP */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: { xs: 1, sm: 1.5 }, mb: 2.5 }}>
                  {otp.map((digit, idx) => (
                    <TextField
                      key={idx}
                      id={`otp-input-${idx}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", fontSize: "1.25rem", fontWeight: 700, padding: "10px 0" }
                      }}
                      sx={{
                        width: { xs: "40px", sm: "48px" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "#f9fafb",
                          fontFamily: "'Poppins', sans-serif",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#9ca3af" },
                          "&.Mui-focused fieldset": { borderColor: "#23573c", borderWidth: "2px" },
                        },
                      }}
                    />
                  ))}
                </Box>

                {errorMessage && (
                  <Typography sx={{ color: "#dc2626", fontSize: "0.82rem", fontWeight: 500, mb: 2, textAlign: "center" }}>
                    * {errorMessage}
                  </Typography>
                )}

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
                    color: "#ffffff",
                    boxShadow: "0 6px 18px rgba(35, 87, 60, 0.35)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #163826 0%, #0d2318 100%)",
                      boxShadow: "0 8px 20px rgba(22, 56, 38, 0.45)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Verifikasi OTP
                </Button>

                <Box sx={{ mt: 2.5, textAlign: "center" }}>
                  <Typography sx={{ color: "#4b5563", fontSize: "0.85rem" }}>
                    Tidak menerima kode?{" "}
                    {canResend ? (
                      <Link
                        component="button"
                        type="button"
                        onClick={handleResendOtp}
                        underline="hover"
                        sx={{ color: "#23573c", fontWeight: 700, border: "none", bgcolor: "transparent", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem" }}
                      >
                        Kirim Ulang
                      </Link>
                    ) : (
                      <span style={{ color: "#9ca3af", fontWeight: 600 }}>
                        Kirim ulang dalam {timer}d
                      </span>
                    )}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {/* Buat Kata Sandi Baru */}
          {step === 3 && (
            <>
              <Box sx={{ textAlign: "center", mb: 2.5 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.35rem", md: "1.5rem" } }}
                >
                  Atur Kata Sandi Baru
                </Typography>
                <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.82rem", md: "0.88rem" }, mt: 0.3 }}>
                  Buat kata sandi baru yang kuat dan mudah Anda ingat
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleResetPassword} noValidate>
                <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", mb: 0.4, display: "block" }}>
                  Kata Sandi Baru
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                    mb: 1.5,
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
                  Konfirmasi Kata Sandi Baru
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
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
                    mb: 2.2,
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

                {errorMessage && (
                  <Typography sx={{ color: "#dc2626", fontSize: "0.82rem", fontWeight: 500, mb: 1.5, mt: -1.2 }}>
                    * {errorMessage}
                  </Typography>
                )}

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
                    color: "#ffffff",
                    boxShadow: "0 6px 18px rgba(35, 87, 60, 0.35)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #163826 0%, #0d2318 100%)",
                      boxShadow: "0 8px 20px rgba(22, 56, 38, 0.45)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Simpan Kata Sandi Baru
                </Button>
              </Box>
            </>
          )}

          {/* Berhasil Diubah */}
          {step === 4 && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Box
                sx={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  bgcolor: "rgba(35, 87, 60, 0.12)",
                  color: "#23573c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Box>

              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#111827", fontSize: { xs: "1.35rem", md: "1.5rem" }, mb: 1 }}
              >
                Kata Sandi Berhasil Diperbarui!
              </Typography>
              <Typography sx={{ color: "#4b5563", fontSize: { xs: "0.85rem", md: "0.9rem" }, mb: 3, lineHeight: 1.5 }}>
                Kata sandi baru Anda telah tersimpan. Silakan masuk kembali dengan kata sandi baru Anda.
              </Typography>

              <Button
                fullWidth
                href="/login"
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
                Kembali ke Halaman Masuk
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
