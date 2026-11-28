'use client';

import { AdminFormSkeleton } from '@/components/loading/LoadingSkeletons';
import { MotionFadeIn } from '@/components/loading/MotionFadeIn';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { RoleGuard } from '@/components/RoleGuard';
import { MetodePembayaran } from '@/models/pembayaran';
import { useAdminSettings } from './useAdminSettings';

const AVAILABLE_PAYMENT_METHODS: { id: MetodePembayaran; label: string }[] = [
  { id: 'tunai', label: 'Uang Tunai' },
  { id: 'qris', label: 'QRIS' },
  { id: 'debit', label: 'Kartu Debit EDC' },
];

export function AdminSettingsScreen() {
  const {
    namaKantin,
    setNamaKantin,
    alamatKantin,
    setAlamatKantin,
    nomorKartuMin,
    setNomorKartuMin,
    nomorKartuMax,
    setNomorKartuMax,
    teksFooterStruk,
    setTeksFooterStruk,
    metodeBayarAktif,
    toggleMetodeBayar,
    isLoading,
    isSaving,
    feedback,
    handleSimpan,
  } = useAdminSettings();

  return (
    <RoleGuard allowedRoles={['superadmin']} areaLabel="Pengaturan Sistem Kantin">
      {isLoading ? (
        <div className="min-h-screen bg-[#F8F9FA]">
          <div className="h-[64px] bg-[#111827]" />
          <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <AdminFormSkeleton />
          </div>
        </div>
      ) : (
        <MotionFadeIn className="min-h-screen bg-[#F8F9FA] flex flex-col">
          <AdminNavbar />

          <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                Pengaturan Sistem Kantin
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                Konfigurasi identitas kantin, rentang nomor kartu fisik, metode pembayaran, dan teks struk
              </p>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-lg text-xs sm:text-sm font-medium border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form
              onSubmit={handleSimpan}
              className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs flex flex-col gap-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block font-semibold text-[#374151] mb-1">
                  Nama Kantin / Pujasera
                </label>
                <input
                  type="text"
                  value={namaKantin}
                  onChange={(e) => setNamaKantin(e.target.value)}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1">
                  Alamat / Lokasi Kantin
                </label>
                <input
                  type="text"
                  value={alamatKantin}
                  onChange={(e) => setAlamatKantin(e.target.value)}
                  required
                  minLength={5}
                  maxLength={255}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">
                    Nomor Kartu Minimal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={nomorKartuMin}
                    onChange={(e) => setNomorKartuMin(parseInt(e.target.value, 10) || 1)}
                    required
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#374151] mb-1">
                    Nomor Kartu Maksimal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={nomorKartuMax}
                    onChange={(e) => setNomorKartuMax(parseInt(e.target.value, 10) || 99)}
                    required
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-2">
                  Metode Pembayaran Aktif di Kasir
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_PAYMENT_METHODS.map((item) => {
                    const checked = metodeBayarAktif.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                          checked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                            : 'bg-white border-[#D1D5DB] text-[#4B5563]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMetodeBayar(item.id)}
                          className="accent-emerald-600"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1">
                  Teks Footer Struk Belanja
                </label>
                <textarea
                  rows={2}
                  value={teksFooterStruk}
                  onChange={(e) => setTeksFooterStruk(e.target.value)}
                  maxLength={255}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-[#E5E7EB]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors disabled:opacity-60 shadow-xs"
                >
                  {isSaving && <LoadingSpinner size="xs" variant="white" />}
                  {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
              </div>
            </form>
          </main>
        </MotionFadeIn>
      )}
    </RoleGuard>
  );
}

export default AdminSettingsScreen;
