import { z } from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const laporanQuerySchema = z.object({
  tanggal: z
    .string()
    .regex(DATE_REGEX, 'Format tanggal harus YYYY-MM-DD')
    .optional(),
  startDate: z
    .string()
    .regex(DATE_REGEX, 'Format startDate harus YYYY-MM-DD')
    .optional(),
  endDate: z
    .string()
    .regex(DATE_REGEX, 'Format endDate harus YYYY-MM-DD')
    .optional(),
  all: z.enum(['true', 'false']).optional(),
})
