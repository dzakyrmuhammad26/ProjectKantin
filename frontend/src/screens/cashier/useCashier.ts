'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Order, OrderStatus } from '@/models/pesanan';
import { PaymentMethod } from '@/models/pembayaran';
import { Stall } from '@/models/gerai';
import { PengaturanKantin } from '@/models/pengaturan';
import cashierController from '@/controllers/cashierController';
import stallController from '@/controllers/stallController';
import pengaturanController from '@/controllers/pengaturanController';
import { useAuth } from '@/context/AuthContext';
import { isCashMethod } from '@/utils/formatters';

export const isPending = (s?: string) => s === 'pending_payment' || s === 'menunggu_bayar';
export const isReady = (s?: string) => s === 'ready_to_prepare' || s === 'siap_dibuat';
export const isCompleted = (s?: string) => s === 'completed' || s === 'selesai';
export const isCancelled = (s?: string) => s === 'cancelled' || s === 'batal';

export function useCashier() {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanKantin>(pengaturanController.getDefault());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('menunggu_bayar');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Payment execution state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [referensiQris, setReferensiQris] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pay' | 'cancel' | 'complete' | null>(null);
  const [updatingMenuId, setUpdatingMenuId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Receipt Modal state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [orderList, stallList, settingData] = await Promise.all([
        cashierController.getOrders('all'),
        stallController.getStalls(),
        pengaturanController.getPengaturan(),
      ]);
      setOrders(orderList);
      setStalls(stallList);
      setPengaturan(settingData);

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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const handleSelectOrder = useCallback(
    (order: Order) => {
      const defaultMethod = (pengaturan.metodeBayarAktif?.[0] || 'tunai') as PaymentMethod;
      setSelectedOrderId(order.id);
      setPaymentMethod(defaultMethod);
      setCashGiven(order.total);
      setReferensiQris('');
      setActionMessage(null);
    },
    [pengaturan.metodeBayarAktif]
  );

  const selectedOrderItemsByStall = useMemo(() => {
    if (!selectedOrder) return {};
    const grouped: Record<string, CartItem[]> = {};
    for (const item of selectedOrder.items) {
      const sId = item.menuItem.stallId || item.menuItem.idGerai;
      if (!grouped[sId]) grouped[sId] = [];
      grouped[sId].push(item);
    }
    return grouped;
  }, [selectedOrder]);

  const displayOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => {
        if (statusFilter === 'pending_payment' || statusFilter === 'menunggu_bayar') {
          return isPending(o.status);
        }
        if (statusFilter === 'ready_to_prepare' || statusFilter === 'siap_dibuat') {
          return isReady(o.status);
        }
        if (statusFilter === 'completed' || statusFilter === 'selesai') {
          return isCompleted(o.status);
        }
        if (statusFilter === 'cancelled' || statusFilter === 'batal') {
          return isCancelled(o.status);
        }
        return o.status === statusFilter;
      });
    }
    return cashierController.searchOrders(filtered, searchQuery);
  }, [orders, statusFilter, searchQuery]);

  const shiftSummary = useMemo(() => {
    return cashierController.calculateShiftSummary(orders);
  }, [orders]);

  // Koreksi jumlah item oleh kasir sebelum dibayar (bekerja untuk status menunggu_bayar)
  const handleUpdateItemQty = useCallback(
    async (menuItemId: string, newQty: number) => {
      if (!selectedOrder || !isPending(selectedOrder.status) || isProcessing || updatingMenuId) return;

      setUpdatingMenuId(menuItemId);
      try {
        let updatedItems: CartItem[];
        if (newQty <= 0) {
          updatedItems = selectedOrder.items.filter((i) => i.menuItem.id !== menuItemId);
        } else {
          updatedItems = selectedOrder.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, qty: newQty, jumlah: newQty } : i
          );
        }

        const updated = await cashierController.updateOrderItems(selectedOrder.id, updatedItems);
        setCashGiven(updated.total);
        await loadData();
      } catch (err: any) {
        alert(err.message || 'Gagal mengubah item pesanan.');
      } finally {
        setUpdatingMenuId(null);
      }
    },
    [selectedOrder, isProcessing, updatingMenuId, loadData]
  );

  // Eksekusi pelunasan pembayaran kasir ke API POST /api/pembayaran
  const handleConfirmPayment = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    setIsProcessing(true);
    setPendingAction('pay');
    setActionMessage(null);

    try {
      const updatedOrder = await cashierController.processPayment(
        selectedOrder.id,
        paymentMethod,
        cashGiven,
        selectedOrder.total,
        {
          idKasir: currentUser?.id,
          referensiQris: referensiQris.trim() || undefined,
        }
      );

      setActionMessage({
        type: 'success',
        text: `Pembayaran Kartu No. ${selectedOrder.cardNumber} berhasil diverifikasi! Pesanan diteruskan ke gerai.`,
      });

      setReceiptOrder(updatedOrder);
      setIsReceiptOpen(true);
      setReferensiQris('');

      await loadData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Gagal memproses pembayaran.',
      });
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  }, [selectedOrder, isProcessing, paymentMethod, cashGiven, currentUser?.id, referensiQris, loadData]);

  // Batalkan pesanan melalui API PATCH /api/pesanan/:id/batal
  const handleCancelOrder = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    const confirmCancel = window.confirm(
      `Yakin ingin membatalkan pesanan Kartu No. ${selectedOrder.cardNumber}?`
    );
    if (!confirmCancel) return;

    setIsProcessing(true);
    setPendingAction('cancel');
    setActionMessage(null);
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
      setPendingAction(null);
    }
  }, [selectedOrder, isProcessing, loadData]);

  // Tandai pesanan selesai diambil melalui API PATCH /api/pesanan/:id/status
  const handleMarkCompleted = useCallback(async () => {
    if (!selectedOrder || isProcessing) return;
    setIsProcessing(true);
    setPendingAction('complete');
    setActionMessage(null);
    try {
      await cashierController.markAsCompleted(selectedOrder.id);
      setActionMessage({
        type: 'success',
        text: `Pesanan Kartu No. ${selectedOrder.cardNumber} telah diserahkan (Selesai).`,
      });
      await loadData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Gagal memperbarui status pesanan.',
      });
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  }, [selectedOrder, isProcessing, loadData]);

  const changeAmount = selectedOrder
    ? cashierController.calculateChange(selectedOrder.total, cashGiven)
    : 0;
  const isCashDeficit = Boolean(
    selectedOrder && isCashMethod(paymentMethod) && cashGiven < selectedOrder.total
  );

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
    pengaturan,
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
    referensiQris,
    setReferensiQris,
    isProcessing,
    pendingAction,
    updatingMenuId,
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
