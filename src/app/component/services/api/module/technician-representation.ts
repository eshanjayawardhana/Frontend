import { UserDto } from "./login-representation";
import { StatusRepresentation } from "./status-representation";

export interface TechnicianRepresentation {
  id?: string | number;
  technicianCode?: string;
  fullName?: string;
  phone?: string;
  licenseNo?: string;
  specialization?: string;
  user?: UserDto;
  status?: StatusRepresentation;
}
