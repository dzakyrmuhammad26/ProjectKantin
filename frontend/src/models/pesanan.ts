import { Menu } from './menu';
import { DetailPembayaran } from './pembayaran';

/**
 * Model Pesanan dan Item Pesanan (Bahasa Indonesia)
 */

export type StatusPesanan =
  | 'menunggu_bayar'
  | 'siap_dibuat'
  | 'selesai'
  | 'batal'
  | 'pending_payment'
  | 'ready_to_prepare'
  | 'completed'
  | 'cancelled';

export type SumberPesanan = 'pelanggan' | 'gerai' | 'kasir';

export interface ItemPesanan {
  menu?: Menu;
  jumlah?: number;
  catatan?: string;
  hargaSaatItu?: number;
  subtotal?: number;

  // Kompatibilitas kode lama
  menuItem: Menu;
  qty: number;
  notes?: string;
}

export interface Pesanan {
  id: string;
  idSesi?: string;
  nomorKartu: string;
  cardNumber: string;
  nomorMeja?: number;
  idGerai?: string;
  namaGerai?: string;
  status: StatusPesanan;
  sumber?: SumberPesanan;
  items: ItemPesanan[];
  total: number;
  waktuPesan?: string;
  createdAt?: string;
  catatan?: string;
  pembayaran?: DetailPembayaran;
  payment?: DetailPembayaran;
}

// Aliases untuk kompatibilitas kode lama
export type CartItem = ItemPesanan;
export type Order = Pesanan;
export type OrderStatus = StatusPesanan;
export type StatusType =
  | 'wait'
  | 'paid'
  | 'done'
  | 'cancel'
  | 'menunggu'
  | 'lunas'
  | 'selesai'
  | 'batal';
