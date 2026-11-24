import { z } from 'zod';
import { ORDER_STATUS_LIST, ORDER_SOURCE_LIST } from '../constants/orderStatus.js';

export const itemPesananSchema = z.object({
  idMenu: z.string({ required_error: 'ID Menu wajib ada' }),
  namaMenu: z.string().optional(),
  jumlah: z
    .number({ required_error: 'Jumlah wajib diisi' })
    .int('Jumlah harus bulat')
    .positive('Jumlah minimal 1'),
  hargaSaatItu: z.number().int().nonnegative().optional(),
  subtotal: z.number().int().nonnegative().optional(),
  catatan: z.string().max(200, 'Catatan maksimal 200 karakter').optional().nullable(),
});

export const createPesananSchema = z.object({
  body: z.object({
    nomorKartu: z
      .string({ required_error: 'Nomor kartu wajib diisi' })
      .min(1, 'Nomor kartu tidak boleh kosong')
      .max(10, 'Nomor kartu maksimal 10 karakter'),
    nomorMeja: z
      .number({ invalid_type_error: 'Nomor meja harus angka' })
      .int()
      .positive('Nomor meja harus positif')
      .optional()
      .nullable(),
    idGerai: z.string().optional().nullable(),
    namaGerai: z.string().optional().nullable(),
    idSesi: z.string().optional().nullable(),
    sumber: z.enum(ORDER_SOURCE_LIST).default('pelanggan'),
    catatan: z.string().max(255).optional().nullable(),
    total: z.number().int().nonnegative().optional(),
    items: z
      .array(itemPesananSchema, {
        required_error: 'Daftar item pesanan wajib disertakan',
      })
      .min(1, 'Pesanan minimal harus memiliki 1 menu'),
  }),
});

export const updateStatusPesananSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID pesanan wajib disertakan' }),
  }),
  body: z.object({
    status: z.enum(ORDER_STATUS_LIST, {
      required_error: 'Status baru wajib diisi',
      invalid_type_error: `Status harus salah satu dari: ${ORDER_STATUS_LIST.join(', ')}`,
    }),
  }),
});

export const pesananQuerySchema = z.object({
  query: z.object({
    nomorKartu: z.string().optional(),
    idGerai: z.string().optional(),
    idSesi: z.string().optional(),
    status: z.enum(ORDER_STATUS_LIST).optional(),
    tanggal: z.string().optional(),
  }),
});

export const pesananIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID pesanan wajib disertakan' }),
  }),
});
