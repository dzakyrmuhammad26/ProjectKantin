import { storage } from '@/services/storage';
import { Menu } from '@/models/menu';

export const menuApi = {
  async dapatkanSemua(): Promise<Menu[]> {
    const list = storage.getMenus();
    return Promise.resolve(list.filter((m) => m.aktif !== false));
  },

  async dapatkanBerdasarkanId(id: string): Promise<Menu | null> {
    const list = storage.getMenus();
    const menu = list.find((m) => m.id === id) || null;
    return Promise.resolve(menu);
  },

  async dapatkanBerdasarkanGerai(idGerai: string): Promise<Menu[]> {
    const list = storage.getMenus();
    const filtered = list.filter(
      (m) => (m.idGerai === idGerai || m.stallId === idGerai) && m.aktif !== false
    );
    return Promise.resolve(filtered);
  },

  async buatMenu(data: {
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
    const newId = `${data.idGerai.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newMenu: Menu = {
      id: newId,
      kode: data.kode,
      code: data.kode,
      nama: data.nama,
      name: data.nama,
      harga: data.harga,
      price: data.harga,
      idGerai: data.idGerai,
      stallId: data.idGerai,
      namaGerai: data.namaGerai,
      stallName: data.namaGerai,
      kategori: data.kategori || 'makanan',
      foto: data.foto || '/images/menu/placeholder.jpg',
      image: data.foto || '/images/menu/placeholder.jpg',
      urutan: data.urutan || 99,
      isFavorit: data.isFavorit || false,
      isHabis: false,
      isSoldOut: false,
      aktif: true,
    };

    storage.saveMenu(newMenu);
    return Promise.resolve(newMenu);
  },

  async perbaruiMenu(id: string, updates: Partial<Menu>): Promise<Menu> {
    // Sinkronkan compatibility fields jika ada update
    const normalizedUpdates: Partial<Menu> = { ...updates };
    if (updates.nama) normalizedUpdates.name = updates.nama;
    if (updates.harga !== undefined) normalizedUpdates.price = updates.harga;
    if (updates.foto) normalizedUpdates.image = updates.foto;
    if (updates.isHabis !== undefined) normalizedUpdates.isSoldOut = updates.isHabis;

    const updated = storage.updateMenu(id, normalizedUpdates);
    if (!updated) {
      throw new Error(`Menu dengan ID ${id} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },

  async toggleStatusHabis(id: string): Promise<Menu> {
    const existing = await this.dapatkanBerdasarkanId(id);
    if (!existing) {
      throw new Error(`Menu dengan ID ${id} tidak ditemukan.`);
    }
    const statusBaru = !existing.isHabis;
    return this.perbaruiMenu(id, {
      isHabis: statusBaru,
      isSoldOut: statusBaru,
    });
  },

  async hapusMenu(id: string): Promise<boolean> {
    // Soft delete dengan mengubah aktif: false
    const updated = storage.updateMenu(id, { aktif: false });
    return Promise.resolve(!!updated);
  },

  // Kompatibilitas kode lama
  async getAll(): Promise<Menu[]> {
    return this.dapatkanSemua();
  },

  async getById(id: string): Promise<Menu | null> {
    return this.dapatkanBerdasarkanId(id);
  },

  async getByStallId(stallId: string): Promise<Menu[]> {
    return this.dapatkanBerdasarkanGerai(stallId);
  },
};
