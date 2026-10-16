import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import buktiSampaiImg from '../assets/bukti_pengiriman.jpg';

// Dropdown
function CustomDropdown({
  value,
  onChange,
  options = [],
  style = {},
  selectStyle = {},
  arrowColor = '#23573c',
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  const currentOption = options.find((opt) =>
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  const displayLabel = typeof currentOption === 'object' ? currentOption.label : (currentOption || value);

  return (
    <div
      ref={containerRef}
      className={`custom-dropdown-container ${className}`}
      style={{ position: 'relative', userSelect: 'none', ...style }}
    >
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        title={disabled ? 'Status sudah selesai (tidak dapat diubah lagi)' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          padding: '8px 16px',
          minHeight: '38px',
          fontSize: '13.5px',
          fontWeight: '600',
          border: '1px solid #23573c',
          borderRadius: '10px',
          backgroundColor: '#f6faf7',
          color: '#1a3e2b',
          transition: 'all 0.2s ease',
          boxShadow: isOpen && !disabled ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none',
          ...selectStyle,
          ...(disabled
            ? {
                cursor: 'not-allowed',
                backgroundColor: '#f1f5f9',
                borderColor: '#cbd5e1',
                color: '#64748b',
                boxShadow: 'none'
              }
            : {})
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayLabel}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={disabled ? '#94a3b8' : arrowColor}
          strokeWidth="2.5"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '8px'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div
          className="custom-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #23573c',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.16)',
            zIndex: 10005,
            maxHeight: '260px',
            overflowY: 'auto',
            padding: 0
          }}
        >
          {options.map((opt, idx) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;
            const isFirst = idx === 0;
            const isLast = idx === options.length - 1;

            return (
              <div
                key={idx}
                onClick={() => handleSelect(optVal)}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f3';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
                style={{
                  padding: '11px 14px',
                  fontSize: '13px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  backgroundColor: isSelected ? '#23573c' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  borderTopLeftRadius: isFirst ? '8px' : '0',
                  borderTopRightRadius: isFirst ? '8px' : '0',
                  borderBottomLeftRadius: isLast ? '8px' : '0',
                  borderBottomRightRadius: isLast ? '8px' : '0'
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// DatePicker Responsif Mobile & Desktop
function CustomDatePicker({
  value,
  onChange,
  disabled = false,
  title = 'Pilih tanggal pengiriman',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [viewYear, setViewYear] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseInt(value.slice(0, 4), 10);
    }
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseInt(value.slice(5, 7), 10) - 1;
    }
    return new Date().getMonth();
  });

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const selectedYearRef = useRef(null);
  const yearListRef = useRef(null);
  const selectedMonthRef = useRef(null);
  const monthListRef = useRef(null);

  useEffect(() => {
    if (isYearOpen && selectedYearRef.current && yearListRef.current) {
      const container = yearListRef.current;
      const target = selectedYearRef.current;
      container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
    }
  }, [isYearOpen]);

  useEffect(() => {
    if (isMonthOpen && selectedMonthRef.current && monthListRef.current) {
      const container = monthListRef.current;
      const target = selectedMonthRef.current;
      container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
    }
  }, [isMonthOpen]);

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 640 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setViewYear(parseInt(value.slice(0, 4), 10));
      setViewMonth(parseInt(value.slice(5, 7), 10) - 1);
    }
  }, [value]);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMonthOpen(false);
        setIsYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const prevMonth = (e) => {
    e.stopPropagation();
    setIsMonthOpen(false);
    setIsYearOpen(false);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setIsMonthOpen(false);
    setIsYearOpen(false);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    if (disabled) return;
    setIsMonthOpen(false);
    setIsYearOpen(false);
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const handleSetToday = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsMonthOpen(false);
    setIsYearOpen(false);
    const now = new Date();
    const yStr = now.getFullYear();
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const dStr = String(now.getDate()).padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setIsMonthOpen(false);
    setIsYearOpen(false);
    onChange('');
    setIsOpen(false);
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDate = today.getDate();

  let selY = null, selM = null, selD = null;
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split('-').map(Number);
    selY = parts[0];
    selM = parts[1] - 1;
    selD = parts[2];
  }

  const startYear = Math.min(2020, viewYear - 2);
  const endYear = Math.max(2035, viewYear + 5);
  const yearOptions = [];
  for (let y = startYear; y <= endYear; y++) {
    yearOptions.push(y);
  }

  const displayText = value && selY ? `${String(selD).padStart(2, '0')}/${String(selM + 1).padStart(2, '0')}/${selY}` : 'Pilih tanggal...';

  const calendarContent = (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsMonthOpen(false);
        setIsYearOpen(false);
      }}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #dce4de',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.18)',
        padding: '14px',
        boxSizing: 'border-box',
        width: isMobile ? '290px' : '280px',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '4px' }}>
        <button
          type="button"
          onClick={prevMonth}
          style={{
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1a3e2b',
            fontWeight: 'bold',
            fontSize: '13px',
            flexShrink: 0
          }}
          title="Bulan sebelumnya"
        >
          &lt;
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Custom Dropdown Bulan */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMonthOpen((prev) => !prev);
                setIsYearOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '700',
                color: isMonthOpen ? '#ffffff' : '#1a3e2b',
                backgroundColor: isMonthOpen ? '#23573c' : '#f6faf7',
                border: '1px solid #23573c',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Pilih Bulan"
            >
              <span>{MONTH_NAMES[viewMonth]}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isMonthOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isMonthOpen && (
              <div
                ref={monthListRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '120px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #23573c',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                  zIndex: 10050,
                  padding: '4px 0'
                }}
              >
                {MONTH_NAMES.map((mName, idx) => {
                  const isSel = idx === viewMonth;
                  return (
                    <div
                      key={idx}
                      ref={isSel ? selectedMonthRef : null}
                      onClick={() => {
                        setViewMonth(idx);
                        setIsMonthOpen(false);
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = '#f1f5f3';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: isSel ? '700' : '500',
                        backgroundColor: isSel ? '#23573c' : 'transparent',
                        color: isSel ? '#ffffff' : '#1e293b',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {mName}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Dropdown Tahun */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsYearOpen((prev) => !prev);
                setIsMonthOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: '700',
                color: isYearOpen ? '#ffffff' : '#1a3e2b',
                backgroundColor: isYearOpen ? '#23573c' : '#f6faf7',
                border: '1px solid #23573c',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Pilih Tahun"
            >
              <span>{viewYear}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isYearOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isYearOpen && (
              <div
                ref={yearListRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  width: '90px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #23573c',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                  zIndex: 10050,
                  padding: '4px 0'
                }}
              >
                {yearOptions.map((y) => {
                  const isSel = y === viewYear;
                  return (
                    <div
                      key={y}
                      ref={isSel ? selectedYearRef : null}
                      onClick={() => {
                        setViewYear(y);
                        setIsYearOpen(false);
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = '#f1f5f3';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: isSel ? '700' : '500',
                        backgroundColor: isSel ? '#23573c' : 'transparent',
                        color: isSel ? '#ffffff' : '#1e293b',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {y}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          style={{
            background: 'none',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#1a3e2b',
            fontWeight: 'bold',
            fontSize: '13px',
            flexShrink: 0
          }}
          title="Bulan berikutnya"
        >
          &gt;
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px' }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ fontSize: '11px', fontWeight: '700', color: i === 0 ? '#ef4444' : '#64748b', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => {
          const prevDate = daysInPrevMonth - firstDayOfWeek + i + 1;
          return (
            <div
              key={`prev-${i}`}
              style={{
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11.5px',
                color: '#cbd5e1'
              }}
            >
              {prevDate}
            </div>
          );
        })}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = selY === viewYear && selM === viewMonth && selD === day;
          const isToday = isCurrentMonthToday && todayDate === day;

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleSelectDay(day)}
              style={{
                height: '30px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: isSelected ? '700' : isToday ? '700' : '500',
                borderRadius: '6px',
                border: isSelected ? 'none' : isToday ? '1px solid #23573c' : 'none',
                backgroundColor: isSelected ? '#23573c' : 'transparent',
                color: isSelected ? '#ffffff' : isToday ? '#23573c' : '#1e293b',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f3';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', marginTop: '10px', paddingTop: '8px' }}>
        <button
          type="button"
          onClick={handleClear}
          style={{ background: 'none', border: 'none', fontSize: '11.5px', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
        >
          Hapus
        </button>
        <button
          type="button"
          onClick={handleSetToday}
          style={{ background: 'none', border: 'none', fontSize: '11.5px', color: '#23573c', cursor: 'pointer', fontWeight: '700' }}
        >
          Hari Ini
        </button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="custom-datepicker-container"
      style={{ position: 'relative', width: '100%', userSelect: 'none', ...style }}
    >
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setIsMonthOpen(false);
            setIsYearOpen(false);
          }
        }}
        title={title}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          padding: '6px 12px',
          minHeight: '34px',
          fontSize: '12.5px',
          fontWeight: '600',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          color: disabled ? '#64748b' : value ? '#1e293b' : '#94a3b8',
          transition: 'all 0.2s ease',
          boxShadow: isOpen && !disabled ? '0 0 0 3px rgba(35, 87, 60, 0.15)' : 'none'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayText}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={disabled ? '#94a3b8' : '#23573c'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginLeft: '6px' }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      {isOpen && !disabled && (
        isMobile ? (
          <>
            <div
              onClick={() => {
                setIsOpen(false);
                setIsMonthOpen(false);
                setIsYearOpen(false);
              }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 10025,
                animation: 'fadeIn 0.2s ease'
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10030
              }}
            >
              {calendarContent}
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 10020 }}>
            {calendarContent}
          </div>
        )
      )}
    </div>
  );
}

const METODE_OPTIONS = [
  'Semua Metode',
  'Ambil di RSQ Pusat',
  'Via Kurir',
  'Titip ke Ustazah'
];

const STATUS_FILTER_OPTIONS = [
  'Semua Status',
  'Perlu Dikirim',
  'Dikirim',
  'Selesai'
];

// Icons
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

// Data Pengiriman
const INITIAL_PENGIRIMAN = [
  {
    id: 'ORD-2026-001',
    idPesanan: 'ORD-2026-001',
    namaPembeli: 'Yohana Abigail',
    noHp: '0812-3456-7890',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Jl. Hang Kesturi, Nongsa',
    noKwitansi: '',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 5, harga: 25000 },
      { nama: 'Tajwidi', qty: 3, harga: 30000 }
    ]
  },
  {
    id: 'ORD-2026-002',
    idPesanan: 'ORD-2026-002',
    namaPembeli: 'Ririn Anisa',
    noHp: '0857-9876-5432',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Komplek Griya Indah Blok C3',
    noKwitansi: '',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 10, harga: 15000 },
      { nama: 'Anak 1', qty: 10, harga: 20000 }
    ]
  },
  {
    id: 'ORD-2026-003',
    idPesanan: 'ORD-2026-003',
    namaPembeli: 'Hendra Pratama',
    noHp: '0821-5566-7788',
    metode: 'Titip ke Ustazah',
    ongkirFlat: 0,
    alamat: 'Kavling Baru, Batu Aji ',
    noKwitansi: '',
    ustazahNama: 'Ustazah Fatimah Azzahra',
    lokasiAmbil: '',
    tanggalKirim: '',
    status: 'Perlu Dikirim',
    itemModul: [
      { nama: 'Tahmidi', qty: 4, harga: 28000 }
    ]
  },
  {
    id: 'ORD-2026-004',
    idPesanan: 'ORD-2026-004',
    namaPembeli: 'Ust. Ridwan Kamil',
    noHp: '0813-1122-3344',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Perumhan Taman Raya Blok B',
    noKwitansi: '',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-11',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Mushaf Ash Shahib A5 Terjemah', qty: 8, harga: 75000 },
      { nama: 'Panduan Guru', qty: 2, harga: 40000 }
    ]
  },
  {
    id: 'ORD-2026-005',
    idPesanan: 'ORD-2026-005',
    namaPembeli: 'Budi Santoso',
    noHp: '0878-4455-6677',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Perumahan Green Vienna Blok D',
    noKwitansi: '',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '2026-10-12',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Khat', qty: 4, harga: 22000 }
    ]
  },
  {
    id: 'ORD-2026-006',
    idPesanan: 'ORD-2026-006',
    namaPembeli: 'Farhan Ramadhan',
    noHp: '0812-7788-9900',
    metode: 'Titip ke Ustazah',
    ongkirFlat: 0,
    alamat: 'Jl. Sukajadi No. 102, Sukasari',
    noKwitansi: '',
    ustazahNama: 'Ustazah Maryam S.Pd.I',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-13',
    status: 'Dikirim',
    itemModul: [
      { nama: 'Tahsin Dewasa', qty: 3, harga: 35000 },
      { nama: 'Tajwidi', qty: 1, harga: 30000 }
    ]
  },
  {
    id: 'ORD-2026-007',
    idPesanan: 'ORD-2026-007',
    namaPembeli: 'Dewi Lestari',
    noHp: '0852-3344-5566',
    metode: 'Via Kurir',
    ongkirFlat: 10000,
    alamat: 'Jl. Antapani Raya No. 15',
    noKwitansi: 'KWT-2026-007',
    ustazahNama: '',
    lokasiAmbil: '',
    tanggalKirim: '2026-10-10',
    status: 'Selesai',
    buktiSampai: {
      fotoUrl: buktiSampaiImg
    },
    itemModul: [
      { nama: 'Buku Prestasi Anak', qty: 5, harga: 15000 }
    ]
  },
  {
    id: 'ORD-2026-008',
    idPesanan: 'ORD-2026-008',
    namaPembeli: 'Rian Hidayat',
    noHp: '0877-6655-4433',
    metode: 'Ambil di RSQ Pusat',
    ongkirFlat: 0,
    alamat: 'Komp. Margahayu Kencana Blok B2',
    noKwitansi: 'KWT-2026-008',
    ustazahNama: '',
    lokasiAmbil: 'Kantor RSQ Pusat',
    tanggalKirim: '2026-10-09',
    status: 'Selesai',
    buktiSampai: {
      fotoUrl: buktiSampaiImg
    },
    itemModul: [
      { nama: 'Tilawah Asasi', qty: 4, harga: 25000 },
      { nama: 'Khat', qty: 2, harga: 22000 }
    ]
  }
];

// Card Statistik
const STATS_CONFIG = [
  { key: 'totalPerluDikirim', label: 'Perlu Dikirim', status: 'Perlu Dikirim', border: '#d97706', color: '#d97706', bg: '#fef3c7', icon: Inventory2OutlinedIcon },
  { key: 'totalDikirim', label: 'Dikirim', status: 'Dikirim', border: '#2563eb', color: '#2563eb', bg: '#dbeafe', icon: LocalShippingOutlinedIcon },
  { key: 'totalSelesai', label: 'Selesai', status: 'Selesai', border: '#16a34a', color: '#16a34a', bg: '#dcfce7', icon: TaskAltOutlinedIcon }
];

export default function StatusPengiriman() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data State
  const [pengirimanList, setPengirimanList] = useState(INITIAL_PENGIRIMAN);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [metodeFilter, setMetodeFilter] = useState('Semua Metode');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [notification, setNotification] = useState(null);

  // Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [previewProofImg, setPreviewProofImg] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Toast Notifikasi
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Format Tanggal
  const formatTanggal = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${parseInt(day, 10)} ${monthNames[parseInt(month, 10) - 1] || month} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Filter Data
  const filteredPengiriman = useMemo(() => {
    return pengirimanList.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.idPesanan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaPembeli.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.noKwitansi && item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.noResi && item.noResi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ustazahNama && item.ustazahNama.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'Semua Status' || item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchMetode =
        metodeFilter === 'Semua Metode' || item.metode.toLowerCase() === metodeFilter.toLowerCase();

      return matchSearch && matchStatus && matchMetode;
    });
  }, [pengirimanList, searchQuery, statusFilter, metodeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPengiriman.length / itemsPerPage) || 1;
  const paginatedPengiriman = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPengiriman.slice(start, start + itemsPerPage);
  }, [filteredPengiriman, currentPage]);

  // Statistik (3 Status Sesuai Tabel)
  const stats = useMemo(() => {
    return {
      totalPerluDikirim: pengirimanList.filter((p) => p.status === 'Perlu Dikirim').length,
      totalDikirim: pengirimanList.filter((p) => p.status === 'Dikirim').length,
      totalSelesai: pengirimanList.filter((p) => p.status === 'Selesai').length,
      totalSemua: pengirimanList.length,
      totalKurir: pengirimanList.filter((p) => p.metode === 'Via Kurir').length,
      totalRsqPusat: pengirimanList.filter((p) => p.metode === 'Ambil di RSQ Pusat').length,
      totalUstazah: pengirimanList.filter((p) => p.metode === 'Titip ke Ustazah').length
    };
  }, [pengirimanList]);

  // Klik Kartu Statistik
  const handleStatCardClick = (targetStatus) => {
    setStatusFilter((prev) => (prev.toLowerCase() === targetStatus.toLowerCase() ? 'Semua Status' : targetStatus));
    setCurrentPage(1);
  };

  // Salin No. Kwitansi
  const handleCopyKwitansi = (kwitansi) => {
    if (!kwitansi) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(kwitansi).catch(() => {});
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = kwitansi;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    } catch {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = kwitansi;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch {}
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Simpan Perubahan dari Pop-up Detail
  const handleSaveDetail = () => {
    if (!selectedDetail) return;
    setPengirimanList((prevList) =>
      prevList.map((item) => (item.id === selectedDetail.id ? { ...selectedDetail } : item))
    );
    showToast(`Perubahan data pengiriman ${selectedDetail.id} berhasil disimpan!`, 'success');
    setSelectedDetail(null);
    setIsCopied(false);
  };

  // Warna
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Perlu Dikirim':
        return '#d97706';
      case 'Dikirim':
      case 'Sedang Dikirim':
        return '#0284c7';
      case 'Selesai':
      case 'Terkirim':
        return '#16a34a';
      default:
        return '#94a3b8';
    }
  };

  // Badge Metode Pengiriman
  const renderMetodeBadge = (metode) => {
    switch (metode) {
      case 'Ambil di RSQ Pusat':
        return <span style={styles.badgeRsqPusat}>🏢 RSQ Pusat</span>;
      case 'Via Kurir':
        return <span style={styles.badgeKurir}>🚚 Via Kurir</span>;
      case 'Titip ke Ustazah':
        return <span style={styles.badgeUstazah}>🧕 Titip Ustazah</span>;
      default:
        return <span style={styles.badgeKurir}>{metode || 'Via Kurir'}</span>;
    }
  };

  return (
    <div style={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar
        activeMenu="Pesanan & Kirim"
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div style={styles.mainWrapper}>
        {/* Navbar */}
        <Navbar
          title="Pesanan & Pengiriman"
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main style={styles.contentBody} className="content-body-responsive">
          {/* Toast Notifikasi */}
          {notification && (
            <div
              style={{
                ...styles.toast,
                backgroundColor: notification.type === 'success' ? '#166534' : '#991b1b'
              }}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <span>{notification.message}</span>
            </div>
          )}

          {/* Tab Navigasi */}
          <div style={styles.tabContainer} className="tab-container-responsive">
            <button
              type="button"
              onClick={() => navigate('/pesanan-kirim')}
              style={styles.tabButton}
            >
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Verifikasi Pembayaran</span>
            </button>

            <button
              type="button"
              style={{
                ...styles.tabButton,
                ...styles.tabButtonActive
              }}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Status Pengiriman</span>
              {stats.totalPerluDikirim > 0 && (
                <span style={styles.tabBadgeWarning}>{stats.totalPerluDikirim}</span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3 Kartu Statistik */}
            <div style={styles.statsGrid} className="stats-grid-responsive">
              {STATS_CONFIG.map((cfg) => {
                const IconComp = cfg.icon;
                const isActive = statusFilter === cfg.status;
                return (
                  <div
                    key={cfg.key}
                    onClick={() => handleStatCardClick(cfg.status)}
                    className="stat-card-responsive"
                    style={{
                      ...styles.statCard,
                      borderLeft: `4px solid ${cfg.border}`,
                      boxShadow: isActive
                        ? `0 0 0 2px ${cfg.border}, 0 4px 12px rgba(0,0,0,0.06)`
                        : '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                    title={`Klik untuk filter: ${cfg.label}`}
                  >
                    <div style={{ ...styles.statIconWrapper, backgroundColor: cfg.bg }}>
                      <IconComp sx={{ fontSize: 22, color: cfg.color }} />
                    </div>
                    <div>
                      <div style={styles.statLabel}>{cfg.label}</div>
                      <div style={styles.statValue}>{stats[cfg.key]}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filter & Pencarian */}
            <div className="filter-card-responsive" style={styles.filterCard}>
              <div className="filter-left-responsive" style={styles.filterLeft}>
                {/* Search Bar */}
                <div className="search-wrapper-responsive" style={styles.searchWrapper}>
                  <SearchOutlinedIcon sx={{ color: '#23573c', fontSize: 20, flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Cari nama pembeli..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input-responsive"
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={styles.searchClearBtn}
                      title="Hapus pencarian"
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="filter-right-responsive" style={styles.filterRight}>
                {/* Dropdown Metode Pengiriman */}
                <CustomDropdown
                  value={metodeFilter}
                  onChange={(val) => {
                    setMetodeFilter(val);
                    setCurrentPage(1);
                  }}
                  options={METODE_OPTIONS}
                  className="select-wrapper-responsive"
                  style={{ minWidth: '185px' }}
                />

                {/* Dropdown Status */}
                <CustomDropdown
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  options={STATUS_FILTER_OPTIONS}
                  className="select-wrapper-responsive"
                  style={{ minWidth: '160px' }}
                />
              </div>
            </div>

            {/* Tabel Pengiriman */}
            <div style={styles.tableCard}>
              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '31%' }} />
                  </colgroup>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, textAlign: 'center' }}>NO</th>
                      <th style={{ ...styles.th, paddingLeft: '20px' }}>PEMBELI</th>
                      <th style={{ ...styles.th, paddingLeft: '20px' }}>STATUS</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPengiriman.length > 0 ? (
                      paginatedPengiriman.map((item, index) => {
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedDetail(item)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8faf9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{ ...styles.tr, cursor: 'pointer' }}
                            title="Klik baris untuk melihat detail lengkap pengiriman"
                          >
                            {/* NO */}
                            <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                              {rowNumber}
                            </td>

                            {/* PEMBELI */}
                            <td style={{ ...styles.td, paddingLeft: '20px' }}>
                              <div style={styles.buyerNameText}>{item.namaPembeli}</div>
                            </td>

                            {/* STATUS */}
                            <td style={{ ...styles.td, paddingLeft: '20px' }}>
                              <div style={styles.statusIndicatorWrapper}>
                                <span
                                  style={{
                                    ...styles.statusDot,
                                    backgroundColor: getStatusDotColor(item.status)
                                  }}
                                />
                                <span style={styles.statusText}>{item.status}</span>
                              </div>
                            </td>

                            {/* AKSI */}
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedDetail(item)}
                                style={styles.btnActionDetailOnly}
                                title="Lihat Detail Lengkap Pengiriman"
                              >
                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Detail</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} style={styles.emptyTable}>
                          Tidak ada data pengiriman yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={styles.cardFooter} className="pagination-responsive">
                <div style={styles.pageInfo}>
                  {filteredPengiriman.length > 0
                    ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredPengiriman.length)} dari ${filteredPengiriman.length}`
                    : '0 dari 0'}
                </div>

                <div style={styles.paginationButtons}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    style={{
                      ...styles.btnPageArrow,
                      opacity: currentPage === 1 ? 0.4 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      style={{
                        ...styles.btnPageNum,
                        ...(currentPage === page ? styles.btnPageNumActive : {})
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    style={{
                      ...styles.btnPageArrow,
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail Pengiriman Modul */}
      {selectedDetail && (() => {
        const subtotalModul = (selectedDetail.itemModul || []).reduce(
          (sum, item) => sum + (item.harga || 0) * (item.qty || 1),
          0
        );
        const ongkirKurir = selectedDetail.metode === 'Via Kurir' ? 10000 : 0;
        const totalHarga = subtotalModul + ongkirKurir;
        const originalStatus = pengirimanList.find((p) => p.id === selectedDetail.id)?.status || selectedDetail.status;
        const statusOptions = originalStatus === 'Perlu Dikirim'
          ? ['Perlu Dikirim', 'Dikirim']
          : ['Dikirim', 'Selesai'];

        return (
          <div style={styles.modalOverlay} onClick={() => setSelectedDetail(null)}>
            <div style={styles.modalContentDetail} className="modal-detail-responsive" onClick={(e) => e.stopPropagation()}>
              {/* Header Modal */}
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Detail Pengiriman Modul</h3>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  style={styles.modalCloseBtn}
                  title="Tutup Modal"
                >
                  <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              <div style={styles.detailBody}>
                {/* Metadata Pesanan & Status */}
                <div style={styles.detailMetaCard}>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>No. Pesanan</span>
                    <span style={styles.detailMetaValueGreen}>{selectedDetail.id}</span>
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>Metode Pengiriman</span>
                    <span style={styles.detailMetaValue}>{selectedDetail.metode}</span>
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>Tanggal Pengiriman</span>
                    <div style={{ marginTop: '2px' }}>
                      <CustomDatePicker
                        value={selectedDetail.tanggalKirim || ''}
                        onChange={(newDate) =>
                          setSelectedDetail((prev) => ({ ...prev, tanggalKirim: newDate }))
                        }
                        disabled={selectedDetail.status === 'Selesai'}
                        title={
                          selectedDetail.status === 'Selesai'
                            ? 'Status sudah selesai (tanggal tidak dapat diubah)'
                            : 'Pilih atau ubah tanggal pengiriman'
                        }
                      />
                    </div>
                  </div>
                  <div style={styles.detailMetaItem}>
                    <span style={styles.detailMetaLabel}>
                      {selectedDetail.status === 'Selesai' ? 'Status' : 'Ubah Status'}
                    </span>
                    <div style={{ marginTop: '2px' }}>
                      <CustomDropdown
                        disabled={selectedDetail.status === 'Selesai'}
                        value={selectedDetail.status}
                        onChange={(newStatus) =>
                          setSelectedDetail((prev) => {
                            const today = new Date().toISOString().split('T')[0];
                            const autoKwitansi =
                              prev.noKwitansi || (prev.id ? prev.id.replace('ORD', 'KWT') : 'KWT-2026-001');
                            const autoBuktiSampai =
                              prev.buktiSampai || { fotoUrl: buktiSampaiImg };
                            return {
                              ...prev,
                              status: newStatus,
                              tanggalKirim:
                                newStatus === 'Dikirim' && !prev.tanggalKirim ? today : prev.tanggalKirim,
                              noKwitansi:
                                newStatus === 'Selesai' ? autoKwitansi : prev.noKwitansi,
                              buktiSampai:
                                newStatus === 'Selesai' ? autoBuktiSampai : prev.buktiSampai
                            };
                          })
                        }
                        options={statusOptions}
                        style={{ width: '100%' }}
                        selectStyle={{
                          padding: '6px 12px',
                          minHeight: '34px',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Pemesan & Pengiriman */}
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>Data Pemesan & Pengiriman</div>
                  <div style={styles.detailRecipientGrid} className="modal-form-grid2">
                    <div>
                      <span style={styles.detailFieldLabel}>Nama Pembeli</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.namaPembeli}</div>
                    </div>
                    <div>
                      <span style={styles.detailFieldLabel}>No.Hp</span>
                      <div style={styles.detailFieldValue}>{selectedDetail.noHp}</div>
                    </div>

                    {selectedDetail.metode === 'Titip ke Ustazah' && (
                      <div>
                        <span style={styles.detailFieldLabel}>Nama Ustazah</span>
                        <div style={styles.detailFieldValue}>{selectedDetail.ustazahNama || '-'}</div>
                      </div>
                    )}

                    {selectedDetail.metode === 'Ambil di RSQ Pusat' && (
                      <div>
                        <span style={styles.detailFieldLabel}>Lokasi Pengambilan</span>
                        <div style={styles.detailFieldValue}>Kantor RSQ Pusat</div>
                      </div>
                    )}

                    {selectedDetail.metode === 'Via Kurir' && (
                      <div style={{ gridColumn: selectedDetail.status === 'Selesai' ? 'span 1' : 'span 2' }}>
                        <span style={styles.detailFieldLabel}>Alamat Pengiriman</span>
                        <div style={styles.detailFieldValue}>{selectedDetail.alamat}</div>
                      </div>
                    )}

                    {selectedDetail.status === 'Selesai' && (
                      <div>
                        <span style={styles.detailFieldLabel}>No. Kwitansi</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <input
                            type="text"
                            placeholder="Masukkan no. kwitansi..."
                            value={selectedDetail.noKwitansi || ''}
                            onChange={(e) =>
                              setSelectedDetail((prev) => ({ ...prev, noKwitansi: e.target.value }))
                            }
                            style={styles.metaTextInput}
                          />
                          {selectedDetail.noKwitansi && (
                            <button
                              id="btn-copy-kwitansi"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyKwitansi(selectedDetail.noKwitansi);
                              }}
                              style={isCopied ? styles.btnCopySuccess : styles.btnCopyResiSimple}
                              title={isCopied ? 'Nomor kwitansi tersalin!' : 'Salin No. Kwitansi'}
                            >
                              {isCopied ? (
                                <>
                                  <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: '#16a34a' }} />
                                  <span style={{ color: '#16a34a', fontWeight: '700' }}>Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <ContentCopyOutlinedIcon sx={{ fontSize: 13 }} />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rincian Modul & Total Harga */}
                <div style={styles.detailSection}>
                  <div style={styles.detailSectionTitle}>Rincian Modul</div>
                  <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                    <table style={styles.detailItemTable}>
                      <thead>
                        <tr>
                          <th style={styles.detailTh}>Judul Modul</th>
                          <th style={{ ...styles.detailTh, textAlign: 'center' }}>Jumlah</th>
                          <th style={{ ...styles.detailTh, textAlign: 'right' }}>Harga Satuan</th>
                          <th style={{ ...styles.detailTh, textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedDetail.itemModul || []).map((item, idx) => (
                          <tr key={idx}>
                            <td style={styles.detailTd}>{item.nama}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'center' }}>{item.qty} Buku</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(item.harga || 0)}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                              {formatRupiah((item.harga || 0) * (item.qty || 1))}
                            </td>
                          </tr>
                        ))}
                        {selectedDetail.metode === 'Via Kurir' && (
                          <tr>
                            <td style={styles.detailTd}>Biaya Kurir</td>
                            <td style={{ ...styles.detailTd, textAlign: 'center' }}>-</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right' }}>{formatRupiah(10000)}</td>
                            <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '600' }}>
                              {formatRupiah(10000)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={3} style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700' }}>
                            Total:
                          </td>
                          <td style={{ ...styles.detailTd, textAlign: 'right', fontWeight: '700', color: '#166534', fontSize: '13.5px' }}>
                            {formatRupiah(totalHarga)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Foto Bukti Pengiriman */}
                {(selectedDetail.status === 'Selesai' || selectedDetail.status === 'Terkirim') && (
                  <div style={styles.detailSection}>
                    <div style={styles.detailSectionTitle}>Foto Bukti Pengiriman</div>
                    <div style={styles.detailReceiptWrapper}>
                      <img
                        src={selectedDetail.buktiSampai?.fotoUrl || buktiSampaiImg}
                        alt="Bukti Pengiriman"
                        style={{ ...styles.detailReceiptImg, cursor: 'pointer' }}
                        onClick={() => setPreviewProofImg(selectedDetail.buktiSampai?.fotoUrl || buktiSampaiImg)}
                        title="Klik untuk memperbesar foto bukti"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Batal & Simpan */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  style={styles.btnModalClose}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSaveDetail}
                  style={styles.btnModalSave}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Preview Foto Bukti Penerimaan */}
      {previewProofImg && (
        <div style={{ ...styles.modalOverlay, zIndex: 10005 }} onClick={() => setPreviewProofImg(null)}>
          <div style={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
            <img src={previewProofImg} alt="Preview Bukti Paket Sampai" style={styles.lightboxImg} />
            <button
              type="button"
              onClick={() => setPreviewProofImg(null)}
              style={styles.lightboxCloseBtn}
              title="Tutup Preview Foto"
            >
              <CloseOutlinedIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
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
    minWidth: 0
  },
  contentBody: {
    flex: 1,
    padding: '24px 32px 48px',
    maxWidth: '1440px',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto'
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '22px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '2px'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '6px 6px 0 0'
  },
  tabButtonActive: {
    color: '#23573c',
    borderBottom: '3px solid #23573c',
    backgroundColor: 'rgba(35, 87, 60, 0.06)'
  },
  tabBadgeWarning: {
    backgroundColor: '#d97706',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #eef2ef',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none'
  },
  statIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#64748b',
    lineHeight: '1.2'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    marginTop: '2px'
  },
  filterCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '16px 20px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    flexWrap: 'wrap',
    gap: '14px'
  },
  filterLeft: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: '220px'
  },
  filterRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f6faf7',
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid #23573c',
    flex: 1,
    width: '100%',
    minWidth: '220px',
    minHeight: '38px',
    boxSizing: 'border-box'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '13.5px',
    width: '100%',
    flex: 1,
    color: '#1a3e2b',
    padding: 0,
    fontFamily: 'inherit'
  },
  searchClearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexShrink: 0
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    border: '1px solid #dce4de',
    overflow: 'hidden'
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#ebf2ed',
    borderBottom: '1px solid #dce4de'
  },
  th: {
    padding: '16px 20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1d4632',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f0f5f2',
    transition: 'background 0.15s'
  },
  td: {
    padding: '14px 20px',
    fontSize: '14px',
    color: '#1a3e2b',
    verticalAlign: 'middle'
  },
  buyerNameText: {
    fontWeight: '700',
    color: '#1a3e2b',
    fontSize: '14px'
  },
  statusIndicatorWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px'
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a3e2b'
  },
  badgeRsqPusat: {
    display: 'inline-block',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeKurir: {
    display: 'inline-block',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeUstazah: {
    display: 'inline-block',
    backgroundColor: '#f5f3ff',
    color: '#6d28d9',
    border: '1px solid #ddd6fe',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    whiteSpace: 'nowrap'
  },
  badgeDefault: {
    display: 'inline-block',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  subBadgeKurir: {
    display: 'inline-block',
    backgroundColor: 'rgba(35, 87, 60, 0.08)',
    color: '#23573c',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  noResiBadge: {
    display: 'inline-block',
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  btnCopyResi: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    padding: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.2s'
  },
  addressLine: {
    fontSize: '11.5px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    maxWidth: '250px'
  },
  statusSelesaiBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95px',
    height: '28px',
    backgroundColor: '#dcfce7',
    color: '#15803d',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bbf7d0',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusDikirimBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95px',
    height: '28px',
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #bae6fd',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  statusPerluDikirimBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '115px',
    height: '28px',
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    borderRadius: '6px',
    fontSize: '11.5px',
    fontWeight: '700',
    letterSpacing: '0.4px',
    border: '1px solid #fef08a',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  },
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  btnActionDetail: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f0f5f2',
    color: '#23573c',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnActionSend: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnActionComplete: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  badgeDoneIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    color: '#16a34a'
  },
  emptyTable: {
    textAlign: 'center',
    padding: '40px',
    color: '#94a3b8',
    fontSize: '14px'
  },
  cardFooter: {
    padding: '14px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fcfdfd'
  },
  pageInfo: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  paginationButtons: {
    display: 'flex',
    gap: '6px'
  },
  btnPageArrow: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  btnPageNum: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  btnPageNumActive: {
    backgroundColor: '#23573c',
    color: '#ffffff',
    borderColor: '#23573c'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px'
  },
  modalContentLarge: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '820px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalContentDetail: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '18px 22px 20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    boxSizing: 'border-box'
  },
  modalContentForm: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '24px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalContentSimpleReject: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '22px 24px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0'
  },
  modalHeaderSimple: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a3e2b',
    margin: 0
  },
  modalTitleSimpleGreen: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#166534',
    margin: 0
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px'
  },
  modalBodyScroll: {
    overflowY: 'auto',
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8faf9',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #eef2ef'
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 1
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '6px',
    transition: 'all 0.2s ease'
  },
  stepTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1.2'
  },
  stepSubtitle: {
    fontSize: '10px',
    color: '#64748b',
    marginTop: '2px'
  },
  stepLine: {
    flex: 1,
    height: '3px',
    margin: '0 6px',
    marginTop: '-20px',
    borderRadius: '2px',
    transition: 'all 0.2s ease'
  },
  detailBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailMetaCard: {
    backgroundColor: '#f8faf9',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '12px 16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 18px',
    alignItems: 'center'
  },
  detailMetaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  detailMetaLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  detailMetaValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b'
  },
  detailMetaValueGreen: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#166534'
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailSectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a3e2b',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '5px'
  },
  detailRecipientGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 18px',
    fontSize: '13px'
  },
  detailFieldLabel: {
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#64748b',
    display: 'block',
    marginBottom: '2px',
    textTransform: 'uppercase'
  },
  detailFieldValue: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: '1.4'
  },
  detailItemTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12.5px'
  },
  detailTh: {
    backgroundColor: '#f8fafc',
    padding: '6px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    fontWeight: '600'
  },
  detailTd: {
    padding: '6px 8px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155'
  },
  detailReceiptWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    marginTop: '6px'
  },
  detailReceiptImg: {
    width: '100%',
    maxWidth: '320px',
    maxHeight: '260px',
    objectFit: 'cover',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0'
  },
  btnCopyResiSimple: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  btnCopySuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ecfdf5',
    color: '#16a34a',
    border: '1px solid #a7f3d0',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'default',
    transition: 'all 0.2s ease'
  },
  metaDateInput: {
    marginTop: '2px',
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '170px'
  },
  metaTextInput: {
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    maxWidth: '220px',
    boxSizing: 'border-box'
  },
  btnActionDetailOnly: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ecfdf5',
    color: '#166534',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  metodeFixedBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '8px'
  },
  lightboxContainer: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  lightboxImg: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  lightboxCloseBtn: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  btnModalClose: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1.5px solid #23573c',
    backgroundColor: '#ffffff',
    color: '#23573c',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnModalSave: {
    padding: '8px 22px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)',
    transition: 'all 0.2s ease'
  },
  btnModalPrimary: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#23573c',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(35, 87, 60, 0.25)',
    transition: 'all 0.2s ease'
  },
  btnModalApprove: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  summaryInfoCard: {
    backgroundColor: '#f8faf9',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  metodeRadioGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px',
    marginTop: '6px'
  },
  metodeRadioCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  metodeRadioCardActiveGreen: {
    borderColor: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.05)'
  },
  metodeRadioCardActiveBlue: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.05)'
  },
  metodeRadioCardActivePurple: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124, 58, 237, 0.05)'
  },
  formSectionBoxBlue: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formSectionBoxGreen: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formSectionBoxPurple: {
    backgroundColor: '#f5f3ff',
    border: '1px solid #ddd6fe',
    borderRadius: '10px',
    padding: '12px 14px'
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#334155',
    display: 'block',
    marginBottom: '5px'
  },
  formInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  formSelect: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  formTextarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    color: '#1e293b',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '11.5px',
    marginTop: '4px',
    display: 'block'
  },
  simpleModalBody: {
    padding: '10px 0 16px'
  },
  simpleConfirmText: {
    fontSize: '13.5px',
    color: '#334155',
    lineHeight: '1.5'
  },
  simpleModalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  btnSimpleCancel: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnSimpleConfirmApprove: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#166534',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
