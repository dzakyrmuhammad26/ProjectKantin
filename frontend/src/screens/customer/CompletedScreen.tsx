'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PageContainer } from '@/components/PageContainer';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/Button';
import { StatusLabel } from '@/components/StatusLabel';
import { OrderSummaryView } from '@/components/OrderSummaryView';
import { useCompletedOrder } from './useCompletedOrder';

export function CompletedScreen() {
  const {
    completedOrder,
    cardNumber,
    isOrderLoaded,
    stallMap,
    completedOrderItemsByStall,
    handleNewOrder,
  } = useCompletedOrder();

  if (!isOrderLoaded || !completedOrder) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title="Kantin Darren" />
        <PageContainer>
          <div className="max-w-[588px] mx-auto py-16 text-center">
            <p className="text-[14px] text-muted">Memeriksa status pesanan...</p>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title="Kantin Darren" cardNumber={cardNumber} />

      <PageContainer>
        <div className="max-w-[588px] mx-auto">
          <Panel className="p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
            {/* Header: Title and Big Card Number */}
            <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <StatusLabel status="wait" label="Menunggu bayar" className="mb-1.5" />
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
              <p className="text-[13px] sm:text-[14px] text-ink leading-relaxed">
                Bayar di kasir dengan menunjukkan kartu{' '}
                <strong className="font-semibold text-brand-700">
                  {cardNumber ? `No. ${cardNumber}` : 'pesanan'}
                </strong>. Pesanan dibuat setelah pembayaran.
              </p>
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
        </div>
      </PageContainer>
    </div>
  );
}

export default CompletedScreen;
