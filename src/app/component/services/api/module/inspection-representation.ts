import { ServiceRequestRepresentation } from './service-request-representation';
import { CustomerSiteRepresentation } from './customer-site-representation';
import { TechnicianRepresentation } from './technician-representation';
import { StatusRepresentation } from './student-representation';

export interface InspectionRepresentation {
  id?: string | number;
  inspectionCode?: string;
  inspectionDate?: string;
  infestationLevel?: string;
  affectedAreas?: string;
  findings?: string;
  recommendation?: string;
  serviceRequest?: ServiceRequestRepresentation;
  customerSite?: CustomerSiteRepresentation;
  technician?: TechnicianRepresentation;
  status?: StatusRepresentation;
}
