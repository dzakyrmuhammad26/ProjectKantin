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
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const PESANAN_INCLUDE = {
  items: true,
  pembayaran: true,
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

class PesananController {
  static async index(req, res, next) {
    try {
      const where = {}
      if (req.query.nomorKartu) where.nomorKartu = String(req.query.nomorKartu)
      if (req.query.idSesi) where.idSesi = req.query.idSesi
      if (req.query.status) where.status = req.query.status
      if (req.query.idGerai) {
        where.OR = [
          { idGerai: req.query.idGerai },
          { items: { some: { idGerai: req.query.idGerai } } },
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
          menuId: menu.id,
          idMenu: String(menu.id),
          namaMenu: menu.nama,
          idGerai: menu.idGerai,
          namaGerai: menu.namaGerai,
          hargaSaatItu,
          jumlah: item.jumlah,
          subtotal,
          catatan: item.catatan || '',
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

        if (idSesi) {
          await tx.sesi.updateMany({
            where: { idSesi },
            data: { totalTagihan: { increment: calculatedTotal } },
          })
        }

        return created
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
    const statusMap = {
      pending_payment: 'menunggu_bayar',
      ready_to_prepare: 'siap_dibuat',
      completed: 'selesai',
      cancelled: 'batal',
    }
    const normalizedBody = {
      ...req.body,
      status: statusMap[req.body?.status] || req.body?.status,
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

      const updated = await PesananModel.update({
        where: { id: existing.id },
        data: { status: result.data.status },
        include: PESANAN_INCLUDE,
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
        })
      }

      const updated = await prisma.$transaction(async (tx) => {
        await tx.itemPesanan.deleteMany({
          where: { pesananId: existing.id },
        })

        return await tx.pesanan.update({
          where: { id: existing.id },
          data: {
            total: calculatedTotal,
            items: {
              create: normalizedItems,
            },
          },
          include: PESANAN_INCLUDE,
        })
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

      const updated = await PesananModel.update({
        where: { id: existing.id },
        data: { status: 'batal' },
        include: PESANAN_INCLUDE,
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
