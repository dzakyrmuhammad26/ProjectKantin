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
    !/^[a-f\d]{24}$/i.test(decoded.sub)
  ) {
    return apiResponse({ res, status: 401, message: 'Token tidak valid' })
  }

  req.user = {
    id: decoded.sub,
    peran: decoded.peran,
    idGerai: decoded.idGerai || null,
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
