'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { CartItem, Order, OrderStatus, PaymentMethod, Stall } from '@/models';
import { cashierController, stallController } from '@/controllers';
import { formatCurrency } from '@/utils';
import { Button, Input, ReceiptModal, StatusLabel } from '@/components';

export function CashierScreen() {
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

  // Load orders and stalls
  const loadData = useCallback(async () => {
    try {
      const [orderList, stallList] = await Promise.all([
        cashierController.getOrders('all'),
        stallController.getStalls(),
      ]);
      setOrders(orderList);
      setStalls(stallList);

      // Auto-select first pending order if none selected
      if (!selectedOrderId && orderList.length > 0) {
        const firstPending = orderList.find((o) => o.status === 'pending_payment');
        if (firstPending) {
          setSelectedOrderId(firstPending.id);
          setCashGiven(firstPending.total);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrderId]);

  useEffect(() => {
    loadData();
    // Auto-refresh queue every 5 seconds to catch new customer orders
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Selected Order
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Update default cash given when selected order changes
  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setPaymentMethod('cash');
    setCashGiven(order.total);
    setActionMessage(null);
  };

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

  // Filtered & Searched Orders for the Left Column
  const displayOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    return cashierController.searchOrders(filtered, searchQuery);
  }, [orders, statusFilter, searchQuery]);

  // Shift summary calculations
  const shiftSummary = useMemo(() => {
    return cashierController.calculateShiftSummary(orders);
  }, [orders]);

  // Handle Item Quantity Adjustment (Kasir Edit Pesanan Sebelum Dibayar)
  const handleUpdateItemQty = async (menuItemId: string, newQty: number) => {
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
  };

  // Handle Payment Submission
  const handleConfirmPayment = async () => {
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
  };

  // Handle Cancel Order
  const handleCancelOrder = async () => {
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
  };

  // Handle Mark as Completed
  const handleMarkCompleted = async () => {
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
  };

  // Change calculation
  const changeAmount = selectedOrder
    ? cashierController.calculateChange(selectedOrder.total, cashGiven)
    : 0;
  const isCashDeficit = selectedOrder && paymentMethod === 'cash' && cashGiven < selectedOrder.total;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937]">
      {/* Receipt & Kitchen Slip Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
        stallMap={stallMap}
      />

      {/* Top Navbar Kasir */}
      <header className="sticky top-0 z-30 border-b border-line bg-white px-6 py-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white font-bold text-lg">
              K
            </span>
            <div>
              <h1 className="text-[17px] font-bold text-ink leading-tight">
                Kasir Sentral — Kantin Darren
              </h1>
              <p className="text-[12px] text-muted">
                Manajemen Pembayaran &amp; Antrean Pesanan Multi-Gerai
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-line pr-5">
              <span className="text-[12px] font-medium text-muted">Omzet Hari Ini:</span>
              <span className="font-mono text-[16px] font-bold text-brand-700">
                {formatCurrency(shiftSummary.totalRevenue)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[13px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700 border border-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                {shiftSummary.pendingCount} Menunggu Bayar
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 border border-emerald-200">
                {shiftSummary.paidCount} Siap Dibuat
              </span>
            </div>

            <Link
              href="/order"
              target="_blank"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Buka Layar Pelanggan
            </Link>
          </div>
        </div>
      </header>

      {/* Main Two-Column Split Layout */}
      <main className="mx-auto max-w-[1600px] p-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* KOLOM KIRI (Antrean & Pencarian Pesanan) - 5 Kolom       */}
          {/* ======================================================== */}
          <section className="col-span-5 rounded-[12px] border border-line bg-white shadow-xs">
            {/* Search Input */}
            <div className="border-b border-line p-4 space-y-3">
              <Input
                type="text"
                placeholder="Cari No. Kartu (cth: 12) atau ID pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                }
              />

              {/* Status Filter Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[13px]">
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending_payment')}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    statusFilter === 'pending_payment'
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-ink hover:bg-slate-200'
                  }`}
                >
                  Menunggu ({shiftSummary.pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('ready_to_prepare')}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    statusFilter === 'ready_to_prepare'
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-ink hover:bg-slate-200'
                  }`}
                >
                  Siap Dibuat ({shiftSummary.paidCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-ink hover:bg-slate-200'
                  }`}
                >
                  Semua ({orders.length})
                </button>
              </div>
            </div>

            {/* List of Orders */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto divide-y divide-line p-2">
              {isLoading ? (
                <div className="py-16 text-center text-muted text-[14px]">
                  Memuat antrean pesanan...
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="py-16 text-center text-faint text-[14px]">
                  Tidak ada pesanan pada status ini
                </div>
              ) : (
                displayOrders.map((order) => {
                  const isSelected = order.id === selectedOrderId;
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className={`cursor-pointer rounded-lg p-3.5 transition-all my-1 ${
                        isSelected
                          ? 'border border-brand-700 bg-brand-50/40 shadow-xs'
                          : 'border border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-brand-700 px-2 py-0.5 text-[14px] font-bold text-white">
                            No. {order.cardNumber}
                          </span>
                          <span className="text-[12px] text-muted font-mono">
                            {order.id}
                          </span>
                        </div>
                        <span className="text-[12px] text-muted font-medium">
                          {order.createdAt}
                        </span>
                      </div>

                      {/* Items Summary Preview */}
                      <p className="mt-2 text-[13px] text-ink line-clamp-1">
                        {order.items.map((i) => `${i.qty}x ${i.menuItem.name}`).join(', ')}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-1">
                        <span className="font-mono text-[15px] font-bold text-ink">
                          {formatCurrency(order.total)}
                        </span>
                        <StatusLabel
                          status={
                            order.status === 'pending_payment'
                              ? 'wait'
                              : order.status === 'ready_to_prepare'
                              ? 'paid'
                              : order.status === 'completed'
                              ? 'done'
                              : 'cancel'
                          }
                          label={
                            order.status === 'pending_payment'
                              ? 'Menunggu Bayar'
                              : order.status === 'ready_to_prepare'
                              ? 'Siap Dibuat'
                              : order.status === 'completed'
                              ? 'Selesai'
                              : 'Batal'
                          }
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ======================================================== */}
          {/* KOLOM KANAN (Detail Pesanan & Eksekusi Bayar) - 7 Kolom */}
          {/* ======================================================== */}
          <section className="col-span-7 rounded-[12px] border border-line bg-white p-6 shadow-xs">
            {!selectedOrder ? (
              <div className="py-32 text-center text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-[15px] font-medium text-ink">Belum Ada Pesanan Dipilih</p>
                <p className="text-[13px] text-muted mt-1">
                  Pilih salah satu pesanan dari daftar antrean di sebelah kiri.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Selected Order */}
                <div className="flex items-start justify-between border-b border-line pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[22px] font-bold text-ink">
                        Kartu No. {selectedOrder.cardNumber}
                      </h2>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[12px] font-mono text-muted">
                        {selectedOrder.id}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted mt-1">
                      Waktu Pemesanan: {selectedOrder.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Tombol Pratinjau / Cetak Struk */}
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptOrder(selectedOrder);
                        setIsReceiptOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      🧾 Pratinjau Struk
                    </button>

                    <StatusLabel
                      status={
                        selectedOrder.status === 'pending_payment'
                          ? 'wait'
                          : selectedOrder.status === 'ready_to_prepare'
                          ? 'paid'
                          : selectedOrder.status === 'completed'
                          ? 'done'
                          : 'cancel'
                      }
                      label={
                        selectedOrder.status === 'pending_payment'
                          ? 'Menunggu Bayar'
                          : selectedOrder.status === 'ready_to_prepare'
                          ? 'Siap Dibuat'
                          : selectedOrder.status === 'completed'
                          ? 'Selesai'
                          : 'Batal'
                      }
                    />
                  </div>
                </div>

                {/* Notifikasi Aksi */}
                {actionMessage && (
                  <div
                    className={`rounded-lg p-3.5 text-[13px] font-medium ${
                      actionMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {actionMessage.text}
                  </div>
                )}

                {/* ======================================================== */}
                {/* Rincian Pesanan per Gerai (dengan Fitur Edit Item Kasir) */}
                {/* ======================================================== */}
                <div className="rounded-xl border border-line bg-slate-50/70 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
                      Rincian Pesanan per Gerai
                    </span>
                    {selectedOrder.status === 'pending_payment' && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                        ✏️ Kasir dapat koreksi item sebelum dibayar
                      </span>
                    )}
                  </div>

                  {Object.entries(selectedOrderItemsByStall).map(([stallId, stallItems]) => {
                    const stall = stallMap.get(stallId);
                    const stallColor = stall?.color || '#0F766E';
                    const stallName = stall?.name || stallId;
                    const stallSubtotal = stallItems.reduce(
                      (sum, item) => sum + item.menuItem.price * item.qty,
                      0
                    );

                    return (
                      <div
                        key={stallId}
                        className="rounded-lg border border-line bg-white overflow-hidden shadow-2xs"
                      >
                        {/* Header Gerai */}
                        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/70 border-b border-line">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-1.5 rounded-full inline-block"
                              style={{ backgroundColor: stallColor }}
                            />
                            <span className="text-[13px] font-bold text-ink">
                              {stallName} ({stall?.code || stallId})
                            </span>
                          </div>
                          <span className="text-[12px] font-mono font-semibold text-ink">
                            {formatCurrency(stallSubtotal)}
                          </span>
                        </div>

                        {/* List Items Gerai ini */}
                        <div className="divide-y divide-line">
                          {stallItems.map((item) => (
                            <div
                              key={item.menuItem.id}
                              className="p-3 flex items-center justify-between gap-3 text-[13px]"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold text-ink block truncate">
                                  {item.menuItem.name}
                                </span>
                                {item.notes && (
                                  <span className="text-[11px] text-muted italic block">
                                    Catatan: {item.notes}
                                  </span>
                                )}
                              </div>

                              {/* Kontrol Koreksi Qty Kasir (Hanya jika belum dibayar) */}
                              {selectedOrder.status === 'pending_payment' ? (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.menuItem.id, item.qty - 1)}
                                    title="Kurangi / Hapus"
                                    className="flex h-6 w-6 items-center justify-center rounded border border-line bg-white text-[13px] font-bold text-ink hover:bg-slate-100"
                                  >
                                    −
                                  </button>
                                  <span className="w-5 text-center font-mono font-bold text-ink">
                                    {item.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.menuItem.id, item.qty + 1)}
                                    title="Tambah"
                                    className="flex h-6 w-6 items-center justify-center rounded bg-brand-700 text-[13px] font-bold text-white hover:bg-brand-800"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[13px] font-bold text-ink">
                                  {item.qty}x
                                </span>
                              )}

                              <span className="w-24 text-right font-mono font-bold text-ink tabular-nums">
                                {formatCurrency(item.menuItem.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Total Tagihan */}
                  <div className="flex items-baseline justify-between pt-2 border-t border-line">
                    <span className="text-[13px] font-bold uppercase tracking-wider text-muted">
                      Total Tagihan
                    </span>
                    <span className="font-mono text-[22px] font-black text-ink">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* STATE 1: PESANAN MENUNGGU BAYAR (FORM EKSEKUSI BAYAR)    */}
                {/* ======================================================== */}
                {selectedOrder.status === 'pending_payment' && (
                  <div className="rounded-xl border border-line bg-white p-5 shadow-xs space-y-4">
                    <h3 className="text-[15px] font-bold text-ink">
                      Proses Pembayaran Kasir
                    </h3>

                    {/* Pilih Metode Pembayaran */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('cash');
                          setCashGiven(selectedOrder.total);
                        }}
                        className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[14px] font-bold transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-xs'
                            : 'border-line bg-white text-muted hover:border-slate-300'
                        }`}
                      >
                        💵 Uang Tunai (Cash)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('qris');
                          setCashGiven(selectedOrder.total);
                        }}
                        className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[14px] font-bold transition-all ${
                          paymentMethod === 'qris'
                            ? 'border-brand-700 bg-brand-50 text-brand-700 shadow-xs'
                            : 'border-line bg-white text-muted hover:border-slate-300'
                        }`}
                      >
                        📱 QRIS / Non-Tunai
                      </button>
                    </div>

                    {/* Pembayaran Tunai */}
                    {paymentMethod === 'cash' && (
                      <div className="space-y-3 pt-2">
                        {/* Tombol Pecahan Cepat */}
                        <div>
                          <span className="text-[12px] font-semibold text-muted block mb-1.5">
                            Pecahan Uang Cepat:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setCashGiven(selectedOrder.total)}
                              className="rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100"
                            >
                              Uang Pas ({formatCurrency(selectedOrder.total)})
                            </button>
                            {[50000, 100000, 200000].map((nominal) => (
                              <button
                                key={nominal}
                                type="button"
                                onClick={() => setCashGiven(nominal)}
                                className="rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-slate-100"
                              >
                                {formatCurrency(nominal)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Input Jumlah Uang Diterima */}
                        <div className="pt-1">
                          <label className="text-[12px] font-semibold text-ink block mb-1">
                            Uang Diterima dari Pelanggan (Rp):
                          </label>
                          <input
                            type="number"
                            value={cashGiven || ''}
                            onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                            className="w-full h-11 px-3 rounded-lg border border-line text-[16px] font-mono font-bold text-ink focus:border-brand-700 outline-none"
                            placeholder="0"
                          />
                        </div>

                        {/* Status Kembalian */}
                        <div
                          className={`rounded-lg p-3 text-center border ${
                            isCashDeficit
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <span className="text-[12px] font-semibold uppercase block">
                            {isCashDeficit ? 'Uang Masih Kurang' : 'Kembalian'}
                          </span>
                          <span className="font-mono text-[22px] font-black">
                            {isCashDeficit
                              ? formatCurrency(selectedOrder.total - cashGiven)
                              : formatCurrency(changeAmount)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pembayaran QRIS */}
                    {paymentMethod === 'qris' && (
                      <div className="rounded-lg border border-line bg-slate-50 p-4 text-center space-y-2">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-white border border-line shadow-inner font-mono text-[11px] text-muted">
                          [ QRIS SIMULATOR ]
                        </div>
                        <p className="text-[13px] font-semibold text-ink">
                          Minta pelanggan scan QRIS sebesar {formatCurrency(selectedOrder.total)}
                        </p>
                        <p className="text-[12px] text-muted">
                          Konfirmasi setelah notifikasi bayar berhasil diterima.
                        </p>
                      </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="secondary"
                        onClick={handleCancelOrder}
                        disabled={isProcessing}
                        className="w-1/3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Batalkan
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleConfirmPayment}
                        disabled={Boolean(isCashDeficit) || isProcessing}
                        className="w-2/3"
                      >
                        {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran & Cetak'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STATE 2: SUDAH DIBAYAR (SIAP DIBUAT)                     */}
                {/* ======================================================== */}
                {selectedOrder.status === 'ready_to_prepare' && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <span className="text-xl">✓</span>
                        <h3 className="text-[15px] font-bold">
                          Pembayaran Lunas ({selectedOrder.payment?.method.toUpperCase()})
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptOrder(selectedOrder);
                          setIsReceiptOpen(true);
                        }}
                        className="rounded-lg border border-emerald-300 bg-white px-3 py-1 text-[12px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        🖨️ Cetak Ulang Struk
                      </button>
                    </div>
                    <p className="text-[13px] text-emerald-700">
                      Pesanan telah dibayar pada {selectedOrder.payment?.paidAt || '-'}. Masing-masing gerai telah menerima tiket pesanan untuk mulai memasak.
                    </p>
                    <div className="pt-2">
                      <Button
                        variant="primary"
                        onClick={handleMarkCompleted}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Menyimpan...' : 'Tandai Pesanan Selesai Diambil Pelanggan'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STATE 3: SELESAI                                         */}
                {/* ======================================================== */}
                {selectedOrder.status === 'completed' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-ink">
                        Pesanan ini telah selesai dan diserahkan ke pelanggan.
                      </p>
                      <p className="text-[12px] text-muted mt-0.5">
                        Metode: {selectedOrder.payment?.method.toUpperCase()} • {selectedOrder.payment?.paidAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptOrder(selectedOrder);
                        setIsReceiptOpen(true);
                      }}
                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      🖨️ Cetak Ulang
                    </button>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STATE 4: DIBATALKAN                                      */}
                {/* ======================================================== */}
                {selectedOrder.status === 'cancelled' && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
                    <p className="text-[14px] font-semibold">
                      Pesanan ini telah dibatalkan oleh kasir.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
