import { storage } from '@/services/storage';
import { ItemPesanan, Pesanan, StatusPesanan, SumberPesanan } from '@/models/pesanan';
import { formatTime } from '@/utils/formatters';

export const pesananApi = {
  async dapatkanSemua(): Promise<Pesanan[]> {
    return Promise.resolve(storage.getOrders());
  },

  async dapatkanBerdasarkanId(id: string): Promise<Pesanan | null> {
    const orders = storage.getOrders();
    const found = orders.find((o) => o.id === id) || null;
    return Promise.resolve(found);
  },

  async dapatkanBerdasarkanNomorKartu(nomorKartu: string): Promise<Pesanan[]> {
    const orders = storage.getOrders();
    const filtered = orders.filter(
      (o) => o.nomorKartu === nomorKartu || o.cardNumber === nomorKartu
    );
    return Promise.resolve(filtered);
  },

  async dapatkanBerdasarkanGerai(idGerai: string): Promise<Pesanan[]> {
    const orders = storage.getOrders();
    // Cari pesanan yang memiliki idGerai cocok atau item yang stallId-nya cocok
    const filtered = orders.filter((o) => {
      if (o.idGerai === idGerai) return true;
      return o.items.some(
        (item) => item.menuItem.stallId === idGerai || item.menuItem.idGerai === idGerai
      );
    });
    return Promise.resolve(filtered);
  },

  async dapatkanBerdasarkanSesi(idSesi: string): Promise<Pesanan[]> {
    const orders = storage.getOrders();
    const filtered = orders.filter((o) => o.idSesi === idSesi);
    return Promise.resolve(filtered);
  },

  async buatPesanan(data: {
    nomorKartu: string;
    items: ItemPesanan[];
    total: number;
    idGerai?: string;
    namaGerai?: string;
    idSesi?: string;
    nomorMeja?: number;
    catatan?: string;
    sumber?: SumberPesanan;
  }): Promise<Pesanan> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const order: Pesanan = {
      id: `TRX-${data.nomorKartu}${randomCode}`,
      idSesi: data.idSesi,
      nomorKartu: data.nomorKartu,
      cardNumber: data.nomorKartu,
      nomorMeja: data.nomorMeja,
      idGerai: data.idGerai,
      namaGerai: data.namaGerai,
      items: data.items,
      total: data.total,
      status: 'menunggu_bayar',
      sumber: data.sumber || 'pelanggan',
      catatan: data.catatan,
      waktuPesan: formatTime(),
      createdAt: formatTime(),
    };

    storage.setLastOrder(order);
    storage.saveOrder(order);
    return Promise.resolve(order);
  },

  async perbaruiStatus(idPesanan: string, status: StatusPesanan): Promise<Pesanan> {
    const updated = storage.updateOrder(idPesanan, { status });
    if (!updated) {
      throw new Error(`Pesanan dengan ID ${idPesanan} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },

  async perbaruiItem(
    idPesanan: string,
    items: ItemPesanan[],
    total: number
  ): Promise<Pesanan> {
    const updated = storage.updateOrder(idPesanan, { items, total });
    if (!updated) {
      throw new Error(`Pesanan dengan ID ${idPesanan} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },

  async batalkanPesanan(idPesanan: string): Promise<Pesanan> {
    const updated = storage.updateOrder(idPesanan, { status: 'batal' });
    if (!updated) {
      throw new Error(`Pesanan dengan ID ${idPesanan} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },

  async dapatkanPesananTerakhir(): Promise<Pesanan | null> {
    return Promise.resolve(storage.getLastOrder());
  },
};
