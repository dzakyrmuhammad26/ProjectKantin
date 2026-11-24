import { Gerai } from '@/models/gerai';

/**
 * Daftar Gerai Kantin (Bahasa Indonesia)
 * Catatan: Tanpa rental mode / model sewa di dalam gerai.
 */
export const DAFTAR_GERAI: Gerai[] = [
  {
    id: 'G01',
    kode: 'G01',
    nama: 'Pempek Cik Ani',
    penyewa: 'Cik Ani',
    warna: '#F97316', // Orange
    aktif: true,
    code: 'G01',
    name: 'Pempek Cik Ani',
    color: '#F97316',
  },
  {
    id: 'G02',
    kode: 'G02',
    nama: 'Mie Celor 26',
    penyewa: 'Kang Asep',
    warna: '#F43F5E', // Rose
    aktif: true,
    code: 'G02',
    name: 'Mie Celor 26',
    color: '#F43F5E',
  },
  {
    id: 'G03',
    kode: 'G03',
    nama: 'Nasi Goreng Bang Rudi',
    penyewa: 'Bang Rudi',
    warna: '#9333EA', // Purple
    aktif: true,
    code: 'G03',
    name: 'Nasi Goreng Bang Rudi',
    color: '#9333EA',
  },
  {
    id: 'G04',
    kode: 'G04',
    nama: 'Es Teh & Jus',
    penyewa: 'Mbak Dewi',
    warna: '#059669', // Emerald
    aktif: true,
    code: 'G04',
    name: 'Es Teh & Jus',
    color: '#059669',
  },
];

// Alias untuk kompatibilitas kode lama
export const STALL_LIST = DAFTAR_GERAI;
