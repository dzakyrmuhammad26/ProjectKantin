import { cashierApi } from '@/api';
import { cartController } from './cartController';
import { CartItem, Order, OrderStatus, PaymentDetails, PaymentMethod } from '@/models';
import { formatTime } from '@/utils';

export interface ShiftSummary {
  totalRevenue: number;
  cashRevenue: number;
  qrisRevenue: number;
  pendingCount: number;
  paidCount: number;
  completedCount: number;
  totalOrders: number;
}

export const cashierController = {
  async getOrders(statusFilter: 'all' | OrderStatus = 'all'): Promise<Order[]> {
    const all = await cashierApi.getAllOrders();
    if (statusFilter === 'all') {
      return all;
    }
    return all.filter((o) => o.status === statusFilter);
  },

  searchOrders(orders: Order[], query: string): Order[] {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const matchCard = o.cardNumber.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) =>
        i.menuItem.name.toLowerCase().includes(q)
      );
      return matchCard || matchId || matchItem;
    });
  },

  calculateChange(totalAmount: number, cashGiven: number): number {
    return Math.max(0, cashGiven - totalAmount);
  },

  async processPayment(
    orderId: string,
    method: PaymentMethod,
    amountPaid: number,
    totalAmount: number
  ): Promise<Order> {
    if (method === 'cash' && amountPaid < totalAmount) {
      throw new Error(
        `Jumlah uang tunai kurang. Total: Rp ${totalAmount}, Diterima: Rp ${amountPaid}`
      );
    }

    const change = method === 'cash' ? Math.max(0, amountPaid - totalAmount) : 0;

    const payment: PaymentDetails = {
      method,
      amountPaid: method === 'cash' ? amountPaid : totalAmount,
      change,
      paidAt: formatTime(),
    };

    return await cashierApi.processPayment(orderId, payment);
  },

  async updateOrderItems(
    orderId: string,
    updatedItems: CartItem[]
  ): Promise<Order> {
    if (updatedItems.length === 0) {
      // If all items removed, cancel the order
      return await cashierApi.cancelOrder(orderId);
    }

    const { totalAmount } = cartController.calculateTotals(updatedItems);
    return await cashierApi.updateOrderItems(orderId, updatedItems, totalAmount);
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return await cashierApi.cancelOrder(orderId);
  },

  async markAsCompleted(orderId: string): Promise<Order> {
    return await cashierApi.updateStatus(orderId, 'completed');
  },

  calculateShiftSummary(orders: Order[]): ShiftSummary {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;
    let pendingCount = 0;
    let paidCount = 0;
    let completedCount = 0;

    for (const o of orders) {
      if (o.status === 'pending_payment') {
        pendingCount++;
      } else if (o.status === 'ready_to_prepare') {
        paidCount++;
      } else if (o.status === 'completed') {
        completedCount++;
      }

      // Revenue only counts paid and completed
      if (o.status === 'ready_to_prepare' || o.status === 'completed') {
        totalRevenue += o.total;
        if (o.payment?.method === 'cash') {
          cashRevenue += o.total;
        } else if (o.payment?.method === 'qris') {
          qrisRevenue += o.total;
        }
      }
    }

    return {
      totalRevenue,
      cashRevenue,
      qrisRevenue,
      pendingCount,
      paidCount,
      completedCount,
      totalOrders: orders.length,
    };
  },
};
