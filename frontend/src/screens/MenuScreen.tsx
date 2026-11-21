'use client';

import React, { Suspense } from 'react';
import { Navbar, PageContainer, Input, Tabs, KartuMenu, KeranjangView } from '@/components';
import { useMenuController } from '@/controllers/useMenuController';

function MenuScreenContent() {
  const {
    cardNumber,
    searchQuery,
    setSearchQuery,
    activeTabId,
    setActiveTabId,
    tabList,
    filteredData,
    geraiMap,
    items,
    itemsByGerai,
    totalCount,
    totalAmount,
    getItemQty,
    addItem,
    removeItem,
    clearCart,
    updateItemNotes,
    handleCardNumberChange,
    cardError,
    handleCheckout,
  } = useMenuController();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title="Kantin Darren" />

      <PageContainer>
        {/* Layout 12 Kolom: 8 kolom konten kiri, 4 kolom keranjang kanan */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: 8 Kolom */}
          <div className="col-span-8 space-y-6">
            {/* Baris Pencarian: Input 48px dengan ikon pencarian */}
            <div>
              <Input
                type="text"
                placeholder="Cari menu atau nama gerai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
            </div>

            {/* Tab Kategori Gerai: Teks dengan garis bawah 2px teal */}
            <div>
              <Tabs
                tabs={tabList}
                activeTab={activeTabId}
                onChange={(id) => setActiveTabId(id)}
              />
            </div>

            {/* Katalog Menu per Gerai */}
            <div className="space-y-8">
              {filteredData.length === 0 ? (
                <div className="rounded-[12px] border border-line bg-white p-8 text-center">
                  <p className="text-[14px] text-muted">
                    Tidak ada menu yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
                  </p>
                </div>
              ) : (
                filteredData.map(({ gerai, menus }) => (
                  <section key={gerai.id} className="space-y-3">
                    {/* Header Gerai: Batang vertikal 6px warna gerai + Nama + Kode */}
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-1.5 rounded-full"
                        style={{ backgroundColor: gerai.color }}
                      />
                      <h2 className="text-[16px] font-bold text-ink">
                        {gerai.name}
                      </h2>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px] font-medium text-muted">
                        {gerai.code}
                      </span>
                    </div>

                    {/* Grid Menu: 2 kolom horizontal cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {menus.map((menu) => (
                        <KartuMenu
                          key={menu.id}
                          item={menu}
                          qty={getItemQty(menu.id)}
                          onIncrement={() => addItem(menu)}
                          onDecrement={() => removeItem(menu.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>

          {/* Kolom Kanan: 4 Kolom Keranjang Sticky */}
          <div className="col-span-4">
            <KeranjangView
              cardNumber={cardNumber}
              onCardNumberChange={handleCardNumberChange}
              cardError={cardError}
              items={items}
              itemsByGerai={itemsByGerai}
              geraiMap={geraiMap}
              totalCount={totalCount}
              totalAmount={totalAmount}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
              onIncrement={addItem}
              onDecrement={removeItem}
              onUpdateNotes={updateItemNotes}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export function MenuScreen() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Memuat...</div>}>
      <MenuScreenContent />
    </Suspense>
  );
}
