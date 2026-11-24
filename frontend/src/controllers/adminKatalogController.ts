import { geraiApi } from '@/api/geraiApi';
import { menuApi } from '@/api/menuApi';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';

class AdminKatalogController {
  // --- KELOLA GERAI (MURNI TANPA MODEL SEWA / RENTAL) ---
  async getDaftarGerai(): Promise<Gerai[]> {
    return await geraiApi.dapatkanSemua();
  }

  async tambahGerai(data: {
    kode: string;
    nama: string;
    penyewa: string;
    warna: string;
  }): Promise<Gerai> {
    if (!data.nama.trim() || !data.penyewa.trim() || !data.kode.trim()) {
      throw new Error('Kode, nama stan, dan nama penyewa wajib diisi');
    }
    return await geraiApi.buatGerai(data);
  }

  async ubahGerai(id: string, updates: Partial<Gerai>): Promise<Gerai> {
    return await geraiApi.perbaruiGerai(id, updates);
  }

  // --- KELOLA MASTER MENU GLOBAL ---
  async getDaftarMenuSemua(): Promise<Menu[]> {
    return await menuApi.dapatkanSemua();
  }

  async tambahMenuGlobal(data: {
    kode: string;
    nama: string;
    harga: number;
    idGerai: string;
    namaGerai: string;
    kategori?: 'makanan' | 'minuman' | 'camilan';
    foto?: string;
    urutan?: number;
    isFavorit?: boolean;
  }): Promise<Menu> {
    return await menuApi.buatMenu(data);
  }

  async ubahMenuGlobal(id: string, updates: Partial<Menu>): Promise<Menu> {
    return await menuApi.perbaruiMenu(id, updates);
  }

  async hapusMenuGlobal(id: string): Promise<boolean> {
    return await menuApi.hapusMenu(id);
  }
}

const adminKatalogController = new AdminKatalogController();
export { adminKatalogController };
export default adminKatalogController;
