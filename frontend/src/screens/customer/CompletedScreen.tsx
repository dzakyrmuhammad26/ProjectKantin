'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, PageContainer, Panel, Button, StatusLabel, OrderSummaryView } from '@/components';
import { Order, Stall } from '@/models';
import { orderController, stallController } from '@/controllers';

export function CompletedScreen() {
  const router = useRouter();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);

  // Load order and stalls on mount via controllers
  useEffect(() => {
    async function init() {
      const [order, stallList] = await Promise.all([
        orderController.getLastOrder(),
        stallController.getStalls(),
      ]);
      setCompletedOrder(order);
      setStalls(stallList);
      setIsOrderLoaded(true);
    }
    init();
  }, []);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  const completedOrderItemsByStall = useMemo(() => {
    if (!completedOrder?.items) return {};
    return orderController.groupOrderItemsByStall(completedOrder.items);
  }, [completedOrder]);

  // Redirect if no order in storage
  useEffect(() => {
    if (isOrderLoaded && !completedOrder) {
      router.replace('/order');
    }
  }, [isOrderLoaded, completedOrder, router]);

  // Navigate back to menu
  const handleNewOrder = () => {
    const card = completedOrder?.cardNumber || '';
    router.push(card ? `/order?card=${encodeURIComponent(card)}` : '/order');
  };

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
      <Navbar title="Kantin Darren" />

      <PageContainer>
        <div className="max-w-[588px] mx-auto">
          <Panel className="p-6 flex flex-col gap-6">
            {/* Header: Title and Big Card Number */}
            <div className="border-b border-line pb-4 flex items-start justify-between">
              <div>
                <StatusLabel status="wait" label="Menunggu bayar" className="mb-1.5" />
                <h1 className="text-[20px] font-semibold text-ink leading-tight">
                  Pesanan terkirim
                </h1>
                <p className="text-[12px] text-muted mt-1">
                  ID: {completedOrder.id} • {completedOrder.createdAt}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-muted block uppercase tracking-wider font-semibold">
                  Nomor Kartu
                </span>
                <span className="text-[32px] font-bold text-ink leading-tight">
                  {completedOrder.cardNumber ? `No. ${completedOrder.cardNumber}` : '-'}
                </span>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="border border-line bg-slate-50 rounded-lg p-4">
              <p className="text-[14px] text-ink leading-relaxed">
                Bayar di kasir dengan menunjukkan kartu{' '}
                <strong className="font-semibold text-brand-700">
                  {completedOrder.cardNumber ? `No. ${completedOrder.cardNumber}` : 'pesanan'}
                </strong>. Pesanan dibuat setelah pembayaran.
              </p>
            </div>

            {/* Order Summary by Stall */}
            <OrderSummaryView
              itemsByStall={completedOrderItemsByStall}
              stallMap={stallMap}
              totalAmount={completedOrder.total}
              totalCount={completedOrder.items.reduce((s, i) => s + i.qty, 0)}
            />

            {/* Action Button */}
            <div className="pt-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleNewOrder}
              >
                Tambah pesanan
              </Button>
            </div>
          </Panel>
        </div>
      </PageContainer>
    </div>
  );
}
