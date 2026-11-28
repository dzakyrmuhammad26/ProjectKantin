import GeraiModel from '../models/gerai.model.js'
import UserModel from '../models/user.model.js'
import {
  createPenggunaSchema,
  ubahPinSchema,
  updatePenggunaSchema,
} from '../schemas/penggunaSchema.js'
import { PasswordHelper } from '../utils/bcrypt.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const USER_PUBLIC_SELECT = {
  id: true,
  nama: true,
  username: true,
  peran: true,
  idGerai: true,
  aktif: true,
  createdAt: true,
  updatedAt: true,
}

const parseNumericId = (raw) => {
  if (!/^\d+$/.test(String(raw))) return null
  const num = Number(raw)
  return Number.isSafeInteger(num) && num > 0 ? num : null
}

class PenggunaController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.peran) where.peran = req.query.peran
      if (req.query.aktif !== undefined) where.aktif = req.query.aktif === 'true'

      const listPengguna = await UserModel.findMany({
        where,
        select: USER_PUBLIC_SELECT,
        orderBy: { createdAt: 'desc' },
      })

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
      const id = parseNumericId(req.params.id)
      if (!id) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const user = await UserModel.findUnique({
        where: { id },
        select: USER_PUBLIC_SELECT,
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
      let resolvedIdGerai = null

      if (peran === 'gerai' && idGerai) {
        const gerai = await GeraiModel.findUnique({ where: { kode: idGerai.toUpperCase() } })
        if (!gerai) {
          return apiResponse({
            res,
            status: 404,
            message: `Gerai dengan kode ${idGerai} tidak ditemukan`,
          })
        }
        resolvedIdGerai = gerai.kode
      }

      const hashedPin = await PasswordHelper.hash(pin)

      const newUser = await UserModel.create({
        data: {
          nama,
          username,
          pin: hashedPin,
          peran,
          idGerai: resolvedIdGerai,
          aktif,
        },
        select: USER_PUBLIC_SELECT,
      })

      return apiResponse({
        res,
        status: 201,
        message: 'Pengguna berhasil dibuat',
        data: newUser,
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
      const id = parseNumericId(req.params.id)
      if (!id) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const existing = await UserModel.findUnique({ where: { id } })
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const updates = { ...result.data }
      const targetPeran = updates.peran ?? existing.peran

      if (targetPeran !== 'gerai') {
        updates.idGerai = null
      } else if (updates.idGerai) {
        const gerai = await GeraiModel.findUnique({ where: { kode: updates.idGerai.toUpperCase() } })
        if (!gerai) {
          return apiResponse({
            res,
            status: 404,
            message: `Gerai dengan kode ${updates.idGerai} tidak ditemukan`,
          })
        }
        updates.idGerai = gerai.kode
      }

      if (updates.pin) {
        updates.pin = await PasswordHelper.hash(updates.pin)
      }

      const updatedUser = await UserModel.update({
        where: { id },
        data: updates,
        select: USER_PUBLIC_SELECT,
      })

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
      const id = parseNumericId(req.params.id)
      if (!id) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const existing = await UserModel.findUnique({ where: { id } })
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const hashedPin = await PasswordHelper.hash(result.data.pinBaru)
      const updatedUser = await UserModel.update({
        where: { id },
        data: { pin: hashedPin },
        select: USER_PUBLIC_SELECT,
      })

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
      const id = parseNumericId(req.params.id)
      if (!id) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      const existing = await UserModel.findUnique({ where: { id } })
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pengguna tidak ditemukan',
        })
      }

      if (req.query.permanent === 'true') {
        await UserModel.delete({ where: { id } })
        return apiResponse({
          res,
          status: 200,
          message: 'Pengguna berhasil dihapus permanen',
        })
      }

      const deactivated = await UserModel.update({
        where: { id },
        data: { aktif: false },
        select: USER_PUBLIC_SELECT,
      })

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
