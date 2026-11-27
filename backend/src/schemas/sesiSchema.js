import { z } from 'zod'
import { SESSION_STATUS_LIST } from '../constants/paymentMethods.js'

export const bukaSesiSchema = z.object({
  nomorKartu: z
    .number({ required_error: 'Nomor kartu wajib diisi' })
    .int('Nomor kartu harus bilangan bulat')
    .min(1, 'Nomor kartu minimal 1')
    .max(99, 'Nomor kartu maksimal 99'),
  nomorMeja: z.number().int().positive('Nomor meja harus positif').optional().nullable(),
})

export const updateStatusSesiSchema = z.object({
  status: z.enum(SESSION_STATUS_LIST).optional(),
  totalTagihan: z.number().int().nonnegative().optional(),
})
