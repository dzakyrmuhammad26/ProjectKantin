import { storage } from '@/services/storage';
import { Pengguna } from '@/models/pengguna';

export const penggunaApi = {
  async dapatkanSemua(): Promise<Pengguna[]> {
    const list = storage.getPengguna();
    return Promise.resolve(list.filter((p) => p.aktif !== false));
  },

  async dapatkanBerdasarkanId(id: string): Promise<Pengguna | null> {
    const list = storage.getPengguna();
    const found = list.find((p) => p.id === id) || null;
    return Promise.resolve(found);
  },

  async verifikasiPin(pin: string): Promise<Pengguna | null> {
    const list = storage.getPengguna();
    const cleanPin = pin.trim();
    const found = list.find((p) => p.pin === cleanPin && p.aktif !== false) || null;
    return Promise.resolve(found);
  },

  async buatPengguna(data: Omit<Pengguna, 'id'>): Promise<Pengguna> {
    const id = `USR-${Date.now().toString().slice(-6)}`;
    const newPengguna: Pengguna = {
      ...data,
      id,
    };
    storage.savePengguna(newPengguna);
    return Promise.resolve(newPengguna);
  },

  async perbaruiPengguna(id: string, updates: Partial<Pengguna>): Promise<Pengguna> {
    const list = storage.getPengguna();
    const existing = list.find((p) => p.id === id);
    if (!existing) {
      throw new Error(`Pengguna dengan ID ${id} tidak ditemukan.`);
    }
    const updated: Pengguna = { ...existing, ...updates };
    storage.savePengguna(updated);
    return Promise.resolve(updated);
  },

  async ubahPin(id: string, pinBaru: string): Promise<boolean> {
    const updated = await this.perbaruiPengguna(id, { pin: pinBaru.trim() });
    return Promise.resolve(!!updated);
  },

  async getSession(): Promise<Pengguna | null> {
    return Promise.resolve(storage.getCurrentUser());
  },

  async setSession(user: Pengguna | null): Promise<void> {
    storage.setCurrentUser(user);
    return Promise.resolve();
  },
};
