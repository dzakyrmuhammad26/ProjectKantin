export interface Menu {
  id: string;
  code: string; // e.g. G01-001
  name: string;
  price: number; // integer rupiah
  stallId: string; // G01, G02, G03, G04
  stallName: string;
  isSoldOut?: boolean;
  image?: string;
}

export type MenuItem = Menu;
