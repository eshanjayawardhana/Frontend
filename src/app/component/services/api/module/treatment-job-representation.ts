import { ServiceRequestRepresentation } from './service-request-representation';
import { InspectionRepresentation } from './inspection-representation';
import { ServiceContractRepresentation } from './service-contract-representation';
import { CustomerSiteRepresentation } from './customer-site-representation';
import { TechnicianRepresentation } from './technician-representation';
import { ServiceTypeRepresentation } from './service-type-representation';
import { StatusRepresentation } from './student-representation';

export interface TreatmentJobRepresentation {
  id?: string | number;
  jobCode?: string;
  scheduledDate?: string;
  completedDate?: string;
  workDone?: string;
  hoursSpent?: number;
  customerSignature?: string;

  serviceRequest?: ServiceRequestRepresentation;
  inspection?: InspectionRepresentation;
  serviceContract?: ServiceContractRepresentation;
  customerSite?: CustomerSiteRepresentation;
  technician?: TechnicianRepresentation;
  serviceType?: ServiceTypeRepresentation;
  status?: StatusRepresentation;
}
