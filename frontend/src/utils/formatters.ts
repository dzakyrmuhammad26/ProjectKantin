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
