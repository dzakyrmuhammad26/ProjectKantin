'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, Menu } from '@/models';
import { storage } from '@/services';
import { cartController } from '@/controllers';

export interface CartContextType {
  cardNumber: string;
  setCardNumber: (num: string) => void;
  items: CartItem[];
  addItem: (menuItem: Menu) => void;
  removeItem: (menuItemId: string) => void;
  setItemQty: (menuItemId: string, qty: number) => void;
  updateItemNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;
  getItemQty: (menuItemId: string) => number;
  itemsByStall: Record<string, CartItem[]>;
  totalsByStall: Record<string, number>;
  totalCount: number;
  totalAmount: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cardNumber, setCardNumberState] = useState<string>('');
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from storage or URL param on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlCard = params.get('card');

        if (urlCard && urlCard.trim()) {
          const cleanCard = urlCard.trim();
          setCardNumberState(cleanCard);
          storage.setCard(cleanCard);
        } else {
          const saved = storage.getCard();
          if (saved && saved !== '23') {
            setCardNumberState(saved);
          } else {
            setCardNumberState('');
            storage.setCard('');
          }
        }

        setItems(storage.getCart());
      }
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state changes with persistence storage
  useEffect(() => {
    if (!isInitialized) return;
    storage.setCard(cardNumber);
    storage.setCart(items);
  }, [cardNumber, items, isInitialized]);

  const setCardNumber = (num: string) => {
    setCardNumberState(num);
  };

  const addItem = (menuItem: Menu) => {
    setItems((prev) => cartController.addItem(prev, menuItem));
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => cartController.removeItem(prev, menuItemId));
  };

  const setItemQty = (menuItemId: string, qty: number) => {
    setItems((prev) => cartController.setItemQty(prev, menuItemId, qty));
  };

  const updateItemNotes = (menuItemId: string, notes: string) => {
    setItems((prev) => cartController.updateItemNotes(prev, menuItemId, notes));
  };

  const clearCart = () => {
    setItems([]);
    storage.clearCart();
  };

  const getItemQty = (menuItemId: string): number => {
    return cartController.getItemQty(items, menuItemId);
  };

  // Derive cart totals using controller
  const { totalCount, totalAmount, itemsByStall, totalsByStall } = useMemo(() => {
    return cartController.calculateTotals(items);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        cardNumber,
        setCardNumber,
        items,
        addItem,
        removeItem,
        setItemQty,
        updateItemNotes,
        clearCart,
        getItemQty,
        itemsByStall,
        totalsByStall,
        totalCount,
        totalAmount,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
