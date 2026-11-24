'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { CartItem } from '@/models/pesanan';
import { Menu } from '@/models/menu';
import { storage } from '@/services/storage';
import cartController from '@/controllers/cartController';

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

  // Load initial cart and card from storage once on mount
  useEffect(() => {
    try {
      const savedCard = storage.getCard();
      const savedCart = storage.getCart();
      if (savedCard) setCardNumberState(savedCard);
      if (savedCart && savedCart.length > 0) setItems(savedCart);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to storage
  useEffect(() => {
    if (!isInitialized) return;
    storage.setCard(cardNumber);
    storage.setCart(items);
  }, [cardNumber, items, isInitialized]);

  const setCardNumber = useCallback((num: string) => {
    setCardNumberState((prev) => (prev !== num ? num : prev));
  }, []);

  const addItem = useCallback((menuItem: Menu) => {
    setItems((prev) => cartController.addItem(prev, menuItem));
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => cartController.removeItem(prev, menuItemId));
  }, []);

  const setItemQty = useCallback((menuItemId: string, qty: number) => {
    setItems((prev) => cartController.setItemQty(prev, menuItemId, qty));
  }, []);

  const updateItemNotes = useCallback((menuItemId: string, notes: string) => {
    setItems((prev) => cartController.updateItemNotes(prev, menuItemId, notes));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    storage.clearCart();
  }, []);

  const getItemQty = useCallback(
    (menuItemId: string): number => {
      return cartController.getItemQty(items, menuItemId);
    },
    [items]
  );

  const { totalCount, totalAmount, itemsByStall, totalsByStall } = useMemo(() => {
    return cartController.calculateTotals(items);
  }, [items]);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
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
