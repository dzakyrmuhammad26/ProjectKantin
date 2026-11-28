'use client';

import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { CustomerSummarySkeleton } from '@/components/loading/LoadingSkeletons';
import { MotionFadeIn } from '@/components/loading/MotionFadeIn';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PageContainer } from '@/components/PageContainer';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/Button';
import { StatusLabel } from '@/components/StatusLabel';
import { OrderSummaryView } from '@/components/OrderSummaryView';
import { StatusType } from '@/models/pesanan';
import { useCompletedOrder } from './useCompletedOrder';

function getOrderStatusView(status?: string): { type: StatusType; label: string } {
  if (status === 'siap_dibuat' || status === 'ready_to_prepare') {
    return { type: 'paid', label: 'Sudah dibayar • Sedang dibuat' };
  }
  if (status === 'selesai' || status === 'completed') {
    return { type: 'done', label: 'Selesai siap diambil' };
  }
  if (status === 'batal' || status === 'cancelled') {
    return { type: 'cancel', label: 'Dibatalkan' };
  }
  return { type: 'wait', label: 'Menunggu bayar' };
}

export function CompletedScreen() {
  const {
    completedOrder,
    cardNumber,
    pengaturan,
    isOrderLoaded,
    stallMap,
    completedOrderItemsByStall,
    handleNewOrder,
  } = useCompletedOrder();

  if (!isOrderLoaded || !completedOrder) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title={pengaturan.namaKantin} />
        <PageContainer>
          <CustomerSummarySkeleton />
        </PageContainer>
      </div>
    );
  }

  const statusView = getOrderStatusView(completedOrder.status);
  const isLivePolling =
    completedOrder.status === 'menunggu_bayar' ||
    completedOrder.status === 'pending_payment' ||
    completedOrder.status === 'siap_dibuat';

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title={pengaturan.namaKantin} cardNumber={cardNumber} />

      <PageContainer>
        <MotionFadeIn className="max-w-[588px] mx-auto">
          <Panel className="p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
            {/* Header: Title and Big Card Number */}
            <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <StatusLabel status={statusView.type} label={statusView.label} />
                  {isLivePolling && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-medium text-teal-700">
                      <LoadingSpinner size="xs" variant="brand" />
                      Pemantauan langsung
                    </span>
                  )}
                </div>
                <h1 className="text-[18px] sm:text-[20px] font-semibold text-ink leading-tight">
                  Pesanan terkirim
                </h1>
                <p className="text-[12px] text-muted mt-1">
                  ID: {completedOrder.id} • {completedOrder.createdAt || completedOrder.waktuPesan}
                </p>
              </div>
              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-line">
                <span className="text-[11px] sm:text-[12px] text-muted block uppercase tracking-wider font-semibold">
                  Nomor Kartu
                </span>
                <span className="text-[26px] sm:text-[32px] font-bold text-ink leading-tight">
                  {cardNumber ? `No. ${cardNumber}` : '-'}
                </span>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="border border-line bg-slate-50 rounded-lg p-3.5 sm:p-4">
              {completedOrder.status === 'menunggu_bayar' || completedOrder.status === 'pending_payment' ? (
                <p className="text-[13px] sm:text-[14px] text-ink leading-relaxed">
                  Bayar di kasir dengan menunjukkan kartu{' '}
                  <strong className="font-semibold text-brand-700">
                    {cardNumber ? `No. ${cardNumber}` : 'pesanan'}
                  </strong>. Pesanan dibuat setelah pembayaran.
                </p>
              ) : (
                <p className="text-[13px] sm:text-[14px] text-ink leading-relaxed">
                  Pesanan kartu <strong className="font-semibold text-brand-700">No. {cardNumber}</strong> telah tercatat lunas dan diteruskan ke masing-masing gerai.
                </p>
              )}
            </div>

            {/* Order Summary by Stall */}
            <OrderSummaryView
              itemsByStall={completedOrderItemsByStall}
              stallMap={stallMap}
              totalAmount={completedOrder.total}
              totalCount={completedOrder.items.reduce((s, i) => s + (i.qty || i.jumlah || 0), 0)}
            />

            {/* Action Button */}
            <div className="pt-2">
              <Button variant="secondary" fullWidth onClick={handleNewOrder}>
                Tambah pesanan
              </Button>
            </div>
          </Panel>
        </MotionFadeIn>
      </PageContainer>
    </div>
  );
}

export default CompletedScreen;
