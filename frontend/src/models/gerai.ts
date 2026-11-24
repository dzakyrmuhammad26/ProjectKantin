/**
 * Model Gerai (Stall/Tenant)
 * Sesuai instruksi: Bahasa Indonesia, tanpa model sewa / rental mode di dalam gerai.
 */

export interface Gerai {
  id: string; // 'G01', 'G02', 'G03', 'G04'
  kode: string; // 'G01'
  nama: string; // 'Pempek Cik Ani'
  penyewa: string; // 'Cik Ani'
  warna: string; // HEX: '#F97316'
  aktif: boolean;

  // Kompatibilitas properti lama
  name: string;
  color: string;
  code: string;
}

// Alias untuk kompatibilitas kode lama
export type Stall = Gerai;
