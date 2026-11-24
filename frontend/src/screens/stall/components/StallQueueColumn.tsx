import React from 'react';
import { Pesanan } from '@/models/pesanan';
import { formatCurrency } from '@/utils/formatters';

interface StallQueueColumnProps {
  title: string;
  count: number;
  orders: Pesanan[];
  type: 'waiting' | 'ready' | 'done';
  onComplete?: (id: string) => void;
}

export function StallQueueColumn({
  title,
  count,
  orders,
  type,
  onComplete,
}: StallQueueColumnProps) {
  const isWaiting = type === 'waiting';
  const isReady = type === 'ready';

  const bgColor = isWaiting ? 'bg-amber-50/60 border-amber-200' : isReady ? 'bg-emerald-50/60 border-emerald-200' : 'bg-gray-50 border-gray-200';
  const headerBg = isWaiting ? 'bg-amber-100/70 border-amber-200' : isReady ? 'bg-emerald-100/70 border-emerald-200' : 'bg-gray-100 border-gray-200';
  const dotColor = isWaiting ? 'bg-amber-500' : isReady ? 'bg-emerald-500' : 'bg-gray-400';
  const titleColor = isWaiting ? 'text-amber-900' : isReady ? 'text-emerald-900' : 'text-gray-700';
  const badgeColor = isWaiting ? 'bg-amber-200 text-amber-900' : isReady ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-200 text-gray-700';

  return (
    <div className={`flex flex-col border rounded-xl overflow-hidden min-h-[500px] ${bgColor}`}>
      <div className={`p-3.5 border-b flex items-center justify-between ${headerBg}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <h3 className={`text-sm font-bold ${titleColor}`}>{title}</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {count}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs opacity-60">
            {isWaiting ? 'Tidak ada pesanan menunggu pembayaran' : isReady ? 'Tidak ada pesanan yang perlu dimasak' : 'Belum ada pesanan selesai'}
          </div>
        ) : (
          orders.map((order) => {
            const cardNum = order.nomorKartu || order.cardNumber;
            const time = order.waktuPesan || order.createdAt;

            if (isWaiting) {
              return (
                <div key={order.id} className="p-3.5 bg-white border border-amber-200/80 rounded-lg shadow-xs flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#111827]">
                      Kartu #{cardNum}
                    </span>
                    <span className="text-xs text-[#6B7280]">{time}</span>
                  </div>
                  <div className="border-t border-[#F3F4F6] pt-2 flex flex-col gap-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#374151]">
                          <span className="font-bold text-[#111827]">{item.qty || item.jumlah}x</span>{' '}
                          {item.menuItem?.nama || item.menuItem?.name}
                        </span>
                        {item.notes && <span className="text-xs text-[#9CA3AF] italic">({item.notes})</span>}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-amber-800 font-medium">
                    <span>Belum diproses kasir</span>
                    <span>Total: {formatCurrency(order.total)}</span>
                  </div>
                </div>
              );
            }

            if (isReady) {
              return (
                <div key={order.id} className="p-3.5 bg-white border border-emerald-200 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black px-2.5 py-1 rounded bg-emerald-100 text-emerald-900">
                        Kartu #{cardNum}
                      </span>
                      {order.nomorMeja && (
                        <span className="text-xs text-[#6B7280]">Meja {order.nomorMeja}</span>
                      )}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium">Lunas</span>
                  </div>

                  <div className="border-t border-[#F3F4F6] pt-2 flex flex-col gap-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-[#111827]">
                            <span className="font-bold text-emerald-700 text-sm">{item.qty || item.jumlah}x</span>{' '}
                            {item.menuItem?.nama || item.menuItem?.name}
                          </span>
                        </div>
                        {(item.notes || item.catatan) && (
                          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-0.5 font-medium">
                            Catatan: {item.notes || item.catatan}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {onComplete && (
                    <button
                      onClick={() => onComplete(order.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              );
            }

            // Type done
            return (
              <div key={order.id} className="p-3 bg-white border border-gray-200 rounded-lg opacity-75 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Kartu #{cardNum}</span>
                  <span className="text-xs text-gray-400">{order.id}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {order.items.map((i) => `${i.qty || i.jumlah}x ${i.menuItem?.nama || i.menuItem?.name}`).join(', ')}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
