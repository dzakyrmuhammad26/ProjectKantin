export type PaymentMethod = 'cash' | 'qris' | 'debit';

export interface PaymentDetails {
  method: PaymentMethod;
  amountPaid: number;
  change: number;
  paidAt: string;
}
