import crypto from 'crypto'
import UserModel from '../models/user.model.js'
import { loginPinSchema } from '../schemas/penggunaSchema.js'
import { PasswordHelper } from '../utils/bcrypt.js'
import { generateToken } from '../utils/jwt.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

class AuthController {
  static async login(req, res, next) {
    const result = loginPinSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    const { username, pin } = result.data

    try {
      const where = { aktif: true }
      if (username) {
        where.username = username.toLowerCase()
      }

      const candidates = await UserModel.findMany({ where })

      let matchedUser = null
      for (const user of candidates) {
        const isHashed = user.pin.startsWith('$2a$') || user.pin.startsWith('$2b$')
        const isMatch = isHashed
          ? await PasswordHelper.compare(pin, user.pin)
          : user.pin === pin

        if (isMatch) {
          matchedUser = user
          break
        }
      }

      if (!matchedUser) {
        return apiResponse({
          res,
          status: 401,
          message: 'PIN salah atau akun tidak aktif',
        })
      }

      const accessToken = await generateToken({
        sub: String(matchedUser.id),
        peran: matchedUser.peran,
        idGerai: matchedUser.idGerai,
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Login berhasil',
        data: {
          user: {
            id: matchedUser.id,
            nama: matchedUser.nama,
            username: matchedUser.username,
            peran: matchedUser.peran,
            idGerai: matchedUser.idGerai,
            aktif: matchedUser.aktif,
          },
          access_token: accessToken,
          token_type: 'Bearer',
        },
      })
    } catch (error) {
      return next(error)
    }
  }

  static async guest(req, res, next) {
    try {
      const guestId = crypto.randomUUID()
      const accessToken = await generateToken({
        sub: guestId,
        peran: 'pelanggan',
        idGerai: null,
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Token pelanggan berhasil dibuat',
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          peran: 'pelanggan',
        },
      })
    } catch (error) {
      return next(error)
    }
  }

  static async me(req, res, next) {
    try {
      const userId = Number(req.user.id)
      if (!Number.isInteger(userId) || userId <= 0) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const user = await UserModel.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nama: true,
          username: true,
          peran: true,
          idGerai: true,
          aktif: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Profil pengguna aktif',
        data: user,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default AuthController
