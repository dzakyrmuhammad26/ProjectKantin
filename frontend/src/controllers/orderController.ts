import { pesananApi } from '@/api/pesananApi';
import { CartItem, Order, Pesanan } from '@/models/pesanan';
import cartController from './cartController';

class OrderController {
  async createOrder(
    cardNumber: string,
    items: CartItem[],
    totalAmount: number,
    nomorMeja?: number
  ): Promise<Order> {
    if (items.length === 0) {
      throw new Error('Keranjang belanja kosong');
    }

    const val = cartController.validateCardNumber(cardNumber);
    if (!val.valid) {
      throw new Error(val.error || 'Nomor kartu fisik tidak valid');
    }

    return await pesananApi.buatPesanan({
      nomorKartu: cardNumber.trim(),
      items: [...items],
      total: totalAmount,
      nomorMeja,
      sumber: 'pelanggan',
    });
  }

  async getLastOrder(): Promise<Order | null> {
    return await pesananApi.dapatkanPesananTerakhir();
  }

  async getOrdersByCard(cardNumber: string): Promise<Pesanan[]> {
    return await pesananApi.dapatkanBerdasarkanNomorKartu(cardNumber.trim());
  }

  groupOrderItemsByStall(items: CartItem[]): Record<string, CartItem[]> {
    const grouped: Record<string, CartItem[]> = {};
    for (const item of items) {
      const sId = item.menuItem.stallId || item.menuItem.idGerai;
      if (!grouped[sId]) {
        grouped[sId] = [];
      }
      grouped[sId].push(item);
    }
    return grouped;
  }
}

const orderController = new OrderController();
export { orderController };
export default orderController;
