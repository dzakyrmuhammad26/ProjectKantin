import { CartItem, Order } from '@/models/pesanan';
import { Pengguna } from '@/models/pengguna';

const STORAGE_KEYS = {
  CARD: 'kantin_pos_card',
  CART: 'kantin_pos_cart',
  LAST_ORDER: 'kantin_pos_last_order',
  CURRENT_USER: 'kantin_pos_current_user',
} as const;

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || window.sessionStorage;
  } catch {
    return null;
  }
}

export const storage = {
  // --- KARTU & KERANJANG PELANGGAN ---
  getCard(): string {
    const s = getStorage();
    if (!s) return '';
    try {
      return s.getItem(STORAGE_KEYS.CARD)?.trim() || '';
    } catch {
      return '';
    }
  },

  setCard(num: string): void {
    const s = getStorage();
    if (!s) return;
    try {
      s.setItem(STORAGE_KEYS.CARD, num.trim());
    } catch {
      // ignore
    }
  },

  getCart(): CartItem[] {
    const s = getStorage();
    if (!s) return [];
    try {
      const data = s.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(items: CartItem[]): void {
    const s = getStorage();
    if (!s) return;
    try {
      s.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  clearCart(): void {
    const s = getStorage();
    if (!s) return;
    try {
      s.removeItem(STORAGE_KEYS.CART);
    } catch {
      // ignore
    }
  },

  getLastOrder(): Order | null {
    const s = getStorage();
    if (!s) return null;
    try {
      const data = s.getItem(STORAGE_KEYS.LAST_ORDER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setLastOrder(order: Order): void {
    const s = getStorage();
    if (!s) return;
    try {
      s.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(order));
    } catch {
      // ignore
    }
  },

  // --- SESI PENGGUNA (CACHE CLIENT) ---
  getCurrentUser(): Pengguna | null {
    const s = getStorage();
    if (!s) return null;
    try {
      const data = s.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: Pengguna | null): void {
    const s = getStorage();
    if (!s) return;
    try {
      if (!user) {
        s.removeItem(STORAGE_KEYS.CURRENT_USER);
      } else {
        s.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  },
};
