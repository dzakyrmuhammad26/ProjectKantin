import { CartItem, Order } from '@/models';

const STORAGE_KEYS = {
  CARD: 'kantin_pos_card',
  CART: 'kantin_pos_cart',
  LAST_ORDER: 'kantin_pos_last_order',
  ORDERS: 'kantin_pos_orders',
} as const;

// Initial sample orders for simulation
const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'TRX-1201',
    cardNumber: '12',
    total: 31000,
    status: 'pending_payment',
    createdAt: '14:05 WIB',
    items: [
      {
        menuItem: {
          id: 'g01-001',
          code: 'G01-001',
          name: 'Pempek Kapal Selam',
          price: 25000,
          stallId: 'G01',
          stallName: 'Pempek Cik Ani',
        },
        qty: 1,
        notes: 'Cuko pedas',
      },
      {
        menuItem: {
          id: 'g04-001',
          code: 'G04-001',
          name: 'Es Teh Manis Jumbo',
          price: 6000,
          stallId: 'G04',
          stallName: 'Es Teh & Jus',
        },
        qty: 1,
      },
    ],
  },
  {
    id: 'TRX-0588',
    cardNumber: '05',
    total: 43000,
    status: 'pending_payment',
    createdAt: '14:12 WIB',
    items: [
      {
        menuItem: {
          id: 'g02-001',
          code: 'G02-001',
          name: 'Mie Celor Spesial Telur',
          price: 28000,
          stallId: 'G02',
          stallName: 'Mie Celor 26',
        },
        qty: 1,
      },
      {
        menuItem: {
          id: 'g04-002',
          code: 'G04-002',
          name: 'Jus Alpukat Keruk',
          price: 15000,
          stallId: 'G04',
          stallName: 'Es Teh & Jus',
        },
        qty: 1,
        notes: 'Gula sedikit saja',
      },
    ],
  },
  {
    id: 'TRX-2741',
    cardNumber: '27',
    total: 70000,
    status: 'ready_to_prepare',
    createdAt: '13:50 WIB',
    payment: {
      method: 'qris',
      amountPaid: 70000,
      change: 0,
      paidAt: '13:52 WIB',
    },
    items: [
      {
        menuItem: {
          id: 'g03-001',
          code: 'G03-001',
          name: 'Nasi Goreng Spesial',
          price: 25000,
          stallId: 'G03',
          stallName: 'Nasi Goreng Bang Rudi',
        },
        qty: 2,
        notes: 'Satu pedas, satu sedang',
      },
      {
        menuItem: {
          id: 'g04-004',
          code: 'G04-004',
          name: 'Es Jeruk Peras',
          price: 10000,
          stallId: 'G04',
          stallName: 'Es Teh & Jus',
        },
        qty: 2,
      },
    ],
  },
];

// Helper to access persistent storage safely (localStorage shared across tabs)
function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || window.sessionStorage;
  } catch {
    return null;
  }
}

export const storage = {
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

  clearCart(): void {
    const s = getStorage();
    if (!s) return;
    try {
      s.removeItem(STORAGE_KEYS.CART);
    } catch {
      // ignore
    }
  },

  // Orders Queue Management for Cashier & Kitchen
  getOrders(): Order[] {
    const s = getStorage();
    if (!s) return INITIAL_MOCK_ORDERS;
    try {
      const data = s.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        // Initialize with mock orders if empty
        s.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_MOCK_ORDERS));
        return INITIAL_MOCK_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  },

  saveOrder(order: Order): void {
    const s = getStorage();
    if (!s) return;
    try {
      const orders = this.getOrders();
      // Prepend so newest is first
      const updated = [order, ...orders.filter((o) => o.id !== order.id)];
      s.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    const s = getStorage();
    if (!s) return null;
    try {
      const orders = this.getOrders();
      let updatedOrder: Order | null = null;

      const updatedList = orders.map((o) => {
        if (o.id === orderId) {
          updatedOrder = { ...o, ...updates };
          return updatedOrder;
        }
        return o;
      });

      s.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedList));
      return updatedOrder;
    } catch {
      return null;
    }
  },
};
