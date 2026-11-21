'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar, PageContainer, Input, Tabs, TabItem, MenuCard, CartView } from '@/components';
import { Menu, Stall } from '@/models';
import { menuController, stallController } from '@/controllers';
import { useCart } from '@/context';

function MenuScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data state loaded via controllers
  const [menus, setMenus] = useState<Menu[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pure UI state for filtering & inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('all');
  const [cardError, setCardError] = useState<string | null>(null);

  // Cart state & actions from CartContext
  const {
    cardNumber,
    setCardNumber,
    items,
    addItem,
    removeItem,
    clearCart,
    updateItemNotes,
    itemsByStall,
    totalCount,
    totalAmount,
    getItemQty,
  } = useCart();

  // Load menu and stall data on mount via controllers
  useEffect(() => {
    async function loadData() {
      try {
        const [stallData, menuData] = await Promise.all([
          stallController.getStalls(),
          menuController.getMenus(),
        ]);
        setStalls(stallData);
        setMenus(menuData);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync card number from URL query ?card=
  useEffect(() => {
    const cardParam = searchParams.get('card');
    if (cardParam) {
      setCardNumber(cardParam);
    }
  }, [searchParams, setCardNumber]);

  // Handle card number change and clear error
  const handleCardNumberChange = (val: string) => {
    setCardNumber(val);
    if (cardError && val.trim()) {
      setCardError(null);
    }
  };

  // Build stall tabs using controller data
  const tabList: TabItem[] = useMemo(() => {
    return [
      { id: 'all', label: 'Semua Gerai', count: menus.length },
      ...stalls.map((s) => ({
        id: s.id,
        label: s.name,
        count: menus.filter((m) => m.stallId === s.id).length,
      })),
    ];
  }, [stalls, menus]);

  // Compute filtered menu groups using controller logic
  const filteredData = useMemo(() => {
    return menuController.filterMenus(menus, stalls, searchQuery, activeTabId);
  }, [menus, stalls, searchQuery, activeTabId]);

  // Lookup map for stall metadata
  const stallMap = useMemo(() => {
    return stallController.getStallMap(stalls);
  }, [stalls]);

  // Handle checkout navigation with validation
  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!cardNumber || !cardNumber.trim()) {
      setCardError('Silakan masukkan nomor pelanggan terlebih dahulu.');
      const inputEl = document.getElementById('customer-number-input');
      inputEl?.focus();
      return;
    }
    setCardError(null);
    router.push(`/order/confirm?card=${encodeURIComponent(cardNumber.trim())}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title="Kantin Darren" />

      <PageContainer>
        {isLoading ? (
          <div className="py-20 text-center text-muted">Memuat menu kantin...</div>
        ) : (
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Column: 8 Columns Menu List */}
            <div className="col-span-8 space-y-6">
              {/* Search Bar */}
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

              {/* Stall Category Tabs */}
              <div>
                <Tabs
                  tabs={tabList}
                  activeTab={activeTabId}
                  onChange={(id) => setActiveTabId(id)}
                />
              </div>

              {/* Menu Catalog grouped by Stall */}
              <div className="space-y-8">
                {filteredData.length === 0 ? (
                  <div className="rounded-[12px] border border-line bg-white p-8 text-center">
                    <p className="text-[14px] text-muted">
                      Tidak ada menu yang sesuai dengan pencarian &ldquo;{searchQuery}&rdquo;.
                    </p>
                  </div>
                ) : (
                  filteredData.map(({ stall, menus: stallMenus }) => (
                    <section key={stall.id} className="space-y-3">
                      {/* Stall Header */}
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-4 w-1.5 rounded-full"
                          style={{ backgroundColor: stall.color }}
                        />
                        <h2 className="text-[16px] font-bold text-ink">
                          {stall.name}
                        </h2>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[12px] font-medium text-muted">
                          {stall.code}
                        </span>
                      </div>

                      {/* Menu Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {stallMenus.map((menu) => (
                          <MenuCard
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

            {/* Right Column: 4 Columns Sticky Cart */}
            <div className="col-span-4">
              <CartView
                cardNumber={cardNumber}
                onCardNumberChange={handleCardNumberChange}
                cardError={cardError}
                items={items}
                itemsByStall={itemsByStall}
                stallMap={stallMap}
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
        )}
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
