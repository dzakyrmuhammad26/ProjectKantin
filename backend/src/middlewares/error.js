import { Prisma } from '@prisma/client'
import multer from 'multer'
import z, { ZodError } from 'zod'
import { UPLOAD_MAX_SIZE_MB } from '../config/env.js'
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
  } else if (err instanceof multer.MulterError) {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `Ukuran file terlalu besar. Maksimal ${UPLOAD_MAX_SIZE_MB} MB`
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Field upload tidak valid, gunakan key "image"'
    } else {
      message = err.message
    }
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409
      const target = err.meta?.target
      const fieldName = Array.isArray(target) ? target.join(', ') : String(target || 'field')
      message = `Duplikasi data pada ${fieldName}`
    } else if (err.code === 'P2025') {
      statusCode = 404
      message = 'Data tidak ditemukan'
    } else if (err.code === 'P2003') {
      statusCode = 400
      message = 'Relasi data tidak valid'
    }
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
