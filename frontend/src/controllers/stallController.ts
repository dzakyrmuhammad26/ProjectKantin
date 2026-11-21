import { stallApi } from '@/api';
import { Stall } from '@/models';

export const stallController = {
  async getStalls(): Promise<Stall[]> {
    return await stallApi.getAll();
  },

  async getStallById(id: string): Promise<Stall | null> {
    return await stallApi.getById(id);
  },

  getStallMap(stalls: Stall[]): Map<string, Stall> {
    return new Map(stalls.map((s) => [s.id, s]));
  },
};
