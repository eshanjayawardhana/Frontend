import { CustomerRepresentation } from './customer-representation';
import { CustomerSiteRepresentation } from './customer-site-representation';
import { PestTypeRepresentation } from './pest-type-representation';
import { ServiceTypeRepresentation } from './service-type-representation';
import { StatusRepresentation } from './status-representation';

export interface ServiceRequestRepresentation {
  id?: number | string;
  requestCode?: string;
  requestDate?: Date;
  preferredDate?: Date;
  problemDescription?: string;
  priority?: string | null;
  customer?: CustomerRepresentation;
  customerSite?: CustomerSiteRepresentation;
  pestType?: PestTypeRepresentation;
  serviceType?: ServiceTypeRepresentation;
  status?: StatusRepresentation;
}
