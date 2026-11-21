import { Menu } from './menu';
import { PaymentDetails } from './payment';

export interface CartItem {
  menuItem: Menu;
  qty: number;
  notes?: string;
}

export type OrderStatus = 'pending_payment' | 'ready_to_prepare' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  cardNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  payment?: PaymentDetails;
}

export type StatusType = 'wait' | 'paid' | 'done' | 'cancel';
