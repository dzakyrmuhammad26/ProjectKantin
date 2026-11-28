import React from 'react';
import { Order, OrderStatus } from '@/models/pesanan';
import { Input } from '@/components/Input';
import { StatusLabel } from '@/components/StatusLabel';
import { formatCurrency } from '@/utils/formatters';
import { isPending, isReady, isCompleted } from '../useCashier';

interface CashierOrderListProps {
  orders: Order[];
  displayOrders: Order[];
  selectedOrderId: string | null;
  statusFilter: 'all' | OrderStatus;
  searchQuery: string;
  isLoading: boolean;
  shiftSummary: {
    pendingCount: number;
    paidCount: number;
  };
  onSelectOrder: (order: Order) => void;
  onFilterChange: (status: 'all' | OrderStatus) => void;
  onSearchChange: (query: string) => void;
}

export function CashierOrderList({
  orders,
  displayOrders,
  selectedOrderId,
  statusFilter,
  searchQuery,
  isLoading,
  shiftSummary,
  onSelectOrder,
  onFilterChange,
  onSearchChange,
}: CashierOrderListProps) {
  return (
    <section className="col-span-12 lg:col-span-5 rounded-[12px] border border-line bg-white shadow-xs">
      {/* Search Input & Status Filters */}
      <div className="border-b border-line p-4 space-y-3">
        <Input
          type="text"
          placeholder="Cari No. Kartu (cth: 12) atau ID pesanan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
        />

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[13px]">
          <button
            type="button"
            onClick={() => onFilterChange('menunggu_bayar')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              isPending(statusFilter)
                ? 'bg-brand-700 text-white'
                : 'bg-slate-100 text-ink hover:bg-slate-200'
            }`}
          >
            Menunggu ({shiftSummary.pendingCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('siap_dibuat')}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              isReady(statusFilter)
                ? 'bg-brand-700 text-white'
                : 'bg-slate-100 text-ink hover:bg-slate-200'
            }`}
          >
            Siap Dibuat ({shiftSummary.paidCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('all')}
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
          <div className="p-2 flex flex-col gap-2 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-lg border border-line bg-white flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-24 rounded-full bg-gray-100" />
                </div>
                <div className="h-3.5 w-36 rounded bg-gray-100" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-3 w-16 rounded bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-200" />
                </div>
              </div>
            ))}
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
                onClick={() => onSelectOrder(order)}
                className={`cursor-pointer rounded-lg p-3.5 transition-all my-1 ${
                  isSelected
                    ? 'border border-brand-700 bg-brand-50/40 shadow-xs'
                    : 'border border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-brand-700 px-2 py-0.5 text-[14px] font-bold text-white">
                      No. {order.cardNumber || order.nomorKartu}
                    </span>
                    <span className="text-[12px] text-muted font-mono">
                      {order.id}
                    </span>
                  </div>
                  <span className="text-[12px] text-muted font-medium">
                    {order.createdAt || order.waktuPesan}
                  </span>
                </div>

                {/* Items Summary Preview */}
                <p className="mt-2 text-[13px] text-ink line-clamp-1">
                  {order.items
                    .map((i) => `${i.qty}x ${i.menuItem.name || i.menuItem.nama}`)
                    .join(', ')}
                </p>

                <div className="mt-2.5 flex items-center justify-between pt-1">
                  <span className="font-mono text-[15px] font-bold text-ink">
                    {formatCurrency(order.total)}
                  </span>
                  <StatusLabel
                    status={
                      isPending(order.status)
                        ? 'wait'
                        : isReady(order.status)
                        ? 'paid'
                        : isCompleted(order.status)
                        ? 'done'
                        : 'cancel'
                    }
                    label={
                      isPending(order.status)
                        ? 'Menunggu Bayar'
                        : isReady(order.status)
                        ? 'Siap Dibuat'
                        : isCompleted(order.status)
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
  );
}
