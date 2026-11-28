'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { PengaturanKantin } from '@/models/pengaturan';
import orderController from '@/controllers/orderController';
import stallController from '@/controllers/stallController';
import pengaturanController from '@/controllers/pengaturanController';

export function useCompletedOrder() {
  const router = useRouter();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanKantin>(pengaturanController.getDefault());
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);

  useEffect(() => {
    router.prefetch('/customer');
  }, [router]);

  const loadOrder = useCallback(async () => {
    const order = await orderController.getLastOrder();
    if (order) setCompletedOrder(order);
    return order;
  }, []);

  useEffect(() => {
    async function init() {
      const [order, stallList, settingData] = await Promise.all([
        orderController.getLastOrder(),
        stallController.getStalls(),
        pengaturanController.getPengaturan(),
      ]);
      setCompletedOrder(order);
      setStalls(stallList);
      setPengaturan(settingData);
      setIsOrderLoaded(true);
    }
    init();
  }, []);

  // Poll status pesanan setiap 8 detik agar pelanggan melihat update status real-time
  useEffect(() => {
    if (!completedOrder?.id) return;
    if (completedOrder.status === 'selesai' || completedOrder.status === 'batal') return;

    const timer = setInterval(() => {
      orderController.getOrderById(completedOrder.id).then((latest) => {
        if (latest) setCompletedOrder(latest);
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [completedOrder?.id, completedOrder?.status]);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  const completedOrderItemsByStall = useMemo(() => {
    if (!completedOrder?.items) return {};
    return orderController.groupOrderItemsByStall(completedOrder.items);
  }, [completedOrder]);

  useEffect(() => {
    if (isOrderLoaded && !completedOrder) {
      router.replace('/customer');
    }
  }, [isOrderLoaded, completedOrder, router]);

  const handleNewOrder = () => {
    const card = completedOrder?.cardNumber || completedOrder?.nomorKartu || '';
    router.push(card ? `/customer?card=${encodeURIComponent(card)}` : '/customer');
  };

  const cardNumber = completedOrder?.cardNumber || completedOrder?.nomorKartu || '';

  return {
    completedOrder,
    cardNumber,
    pengaturan,
    isOrderLoaded,
    stallMap,
    completedOrderItemsByStall,
    handleNewOrder,
    loadOrder,
  };
}
