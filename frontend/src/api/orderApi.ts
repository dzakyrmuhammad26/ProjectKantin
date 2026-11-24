import { pesananApi } from './pesananApi';
import { Order } from '@/models/pesanan';

export const orderApi = {
  async create(orderData: {
    cardNumber: string;
    items: Order['items'];
    total: number;
  }): Promise<Order> {
    return pesananApi.buatPesanan({
      nomorKartu: orderData.cardNumber,
      items: orderData.items,
      total: orderData.total,
    });
  },

  async getLastOrder(): Promise<Order | null> {
    return pesananApi.dapatkanPesananTerakhir();
  },
};
