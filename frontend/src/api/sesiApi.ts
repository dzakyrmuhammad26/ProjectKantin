import { storage } from '@/services/storage';
import { SesiPelanggan } from '@/models/sesi';
import { formatTime } from '@/utils/formatters';

export const sesiApi = {
  async dapatkanSemuaSesi(): Promise<SesiPelanggan[]> {
    return Promise.resolve(storage.getSesi());
  },

  async dapatkanSesiAktif(nomorKartu: number): Promise<SesiPelanggan | null> {
    const list = storage.getSesi();
    const found = list.find((s) => s.nomorKartu === nomorKartu && s.status === 'aktif');
    return Promise.resolve(found || null);
  },

  async bukaSesi(nomorKartu: number, nomorMeja?: number): Promise<SesiPelanggan> {
    // Cek apakah sudah ada sesi aktif untuk kartu ini
    const existing = await this.dapatkanSesiAktif(nomorKartu);
    if (existing) {
      return existing;
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newSesi: SesiPelanggan = {
      id: `SESI-${todayStr}-${String(nomorKartu).padStart(4, '0')}`,
      nomorKartu,
      nomorMeja,
      status: 'aktif',
      totalTagihan: 0,
      waktuBuka: formatTime(),
    };

    storage.saveSesi(newSesi);
    return Promise.resolve(newSesi);
  },

  async tutupSesi(idSesi: string): Promise<SesiPelanggan> {
    const updated = storage.updateSesi(idSesi, {
      status: 'lunas',
      waktuTutup: formatTime(),
    });

    if (!updated) {
      throw new Error(`Sesi dengan ID ${idSesi} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },

  async perbaruiTagihan(idSesi: string, totalTagihan: number): Promise<SesiPelanggan> {
    const updated = storage.updateSesi(idSesi, { totalTagihan });
    if (!updated) {
      throw new Error(`Sesi dengan ID ${idSesi} tidak ditemukan.`);
    }
    return Promise.resolve(updated);
  },
};
