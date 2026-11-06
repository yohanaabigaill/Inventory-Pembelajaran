import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

export default function Profile() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Ambil role yang sedang aktif
  const location = useLocation();
  const passedRole = location.state?.role;
  const savedRole = passedRole || localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';

  // Validasi role untuk menentukan tampilan profil
  const isSuperAdmin = savedRole === 'super_admin' || savedRole === 'SUPER ADMIN' || savedRole === 'superadmin';
  const isPeserta = savedRole === 'peserta' || savedRole === 'PESERTA' || savedRole === 'santri';

  // Role, Inisial Icon, Email & Nama
  const roleDisplay = isSuperAdmin ? 'Super Admin' : isPeserta ? 'Peserta' : 'Admin';
  const avatarText = isSuperAdmin ? 'SA' : isPeserta ? 'RI' : 'AD';
  const defaultEmail = isSuperAdmin ? 'superadmin@gmail.com' : isPeserta ? 'ririn@gmail.com' : 'admin@gmail.com';
  const defaultName = isPeserta ? 'Ririn' : '';
  const defaultPhone = isPeserta ? '081234567890' : '';

  // Data profil
  const [profileName, setProfileName] = useState(defaultName);
  const [profilePhone, setProfilePhone] = useState(defaultPhone);
  const [profileEmail, setProfileEmail] = useState(defaultEmail);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Form Edit
  const [editName, setEditName] = useState(defaultName);
  const [editPhone, setEditPhone] = useState(defaultPhone);
  const [editPhoto, setEditPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Sinkronisasi saat role berganti
  useEffect(() => {
    setProfileName(defaultName);
    setProfilePhone(defaultPhone);
    setProfileEmail(defaultEmail);
    setProfilePhoto(null);
    setEditName(defaultName);
    setEditPhone(defaultPhone);
    setEditPhoto(null);
  }, [defaultName, defaultPhone, defaultEmail]);

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

  // Notifikasi Toast
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
    setEditName(profileName);
    setEditPhone(profilePhone);
    setChangePassword(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    setIsEditing(true);
  };

  // Batal dari mode edit
  const handleCancel = () => {
    setEditPhoto(profilePhoto);
    setEditName(profileName);
    setEditPhone(profilePhone);
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

    // Validasi Nama Lengkap & No. WA
    if (isPeserta) {
      if (!editName.trim()) {
        newErrors.nama = 'Nama lengkap wajib diisi';
      }
      if (!editPhone.trim()) {
        newErrors.noHp = 'No. WhatsApp / HP wajib diisi';
      } else if (editPhone.length < 10) {
        newErrors.noHp = 'No. WhatsApp minimal 10 digit';
      }
    }

    // Validasi Kata Sandi
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

    // Cek apakah ada perubahan
    const isPhotoChanged = editPhoto !== profilePhoto;
    const isNameChanged = isPeserta && editName.trim() !== profileName;
    const isPhoneChanged = isPeserta && editPhone.trim() !== profilePhone;
    const isPassChanged = changePassword;

    if (!isPhotoChanged && !isNameChanged && !isPhoneChanged && !isPassChanged) {
      showToast('Tidak ada data yang diubah', 'info');
      setIsEditing(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simpan Data Profil
    if (isPeserta) {
      setProfileName(editName.trim());
      setProfilePhone(editPhone.trim());
    }
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
        role={isSuperAdmin ? 'super_admin' : isPeserta ? 'peserta' : 'admin'}
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
                  <div
                    className="profile-data-box"
                    style={{ ...styles.dataBox, cursor: 'not-allowed' }}
                  >
                    <span
                      className="profile-data-value"
                      style={{ ...styles.dataValue, cursor: 'not-allowed' }}
                    >
                      {profileEmail}
                    </span>
                  </div>
                </div>

                {/* Nama & No. WA hanya ditampilkan jika role adalah Peserta */}
                {isPeserta && (
                  <>
                    <div className="profile-data-row" style={styles.dataRow}>
                      <span className="profile-data-label" style={styles.dataLabel}>Nama</span>
                      <div className="profile-data-box" style={styles.dataBox}>
                        <span className="profile-data-value" style={styles.dataValue}>{profileName}</span>
                      </div>
                    </div>

                    <div className="profile-data-row" style={styles.dataRow}>
                      <span className="profile-data-label" style={styles.dataLabel}>No. WA</span>
                      <div className="profile-data-box" style={styles.dataBox}>
                        <span className="profile-data-value" style={styles.dataValue}>{profilePhone}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Role */}
                <div className="profile-data-row" style={styles.dataRow}>
                  <span className="profile-data-label" style={styles.dataLabel}>Role</span>
                  <div
                    className="profile-data-box"
                    style={{ ...styles.dataBox, cursor: 'not-allowed' }}
                  >
                    <span
                      className="profile-data-value"
                      style={{ ...styles.dataValue, cursor: 'not-allowed' }}
                    >
                      {roleDisplay}
                    </span>
                  </div>
                </div>

                {/* Tombol Edit Profil */}
                <div style={styles.viewButtonGroup}>
                  <button
                    id="btn-edit-profile"
                    type="button"
                    onClick={handleOpenEdit}
                    className="btn-primary-green"
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
                    className="btn-secondary-outline"
                    style={styles.backBtn}
                    aria-label="Kembali"
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
                        className="btn-secondary-outline"
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
                          className="btn-danger-red"
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
                    <div style={{ ...styles.inputWrapper, cursor: 'not-allowed' }}>
                      <EmailOutlinedIcon
                        sx={{
                          ...styles.inputIcon,
                          color: '#94a3b8'
                        }}
                      />
                      <input
                        type="email"
                        value={profileEmail}
                        readOnly
                        tabIndex={-1}
                        style={{
                          ...styles.disabledInputField,
                          cursor: 'not-allowed',
                          pointerEvents: 'auto'
                        }}
                        placeholder="nama@gmail.com"
                      />
                    </div>
                  </div>

                  {/* Input Nama & No. WA hanya ditampilkan jika role adalah Peserta */}
                  {isPeserta && (
                    <>
                      {/* Input Nama Lengkap */}
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Nama Lengkap</label>
                        <div style={styles.inputWrapper}>
                          <PersonOutlineOutlinedIcon
                            sx={{
                              ...styles.inputIcon,
                              color: errors.nama ? '#ef4444' : '#23573c'
                            }}
                          />
                          <input
                            id="input-edit-nama"
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              setEditName(e.target.value);
                              if (errors.nama) {
                                setErrors((prev) => ({ ...prev, nama: '' }));
                              }
                            }}
                            style={{
                              ...styles.inputField,
                              borderColor: errors.nama ? '#ef4444' : '#23573c'
                            }}
                            placeholder="Masukkan Nama Lengkap"
                          />
                        </div>
                        {errors.nama && (
                          <span style={styles.errorText}>{errors.nama}</span>
                        )}
                      </div>

                      {/* Input No. WhatsApp */}
                      <div style={styles.formGroup}>
                        <label style={styles.label}>No. WhatsApp / HP</label>
                        <div style={styles.inputWrapper}>
                          <PhoneOutlinedIcon
                            sx={{
                              ...styles.inputIcon,
                              color: errors.noHp ? '#ef4444' : '#23573c'
                            }}
                          />
                          <input
                            id="input-edit-nohp"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={13}
                            value={editPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              if (val.length <= 13) {
                                setEditPhone(val);
                              }
                              if (errors.noHp) {
                                setErrors((prev) => ({ ...prev, noHp: '' }));
                              }
                            }}
                            style={{
                              ...styles.inputField,
                              borderColor: errors.noHp ? '#ef4444' : '#23573c'
                            }}
                            placeholder="Contoh: 081234567890"
                          />
                        </div>
                        {errors.noHp && (
                          <span style={styles.errorText}>{errors.noHp}</span>
                        )}
                      </div>
                    </>
                  )}

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

                  {/* Form Kata Sandi */}
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
                      className="btn-secondary-outline"
                      style={styles.btnSecondary}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-green"
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
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: '1.5px solid #d1d5db',
    color: '#334155',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#23573c'
  },
  cardBody: {
    padding: '28px 28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  photoUploadSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px'
  },
  photoAvatarWrapper: {
    position: 'relative',
    marginBottom: '14px'
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
    bottom: '0px',
    right: '0px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#23573c',
    border: '2px solid #ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    padding: 0
  },
  photoActionButtons: {
    display: 'flex',
    gap: '10px'
  },
  btnChoosePhoto: {
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1.5px solid #23573c',
    color: '#23573c',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnDeletePhoto: {
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1.5px solid #ef4444',
    color: '#ef4444',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '20px',
    pointerEvents: 'none'
  },
  inputField: {
    width: '100%',
    height: '46px',
    padding: '0 44px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#334155',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  },
  disabledInputField: {
    width: '100%',
    height: '46px',
    padding: '0 44px',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f1f5f9',
    fontSize: '14px',
    color: '#64748b',
    boxSizing: 'border-box',
    cursor: 'not-allowed',
    fontFamily: 'inherit'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '2px'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
    marginBottom: '4px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkboxInput: {
    display: 'none'
  },
  checkboxCustom: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid #94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
  },
  checkboxText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#23573c'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px'
  },
  btnPrimary: {
    padding: '11px 26px',
    borderRadius: '10px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.25)',
    transition: 'all 0.2s ease',
    letterSpacing: '0.2px'
  },
  btnSecondary: {
    padding: '11px 24px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1.5px solid #cbd5e1',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
