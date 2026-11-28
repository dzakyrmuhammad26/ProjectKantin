import { CartItem } from '@/models/pesanan';
import { Menu } from '@/models/menu';

class CartController {
  addItem(currentItems: CartItem[], menuItem: Menu): CartItem[] {
    if (menuItem.isSoldOut || menuItem.isHabis) return currentItems;

    const existingIndex = currentItems.findIndex(
      (item) => item.menuItem.id === menuItem.id
    );

    if (existingIndex > -1) {
      return currentItems.map((item, idx) =>
        idx === existingIndex ? { ...item, qty: item.qty + 1 } : item
      );
    }

    return [...currentItems, { menuItem, qty: 1 }];
  }

  removeItem(currentItems: CartItem[], menuItemId: string): CartItem[] {
    const existing = currentItems.find((item) => item.menuItem.id === menuItemId);
    if (!existing) return currentItems;

    if (existing.qty <= 1) {
      return currentItems.filter((item) => item.menuItem.id !== menuItemId);
    }

    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, qty: item.qty - 1 } : item
    );
  }

  setItemQty(currentItems: CartItem[], menuItemId: string, qty: number): CartItem[] {
    if (qty <= 0) {
      return currentItems.filter((item) => item.menuItem.id !== menuItemId);
    }

    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, qty } : item
    );
  }

  updateItemNotes(
    currentItems: CartItem[],
    menuItemId: string,
    notes: string
  ): CartItem[] {
    return currentItems.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, notes } : item
    );
  }

  getItemQty(items: CartItem[], menuItemId: string): number {
    const item = items.find((i) => i.menuItem.id === menuItemId);
    return item ? item.qty : 0;
  }

  validateCardNumber(
    cardNumber: string,
    min = 1,
    max = 99
  ): { valid: boolean; error?: string } {
    const trimmed = cardNumber.trim();
    if (!trimmed) {
      return { valid: false, error: `Nomor kartu fisik wajib diisi (${min} - ${max})` };
    }
    if (!/^\d+$/.test(trimmed)) {
      return {
        valid: false,
        error: `Nomor kartu harus berupa angka bulat antara ${min} sampai ${max}`,
      };
    }
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < min || num > max) {
      return {
        valid: false,
        error: `Nomor kartu harus berupa angka antara ${min} sampai ${max}`,
      };
    }
    return { valid: true };
  }

  calculateTotals(items: CartItem[]) {
    const itemsByStall: Record<string, CartItem[]> = {};
    const totalsByStall: Record<string, number> = {};
    let totalCount = 0;
    let totalAmount = 0;

    for (const item of items) {
      const sId = item.menuItem.stallId || item.menuItem.idGerai;
      const price = item.menuItem.price || item.menuItem.harga || 0;
      const subtotal = price * item.qty;

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
  }
}

const cartController = new CartController();
export { cartController };
export default cartController;
