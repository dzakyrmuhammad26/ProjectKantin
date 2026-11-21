'use client';

import React from 'react';
import { CartItem, Gerai } from '@/models/types';
import { formatRupiah } from '@/utils';

export interface RingkasanPesananViewProps {
  itemsByGerai: Record<string, CartItem[]>;
  geraiMap: Map<string, Gerai>;
  totalAmount: number;
  totalCount?: number;
  title?: string;
}

export function RingkasanPesananView({
  itemsByGerai,
  geraiMap,
  totalAmount,
  totalCount,
  title = 'Rincian Pesanan per Gerai',
}: RingkasanPesananViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider text-muted block">
        {title}
      </span>

      {Object.entries(itemsByGerai).map(([geraiId, stallItems]) => {
        const gerai = geraiMap.get(geraiId);
        const stallColor = gerai?.color || '#0F766E';
        const stallName = gerai?.name || geraiId;
        const stallSubtotal = stallItems.reduce(
          (sum, item) => sum + item.menuItem.price * item.qty,
          0
        );

        return (
          <div
            key={geraiId}
            className="border border-line rounded-lg overflow-hidden bg-white"
          >
            {/* Header Gerai: Batang vertikal warna gerai 6px + Nama Gerai + Subtotal */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-line">
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-4 rounded-full inline-block"
                  style={{ backgroundColor: stallColor }}
                />
                <span className="text-[14px] font-bold text-ink">
                  {stallName}
                </span>
                <span className="text-[12px] text-muted">
                  ({gerai?.code || geraiId})
                </span>
              </div>
              <span className="text-[13px] font-semibold text-ink font-mono tabular-nums">
                {formatRupiah(stallSubtotal)}
              </span>
            </div>

            {/* Daftar Menu di Gerai Ini */}
            <div className="divide-y divide-line">
              {stallItems.map((cartItem) => (
                <div
                  key={cartItem.menuItem.id}
                  className="px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="text-[12px] font-semibold text-brand-700 bg-brand-50 border border-brand-700/30 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      {cartItem.qty}x
                    </span>
                    <div className="min-w-0">
                      <span className="text-[14px] font-medium text-ink block leading-snug">
                        {cartItem.menuItem.name}
                      </span>
                      {cartItem.notes && (
                        <span className="text-[12px] text-muted italic block mt-0.5">
                          Catatan: {cartItem.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-ink font-mono tabular-nums shrink-0">
                    {formatRupiah(cartItem.menuItem.price * cartItem.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Total Keseluruhan */}
      <div className="border-t border-line pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted block">
            Total Tagihan
          </span>
          {typeof totalCount === 'number' && (
            <span className="text-[12px] text-muted">
              Termasuk {totalCount} pesanan dari {Object.keys(itemsByGerai).length} gerai
            </span>
          )}
        </div>
        <span className="text-[20px] font-extrabold text-ink font-mono tabular-nums">
          {formatRupiah(totalAmount)}
        </span>
      </div>
    </div>
  );
}

export default RingkasanPesananView;
