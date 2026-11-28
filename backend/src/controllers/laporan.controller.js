import GeraiModel from '../models/gerai.model.js'
import PembayaranModel from '../models/pembayaran.model.js'
import PesananModel from '../models/pesanan.model.js'
import SesiModel from '../models/sesi.model.js'
import { laporanQuerySchema } from '../schemas/laporanSchema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'

const getTodayWibString = () => {
  const nowWib = new Date(Date.now() + 7 * 60 * 60 * 1000)
  return nowWib.toISOString().slice(0, 10)
}

const buildDateFilter = (query, dateField) => {
  if (query.all === 'true') {
    return { filter: undefined, label: 'semua' }
  }

  const today = getTodayWibString()
  const startStr = query.startDate || query.tanggal || today
  const endStr = query.endDate || query.tanggal || startStr

  const gte = new Date(`${startStr}T00:00:00.000+07:00`)
  const lte = new Date(`${endStr}T23:59:59.999+07:00`)

  return {
    filter: { [dateField]: { gte, lte } },
    label: startStr === endStr ? startStr : `${startStr} s/d ${endStr}`,
  }
}

class LaporanController {
  static async rekapGerai(req, res, next) {
    const result = laporanQuerySchema.safeParse(req.query)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const { filter: dateFilter, label: tanggalLabel } = buildDateFilter(
        result.data,
        'waktuPesan',
      )

      const geraiList = await GeraiModel.findMany({
        where: { aktif: true },
        orderBy: { kode: 'asc' },
      })
      const paidOrders = await PesananModel.findMany({
        where: {
          status: { in: ['siap_dibuat', 'selesai'] },
          ...(dateFilter && dateFilter),
        },
        include: { items: true },
      })

      const rekapMap = {}
      const orderSetsPerGerai = {}

      for (const g of geraiList) {
        rekapMap[g.kode] = {
          idGerai: g.kode,
          namaGerai: g.nama,
          tanggal: tanggalLabel,
          totalTransaksi: 0,
          totalPorsi: 0,
          totalOmzet: 0,
        }
        orderSetsPerGerai[g.kode] = new Set()
      }

      for (const order of paidOrders) {
        for (const item of order.items || []) {
          if (item.statusItem === 'batal') continue

          const kodeGerai = item.idGerai || order.idGerai
          if (kodeGerai && rekapMap[kodeGerai]) {
            rekapMap[kodeGerai].totalPorsi += item.jumlah || 1
            rekapMap[kodeGerai].totalOmzet +=
              item.subtotal || item.hargaSaatItu * (item.jumlah || 1)
            orderSetsPerGerai[kodeGerai].add(String(order.id))
          }
        }
      }

      for (const kode of Object.keys(rekapMap)) {
        rekapMap[kode].totalTransaksi = orderSetsPerGerai[kode].size
      }

      return apiResponse({
        res,
        status: 200,
        message: 'Rekapitulasi harian per gerai',
        data: Object.values(rekapMap),
      })
    } catch (error) {
      return next(error)
    }
  }

  static async ringkasan(req, res, next) {
    const result = laporanQuerySchema.safeParse(req.query)
    if (!result.success) {
      return apiResponseValidation({ res, errors: result.error })
    }

    try {
      const { filter: orderDateFilter, label: tanggalLabel } = buildDateFilter(
        result.data,
        'waktuPesan',
      )
      const { filter: paymentDateFilter } = buildDateFilter(
        result.data,
        'waktuBayar',
      )

      const [orders, payments, totalSesiAktif] = await Promise.all([
        PesananModel.findMany({
          where: orderDateFilter,
          select: { status: true, total: true },
        }),
        PembayaranModel.findMany({
          where: paymentDateFilter,
          select: { metode: true, totalTagihan: true },
        }),
        SesiModel.count({
          where: { status: 'aktif' },
        }),
      ])

      let omzetHariIni = 0
      let totalTransaksi = 0
      let totalPelangganAktif = 0
      let totalPesananSelesai = 0
      let totalPesananDiproses = 0

      for (const order of orders) {
        if (order.status === 'siap_dibuat' || order.status === 'selesai') {
          omzetHariIni += order.total || 0
          totalTransaksi += 1
          if (order.status === 'selesai') totalPesananSelesai += 1
          else totalPesananDiproses += 1
        } else if (order.status === 'menunggu_bayar') {
          totalPelangganAktif += 1
        }
      }

      const rincianMetodeBayar = { tunai: 0, qris: 0, debit: 0 }
      for (const pay of payments) {
        const amount = pay.totalTagihan || 0
        if (pay.metode === 'tunai' || pay.metode === 'cash') {
          rincianMetodeBayar.tunai += amount
        } else if (pay.metode === 'qris') {
          rincianMetodeBayar.qris += amount
        } else if (pay.metode === 'debit') {
          rincianMetodeBayar.debit += amount
        }
      }

      const rataRataPerTransaksi =
        totalTransaksi > 0 ? Math.round(omzetHariIni / totalTransaksi) : 0

      return apiResponse({
        res,
        status: 200,
        message: 'Ringkasan dashboard kantin',
        data: {
          tanggal: tanggalLabel,
          omzetHariIni,
          totalTransaksi,
          totalPelangganAktif,
          rataRataPerTransaksi,
          totalSesiAktif,
          totalPesananSelesai,
          totalPesananDiproses,
          rincianMetodeBayar,
        },
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default LaporanController
