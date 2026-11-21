/**
 * Format angka integer rupiah sesuai docs/DESIGN.md:
 * Format: "Rp 35.000" (dengan spasi setelah Rp dan titik pemisah ribuan)
 */
export function formatRupiah(amount: number): string {
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Format jam dalam 24 jam (misal 14:05 WIB)
 */
export function formatJam(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
}
