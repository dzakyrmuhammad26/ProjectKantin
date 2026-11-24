/**
 * Model Sesi Pelanggan (Pengikat Kartu Bernomor 1-99)
 */

export type StatusSesi = 'aktif' | 'lunas' | 'batal' | 'tidak_dibayar';

export interface SesiPelanggan {
  id: string; // Misal: 'SESI-20261122-0023'
  nomorKartu: number; // 1 - 99
  nomorMeja?: number;
  status: StatusSesi;
  totalTagihan: number;
  waktuBuka: string;
  waktuTutup?: string;
}

// Alias untuk kompatibilitas
export type CustomerSession = SesiPelanggan;
