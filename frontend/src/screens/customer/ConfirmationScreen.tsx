'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { PageContainer } from '@/components/PageContainer';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/Button';
import { OrderSummaryView } from '@/components/OrderSummaryView';
import { useConfirmation } from './useConfirmation';

export function ConfirmationScreen() {
  const {
    cardNumber,
    items,
    itemsByStall,
    totalAmount,
    totalCount,
    isInitialized,
    stallMap,
    isSubmitting,
    handleSubmitOrder,
    handleEditOrder,
  } = useConfirmation();

  if (!isInitialized || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title="Kantin Darren" cardNumber={cardNumber} />
        <PageContainer>
          <div className="max-w-[588px] mx-auto py-16 text-center">
            <p className="text-[14px] text-muted">Memuat ringkasan pesanan...</p>
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
            {/* Panel Header */}
            <div className="border-b border-line pb-3.5 sm:pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-semibold text-ink leading-tight">
                  Konfirmasi Pesanan
                </h1>
                <p className="text-[13px] sm:text-[14px] text-muted mt-1">
                  Tagihan {cardNumber ? `Kartu No. ${cardNumber}` : 'Pelanggan'} • {totalCount} item
                </p>
              </div>
              <div className="self-start sm:self-auto px-3 py-1 bg-brand-50 border border-brand-700 rounded-lg">
                <span className="text-[12px] sm:text-[13px] font-semibold text-brand-700 whitespace-nowrap">
                  {cardNumber ? `Kartu No. ${cardNumber}` : 'Pelanggan'}
                </span>
              </div>
            </div>

            {/* Order Summary by Stall */}
            <OrderSummaryView
              itemsByStall={itemsByStall}
              stallMap={stallMap}
              totalAmount={totalAmount}
              totalCount={totalCount}
            />

            {/* Payment Instructions */}
            <div className="border border-line bg-slate-50 rounded-lg p-3.5 sm:p-4 flex flex-col gap-1.5">
              <span className="text-[13px] sm:text-[14px] font-semibold text-ink">
                Petunjuk Pembayaran
              </span>
              <p className="text-[12px] sm:text-[13px] text-muted leading-relaxed">
                Pembayaran dilakukan di kasir sentral dengan menunjukkan kartu{' '}
                <strong className="text-ink font-semibold">No. {cardNumber}</strong> (tunai atau QRIS).
                Pesanan akan otomatis diteruskan dan mulai dibuat di masing-masing gerai setelah pembayaran lunas diverifikasi kasir.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                variant="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim pesanan'}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                disabled={isSubmitting}
                onClick={handleEditOrder}
              >
                Ubah pesanan
              </Button>
            </div>
          </Panel>
        </div>
      </PageContainer>
    </div>
  );
}

export default ConfirmationScreen;
