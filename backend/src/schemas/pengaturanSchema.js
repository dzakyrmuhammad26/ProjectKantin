import { z } from 'zod'
import { PAYMENT_METHOD_LIST } from '../constants/paymentMethods.js'

export const updatePengaturanSchema = z
  .object({
    namaKantin: z.string().trim().min(2).max(100).optional(),
    alamatKantin: z.string().trim().min(5).max(255).optional(),
    nomorKartuMin: z.number().int().positive().optional(),
    nomorKartuMax: z.number().int().positive().optional(),
    teksFooterStruk: z.string().trim().max(255).optional(),
    metodeBayarAktif: z.array(z.enum(PAYMENT_METHOD_LIST)).optional(),
  })
  .refine(
    (data) => {
      if (data.nomorKartuMin !== undefined && data.nomorKartuMax !== undefined) {
        return data.nomorKartuMin <= data.nomorKartuMax
      }
      return true
    },
    {
      message: 'Nomor kartu minimal tidak boleh lebih besar dari nomor kartu maksimal',
      path: ['nomorKartuMin'],
    },
  )
