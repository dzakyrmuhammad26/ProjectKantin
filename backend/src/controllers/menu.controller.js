import GeraiModel from '../models/gerai.model.js'
import MenuModel from '../models/menu.model.js'
import {
  createMenuSchema,
  toggleMenuStatusSchema,
  updateMenuSchema,
} from '../schemas/menuSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findMenuByIdOrKode = async (idOrKode) => {
  if (/^\d+$/.test(String(idOrKode))) {
    const id = Number(idOrKode)
    if (Number.isSafeInteger(id) && id > 0) {
      return await MenuModel.findUnique({ where: { id } })
    }
  }
  return await MenuModel.findUnique({ where: { kode: String(idOrKode).toUpperCase() } })
}

class MenuController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.idGerai) where.idGerai = req.query.idGerai
      if (req.query.kategori) where.kategori = req.query.kategori
      if (req.query.isHabis !== undefined) where.isHabis = req.query.isHabis === 'true'
      if (req.query.aktif !== undefined) {
        where.aktif = req.query.aktif === 'true'
      } else {
        where.aktif = true
      }

      if (req.query.search) {
        const search = String(req.query.search).trim()
        where.OR = [
          { nama: { contains: search } },
          { kode: { contains: search } },
        ]
      }

      const listMenu = await MenuModel.findMany({
        where,
        orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Daftar menu',
        data: listMenu,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async byGerai(req, res, next) {
    try {
      const listMenu = await MenuModel.findMany({
        where: {
          idGerai: req.params.idGerai,
          aktif: true,
        },
        orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
      })

      return apiResponse({
        res,
        status: 200,
        message: `Daftar menu gerai ${req.params.idGerai}`,
        data: listMenu,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const menu = await findMenuByIdOrKode(req.params.id)
      if (!menu) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Detail menu',
        data: menu,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    const result = createMenuSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const data = { ...result.data }
      if (data.foto === null || data.foto === undefined) {
        delete data.foto
      }

      const gerai = await GeraiModel.findUnique({
        where: { kode: data.idGerai.toUpperCase() },
      })
      if (!gerai) {
        return apiResponse({
          res,
          status: 404,
          message: `Gerai dengan kode ${data.idGerai} tidak ditemukan`,
        })
      }

      data.idGerai = gerai.kode
      if (!data.namaGerai) {
        data.namaGerai = gerai.nama
      }

      const newMenu = await MenuModel.create({ data })
      return apiResponse({
        res,
        status: 201,
        message: 'Menu berhasil dibuat',
        data: newMenu,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    const result = updateMenuSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const existing = await findMenuByIdOrKode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

      const data = { ...result.data }
      if (data.foto === null) {
        delete data.foto
      }

      const updated = await MenuModel.update({
        where: { id: existing.id },
        data,
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Menu berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async toggleStatus(req, res, next) {
    const result = toggleMenuStatusSchema.safeParse(req.body || {})
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const menu = await findMenuByIdOrKode(req.params.id)
      if (!menu) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

      const updates = {}
      if (Object.keys(result.data).length === 0) {
        updates.isHabis = !menu.isHabis
      } else {
        if (result.data.isHabis !== undefined) updates.isHabis = result.data.isHabis
        if (result.data.aktif !== undefined) updates.aktif = result.data.aktif
        if (result.data.isFavorit !== undefined) updates.isFavorit = result.data.isFavorit
      }

      const updated = await MenuModel.update({
        where: { id: menu.id },
        data: updates,
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Status menu berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const existing = await findMenuByIdOrKode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

      if (req.query.permanent === 'true') {
        await MenuModel.delete({ where: { id: existing.id } })
        return apiResponse({
          res,
          status: 200,
          message: 'Menu berhasil dihapus permanen',
        })
      }

      const deactivated = await MenuModel.update({
        where: { id: existing.id },
        data: { aktif: false },
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Menu berhasil dinonaktifkan',
        data: deactivated,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default MenuController
