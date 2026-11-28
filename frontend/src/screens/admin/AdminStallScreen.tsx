'use client';

import { CardGridSkeleton } from '@/components/loading/LoadingSkeletons';
import { MotionFadeIn } from '@/components/loading/MotionFadeIn';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

import React from 'react';
import { AdminNavbar } from '@/components/AdminNavbar';
import { RoleGuard } from '@/components/RoleGuard';
import { useAdminStall } from './useAdminStall';
import { AdminStallModal } from './components/AdminStallModal';

export function AdminStallScreen() {
  const {
    geraiList,
    isLoading,
    isSubmitting,
    busyStallId,
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
    handleToggleAktif,
    handleHapusGerai,
  } = useAdminStall();

  return (
    <RoleGuard allowedRoles={['superadmin']} areaLabel="Manajemen Stan">
      {isLoading ? (
        <div className="min-h-screen bg-[#F8F9FA]">
          <div className="h-[64px] bg-[#111827]" />
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <CardGridSkeleton count={6} />
          </div>
        </div>
      ) : (
        <MotionFadeIn className="min-h-screen bg-[#F8F9FA] flex flex-col">
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
              {geraiList.map((g) => {
                const isBusy = busyStallId === g.id;
                return (
                  <div
                    key={g.id}
                    className={`bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col justify-between gap-3 shadow-xs ${
                      !g.aktif ? 'opacity-70 bg-gray-50' : ''
                    }`}
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          g.aktif
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {g.aktif ? 'Aktif' : 'Nonaktif'}
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

                    <div className="border-t border-[#F3F4F6] pt-2 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleToggleAktif(g)}
                        disabled={busyStallId !== null}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-60 ${
                          g.aktif
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isBusy && <LoadingSpinner size="xs" variant={g.aktif ? 'amber' : 'brand'} />}
                        {g.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleBukaEdit(g)}
                          disabled={busyStallId !== null}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] transition-colors disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleHapusGerai(g)}
                          disabled={busyStallId !== null}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors disabled:opacity-60"
                        >
                          {isBusy && <LoadingSpinner size="xs" variant="danger" />}
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

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
            isSubmitting={isSubmitting}
          />
        </MotionFadeIn>
      )}
    </RoleGuard>
  );
}

export default AdminStallScreen;
