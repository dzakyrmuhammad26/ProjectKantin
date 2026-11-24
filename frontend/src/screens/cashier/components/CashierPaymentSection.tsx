import React from 'react';
import { Order } from '@/models/pesanan';
import { PaymentMethod } from '@/models/pembayaran';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { isPending, isReady, isCompleted, isCancelled } from '../useCashier';

interface CashierPaymentSectionProps {
  selectedOrder: Order;
  paymentMethod: PaymentMethod;
  cashGiven: number;
  changeAmount: number;
  isCashDeficit: boolean;
  isProcessing: boolean;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onChangeCashGiven: (amount: number) => void;
  onConfirmPayment: () => void;
  onCancelOrder: () => void;
  onMarkCompleted: () => void;
  onOpenReceipt: (order: Order) => void;
}

export function CashierPaymentSection({
  selectedOrder,
  paymentMethod,
  cashGiven,
  changeAmount,
  isCashDeficit,
  isProcessing,
  onSelectPaymentMethod,
  onChangeCashGiven,
  onConfirmPayment,
  onCancelOrder,
  onMarkCompleted,
  onOpenReceipt,
}: CashierPaymentSectionProps) {
  // STATE 1: MENUNGGU BAYAR
  if (isPending(selectedOrder.status)) {
    return (
      <div className="rounded-xl border border-line bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-[15px] font-bold text-ink">
          Proses Pembayaran Kasir
        </h3>

        {/* Pilih Metode Pembayaran */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onSelectPaymentMethod('cash');
              onChangeCashGiven(selectedOrder.total);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[14px] font-bold transition-all ${
              paymentMethod === 'cash'
                ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-xs'
                : 'border-line bg-white text-muted hover:border-slate-300'
            }`}
          >
            Uang Tunai (Cash)
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectPaymentMethod('qris');
              onChangeCashGiven(selectedOrder.total);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[14px] font-bold transition-all ${
              paymentMethod === 'qris'
                ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-xs'
                : 'border-line bg-white text-muted hover:border-slate-300'
            }`}
          >
            QRIS / Non-Tunai
          </button>
        </div>

        {/* Pembayaran Tunai */}
        {paymentMethod === 'cash' && (
          <div className="space-y-3 pt-2">
            {/* Tombol Pecahan Cepat */}
            <div>
              <span className="text-[12px] font-semibold text-muted block mb-1.5">
                Pecahan Uang Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onChangeCashGiven(selectedOrder.total)}
                  className="rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100"
                >
                  Uang Pas ({formatCurrency(selectedOrder.total)})
                </button>
                {[50000, 100000, 200000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => onChangeCashGiven(nominal)}
                    className="rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100"
                  >
                    {formatCurrency(nominal)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Uang Diterima */}
            <div className="pt-1">
              <label className="text-[12px] font-semibold text-ink block mb-1">
                Uang Diterima dari Pelanggan (Rp):
              </label>
              <input
                type="number"
                value={cashGiven || ''}
                onChange={(e) => onChangeCashGiven(Number(e.target.value) || 0)}
                className="w-full h-11 px-3 rounded-lg border border-line text-[16px] font-mono font-bold text-ink focus:border-brand-700 outline-none"
                placeholder="0"
              />
            </div>

            {/* Status Kembalian */}
            <div
              className={`rounded-lg p-3 text-center border ${
                isCashDeficit
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span className="text-[12px] font-semibold uppercase block">
                {isCashDeficit ? 'Uang Masih Kurang' : 'Kembalian'}
              </span>
              <span className="font-mono text-[22px] font-black">
                {isCashDeficit
                  ? formatCurrency(selectedOrder.total - cashGiven)
                  : formatCurrency(changeAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Pembayaran QRIS */}
        {paymentMethod === 'qris' && (
          <div className="rounded-lg border border-line bg-slate-50 p-4 text-center space-y-2">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-white border border-line shadow-inner font-mono text-[11px] text-muted">
              [ QRIS SIMULATOR ]
            </div>
            <p className="text-[13px] font-semibold text-ink">
              Minta pelanggan scan QRIS sebesar {formatCurrency(selectedOrder.total)}
            </p>
            <p className="text-[12px] text-muted">
              Konfirmasi setelah notifikasi bayar berhasil diterima.
            </p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onCancelOrder}
            disabled={isProcessing}
            className="w-1/3 text-red-600 border-red-200 hover:bg-red-50"
          >
            Batalkan
          </Button>
          <Button
            variant="primary"
            onClick={onConfirmPayment}
            disabled={isCashDeficit || isProcessing}
            className="w-2/3"
          >
            {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran & Cetak'}
          </Button>
        </div>
      </div>
    );
  }

  // STATE 2: SUDAH DIBAYAR (SIAP DIBUAT)
  if (isReady(selectedOrder.status)) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800">
            <span className="text-xl">✓</span>
            <h3 className="text-[15px] font-bold">
              Pembayaran Lunas ({selectedOrder.payment?.method.toUpperCase()})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenReceipt(selectedOrder)}
            className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-[12px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
          >
            Cetak Ulang Struk
          </button>
        </div>
        <p className="text-[13px] text-emerald-700">
          Pesanan telah dibayar pada {selectedOrder.payment?.paidAt || '-'}. Masing-masing gerai telah menerima tiket pesanan untuk mulai memasak.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={onMarkCompleted}
            disabled={isProcessing}
          >
            {isProcessing ? 'Menyimpan...' : 'Tandai Pesanan Selesai Diambil Pelanggan'}
          </Button>
        </div>
      </div>
    );
  }

  // STATE 3: SELESAI
  if (isCompleted(selectedOrder.status)) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-ink">
            Pesanan ini telah selesai dan diserahkan ke pelanggan.
          </p>
          <p className="text-[12px] text-muted mt-0.5">
            Metode: {selectedOrder.payment?.method.toUpperCase()} • {selectedOrder.payment?.paidAt}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenReceipt(selectedOrder)}
          className="rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-slate-100 transition-colors shadow-2xs"
        >
          Cetak Ulang
        </button>
      </div>
    );
  }

  // STATE 4: DIBATALKAN
  if (isCancelled(selectedOrder.status)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
        <p className="text-[14px] font-semibold">
          Pesanan ini telah dibatalkan oleh kasir.
        </p>
      </div>
    );
  }

  return null;
}
