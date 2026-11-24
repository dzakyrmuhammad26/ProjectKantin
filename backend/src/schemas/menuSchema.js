import { z } from 'zod';

export const KATEGORI_MENU = ['makanan', 'minuman', 'camilan'];

export const createMenuSchema = z.object({
  body: z.object({
    kode: z
      .string({ required_error: 'Kode menu wajib diisi' })
      .min(2, 'Kode menu minimal 2 karakter')
      .max(20, 'Kode menu maksimal 20 karakter'),
    nama: z
      .string({ required_error: 'Nama menu wajib diisi' })
      .min(2, 'Nama menu minimal 2 karakter')
      .max(100, 'Nama menu maksimal 100 karakter'),
    harga: z
      .number({ required_error: 'Harga menu wajib diisi' })
      .int('Harga harus berupa bilangan bulat')
      .nonnegative('Harga tidak boleh negatif'),
    idGerai: z
      .string({ required_error: 'ID Gerai wajib diisi' })
      .min(1, 'ID Gerai tidak boleh kosong'),
    namaGerai: z
      .string()
      .optional(),
    kategori: z
      .enum(KATEGORI_MENU, {
        invalid_type_error: `Kategori harus salah satu dari: ${KATEGORI_MENU.join(', ')}`,
      })
      .default('makanan'),
    foto: z
      .string()
      .url('Foto harus berupa URL valid')
      .or(z.string().startsWith('/'))
      .optional()
      .nullable(),
    urutan: z
      .number()
      .int()
      .positive()
      .optional()
      .default(99),
    isFavorit: z.boolean().optional().default(false),
    isHabis: z.boolean().optional().default(false),
    aktif: z.boolean().optional().default(true),
  }),
});

export const updateMenuSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID menu wajib disertakan' }),
  }),
  body: z.object({
    kode: z.string().min(2).max(20).optional(),
    nama: z.string().min(2).max(100).optional(),
    harga: z.number().int().nonnegative().optional(),
    idGerai: z.string().optional(),
    namaGerai: z.string().optional(),
    kategori: z.enum(KATEGORI_MENU).optional(),
    foto: z.string().optional().nullable(),
    urutan: z.number().int().optional(),
    isFavorit: z.boolean().optional(),
    isHabis: z.boolean().optional(),
    aktif: z.boolean().optional(),
  }),
});

export const toggleMenuStatusSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID menu wajib disertakan' }),
  }),
  body: z.object({
    isHabis: z.boolean().optional(),
    aktif: z.boolean().optional(),
    isFavorit: z.boolean().optional(),
  }),
});

export const menuQuerySchema = z.object({
  query: z.object({
    idGerai: z.string().optional(),
    kategori: z.enum(KATEGORI_MENU).optional(),
    isHabis: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    search: z.string().optional(),
  }),
});

export const menuIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID menu wajib disertakan' }),
  }),
});
