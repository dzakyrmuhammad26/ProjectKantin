import GeraiModel from '../models/gerai.model.js'
import PesananModel from '../models/pesanan.model.js'
import { apiResponse } from '../utils/response.js'

class LaporanController {
  static async rekapGerai(req, res, next) {
    try {
      const geraiList = await GeraiModel.findMany({
        where: { aktif: true },
        orderBy: { kode: 'asc' },
      })
      const paidOrders = await PesananModel.findMany({
        where: {
          status: { in: ['siap_dibuat', 'selesai'] },
        },
        include: { items: true },
      })

      const todayLabel = new Date().toISOString().slice(0, 10)
      const rekapMap = {}
      const orderSetsPerGerai = {}

      for (const g of geraiList) {
        rekapMap[g.kode] = {
          idGerai: g.kode,
          namaGerai: g.nama,
          tanggal: todayLabel,
          totalTransaksi: 0,
          totalPorsi: 0,
          totalOmzet: 0,
        }
        orderSetsPerGerai[g.kode] = new Set()
      }

      for (const order of paidOrders) {
        for (const item of order.items || []) {
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
    try {
      const allOrders = await PesananModel.findMany({
        select: { status: true, total: true },
      })

      let omzetHariIni = 0
      let totalTransaksi = 0
      let totalPelangganAktif = 0

      for (const order of allOrders) {
        if (order.status === 'siap_dibuat' || order.status === 'selesai') {
          omzetHariIni += order.total || 0
          totalTransaksi += 1
        } else if (order.status === 'menunggu_bayar') {
          totalPelangganAktif += 1
        }
      }

      const rataRataPerTransaksi =
        totalTransaksi > 0 ? Math.round(omzetHariIni / totalTransaksi) : 0

      return apiResponse({
        res,
        status: 200,
        message: 'Ringkasan dashboard kantin',
        data: {
          omzetHariIni,
          totalTransaksi,
          totalPelangganAktif,
          rataRataPerTransaksi,
        },
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default LaporanController
