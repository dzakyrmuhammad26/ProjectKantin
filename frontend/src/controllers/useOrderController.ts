'use client';

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Order, CartItem } from '@/models/types';
import { GERAI_LIST } from '@/data';
import { formatJam } from '@/utils';
import { storage } from '@/services';
import { useCart } from './CartContext';

export function useOrderController() {
  const router = useRouter();
  const {
    cardNumber,
    items,
    totalAmount,
    totalCount,
    itemsByGerai,
    clearCart,
    isInitialized,
  } = useCart();

  const isSubmitting = useRef(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isOrderLoaded, setIsOrderLoaded] = useState(false);

  // Load completed order for /pesan/selesai
  useEffect(() => {
    const saved = storage.getLastOrder();
    if (saved) {
      setCompletedOrder(saved);
    }
    setIsOrderLoaded(true);
  }, []);

  const geraiMap = useMemo(() => {
    return new Map(GERAI_LIST.map((g) => [g.id, g]));
  }, []);

  // For /pesan/konfirmasi: redirect if empty
  const checkEmptyCartRedirect = useCallback(() => {
    if (isInitialized && items.length === 0 && !isSubmitting.current) {
      router.replace('/pesan');
    }
  }, [isInitialized, items.length, router]);

  // For /pesan/selesai: redirect if no saved order
  const checkNoOrderRedirect = useCallback(() => {
    if (isOrderLoaded && !completedOrder) {
      router.replace('/pesan');
    }
  }, [isOrderLoaded, completedOrder, router]);

  // Submit order action
  const handleKirimPesanan = () => {
    if (items.length === 0) return;
    isSubmitting.current = true;

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `TRX-${cardNumber}${randomCode}`;

    const newOrder: Order = {
      id: orderId,
      cardNumber,
      items: [...items],
      total: totalAmount,
      status: 'menunggu_bayar',
      createdAt: formatJam(),
    };

    storage.setLastOrder(newOrder);
    clearCart();
    router.push('/pesan/selesai');
  };

  // Back to edit order
  const handleUbahPesanan = () => {
    router.push(cardNumber ? `/pesan?kartu=${encodeURIComponent(cardNumber)}` : '/pesan');
  };

  // Order again from /pesan/selesai
  const handleTambahPesanan = () => {
    const card = completedOrder?.cardNumber || cardNumber || '';
    router.push(card ? `/pesan?kartu=${encodeURIComponent(card)}` : '/pesan');
  };

  // Helper: group order items by gerai
  const completedOrderItemsByGerai = useMemo(() => {
    if (!completedOrder?.items) return {};
    const grouped: Record<string, CartItem[]> = {};
    completedOrder.items.forEach((item) => {
      const gId = item.menuItem.geraiId;
      if (!grouped[gId]) {
        grouped[gId] = [];
      }
      grouped[gId].push(item);
    });
    return grouped;
  }, [completedOrder]);

  return {
    cardNumber: completedOrder?.cardNumber || cardNumber,
    items,
    itemsByGerai,
    totalAmount,
    totalCount,
    geraiMap,
    isInitialized,
    completedOrder,
    isOrderLoaded,
    completedOrderItemsByGerai,
    checkEmptyCartRedirect,
    checkNoOrderRedirect,
    handleKirimPesanan,
    handleUbahPesanan,
    handleTambahPesanan,
  };
}
