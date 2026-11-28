import { PengaturanKantin } from '@/models/pengaturan';
import { apiRequest } from './httpClient';
import { mapPengaturan } from './mappers';

export const pengaturanApi = {
  async dapatkanPengaturan(): Promise<PengaturanKantin> {
    const raw = await apiRequest<any>('/pengaturan');
    return mapPengaturan(raw);
  },

  async perbaruiPengaturan(updates: Partial<PengaturanKantin>): Promise<PengaturanKantin> {
    const raw = await apiRequest<any>('/pengaturan', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return mapPengaturan(raw);
  },
};
