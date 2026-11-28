'use client';

import { RefreshCw } from 'lucide-react';
import { StallQueueSkeleton } from '@/components/loading/LoadingSkeletons';
import { MotionFadeIn } from '@/components/loading/MotionFadeIn';

import React from 'react';
import { StallNavbar } from '@/components/StallNavbar';
import { RoleGuard } from '@/components/RoleGuard';
import { useStallQueue } from './useStallQueue';
import { StallQueueColumn } from './components/StallQueueColumn';

export function StallQueueScreen() {
  const {
    daftarGerai,
    geraiAktif,
    isLoading,
    isRefreshing,
    completingOrderId,
    menungguBayar,
    siapDibuat,
    selesai,
    actionMessage,
    handlePilihGerai,
    handleSelesaikanPesanan,
    refresh,
  } = useStallQueue();

  return (
    <RoleGuard allowedRoles={['superadmin', 'gerai']} areaLabel="Antrean Dapur Gerai">
      {isLoading ? (
        <div className="min-h-screen bg-[#F8F9FA]">
          <div className="h-[64px] bg-white border-b border-[#E5E7EB]" />
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <StallQueueSkeleton />
          </div>
        </div>
      ) : (
        <MotionFadeIn className="min-h-screen bg-[#F8F9FA] flex flex-col">
          <StallNavbar
            geraiAktif={geraiAktif}
            daftarGerai={daftarGerai}
            onPilihGerai={handlePilihGerai}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Antrean Dapur Stan
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280]">
                  Kelola proses memasak pesanan stan secara realtime
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-60 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                  {isRefreshing ? 'Memperbarui...' : 'Segarkan Data'}
                </button>
              </div>
            </div>

            {actionMessage && (
              <div
                className={`p-3 rounded-lg text-xs sm:text-sm font-medium border ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {actionMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
              <StallQueueColumn
                title="Menunggu Bayar"
                count={menungguBayar.length}
                orders={menungguBayar}
                type="waiting"
              />

              <StallQueueColumn
                title="Siap Dibuat"
                count={siapDibuat.length}
                orders={siapDibuat}
                type="ready"
                onComplete={handleSelesaikanPesanan}
                completingOrderId={completingOrderId}
              />

              <StallQueueColumn
                title="Selesai"
                count={selesai.length}
                orders={selesai}
                type="done"
              />
            </div>
          </main>
        </MotionFadeIn>
      )}
    </RoleGuard>
  );
}

export default StallQueueScreen;
