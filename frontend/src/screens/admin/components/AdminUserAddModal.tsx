import React from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Pengguna, PeranPengguna } from '@/models/pengguna';
import { Gerai } from '@/models/gerai';

interface AdminUserAddModalProps {
  isOpen: boolean;
  editingUser: Pengguna | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  nama: string;
  onNamaChange: (val: string) => void;
  username: string;
  onUsernameChange: (val: string) => void;
  peran: PeranPengguna;
  onPeranChange: (val: PeranPengguna) => void;
  idGerai: string;
  onIdGeraiChange: (val: string) => void;
  geraiList: Gerai[];
  pin: string;
  onPinChange: (val: string) => void;
  isSubmitting?: boolean;
}

export function AdminUserAddModal({
  isOpen,
  editingUser,
  onClose,
  onSubmit,
  nama,
  onNamaChange,
  username,
  onUsernameChange,
  peran,
  onPeranChange,
  idGerai,
  onIdGeraiChange,
  geraiList,
  pin,
  onPinChange,
  isSubmitting = false,
}: AdminUserAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-base font-bold text-[#111827]">
            {editingUser ? 'Edit Akun Staf' : 'Tambah Akun Staf Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#6B7280] hover:text-[#111827]"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => onNamaChange(e.target.value)}
              required
              minLength={2}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              required
              minLength={3}
              pattern="^[a-zA-Z0-9_]+$"
              title="Hanya huruf, angka, dan underscore"
              placeholder="budisantoso"
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Peran (Role)</label>
            <select
              value={peran}
              onChange={(e) => onPeranChange(e.target.value as PeranPengguna)}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
            >
              <option value="kasir">Kasir Sentral</option>
              <option value="gerai">Operator Gerai / Stan</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          {peran === 'gerai' && (
            <div>
              <label className="block font-medium text-[#374151] mb-1">Tugaskan ke Stan</label>
              <select
                value={idGerai}
                onChange={(e) => onIdGeraiChange(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
              >
                {geraiList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.kode} - {g.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!editingUser && (
            <div>
              <label className="block font-medium text-[#374151] mb-1">PIN Login (4 - 6 Angka)</label>
              <input
                type="password"
                maxLength={6}
                minLength={4}
                value={pin}
                onChange={(e) => onPinChange(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="1234"
                className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg font-mono"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-lg border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-70"
            >
              {isSubmitting && <LoadingSpinner size="xs" variant="white" />}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
