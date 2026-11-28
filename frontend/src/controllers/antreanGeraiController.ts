import { pesananApi } from '@/api/pesananApi';
import { Order, Pesanan } from '@/models/pesanan';

class AntreanGeraiController {
  async getAntreanStan(idGerai: string): Promise<{
    menungguBayar: Pesanan[];
    siapDibuat: Pesanan[];
    selesai: Pesanan[];
  }> {
    if (!idGerai) {
      return { menungguBayar: [], siapDibuat: [], selesai: [] };
    }

    const allStanOrders = await pesananApi.dapatkanBerdasarkanGerai(idGerai);

    const menungguBayar: Pesanan[] = [];
    const siapDibuat: Pesanan[] = [];
    const selesai: Pesanan[] = [];

    for (const order of allStanOrders) {
      // Saring hanya item milik gerai ini jika pesanan bersifat multi-stan
      const itemsMilikkita = order.items.filter(
        (item) => item.menuItem.stallId === idGerai || item.menuItem.idGerai === idGerai
      );

      if (itemsMilikkita.length === 0) continue;

      const orderFiltered: Pesanan = {
        ...order,
        items: itemsMilikkita,
      };

      if (order.status === 'menunggu_bayar' || order.status === 'pending_payment') {
        menungguBayar.push(orderFiltered);
      } else if (order.status === 'siap_dibuat' || order.status === 'ready_to_prepare') {
        siapDibuat.push(orderFiltered);
      } else if (order.status === 'selesai' || order.status === 'completed') {
        selesai.push(orderFiltered);
      }
    }

    return {
      menungguBayar,
      siapDibuat,
      selesai,
    };
  }

  async tandaiSelesai(idGerai: string, idPesanan: string): Promise<Order> {
    const order = await pesananApi.dapatkanBerdasarkanId(idPesanan);
    if (!order) {
      throw new Error(`Pesanan dengan ID ${idPesanan} tidak ditemukan.`);
    }

    if (order.status !== 'siap_dibuat' && order.status !== 'ready_to_prepare') {
      throw new Error('Pesanan belum dibayar atau status tidak valid untuk diselesaikan.');
    }

    return await pesananApi.perbaruiStatus(idPesanan, 'selesai');
  }
}

const antreanGeraiController = new AntreanGeraiController();
export { antreanGeraiController };
export default antreanGeraiController;
