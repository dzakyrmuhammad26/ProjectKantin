import { penggunaApi } from '@/api/penggunaApi';
import { Pengguna, PeranPengguna } from '@/models/pengguna';

class AuthController {
  async loginDenganPin(pin: string, username?: string): Promise<Pengguna | null> {
    const cleanPin = pin.trim();
    if (!cleanPin) {
      throw new Error('PIN wajib diisi');
    }

    const user = await penggunaApi.verifikasiPin(cleanPin, username);
    if (!user) {
      throw new Error('PIN tidak ditemukan atau salah. Silakan coba lagi.');
    }

    await penggunaApi.setSession(user);
    return user;
  }

  async getCurrentUser(): Promise<Pengguna | null> {
    return await penggunaApi.getSession();
  }

  async logout(): Promise<void> {
    await penggunaApi.setSession(null);
  }

  verifikasiAkses(user: Pengguna | null, peranDibutuhkan: PeranPengguna): boolean {
    if (!user || !user.aktif) return false;
    if (user.peran === 'superadmin') return true;
    return user.peran === peranDibutuhkan;
  }
}

const authController = new AuthController();
export { authController };
export default authController;
