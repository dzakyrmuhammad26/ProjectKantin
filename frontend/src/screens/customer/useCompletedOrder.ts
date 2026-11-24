'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import orderController from '@/controllers/orderController';
import stallController from '@/controllers/stallController';

export function useCompletedOrder() {
  const router = useRouter();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);

  // Prefetch order route
  useEffect(() => {
    router.prefetch('/customer');
  }, [router]);

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
      router.replace('/customer');
    }
  }, [isOrderLoaded, completedOrder, router]);

  // Navigate back to menu
  const handleNewOrder = () => {
    const card = completedOrder?.cardNumber || completedOrder?.nomorKartu || '';
    router.push(card ? `/customer?card=${encodeURIComponent(card)}` : '/customer');
  };

  const cardNumber = completedOrder?.cardNumber || completedOrder?.nomorKartu || '';

  return {
    completedOrder,
    cardNumber,
    isOrderLoaded,
    stallMap,
    completedOrderItemsByStall,
    handleNewOrder,
  };
}
