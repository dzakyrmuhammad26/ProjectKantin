'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageContainer } from '@/components/PageContainer';
import { CartView } from '@/components/CartView';
import { useCustomerMenu } from './useCustomerMenu';
import { MenuCatalog } from './components/MenuCatalog';
import { MobileCartBar } from './components/MobileCartBar';
import { MobileCartDrawer } from './components/MobileCartDrawer';

function MenuScreenContent() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTabId,
    setActiveTabId,
    cardError,
    isMobileCartOpen,
    setIsMobileCartOpen,
    cart,
    tabList,
    filteredData,
    stallMap,
    handleCardNumberChange,
    handleCheckout,
  } = useCustomerMenu();

  return (
    <div className="min-h-screen bg-surface">
      <Navbar title="Kantin Darren" cardNumber={cart.cardNumber} />

      <PageContainer>
        {isLoading ? (
          <div className="py-20 text-center text-muted">Memuat menu kantin...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Menu Catalog (Full width on mobile/tablet, 8 cols on desktop) */}
            <MenuCatalog
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              tabs={tabList}
              activeTabId={activeTabId}
              onTabChange={setActiveTabId}
              filteredData={filteredData}
              getItemQty={cart.getItemQty}
              onAddItem={cart.addItem}
              onRemoveItem={cart.removeItem}
            />

            {/* Right Column: Desktop Sticky Cart (Hidden on mobile/tablet < 1024px) */}
            <div className="hidden lg:block lg:col-span-4">
              <CartView
                cardNumber={cart.cardNumber}
                onCardNumberChange={handleCardNumberChange}
                cardError={cardError}
                items={cart.items}
                itemsByStall={cart.itemsByStall}
                stallMap={stallMap}
                totalCount={cart.totalCount}
                totalAmount={cart.totalAmount}
                onCheckout={handleCheckout}
                onClearCart={cart.clearCart}
                onIncrement={cart.addItem}
                onDecrement={cart.removeItem}
                onUpdateNotes={cart.updateItemNotes}
              />
            </div>
          </div>
        )}
      </PageContainer>

      {/* Floating Bottom Cart Bar for Mobile & Tablet */}
      <MobileCartBar
        totalCount={cart.totalCount}
        totalAmount={cart.totalAmount}
        cardNumber={cart.cardNumber}
        onOpenDrawer={() => setIsMobileCartOpen(true)}
      />

      {/* Slide-up Cart Drawer Modal for Mobile & Tablet */}
      <MobileCartDrawer
        isOpen={isMobileCartOpen}
        onClose={() => setIsMobileCartOpen(false)}
        cardNumber={cart.cardNumber}
        onCardNumberChange={handleCardNumberChange}
        cardError={cardError}
        items={cart.items}
        itemsByStall={cart.itemsByStall}
        stallMap={stallMap}
        totalCount={cart.totalCount}
        totalAmount={cart.totalAmount}
        onCheckout={handleCheckout}
        onClearCart={cart.clearCart}
        onIncrement={cart.addItem}
        onDecrement={cart.removeItem}
        onUpdateNotes={cart.updateItemNotes}
      />
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

export default MenuScreen;
