import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatters';

interface CashierHeaderProps {
  shiftSummary: {
    totalRevenue: number;
    pendingCount: number;
    paidCount: number;
  };
}

export function CashierHeader({ shiftSummary }: CashierHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white font-bold text-lg">
            K
          </span>
          <div>
            <h1 className="text-[17px] font-bold text-ink leading-tight">
              Kasir Sentral — Kantin Darren
            </h1>
            <p className="text-[12px] text-muted">
              Manajemen Pembayaran &amp; Antrean Pesanan Multi-Gerai
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-line pr-5">
            <span className="text-[12px] font-medium text-muted">Omzet Hari Ini:</span>
            <span className="font-mono text-[16px] font-bold text-brand-700">
              {formatCurrency(shiftSummary.totalRevenue)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[13px]">
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
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Buka Layar Pelanggan
          </Link>
        </div>
      </div>
    </header>
  );
}
