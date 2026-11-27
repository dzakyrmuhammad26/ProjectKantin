import { DetailPembayaran } from '@/models/pembayaran';
import { Pesanan, StatusPesanan } from '@/models/pesanan';
import { apiRequest } from './httpClient';
import { mapPembayaran, mapPesanan } from './mappers';
import { pesananApi } from './pesananApi';

export const pembayaranApi = {
  async prosesPembayaran(
    idPesanan: string,
    pembayaran: DetailPembayaran
  ): Promise<Pesanan> {
    const metode = pembayaran.metode || pembayaran.method || 'tunai';
    const uangDiterima = Number(pembayaran.uangDiterima ?? pembayaran.amountPaid ?? 0);

    let totalTagihan = pembayaran.totalTagihan;
    if (totalTagihan === undefined) {
      const order = await pesananApi.dapatkanBerdasarkanId(idPesanan);
      totalTagihan =
        order?.total ?? Math.max(0, uangDiterima - Number(pembayaran.kembalian ?? pembayaran.change ?? 0));
    }

    const res = await apiRequest<{ pembayaran: any; pesanan: any }>('/pembayaran', {
      method: 'POST',
      body: JSON.stringify({
        idPesanan,
        metode,
        totalTagihan,
        uangDiterima,
        kembalian: pembayaran.kembalian ?? pembayaran.change ?? 0,
        referensiQris: pembayaran.referensiQris ?? null,
        idKasir: pembayaran.idKasir ?? null,
      }),
    });

    return mapPesanan(res.pesanan);
  },

  async prosesPembayaranMulti(
    idPesananList: string[],
    pembayaran: DetailPembayaran
  ): Promise<Pesanan[]> {
    const metode = pembayaran.metode || pembayaran.method || 'tunai';
    const uangDiterima = Number(pembayaran.uangDiterima ?? pembayaran.amountPaid ?? 0);

    let totalTagihan = pembayaran.totalTagihan;
    if (totalTagihan === undefined) {
      const orders = await Promise.all(
        idPesananList.map((id) => pesananApi.dapatkanBerdasarkanId(id))
      );
      totalTagihan = orders.reduce((acc, o) => acc + (o?.total ?? 0), 0);
    }

    const res = await apiRequest<{ pembayaran: any; pesanan: any[] | any }>('/pembayaran', {
      method: 'POST',
      body: JSON.stringify({
        idPesananList,
        metode,
        totalTagihan,
        uangDiterima,
        kembalian: pembayaran.kembalian ?? pembayaran.change ?? 0,
        referensiQris: pembayaran.referensiQris ?? null,
        idKasir: pembayaran.idKasir ?? null,
      }),
    });

    const list = Array.isArray(res.pesanan) ? res.pesanan : [res.pesanan];
    return list.map(mapPesanan);
  },

  async dapatkanSemuaPembayaran(): Promise<DetailPembayaran[]> {
    const list = await apiRequest<any[]>('/pembayaran');
    return list.map(mapPembayaran);
  },
};

// Wrapper kompatibilitas cashierApi
export const cashierApi = {
  async getAllOrders(): Promise<Pesanan[]> {
    return pesananApi.dapatkanSemua();
  },

  async getOrderById(orderId: string): Promise<Pesanan | null> {
    return pesananApi.dapatkanBerdasarkanId(orderId);
  },

  async processPayment(orderId: string, payment: DetailPembayaran): Promise<Pesanan> {
    return pembayaranApi.prosesPembayaran(orderId, payment);
  },

  async cancelOrder(orderId: string): Promise<Pesanan> {
    return pesananApi.batalkanPesanan(orderId);
  },

  async updateOrderItems(
    orderId: string,
    items: Pesanan['items'],
    total: number
  ): Promise<Pesanan> {
    return pesananApi.perbaruiItem(orderId, items, total);
  },

  async updateStatus(orderId: string, status: StatusPesanan): Promise<Pesanan> {
    return pesananApi.perbaruiStatus(orderId, status);
  },
};
