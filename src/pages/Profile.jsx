import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function Profile() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Menyesuaikan role Super Admin/ Admin
  const savedRole = localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';
  const isSuperAdmin = savedRole === 'super_admin' || savedRole === 'SUPER ADMIN' || savedRole === 'superadmin';

  const initialEmail = '';

  // Form Email dan Password
  const [email, setEmail] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Validasi Error
  const [errors, setErrors] = useState({});

  // Password (Tampil/Hide)
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notifikasi
  const [notification, setNotification] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setNotification({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    setEmail('');
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    if (notification) setNotification(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validasi Kata Sandi Baru
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Kata sandi baru wajib diisi';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Kata sandi baru minimal 8 karakter';
    }

    // Validasi Konfirmasi Kata Sandi Baru
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi baru wajib diisi';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru';
    }

    // Jika ada error, hentikan dan tampilkan pesan merah di bawah kotak
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Berhasil disimpan
    setErrors({});
    showToast('Profil berhasil diperbarui!', 'success');
    setPasswordData({ newPassword: '', confirmPassword: '' });
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        role={isSuperAdmin ? 'super_admin' : 'admin'}
        activeMenu="Profil Saya"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Profil Saya"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Tengah */}
        <main style={styles.contentBody}>
          {/* Toast Notification */}
          {notification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor:
                  notification.type === 'success'
                    ? '#23573c'
                    : notification.type === 'error'
                    ? '#dc2626'
                    : '#475569'
              }}
            >
              {notification.type === 'success' ? (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              ) : notification.type === 'error' ? (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <InfoOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <div style={styles.contentWrapper}>

            {/* KOTAK UTAMA */}
            <div style={styles.card}>
              {/* Header: Edit Profil */}
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Edit Profil</h3>
              </div>

              <form noValidate onSubmit={handleSave} style={styles.cardBody}>
                {/* Icon Bulatan (AD / SA) */}
                <div style={styles.avatarSection}>
                  <div style={styles.avatarCircle}>
                    {isSuperAdmin ? 'SA' : 'AD'}
                  </div>
                </div>

                {/* Email */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <div style={styles.inputWrapper}>
                    <EmailOutlinedIcon
                      sx={{
                        ...styles.inputIcon,
                        color: errors.email ? '#ef4444' : '#23573c'
                      }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      style={{
                        ...styles.inputField,
                        borderColor: errors.email ? '#ef4444' : '#23573c'
                      }}
                      placeholder="nama@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <span style={styles.errorText}>{errors.email}</span>
                  )}
                </div>

                {/* Kata Sandi Baru */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kata Sandi Baru</label>
                  <div style={styles.inputWrapper}>
                    <LockOutlinedIcon
                      sx={{
                        ...styles.inputIcon,
                        color: errors.newPassword ? '#ef4444' : '#23573c'
                      }}
                    />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      style={{
                        ...styles.inputField,
                        borderColor: errors.newPassword ? '#ef4444' : '#23573c'
                      }}
                      placeholder="Masukkan kata sandi baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{
                        ...styles.eyeBtn,
                        color: errors.newPassword ? '#ef4444' : '#23573c'
                      }}
                      aria-label="Toggle Password Visibility"
                    >
                      {showNewPass ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <span style={styles.errorText}>{errors.newPassword}</span>
                  )}
                </div>

                {/* Konfirmasi Kata Sandi Baru */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Konfirmasi Kata Sandi Baru</label>
                  <div style={styles.inputWrapper}>
                    <LockOutlinedIcon
                      sx={{
                        ...styles.inputIcon,
                        color: errors.confirmPassword ? '#ef4444' : '#23573c'
                      }}
                    />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      style={{
                        ...styles.inputField,
                        borderColor: errors.confirmPassword ? '#ef4444' : '#23573c'
                      }}
                      placeholder="Ulangi kata sandi baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{
                        ...styles.eyeBtn,
                        color: errors.confirmPassword ? '#ef4444' : '#23573c'
                      }}
                      aria-label="Toggle Confirm Password Visibility"
                    >
                      {showConfirmPass ? (
                        <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span style={styles.errorText}>{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Tombol Aksi di Ujung Kanan: Batal & Simpan */}
                <div style={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={styles.btnSecondary}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={styles.btnPrimary}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8faf9',
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    backgroundColor: '#f8faf9'
  },
  contentBody: {
    padding: '36px 32px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto'
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 22px',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '26px 28px 0px',
    display: 'flex',
    alignItems: 'center'
  },
  cardTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a3e2b'
  },
  cardBody: {
    padding: '20px 28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 0 16px'
  },
  avatarCircle: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(35, 87, 60, 0.22)',
    letterSpacing: '1px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#334155'
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '4px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#23573c',
    fontSize: '19px',
    pointerEvents: 'none'
  },
  inputField: {
    width: '100%',
    padding: '11px 42px 11px 42px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    backgroundColor: '#ffffff'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px'
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 24px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#23573c',
    border: '1px solid #23573c',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 26px',
    borderRadius: '8px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: '1px solid #23573c',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s, transform 0.1s',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)'
  }
};
