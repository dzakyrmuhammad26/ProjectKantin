import { RekapHarianGerai, RingkasanDashboard } from '@/models/laporan';
import { apiRequest } from './httpClient';

export const laporanApi = {
  async dapatkanRekapHarianGerai(): Promise<RekapHarianGerai[]> {
    return await apiRequest<RekapHarianGerai[]>('/laporan/rekap-gerai');
  },

  async dapatkanRingkasanDashboard(): Promise<RingkasanDashboard> {
    return await apiRequest<RingkasanDashboard>('/laporan/ringkasan');
  },
};
