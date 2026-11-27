import mongoose from 'mongoose'
import MenuModel from '../models/menu.model.js'
import PesananModel from '../models/pesanan.model.js'
import SesiModel from '../models/sesi.model.js'
import {
  createPesananSchema,
  updateItemsPesananSchema,
  updateStatusPesananSchema,
} from '../schemas/pesananSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const findPesananFilter = (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return { _id: idOrCode }
  }
  return { idPesanan: idOrCode }
}

const findMenuByIdOrCode = async (idMenu) => {
  if (mongoose.Types.ObjectId.isValid(idMenu)) {
    return await MenuModel.findById(idMenu)
  }
  return await MenuModel.findOne({ kode: idMenu.toUpperCase() })
}

class PesananController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.nomorKartu) filter.nomorKartu = String(req.query.nomorKartu)
      if (req.query.idSesi) filter.idSesi = req.query.idSesi
      if (req.query.status) filter.status = req.query.status
      if (req.query.idGerai) {
        filter.$or = [
          { idGerai: req.query.idGerai },
          { 'items.idGerai': req.query.idGerai },
        ]
      }

      const listPesanan = await PesananModel.find(filter).sort({ waktuPesan: -1 })
      return apiResponse({
        res,
        status: 200,
        message: 'Daftar pesanan',
        data: listPesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async byKartu(req, res, next) {
    try {
      const listPesanan = await PesananModel.find({
        nomorKartu: String(req.params.nomorKartu),
      }).sort({ waktuPesan: -1 })

      return apiResponse({
        res,
        status: 200,
        message: `Daftar pesanan kartu ${req.params.nomorKartu}`,
        data: listPesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async byGerai(req, res, next) {
    try {
      const idGerai = req.params.idGerai
      const listPesanan = await PesananModel.find({
        $or: [{ idGerai }, { 'items.idGerai': idGerai }],
      }).sort({ waktuPesan: -1 })

      return apiResponse({
        res,
        status: 200,
        message: `Daftar pesanan gerai ${idGerai}`,
        data: listPesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async bySesi(req, res, next) {
    try {
      const listPesanan = await PesananModel.find({
        idSesi: req.params.idSesi,
      }).sort({ waktuPesan: -1 })

      return apiResponse({
        res,
        status: 200,
        message: `Daftar pesanan sesi ${req.params.idSesi}`,
        data: listPesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const pesanan = await PesananModel.findOne(findPesananFilter(req.params.id))
      if (!pesanan) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Detail pesanan',
        data: pesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    const result = createPesananSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const {
        idPesanan,
        nomorKartu,
        nomorMeja,
        idGerai,
        namaGerai,
        idSesi,
        sumber,
        catatan,
        items,
      } = result.data

      const normalizedItems = []
      let calculatedTotal = 0

      for (const item of items) {
        const menu = await findMenuByIdOrCode(item.idMenu)
        if (!menu || menu.aktif === false) {
          return apiResponse({
            res,
            status: 404,
            message: `Menu '${item.namaMenu || item.idMenu}' tidak ditemukan atau tidak aktif`,
          })
        }
        if (menu.isHabis) {
          return apiResponse({
            res,
            status: 400,
            message: `Menu '${menu.nama}' sedang habis`,
          })
        }

        const hargaSaatItu = menu.harga
        const subtotal = hargaSaatItu * item.jumlah
        calculatedTotal += subtotal

        normalizedItems.push({
          idMenu: menu._id.toString(),
          namaMenu: menu.nama,
          idGerai: menu.idGerai,
          namaGerai: menu.namaGerai,
          hargaSaatItu,
          jumlah: item.jumlah,
          subtotal,
          catatan: item.catatan || '',
        })
      }

      const randomCode = Math.floor(1000 + Math.random() * 9000)
      const generatedId = idPesanan || `TRX-${nomorKartu}${randomCode}`

      const newPesanan = await PesananModel.create({
        idPesanan: generatedId,
        idSesi: idSesi || null,
        nomorKartu,
        nomorMeja: nomorMeja ?? null,
        idGerai: idGerai || (normalizedItems.length === 1 ? normalizedItems[0].idGerai : null),
        namaGerai: namaGerai || (normalizedItems.length === 1 ? normalizedItems[0].namaGerai : null),
        status: 'menunggu_bayar',
        sumber,
        items: normalizedItems,
        total: calculatedTotal,
        catatan: catatan || '',
        waktuPesan: new Date(),
      })

      if (idSesi) {
        await SesiModel.findOneAndUpdate(
          { idSesi },
          { $inc: { totalTagihan: calculatedTotal } },
        )
      }

      return apiResponse({
        res,
        status: 201,
        message: 'Pesanan berhasil dibuat',
        data: newPesanan,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async updateStatus(req, res, next) {
    const result = updateStatusPesananSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const updated = await PesananModel.findOneAndUpdate(
        findPesananFilter(req.params.id),
        { status: result.data.status },
        { returnDocument: 'after' },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Status pesanan berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async updateItems(req, res, next) {
    const result = updateItemsPesananSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const normalizedItems = []
      let calculatedTotal = 0

      for (const item of result.data.items) {
        const menu = await findMenuByIdOrCode(item.idMenu)
        if (!menu) {
          return apiResponse({
            res,
            status: 404,
            message: `Menu '${item.namaMenu || item.idMenu}' tidak ditemukan`,
          })
        }

        const subtotal = menu.harga * item.jumlah
        calculatedTotal += subtotal

        normalizedItems.push({
          idMenu: menu._id.toString(),
          namaMenu: menu.nama,
          idGerai: menu.idGerai,
          namaGerai: menu.namaGerai,
          hargaSaatItu: menu.harga,
          jumlah: item.jumlah,
          subtotal,
          catatan: item.catatan || '',
        })
      }

      const updated = await PesananModel.findOneAndUpdate(
        findPesananFilter(req.params.id),
        { items: normalizedItems, total: calculatedTotal },
        { returnDocument: 'after' },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Item pesanan berhasil diperbarui',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async batal(req, res, next) {
    try {
      const updated = await PesananModel.findOneAndUpdate(
        findPesananFilter(req.params.id),
        { status: 'batal' },
        { returnDocument: 'after' },
      )

      if (!updated) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Pesanan berhasil dibatalkan',
        data: updated,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default PesananController
