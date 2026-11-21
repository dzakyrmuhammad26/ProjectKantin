import { Order } from '@/models';
import { storage } from '@/services';
import { formatTime } from '@/utils';

export const orderApi = {
  async create(orderData: {
    cardNumber: string;
    items: Order['items'];
    total: number;
  }): Promise<Order> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const order: Order = {
      id: `TRX-${orderData.cardNumber}${randomCode}`,
      cardNumber: orderData.cardNumber,
      items: orderData.items,
      total: orderData.total,
      status: 'pending_payment',
      createdAt: formatTime(),
    };

    // Save to last order and orders queue (simulating DB insertion)
    storage.setLastOrder(order);
    storage.saveOrder(order);
    return Promise.resolve(order);
  },

  async getLastOrder(): Promise<Order | null> {
    const order = storage.getLastOrder();
    return Promise.resolve(order);
  },
};
