import React from 'react';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';

interface AdminMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingMenu: Menu | null;
  geraiList: Gerai[];
  formIdGerai: string;
  onIdGeraiChange: (val: string) => void;
  formKode: string;
  onKodeChange: (val: string) => void;
  formNama: string;
  onNamaChange: (val: string) => void;
  formHarga: number;
  onHargaChange: (val: number) => void;
  formKategori: 'makanan' | 'minuman' | 'camilan';
  onKategoriChange: (val: 'makanan' | 'minuman' | 'camilan') => void;
}

export function AdminMenuModal({
  isOpen,
  onClose,
  onSubmit,
  editingMenu,
  geraiList,
  formIdGerai,
  onIdGeraiChange,
  formKode,
  onKodeChange,
  formNama,
  onNamaChange,
  formHarga,
  onHargaChange,
  formKategori,
  onKategoriChange,
}: AdminMenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-base font-bold text-[#111827]">
            {editingMenu ? 'Edit Menu Global' : 'Tambah Menu Baru'}
          </h3>
          <button
            onClick={onClose}
            className="text-xs text-[#6B7280] hover:text-[#111827]"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#374151] mb-1">Pilih Stan</label>
            <select
              value={formIdGerai}
              onChange={(e) => onIdGeraiChange(e.target.value)}
              disabled={!!editingMenu}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
            >
              {geraiList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.kode} - {g.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Kode Menu</label>
            <input
              type="text"
              value={formKode}
              onChange={(e) => onKodeChange(e.target.value)}
              required
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg font-mono uppercase"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Menu</label>
            <input
              type="text"
              value={formNama}
              onChange={(e) => onNamaChange(e.target.value)}
              required
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Harga (Rp)</label>
            <input
              type="number"
              value={formHarga}
              onChange={(e) => onHargaChange(parseInt(e.target.value, 10) || 0)}
              required
              min={1000}
              step={1000}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Kategori</label>
            <select
              value={formKategori}
              onChange={(e) => onKategoriChange(e.target.value as any)}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg bg-white"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="camilan">Camilan</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Simpan Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
