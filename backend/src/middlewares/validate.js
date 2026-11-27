import { apiResponseValidation } from '../utils/response.js'

/**
 * Middleware opsional untuk memvalidasi req.body menggunakan Zod schema
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return apiResponseValidation({
      res,
      errors: result.error,
    })
  }
  req.body = result.data
  return next()
}
