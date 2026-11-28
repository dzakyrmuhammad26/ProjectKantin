import { pesananApi } from '@/api/pesananApi';
import { sesiApi } from '@/api/sesiApi';
import { CartItem, Order, Pesanan, SumberPesanan } from '@/models/pesanan';
import cartController from './cartController';

export interface CreateOrderOptions {
  nomorMeja?: number;
  idGerai?: string;
  namaGerai?: string;
  sumber?: SumberPesanan;
  catatan?: string;
  minCard?: number;
  maxCard?: number;
}

class OrderController {
  async createOrder(
    cardNumber: string,
    items: CartItem[],
    totalAmount: number,
    options?: CreateOrderOptions
  ): Promise<Order> {
    if (items.length === 0) {
      throw new Error('Keranjang belanja kosong');
    }

    const val = cartController.validateCardNumber(
      cardNumber,
      options?.minCard ?? 1,
      options?.maxCard ?? 99
    );
    if (!val.valid) {
      throw new Error(val.error || 'Nomor kartu fisik tidak valid');
    }

    const cleanCard = cardNumber.trim();
    const numericCard = parseInt(cleanCard, 10);

    // Buka atau gunakan sesi kartu aktif dari backend /api/sesi/buka
    let idSesi: string | undefined;
    try {
      const sesi = await sesiApi.bukaSesi(numericCard, options?.nomorMeja);
      idSesi = sesi.id;
    } catch {
      // Tetap lanjutkan buat pesanan apabila endpoint sesi tidak tersedia
    }

    return await pesananApi.buatPesanan({
      nomorKartu: cleanCard,
      items: [...items],
      total: totalAmount,
      nomorMeja: options?.nomorMeja,
      idGerai: options?.idGerai,
      namaGerai: options?.namaGerai,
      idSesi,
      catatan: options?.catatan,
      sumber: options?.sumber || 'pelanggan',
    });
  }

  async getLastOrder(): Promise<Order | null> {
    return await pesananApi.dapatkanPesananTerakhir();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await pesananApi.dapatkanBerdasarkanId(id);
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
