'use client';

import React from 'react';
import { StallNavbar } from '@/components/StallNavbar';
import { useStallQueue } from './useStallQueue';
import { StallQueueColumn } from './components/StallQueueColumn';

export function StallQueueScreen() {
  const {
    daftarGerai,
    geraiAktif,
    isLoading,
    isRefreshing,
    menungguBayar,
    siapDibuat,
    selesai,
    actionMessage,
    handlePilihGerai,
    handleSelesaikanPesanan,
    refresh,
  } = useStallQueue();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat antrean gerai...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <StallNavbar
        geraiAktif={geraiAktif}
        daftarGerai={daftarGerai}
        onPilihGerai={handlePilihGerai}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Sub Header & Refresh Action */}
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
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D1D5DB] bg-white text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-50 transition-colors"
            >
              {isRefreshing ? 'Memperbarui...' : 'Segarkan Data'}
            </button>
          </div>
        </div>

        {/* Action Message Feedback */}
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

        {/* 3-Column Kitchen Queue Board */}
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
          />

          <StallQueueColumn
            title="Selesai"
            count={selesai.length}
            orders={selesai}
            type="done"
          />
        </div>
      </main>
    </div>
  );
}

export default StallQueueScreen;
