/**
 * Model Pembayaran di Kasir Sentral (Bahasa Indonesia)
 */

export type MetodePembayaran = 'tunai' | 'qris' | 'debit' | 'cash';

export interface DetailPembayaran {
  metode?: MetodePembayaran;
  totalTagihan?: number;
  uangDiterima?: number;
  kembalian?: number;
  waktuBayar?: string;
  idKasir?: string;
  referensiQris?: string;

  // Kompatibilitas kode lama
  method: MetodePembayaran;
  amountPaid: number;
  change: number;
  paidAt: string;
}

export type PaymentMethod = MetodePembayaran;
export type PaymentDetails = DetailPembayaran;
