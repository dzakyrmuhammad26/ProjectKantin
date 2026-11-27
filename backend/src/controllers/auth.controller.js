import mongoose from 'mongoose'
import UserModel from '../models/user.model.js'
import { loginPinSchema } from '../schemas/penggunaSchema.js'
import { PasswordHelper } from '../utils/bcrypt.js'
import { JwtHelper } from '../utils/jwt.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

class AuthController {
  static async login(req, res, next) {
    const result = loginPinSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    const { username, pin } = result.data

    try {
      const query = { aktif: true }
      if (username) {
        query.username = username.toLowerCase()
      }

      const candidates = await UserModel.find(query).select('+pin')

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

      const accessToken = await JwtHelper.sign({
        sub: matchedUser._id.toString(),
        peran: matchedUser.peran,
        idGerai: matchedUser.idGerai,
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Login berhasil',
        data: {
          user: {
            _id: matchedUser._id,
            id: matchedUser._id,
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
      const guestId = new mongoose.Types.ObjectId().toString()
      const accessToken = await JwtHelper.sign({
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
      const user = await UserModel.findById(req.user.id)
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
