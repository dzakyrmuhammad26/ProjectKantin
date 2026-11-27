import { z } from 'zod'
import { ROLE_LIST } from '../constants/roles.js'

export const loginPinSchema = z.object({
  username: z.string().trim().optional(),
  pin: z
    .string({ required_error: 'PIN wajib diisi' })
    .trim()
    .min(4, 'PIN minimal 4 digit')
    .max(6, 'PIN maksimal 6 digit')
    .regex(/^\d+$/, 'PIN hanya boleh berisi angka numerik'),
})

export const createPenggunaSchema = z.object({
  nama: z
    .string({ required_error: 'Nama pengguna wajib diisi' })
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  username: z
    .string({ required_error: 'Username wajib diisi' })
    .trim()
    .toLowerCase()
    .min(3, 'Username minimal 3 karakter')
    .max(50, 'Username maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  pin: z
    .string({ required_error: 'PIN wajib diisi' })
    .trim()
    .min(4, 'PIN minimal 4 digit')
    .max(6, 'PIN maksimal 6 digit')
    .regex(/^\d+$/, 'PIN hanya boleh berisi angka numerik'),
  peran: z.enum(ROLE_LIST, {
    required_error: 'Peran pengguna wajib ditentukan',
  }),
  idGerai: z.string().trim().optional().nullable(),
  aktif: z.boolean().optional().default(true),
})

export const updatePenggunaSchema = z.object({
  nama: z.string().trim().min(2).max(100).optional(),
  username: z.string().trim().toLowerCase().min(3).max(50).optional(),
  pin: z.string().trim().min(4).max(6).regex(/^\d+$/).optional(),
  peran: z.enum(ROLE_LIST).optional(),
  idGerai: z.string().trim().nullable().optional(),
  aktif: z.boolean().optional(),
})

export const ubahPinSchema = z.object({
  pinBaru: z
    .string({ required_error: 'PIN baru wajib diisi' })
    .trim()
    .min(4, 'PIN baru minimal 4 digit')
    .max(6, 'PIN baru maksimal 6 digit')
    .regex(/^\d+$/, 'PIN hanya boleh angka'),
})
