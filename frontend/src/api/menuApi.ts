import { MENU_ITEMS } from '@/data';
import { Menu } from '@/models';

export const menuApi = {
  async getAll(): Promise<Menu[]> {
    // Simulated API call fetching from data source
    return Promise.resolve([...MENU_ITEMS]);
  },

  async getById(id: string): Promise<Menu | null> {
    const menu = MENU_ITEMS.find((m) => m.id === id) || null;
    return Promise.resolve(menu);
  },

  async getByStallId(stallId: string): Promise<Menu[]> {
    const menus = MENU_ITEMS.filter((m) => m.stallId === stallId);
    return Promise.resolve(menus);
  },
};
