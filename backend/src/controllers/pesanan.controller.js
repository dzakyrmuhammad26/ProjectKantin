import { prisma } from '../config/database.js'
import GeraiModel from '../models/gerai.model.js'
import MenuModel from '../models/menu.model.js'
import PesananModel from '../models/pesanan.model.js'
import SesiModel from '../models/sesi.model.js'
import {
  createPesananSchema,
  updateItemsPesananSchema,
  updateStatusPesananSchema,
} from '../schemas/pesananSchema.js'
import { syncPesananState } from '../utils/orderSync.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const PESANAN_INCLUDE = {
  items: true,
  pembayaran: true,
}

const STATUS_MAP = {
  pending_payment: 'menunggu_bayar',
  ready_to_prepare: 'siap_dibuat',
  completed: 'selesai',
  cancelled: 'batal',
}

const findPesananByIdOrCode = async (idOrCode) => {
  if (/^\d+$/.test(String(idOrCode))) {
    const id = Number(idOrCode)
    if (Number.isSafeInteger(id) && id > 0) {
      return await PesananModel.findUnique({
        where: { id },
        include: PESANAN_INCLUDE,
      })
    }
  }
  return await PesananModel.findUnique({
    where: { idPesanan: String(idOrCode) },
    include: PESANAN_INCLUDE,
  })
}

const findMenuByIdOrCode = async (idMenu) => {
  if (/^\d+$/.test(String(idMenu))) {
    const id = Number(idMenu)
    if (Number.isSafeInteger(id) && id > 0) {
      return await MenuModel.findUnique({ where: { id } })
    }
  }
  return await MenuModel.findUnique({ where: { kode: String(idMenu).toUpperCase() } })
}

const hasGeraiOrderAccess = (req, order) => {
  if (req.user?.peran !== 'gerai') return true
  if (!req.user.idGerai) return false
  const userGerai = req.user.idGerai.toUpperCase()
  if (order.idGerai && order.idGerai.toUpperCase() === userGerai) return true
  return (order.items || []).some(
    (item) => item.idGerai && item.idGerai.toUpperCase() === userGerai,
  )
}

class PesananController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.nomorKartu) where.nomorKartu = String(req.query.nomorKartu)
      if (req.query.idSesi) where.idSesi = req.query.idSesi
      if (req.query.status) where.status = req.query.status

      const effectiveGerai =
        req.user?.peran === 'gerai' && req.user.idGerai
          ? req.user.idGerai
          : req.query.idGerai

      if (effectiveGerai) {
        where.OR = [
          { idGerai: effectiveGerai },
          { items: { some: { idGerai: effectiveGerai } } },
        ]
      }

      const listPesanan = await PesananModel.findMany({
        where,
        include: PESANAN_INCLUDE,
        orderBy: { waktuPesan: 'desc' },
      })

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
      const listPesanan = await PesananModel.findMany({
        where: { nomorKartu: String(req.params.nomorKartu) },
        include: PESANAN_INCLUDE,
        orderBy: { waktuPesan: 'desc' },
      })

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
      if (
        req.user?.peran === 'gerai' &&
        (!req.user.idGerai || req.user.idGerai.toUpperCase() !== idGerai.toUpperCase())
      ) {
        return apiResponse({
          res,
          status: 403,
          message: 'Akses ditolak: Anda hanya dapat melihat antrean gerai Anda sendiri',
        })
      }

      const listPesanan = await PesananModel.findMany({
        where: {
          OR: [{ idGerai }, { items: { some: { idGerai } } }],
        },
        include: PESANAN_INCLUDE,
        orderBy: { waktuPesan: 'desc' },
      })

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
      const listPesanan = await PesananModel.findMany({
        where: { idSesi: req.params.idSesi },
        include: PESANAN_INCLUDE,
        orderBy: { waktuPesan: 'desc' },
      })

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
      const pesanan = await findPesananByIdOrCode(req.params.id)
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
        langsungMasak,
        catatan,
        items,
      } = result.data

      if (idSesi) {
        const sesiExists = await SesiModel.findUnique({ where: { idSesi } })
        if (!sesiExists) {
          return apiResponse({
            res,
            status: 404,
            message: `Sesi '${idSesi}' tidak ditemukan`,
          })
        }
      }

      let resolvedGeraiCode = idGerai ? idGerai.toUpperCase() : null
      let resolvedGeraiName = namaGerai || null
      if (resolvedGeraiCode) {
        const geraiExists = await GeraiModel.findUnique({ where: { kode: resolvedGeraiCode } })
        if (!geraiExists) {
          return apiResponse({
            res,
            status: 404,
            message: `Gerai '${resolvedGeraiCode}' tidak ditemukan`,
          })
        }
        resolvedGeraiName = resolvedGeraiName || geraiExists.nama
      }

      const initialItemStatus =
        langsungMasak && (req.user?.peran === 'gerai' || req.user?.peran === 'superadmin')
          ? 'siap_dibuat'
          : 'menunggu_bayar'

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

        if (req.user?.peran === 'gerai' && sumber === 'gerai') {
          if (!req.user.idGerai || menu.idGerai !== req.user.idGerai) {
            return apiResponse({
              res,
              status: 403,
              message: `Akses ditolak: Menu '${menu.nama}' bukan milik gerai Anda`,
            })
          }
        }

        const hargaSaatItu = menu.harga
        const subtotal = hargaSaatItu * item.jumlah
        calculatedTotal += subtotal

        normalizedItems.push({
          menuId: menu.id,
          idMenu: String(menu.id),
          namaMenu: menu.nama,
          idGerai: menu.idGerai,
          namaGerai: menu.namaGerai,
          hargaSaatItu,
          jumlah: item.jumlah,
          subtotal,
          catatan: item.catatan || '',
          statusItem: initialItemStatus,
        })
      }

      if (!resolvedGeraiCode && normalizedItems.length === 1) {
        resolvedGeraiCode = normalizedItems[0].idGerai
        resolvedGeraiName = resolvedGeraiName || normalizedItems[0].namaGerai
      }

      const randomCode = Math.floor(1000 + Math.random() * 9000)
      const generatedId = idPesanan || `TRX-${nomorKartu}${randomCode}`

      const newPesanan = await prisma.$transaction(async (tx) => {
        const created = await tx.pesanan.create({
          data: {
            idPesanan: generatedId,
            idSesi: idSesi || null,
            nomorKartu,
            nomorMeja: nomorMeja ?? null,
            idGerai: resolvedGeraiCode,
            namaGerai: resolvedGeraiName,
            status: 'menunggu_bayar',
            sumber,
            total: calculatedTotal,
            catatan: catatan || '',
            waktuPesan: new Date(),
            items: {
              create: normalizedItems,
            },
          },
          include: PESANAN_INCLUDE,
        })

        return await syncPesananState(tx, created.id)
      })

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
    const normalizedBody = {
      ...req.body,
      status: STATUS_MAP[req.body?.status] || req.body?.status,
    }
    const result = updateStatusPesananSchema.safeParse(normalizedBody)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const existing = await findPesananByIdOrCode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      if (!hasGeraiOrderAccess(req, existing)) {
        return apiResponse({
          res,
          status: 403,
          message: 'Akses ditolak: Anda hanya dapat mengubah status pesanan untuk gerai Anda',
        })
      }

      const nextStatus = result.data.status
      const targetGeraiFilter =
        req.user?.peran === 'gerai'
          ? req.user.idGerai
          : result.data.idGerai || null

      const updated = await prisma.$transaction(async (tx) => {
        const itemWhere = {
          pesananId: existing.id,
          statusItem: { not: 'batal' },
          ...(targetGeraiFilter && { idGerai: targetGeraiFilter }),
        }

        await tx.itemPesanan.updateMany({
          where: itemWhere,
          data: { statusItem: nextStatus },
        })

        return await syncPesananState(tx, existing.id)
      })

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

  static async updateItemStatus(req, res, next) {
    const normalizedBody = {
      ...req.body,
      status: STATUS_MAP[req.body?.status] || req.body?.status,
    }
    const result = updateStatusPesananSchema.safeParse(normalizedBody)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const existing = await findPesananByIdOrCode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      if (!/^\d+$/.test(String(req.params.itemId))) {
        return apiResponse({
          res,
          status: 404,
          message: 'Item pesanan tidak ditemukan',
        })
      }

      const itemId = Number(req.params.itemId)
      const targetItem = existing.items.find((item) => item.id === itemId)
      if (!targetItem) {
        return apiResponse({
          res,
          status: 404,
          message: 'Item pesanan tidak ditemukan pada pesanan ini',
        })
      }

      if (req.user?.peran === 'gerai') {
        if (!req.user.idGerai || targetItem.idGerai !== req.user.idGerai) {
          return apiResponse({
            res,
            status: 403,
            message: 'Akses ditolak: Item pesanan ini bukan milik gerai Anda',
          })
        }
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.itemPesanan.update({
          where: { id: itemId },
          data: { statusItem: result.data.status },
        })

        return await syncPesananState(tx, existing.id)
      })

      return apiResponse({
        res,
        status: 200,
        message: 'Status item pesanan berhasil diperbarui',
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
      const existing = await findPesananByIdOrCode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      if (existing.pembayaranId !== null) {
        return apiResponse({
          res,
          status: 400,
          message: 'Pesanan yang sudah dibayar tidak dapat diubah itemnya',
        })
      }

      if (existing.status === 'batal') {
        return apiResponse({
          res,
          status: 400,
          message: 'Pesanan yang sudah dibatalkan tidak dapat diubah itemnya',
        })
      }

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
          menuId: menu.id,
          idMenu: String(menu.id),
          namaMenu: menu.nama,
          idGerai: menu.idGerai,
          namaGerai: menu.namaGerai,
          hargaSaatItu: menu.harga,
          jumlah: item.jumlah,
          subtotal,
          catatan: item.catatan || '',
          statusItem: 'menunggu_bayar',
        })
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.itemPesanan.deleteMany({
          where: { pesananId: existing.id },
        })

        await tx.pesanan.update({
          where: { id: existing.id },
          data: {
            total: calculatedTotal,
            items: {
              create: normalizedItems,
            },
          },
        })

        return await syncPesananState(tx, existing.id)
      })

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
      const existing = await findPesananByIdOrCode(req.params.id)
      if (!existing) {
        return apiResponse({
          res,
          status: 404,
          message: 'Pesanan tidak ditemukan',
        })
      }

      if (!hasGeraiOrderAccess(req, existing)) {
        return apiResponse({
          res,
          status: 403,
          message: 'Akses ditolak: Anda hanya dapat membatalkan pesanan untuk gerai Anda',
        })
      }

      const targetGeraiFilter =
        req.user?.peran === 'gerai'
          ? req.user.idGerai
          : req.body?.idGerai || null

      const updated = await prisma.$transaction(async (tx) => {
        await tx.itemPesanan.updateMany({
          where: {
            pesananId: existing.id,
            ...(targetGeraiFilter && { idGerai: targetGeraiFilter }),
          },
          data: { statusItem: 'batal' },
        })

        return await syncPesananState(tx, existing.id)
      })

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
