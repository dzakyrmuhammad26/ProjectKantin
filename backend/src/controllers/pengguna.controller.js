import UserModel from '../models/user.model.js'
import {
  createPenggunaSchema,
  ubahPinSchema,
  updatePenggunaSchema,
} from '../schemas/penggunaSchema.js'
import { PasswordHelper } from '../utils/bcrypt.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

class PenggunaController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.peran) filter.peran = req.query.peran
      if (req.query.aktif !== undefined) filter.aktif = req.query.aktif === 'true'

      const listPengguna = await UserModel.find(filter).sort({ createdAt: -1 })
      return apiResponse({
        res,
        status: 200,
        message: 'Daftar pengguna',
        data: listPengguna,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id)
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
        message: 'Detail pengguna',
        data: user,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    const result = createPenggunaSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const { nama, username, pin, peran, idGerai, aktif } = result.data
      const hashedPin = await PasswordHelper.hash(pin)

      const newUser = await UserModel.create({
        nama,
        username,
        pin: hashedPin,
        peran,
        idGerai: peran === 'gerai' ? idGerai || null : null,
        aktif,
      })

      const userResponse = newUser.toObject()
      delete userResponse.pin

      return apiResponse({
        res,
        status: 201,
        message: 'Pengguna berhasil dibuat',
        data: userResponse,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    const result = updatePenggunaSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const updates = { ...result.data }
      if (updates.pin) {
        updates.pin = await PasswordHelper.hash(updates.pin)
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        updates,
        { returnDocument: 'after', runValidators: true },
      )

      if (!updatedUser) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Pengguna berhasil diperbarui',
        data: updatedUser,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async ubahPin(req, res, next) {
    const result = ubahPinSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const hashedPin = await PasswordHelper.hash(result.data.pinBaru)
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        { pin: hashedPin },
        { returnDocument: 'after' },
      )

      if (!updatedUser) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'PIN pengguna berhasil diperbarui',
        data: updatedUser,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      if (req.query.permanent === 'true') {
        const deleted = await UserModel.findByIdAndDelete(req.params.id)
        if (!deleted) {
          return apiResponse({
            res,
            status: 404,
            message: 'Pengguna tidak ditemukan',
          })
        }
        return apiResponse({
          res,
          status: 200,
          message: 'Pengguna berhasil dihapus permanen',
        })
      }

      const deactivated = await UserModel.findByIdAndUpdate(
        req.params.id,
        { aktif: false },
        { returnDocument: 'after' },
      )

      if (!deactivated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Pengguna berhasil dinonaktifkan',
        data: deactivated,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default PenggunaController
