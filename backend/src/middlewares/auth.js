import UserModel from '../models/user.model.js'
import { verifyToken } from '../utils/jwt.js'
import { apiResponse } from '../utils/response.js'

export const authenticateJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const match =
    typeof authHeader === 'string' ? /^Bearer\s+(\S+)$/i.exec(authHeader) : null

  if (!match) {
    return apiResponse({
      res,
      status: 401,
      message: 'Token Bearer wajib disertakan',
    })
  }

  let decoded
  try {
    decoded = await verifyToken(match[1])
  } catch (error) {
    return apiResponse({
      res,
      status: 401,
      message:
        error.name === 'TokenExpiredError'
          ? 'Token sudah kedaluwarsa, silakan login kembali'
          : 'Token tidak valid',
    })
  }

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.sub !== 'string' ||
    decoded.sub.trim() === ''
  ) {
    return apiResponse({ res, status: 401, message: 'Token tidak valid' })
  }

  if (decoded.peran !== 'pelanggan') {
    const userId = Number(decoded.sub)
    if (!Number.isInteger(userId) || userId <= 0) {
      return apiResponse({ res, status: 401, message: 'Token tidak valid' })
    }

    try {
      const activeUser = await UserModel.findUnique({
        where: { id: userId },
        select: { id: true, peran: true, idGerai: true, aktif: true },
      })

      if (!activeUser || !activeUser.aktif) {
        return apiResponse({
          res,
          status: 401,
          message: 'Akun tidak aktif atau sudah tidak terdaftar, silakan login kembali',
        })
      }

      req.user = {
        id: String(activeUser.id),
        peran: activeUser.peran,
        idGerai: activeUser.idGerai || null,
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }

  req.user = {
    id: decoded.sub,
    peran: decoded.peran,
    idGerai: null,
  }
  return next()
}

/**
 * Mekanisme JWT untuk seluruh operasi CRUD (POST, PUT, PATCH, DELETE)
 * kecuali method GET (serta HEAD dan OPTIONS)
 */
export const requireJwtExceptGet = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next()
  }
  return authenticateJwt(req, res, next)
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.peran)) {
      return apiResponse({
        res,
        status: 403,
        message: 'Akses ditolak: Anda tidak memiliki hak untuk tindakan ini',
      })
    }
    return next()
  }
}
