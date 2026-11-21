import { STALL_LIST } from '@/data';
import { Stall } from '@/models';

export const stallApi = {
  async getAll(): Promise<Stall[]> {
    // Simulated API call fetching from data source
    return Promise.resolve([...STALL_LIST]);
  },

  async getById(id: string): Promise<Stall | null> {
    const stall = STALL_LIST.find((s) => s.id === id) || null;
    return Promise.resolve(stall);
  },
};
