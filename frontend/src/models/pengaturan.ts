import { MetodePembayaran } from './pembayaran';

/**
 * Model Pengaturan Sistem Kantin
 */

export interface PengaturanKantin {
  namaKantin: string;
  alamatKantin: string;
  nomorKartuMin: number; // 1
  nomorKartuMax: number; // 99
  teksFooterStruk: string;
  metodeBayarAktif: MetodePembayaran[];
}
