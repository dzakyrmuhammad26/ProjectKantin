'use client';

import React, { useEffect } from 'react';
import { Navbar, PageContainer, Panel, Button, StatusLabel, RingkasanPesananView } from '@/components';
import { useOrderController } from '@/controllers/useOrderController';

export function SelesaiScreen() {
  const {
    cardNumber,
    completedOrder,
    isOrderLoaded,
    completedOrderItemsByGerai,
    geraiMap,
    checkNoOrderRedirect,
    handleTambahPesanan,
  } = useOrderController();

  useEffect(() => {
    checkNoOrderRedirect();
  }, [checkNoOrderRedirect]);

  if (!isOrderLoaded || !completedOrder) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar title="Kantin Darren" />
        <PageContainer>
          <div className="max-w-[588px] mx-auto py-16 text-center">
            <p className="text-[14px] text-muted">Memeriksa status pesanan...</p>
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
            {/* Header: Judul 'Pesanan terkirim' dan Nomor Kartu Besar (32px bold) */}
            <div className="border-b border-line pb-4 flex items-start justify-between">
              <div>
                <StatusLabel status="wait" label="Menunggu bayar" className="mb-1.5" />
                <h1 className="text-[20px] font-semibold text-ink leading-tight">
                  Pesanan terkirim
                </h1>
                <p className="text-[12px] text-muted mt-1">
                  ID: {completedOrder.id} • {completedOrder.createdAt}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-muted block uppercase tracking-wider font-semibold">
                  Nomor Kartu
                </span>
                <span className="text-[32px] font-bold text-ink leading-tight">
                  {cardNumber ? `No. ${cardNumber}` : '-'}
                </span>
              </div>
            </div>

            {/* Notice Berborder sesuai format PRD & DESIGN.md */}
            <div className="border border-line bg-slate-50 rounded-lg p-4">
              <p className="text-[14px] text-ink leading-relaxed">
                Bayar di kasir dengan menunjukkan kartu{' '}
                <strong className="font-semibold text-brand-700">
                  {cardNumber ? `No. ${cardNumber}` : 'pesanan'}
                </strong>. Pesanan dibuat setelah pembayaran.
              </p>
            </div>

            {/* Ringkasan Pesanan per Gerai */}
            <RingkasanPesananView
              itemsByGerai={completedOrderItemsByGerai}
              geraiMap={geraiMap}
              totalAmount={completedOrder.total}
              totalCount={completedOrder.items.reduce((s, i) => s + i.qty, 0)}
            />

            {/* Tombol Sekunder 'Tambah pesanan' */}
            <div className="pt-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleTambahPesanan}
              >
                Tambah pesanan
              </Button>
            </div>
          </Panel>
        </div>
      </PageContainer>
    </div>
  );
}
