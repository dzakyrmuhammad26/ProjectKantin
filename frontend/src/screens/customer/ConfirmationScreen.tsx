'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, PageContainer, Panel, Button, OrderSummaryView } from '@/components';
import { Stall } from '@/models';
import { orderController, stallController } from '@/controllers';
import { useCart } from '@/context';

export function ConfirmationScreen() {
  const router = useRouter();
  const {
    cardNumber,
    items,
    itemsByStall,
    totalAmount,
    totalCount,
    isInitialized,
    clearCart,
  } = useCart();

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stalls for header/colors
  useEffect(() => {
    stallController.getStalls().then(setStalls);
  }, []);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isInitialized && items.length === 0 && !isSubmitting) {
      router.replace('/order');
    }
  }, [isInitialized, items.length, isSubmitting, router]);

  // Submit order through orderController
  const handleSubmitOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await orderController.createOrder(cardNumber, items, totalAmount);
      clearCart();
      router.push('/order/complete');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim pesanan');
      setIsSubmitting(false);
    }
  };

  // Back to edit order in menu
  const handleEditOrder = () => {
    router.push(cardNumber ? `/order?card=${encodeURIComponent(cardNumber)}` : '/order');
  };

  if (!isInitialized || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title="Kantin Darren" />
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
      <Navbar title="Kantin Darren" />

      <PageContainer>
        <div className="max-w-[588px] mx-auto">
          <Panel className="p-6 flex flex-col gap-6">
            {/* Panel Header */}
            <div className="border-b border-line pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-[20px] font-semibold text-ink leading-tight">
                  Konfirmasi Pesanan
                </h1>
                <p className="text-[14px] text-muted mt-1">
                  Tagihan {cardNumber ? `Kartu No. ${cardNumber}` : 'Pelanggan'} • {totalCount} item
                </p>
              </div>
              <div className="px-3 py-1 bg-brand-50 border border-brand-700 rounded-lg">
                <span className="text-[13px] font-semibold text-brand-700">
                  {cardNumber ? `No. ${cardNumber}` : 'Pelanggan'}
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
            <div className="border border-line bg-slate-50 rounded-lg p-4 flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-ink">
                Petunjuk Pembayaran
              </span>
              <p className="text-[13px] text-muted leading-relaxed">
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
