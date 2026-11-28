import React from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Gerai } from '@/models/gerai';

interface AdminStallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingGerai: Gerai | null;
  kode: string;
  onKodeChange: (val: string) => void;
  nama: string;
  onNamaChange: (val: string) => void;
  penyewa: string;
  onPenyewaChange: (val: string) => void;
  warna: string;
  onWarnaChange: (val: string) => void;
  isSubmitting?: boolean;
}

export function AdminStallModal({
  isOpen,
  onClose,
  onSubmit,
  editingGerai,
  kode,
  onKodeChange,
  nama,
  onNamaChange,
  penyewa,
  onPenyewaChange,
  warna,
  onWarnaChange,
  isSubmitting = false,
}: AdminStallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-base font-bold text-[#111827]">
            {editingGerai ? 'Edit Data Stan' : 'Tambah Stan Baru'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs text-[#6B7280] hover:text-[#111827] disabled:opacity-50"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-[#374151] mb-1">Kode Stan</label>
            <input
              type="text"
              value={kode}
              onChange={(e) => onKodeChange(e.target.value)}
              placeholder="G05"
              required
              disabled={Boolean(editingGerai) || isSubmitting}
              minLength={2}
              maxLength={10}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Stan / Gerai</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => onNamaChange(e.target.value)}
              placeholder="Contoh: Bakso Solo Pak Min"
              required
              minLength={2}
              disabled={isSubmitting}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Nama Penyewa / Penjual</label>
            <input
              type="text"
              value={penyewa}
              onChange={(e) => onPenyewaChange(e.target.value)}
              placeholder="Contoh: Pak Min"
              required
              minLength={2}
              disabled={isSubmitting}
              className="w-full px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block font-medium text-[#374151] mb-1">Warna Aksen</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={warna}
                onChange={(e) => onWarnaChange(e.target.value)}
                disabled={isSubmitting}
                className="w-10 h-10 border-0 rounded cursor-pointer disabled:opacity-50"
              />
              <span className="font-mono text-xs text-[#4B5563]">{warna}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
