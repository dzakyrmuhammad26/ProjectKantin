'use client';

import React from 'react';

export interface CustomerNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function CustomerNumberInput({
  value,
  onChange,
  error,
  placeholder = 'Masukkan nomor pelanggan / meja (cth: 12)',
  disabled = false,
  id = 'customer-number-input',
  className = '',
}: CustomerNumberInputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[12px] font-semibold text-ink">
          Nomor Pelanggan <span className="text-status-cancel">*</span>
        </label>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-muted hover:text-status-cancel transition-colors"
          >
            Hapus
          </button>
        )}
      </div>

      <div className="relative w-full">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 px-3 rounded-[8px] border text-[14px] text-ink placeholder:text-faint bg-white outline-none transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${
            error
              ? 'border-status-cancel focus:border-status-cancel focus:ring-1 focus:ring-status-cancel'
              : 'border-line focus:border-brand-700 focus:ring-1 focus:ring-brand-700'
          }`}
        />
      </div>

      {error ? (
        <span className="text-[11px] text-status-cancel font-medium">{error}</span>
      ) : (
        <span className="text-[11px] text-muted">
          Wajib diisi sebelum konfirmasi pemesanan.
        </span>
      )}
    </div>
  );
}

export default CustomerNumberInput;
