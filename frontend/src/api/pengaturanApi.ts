import { PengaturanKantin } from '@/models/pengaturan';
import { apiRequest } from './httpClient';

export const pengaturanApi = {
  async dapatkanPengaturan(): Promise<PengaturanKantin> {
    return await apiRequest<PengaturanKantin>('/pengaturan');
  },

  async perbaruiPengaturan(updates: Partial<PengaturanKantin>): Promise<PengaturanKantin> {
    return await apiRequest<PengaturanKantin>('/pengaturan', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};
