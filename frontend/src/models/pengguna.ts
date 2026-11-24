/**
 * Model Pengguna (User) dan Peran (Role) Sistem POS Kantin
 */

export type PeranPengguna = 'superadmin' | 'kasir' | 'gerai' | 'pelanggan';

export interface Pengguna {
  id: string;
  nama: string;
  username: string;
  pin: string; // PIN 4-6 digit untuk login cepat
  peran: PeranPengguna;
  idGerai?: string; // Khusus untuk peran 'gerai' (misal: 'G01')
  aktif: boolean;
}

// Alias untuk kompatibilitas
export type UserRole = PeranPengguna;
export type User = Pengguna;
