import React from 'react';
import { Pengguna } from '@/models/pengguna';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

interface AdminUserResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: Pengguna | null;
  pinBaru: string;
  onPinBaruChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function AdminUserResetModal({
  isOpen,
  onClose,
  selectedUser,
  pinBaru,
  onPinBaruChange,
  onSubmit,
  isSubmitting = false,
}: AdminUserResetModalProps) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-[#111827]">
          Reset PIN untuk {selectedUser.nama}
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              PIN Baru (4 - 6 Digit Angka)
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinBaru}
              disabled={isSubmitting}
              onChange={(e) => onPinBaruChange(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="Contoh: 1234"
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-50 disabled:opacity-70"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#D1D5DB] text-[#4B5563] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-70"
            >
              {isSubmitting && <LoadingSpinner size="xs" variant="white" />}
              {isSubmitting ? 'Menyimpan...' : 'Simpan PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
