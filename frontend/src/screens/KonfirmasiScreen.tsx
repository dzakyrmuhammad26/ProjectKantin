'use client';

import React, { useEffect } from 'react';
import { Navbar, PageContainer, Panel, Button, RingkasanPesananView } from '@/components';
import { useOrderController } from '@/controllers/useOrderController';

export function KonfirmasiScreen() {
  const {
    cardNumber,
    items,
    itemsByGerai,
    totalAmount,
    totalCount,
    geraiMap,
    isInitialized,
    checkEmptyCartRedirect,
    handleKirimPesanan,
    handleUbahPesanan,
  } = useOrderController();

  useEffect(() => {
    checkEmptyCartRedirect();
  }, [checkEmptyCartRedirect]);

  if (!isInitialized || items.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title="Kantin Darren" />
        <PageContainer>
          <div className="max-w-[588px] mx-auto py-16 text-center">
            <p className="text-[14px] text-muted">Memuat ringkasan pesanan...</p>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title="Kantin Darren" />

      <PageContainer>
        <div className="max-w-[588px] mx-auto">
          <Panel className="p-6 flex flex-col gap-6">
            {/* Header Panel */}
            <div className="border-b border-line pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-[20px] font-semibold text-ink leading-tight">
                  Konfirmasi Pesanan
                </h1>
                <p className="text-[14px] text-muted mt-1">
                  Tagihan {cardNumber ? `Kartu No. ${cardNumber}` : 'Pelanggan'} • {totalCount} item
                </p>
              </div>
              <div className="px-3 py-1 bg-brand-50 border border-brand-700 rounded-lg">
                <span className="text-[13px] font-semibold text-brand-700">
                  {cardNumber ? `No. ${cardNumber}` : 'Pelanggan'}
                </span>
              </div>
            </div>

            {/* Ringkasan Pesanan per Gerai */}
            <RingkasanPesananView
              itemsByGerai={itemsByGerai}
              geraiMap={geraiMap}
              totalAmount={totalAmount}
              totalCount={totalCount}
            />

            {/* Informasi Pembayaran (Notice Box) */}
            <div className="border border-line bg-slate-50 rounded-lg p-4 flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-ink">
                Petunjuk Pembayaran
              </span>
              <p className="text-[13px] text-muted leading-relaxed">
                Pembayaran dilakukan di kasir sentral dengan menunjukkan kartu{' '}
                <strong className="text-ink font-semibold">No. {cardNumber}</strong> (tunai atau QRIS).
                Pesanan akan otomatis diteruskan dan mulai dibuat di masing-masing gerai setelah pembayaran lunas diverifikasi kasir.
              </p>
            </div>

            {/* Dua Tombol Aksi */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleKirimPesanan}
              >
                Kirim pesanan
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleUbahPesanan}
              >
                Ubah pesanan
              </Button>
            </div>
          </Panel>
        </div>
      </PageContainer>
    </div>
  );
}
