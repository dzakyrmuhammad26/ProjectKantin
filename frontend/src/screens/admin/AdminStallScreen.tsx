'use client';

import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { useAdminStall } from './useAdminStall';
import { AdminStallModal } from './components/AdminStallModal';

export function AdminStallScreen() {
  const {
    geraiList,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editingGerai,
    kode,
    setKode,
    nama,
    setNama,
    penyewa,
    setPenyewa,
    warna,
    setWarna,
    feedback,
    handleBukaTambah,
    handleBukaEdit,
    handleSimpan,
  } = useAdminStall();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat daftar stan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              Manajemen Stan &amp; Gerai Kantin
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Kelola daftar tenant, identitas gerai, dan kode warna tanpa model sewa
            </p>
          </div>

          <button
            onClick={handleBukaTambah}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            + Tambah Stan Baru
          </button>
        </div>

        {feedback && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs sm:text-sm font-medium">
            {feedback}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {geraiList.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-white shadow-xs"
                    style={{ backgroundColor: g.warna || g.color || '#10B981' }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">
                      {g.nama || g.name}
                    </h3>
                    <span className="text-xs font-mono font-medium text-[#6B7280]">
                      Kode: {g.kode || g.code}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Aktif
                </span>
              </div>

              <div className="border-t border-[#F3F4F6] pt-2 flex flex-col gap-1 text-xs text-[#4B5563]">
                <p>
                  <span className="text-[#9CA3AF]">Penyewa:</span>{' '}
                  <span className="font-semibold text-[#111827]">{g.penyewa}</span>
                </p>
                <p>
                  <span className="text-[#9CA3AF]">Warna Aksen:</span>{' '}
                  <span className="font-mono">{g.warna || g.color}</span>
                </p>
              </div>

              <div className="border-t border-[#F3F4F6] pt-2 flex justify-end">
                <button
                  onClick={() => handleBukaEdit(g)}
                  className="px-3 py-1 rounded text-xs font-medium bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] transition-colors"
                >
                  Edit Stan
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Tambah / Edit Gerai */}
      <AdminStallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSimpan}
        editingGerai={editingGerai}
        kode={kode}
        onKodeChange={setKode}
        nama={nama}
        onNamaChange={setNama}
        penyewa={penyewa}
        onPenyewaChange={setPenyewa}
        warna={warna}
        onWarnaChange={setWarna}
      />
    </div>
  );
}

export default AdminStallScreen;
