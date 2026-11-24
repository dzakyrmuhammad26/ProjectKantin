import React from 'react';
import { CartItem } from '@/models/pesanan';
import { formatCurrency } from '@/utils/formatters';

interface StallOrderCartProps {
  nomorKartu: string;
  onNomorKartuChange: (val: string) => void;
  nomorMeja: string;
  onNomorMejaChange: (val: string) => void;
  cartItems: CartItem[];
  totalCount: number;
  totalAmount: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function StallOrderCart({
  nomorKartu,
  onNomorKartuChange,
  nomorMeja,
  onNomorMejaChange,
  cartItems,
  totalCount,
  totalAmount,
  isSubmitting,
  onSubmit,
}: StallOrderCartProps) {
  return (
    <div className="w-full lg:w-80 bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-4 h-fit">
      <h3 className="text-sm font-bold text-[#111827] border-b border-[#E5E7EB] pb-2">
        Rincian Pesanan Stan
      </h3>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">
            Nomor Kartu Fisik (1 - 99)*
          </label>
          <input
            type="number"
            min={1}
            max={99}
            placeholder="Contoh: 14"
            value={nomorKartu}
            onChange={(e) => onNomorKartuChange(e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">
            Nomor Meja (Opsional)
          </label>
          <input
            type="number"
            placeholder="Contoh: 5"
            value={nomorMeja}
            onChange={(e) => onNomorMejaChange(e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-1.5 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Item List */}
      <div className="border-t border-[#F3F4F6] pt-2 flex flex-col gap-2 max-h-48 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-xs text-[#9CA3AF] text-center py-4">
            Belum ada menu yang dipilih
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item.menuItem.id} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[#111827]">{item.qty}x</span>{' '}
                <span>{item.menuItem.nama || item.menuItem.name}</span>
              </div>
              <span className="font-semibold text-emerald-700">
                {formatCurrency((item.menuItem.harga || item.menuItem.price) * item.qty)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#E5E7EB] pt-3 flex flex-col gap-1">
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>Total Porsi</span>
          <span>{totalCount} item</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-[#111827]">
          <span>Total Tagihan</span>
          <span className="text-emerald-700">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || cartItems.length === 0}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors disabled:opacity-50 shadow-xs"
      >
        {isSubmitting ? 'Mengirim Pesanan...' : 'Simpan Pesanan Stan'}
      </button>
    </div>
  );
}
