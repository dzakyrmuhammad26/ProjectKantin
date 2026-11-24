import { z } from 'zod';

export const createGeraiSchema = z.object({
  body: z.object({
    id: z.string().optional(), // 'G01', 'G02', opsional jika auto-generate
    kode: z
      .string({ required_error: 'Kode gerai wajib diisi' })
      .min(2, 'Kode gerai minimal 2 karakter')
      .max(10, 'Kode gerai maksimal 10 karakter'),
    nama: z
      .string({ required_error: 'Nama gerai wajib diisi' })
      .min(2, 'Nama gerai minimal 2 karakter')
      .max(100, 'Nama gerai maksimal 100 karakter'),
    penyewa: z
      .string({ required_error: 'Nama penyewa wajib diisi' })
      .min(2, 'Nama penyewa minimal 2 karakter'),
    warna: z
      .string({ required_error: 'Warna gerai wajib diisi' })
      .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, 'Format warna harus HEX (#FFFFFF atau #FFF)'),
    aktif: z.boolean().default(true),
  }),
});

export const updateGeraiSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID gerai wajib disertakan' }),
  }),
  body: z.object({
    kode: z.string().min(2).max(10).optional(),
    nama: z.string().min(2).max(100).optional(),
    penyewa: z.string().min(2).optional(),
    warna: z.string().regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i).optional(),
    aktif: z.boolean().optional(),
  }),
});

export const geraiIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID gerai wajib disertakan' }),
  }),
});
