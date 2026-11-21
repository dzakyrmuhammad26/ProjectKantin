import { menuApi } from '@/api';
import { Menu, Stall } from '@/models';

export interface FilteredStallGroup {
  stall: Stall;
  menus: Menu[];
}

export const menuController = {
  async getMenus(): Promise<Menu[]> {
    return await menuApi.getAll();
  },

  async getMenuById(id: string): Promise<Menu | null> {
    return await menuApi.getById(id);
  },

  async getMenusByStall(stallId: string): Promise<Menu[]> {
    return await menuApi.getByStallId(stallId);
  },

  filterMenus(
    menus: Menu[],
    stalls: Stall[],
    searchQuery: string,
    activeTabId: string
  ): FilteredStallGroup[] {
    const q = searchQuery.trim().toLowerCase();

    const visibleStalls =
      activeTabId === 'all'
        ? stalls
        : stalls.filter((s) => s.id === activeTabId);

    return visibleStalls
      .map((stall) => {
        const stallMenus = menus.filter((item) => item.stallId === stall.id);
        const matchingMenus = stallMenus.filter((item) => {
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            stall.name.toLowerCase().includes(q)
          );
        });

        return {
          stall,
          menus: matchingMenus,
        };
      })
      .filter((group) => group.menus.length > 0);
  },
};
