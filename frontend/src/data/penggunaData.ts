import { Pengguna } from '@/models/pengguna';

/**
 * Data Pengguna dan Staf Sistem POS Kantin
 * Mencakup 4 Role: Superadmin, Kasir, User Gerai, dan Pelanggan (Guest)
 */
export const DAFTAR_PENGGUNA: Pengguna[] = [
  // Superadmin (Pemilik / Pengelola Kantin)
  {
    id: 'USR-ADMIN-01',
    nama: 'Pak Hendra (Pemilik)',
    username: 'admin',
    pin: '123456',
    peran: 'superadmin',
    aktif: true,
  },

  // Kasir Sentral
  {
    id: 'USR-KASIR-01',
    nama: 'Siti Rahma (Kasir)',
    username: 'kasir',
    pin: '112233',
    peran: 'kasir',
    aktif: true,
  },

  // User Gerai G01
  {
    id: 'USR-GERAI-G01',
    nama: 'Cik Ani (Pempek)',
    username: 'pempek',
    pin: '1111',
    peran: 'gerai',
    idGerai: 'G01',
    aktif: true,
  },

  // User Gerai G02
  {
    id: 'USR-GERAI-G02',
    nama: 'Kang Asep (Mie Celor)',
    username: 'miecelor',
    pin: '2222',
    peran: 'gerai',
    idGerai: 'G02',
    aktif: true,
  },

  // User Gerai G03
  {
    id: 'USR-GERAI-G03',
    nama: 'Bang Rudi (Nasi Goreng)',
    username: 'nasgor',
    pin: '3333',
    peran: 'gerai',
    idGerai: 'G03',
    aktif: true,
  },

  // User Gerai G04
  {
    id: 'USR-GERAI-G04',
    nama: 'Mbak Dewi (Es Teh & Jus)',
    username: 'esteh',
    pin: '4444',
    peran: 'gerai',
    idGerai: 'G04',
    aktif: true,
  },
];
