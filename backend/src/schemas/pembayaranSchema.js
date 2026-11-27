import { z } from 'zod'
import { PAYMENT_METHOD_LIST } from '../constants/paymentMethods.js'

export const prosesPembayaranSchema = z
  .object({
    idPesanan: z.string().optional(),
    idPesananList: z.array(z.string()).optional(),
    idSesi: z.string().optional().nullable(),
    metode: z.enum(PAYMENT_METHOD_LIST, {
      required_error: 'Metode pembayaran wajib dipilih',
    }),
    totalTagihan: z
      .number({ required_error: 'Total tagihan wajib diisi' })
      .int()
      .nonnegative('Total tagihan tidak boleh negatif'),
    uangDiterima: z
      .number({ required_error: 'Nominal uang diterima wajib diisi' })
      .int()
      .nonnegative('Uang diterima tidak boleh negatif'),
    kembalian: z.number().int().nonnegative().optional(),
    referensiQris: z.string().optional().nullable(),
    idKasir: z.string().optional().nullable(),
  })
  .refine((data) => data.idPesanan || (data.idPesananList && data.idPesananList.length > 0), {
    message: 'Harus menyertakan idPesanan atau idPesananList',
    path: ['idPesanan'],
  })
  .refine(
    (data) => {
      if (data.metode === 'tunai' || data.metode === 'cash') {
        return data.uangDiterima >= data.totalTagihan
      }
      return true
    },
    {
      message: 'Uang yang diterima kurang dari total tagihan',
      path: ['uangDiterima'],
    },
  )
