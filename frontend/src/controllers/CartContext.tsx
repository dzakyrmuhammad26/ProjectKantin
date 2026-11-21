'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, Menu } from '@/models/types';
import { storage } from '@/models/storage';

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
  getTotalByGerai: (geraiId: string) => number;
  totalsByGerai: Record<string, number>;
  totalCount: number;
  totalAmount: number;
  itemsByGerai: Record<string, CartItem[]>;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cardNumber, setCardNumberState] = useState<string>('');
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from URL params or storage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlCard = params.get('kartu');

        if (urlCard && urlCard.trim()) {
          const cleanCard = urlCard.trim();
          setCardNumberState(cleanCard);
          storage.setCard(cleanCard);
        } else {
          // If storage had old '23' default, purge it so field is clean and empty
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

  // Sync to storage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    storage.setCard(cardNumber);
    storage.setCart(items);
  }, [cardNumber, items, isInitialized]);

  const setCardNumber = (num: string) => {
    setCardNumberState(num);
  };

  const addItem = (menuItem: Menu) => {
    if (menuItem.isSoldOut) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { menuItem, qty: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItemId);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter((item) => item.menuItem.id !== menuItemId);
      }
      return prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, qty: item.qty - 1 } : item
      );
    });
  };

  const setItemQty = (menuItemId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item.menuItem.id !== menuItemId);
      }
      return prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, qty } : item
      );
    });
  };

  const updateItemNotes = (menuItemId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    storage.clearCart();
  };

  const getItemQty = (menuItemId: string): number => {
    const item = items.find((i) => i.menuItem.id === menuItemId);
    return item ? item.qty : 0;
  };

  const itemsByGerai = useMemo(() => {
    const grouped: Record<string, CartItem[]> = {};
    items.forEach((item) => {
      const gId = item.menuItem.geraiId;
      if (!grouped[gId]) {
        grouped[gId] = [];
      }
      grouped[gId].push(item);
    });
    return grouped;
  }, [items]);

  const totalsByGerai = useMemo(() => {
    const totals: Record<string, number> = {};
    items.forEach((item) => {
      const gId = item.menuItem.geraiId;
      totals[gId] = (totals[gId] || 0) + item.menuItem.price * item.qty;
    });
    return totals;
  }, [items]);

  const getTotalByGerai = (geraiId: string): number => {
    return totalsByGerai[geraiId] || 0;
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.menuItem.price * item.qty, 0);
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
        getTotalByGerai,
        totalsByGerai,
        totalCount,
        totalAmount,
        itemsByGerai,
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
