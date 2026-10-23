import { CustomerRepresentation } from './customer-representation';
import { StatusRepresentation } from './student-representation';

export interface CustomerSiteRepresentation {
  id?: string | number;
  siteCode?: string;
  siteName?: string;
  address?: string;
  city?: string;
  contactPerson?: string;
  contactPhone?: string;
  siteNotes?: string;
  customer?: CustomerRepresentation;
  status?: StatusRepresentation;
}
