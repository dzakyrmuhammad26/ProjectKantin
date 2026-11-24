'use client';

import React from 'react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { useCashier } from './useCashier';
import { CashierHeader } from './components/CashierHeader';
import { CashierOrderList } from './components/CashierOrderList';
import { CashierOrderDetail } from './components/CashierOrderDetail';
import { CashierPaymentSection } from './components/CashierPaymentSection';

export function CashierScreen() {
  const cashier = useCashier();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937]">
      {/* Modal Struk Kasir & Kitchen Slip */}
      <ReceiptModal
        isOpen={cashier.isReceiptOpen}
        onClose={cashier.closeReceipt}
        order={cashier.receiptOrder}
        stallMap={cashier.stallMap}
      />

      {/* Top Navbar Kasir */}
      <CashierHeader shiftSummary={cashier.shiftSummary} />

      {/* Two-Column Split Grid */}
      <main className="mx-auto max-w-[1600px] p-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Antrean & Pencarian Pesanan */}
          <CashierOrderList
            orders={cashier.orders}
            displayOrders={cashier.displayOrders}
            selectedOrderId={cashier.selectedOrderId}
            statusFilter={cashier.statusFilter}
            searchQuery={cashier.searchQuery}
            isLoading={cashier.isLoading}
            shiftSummary={cashier.shiftSummary}
            onSelectOrder={cashier.handleSelectOrder}
            onFilterChange={cashier.setStatusFilter}
            onSearchChange={cashier.setSearchQuery}
          />

          {/* Kolom Kanan: Detail Pesanan & Eksekusi Bayar */}
          <section className="col-span-12 lg:col-span-7 rounded-[12px] border border-line bg-white p-6 shadow-xs">
            {!cashier.selectedOrder ? (
              <div className="py-32 text-center text-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-slate-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-[15px] font-medium text-ink">
                  Belum Ada Pesanan Dipilih
                </p>
                <p className="text-[13px] text-muted mt-1">
                  Pilih salah satu pesanan dari daftar antrean di sebelah kiri.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <CashierOrderDetail
                  selectedOrder={cashier.selectedOrder}
                  selectedOrderItemsByStall={cashier.selectedOrderItemsByStall}
                  stallMap={cashier.stallMap}
                  actionMessage={cashier.actionMessage}
                  onOpenReceipt={cashier.openReceipt}
                  onUpdateItemQty={cashier.handleUpdateItemQty}
                />

                <CashierPaymentSection
                  selectedOrder={cashier.selectedOrder}
                  paymentMethod={cashier.paymentMethod}
                  cashGiven={cashier.cashGiven}
                  changeAmount={cashier.changeAmount}
                  isCashDeficit={cashier.isCashDeficit}
                  isProcessing={cashier.isProcessing}
                  onSelectPaymentMethod={cashier.setPaymentMethod}
                  onChangeCashGiven={cashier.setCashGiven}
                  onConfirmPayment={cashier.handleConfirmPayment}
                  onCancelOrder={cashier.handleCancelOrder}
                  onMarkCompleted={cashier.handleMarkCompleted}
                  onOpenReceipt={cashier.openReceipt}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
