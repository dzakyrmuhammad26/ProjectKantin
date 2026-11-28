import { z } from 'zod'
import { ORDER_STATUS_LIST, ORDER_SOURCE_LIST } from '../constants/orderStatus.js'

export const itemPesananSchema = z.object({
  idMenu: z.string({ required_error: 'ID Menu wajib ada' }).max(50, 'ID Menu maksimal 50 karakter'),
  namaMenu: z.string().max(100, 'Nama menu maksimal 100 karakter').optional(),
  idGerai: z.string().max(10, 'ID Gerai maksimal 10 karakter').optional().nullable(),
  namaGerai: z.string().max(100, 'Nama gerai maksimal 100 karakter').optional().nullable(),
  jumlah: z
    .number({ required_error: 'Jumlah wajib diisi' })
    .int('Jumlah harus bulat')
    .positive('Jumlah minimal 1'),
  hargaSaatItu: z.number().int().nonnegative().optional(),
  subtotal: z.number().int().nonnegative().optional(),
  catatan: z.string().max(200, 'Catatan maksimal 200 karakter').optional().nullable(),
})

export const createPesananSchema = z.object({
  idPesanan: z.string().trim().max(50, 'ID Pesanan maksimal 50 karakter').optional(),
  nomorKartu: z
    .string({ required_error: 'Nomor kartu wajib diisi' })
    .trim()
    .min(1, 'Nomor kartu tidak boleh kosong')
    .max(10, 'Nomor kartu maksimal 10 karakter'),
  nomorMeja: z.number().int().positive('Nomor meja harus positif').optional().nullable(),
  idGerai: z.string().trim().optional().nullable(),
  namaGerai: z.string().trim().optional().nullable(),
  idSesi: z.string().trim().optional().nullable(),
  sumber: z.enum(ORDER_SOURCE_LIST).optional().default('pelanggan'),
  langsungMasak: z.boolean().optional().default(false),
  catatan: z.string().max(255).optional().nullable(),
  total: z.number().int().nonnegative().optional(),
  items: z
    .array(itemPesananSchema, { required_error: 'Daftar item pesanan wajib disertakan' })
    .min(1, 'Pesanan minimal harus memiliki 1 menu'),
})

export const updateStatusPesananSchema = z.object({
  status: z.enum(ORDER_STATUS_LIST, {
    required_error: 'Status baru wajib diisi',
  }),
  idGerai: z.string().trim().max(10).optional().nullable(),
})

export const updateItemsPesananSchema = z.object({
  items: z.array(itemPesananSchema).min(1, 'Minimal 1 item pesanan'),
  total: z.number().int().nonnegative().optional(),
})
