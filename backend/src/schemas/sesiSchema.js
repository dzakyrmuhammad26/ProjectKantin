import { z } from 'zod';
import { SESSION_STATUS_LIST } from '../constants/paymentMethods.js';

export const bukaSesiSchema = z.object({
  body: z.object({
    nomorKartu: z
      .number({ required_error: 'Nomor kartu wajib diisi' })
      .int('Nomor kartu harus bilangan bulat')
      .min(1, 'Nomor kartu minimal 1')
      .max(99, 'Nomor kartu maksimal 99'),
    nomorMeja: z
      .number()
      .int()
      .positive('Nomor meja harus positif')
      .optional()
      .nullable(),
  }),
});

export const updateStatusSesiSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID sesi wajib disertakan' }),
  }),
  body: z.object({
    status: z.enum(SESSION_STATUS_LIST, {
      required_error: 'Status sesi wajib diisi',
      invalid_type_error: `Status harus salah satu dari: ${SESSION_STATUS_LIST.join(', ')}`,
    }),
  }),
});

export const sesiQuerySchema = z.object({
  query: z.object({
    nomorKartu: z.coerce.number().optional(),
    status: z.enum(SESSION_STATUS_LIST).optional(),
  }),
});

export const sesiIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID sesi wajib disertakan' }),
  }),
});
