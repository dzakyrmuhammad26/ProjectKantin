import { z } from 'zod';
import { PAYMENT_METHOD_LIST } from '../constants/paymentMethods.js';

export const prosesPembayaranSchema = z.object({
  body: z.object({
    idPesanan: z.string().optional(),
    idPesananList: z.array(z.string()).optional(),
    metode: z.enum(PAYMENT_METHOD_LIST, {
      required_error: 'Metode pembayaran wajib dipilih',
      invalid_type_error: `Metode harus salah satu dari: ${PAYMENT_METHOD_LIST.join(', ')}`,
    }),
    totalTagihan: z
      .number({ required_error: 'Total tagihan wajib diisi' })
      .int()
      .nonnegative('Total tagihan tidak boleh negatif'),
    uangDiterima: z
      .number({ required_error: 'Nominal uang diterima wajib diisi' })
      .int()
      .nonnegative('Uang diterima tidak boleh negatif'),
    kembalian: z.number().int().nonnegative().optional().default(0),
    referensiQris: z.string().optional().nullable(),
    idKasir: z.string().optional().nullable(),
  }).refine((data) => data.idPesanan || (data.idPesananList && data.idPesananList.length > 0), {
    message: 'Harus menyertakan idPesanan atau idPesananList',
    path: ['idPesanan'],
  }).refine((data) => {
    // Jika metode tunai / cash, uangDiterima harus >= totalTagihan
    if (data.metode === 'tunai' || data.metode === 'cash') {
      return data.uangDiterima >= data.totalTagihan;
    }
    return true;
  }, {
    message: 'Uang yang diterima kurang dari total tagihan',
    path: ['uangDiterima'],
  }),
});

export const pembayaranQuerySchema = z.object({
  query: z.object({
    idKasir: z.string().optional(),
    metode: z.enum(PAYMENT_METHOD_LIST).optional(),
    tanggal: z.string().optional(),
  }),
});
