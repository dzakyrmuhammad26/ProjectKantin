import { RekapHarianGerai, RingkasanDashboard } from '@/models/laporan';
import { REKAP_HARIAN_GERAI, RINGKASAN_DASHBOARD_HARI_INI } from '@/data/laporanData';
import { storage } from '@/services/storage';

export const laporanApi = {
  async dapatkanRekapHarianGerai(): Promise<RekapHarianGerai[]> {
    // Hitung dinamis dari orders yang tersimpan di storage jika ada
    const orders = storage.getOrders();
    const geraiList = storage.getGerai();

    // Jika tidak ada transaksi baru, kembalikan data mock rekap awal
    if (orders.length === 0) {
      return Promise.resolve(REKAP_HARIAN_GERAI);
    }

    const rekapMap: Record<string, RekapHarianGerai> = {};
    for (const g of geraiList) {
      rekapMap[g.id] = {
        idGerai: g.id,
        namaGerai: g.nama,
        tanggal: 'Hari Ini',
        totalTransaksi: 0,
        totalPorsi: 0,
        totalOmzet: 0,
      };
    }

    for (const order of orders) {
      // Hanya hitung pesanan yang lunas (siap_dibuat / selesai)
      if (
        order.status === 'siap_dibuat' ||
        order.status === 'selesai' ||
        order.status === 'ready_to_prepare' ||
        order.status === 'completed'
      ) {
        for (const item of order.items) {
          const sId = item.menuItem.stallId || item.menuItem.idGerai;
          if (rekapMap[sId]) {
            rekapMap[sId].totalPorsi += item.qty || item.jumlah || 1;
            rekapMap[sId].totalOmzet += (item.menuItem.price || item.menuItem.harga || 0) * (item.qty || item.jumlah || 1);
            rekapMap[sId].totalTransaksi += 1;
          }
        }
      }
    }

    return Promise.resolve(Object.values(rekapMap));
  },

  async dapatkanRingkasanDashboard(): Promise<RingkasanDashboard> {
    const orders = storage.getOrders();
    let omzetHariIni = 0;
    let totalTransaksi = 0;
    let totalPelangganAktif = 0;

    for (const order of orders) {
      if (
        order.status === 'siap_dibuat' ||
        order.status === 'selesai' ||
        order.status === 'ready_to_prepare' ||
        order.status === 'completed'
      ) {
        omzetHariIni += order.total;
        totalTransaksi++;
      } else if (
        order.status === 'menunggu_bayar' ||
        order.status === 'pending_payment'
      ) {
        totalPelangganAktif++;
      }
    }

    const rataRataPerTransaksi =
      totalTransaksi > 0 ? Math.round(omzetHariIni / totalTransaksi) : 0;

    return Promise.resolve({
      omzetHariIni: omzetHariIni || RINGKASAN_DASHBOARD_HARI_INI.omzetHariIni,
      totalTransaksi: totalTransaksi || RINGKASAN_DASHBOARD_HARI_INI.totalTransaksi,
      totalPelangganAktif: totalPelangganAktif || RINGKASAN_DASHBOARD_HARI_INI.totalPelangganAktif,
      rataRataPerTransaksi: rataRataPerTransaksi || RINGKASAN_DASHBOARD_HARI_INI.rataRataPerTransaksi,
    });
  },
};
