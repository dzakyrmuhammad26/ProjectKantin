import { z } from 'zod'

export const createGeraiSchema = z.object({
  kode: z
    .string({ required_error: 'Kode gerai wajib diisi' })
    .trim()
    .toUpperCase()
    .min(2, 'Kode gerai minimal 2 karakter')
    .max(10, 'Kode gerai maksimal 10 karakter'),
  nama: z
    .string({ required_error: 'Nama gerai wajib diisi' })
    .trim()
    .min(2, 'Nama gerai minimal 2 karakter')
    .max(100, 'Nama gerai maksimal 100 karakter'),
  penyewa: z
    .string({ required_error: 'Nama penyewa wajib diisi' })
    .trim()
    .min(2, 'Nama penyewa minimal 2 karakter'),
  warna: z
    .string()
    .trim()
    .regex(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, 'Format warna harus HEX (#FFFFFF atau #FFF)')
    .default('#F97316'),
  aktif: z.boolean().optional().default(true),
})

export const updateGeraiSchema = createGeraiSchema.partial()
