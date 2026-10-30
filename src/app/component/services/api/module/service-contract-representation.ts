import { CustomerRepresentation } from './customer-representation';
import { CustomerSiteRepresentation } from './customer-site-representation';
import { ServiceTypeRepresentation } from './service-type-representation';
import { StatusRepresentation } from './student-representation';

export interface ServiceContractRepresentation {
  id?: string | number;
  contractCode?: string;
  startDate?: string;
  endDate?: string;
  visitFrequency?: string;
  contractAmount?: number;
  terms?: string;

  customer?: CustomerRepresentation;
  customerSite?: CustomerSiteRepresentation;
  serviceType?: ServiceTypeRepresentation;
  status?: StatusRepresentation;
}
