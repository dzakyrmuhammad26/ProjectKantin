import { z } from 'zod';
import { PAYMENT_METHOD_LIST } from '../constants/paymentMethods.js';

export const updatePengaturanSchema = z.object({
  body: z.object({
    namaKantin: z.string().min(2).max(100).optional(),
    alamatKantin: z.string().min(5).max(255).optional(),
    nomorKartuMin: z.number().int().positive().optional(),
    nomorKartuMax: z.number().int().positive().optional(),
    teksFooterStruk: z.string().max(255).optional(),
    metodeBayarAktif: z.array(z.enum(PAYMENT_METHOD_LIST)).optional(),
  }),
});
