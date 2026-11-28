import { prisma } from '../config/database.js'
import PembayaranModel from '../models/pembayaran.model.js'
import { prosesPembayaranSchema } from '../schemas/pembayaranSchema.js'
import { AppError } from '../utils/appError.js'
import { syncPesananState } from '../utils/orderSync.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const buildOrderWhere = (idOrCode) => {
  if (/^\d+$/.test(String(idOrCode))) {
    const id = Number(idOrCode)
    if (Number.isSafeInteger(id) && id > 0) {
      return { id }
    }
  }
  return { idPesanan: String(idOrCode) }
}

class PembayaranController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.idKasir) where.idKasir = String(req.query.idKasir)
      if (req.query.metode) where.metode = req.query.metode

      const listPembayaran = await PembayaranModel.findMany({
        where,
        orderBy: { waktuBayar: 'desc' },
      })

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
      if (!/^\d+$/.test(String(req.params.id))) {
        return apiResponse({
          res,
          status: 404,
          message: 'Data pembayaran tidak ditemukan',
        })
      }

      const id = Number(req.params.id)
      const pembayaran = await PembayaranModel.findUnique({ where: { id } })
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
      const isCash = metode === 'tunai' || metode === 'cash'
      const kembalian = isCash ? Math.max(0, uangDiterima - totalTagihan) : 0
      const waktuBayar = new Date()
      const rawKasirId = idKasir || req.user?.id || null

      const { pembayaran, updatedOrders } = await prisma.$transaction(async (tx) => {
        const targetOrders = []

        for (const targetId of targetIds) {
          const order = await tx.pesanan.findUnique({
            where: buildOrderWhere(targetId),
          })

          if (!order) {
            throw new AppError(`Pesanan dengan ID ${targetId} tidak ditemukan`, 404)
          }
          if (order.status === 'batal') {
            throw new AppError(
              `Pesanan '${order.idPesanan}' sudah dibatalkan dan tidak dapat dibayar`,
              400,
            )
          }
          if (order.pembayaranId !== null) {
            throw new AppError(`Pesanan '${order.idPesanan}' sudah lunas dibayar`, 400)
          }

          targetOrders.push(order)
        }

        const resolvedIdSesi = idSesi || targetOrders[0]?.idSesi || null
        if (resolvedIdSesi) {
          const sesiExists = await tx.sesi.findUnique({ where: { idSesi: resolvedIdSesi } })
          if (!sesiExists) {
            throw new AppError(`Sesi '${resolvedIdSesi}' tidak ditemukan`, 404)
          }
        }

        let resolvedKasirId = null
        if (rawKasirId && /^\d+$/.test(String(rawKasirId))) {
          const parsedKasirId = Number(rawKasirId)
          if (Number.isSafeInteger(parsedKasirId) && parsedKasirId > 0) {
            const kasirUser = await tx.user.findUnique({ where: { id: parsedKasirId } })
            if (kasirUser) resolvedKasirId = kasirUser.id
          }
        }

        const createdPayment = await tx.pembayaran.create({
          data: {
            idPesanan: targetIds.join(','),
            idSesi: resolvedIdSesi,
            kasirId: resolvedKasirId,
            idKasir: resolvedKasirId ? String(resolvedKasirId) : rawKasirId ? String(rawKasirId) : null,
            metode,
            totalTagihan,
            uangDiterima,
            kembalian,
            referensiQris: referensiQris || null,
            waktuBayar,
          },
        })

        const orders = []
        for (const order of targetOrders) {
          await tx.pesanan.update({
            where: { id: order.id },
            data: {
              pembayaranId: createdPayment.id,
            },
          })

          // Majukan item yang masih menunggu_bayar ke siap_dibuat; biarkan yang sudah selesai/batal tetap
          await tx.itemPesanan.updateMany({
            where: {
              pesananId: order.id,
              statusItem: 'menunggu_bayar',
            },
            data: { statusItem: 'siap_dibuat' },
          })

          const syncedOrder = await syncPesananState(tx, order.id)
          orders.push(syncedOrder)
        }

        return { pembayaran: createdPayment, updatedOrders: orders }
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
