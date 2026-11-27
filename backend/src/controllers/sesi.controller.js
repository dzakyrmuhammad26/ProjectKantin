import mongoose from 'mongoose'
import SesiModel from '../models/sesi.model.js'
import { bukaSesiSchema, updateStatusSesiSchema } from '../schemas/sesiSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findSesiFilter = (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return { _id: idOrCode }
  }
  return { idSesi: idOrCode }
}

class SesiController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.status) filter.status = req.query.status
      if (req.query.nomorKartu) filter.nomorKartu = Number(req.query.nomorKartu)

      const listSesi = await SesiModel.find(filter).sort({ waktuBuka: -1 })
      return apiResponse({
        res,
        status: 200,
        message: 'Daftar sesi pelanggan',
        data: listSesi,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async aktifByKartu(req, res, next) {
    try {
      const nomorKartu = Number(req.params.nomorKartu)
      const sesi = await SesiModel.findOne({ nomorKartu, status: 'aktif' })

      if (!sesi) {
        return apiResponse({
          res,
          status: 404,
          message: `Tidak ada sesi aktif untuk kartu nomor ${nomorKartu}`,
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Sesi aktif ditemukan',
        data: sesi,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const sesi = await SesiModel.findOne(findSesiFilter(req.params.id))
      if (!sesi) {
        return apiResponse({
          res,
          status: 404,
          message: 'Sesi tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Detail sesi',
        data: sesi,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async buka(req, res, next) {
    const result = bukaSesiSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const { nomorKartu, nomorMeja } = result.data

      // Cek apakah sudah ada sesi aktif untuk kartu ini
      const existing = await SesiModel.findOne({ nomorKartu, status: 'aktif' })
      if (existing) {
        return apiResponse({
          res,
          status: 200,
          message: 'Sesi aktif sudah tersedia',
          data: existing,
        })
      }

      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const idSesi = `SESI-${todayStr}-${String(nomorKartu).padStart(2, '0')}${randomSuffix}`

      const newSesi = await SesiModel.create({
        idSesi,
        nomorKartu,
        nomorMeja: nomorMeja ?? null,
        status: 'aktif',
        totalTagihan: 0,
        waktuBuka: new Date(),
      })

      return apiResponse({
        res,
        status: 201,
        message: 'Sesi kartu berhasil dibuka',
        data: newSesi,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async tutup(req, res, next) {
    try {
      const updated = await SesiModel.findOneAndUpdate(
        findSesiFilter(req.params.id),
        { status: 'lunas', waktuTutup: new Date() },
        { returnDocument: 'after' },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Sesi tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Sesi berhasil ditutup',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async updateStatus(req, res, next) {
    const result = updateStatusSesiSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const updates = { ...result.data }
      if (updates.status && updates.status !== 'aktif') {
        updates.waktuTutup = new Date()
      }

      const updated = await SesiModel.findOneAndUpdate(
        findSesiFilter(req.params.id),
        updates,
        { returnDocument: 'after' },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Sesi tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Sesi berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default SesiController
