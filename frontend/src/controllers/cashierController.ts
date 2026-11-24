import { cashierApi, pembayaranApi } from '@/api/pembayaranApi';
import { pesananApi } from '@/api/pesananApi';
import cartController from './cartController';
import { CartItem, Order, OrderStatus } from '@/models/pesanan';
import { DetailPembayaran, PaymentDetails, PaymentMethod } from '@/models/pembayaran';
import { formatTime } from '@/utils/formatters';

class CashierController {
  async getOrders(statusFilter: 'all' | OrderStatus = 'all'): Promise<Order[]> {
    const all = await pesananApi.dapatkanSemua();
    if (statusFilter === 'all') {
      return all;
    }
    return all.filter((o) => {
      if (statusFilter === 'pending_payment' || statusFilter === 'menunggu_bayar') {
        return o.status === 'pending_payment' || o.status === 'menunggu_bayar';
      }
      if (statusFilter === 'ready_to_prepare' || statusFilter === 'siap_dibuat') {
        return o.status === 'ready_to_prepare' || o.status === 'siap_dibuat';
      }
      if (statusFilter === 'completed' || statusFilter === 'selesai') {
        return o.status === 'completed' || o.status === 'selesai';
      }
      if (statusFilter === 'cancelled' || statusFilter === 'batal') {
        return o.status === 'cancelled' || o.status === 'batal';
      }
      return o.status === statusFilter;
    });
  }

  searchOrders(orders: Order[], query: string): Order[] {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const matchCard = (o.cardNumber || o.nomorKartu || '').toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => {
        const name = i.menuItem?.name || i.menuItem?.nama || '';
        return name.toLowerCase().includes(q);
      });
      return matchCard || matchId || matchItem;
    });
  }

  calculateChange(totalAmount: number, cashGiven: number): number {
    return Math.max(0, cashGiven - totalAmount);
  }

  async processPayment(
    orderId: string,
    method: PaymentMethod,
    amountPaid: number,
    totalAmount: number,
    idKasir?: string
  ): Promise<Order> {
    if ((method === 'cash' || method === 'tunai') && amountPaid < totalAmount) {
      throw new Error(
        `Jumlah uang tunai kurang. Total: Rp ${totalAmount}, Diterima: Rp ${amountPaid}`
      );
    }

    const change =
      method === 'cash' || method === 'tunai' ? Math.max(0, amountPaid - totalAmount) : 0;

    const payment: PaymentDetails = {
      method,
      metode: method,
      amountPaid: method === 'cash' || method === 'tunai' ? amountPaid : totalAmount,
      uangDiterima: method === 'cash' || method === 'tunai' ? amountPaid : totalAmount,
      change,
      kembalian: change,
      paidAt: formatTime(),
      waktuBayar: formatTime(),
      idKasir,
    };

    return await cashierApi.processPayment(orderId, payment);
  }

  async processMultiOrderPayment(
    orderIds: string[],
    method: PaymentMethod,
    amountPaid: number,
    totalAmount: number,
    idKasir?: string
  ): Promise<Order[]> {
    if ((method === 'cash' || method === 'tunai') && amountPaid < totalAmount) {
      throw new Error(
        `Jumlah uang tunai kurang. Total: Rp ${totalAmount}, Diterima: Rp ${amountPaid}`
      );
    }

    const change =
      method === 'cash' || method === 'tunai' ? Math.max(0, amountPaid - totalAmount) : 0;

    const payment: DetailPembayaran = {
      method,
      metode: method,
      amountPaid: method === 'cash' || method === 'tunai' ? amountPaid : totalAmount,
      uangDiterima: method === 'cash' || method === 'tunai' ? amountPaid : totalAmount,
      change,
      kembalian: change,
      paidAt: formatTime(),
      waktuBayar: formatTime(),
      idKasir,
    };

    return await pembayaranApi.prosesPembayaranMulti(orderIds, payment);
  }

  async updateOrderItems(
    orderId: string,
    updatedItems: CartItem[]
  ): Promise<Order> {
    if (updatedItems.length === 0) {
      return await cashierApi.cancelOrder(orderId);
    }

    const { totalAmount } = cartController.calculateTotals(updatedItems);
    return await cashierApi.updateOrderItems(orderId, updatedItems, totalAmount);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return await cashierApi.cancelOrder(orderId);
  }

  async markAsCompleted(orderId: string): Promise<Order> {
    return await cashierApi.updateStatus(orderId, 'completed');
  }

  calculateShiftSummary(orders: Order[]) {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;
    let pendingCount = 0;
    let paidCount = 0;
    let completedCount = 0;

    for (const order of orders) {
      const isPaid =
        order.status === 'ready_to_prepare' ||
        order.status === 'siap_dibuat' ||
        order.status === 'completed' ||
        order.status === 'selesai';

      if (isPaid) {
        totalRevenue += order.total;
        const method = order.payment?.method || order.pembayaran?.metode;
        if (method === 'cash' || method === 'tunai') {
          cashRevenue += order.total;
        } else if (method === 'qris') {
          qrisRevenue += order.total;
        }
      }

      if (order.status === 'pending_payment' || order.status === 'menunggu_bayar') pendingCount++;
      if (order.status === 'ready_to_prepare' || order.status === 'siap_dibuat') paidCount++;
      if (order.status === 'completed' || order.status === 'selesai') completedCount++;
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
  }
}

const cashierController = new CashierController();
export { cashierController };
export default cashierController;
