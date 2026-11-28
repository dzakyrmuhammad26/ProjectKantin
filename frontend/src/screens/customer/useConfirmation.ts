'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Stall } from '@/models/gerai';
import { PengaturanKantin } from '@/models/pengaturan';
import orderController from '@/controllers/orderController';
import stallController from '@/controllers/stallController';
import pengaturanController from '@/controllers/pengaturanController';
import { useCart } from '@/context/CartContext';

export function useConfirmation() {
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
  const [pengaturan, setPengaturan] = useState<PengaturanKantin>(pengaturanController.getDefault());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stalls and settings
  useEffect(() => {
    Promise.all([
      stallController.getStalls(),
      pengaturanController.getPengaturan(),
    ]).then(([stallData, settingData]) => {
      setStalls(stallData);
      setPengaturan(settingData);
    });
  }, []);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  useEffect(() => {
    router.prefetch('/customer/complete');
    router.prefetch('/customer');
  }, [router]);

  useEffect(() => {
    if (isInitialized && items.length === 0 && !isSubmitting) {
      router.replace('/customer');
    }
  }, [isInitialized, items.length, isSubmitting, router]);

  const handleSubmitOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await orderController.createOrder(cardNumber, items, totalAmount, {
        sumber: 'pelanggan',
        minCard: pengaturan.nomorKartuMin,
        maxCard: pengaturan.nomorKartuMax,
      });
      clearCart();
      router.push('/customer/complete');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim pesanan');
      setIsSubmitting(false);
    }
  };

  const handleEditOrder = () => {
    router.push(cardNumber ? `/customer?card=${encodeURIComponent(cardNumber)}` : '/customer');
  };

  return {
    cardNumber,
    items,
    itemsByStall,
    totalAmount,
    totalCount,
    isInitialized,
    pengaturan,
    stallMap,
    isSubmitting,
    handleSubmitOrder,
    handleEditOrder,
  };
}
