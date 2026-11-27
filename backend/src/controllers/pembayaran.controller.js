import mongoose from 'mongoose'
import PembayaranModel from '../models/pembayaran.model.js'
import PesananModel from '../models/pesanan.model.js'
import { prosesPembayaranSchema } from '../schemas/pembayaranSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const buildOrderFilter = (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    return { _id: idOrCode }
  }
  return { idPesanan: idOrCode }
}

class PembayaranController {
  static async index(req, res, next) {
    try {
      const filter = {}
      if (req.query.idKasir) filter.idKasir = req.query.idKasir
      if (req.query.metode) filter.metode = req.query.metode

      const listPembayaran = await PembayaranModel.find(filter).sort({ waktuBayar: -1 })
      return apiResponse({
        res,
        status: 200,
        message: 'Riwayat pembayaran',
        data: listPembayaran,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async show(req, res, next) {
    try {
      const pembayaran = await PembayaranModel.findById(req.params.id)
      if (!pembayaran) {
        return apiResponse({
          res,
          status: 404,
          message: 'Data pembayaran tidak ditemukan',
        })
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Detail pembayaran',
        data: pembayaran,
      })
    } catch (error) {
      return next(error)
    }
  }

  static async proses(req, res, next) {
    const result = prosesPembayaranSchema.safeParse(req.body)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const {
        idPesanan,
        idPesananList,
        idSesi,
        metode,
        totalTagihan,
        uangDiterima,
        referensiQris,
        idKasir,
      } = result.data

      const targetIds = idPesananList && idPesananList.length > 0 ? idPesananList : [idPesanan]
      const updatedOrders = []

      for (const targetId of targetIds) {
        const order = await PesananModel.findOne(buildOrderFilter(targetId))
        if (!order) {
          return apiResponse({
            res,
            status: 404,
            message: `Pesanan dengan ID ${targetId} tidak ditemukan`,
          })
        }

        order.status = 'siap_dibuat'
        await order.save()
        updatedOrders.push(order)
      }

      const isCash = metode === 'tunai' || metode === 'cash'
      const kembalian = isCash ? Math.max(0, uangDiterima - totalTagihan) : 0

      const pembayaran = await PembayaranModel.create({
        idPesanan: targetIds.join(','),
        idSesi: idSesi || updatedOrders[0]?.idSesi || null,
        metode,
        totalTagihan,
        uangDiterima,
        kembalian,
        referensiQris: referensiQris || null,
        idKasir: idKasir || req.user?.id || null,
        waktuBayar: new Date(),
      })

      return apiResponse({
        res,
        status: 201,
        message: 'Pembayaran berhasil diproses',
        data: {
          pembayaran,
          pesanan: updatedOrders.length === 1 ? updatedOrders[0] : updatedOrders,
        },
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default PembayaranController
