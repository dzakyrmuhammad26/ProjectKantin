'use client';

import React from 'react';
import { Order } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { PengaturanKantin } from '@/models/pengaturan';
import {
  formatCurrency,
  formatPaymentMethodLabel,
  isCashMethod,
} from '@/utils/formatters';
import { Button } from './Button';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  stallMap: Map<string, Stall>;
  pengaturan?: PengaturanKantin;
}

export function ReceiptModal({
  isOpen,
  onClose,
  order,
  stallMap,
  pengaturan,
}: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const itemsByStall: Record<string, typeof order.items> = {};
  for (const item of order.items) {
    const sId = item.menuItem.stallId || item.menuItem.idGerai;
    if (!itemsByStall[sId]) itemsByStall[sId] = [];
    itemsByStall[sId].push(item);
  }

  const payment = order.payment || order.pembayaran;
  const method = payment?.method || payment?.metode;
  const isCash = isCashMethod(method);
  const isPaid =
    order.status === 'siap_dibuat' ||
    order.status === 'ready_to_prepare' ||
    order.status === 'selesai' ||
    order.status === 'completed';

  const namaKantin = pengaturan?.namaKantin || 'Kantin Sentral Pujasera';
  const alamatKantin = pengaturan?.alamatKantin || 'POS Kasir Sentral Multi-Gerai';
  const teksFooter =
    pengaturan?.teksFooterStruk || 'Terima kasih atas kunjungan Anda di Kantin Sentral!';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-[480px] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-ink">
              Pratinjau Struk &amp; Tiket Dapur
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-slate-100 hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div
          id="printable-receipt"
          className="flex-1 overflow-y-auto p-6 font-mono text-[13px] text-black bg-[#FFFEFA]"
        >
          {/* Struk Pelanggan */}
          <div className="space-y-2 border-b-2 border-dashed border-slate-300 pb-5 text-center">
            <h2 className="text-[18px] font-black tracking-wider uppercase">
              {namaKantin}
            </h2>
            <p className="text-[11px] text-slate-600 uppercase">
              {alamatKantin}
            </p>
            <div className="mt-2 text-left text-[11px] space-y-0.5 border-t border-slate-200 pt-2">
              <div className="flex justify-between">
                <span>No. Transaksi :</span>
                <span className="font-bold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu         :</span>
                <span>{order.createdAt || order.waktuPesan}</span>
              </div>
              <div className="flex justify-between">
                <span>Nomor Kartu   :</span>
                <span className="text-[14px] font-black bg-black text-white px-1.5 py-0.5 rounded">
                  NO. {order.cardNumber || order.nomorKartu}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status        :</span>
                <span
                  className={`font-bold uppercase ${
                    isPaid ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {isPaid ? 'LUNAS' : 'MENUNGGU BAYAR'}
                </span>
              </div>
            </div>
          </div>

          {/* Rincian Menu Pelanggan */}
          <div className="py-4 space-y-2.5 border-b-2 border-dashed border-slate-300">
            <div className="flex justify-between text-[11px] font-bold border-b border-slate-200 pb-1">
              <span>MENU</span>
              <span>TOTAL</span>
            </div>

            {order.items.map((item, idx) => (
              <div key={`${item.menuItem.id}-${idx}`} className="text-[12px]">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <span className="font-bold">{item.qty}x</span>{' '}
                    <span>{item.menuItem.name || item.menuItem.nama}</span>
                  </div>
                  <span className="font-bold">
                    {formatCurrency((item.menuItem.price || item.menuItem.harga) * item.qty)}
                  </span>
                </div>
                {(item.notes || item.catatan) && (
                  <p className="text-[10px] text-slate-600 italic pl-5">
                    * Catatan: {item.notes || item.catatan}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Rincian Finansial */}
          <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-1 text-[12px]">
            <div className="flex justify-between font-bold text-[14px]">
              <span>TOTAL TAGIHAN</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            {payment && (
              <>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Metode Pembayaran</span>
                  <span className="uppercase font-bold text-black">
                    {formatPaymentMethodLabel(method)}
                  </span>
                </div>
                {payment.referensiQris && (
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Ref. QRIS</span>
                    <span className="font-bold text-black">{payment.referensiQris}</span>
                  </div>
                )}
                {isCash && (
                  <>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Uang Diterima</span>
                      <span>{formatCurrency(payment.amountPaid ?? payment.uangDiterima ?? 0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[13px] pt-1 border-t border-slate-200">
                      <span>KEMBALIAN</span>
                      <span>{formatCurrency(payment.change ?? payment.kembalian ?? 0)}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Ucapan Struk */}
          <div className="py-3 text-center text-[11px] text-slate-600">
            <p>{teksFooter}</p>
            <p className="mt-0.5">Silakan tunggu panggilan nomor kartu di gerai.</p>
          </div>

          {/* Tiket Dapur Per Gerai */}
          <div className="mt-4 pt-3 border-t-4 border-double border-slate-400">
            <div className="text-center text-[10px] text-slate-500 font-sans tracking-widest uppercase mb-4 py-1 bg-slate-100 rounded">
              POTONG / SERAHKAN KE GERAI TERKAIT
            </div>

            <div className="space-y-4">
              {Object.entries(itemsByStall).map(([stallId, stallItems]) => {
                const stall = stallMap.get(stallId);
                const stallName = stall?.name || stall?.nama || stallId;
                const stallCode = stall?.code || stall?.kode || stallId;

                return (
                  <div
                    key={stallId}
                    className="rounded border border-black p-3 bg-white space-y-2"
                  >
                    <div className="border-b border-black pb-1.5 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
                          TIKET DAPUR GERAI
                        </span>
                        <h4 className="text-[14px] font-black uppercase">
                          {stallName} ({stallCode})
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] block text-slate-600">KARTU</span>
                        <span className="text-[16px] font-black bg-black text-white px-2 py-0.5 rounded">
                          NO. {order.cardNumber || order.nomorKartu}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>ID: {order.id}</span>
                      <span>{order.createdAt || order.waktuPesan}</span>
                    </div>

                    <div className="divide-y divide-slate-200 pt-1">
                      {stallItems.map((item, idx) => (
                        <div key={`${item.menuItem.id}-${idx}`} className="py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black">[{item.qty}x]</span>
                            <span className="font-bold text-[13px]">
                              {item.menuItem.name || item.menuItem.nama}
                            </span>
                          </div>
                          {(item.notes || item.catatan) && (
                            <p className="text-[11px] font-bold text-red-600 bg-red-50 p-1 rounded mt-1">
                              Catatan: {item.notes || item.catatan}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-3.5 bg-slate-50 rounded-b-2xl print:hidden">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Cetak Struk Sekarang
          </Button>
        </div>
      </div>

      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10px;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReceiptModal;
