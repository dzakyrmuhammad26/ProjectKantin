import { CartItem, Order } from '@/models/pesanan';
import { Menu } from '@/models/menu';
import { Gerai } from '@/models/gerai';
import { Pengguna } from '@/models/pengguna';
import { SesiPelanggan } from '@/models/sesi';
import { DetailPembayaran } from '@/models/pembayaran';
import { DAFTAR_PESANAN_AWAL } from '@/data/pesananData';
import { DAFTAR_MENU } from '@/data/menuData';
import { DAFTAR_GERAI } from '@/data/geraiData';
import { DAFTAR_PENGGUNA } from '@/data/penggunaData';
import { DAFTAR_SESI_KARTU } from '@/data/sesiData';

const STORAGE_KEYS = {
  CARD: 'kantin_pos_card',
  CART: 'kantin_pos_cart',
  LAST_ORDER: 'kantin_pos_last_order',
  ORDERS: 'kantin_pos_orders',
  MENUS: 'kantin_pos_menus',
  GERAI: 'kantin_pos_gerai',
  PENGGUNA: 'kantin_pos_pengguna',
  SESI: 'kantin_pos_sesi',
  PEMBAYARAN: 'kantin_pos_pembayaran',
  CURRENT_USER: 'kantin_pos_current_user',
} as const;

// Helper to access persistent storage safely
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

  // --- PESANAN (KASIR, DAPUR GERAI, PELANGGAN) ---
  getOrders(): Order[] {
    const s = getStorage();
    if (!s) return DAFTAR_PESANAN_AWAL;
    try {
      const data = s.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        s.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DAFTAR_PESANAN_AWAL));
        return DAFTAR_PESANAN_AWAL;
      }
      return JSON.parse(data);
    } catch {
      return DAFTAR_PESANAN_AWAL;
    }
  },

  saveOrder(order: Order): void {
    const s = getStorage();
    if (!s) return;
    try {
      const orders = this.getOrders();
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

  // --- MENU (CRUD OLEH GERAI & SUPERADMIN) ---
  getMenus(): Menu[] {
    const s = getStorage();
    if (!s) return DAFTAR_MENU;
    try {
      const data = s.getItem(STORAGE_KEYS.MENUS);
      if (!data) {
        s.setItem(STORAGE_KEYS.MENUS, JSON.stringify(DAFTAR_MENU));
        return DAFTAR_MENU;
      }
      return JSON.parse(data);
    } catch {
      return DAFTAR_MENU;
    }
  },

  saveMenu(menu: Menu): void {
    const s = getStorage();
    if (!s) return;
    try {
      const menus = this.getMenus();
      const existingIdx = menus.findIndex((m) => m.id === menu.id);
      let updated: Menu[];
      if (existingIdx > -1) {
        updated = menus.map((m) => (m.id === menu.id ? menu : m));
      } else {
        updated = [...menus, menu];
      }
      s.setItem(STORAGE_KEYS.MENUS, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  updateMenu(id: string, updates: Partial<Menu>): Menu | null {
    const s = getStorage();
    if (!s) return null;
    try {
      const menus = this.getMenus();
      let updatedMenu: Menu | null = null;
      const updatedList = menus.map((m) => {
        if (m.id === id) {
          updatedMenu = { ...m, ...updates };
          return updatedMenu;
        }
        return m;
      });
      s.setItem(STORAGE_KEYS.MENUS, JSON.stringify(updatedList));
      return updatedMenu;
    } catch {
      return null;
    }
  },

  // --- GERAI (SUPERADMIN) ---
  getGerai(): Gerai[] {
    const s = getStorage();
    if (!s) return DAFTAR_GERAI;
    try {
      const data = s.getItem(STORAGE_KEYS.GERAI);
      if (!data) {
        s.setItem(STORAGE_KEYS.GERAI, JSON.stringify(DAFTAR_GERAI));
        return DAFTAR_GERAI;
      }
      return JSON.parse(data);
    } catch {
      return DAFTAR_GERAI;
    }
  },

  saveGerai(gerai: Gerai): void {
    const s = getStorage();
    if (!s) return;
    try {
      const list = this.getGerai();
      const existingIdx = list.findIndex((g) => g.id === gerai.id);
      let updated: Gerai[];
      if (existingIdx > -1) {
        updated = list.map((g) => (g.id === gerai.id ? gerai : g));
      } else {
        updated = [...list, gerai];
      }
      s.setItem(STORAGE_KEYS.GERAI, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // --- PENGGUNA & AUTH STAF ---
  getPengguna(): Pengguna[] {
    const s = getStorage();
    if (!s) return DAFTAR_PENGGUNA;
    try {
      const data = s.getItem(STORAGE_KEYS.PENGGUNA);
      if (!data) {
        s.setItem(STORAGE_KEYS.PENGGUNA, JSON.stringify(DAFTAR_PENGGUNA));
        return DAFTAR_PENGGUNA;
      }
      return JSON.parse(data);
    } catch {
      return DAFTAR_PENGGUNA;
    }
  },

  savePengguna(pengguna: Pengguna): void {
    const s = getStorage();
    if (!s) return;
    try {
      const list = this.getPengguna();
      const existingIdx = list.findIndex((p) => p.id === pengguna.id);
      let updated: Pengguna[];
      if (existingIdx > -1) {
        updated = list.map((p) => (p.id === pengguna.id ? pengguna : p));
      } else {
        updated = [...list, pengguna];
      }
      s.setItem(STORAGE_KEYS.PENGGUNA, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

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

  // --- SESI KARTU PELANGGAN ---
  getSesi(): SesiPelanggan[] {
    const s = getStorage();
    if (!s) return DAFTAR_SESI_KARTU;
    try {
      const data = s.getItem(STORAGE_KEYS.SESI);
      if (!data) {
        s.setItem(STORAGE_KEYS.SESI, JSON.stringify(DAFTAR_SESI_KARTU));
        return DAFTAR_SESI_KARTU;
      }
      return JSON.parse(data);
    } catch {
      return DAFTAR_SESI_KARTU;
    }
  },

  saveSesi(sesi: SesiPelanggan): void {
    const s = getStorage();
    if (!s) return;
    try {
      const list = this.getSesi();
      const updated = [sesi, ...list.filter((x) => x.id !== sesi.id)];
      s.setItem(STORAGE_KEYS.SESI, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  updateSesi(idSesi: string, updates: Partial<SesiPelanggan>): SesiPelanggan | null {
    const s = getStorage();
    if (!s) return null;
    try {
      const list = this.getSesi();
      let updatedSesi: SesiPelanggan | null = null;
      const updatedList = list.map((item) => {
        if (item.id === idSesi) {
          updatedSesi = { ...item, ...updates };
          return updatedSesi;
        }
        return item;
      });
      s.setItem(STORAGE_KEYS.SESI, JSON.stringify(updatedList));
      return updatedSesi;
    } catch {
      return null;
    }
  },

  // --- RIWAYAT PEMBAYARAN KASIR ---
  getPembayaran(): DetailPembayaran[] {
    const s = getStorage();
    if (!s) return [];
    try {
      const data = s.getItem(STORAGE_KEYS.PEMBAYARAN);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePembayaran(pembayaran: DetailPembayaran): void {
    const s = getStorage();
    if (!s) return;
    try {
      const list = this.getPembayaran();
      s.setItem(STORAGE_KEYS.PEMBAYARAN, JSON.stringify([pembayaran, ...list]));
    } catch {
      // ignore
    }
  },
};
