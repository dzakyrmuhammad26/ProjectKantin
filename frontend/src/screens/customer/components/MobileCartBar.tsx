import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface MobileCartBarProps {
  totalCount: number;
  totalAmount: number;
  cardNumber?: string;
  onOpenDrawer: () => void;
}

export function MobileCartBar({
  totalCount,
  totalAmount,
  cardNumber,
  onOpenDrawer,
}: MobileCartBarProps) {
  if (totalCount <= 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-3 lg:hidden">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Total:
            </span>
            <span className="text-[17px] sm:text-[18px] font-extrabold text-ink font-mono tabular-nums">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <span className="text-[11px] text-muted">
            {totalCount} item {cardNumber ? `• Kartu No. ${cardNumber}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="h-11 px-4 sm:px-5 rounded-[8px] bg-brand-700 text-white font-semibold text-[13px] sm:text-[14px] flex items-center gap-2 hover:bg-brand-800 active:bg-brand-900 transition-colors shrink-0"
          >
            <span>Lihat Keranjang</span>
            <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] flex items-center justify-center font-bold">
              {totalCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
