import { PengaturanKantin } from '@/models/pengaturan';

/**
 * Data Simulasi Pengaturan Sistem Kantin
 */
export const PENGATURAN_KANTIN: PengaturanKantin = {
  namaKantin: 'Kantin Pujasera Sentral',
  alamatKantin: 'Jl. Merdeka No. 45, Palembang',
  nomorKartuMin: 1,
  nomorKartuMax: 99,
  teksFooterStruk: 'Terima kasih atas kunjungan Anda. Selamat menikmati hidangan!',
  metodeBayarAktif: ['tunai', 'qris'],
};
