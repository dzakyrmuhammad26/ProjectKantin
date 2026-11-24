import React from 'react';
import { CartView } from '@/components/CartView';
import { CartItem } from '@/models/pesanan';
import { Stall } from '@/models/gerai';
import { Menu } from '@/models/menu';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cardNumber: string;
  onCardNumberChange: (num: string) => void;
  cardError: string | null;
  items: CartItem[];
  itemsByStall: Record<string, CartItem[]>;
  stallMap: Map<string, Stall>;
  totalCount: number;
  totalAmount: number;
  onCheckout: () => void;
  onClearCart: () => void;
  onIncrement: (menu: Menu) => void;
  onDecrement: (menuId: string) => void;
  onUpdateNotes: (menuId: string, notes: string) => void;
}

export function MobileCartDrawer({
  isOpen,
  onClose,
  cardNumber,
  onCardNumberChange,
  cardError,
  items,
  itemsByStall,
  stallMap,
  totalCount,
  totalAmount,
  onCheckout,
  onClearCart,
  onIncrement,
  onDecrement,
  onUpdateNotes,
}: MobileCartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <CartView
          cardNumber={cardNumber}
          onCardNumberChange={onCardNumberChange}
          cardError={cardError}
          items={items}
          itemsByStall={itemsByStall}
          stallMap={stallMap}
          totalCount={totalCount}
          totalAmount={totalAmount}
          onCheckout={onCheckout}
          onClearCart={onClearCart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onUpdateNotes={onUpdateNotes}
          isDrawer
          onClose={onClose}
        />
      </div>
    </div>
  );
}
