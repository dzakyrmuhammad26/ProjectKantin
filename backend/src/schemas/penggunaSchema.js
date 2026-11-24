import { z } from 'zod';
import { ROLE_LIST } from '../constants/roles.js';

export const loginPinSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    pin: z
      .string({ required_error: 'PIN wajib diisi' })
      .min(4, 'PIN minimal 4 digit')
      .max(6, 'PIN maksimal 6 digit')
      .regex(/^\d+$/, 'PIN hanya boleh berisi angka numerik'),
  }),
});

export const createPenggunaSchema = z.object({
  body: z.object({
    nama: z
      .string({ required_error: 'Nama pengguna wajib diisi' })
      .min(2, 'Nama minimal 2 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    username: z
      .string({ required_error: 'Username wajib diisi' })
      .min(3, 'Username minimal 3 karakter')
      .max(50, 'Username maksimal 50 karakter')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
    pin: z
      .string({ required_error: 'PIN wajib diisi' })
      .min(4, 'PIN minimal 4 digit')
      .max(6, 'PIN maksimal 6 digit')
      .regex(/^\d+$/, 'PIN hanya boleh berisi angka numerik'),
    peran: z.enum(ROLE_LIST, {
      required_error: 'Peran pengguna wajib ditentukan',
      invalid_type_error: `Peran harus salah satu dari: ${ROLE_LIST.join(', ')}`,
    }),
    idGerai: z.string().optional().nullable(),
    aktif: z.boolean().default(true),
  }),
});

export const updatePenggunaSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID pengguna wajib disertakan' }),
  }),
  body: z.object({
    nama: z.string().min(2).max(100).optional(),
    username: z.string().min(3).max(50).optional(),
    pin: z.string().min(4).max(6).regex(/^\d+$/).optional(),
    peran: z.enum(ROLE_LIST).optional(),
    idGerai: z.string().nullable().optional(),
    aktif: z.boolean().optional(),
  }),
});

export const ubahPinSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID pengguna wajib disertakan' }),
  }),
  body: z.object({
    pinBaru: z
      .string({ required_error: 'PIN baru wajib diisi' })
      .min(4, 'PIN baru minimal 4 digit')
      .max(6, 'PIN baru maksimal 6 digit')
      .regex(/^\d+$/, 'PIN hanya boleh angka'),
  }),
});

export const penggunaIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID pengguna wajib disertakan' }),
  }),
});
