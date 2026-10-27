import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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

  const [isEditing, setIsEditing] = useState(false);

  // Menyesuaikan role Super Admin / Admin
  const savedRole = localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';
  const isSuperAdmin = savedRole === 'super_admin' || savedRole === 'SUPER ADMIN' || savedRole === 'superadmin';

  // Role & Inisial Icon
  const roleDisplay = isSuperAdmin ? 'Super Admin' : 'Admin';
  const avatarText = isSuperAdmin ? 'SA' : 'AD';
  const defaultEmail = isSuperAdmin ? 'superadmin@gmail.com' : 'admin@gmail.com';

  // Email pengguna
  const email = localStorage.getItem('user_email') || defaultEmail;

  // State Foto Profil
  const [profilePhoto, setProfilePhoto] = useState(null);

  // State Form Edit
  const [editPhoto, setEditPhoto] = useState(profilePhoto);
  const fileInputRef = useRef(null);

  // Checkbox Ubah Kata Sandi
  const [changePassword, setChangePassword] = useState(false);

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

  // Masuk ke mode edit
  const handleOpenEdit = () => {
    setEditPhoto(profilePhoto);
    setChangePassword(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    setIsEditing(true);
  };

  // Batal dari mode edit
  const handleCancel = () => {
    setEditPhoto(profilePhoto);
    setChangePassword(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    setIsEditing(false);
  };

  // Upload Foto Profil (Format JPG, JPEG, PNG dan Maks. 2MB)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const isValidFormat =
      allowedExtensions.includes(fileExtension) ||
      allowedMimeTypes.includes(file.type);

    if (!isValidFormat) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Format file harus JPG, JPEG, atau PNG'
      }));
      showToast('Format file harus JPG, JPEG, atau PNG', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Ukuran file maksimal 2MB'
      }));
      showToast('Ukuran gambar maksimal 2MB', 'error');
      e.target.value = '';
      return;
    }

    // Jika file valid, hapus pesan error foto
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.photo;
      return updated;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validasi jika tidak ada data yang diisi/diubah
    if (!changePassword && editPhoto === profilePhoto) {
      setChangePassword(true);
      newErrors.newPassword = 'Kata sandi baru wajib diisi';
      newErrors.confirmPassword = 'Konfirmasi kata sandi baru wajib diisi';
      setErrors(newErrors);
      showToast('Harap lengkapi data yang ingin diperbarui', 'error');
      return;
    }

    // Validasi Kata Sandi jika checkbox 'Ubah Kata Sandi' diklik
    if (changePassword) {
      if (!passwordData.newPassword.trim()) {
        newErrors.newPassword = 'Kata sandi baru wajib diisi';
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = 'Kata sandi baru minimal 8 karakter';
      }

      if (!passwordData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Konfirmasi kata sandi baru wajib diisi';
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simpan Foto Profil
    setProfilePhoto(editPhoto);

    setErrors({});
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setChangePassword(false);
    setIsEditing(false);
    showToast('Profil berhasil diperbarui!', 'success');
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

        {/* Style Responsif Mobile */}
        <style>{`
          @media (max-width: 640px) {
            .profile-content-body {
              padding: 20px 14px 40px !important;
            }
            .profile-view-card {
              padding: 28px 18px 24px !important;
              border-radius: 16px !important;
            }
            .profile-data-row {
              gap: 14px !important;
              margin-bottom: 14px !important;
            }
            .profile-data-label {
              width: 60px !important;
              min-width: 60px !important;
              max-width: 60px !important;
              font-size: 13.5px !important;
            }
            .profile-edit-card {
              border-radius: 14px !important;
            }
            .profile-card-header {
              padding: 16px 18px !important;
            }
            .profile-card-body {
              padding: 18px 18px 24px !important;
            }
          }
        `}</style>

        {/* Content Tengah */}
        <main className="profile-content-body" style={styles.contentBody}>
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
            {!isEditing ? (
              <div className="profile-view-card" style={styles.viewCard}>
                {/* Foto Profil / Icon Inisial */}
                <div style={styles.avatarViewWrapper}>
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={roleDisplay}
                      style={styles.avatarViewImg}
                    />
                  ) : (
                    <div style={styles.avatarViewCircle}>
                      {avatarText}
                    </div>
                  )}
                </div>

                <div style={styles.dividerLine} />

                {/* Email */}
                <div className="profile-data-row" style={styles.dataRow}>
                  <span className="profile-data-label" style={styles.dataLabel}>Email</span>
                  <div className="profile-data-box" style={styles.dataBox}>
                    <span className="profile-data-value" style={styles.dataValue}>{email}</span>
                  </div>
                </div>

                {/* Role */}
                <div className="profile-data-row" style={styles.dataRow}>
                  <span className="profile-data-label" style={styles.dataLabel}>Role</span>
                  <div className="profile-data-box" style={styles.dataBox}>
                    <span className="profile-data-value" style={styles.dataValue}>{roleDisplay}</span>
                  </div>
                </div>

                {/* Tombol Edit Profil */}
                <div style={styles.viewButtonGroup}>
                  <button
                    id="btn-edit-profile"
                    type="button"
                    onClick={handleOpenEdit}
                    style={styles.btnPrimary}
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-edit-card" style={styles.editCard}>
                {/* Tombol kembali */}
                <div className="profile-card-header" style={styles.editCardHeader}>
                  <button
                    id="btn-back-profile"
                    type="button"
                    onClick={handleCancel}
                    style={styles.backBtn}
                    aria-label="Kembali"
                    title="Kembali ke Profil"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <h3 style={styles.cardTitle}>Edit Profil</h3>
                </div>

                <form className="profile-card-body" noValidate onSubmit={handleSave} style={styles.cardBody}>
                  {/* Ubah Foto Profil */}
                  <div style={styles.photoUploadSection}>
                    <div style={styles.photoAvatarWrapper}>
                      {editPhoto ? (
                        <img
                          src={editPhoto}
                          alt="Pratinjau Foto"
                          style={styles.photoAvatarImg}
                        />
                      ) : (
                        <div style={styles.avatarViewCircle}>
                          {avatarText}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={styles.cameraBadgeBtn}
                        title="Pilih Foto Baru"
                        aria-label="Pilih Foto Baru"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      style={{ display: 'none' }}
                    />

                    <div style={styles.photoActionButtons}>
                      <button
                        id="btn-choose-photo"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={styles.btnChoosePhoto}
                      >
                        Pilih Foto
                      </button>
                      {editPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditPhoto(null);
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.photo;
                              return updated;
                            });
                          }}
                          style={styles.btnDeletePhoto}
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    {/* Validasi Foto Profil */}
                    {errors.photo && (
                      <span style={{ ...styles.errorText, textAlign: 'center', marginTop: '4px' }}>
                        {errors.photo}
                      </span>
                    )}
                  </div>

                  {/* Email Disabled */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <div style={styles.inputWrapper}>
                      <EmailOutlinedIcon
                        sx={{
                          ...styles.inputIcon,
                          color: '#94a3b8'
                        }}
                      />
                      <input
                        type="email"
                        value={email}
                        disabled
                        style={styles.disabledInputField}
                        placeholder="nama@gmail.com"
                      />
                    </div>
                  </div>

                  {/* Checkbox Ubah Kata Sandi */}
                  <div style={styles.checkboxContainer}>
                    <label style={styles.checkboxLabel}>
                      <input
                        id="checkbox-change-password"
                        type="checkbox"
                        checked={changePassword}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setChangePassword(isChecked);
                          if (!isChecked) {
                            setPasswordData({ newPassword: '', confirmPassword: '' });
                            setErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.newPassword;
                              delete updated.confirmPassword;
                              return updated;
                            });
                          }
                        }}
                        style={styles.checkboxInput}
                      />
                      <span
                        style={{
                          ...styles.checkboxCustom,
                          backgroundColor: changePassword ? '#23573c' : '#ffffff',
                          borderColor: changePassword ? '#23573c' : '#94a3b8'
                        }}
                      >
                        {changePassword && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span style={styles.checkboxText}>Ubah Kata Sandi</span>
                    </label>
                  </div>

                  {/* Form Kata Sandi Muncul Jika Checkbox Dicentang */}
                  {changePassword && (
                    <>
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
                            id="input-new-password"
                            type={showNewPass ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            style={{
                              ...styles.inputField,
                              borderColor: errors.newPassword ? '#ef4444' : '#23573c'
                            }}
                            placeholder="Masukkan Kata Sandi Baru"
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
                            id="input-confirm-password"
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
                    </>
                  )}

                  {/* Tombol Batal & Simpan */}
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
            )}
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
    padding: '40px 32px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '620px',
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

  viewCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
    padding: '44px 48px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  avatarViewWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px'
  },
  avatarViewCircle: {
    width: '92px',
    height: '92px',
    borderRadius: '50%',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '30px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(35, 87, 60, 0.28)',
    letterSpacing: '1px',
    userSelect: 'none'
  },
  avatarViewImg: {
    width: '92px',
    height: '92px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 4px 16px rgba(35, 87, 60, 0.28)',
    border: '3px solid #23573c',
    display: 'block'
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: '#e5e7eb',
    marginTop: '18px',
    marginBottom: '26px'
  },
  dataRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    gap: '24px'
  },
  dataLabel: {
    width: '75px',
    minWidth: '75px',
    maxWidth: '75px',
    flexShrink: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155'
  },
  dataBox: {
    flex: 1,
    minWidth: 0,
    height: '46px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    padding: '0 18px',
    boxSizing: 'border-box'
  },
  dataValue: {
    fontSize: '14px',
    color: '#334155',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    width: '100%'
  },
  viewButtonGroup: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '28px'
  },

  editCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #dce4de',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  },
  editCardHeader: {
    padding: '24px 28px 16px',
    borderBottom: '1px solid #f0f4f1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  cardTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a3e2b'
  },
  cardBody: {
    padding: '24px 28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  photoUploadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 0 16px',
    borderBottom: '1px solid #f1f5f9'
  },
  photoAvatarWrapper: {
    position: 'relative',
    display: 'inline-block'
  },
  photoAvatarImg: {
    width: '92px',
    height: '92px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 4px 16px rgba(35, 87, 60, 0.28)',
    border: '3px solid #23573c',
    display: 'block'
  },
  cameraBadgeBtn: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#23573c',
    border: '2px solid #ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    transition: 'transform 0.15s ease, background-color 0.2s',
    outline: 'none'
  },
  photoActionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  btnChoosePhoto: {
    background: 'none',
    border: '1px solid #23573c',
    color: '#23573c',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease'
  },
  btnDeletePhoto: {
    background: 'none',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0 2px'
  },
  checkboxLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkboxInput: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
    height: 0,
    width: 0
  },
  checkboxCustom: {
    width: '18px',
    height: '18px',
    borderRadius: '5px',
    border: '2px solid #23573c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  checkboxText: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1a3e2b'
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
  disabledInputField: {
    width: '100%',
    padding: '11px 42px 11px 42px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#64748b',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f1f5f9',
    cursor: 'not-allowed',
    userSelect: 'none'
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
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)',
    userSelect: 'none'
  }
};
