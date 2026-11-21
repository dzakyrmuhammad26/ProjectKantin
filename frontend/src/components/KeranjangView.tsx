'use client';

import React, { useState } from 'react';
import { CartItem, Gerai } from '@/models/types';
import { formatRupiah } from '@/utils';
import { Button } from './Button';
import { NomorPelangganInput } from './NomorPelangganInput';

export interface KeranjangViewProps {
  cardNumber: string;
  onCardNumberChange?: (val: string) => void;
  cardError?: string | null;
  items: CartItem[];
  itemsByGerai: Record<string, CartItem[]>;
  geraiMap: Map<string, Gerai>;
  totalCount: number;
  totalAmount: number;
  onCheckout: () => void;
  onClearCart: () => void;
  onIncrement: (menuItem: CartItem['menuItem']) => void;
  onDecrement: (menuItemId: string) => void;
  onUpdateNotes: (menuItemId: string, notes: string) => void;
}

export function KeranjangView({
  cardNumber,
  onCardNumberChange,
  cardError,
  items,
  itemsByGerai,
  geraiMap,
  totalCount,
  totalAmount,
  onCheckout,
  onClearCart,
  onIncrement,
  onDecrement,
  onUpdateNotes,
}: KeranjangViewProps) {
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);

  return (
    <aside className="sticky top-[80px] w-full">
      <div className="rounded-[12px] border border-line bg-white p-5 shadow-none">
        {/* Header Keranjang */}
        <div className="border-b border-line pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-ink">Keranjang Pesanan</h3>
              {totalCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[12px] font-semibold text-brand-700">
                  {totalCount} item
                </span>
              )}
            </div>

            {/* Tombol Kosongkan Keranjang: Ikon tempat sampah fungsional */}
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                title="Kosongkan keranjang"
                aria-label="Kosongkan keranjang"
                className="text-faint transition-colors hover:text-status-cancel"
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
          </div>

          {/* Sub-header */}
          <p className="mt-1 text-[13px] text-muted">
            {cardNumber ? `Tagihan Pelanggan No. ${cardNumber}` : 'Pilih menu & isi nomor pelanggan'}
          </p>
        </div>

        {/* Isi Keranjang atau State Kosong */}
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[14px] text-faint">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-340px)] divide-y divide-line overflow-y-auto py-3">
            {Object.entries(itemsByGerai).map(([geraiId, stallItems]) => {
              const geraiInfo = geraiMap.get(geraiId);
              const stallColor = geraiInfo?.color || '#0F766E';
              const stallName = geraiInfo?.name || geraiId;

              return (
                <div key={geraiId} className="py-3 first:pt-1 last:pb-1">
                  {/* Header Gerai dalam Keranjang: Batang warna 6px */}
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-3.5 w-1.5 rounded-full"
                      style={{ backgroundColor: stallColor }}
                    />
                    <span className="text-[12px] font-bold text-ink">
                      {stallName}
                    </span>
                  </div>

                  {/* Daftar Item Menu di Gerai ini */}
                  <div className="space-y-2.5 pl-3.5">
                    {stallItems.map((cartItem) => {
                      const isEditingNote = activeNoteItemId === cartItem.menuItem.id;

                      return (
                        <div key={cartItem.menuItem.id} className="text-[13px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-ink block truncate">
                                {cartItem.menuItem.name}
                              </span>
                            </div>

                            {/* Kontrol Qty Kecil di Keranjang */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onDecrement(cartItem.menuItem.id)}
                                className="flex h-6 w-6 items-center justify-center rounded border border-line bg-white text-[14px] font-bold text-ink hover:bg-slate-50"
                              >
                                −
                              </button>
                              <span className="w-5 text-center font-mono font-semibold text-ink">
                                {cartItem.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => onIncrement(cartItem.menuItem)}
                                className="flex h-6 w-6 items-center justify-center rounded bg-brand-700 text-[14px] font-bold text-white hover:bg-brand-800"
                              >
                                +
                              </button>
                            </div>

                            {/* Subtotal Item */}
                            <span className="w-20 text-right font-mono font-semibold text-ink tabular-nums">
                              {formatRupiah(cartItem.menuItem.price * cartItem.qty)}
                            </span>
                          </div>

                          {/* Tombol & Input Catatan */}
                          <div className="mt-1">
                            {isEditingNote ? (
                              <div className="flex gap-1.5 pt-1">
                                <input
                                  type="text"
                                  defaultValue={cartItem.notes || ''}
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
                            ) : cartItem.notes ? (
                              <button
                                type="button"
                                onClick={() => setActiveNoteItemId(cartItem.menuItem.id)}
                                className="text-left text-[11px] text-muted italic hover:text-brand-700"
                              >
                                Catatan: {cartItem.notes} (ubah)
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

        {/* Ringkasan Biaya, Input Nomor Pelanggan, & Total */}
        <div className="mt-3 border-t border-line pt-3 space-y-3">
          <div className="flex items-baseline justify-between py-1">
            <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
              Total Tagihan
            </span>
            <span className="font-mono text-[20px] font-extrabold text-ink tabular-nums">
              {formatRupiah(totalAmount)}
            </span>
          </div>

          {/* Controlled Component: Input Nomor Pelanggan */}
          <div className="rounded-[8px] bg-slate-50 p-3 border border-line">
            <NomorPelangganInput
              value={cardNumber}
              onChange={(val) => onCardNumberChange?.(val)}
              error={cardError}
            />
          </div>

          {/* Tombol Checkout Utama */}
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

export default KeranjangView;
