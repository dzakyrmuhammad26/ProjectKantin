import { Menu } from '@/models/menu';
import { apiRequest } from './httpClient';
import { mapMenu } from './mappers';

export const menuApi = {
  async dapatkanSemua(): Promise<Menu[]> {
    const list = await apiRequest<any[]>('/menu?aktif=true');
    return list.map(mapMenu);
  },

  async dapatkanBerdasarkanId(id: string): Promise<Menu | null> {
    try {
      const data = await apiRequest<any>(`/menu/${encodeURIComponent(id)}`);
      return data ? mapMenu(data) : null;
    } catch {
      return null;
    }
  },

  async dapatkanBerdasarkanGerai(idGerai: string): Promise<Menu[]> {
    const list = await apiRequest<any[]>(`/menu/gerai/${encodeURIComponent(idGerai)}`);
    return list.map(mapMenu);
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
    const created = await apiRequest<any>('/menu', {
      method: 'POST',
      body: JSON.stringify({
        kode: data.kode,
        nama: data.nama,
        harga: Number(data.harga),
        idGerai: data.idGerai,
        namaGerai: data.namaGerai,
        kategori: data.kategori || 'makanan',
        foto: data.foto || '/images/menu/placeholder.jpg',
        urutan: data.urutan ?? 99,
        isFavorit: Boolean(data.isFavorit),
      }),
    });
    return mapMenu(created);
  },

  async perbaruiMenu(id: string, updates: Partial<Menu>): Promise<Menu> {
    const payload: Record<string, any> = {};
    if (updates.kode !== undefined || updates.code !== undefined) {
      payload.kode = updates.kode ?? updates.code;
    }
    if (updates.nama !== undefined || updates.name !== undefined) {
      payload.nama = updates.nama ?? updates.name;
    }
    if (updates.harga !== undefined || updates.price !== undefined) {
      payload.harga = Number(updates.harga ?? updates.price);
    }
    if (updates.idGerai !== undefined || updates.stallId !== undefined) {
      payload.idGerai = updates.idGerai ?? updates.stallId;
    }
    if (updates.namaGerai !== undefined || updates.stallName !== undefined) {
      payload.namaGerai = updates.namaGerai ?? updates.stallName;
    }
    if (updates.kategori !== undefined) payload.kategori = updates.kategori;
    if (updates.foto !== undefined || updates.image !== undefined) {
      payload.foto = updates.foto ?? updates.image;
    }
    if (updates.urutan !== undefined) payload.urutan = updates.urutan;
    if (updates.isFavorit !== undefined) payload.isFavorit = updates.isFavorit;
    if (updates.isHabis !== undefined || updates.isSoldOut !== undefined) {
      payload.isHabis = updates.isHabis ?? updates.isSoldOut;
    }
    if (updates.aktif !== undefined) payload.aktif = updates.aktif;

    const updated = await apiRequest<any>(`/menu/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapMenu(updated);
  },

  async toggleStatusHabis(id: string): Promise<Menu> {
    const updated = await apiRequest<any>(`/menu/${encodeURIComponent(id)}/toggle-habis`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
    return mapMenu(updated);
  },

  async hapusMenu(id: string): Promise<boolean> {
    await apiRequest(`/menu/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return true;
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
