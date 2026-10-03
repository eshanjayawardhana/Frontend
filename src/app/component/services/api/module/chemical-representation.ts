import { StatusRepresentation } from './status-representation';

export interface ChemicalRepresentation {
  id?: string | number;
  chemicalCode?: string;
  chemicalName?: string;
  activeIngredient?: string;
  unit?: string;
  stockQuantity?: number;
  reorderLevel?: number;
  expiryDate?: Date;
  safetyNotes?: string;
  status?: StatusRepresentation;
}
