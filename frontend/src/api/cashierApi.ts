import { Order, OrderStatus, PaymentDetails, CartItem } from '@/models';
import { storage } from '@/services';

export const cashierApi = {
  async getAllOrders(): Promise<Order[]> {
    return Promise.resolve(storage.getOrders());
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = storage.getOrders();
    const found = orders.find((o) => o.id === orderId) || null;
    return Promise.resolve(found);
  },

  async processPayment(orderId: string, payment: PaymentDetails): Promise<Order> {
    const updated = storage.updateOrder(orderId, {
      status: 'ready_to_prepare',
      payment,
    });

    if (!updated) {
      throw new Error(`Pesanan dengan ID ${orderId} tidak ditemukan.`);
    }

    return Promise.resolve(updated);
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const updated = storage.updateOrder(orderId, {
      status: 'cancelled',
    });

    if (!updated) {
      throw new Error(`Pesanan dengan ID ${orderId} tidak ditemukan.`);
    }

    return Promise.resolve(updated);
  },

  async updateOrderItems(
    orderId: string,
    items: CartItem[],
    total: number
  ): Promise<Order> {
    const updated = storage.updateOrder(orderId, {
      items,
      total,
    });

    if (!updated) {
      throw new Error(`Pesanan dengan ID ${orderId} tidak ditemukan.`);
    }

    return Promise.resolve(updated);
  },

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updated = storage.updateOrder(orderId, { status });
    if (!updated) {
      throw new Error(`Pesanan dengan ID ${orderId} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },
};
