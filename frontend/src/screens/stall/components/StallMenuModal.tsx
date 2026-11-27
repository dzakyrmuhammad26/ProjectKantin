import React from 'react';
import { MenuImageUploadField } from '@/components/MenuImageUploadField';

interface StallMenuModalProps {
  modalMode: 'tambah' | 'edit' | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formKode: string;
  onFormKodeChange: (val: string) => void;
  formNama: string;
  onFormNamaChange: (val: string) => void;
  formHarga: number;
  onFormHargaChange: (val: number) => void;
  formKategori: 'makanan' | 'minuman' | 'camilan';
  onFormKategoriChange: (val: 'makanan' | 'minuman' | 'camilan') => void;
  formFoto: string;
  onFormFotoChange: (val: string) => void;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  isSubmitting: boolean;
}

export function StallMenuModal({
  modalMode,
  onClose,
  onSubmit,
  formKode,
  onFormKodeChange,
  formNama,
  onFormNamaChange,
  formHarga,
  onFormHargaChange,
  formKategori,
  onFormKategoriChange,
  formFoto,
  onFormFotoChange,
  selectedFile,
  onFileSelect,
  isSubmitting,
}: StallMenuModalProps) {
  if (!modalMode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-base font-bold text-[#111827]">
            {modalMode === 'tambah' ? 'Tambah Menu Stan Baru' : 'Edit Menu Stan'}
          </h3>
          <button
            onClick={onClose}
            className="text-xs text-[#6B7280] hover:text-[#111827]"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3.5 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#374151] mb-1">Kode Menu</label>
            <input
              type="text"
              value={formKode}
              onChange={(e) => onFormKodeChange(e.target.value)}
              required
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Menu</label>
            <input
              type="text"
              value={formNama}
              onChange={(e) => onFormNamaChange(e.target.value)}
              required
              placeholder="Contoh: Pempek Kulit Crispy"
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Harga (Rupiah)</label>
            <input
              type="number"
              value={formHarga}
              onChange={(e) => onFormHargaChange(parseInt(e.target.value, 10) || 0)}
              required
              min={1000}
              step={1000}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Kategori</label>
            <select
              value={formKategori}
              onChange={(e) => onFormKategoriChange(e.target.value as any)}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="camilan">Camilan</option>
            </select>
          </div>

          <MenuImageUploadField
            imageUrl={formFoto}
            onImageUrlChange={onFormFotoChange}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
          />

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
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
