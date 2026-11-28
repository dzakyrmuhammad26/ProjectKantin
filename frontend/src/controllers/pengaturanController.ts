import { pengaturanApi } from '@/api/pengaturanApi';
import { PengaturanKantin } from '@/models/pengaturan';

const DEFAULT_PENGATURAN: PengaturanKantin = {
  namaKantin: 'Kantin Sentral Pujasera',
  alamatKantin: 'Gedung Kuliah Bersama Lt. 1',
  nomorKartuMin: 1,
  nomorKartuMax: 99,
  teksFooterStruk: 'Terima kasih atas kunjungan Anda di Kantin Sentral!',
  metodeBayarAktif: ['tunai', 'qris', 'debit'],
};

class PengaturanController {
  private cached: PengaturanKantin | null = null;

  async getPengaturan(forceRefresh = false): Promise<PengaturanKantin> {
    if (this.cached && !forceRefresh) {
      return this.cached;
    }
    try {
      const data = await pengaturanApi.dapatkanPengaturan();
      this.cached = data;
      return data;
    } catch {
      return this.cached || DEFAULT_PENGATURAN;
    }
  }

  async updatePengaturan(updates: Partial<PengaturanKantin>): Promise<PengaturanKantin> {
    const updated = await pengaturanApi.perbaruiPengaturan(updates);
    this.cached = updated;
    return updated;
  }

  getDefault(): PengaturanKantin {
    return this.cached || DEFAULT_PENGATURAN;
  }
}

const pengaturanController = new PengaturanController();
export { pengaturanController };
export default pengaturanController;
