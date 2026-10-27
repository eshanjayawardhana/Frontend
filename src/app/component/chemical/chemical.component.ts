import { Component, OnInit } from '@angular/core';
import { ChemicalRepresentation } from '../services/api/module/chemical-representation';
import { ChemicalService } from '../services/api/chemical/chemical.service';
import { StatusService } from '../services/api/status/status.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-chemical',
  templateUrl: './chemical.component.html',
  styleUrls: ['./chemical.component.scss'],
})
export class ChemicalComponent implements OnInit {
  chemicalUnits: string[] = [
    'Milliliter (mL)',
    'Liter (L)',
    'Gram (g)',
    'Kilogram (kg)',
    'Milligram (mg)',
    'Piece (pcs)',
    'Bottle',
    'Can',
    'Packet',
    'Box',
  ];

  chemicalObj: ChemicalRepresentation = { unit: null as any };
  chemicals: Array<any> = [];
  allStatus: any;
  selectedStatusId: any = '';

  type: string;
  statusValue: any;
  isEditChemical: boolean = false;
  dtDynamicVerticalScrollExample: any;

  // Search text for filtering chemicals
  searchText: string = '';
  allChemicals: Array<any> = [];
  selectedFilterStatusId: any = null;

  canCreate = false;
  canUpdate = false;
  canDelete = false;
  chemicalUnitValue: any;

  constructor(
    private chemicalService: ChemicalService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditChemical = false;
    this.canCreate = this.permissionHelper.has(AuthIds.CHEMICAL_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.CHEMICAL_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.CHEMICAL_DELETE);
    this.GetAllChemicalStatus();
    this.GetAllChemicals();
    this.selectedStatusId = null;
  }

  SaveChemical(form: any): void {
    // 1. Validate form — unchanged
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.chemicalObj.status = {
      id: Number(this.selectedStatusId),
    };

    // 2. Decide Add or Update — unchanged
    this.type = this.isEditChemical == false ? 'Add' : 'Update';

    const isUpdate = this.type == 'Update';

    // 3. Confirmation dialog — consistent UI/UX
    swal({
      title: isUpdate ? 'Update Chemical?' : 'Add Chemical?',
      text: isUpdate
        ? 'Are you sure you want to update this chemical?'
        : 'Are you sure you want to add this chemical?',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: false,
          visible: true,
          closeModal: true,
        },
        confirm: {
          text: isUpdate ? 'Yes, Update' : 'Yes, Add',
          value: true,
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: false,
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }

      // Existing API call — unchanged
      this.chemicalService.AddChemical(this.chemicalObj, this.type).subscribe({
        next: (result): void => {
          this.GetAllChemicals();
          this.ClearForm(form);

          swal(
            'Successful!',
            isUpdate
              ? 'Chemical has been updated successfully!'
              : 'Chemical has been added successfully!',
            'success',
          );
        },

        error: (error): void => {
          console.error(
            `Failed to ${isUpdate ? 'update' : 'add'} chemical:`,
            error,
          );

          swal(
            'Error!',
            isUpdate ? 'Failed to update chemical.' : 'Failed to add chemical.',
            'error',
          );
        },
      });
    });
  }

  GetChemicalById(ID: any) {
    this.chemicalService.GetChemicalById(ID).subscribe((allData) => {
      this.chemicalObj = allData.data.dataList[0];

      this.isEditChemical = true;

      this.selectedStatusId = allData.data.dataList[0].status.id;

      this.statusValue = allData.data.dataList[0].status.name;

      this.chemicalObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the chemical object
      };

      this.chemicalUnitValue = allData.data.dataList[0].unit;
    });
  }

  GetAllChemicals() {
    this.chemicalService.GetAllChemicals().subscribe({
      next: (allData) => {
        this.chemicals = allData?.data?.dataList || [];
        this.allChemicals = [...this.chemicals];
        console.log('Chemicals:', this.chemicals);
      },
      error: (error) => {
        console.error('Failed to load chemicals:', error);
      },
    });
  }

  DeleteChemicalById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Chemical?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.chemicalService.DeleteChemicalById(ID).subscribe({
          next: (allData) => {
            this.GetAllChemicals();

            swal(
              'Deleted!',
              'Chemical has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete chemical:', error);

            swal('Error!', 'Failed to delete chemical.', 'error');
          },
        });
      }
    });
  }

  GetAllChemicalStatus() {
    this.statusService.GetAllChemicalStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
    });
  }

  /**
   filter types below for chemical search
    chemicalCode;
    chemicalName;
    activeIngredient;
    unit;
    stockQuantity;
    reorderLevel;
    LocalDate expiryDate;
    safetyNotes;
    StatusDto status;

  */

  SearchChemicals(): void {
    const search = this.searchText.toLowerCase().trim();

    this.chemicals = this.allChemicals.filter((chemical: any) => {
      // Search Fields
      const chemicalCode = chemical.chemicalCode?.toLowerCase() || '';

      const chemicalName = chemical.chemicalName?.toLowerCase() || '';

      const activeIngredient = chemical.activeIngredient?.toLowerCase() || '';

      const unit = chemical.unit?.toLowerCase() || '';

      const stockQuantity =
        chemical.stockQuantity?.toString().toLowerCase() || '';

      const reorderLevel =
        chemical.reorderLevel?.toString().toLowerCase() || '';

      const expiryDate = chemical.expiryDate?.toString().toLowerCase() || '';

      const safetyNotes = chemical.safetyNotes?.toLowerCase() || '';

      const status = chemical.status?.name?.toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        chemicalCode.includes(search) ||
        chemicalName.includes(search) ||
        activeIngredient.includes(search) ||
        unit.includes(search) ||
        stockQuantity.includes(search) ||
        reorderLevel.includes(search) ||
        expiryDate.includes(search) ||
        safetyNotes.includes(search) ||
        status.includes(search);

      // Status Filter Condition
      const matchesStatus =
        this.selectedFilterStatusId === null ||
        this.selectedFilterStatusId === '' ||
        Number(chemical.status?.id) === Number(this.selectedFilterStatusId);

      // Final Result
      return matchesSearch && matchesStatus;
    });
  }

  ClearForm(form: any): void {
    this.chemicalObj = {
      unit: null as any,
    };

    this.isEditChemical = false;
    this.statusValue = null;
    this.selectedStatusId = null;
    this.chemicalUnitValue = null;

    if (form) {
      form.resetForm();
    }
  }
}
