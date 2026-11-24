import { storage } from '@/services/storage';
import { DetailPembayaran } from '@/models/pembayaran';
import { Pesanan } from '@/models/pesanan';
import { pesananApi } from './pesananApi';

export const pembayaranApi = {
  async prosesPembayaran(
    idPesanan: string,
    pembayaran: DetailPembayaran
  ): Promise<Pesanan> {
    // Simpan data pembayaran ke persistent log
    storage.savePembayaran(pembayaran);

    // Perbarui status pesanan menjadi 'siap_dibuat' (kompatibel: ready_to_prepare)
    const updated = storage.updateOrder(idPesanan, {
      status: 'siap_dibuat',
      pembayaran,
      payment: pembayaran,
    });

    if (!updated) {
      throw new Error(`Pesanan dengan ID ${idPesanan} tidak ditemukan.`);
    }

    return Promise.resolve(updated);
  },

  async prosesPembayaranMulti(
    idPesananList: string[],
    pembayaran: DetailPembayaran
  ): Promise<Pesanan[]> {
    storage.savePembayaran(pembayaran);

    const hasil: Pesanan[] = [];
    for (const id of idPesananList) {
      const updated = storage.updateOrder(id, {
        status: 'siap_dibuat',
        pembayaran,
        payment: pembayaran,
      });
      if (updated) {
        hasil.push(updated);
      }
    }
    return Promise.resolve(hasil);
  },

  async dapatkanSemuaPembayaran(): Promise<DetailPembayaran[]> {
    return Promise.resolve(storage.getPembayaran());
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

  async updateStatus(orderId: string, status: any): Promise<Pesanan> {
    return pesananApi.perbaruiStatus(orderId, status);
  },
};
