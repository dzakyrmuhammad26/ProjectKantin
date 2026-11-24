import { penggunaApi } from '@/api/penggunaApi';
import { Pengguna } from '@/models/pengguna';

class AdminPenggunaController {
  async getDaftarPengguna(): Promise<Pengguna[]> {
    return await penggunaApi.dapatkanSemua();
  }

  async tambahPengguna(data: Omit<Pengguna, 'id'>): Promise<Pengguna> {
    if (!data.nama.trim() || !data.pin.trim()) {
      throw new Error('Nama staf dan PIN wajib diisi');
    }
    if (data.pin.length < 4 || data.pin.length > 6) {
      throw new Error('PIN staf harus berukuran 4 sampai 6 digit angka');
    }
    return await penggunaApi.buatPengguna(data);
  }

  async ubahPengguna(id: string, updates: Partial<Pengguna>): Promise<Pengguna> {
    return await penggunaApi.perbaruiPengguna(id, updates);
  }

  async resetPin(id: string, pinBaru: string): Promise<boolean> {
    const clean = pinBaru.trim();
    if (clean.length < 4 || clean.length > 6) {
      throw new Error('PIN baru harus berupa 4 - 6 digit angka');
    }
    return await penggunaApi.ubahPin(id, clean);
  }
}

const adminPenggunaController = new AdminPenggunaController();
export { adminPenggunaController };
export default adminPenggunaController;
