import { CartItem, Menu } from '@/models';

export interface CartTotals {
  totalCount: number;
  totalAmount: number;
  itemsByStall: Record<string, CartItem[]>;
  totalsByStall: Record<string, number>;
}

export const cartController = {
  addItem(currentItems: CartItem[], menuItem: Menu): CartItem[] {
    if (menuItem.isSoldOut) return currentItems;

    const existingIndex = currentItems.findIndex(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingIndex > -1) {
      return currentItems.map((item, idx) =>
        idx === existingIndex ? { ...item, qty: item.qty + 1 } : item
      );
    }

    return [...currentItems, { menuItem, qty: 1 }];
  },

  removeItem(currentItems: CartItem[], menuItemId: string): CartItem[] {
    const existing = currentItems.find((item) => item.menuItem.id === menuItemId);
    if (!existing) return currentItems;

    if (existing.qty <= 1) {
      return currentItems.filter((item) => item.menuItem.id !== menuItemId);
    }

    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, qty: item.qty - 1 } : item
    );
  },

  setItemQty(currentItems: CartItem[], menuItemId: string, qty: number): CartItem[] {
    if (qty <= 0) {
      return currentItems.filter((item) => item.menuItem.id !== menuItemId);
    }

    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, qty } : item
    );
  },

  updateItemNotes(
    currentItems: CartItem[],
    menuItemId: string,
    notes: string
  ): CartItem[] {
    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, notes } : item
    );
  },

  getItemQty(items: CartItem[], menuItemId: string): number {
    const item = items.find((i) => i.menuItem.id === menuItemId);
    return item ? item.qty : 0;
  },

  calculateTotals(items: CartItem[]): CartTotals {
    const itemsByStall: Record<string, CartItem[]> = {};
    const totalsByStall: Record<string, number> = {};
    let totalCount = 0;
    let totalAmount = 0;

    for (const item of items) {
      const sId = item.menuItem.stallId;
      const subtotal = item.menuItem.price * item.qty;

      if (!itemsByStall[sId]) {
        itemsByStall[sId] = [];
      }
      itemsByStall[sId].push(item);

      totalsByStall[sId] = (totalsByStall[sId] || 0) + subtotal;
      totalCount += item.qty;
      totalAmount += subtotal;
    }

    return {
      totalCount,
      totalAmount,
      itemsByStall,
      totalsByStall,
    };
  },
};
