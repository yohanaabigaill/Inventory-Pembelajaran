import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ModalKonfirmasiPesanan from '../../components/ModalKonfirmasiPesanan';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { Checkbox } from '@mui/material';

export default function Keranjang() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State keranjang
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('inventory_rsq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // State modal checkout
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);


  // Toast
  const [notification, setNotification] = useState(null);
  const notifTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    setNotification({ message, type });
    notifTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  // Simpan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('inventory_rsq_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  }, [cartItems]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Hitung item yang dicentang
  const checkedItems = cartItems.filter((item) => item.checked);
  const checkedCount = checkedItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const checkedTotalHarga = checkedItems.reduce(
    (sum, item) => sum + item.hargaJual * (Number(item.qty) || 0),
    0
  );

  const isAllChecked = cartItems.length > 0 && cartItems.every((item) => item.checked);

  // Toggle centang item
  const handleToggleItemCheck = (modulId, checked) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === modulId
          ? { ...item, checked: typeof checked === 'boolean' ? checked : !item.checked }
          : item
      )
    );
  };

  // Toggle pilih semua
  const handleToggleSelectAll = (checked) => {
    const nextVal = typeof checked === 'boolean' ? checked : !isAllChecked;
    setCartItems((prev) => prev.map((item) => ({ ...item, checked: nextVal })));
  };

  // Update qty
  const handleUpdateCartQty = (modulId, newQty) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.id === modulId) {
          if (newQty === '') {
            return { ...item, qty: '' };
          }
          const parsed = Number(newQty);
          if (parsed > item.stok) {
            showToast('Jumlah melebihi sisa stok', 'error');
          }
          const clamped = Math.max(1, Math.min(parsed, item.stok));
          return { ...item, qty: clamped };
        }
        return item;
      });
    });
  };

  // Hapus satu item
  const handleRemoveFromCart = (modulId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== modulId));
    showToast('Modul berhasil dihapus dari keranjang');
  };

  // Hapus item terpilih
  const handleRemoveSelected = () => {
    if (checkedItems.length === 0) return;
    setCartItems((prev) => prev.filter((item) => !item.checked));
    showToast(`${checkedItems.length} modul terpilih dihapus dari keranjang`);
  };

  // Buka checkout
  const handleProceedToCheckout = () => {
    if (checkedItems.length === 0) {
      showToast('Pilih setidaknya 1 modul untuk checkout', 'error');
      return;
    }
    setIsCheckoutModalOpen(true);
  };


  return (
    <div style={styles.layoutContainer}>
      <Sidebar
        role="peserta"
        activeMenu=""
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        <Navbar
          title="Keranjang Belanja"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="cart-content-body" style={styles.contentBody}>
          {/* Toast */}
          {notification && (
            <div
              className="toast-responsive"
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'error' ? '#dc2626' : '#23573c'
              }}
            >
              {notification.type === 'error' ? (
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Navigasi kembali */}
          <div style={styles.topBar}>
            <button
              type="button"
              onClick={() => navigate('/katalog-modul')}
              style={styles.btnKembaliKatalog}
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Kembali ke Katalog Modul</span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            /* Keranjang kosong */
            <div style={styles.emptyCartBox}>
              <div style={styles.emptyCartIconWrap}>
                <RemoveShoppingCartOutlinedIcon sx={{ fontSize: 56, color: '#94a3b8' }} />
              </div>
              <h3 style={styles.emptyCartTitle}>Keranjang Belanja Anda Kosong</h3>
              <p style={styles.emptyCartDesc}>
                Yuk, temukan modul pembelajaran di katalog modul kami.
              </p>
              <button
                type="button"
                onClick={() => navigate('/katalog-modul')}
                style={styles.btnMulaiBelanja}
              >
                Jelajahi Katalog Modul
              </button>
            </div>
          ) : (
            /* Tabel keranjang */
            <div className="cart-table-card" style={styles.cartTableCard}>
              <div className="cart-table-scroll-container">
                <div className="cart-table-inner">
                  {/* Header tabel */}
                  <div className="cart-table-header" style={styles.tableHeaderRow}>
                    <div className="cart-col-checkbox" style={styles.colCheckbox}>
                      <Checkbox
                        size="small"
                        checked={isAllChecked}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        title="Pilih Semua Modul"
                        sx={{
                          color: '#23573c',
                          '&.Mui-checked': { color: '#23573c' },
                          padding: '4px'
                        }}
                      />
                    </div>
                    <div className="cart-col-modul" style={{ ...styles.colModul, ...styles.headerColText }}>
                      Produk Modul ({cartItems.length})
                    </div>
                    <div className="cart-col-price" style={{ ...styles.colPrice, ...styles.headerColText }}>
                      Harga Satuan
                    </div>
                    <div className="cart-col-qty" style={{ ...styles.colQty, ...styles.headerColText }}>
                      Jumlah
                    </div>
                    <div className="cart-col-subtotal" style={{ ...styles.colSubtotal, ...styles.headerColText }}>
                      Total Harga
                    </div>
                    <div className="cart-col-action" style={{ ...styles.colAction, ...styles.headerColText }}>
                      Aksi
                    </div>
                  </div>

                  {/* Daftar item */}
                  <div className="cart-table-body" style={styles.tableBody}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="cart-item-row"
                        style={{
                          ...styles.tableItemRow,
                          backgroundColor: item.checked ? '#ffffff' : '#fcfdfd'
                        }}
                      >
                        {/* Checkbox */}
                        <div className="cart-col-checkbox" style={styles.colCheckbox}>
                          <Checkbox
                            size="small"
                            checked={!!item.checked}
                            onChange={(e) => handleToggleItemCheck(item.id, e.target.checked)}
                            sx={{
                              color: '#23573c',
                              '&.Mui-checked': { color: '#23573c' },
                              padding: '4px'
                            }}
                          />
                        </div>

                        {/* Info modul */}
                        <div className="cart-col-modul" style={styles.colModul}>
                          <img src={item.cover} alt={item.nama} className="cart-item-thumb" style={styles.itemThumb} />
                          <div style={styles.itemDetailWrap}>
                            <span style={styles.itemKategori}>{item.kategori}</span>
                            <h4 style={styles.itemTitle}>{item.nama}</h4>
                            <span style={styles.itemStokInfo}>Sisa stok: {item.stok}</span>
                          </div>
                        </div>

                        {/* Harga satuan */}
                        <div className="cart-col-price" style={styles.colPrice}>
                          <span style={styles.itemUnitPrice}>{formatRupiah(item.hargaJual)}</span>
                        </div>

                        {/* Stepper qty */}
                        <div className="cart-col-qty" style={styles.colQty}>
                          <div style={styles.stepperContainer}>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCartQty(item.id, (Number(item.qty) || 1) - 1)
                              }
                              style={styles.btnStepper}
                              aria-label="Kurangi"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={item.qty}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                handleUpdateCartQty(
                                  item.id,
                                  val === '' ? '' : parseInt(val, 10)
                                );
                              }}
                              onBlur={() => {
                                if (!item.qty || Number(item.qty) < 1) {
                                  handleUpdateCartQty(item.id, 1);
                                }
                              }}
                              style={styles.stepperInput}
                              aria-label="Jumlah"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (Number(item.qty) >= item.stok) {
                                  showToast('Jumlah melebihi sisa stok', 'error');
                                  return;
                                }
                                handleUpdateCartQty(item.id, (Number(item.qty) || 0) + 1);
                              }}
                              style={{
                                ...styles.btnStepper,
                                opacity: Number(item.qty) >= item.stok ? 0.35 : 1,
                                cursor:
                                  Number(item.qty) >= item.stok ? 'not-allowed' : 'pointer'
                              }}
                              aria-label="Tambah"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="cart-col-subtotal" style={styles.colSubtotal}>
                          <span style={styles.itemSubtotalPrice}>
                            {formatRupiah(item.hargaJual * (Number(item.qty) || 0))}
                          </span>
                        </div>

                        {/* Aksi */}
                        <div className="cart-col-action" style={styles.colAction}>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={styles.btnRowDelete}
                            title="Hapus dari keranjang"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer bar */}
              <div className="cart-sticky-footer" style={styles.stickyFooterBar}>
                <div className="cart-footer-left" style={styles.footerLeft}>
                  {checkedItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRemoveSelected}
                      className="btn-delete-selected"
                      style={styles.btnDeleteSelected}
                    >
                      Hapus yang dipilih ({checkedItems.length})
                    </button>
                  )}
                </div>

                <div className="cart-footer-right" style={styles.footerRight}>
                  <div className="cart-total-summary-wrap" style={styles.totalSummaryWrap}>
                    <span className="cart-total-summary-label" style={styles.totalSummaryLabel}>Total</span>
                    <span className="cart-total-summary-price" style={styles.totalSummaryPrice}>
                      {formatRupiah(checkedTotalHarga)}
                    </span>
                  </div>

                  <button
                    id="btn-checkout-page"
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="btn-checkout"
                    style={styles.btnCheckout}
                  >
                    <span>Checkout ({checkedCount})</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal checkout */}
      <ModalKonfirmasiPesanan
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={checkedItems}
        canEditQty={false}
        onSuccess={() => {
          setCartItems((prev) => prev.filter((item) => !item.checked));
        }}
      />
    </div>
  );
}

const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8faf9',
    fontFamily: "'Poppins', sans-serif"
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: '#f8faf9'
  },
  contentBody: {
    padding: '24px 32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  btnKembaliKatalog: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #c7d9cd',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  cartTableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    overflow: 'hidden',
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box'
  },
  tableHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#ebf2ed',
    borderBottom: '1px solid #dce4de'
  },
  colCheckbox: {
    width: '56px',
    minWidth: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  colModul: {
    flex: 2,
    minWidth: '220px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  colPrice: {
    flex: 1,
    minWidth: '120px',
    textAlign: 'center'
  },
  colQty: {
    flex: 1,
    minWidth: '130px',
    display: 'flex',
    justifyContent: 'center'
  },
  colSubtotal: {
    flex: 1,
    minWidth: '120px',
    textAlign: 'center'
  },
  colAction: {
    width: '80px',
    textAlign: 'center',
    flexShrink: 0
  },
  headerColText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1d4632',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  selectAllText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#162a20'
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  tableItemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s ease'
  },
  itemThumb: {
    width: '52px',
    height: '72px',
    borderRadius: '6px',
    objectFit: 'cover',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    flexShrink: 0
  },
  itemDetailWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0
  },
  itemKategori: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    fontSize: '10.5px',
    fontWeight: '700',
    color: '#23573c',
    backgroundColor: '#eaf7ef',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  itemTitle: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  itemStokInfo: {
    fontSize: '11.5px',
    color: '#64748b'
  },
  itemUnitPrice: {
    fontSize: '14.5px',
    color: '#0f172a',
    fontWeight: '700'
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f8fafc'
  },
  btnStepper: {
    width: '28px',
    height: '28px',
    backgroundColor: '#ffffff',
    border: 'none',
    color: '#0f172a',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease'
  },
  stepperInput: {
    width: '40px',
    height: '28px',
    border: 'none',
    borderLeft: '1px solid #cbd5e1',
    borderRight: '1px solid #cbd5e1',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit'
  },
  itemSubtotalPrice: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  btnRowDelete: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: 'none',
    padding: '7px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease'
  },
  stickyFooterBar: {
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    borderTop: '2px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    boxShadow: '0 -4px 16px rgba(0,0,0,0.03)'
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  btnDeleteSelected: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#dc2626',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px'
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginLeft: 'auto'
  },
  totalSummaryWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  totalSummaryLabel: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  totalSummaryPrice: {
    fontSize: '14.5px',
    fontWeight: '700',
    color: '#0f172a'
  },
  btnCheckout: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 28px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '14.5px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(35, 87, 60, 0.28)',
    transition: 'all 0.15s ease'
  },
  emptyCartBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    padding: '70px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px'
  },
  emptyCartIconWrap: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px'
  },
  emptyCartTitle: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  emptyCartDesc: {
    fontSize: '13.5px',
    color: '#64748b',
    margin: 0,
    maxWidth: '380px'
  },
  btnMulaiBelanja: {
    marginTop: '10px',
    padding: '11px 26px',
    borderRadius: '10px',
    backgroundColor: '#23573c',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(35, 87, 60, 0.22)'
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
    backgroundColor: '#23573c',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 'calc(100vw - 48px)'
  }
};
