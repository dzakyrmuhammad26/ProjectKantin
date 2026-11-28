import React from 'react';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { Order, CartItem } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { StatusLabel } from '@/components/StatusLabel';
import { formatCurrency } from '@/utils/formatters';
import { isPending, isReady, isCompleted } from '../useCashier';

interface CashierOrderDetailProps {
  selectedOrder: Order;
  selectedOrderItemsByStall: Record<string, CartItem[]>;
  stallMap: Map<string, Stall>;
  actionMessage: { type: 'success' | 'error'; text: string } | null;
  updatingMenuId?: string | null;
  onOpenReceipt: (order: Order) => void;
  onUpdateItemQty: (menuItemId: string, newQty: number) => void;
}

export function CashierOrderDetail({
  selectedOrder,
  selectedOrderItemsByStall,
  stallMap,
  actionMessage,
  updatingMenuId = null,
  onOpenReceipt,
  onUpdateItemQty,
}: CashierOrderDetailProps) {
  const pending = isPending(selectedOrder.status);

  return (
    <div className="space-y-6">
      {/* Header Selected Order */}
      <div className="flex items-start justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[22px] font-bold text-ink">
              Kartu No. {selectedOrder.cardNumber}
            </h2>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[12px] font-mono text-muted">
              {selectedOrder.id}
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Waktu Pemesanan: {selectedOrder.createdAt}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tombol Pratinjau / Cetak Struk */}
          <button
            type="button"
            onClick={() => onOpenReceipt(selectedOrder)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Pratinjau Struk
          </button>

          <StatusLabel
            status={
              pending
                ? 'wait'
                : isReady(selectedOrder.status)
                ? 'paid'
                : isCompleted(selectedOrder.status)
                ? 'done'
                : 'cancel'
            }
            label={
              pending
                ? 'Menunggu Bayar'
                : isReady(selectedOrder.status)
                ? 'Siap Dibuat'
                : isCompleted(selectedOrder.status)
                ? 'Selesai'
                : 'Batal'
            }
          />
        </div>
      </div>

      {/* Notifikasi Aksi */}
      {actionMessage && (
        <div
          className={`rounded-lg p-3.5 text-[13px] font-medium ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Rincian Pesanan per Gerai */}
      <div className="rounded-xl border border-line bg-slate-50/70 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
            Rincian Pesanan per Gerai
          </span>
          {pending && (
            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
              Kasir dapat koreksi item sebelum dibayar
            </span>
          )}
        </div>

        {Object.entries(selectedOrderItemsByStall).map(([stallId, stallItems]) => {
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
              className="rounded-lg border border-line bg-white overflow-hidden shadow-2xs"
            >
              {/* Header Gerai */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/70 border-b border-line">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-1.5 rounded-full inline-block"
                    style={{ backgroundColor: stallColor }}
                  />
                  <span className="text-[13px] font-bold text-ink">
                    {stallName} ({stall?.code || stallId})
                  </span>
                </div>
                <span className="text-[12px] font-mono font-semibold text-ink">
                  {formatCurrency(stallSubtotal)}
                </span>
              </div>

              {/* List Items Gerai ini */}
              <div className="divide-y divide-line">
                {stallItems.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="p-3 flex items-center justify-between gap-3 text-[13px]"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-ink block truncate">
                        {item.menuItem.name}
                      </span>
                      {item.notes && (
                        <span className="text-[11px] text-muted italic block">
                          Catatan: {item.notes}
                        </span>
                      )}
                    </div>

                    {/* Kontrol Koreksi Qty Kasir */}
                    {pending ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {updatingMenuId === item.menuItem.id ? (
                          <div className="flex h-6 w-[68px] items-center justify-center rounded border border-line bg-slate-50">
                            <LoadingSpinner size="xs" variant="brand" />
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={updatingMenuId !== null}
                              onClick={() => onUpdateItemQty(item.menuItem.id, item.qty - 1)}
                              title="Kurangi / Hapus"
                              className="flex h-6 w-6 items-center justify-center rounded border border-line bg-white text-[13px] font-bold text-ink hover:bg-slate-100 disabled:opacity-50"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-ink">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              disabled={updatingMenuId !== null}
                              onClick={() => onUpdateItemQty(item.menuItem.id, item.qty + 1)}
                              title="Tambah"
                              className="flex h-6 w-6 items-center justify-center rounded bg-brand-700 text-[13px] font-bold text-white hover:bg-brand-800 disabled:opacity-50"
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-[13px] font-bold text-ink">
                        {item.qty}x
                      </span>
                    )}

                    <span className="w-24 text-right font-mono font-bold text-ink tabular-nums">
                      {formatCurrency(item.menuItem.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Total Tagihan */}
        <div className="flex items-baseline justify-between pt-2 border-t border-line">
          <span className="text-[13px] font-bold uppercase tracking-wider text-muted">
            Total Tagihan
          </span>
          <span className="font-mono text-[22px] font-black text-ink">
            {formatCurrency(selectedOrder.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
