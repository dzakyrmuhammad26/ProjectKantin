import z, { ZodError } from 'zod'
import { AppError } from '../utils/appError.js'

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let errors = err.errors || null

  if (err instanceof ZodError) {
    statusCode = 422
    message = 'Validation error'
    errors = z.flattenError(err).fieldErrors
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = `Format ID tidak valid untuk ${err.path}: ${err.value}`
  } else if (err.code === 11000) {
    statusCode = 409
    const fields = err.keyValue ? Object.keys(err.keyValue) : []
    const fieldName = fields.join(', ') || 'field'
    message = `Duplikasi data pada ${fieldName}`
    errors = err.keyValue
      ? Object.fromEntries(
          Object.entries(err.keyValue).map(([field, value]) => [
            field,
            [`${field} '${value}' sudah terdaftar`],
          ]),
        )
      : null
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400
    message = 'Format JSON tidak valid'
  }

  const isProduction = process.env.NODE_ENV === 'production'

  return res.status(statusCode).json({
    meta: {
      status: statusCode,
      message,
    },
    ...(errors && { errors }),
    ...(!isProduction && statusCode === 500 && { stack: err.stack }),
  })
}

export const notFoundHandler = (req, res, next) => {
  return next(new AppError(`Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`, 404))
}
