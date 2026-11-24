/**
 * Model Menu Makanan & Minuman (Bahasa Indonesia)
 */

export interface Menu {
  id: string;
  kode: string; // e.g. 'G01-001'
  nama: string;
  harga: number; // Integer rupiah
  idGerai: string; // 'G01', 'G02', 'G03', 'G04'
  namaGerai: string;
  kategori?: 'makanan' | 'minuman' | 'camilan';
  foto?: string;
  urutan?: number;
  isFavorit?: boolean;
  isHabis?: boolean;
  aktif?: boolean;

  // Properti alias untuk kompatibilitas kode lama
  code: string;
  name: string;
  price: number;
  stallId: string;
  stallName: string;
  image?: string;
  isSoldOut?: boolean;
}

export type ItemMenu = Menu;
export type MenuItem = Menu;
