'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Order, OrderStatus } from '@/models/pesanan';
import { PaymentMethod } from '@/models/pembayaran';
import { Stall } from '@/models/gerai';
import cashierController from '@/controllers/cashierController';
import stallController from '@/controllers/stallController';

export const isPending = (s?: string) => s === 'pending_payment' || s === 'menunggu_bayar';
export const isReady = (s?: string) => s === 'ready_to_prepare' || s === 'siap_dibuat';
export const isCompleted = (s?: string) => s === 'completed' || s === 'selesai';
export const isCancelled = (s?: string) => s === 'cancelled' || s === 'batal';

export function useCashier() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('pending_payment');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Payment execution state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Receipt Modal state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Load orders and stalls from controllers
  const loadData = useCallback(async () => {
    try {
      const [orderList, stallList] = await Promise.all([
        cashierController.getOrders('all'),
        stallController.getStalls(),
      ]);
      setOrders(orderList);
      setStalls(stallList);

      // Auto-select first pending order if none selected
      setSelectedOrderId((prev) => {
        if (prev) return prev;
        const firstPending = orderList.find((o) => isPending(o.status));
        if (firstPending) {
          setCashGiven(firstPending.total);
          return firstPending.id;
        }
        return null;
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh queue every 5 seconds to catch new customer orders
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Lookup map for stall metadata
  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Selected Order object
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Select an order from the list
  const handleSelectOrder = useCallback((order: Order) => {
    setSelectedOrderId(order.id);
    setPaymentMethod('cash');
    setCashGiven(order.total);
    setActionMessage(null);
  }, []);

  // Group items by stall for the selected order
  const selectedOrderItemsByStall = useMemo(() => {
    if (!selectedOrder) return {};
    const grouped: Record<string, CartItem[]> = {};
    for (const item of selectedOrder.items) {
      const sId = item.menuItem.stallId;
      if (!grouped[sId]) grouped[sId] = [];
      grouped[sId].push(item);
    }
    return grouped;
  }, [selectedOrder]);

  // Filtered & Searched Orders for display in the queue list
  const displayOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => {
        if (statusFilter === 'pending_payment' || statusFilter === 'menunggu_bayar') return isPending(o.status);
        if (statusFilter === 'ready_to_prepare' || statusFilter === 'siap_dibuat') return isReady(o.status);
        if (statusFilter === 'completed' || statusFilter === 'selesai') return isCompleted(o.status);
        if (statusFilter === 'cancelled' || statusFilter === 'batal') return isCancelled(o.status);
        return o.status === statusFilter;
      });
    }
    return cashierController.searchOrders(filtered, searchQuery);
  }, [orders, statusFilter, searchQuery]);

  // Shift summary calculations
  const shiftSummary = useMemo(() => {
    return cashierController.calculateShiftSummary(orders);
  }, [orders]);

  // Handle Item Quantity Adjustment (Kasir Edit Pesanan Sebelum Dibayar)
  const handleUpdateItemQty = useCallback(async (menuItemId: string, newQty: number) => {
    if (!selectedOrder || selectedOrder.status !== 'pending_payment' || isProcessing) return;

    try {
      let updatedItems: CartItem[];
      if (newQty <= 0) {
        updatedItems = selectedOrder.items.filter((i) => i.menuItem.id !== menuItemId);
      } else {
        updatedItems = selectedOrder.items.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, qty: newQty } : i
        );
      }

      const updated = await cashierController.updateOrderItems(selectedOrder.id, updatedItems);
      setCashGiven(updated.total);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah item pesanan.');
    }
  }, [selectedOrder, isProcessing, loadData]);

  // Handle Payment Confirmation
  const handleConfirmPayment = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    setIsProcessing(true);
    setActionMessage(null);

    try {
      const updatedOrder = await cashierController.processPayment(
        selectedOrder.id,
        paymentMethod,
        cashGiven,
        selectedOrder.total
      );

      setActionMessage({
        type: 'success',
        text: `Pembayaran Kartu No. ${selectedOrder.cardNumber} berhasil diverifikasi! Pesanan diteruskan ke gerai.`,
      });

      // Open receipt automatically upon successful payment
      setReceiptOrder(updatedOrder);
      setIsReceiptOpen(true);

      await loadData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Gagal memproses pembayaran.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOrder, isProcessing, paymentMethod, cashGiven, loadData]);

  // Handle Cancel Order
  const handleCancelOrder = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    const confirmCancel = window.confirm(
      `Yakin ingin membatalkan pesanan Kartu No. ${selectedOrder.cardNumber}?`
    );
    if (!confirmCancel) return;

    setIsProcessing(true);
    try {
      await cashierController.cancelOrder(selectedOrder.id);
      setActionMessage({
        type: 'success',
        text: `Pesanan Kartu No. ${selectedOrder.cardNumber} berhasil dibatalkan.`,
      });
      await loadData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Gagal membatalkan pesanan.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOrder, isProcessing, loadData]);

  // Handle Mark as Completed
  const handleMarkCompleted = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    setIsProcessing(true);
    try {
      await cashierController.markAsCompleted(selectedOrder.id);
      setActionMessage({
        type: 'success',
        text: `Pesanan Kartu No. ${selectedOrder.cardNumber} telah diserahkan (Selesai).`,
      });
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOrder, isProcessing, loadData]);

  // Change calculation
  const changeAmount = selectedOrder
    ? cashierController.calculateChange(selectedOrder.total, cashGiven)
    : 0;
  const isCashDeficit = Boolean(selectedOrder && paymentMethod === 'cash' && cashGiven < selectedOrder.total);

  const openReceipt = useCallback((order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  }, []);

  const closeReceipt = useCallback(() => {
    setIsReceiptOpen(false);
  }, []);

  return {
    orders,
    stalls,
    stallMap,
    selectedOrderId,
    selectedOrder,
    selectedOrderItemsByStall,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    paymentMethod,
    setPaymentMethod,
    cashGiven,
    setCashGiven,
    isProcessing,
    actionMessage,
    isReceiptOpen,
    receiptOrder,
    displayOrders,
    shiftSummary,
    changeAmount,
    isCashDeficit,
    handleSelectOrder,
    handleUpdateItemQty,
    handleConfirmPayment,
    handleCancelOrder,
    handleMarkCompleted,
    openReceipt,
    closeReceipt,
  };
}
