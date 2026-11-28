import { menuApi } from '@/api/menuApi';
import { Menu } from '@/models/menu';

class MenuGeraiController {
  async getMenuStan(idGerai: string): Promise<Menu[]> {
    if (!idGerai) {
      throw new Error('ID Gerai wajib disertakan');
    }
    return await menuApi.dapatkanBerdasarkanGerai(idGerai);
  }

  async tambahMenu(
    idGerai: string,
    namaGerai: string,
    data: {
      kode: string;
      nama: string;
      harga: number;
      kategori?: 'makanan' | 'minuman' | 'camilan';
      foto?: string;
      urutan?: number;
      isFavorit?: boolean;
    }
  ): Promise<Menu> {
    if (!idGerai || !namaGerai) {
      throw new Error('Identitas gerai tidak valid');
    }
    if (!data.nama.trim()) {
      throw new Error('Nama menu wajib diisi');
    }
    if (data.harga < 0) {
      throw new Error('Harga menu tidak boleh negatif');
    }

    return await menuApi.buatMenu({
      ...data,
      idGerai,
      namaGerai,
    });
  }

  async ubahMenu(
    idGerai: string,
    idMenu: string,
    updates: Partial<Menu>
  ): Promise<Menu> {
    const existing = await menuApi.dapatkanBerdasarkanId(idMenu);
    if (!existing) {
      throw new Error(`Menu dengan ID ${idMenu} tidak ditemukan`);
    }

    // Validasi kepemilikan gerai
    if (existing.idGerai !== idGerai && existing.stallId !== idGerai) {
      throw new Error('Anda tidak memiliki hak untuk mengubah menu dari gerai lain');
    }

    if (updates.harga !== undefined && updates.harga < 0) {
      throw new Error('Harga menu tidak boleh negatif');
    }

    return await menuApi.perbaruiMenu(idMenu, updates);
  }

  async toggleStatusHabis(idGerai: string, idMenu: string): Promise<Menu> {
    const existing = await menuApi.dapatkanBerdasarkanId(idMenu);
    if (!existing) {
      throw new Error(`Menu dengan ID ${idMenu} tidak ditemukan`);
    }

    // Validasi kepemilikan gerai
    if (existing.idGerai !== idGerai && existing.stallId !== idGerai) {
      throw new Error('Anda tidak memiliki hak untuk mengubah status menu dari gerai lain');
    }

    return await menuApi.toggleStatusHabis(idMenu);
  }

  async hapusMenu(idGerai: string, idMenu: string): Promise<boolean> {
    const existing = await menuApi.dapatkanBerdasarkanId(idMenu);
    if (!existing) {
      throw new Error(`Menu dengan ID ${idMenu} tidak ditemukan`);
    }

    // Validasi kepemilikan gerai
    if (existing.idGerai !== idGerai && existing.stallId !== idGerai) {
      throw new Error('Anda tidak memiliki hak untuk menghapus menu dari gerai lain');
    }

    return await menuApi.hapusMenu(idMenu);
  }
}

const menuGeraiController = new MenuGeraiController();
export { menuGeraiController };
export default menuGeraiController;
