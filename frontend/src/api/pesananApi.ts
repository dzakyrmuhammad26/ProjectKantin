import { ItemPesanan, Pesanan, StatusPesanan, SumberPesanan } from '@/models/pesanan';
import { storage } from '@/services/storage';
import { apiRequest } from './httpClient';
import { mapPesanan } from './mappers';

function serializeItems(items: ItemPesanan[]) {
  return items.map((item) => {
    const m = item.menuItem || item.menu;
    return {
      idMenu: m?.id || m?.kode || '',
      namaMenu: m?.nama || m?.name || '',
      idGerai: m?.idGerai || m?.stallId || null,
      namaGerai: m?.namaGerai || m?.stallName || null,
      jumlah: Number(item.jumlah ?? item.qty ?? 1),
      catatan: item.catatan ?? item.notes ?? '',
    };
  });
}

export const pesananApi = {
  async dapatkanSemua(filter?: {
    nomorKartu?: string;
    idSesi?: string;
    status?: StatusPesanan;
    idGerai?: string;
  }): Promise<Pesanan[]> {
    const params = new URLSearchParams();
    if (filter?.nomorKartu) params.set('nomorKartu', filter.nomorKartu);
    if (filter?.idSesi) params.set('idSesi', filter.idSesi);
    if (filter?.status) params.set('status', filter.status);
    if (filter?.idGerai) params.set('idGerai', filter.idGerai);
    const qs = params.toString() ? `?${params.toString()}` : '';

    const list = await apiRequest<any[]>(`/pesanan${qs}`);
    return list.map(mapPesanan);
  },

  async dapatkanBerdasarkanId(id: string): Promise<Pesanan | null> {
    try {
      const data = await apiRequest<any>(`/pesanan/${encodeURIComponent(id)}`);
      return data ? mapPesanan(data) : null;
    } catch {
      return null;
    }
  },

  async dapatkanBerdasarkanNomorKartu(nomorKartu: string): Promise<Pesanan[]> {
    const list = await apiRequest<any[]>(`/pesanan/kartu/${encodeURIComponent(nomorKartu)}`);
    return list.map(mapPesanan);
  },

  async dapatkanBerdasarkanGerai(idGerai: string): Promise<Pesanan[]> {
    const list = await apiRequest<any[]>(`/pesanan/gerai/${encodeURIComponent(idGerai)}`);
    return list.map(mapPesanan);
  },

  async dapatkanBerdasarkanSesi(idSesi: string): Promise<Pesanan[]> {
    const list = await apiRequest<any[]>(`/pesanan/sesi/${encodeURIComponent(idSesi)}`);
    return list.map(mapPesanan);
  },

  async buatPesanan(data: {
    nomorKartu: string;
    items: ItemPesanan[];
    total: number;
    idGerai?: string;
    namaGerai?: string;
    idSesi?: string;
    nomorMeja?: number;
    catatan?: string;
    sumber?: SumberPesanan;
  }): Promise<Pesanan> {
    const created = await apiRequest<any>('/pesanan', {
      method: 'POST',
      body: JSON.stringify({
        nomorKartu: data.nomorKartu,
        nomorMeja: data.nomorMeja ?? null,
        idGerai: data.idGerai ?? null,
        namaGerai: data.namaGerai ?? null,
        idSesi: data.idSesi ?? null,
        sumber: data.sumber || 'pelanggan',
        catatan: data.catatan ?? '',
        total: data.total,
        items: serializeItems(data.items),
      }),
    });

    const mapped = mapPesanan(created);
    storage.setLastOrder(mapped);
    return mapped;
  },

  async perbaruiStatus(idPesanan: string, status: StatusPesanan): Promise<Pesanan> {
    const updated = await apiRequest<any>(
      `/pesanan/${encodeURIComponent(idPesanan)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return mapPesanan(updated);
  },

  async perbaruiItem(
    idPesanan: string,
    items: ItemPesanan[],
    total: number
  ): Promise<Pesanan> {
    const updated = await apiRequest<any>(
      `/pesanan/${encodeURIComponent(idPesanan)}/items`,
      {
        method: 'PUT',
        body: JSON.stringify({
          items: serializeItems(items),
          total,
        }),
      }
    );
    return mapPesanan(updated);
  },

  async batalkanPesanan(idPesanan: string): Promise<Pesanan> {
    const updated = await apiRequest<any>(
      `/pesanan/${encodeURIComponent(idPesanan)}/batal`,
      {
        method: 'PATCH',
        body: JSON.stringify({}),
      }
    );
    return mapPesanan(updated);
  },

  async dapatkanPesananTerakhir(): Promise<Pesanan | null> {
    const cached = storage.getLastOrder();
    if (!cached?.id) return null;

    const latest = await this.dapatkanBerdasarkanId(cached.id);
    if (latest) {
      storage.setLastOrder(latest);
      return latest;
    }
    return cached;
  },
};
