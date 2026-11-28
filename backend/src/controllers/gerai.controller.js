import GeraiModel from '../models/gerai.model.js'
import { createGeraiSchema, updateGeraiSchema } from '../schemas/geraiSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findGeraiByIdOrKode = async (idOrKode) => {
  if (/^\d+$/.test(String(idOrKode))) {
    const id = Number(idOrKode)
    if (Number.isSafeInteger(id) && id > 0) {
      return await GeraiModel.findUnique({ where: { id } })
    }
  }
  return await GeraiModel.findUnique({ where: { kode: String(idOrKode).toUpperCase() } })
}

class GeraiController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.aktif !== undefined) {
        where.aktif = req.query.aktif === 'true'
      }

      const listGerai = await GeraiModel.findMany({
        where,
        orderBy: { kode: 'asc' },
      })

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
      const gerai = await findGeraiByIdOrKode(req.params.id)
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
      const newGerai = await GeraiModel.create({
        data: result.data,
      })
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
      const existing = await findGeraiByIdOrKode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Gerai tidak ditemukan',
        })
      }

      const updated = await GeraiModel.update({
        where: { id: existing.id },
        data: result.data,
      })

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
      const existing = await findGeraiByIdOrKode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Gerai tidak ditemukan',
        })
      }

      if (req.query.permanent === 'true') {
        await GeraiModel.delete({ where: { id: existing.id } })
        return apiResponse({
          res,
          status: 200,
          message: 'Gerai berhasil dihapus permanen',
        })
      }

      const deactivated = await GeraiModel.update({
        where: { id: existing.id },
        data: { aktif: false },
      })

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
