export interface Menu {
  id: string;
  code: string; // contoh: G01-001
  name: string;
  price: number; // integer rupiah
  geraiId: string; // G01, G02, G03, G04
  geraiName: string;
  isSoldOut?: boolean;
  image?: string;
}

export type MenuItem = Menu;

export interface Gerai {
  id: string; // G01, G02, G03, G04
  code: string;
  name: string;
  color: string; // HEX
}

export interface CartItem {
  menuItem: Menu;
  qty: number;
  notes?: string;
}

export type OrderStatus = 'menunggu_bayar' | 'siap_dibuat' | 'selesai' | 'batal';

export interface Order {
  id: string;
  cardNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type StatusType = 'wait' | 'paid' | 'done' | 'cancel';
