import { laporanApi } from '@/api/laporanApi';
import { RekapHarianGerai, RingkasanDashboard } from '@/models/laporan';

class AdminLaporanController {
  async getRingkasanDashboard(): Promise<RingkasanDashboard> {
    return await laporanApi.dapatkanRingkasanDashboard();
  }

  async getRekapHarianGerai(): Promise<RekapHarianGerai[]> {
    return await laporanApi.dapatkanRekapHarianGerai();
  }
}

const adminLaporanController = new AdminLaporanController();
export { adminLaporanController };
export default adminLaporanController;
