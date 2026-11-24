import { storage } from '@/services/storage';
import { Gerai } from '@/models/gerai';

export const geraiApi = {
  async dapatkanSemua(): Promise<Gerai[]> {
    const list = storage.getGerai();
    return Promise.resolve(list.filter((g) => g.aktif !== false));
  },

  async dapatkanBerdasarkanId(id: string): Promise<Gerai | null> {
    const list = storage.getGerai();
    const gerai = list.find((g) => g.id === id) || null;
    return Promise.resolve(gerai);
  },

  async buatGerai(data: {
    kode: string;
    nama: string;
    penyewa: string;
    warna: string;
  }): Promise<Gerai> {
    const id = data.kode.toUpperCase();
    const newGerai: Gerai = {
      id,
      kode: data.kode,
      nama: data.nama,
      penyewa: data.penyewa,
      warna: data.warna,
      aktif: true,
      code: data.kode,
      name: data.nama,
      color: data.warna,
    };
    storage.saveGerai(newGerai);
    return Promise.resolve(newGerai);
  },

  async perbaruiGerai(id: string, updates: Partial<Gerai>): Promise<Gerai> {
    const list = storage.getGerai();
    const existing = list.find((g) => g.id === id);
    if (!existing) {
      throw new Error(`Gerai dengan ID ${id} tidak ditemukan.`);
    }

    const updated: Gerai = {
      ...existing,
      ...updates,
      code: updates.kode || existing.code,
      name: updates.nama || existing.name,
      color: updates.warna || existing.color,
    };

    storage.saveGerai(updated);
    return Promise.resolve(updated);
  },

  // Kompatibilitas kode lama
  async getAll(): Promise<Gerai[]> {
    return this.dapatkanSemua();
  },

  async getById(id: string): Promise<Gerai | null> {
    return this.dapatkanBerdasarkanId(id);
  },
};
