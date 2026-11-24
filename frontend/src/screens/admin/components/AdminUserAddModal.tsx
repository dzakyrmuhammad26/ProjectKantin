import React from 'react';
import { PeranPengguna } from '@/models/pengguna';
import { Gerai } from '@/models/gerai';

interface AdminUserAddModalProps {
  isOpen: boolean;
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
}

export function AdminUserAddModal({
  isOpen,
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
}: AdminUserAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#111827]">
          Tambah Akun Staf Baru
        </h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => onNamaChange(e.target.value)}
              required
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

          <div>
            <label className="block font-medium text-[#374151] mb-1">PIN Login (4 - 6 Angka)</label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => onPinChange(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="1234"
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#D1D5DB] text-[#4B5563]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
