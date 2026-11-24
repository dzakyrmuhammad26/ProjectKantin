'use client';

import React from 'react';
import { CartItem } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { formatCurrency } from '@/utils/formatters';

export interface OrderSummaryViewProps {
  itemsByStall: Record<string, CartItem[]>;
  stallMap: Map<string, Stall>;
  totalAmount: number;
  totalCount?: number;
  title?: string;
}

export function OrderSummaryView({
  itemsByStall,
  stallMap,
  totalAmount,
  totalCount,
  title = 'Rincian Pesanan per Gerai',
}: OrderSummaryViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[12px] font-bold uppercase tracking-wider text-muted block">
        {title}
      </span>

      {Object.entries(itemsByStall).map(([stallId, stallItems]) => {
        const stall = stallMap.get(stallId);
        const stallColor = stall?.color || '#0F766E';
        const stallName = stall?.name || stallId;
        const stallSubtotal = stallItems.reduce(
          (sum, item) => sum + item.menuItem.price * item.qty,
          0
        );

        return (
          <div
            key={stallId}
            className="border border-line rounded-lg overflow-hidden bg-white"
          >
            {/* Stall Header */}
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
                  ({stall?.code || stallId})
                </span>
              </div>
              <span className="text-[13px] font-semibold text-ink font-mono tabular-nums">
                {formatCurrency(stallSubtotal)}
              </span>
            </div>

            {/* Menu Items in this Stall */}
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
                    {formatCurrency(cartItem.menuItem.price * cartItem.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Grand Total */}
      <div className="border-t border-line pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted block">
            Total Tagihan
          </span>
          {typeof totalCount === 'number' && (
            <span className="text-[12px] text-muted">
              Termasuk {totalCount} pesanan dari {Object.keys(itemsByStall).length} gerai
            </span>
          )}
        </div>
        <span className="text-[20px] font-extrabold text-ink font-mono tabular-nums">
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
}

export default OrderSummaryView;
