import { PestTypeRepresentation } from './pest-type-representation';
import { StatusRepresentation } from './status-representation';

export interface ServiceTypeRepresentation {
  id?: number | string;
  serviceCode?: string;
  serviceName?: string;
  description?: string;
  basePrice?: number;
  estimatedDurationHrs?: number;
  pestType?: PestTypeRepresentation;
  status?: StatusRepresentation;
}
