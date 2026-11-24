'use client';

import React, { useState } from 'react';
import { CartItem } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { formatCurrency } from '@/utils/formatters';
import { Button } from './Button';
import { CustomerNumberInput } from './CustomerNumberInput';

export interface CartViewProps {
  cardNumber: string;
  onCardNumberChange?: (val: string) => void;
  cardError?: string | null;
  items: CartItem[];
  itemsByStall: Record<string, CartItem[]>;
  stallMap: Map<string, Stall>;
  totalCount: number;
  totalAmount: number;
  onCheckout: () => void;
  onClearCart: () => void;
  onIncrement: (menuItem: CartItem['menuItem']) => void;
  onDecrement: (menuItemId: string) => void;
  onUpdateNotes: (menuItemId: string, notes: string) => void;
  isDrawer?: boolean;
  onClose?: () => void;
}

export function CartView({
  cardNumber,
  onCardNumberChange,
  cardError,
  items,
  itemsByStall,
  stallMap,
  totalCount,
  totalAmount,
  onCheckout,
  onClearCart,
  onIncrement,
  onDecrement,
  onUpdateNotes,
  isDrawer = false,
  onClose,
}: CartViewProps) {
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);

  const containerClass = isDrawer
    ? 'w-full flex flex-col h-full bg-white rounded-t-[20px] max-h-[85vh] sm:max-h-[80vh] overflow-hidden'
    : 'sticky top-[80px] w-full';

  const cardClass = isDrawer
    ? 'p-4 sm:p-5 flex flex-col h-full'
    : 'rounded-[12px] border border-line bg-white p-5 shadow-none';

  return (
    <aside className={containerClass}>
      <div className={cardClass}>
        {/* Cart Header */}
        <div className="border-b border-line pb-3.5 sm:pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-ink">Keranjang Pesanan</h3>
              {totalCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] sm:text-[12px] font-semibold text-brand-700">
                  {totalCount} item
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Clear Cart Button */}
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  title="Kosongkan keranjang"
                  aria-label="Clear cart"
                  className="text-faint transition-colors hover:text-status-cancel p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}

              {/* Close Button for Mobile Drawer */}
              {isDrawer && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-slate-100 transition-colors"
                  aria-label="Tutup keranjang"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sub-header */}
          <p className="mt-1 text-[12px] sm:text-[13px] text-muted">
            {cardNumber ? `Tagihan Pelanggan No. ${cardNumber}` : 'Pilih menu & isi nomor pelanggan'}
          </p>
        </div>

        {/* Cart Items or Empty State */}
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[14px] text-faint">Belum ada pesanan</p>
          </div>
        ) : (
          <div
            className={`divide-y divide-line overflow-y-auto py-2.5 sm:py-3 ${
              isDrawer ? 'flex-1 max-h-[42vh] sm:max-h-[50vh]' : 'max-h-[calc(100vh-340px)]'
            }`}
          >
            {Object.entries(itemsByStall).map(([stallId, stallItems]) => {
              const stallInfo = stallMap.get(stallId);
              const stallColor = stallInfo?.color || stallInfo?.warna || '#0F766E';
              const stallName = stallInfo?.name || stallInfo?.nama || stallId;

              return (
                <div key={stallId} className="py-2.5 first:pt-1 last:pb-1">
                  {/* Stall Header in Cart */}
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-3.5 w-1.5 rounded-full"
                      style={{ backgroundColor: stallColor }}
                    />
                    <span className="text-[12px] font-bold text-ink">
                      {stallName}
                    </span>
                  </div>

                  {/* Menu Items in this Stall */}
                  <div className="space-y-2.5 pl-3.5">
                    {stallItems.map((cartItem) => {
                      const isEditingNote = activeNoteItemId === cartItem.menuItem.id;
                      const itemPrice = cartItem.menuItem.harga || cartItem.menuItem.price || 0;
                      const itemName = cartItem.menuItem.nama || cartItem.menuItem.name;

                      return (
                        <div key={cartItem.menuItem.id} className="text-[13px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-ink block truncate">
                                {itemName}
                              </span>
                            </div>

                            {/* Qty Controls */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onDecrement(cartItem.menuItem.id)}
                                className="flex h-6 w-6 items-center justify-center rounded border border-line bg-white text-[14px] font-bold text-ink hover:bg-slate-50 active:bg-slate-100"
                              >
                                −
                              </button>
                              <span className="w-5 text-center font-mono font-semibold text-ink">
                                {cartItem.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onIncrement(cartItem.menuItem)}
                                className="flex h-6 w-6 items-center justify-center rounded bg-brand-700 text-[14px] font-bold text-white hover:bg-brand-800 active:bg-brand-900"
                              >
                                +
                              </button>
                            </div>

                            {/* Item Subtotal */}
                            <span className="w-20 text-right font-mono font-semibold text-ink tabular-nums text-[12px] sm:text-[13px]">
                              {formatCurrency(itemPrice * cartItem.qty)}
                            </span>
                          </div>

                          {/* Notes Input */}
                          <div className="mt-1">
                            {isEditingNote ? (
                              <div className="flex gap-1.5 pt-1">
                                <input
                                  type="text"
                                  defaultValue={cartItem.notes || cartItem.catatan || ''}
                                  placeholder="Catatan (cth: jangan pedas)"
                                  className="h-7 w-full rounded border border-line px-2 text-[12px] text-ink outline-none focus:border-brand-700"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      onUpdateNotes(cartItem.menuItem.id, e.currentTarget.value);
                                      setActiveNoteItemId(null);
                                    }
                                  }}
                                  onBlur={(e) => {
                                    onUpdateNotes(cartItem.menuItem.id, e.currentTarget.value);
                                    setActiveNoteItemId(null);
                                  }}
                                  autoFocus
                                />
                              </div>
                            ) : (cartItem.notes || cartItem.catatan) ? (
                              <button
                                type="button"
                                onClick={() => setActiveNoteItemId(cartItem.menuItem.id)}
                                className="text-left text-[11px] text-muted italic hover:text-brand-700"
                              >
                                Catatan: {cartItem.notes || cartItem.catatan} (ubah)
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveNoteItemId(cartItem.menuItem.id)}
                                className="text-[11px] text-muted hover:text-brand-700"
                              >
                                + Tambah catatan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cost Summary, Customer Number Input, & Total */}
        <div className="mt-auto border-t border-line pt-3 space-y-3 shrink-0">
          <div className="flex items-baseline justify-between py-1">
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-muted">
              Total Tagihan
            </span>
            <span className="font-mono text-[18px] sm:text-[20px] font-extrabold text-ink tabular-nums">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Customer Number Input */}
          <div className="rounded-[8px] bg-slate-50 p-2.5 sm:p-3 border border-line">
            <CustomerNumberInput
              value={cardNumber}
              onChange={(val) => onCardNumberChange?.(val)}
              error={cardError}
            />
          </div>

          {/* Checkout Button */}
          <div className="pt-1">
            <Button
              variant="primary"
              size="default"
              fullWidth
              disabled={items.length === 0}
              onClick={onCheckout}
            >
              Konfirmasi &amp; Pesan
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CartView;
