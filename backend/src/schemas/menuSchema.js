import { z } from 'zod'

export const KATEGORI_MENU = ['makanan', 'minuman', 'camilan']

export const createMenuSchema = z.object({
  kode: z
    .string({ required_error: 'Kode menu wajib diisi' })
    .trim()
    .min(2, 'Kode menu minimal 2 karakter')
    .max(20, 'Kode menu maksimal 20 karakter'),
  nama: z
    .string({ required_error: 'Nama menu wajib diisi' })
    .trim()
    .min(2, 'Nama menu minimal 2 karakter')
    .max(100, 'Nama menu maksimal 100 karakter'),
  harga: z
    .number({ required_error: 'Harga menu wajib diisi' })
    .int('Harga harus berupa bilangan bulat')
    .nonnegative('Harga tidak boleh negatif'),
  idGerai: z
    .string({ required_error: 'ID Gerai wajib diisi' })
    .trim()
    .min(1, 'ID Gerai tidak boleh kosong')
    .max(10, 'ID Gerai maksimal 10 karakter'),
  namaGerai: z.string().trim().max(100, 'Nama gerai maksimal 100 karakter').optional(),
  kategori: z.enum(KATEGORI_MENU).default('makanan'),
  foto: z.string().trim().max(500, 'URL foto maksimal 500 karakter').optional().nullable(),
  urutan: z.number().int().positive().optional().default(99),
  isFavorit: z.boolean().optional().default(false),
  isHabis: z.boolean().optional().default(false),
  aktif: z.boolean().optional().default(true),
})

export const updateMenuSchema = createMenuSchema.partial()

export const toggleMenuStatusSchema = z.object({
  isHabis: z.boolean().optional(),
  aktif: z.boolean().optional(),
  isFavorit: z.boolean().optional(),
})
