import { Gerai } from '@/models/gerai';
import { apiRequest } from './httpClient';
import { mapGerai } from './mappers';

export const geraiApi = {
  async dapatkanSemua(): Promise<Gerai[]> {
    const list = await apiRequest<any[]>('/gerai?aktif=true');
    return list.map(mapGerai);
  },

  async dapatkanBerdasarkanId(id: string): Promise<Gerai | null> {
    try {
      const data = await apiRequest<any>(`/gerai/${encodeURIComponent(id)}`);
      return data ? mapGerai(data) : null;
    } catch {
      return null;
    }
  },

  async buatGerai(data: {
    kode: string;
    nama: string;
    penyewa: string;
    warna: string;
  }): Promise<Gerai> {
    const created = await apiRequest<any>('/gerai', {
      method: 'POST',
      body: JSON.stringify({
        kode: data.kode,
        nama: data.nama,
        penyewa: data.penyewa,
        warna: data.warna,
        aktif: true,
      }),
    });
    return mapGerai(created);
  },

  async perbaruiGerai(id: string, updates: Partial<Gerai>): Promise<Gerai> {
    const payload: Record<string, any> = {};
    if (updates.kode !== undefined || updates.code !== undefined) {
      payload.kode = updates.kode ?? updates.code;
    }
    if (updates.nama !== undefined || updates.name !== undefined) {
      payload.nama = updates.nama ?? updates.name;
    }
    if (updates.penyewa !== undefined) {
      payload.penyewa = updates.penyewa;
    }
    if (updates.warna !== undefined || updates.color !== undefined) {
      payload.warna = updates.warna ?? updates.color;
    }
    if (updates.aktif !== undefined) {
      payload.aktif = updates.aktif;
    }

    const updated = await apiRequest<any>(`/gerai/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapGerai(updated);
  },

  // Kompatibilitas kode lama
  async getAll(): Promise<Gerai[]> {
    return this.dapatkanSemua();
  },

  async getById(id: string): Promise<Gerai | null> {
    return this.dapatkanBerdasarkanId(id);
  },
};
