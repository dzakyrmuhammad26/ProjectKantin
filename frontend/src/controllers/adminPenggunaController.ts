import { penggunaApi } from '@/api/penggunaApi';
import { Pengguna } from '@/models/pengguna';

class AdminPenggunaController {
  async getDaftarPengguna(onlyActive = false): Promise<Pengguna[]> {
    return await penggunaApi.dapatkanSemua(onlyActive);
  }

  async tambahPengguna(data: Omit<Pengguna, 'id'>): Promise<Pengguna> {
    if (!data.nama.trim() || !data.pin.trim() || !data.username.trim()) {
      throw new Error('Nama, username, dan PIN wajib diisi');
    }
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(data.username.trim())) {
      throw new Error('Username minimal 3 karakter dan hanya boleh huruf, angka, atau underscore');
    }
    if (!/^\d{4,6}$/.test(data.pin.trim())) {
      throw new Error('PIN staf harus berupa 4 sampai 6 digit angka');
    }
    return await penggunaApi.buatPengguna(data);
  }

  async ubahPengguna(id: string, updates: Partial<Pengguna>): Promise<Pengguna> {
    return await penggunaApi.perbaruiPengguna(id, updates);
  }

  async resetPin(id: string, pinBaru: string): Promise<boolean> {
    const clean = pinBaru.trim();
    if (!/^\d{4,6}$/.test(clean)) {
      throw new Error('PIN baru harus berupa 4 - 6 digit angka');
    }
    return await penggunaApi.ubahPin(id, clean);
  }

  async hapusPengguna(id: string, permanent = false): Promise<boolean> {
    return await penggunaApi.hapusPengguna(id, permanent);
  }
}

const adminPenggunaController = new AdminPenggunaController();
export { adminPenggunaController };
export default adminPenggunaController;
