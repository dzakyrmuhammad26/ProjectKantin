import mongoose from 'mongoose'
import GeraiModel from '../models/gerai.model.js'
import MenuModel from '../models/menu.model.js'
import {
  createMenuSchema,
  toggleMenuStatusSchema,
  updateMenuSchema,
} from '../schemas/menuSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findMenuFilter = (idOrKode) => {
  if (mongoose.Types.ObjectId.isValid(idOrKode)) {
    return { _id: idOrKode }
  }
  return { kode: idOrKode.toUpperCase() }
}

class MenuController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.idGerai) filter.idGerai = req.query.idGerai
      if (req.query.kategori) filter.kategori = req.query.kategori
      if (req.query.isHabis !== undefined) filter.isHabis = req.query.isHabis === 'true'
      if (req.query.aktif !== undefined) {
        filter.aktif = req.query.aktif === 'true'
      } else {
        filter.aktif = true
      }

      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i')
        filter.$or = [{ nama: regex }, { kode: regex }]
      }

      const listMenu = await MenuModel.find(filter).sort({ urutan: 1, createdAt: -1 })
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
      const listMenu = await MenuModel.find({
        idGerai: req.params.idGerai,
        aktif: true,
      }).sort({ urutan: 1, createdAt: -1 })

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
      const menu = await MenuModel.findOne(findMenuFilter(req.params.id))
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

      // Lengkapi namaGerai otomatis dari database jika tidak dikirim
      if (!data.namaGerai) {
        const gerai = await GeraiModel.findOne({ kode: data.idGerai.toUpperCase() })
        if (!gerai) {
          return apiResponse({
            res,
            status: 404,
            message: `Gerai dengan kode ${data.idGerai} tidak ditemukan`,
          })
        }
        data.namaGerai = gerai.nama
      }

      const newMenu = await MenuModel.create(data)
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
      const updated = await MenuModel.findOneAndUpdate(
        findMenuFilter(req.params.id),
        result.data,
        { returnDocument: 'after', runValidators: true },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

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
      const menu = await MenuModel.findOne(findMenuFilter(req.params.id))
      if (!menu) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

      // Jika body kosong, toggle isHabis secara otomatis
      if (Object.keys(result.data).length === 0) {
        menu.isHabis = !menu.isHabis
      } else {
        if (result.data.isHabis !== undefined) menu.isHabis = result.data.isHabis
        if (result.data.aktif !== undefined) menu.aktif = result.data.aktif
        if (result.data.isFavorit !== undefined) menu.isFavorit = result.data.isFavorit
      }

      await menu.save()

      return apiResponse({
        res,
        status: 200,
        message: 'Status menu berhasil diperbarui',
        data: menu,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const filter = findMenuFilter(req.params.id)
      if (req.query.permanent === 'true') {
        const deleted = await MenuModel.findOneAndDelete(filter)
        if (!deleted) {
          return apiResponse({
            res,
            status: 404,
            message: 'Menu tidak ditemukan',
          })
        }
        return apiResponse({
          res,
          status: 200,
          message: 'Menu berhasil dihapus permanen',
        })
      }

      const deactivated = await MenuModel.findOneAndUpdate(
        filter,
        { aktif: false },
        { returnDocument: 'after' },
      )

      if (!deactivated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Menu tidak ditemukan',
        })
      }

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
