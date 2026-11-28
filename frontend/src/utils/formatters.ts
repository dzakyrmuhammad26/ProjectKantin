export const MENU_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><rect width="160" height="120" fill="%23F1F5F9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="sans-serif" font-size="12">Tidak Ada Foto</text></svg>';

/**
 * Format integer rupiah amount.
 * Format: "Rp 35.000" (space after Rp, dot as thousands separator)
 */
export function formatCurrency(amount: number): string {
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Format current time in 24h format (e.g. 14:05 WIB)
 */
export function formatTime(date: Date = new Date()): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m} WIB`;
}

/**
 * Normalize label metode pembayaran sesuai konstanta backend
 */
export function formatPaymentMethodLabel(method?: string): string {
  if (!method) return '-';
  const m = method.toLowerCase();
  if (m === 'tunai' || m === 'cash') return 'UANG TUNAI';
  if (m === 'qris') return 'QRIS';
  if (m === 'debit') return 'KARTU DEBIT';
  return method.toUpperCase();
}

export function isCashMethod(method?: string): boolean {
  const m = method?.toLowerCase();
  return m === 'tunai' || m === 'cash';
}
