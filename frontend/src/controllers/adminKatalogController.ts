import { geraiApi } from '@/api/geraiApi';
import { menuApi } from '@/api/menuApi';
import { pengaturanApi } from '@/api/pengaturanApi';
import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';
import { PengaturanKantin } from '@/models/pengaturan';

class AdminKatalogController {
  // --- KELOLA GERAI (MURNI TANPA MODEL SEWA / RENTAL) ---
  async getDaftarGerai(onlyActive = true): Promise<Gerai[]> {
    return await geraiApi.dapatkanSemua(onlyActive);
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

  async hapusGerai(id: string, permanent = false): Promise<boolean> {
    return await geraiApi.hapusGerai(id, permanent);
  }

  // --- KELOLA MASTER MENU GLOBAL ---
  async getDaftarMenuSemua(onlyActive = true): Promise<Menu[]> {
    return await menuApi.dapatkanSemua(onlyActive);
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

  async toggleStatusHabisGlobal(id: string): Promise<Menu> {
    return await menuApi.toggleStatusHabis(id);
  }

  async hapusMenuGlobal(id: string, permanent = false): Promise<boolean> {
    return await menuApi.hapusMenu(id, permanent);
  }

  // --- PENGATURAN KANTIN ---
  async getPengaturan(): Promise<PengaturanKantin> {
    return await pengaturanApi.dapatkanPengaturan();
  }

  async updatePengaturan(updates: Partial<PengaturanKantin>): Promise<PengaturanKantin> {
    return await pengaturanApi.perbaruiPengaturan(updates);
  }
}

const adminKatalogController = new AdminKatalogController();
export { adminKatalogController };
export default adminKatalogController;
