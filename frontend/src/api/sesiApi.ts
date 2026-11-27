import { SesiPelanggan } from '@/models/sesi';
import { apiRequest } from './httpClient';
import { mapSesi } from './mappers';

export const sesiApi = {
  async dapatkanSemuaSesi(): Promise<SesiPelanggan[]> {
    const list = await apiRequest<any[]>('/sesi');
    return list.map(mapSesi);
  },

  async dapatkanSesiAktif(nomorKartu: number): Promise<SesiPelanggan | null> {
    try {
      const data = await apiRequest<any>(`/sesi/aktif/${nomorKartu}`);
      return data ? mapSesi(data) : null;
    } catch {
      return null;
    }
  },

  async bukaSesi(nomorKartu: number, nomorMeja?: number): Promise<SesiPelanggan> {
    const data = await apiRequest<any>('/sesi/buka', {
      method: 'POST',
      body: JSON.stringify({
        nomorKartu: Number(nomorKartu),
        nomorMeja: nomorMeja ?? null,
      }),
    });
    return mapSesi(data);
  },

  async tutupSesi(idSesi: string): Promise<SesiPelanggan> {
    const data = await apiRequest<any>(`/sesi/${encodeURIComponent(idSesi)}/tutup`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
    return mapSesi(data);
  },

  async perbaruiTagihan(idSesi: string, totalTagihan: number): Promise<SesiPelanggan> {
    const data = await apiRequest<any>(`/sesi/${encodeURIComponent(idSesi)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ totalTagihan }),
    });
    return mapSesi(data);
  },
};
