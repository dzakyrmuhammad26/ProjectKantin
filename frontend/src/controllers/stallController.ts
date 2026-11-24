import { geraiApi } from '@/api/geraiApi';
import { Stall } from '@/models/gerai';

class StallController {
  async getStalls(): Promise<Stall[]> {
    return await geraiApi.dapatkanSemua();
  }

  async getStallById(id: string): Promise<Stall | null> {
    return await geraiApi.dapatkanBerdasarkanId(id);
  }

  getStallMap(stalls: Stall[]): Map<string, Stall> {
    return new Map(stalls.map((s) => [s.id, s]));
  }
}

const stallController = new StallController();
export { stallController };
export default stallController;
