import { CartItem, Order } from './types';

const STORAGE_KEYS = {
  CARD: 'kantin_pos_card',
  CART: 'kantin_pos_cart',
  LAST_ORDER: 'kantin_pos_last_order',
} as const;

export const storage = {
  getCard(): string {
    if (typeof window === 'undefined') return '';
    try {
      return sessionStorage.getItem(STORAGE_KEYS.CARD)?.trim() || '';
    } catch {
      return '';
    }
  },

  setCard(num: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.CARD, num.trim());
    } catch {
      // ignore
    }
  },

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getLastOrder(): Order | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.LAST_ORDER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setLastOrder(order: Order): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(order));
    } catch {
      // ignore
    }
  },

  clearCart(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CART);
    } catch {
      // ignore
    }
  },
};
