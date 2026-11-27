import mongoose from 'mongoose'
import GeraiModel from '../models/gerai.model.js'
import { createGeraiSchema, updateGeraiSchema } from '../schemas/geraiSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findGeraiFilter = (idOrKode) => {
  if (mongoose.Types.ObjectId.isValid(idOrKode)) {
    return { _id: idOrKode }
  }
  return { kode: idOrKode.toUpperCase() }
}

class GeraiController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.aktif !== undefined) {
        filter.aktif = req.query.aktif === 'true'
      }

      const listGerai = await GeraiModel.find(filter).sort({ kode: 1 })
      return apiResponse({
        res,
        status: 200,
        message: 'Daftar gerai kantin',
        data: listGerai,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const gerai = await GeraiModel.findOne(findGeraiFilter(req.params.id))
      if (!gerai) {
        return apiResponse({
          res,
          status: 404,
          message: 'Gerai tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Detail gerai',
        data: gerai,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    const result = createGeraiSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const newGerai = await GeraiModel.create(result.data)
      return apiResponse({
        res,
        status: 201,
        message: 'Gerai berhasil dibuat',
        data: newGerai,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    const result = updateGeraiSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const updated = await GeraiModel.findOneAndUpdate(
        findGeraiFilter(req.params.id),
        result.data,
        { returnDocument: 'after', runValidators: true },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Gerai tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Gerai berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const filter = findGeraiFilter(req.params.id)
      if (req.query.permanent === 'true') {
        const deleted = await GeraiModel.findOneAndDelete(filter)
        if (!deleted) {
          return apiResponse({
            res,
            status: 404,
            message: 'Gerai tidak ditemukan',
          })
        }
        return apiResponse({
          res,
          status: 200,
          message: 'Gerai berhasil dihapus permanen',
        })
      }

      const deactivated = await GeraiModel.findOneAndUpdate(
        filter,
        { aktif: false },
        { returnDocument: 'after' },
      )

      if (!deactivated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Gerai tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Gerai berhasil dinonaktifkan',
        data: deactivated,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default GeraiController
