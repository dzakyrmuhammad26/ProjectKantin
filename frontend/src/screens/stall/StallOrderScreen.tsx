'use client';

import React from 'react';
import { StallNavbar } from '@/components/StallNavbar';
import cartController from '@/controllers/cartController';
import { formatCurrency } from '@/utils/formatters';
import { useStallOrder } from './useStallOrder';
import { StallOrderCart } from './components/StallOrderCart';

export function StallOrderScreen() {
  const {
    daftarGerai,
    geraiAktif,
    menuList,
    isLoading,
    nomorKartu,
    setNomorKartu,
    nomorMeja,
    setNomorMeja,
    cartItems,
    totalCount,
    totalAmount,
    isSubmitting,
    successInfo,
    setSuccessInfo,
    handlePilihGerai,
    handleTambahItem,
    handleKurangItem,
    handleSubmitPesananStan,
  } = useStallOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <StallNavbar
        geraiAktif={geraiAktif}
        daftarGerai={daftarGerai}
        onPilihGerai={handlePilihGerai}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri: Menu Stan */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              Pesan Cepat di Stan {geraiAktif?.nama}
            </h2>
            <p className="text-xs text-[#6B7280]">
              Input pesanan pelanggan yang datang langsung memesan ke stan ini
            </p>
          </div>

          {successInfo && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs sm:text-sm font-medium flex justify-between items-center">
              <span>{successInfo}</span>
              <button
                onClick={() => setSuccessInfo(null)}
                className="text-xs underline font-bold"
              >
                Tutup
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {menuList.map((menu) => {
              const isHabis = menu.isHabis || menu.isSoldOut;
              const qty = cartController.getItemQty(cartItems, menu.id);
              return (
                <div
                  key={menu.id}
                  className={`p-3 bg-white rounded-xl border flex flex-col justify-between gap-2 shadow-xs ${
                    isHabis ? 'border-gray-200 opacity-60' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono text-[#6B7280]">
                      {menu.kode || menu.code}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] line-clamp-1">
                      {menu.nama || menu.name}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-700">
                      {formatCurrency(menu.harga || menu.price)}
                    </p>
                  </div>

                  {isHabis ? (
                    <span className="text-center text-xs text-rose-600 font-bold py-1 bg-rose-50 rounded">
                      Habis
                    </span>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleKurangItem(menu.id)}
                            className="w-6 h-6 rounded bg-[#F3F4F6] text-[#111827] font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{qty}</span>
                          <button
                            onClick={() => handleTambahItem(menu)}
                            className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTambahItem(menu)}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Rincian Pesanan Stan */}
        <StallOrderCart
          nomorKartu={nomorKartu}
          onNomorKartuChange={setNomorKartu}
          nomorMeja={nomorMeja}
          onNomorMejaChange={setNomorMeja}
          cartItems={cartItems}
          totalCount={totalCount}
          totalAmount={totalAmount}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitPesananStan}
        />
      </main>
    </div>
  );
}

export default StallOrderScreen;
