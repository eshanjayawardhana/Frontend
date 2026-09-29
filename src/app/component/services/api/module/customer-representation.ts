import { StatusRepresentation } from './student-representation';

export interface CustomerRepresentation {
  id?: string | number;
  customerCode?: string;
  customerName?: string;
  customerType?: string;
  email?: string;
  phone?: string;
  nic?: string;
  billingAddress?: string;
  status?: StatusRepresentation;
}
