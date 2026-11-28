import { pembayaranApi } from '@/api/pembayaranApi';
import { pesananApi } from '@/api/pesananApi';
import { sesiApi } from '@/api/sesiApi';
import cartController from './cartController';
import { CartItem, Order, OrderStatus } from '@/models/pesanan';
import { DetailPembayaran, PaymentDetails, PaymentMethod } from '@/models/pembayaran';
import { formatTime, isCashMethod } from '@/utils/formatters';

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
    options?: {
      idKasir?: string;
      referensiQris?: string;
    }
  ): Promise<Order> {
    const normalizedMethod: PaymentMethod = method === 'cash' ? 'tunai' : method;
    const isCash = isCashMethod(normalizedMethod);

    if (isCash && amountPaid < totalAmount) {
      throw new Error(
        `Jumlah uang tunai kurang. Total: Rp ${totalAmount}, Diterima: Rp ${amountPaid}`
      );
    }

    const effectivePaid = isCash ? amountPaid : totalAmount;
    const change = isCash ? Math.max(0, amountPaid - totalAmount) : 0;

    const payment: PaymentDetails = {
      method: normalizedMethod,
      metode: normalizedMethod,
      totalTagihan: totalAmount,
      amountPaid: effectivePaid,
      uangDiterima: effectivePaid,
      change,
      kembalian: change,
      paidAt: formatTime(),
      waktuBayar: formatTime(),
      idKasir: options?.idKasir,
      referensiQris: normalizedMethod === 'qris' ? options?.referensiQris : undefined,
    };

    const updatedOrder = await pembayaranApi.prosesPembayaran(orderId, payment);

    // Tutup sesi kartu jika semua pesanan dalam sesi tersebut sudah dibayar
    if (updatedOrder.idSesi) {
      try {
        const sesiOrders = await pesananApi.dapatkanBerdasarkanSesi(updatedOrder.idSesi);
        const stillPending = sesiOrders.some(
          (o) => o.status === 'menunggu_bayar' || o.status === 'pending_payment'
        );
        if (!stillPending) {
          await sesiApi.tutupSesi(updatedOrder.idSesi);
        }
      } catch {
        // Jangan gagalkan transaksi pembayaran utama bila sinkronisasi tutup sesi gagal
      }
    }

    return updatedOrder;
  }

  async processMultiOrderPayment(
    orderIds: string[],
    method: PaymentMethod,
    amountPaid: number,
    totalAmount: number,
    options?: {
      idKasir?: string;
      referensiQris?: string;
    }
  ): Promise<Order[]> {
    const normalizedMethod: PaymentMethod = method === 'cash' ? 'tunai' : method;
    const isCash = isCashMethod(normalizedMethod);

    if (isCash && amountPaid < totalAmount) {
      throw new Error(
        `Jumlah uang tunai kurang. Total: Rp ${totalAmount}, Diterima: Rp ${amountPaid}`
      );
    }

    const effectivePaid = isCash ? amountPaid : totalAmount;
    const change = isCash ? Math.max(0, amountPaid - totalAmount) : 0;

    const payment: DetailPembayaran = {
      method: normalizedMethod,
      metode: normalizedMethod,
      totalTagihan: totalAmount,
      amountPaid: effectivePaid,
      uangDiterima: effectivePaid,
      change,
      kembalian: change,
      paidAt: formatTime(),
      waktuBayar: formatTime(),
      idKasir: options?.idKasir,
      referensiQris: normalizedMethod === 'qris' ? options?.referensiQris : undefined,
    };

    return await pembayaranApi.prosesPembayaranMulti(orderIds, payment);
  }

  async updateOrderItems(
    orderId: string,
    updatedItems: CartItem[]
  ): Promise<Order> {
    if (updatedItems.length === 0) {
      return await pesananApi.batalkanPesanan(orderId);
    }

    const { totalAmount } = cartController.calculateTotals(updatedItems);
    return await pesananApi.perbaruiItem(orderId, updatedItems, totalAmount);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return await pesananApi.batalkanPesanan(orderId);
  }

  async markAsCompleted(orderId: string): Promise<Order> {
    return await pesananApi.perbaruiStatus(orderId, 'selesai');
  }

  calculateShiftSummary(orders: Order[]) {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let qrisRevenue = 0;
    let debitRevenue = 0;
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
        if (isCashMethod(method)) {
          cashRevenue += order.total;
        } else if (method === 'qris') {
          qrisRevenue += order.total;
        } else if (method === 'debit') {
          debitRevenue += order.total;
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
      debitRevenue,
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
