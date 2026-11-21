import { orderApi } from '@/api';
import { CartItem, Order } from '@/models';

export const orderController = {
  async createOrder(
    cardNumber: string,
    items: CartItem[],
    totalAmount: number
  ): Promise<Order> {
    if (items.length === 0) {
      throw new Error('Keranjang belanja kosong');
    }
    if (!cardNumber || !cardNumber.trim()) {
      throw new Error('Nomor kartu pelanggan harus diisi');
    }

    return await orderApi.create({
      cardNumber: cardNumber.trim(),
      items: [...items],
      total: totalAmount,
    });
  },

  async getLastOrder(): Promise<Order | null> {
    return await orderApi.getLastOrder();
  },

  groupOrderItemsByStall(items: CartItem[]): Record<string, CartItem[]> {
    const grouped: Record<string, CartItem[]> = {};
    for (const item of items) {
      const sId = item.menuItem.stallId;
      if (!grouped[sId]) {
        grouped[sId] = [];
      }
      grouped[sId].push(item);
    }
    return grouped;
  },
};
