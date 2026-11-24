'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Stall } from '@/models/gerai';
import orderController from '@/controllers/orderController';
import stallController from '@/controllers/stallController';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stalls for header/colors
  useEffect(() => {
    stallController.getStalls().then(setStalls);
  }, []);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Prefetch complete route for instant submission transition
  useEffect(() => {
    router.prefetch('/customer/complete');
    router.prefetch('/customer');
  }, [router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isInitialized && items.length === 0 && !isSubmitting) {
      router.replace('/customer');
    }
  }, [isInitialized, items.length, isSubmitting, router]);

  // Submit order through orderController
  const handleSubmitOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await orderController.createOrder(cardNumber, items, totalAmount);
      clearCart();
      router.push('/customer/complete');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim pesanan');
      setIsSubmitting(false);
    }
  };

  // Back to edit order in menu
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
    stallMap,
    isSubmitting,
    handleSubmitOrder,
    handleEditOrder,
  };
}
