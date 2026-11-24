import { menuApi } from '@/api/menuApi';
import { Menu } from '@/models/menu';
import { Stall } from '@/models/gerai';

class MenuController {
  async getMenus(): Promise<Menu[]> {
    return await menuApi.dapatkanSemua();
  }

  async getMenuById(id: string): Promise<Menu | null> {
    return await menuApi.dapatkanBerdasarkanId(id);
  }

  async getMenusByStall(stallId: string): Promise<Menu[]> {
    return await menuApi.dapatkanBerdasarkanGerai(stallId);
  }

  filterMenus(
    menus: Menu[],
    stalls: Stall[],
    searchQuery: string,
    activeTabId: string
  ) {
    const q = searchQuery.trim().toLowerCase();

    const visibleStalls =
      activeTabId === 'all'
        ? stalls
        : stalls.filter((s) => s.id === activeTabId);

    return visibleStalls
      .map((stall) => {
        const stallMenus = menus.filter(
          (item) => item.stallId === stall.id || item.idGerai === stall.id
        );
        const matchingMenus = stallMenus.filter((item) => {
          if (!q) return true;
          const name = item.nama || item.name;
          const code = item.kode || item.code;
          const sName = stall.nama || stall.name;
          return (
            name.toLowerCase().includes(q) ||
            code.toLowerCase().includes(q) ||
            sName.toLowerCase().includes(q)
          );
        });

        return {
          stall,
          menus: matchingMenus,
        };
      })
      .filter((group) => group.menus.length > 0);
  }
}

const menuController = new MenuController();
export { menuController };
export default menuController;
