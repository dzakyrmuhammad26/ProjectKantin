'use client';

import { useState } from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { PengaturanKantin } from '@/models/pengaturan';

interface CashierHeaderProps {
  shiftSummary: {
    totalRevenue: number;
    pendingCount: number;
    paidCount: number;
  };
  pengaturan?: PengaturanKantin;
}

export function CashierHeader({ shiftSummary, pengaturan }: CashierHeaderProps) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/auth');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white font-bold text-lg hover:bg-brand-800 transition-colors"
            title="Beranda"
          >
            K
          </Link>
          <div>
            <h1 className="text-[16px] sm:text-[17px] font-bold text-ink leading-tight">
              Kasir Sentral — {pengaturan?.namaKantin || 'Kantin Sentral'}
            </h1>
            <p className="text-[12px] text-muted">
              {currentUser ? `Kasir Aktif: ${currentUser.nama}` : 'Manajemen Pembayaran & Antrean Multi-Gerai'}
            </p>
          </div>
        </div>

        {/* Quick Metrics & Actions */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 border-r border-line pr-4">
            <span className="text-[12px] font-medium text-muted">Omzet Hari Ini:</span>
            <span className="font-mono text-[15px] sm:text-[16px] font-bold text-brand-700">
              {formatCurrency(shiftSummary.totalRevenue)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2.5 text-[13px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700 border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {shiftSummary.pendingCount} Menunggu Bayar
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 border border-emerald-200">
              {shiftSummary.paidCount} Siap Dibuat
            </span>
          </div>

          <Link
            href="/customer"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100 transition-colors"
          >
            Layar Pelanggan
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-60"
          >
            {isLoggingOut && <LoadingSpinner size="xs" variant="danger" />}
            {isLoggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </div>
    </header>
  );
}
