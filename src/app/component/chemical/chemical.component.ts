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
  chemicalObj: ChemicalRepresentation = {};
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
    this.chemicalObj.status = {
      id: Number(this.selectedStatusId),
    };
    // 1. Validate form
    if (form.invalid) {
      return;
    }
    // 4. Decide Add or Update
    this.type = this.isEditChemical == false ? 'Add' : 'Update';

    // ADD
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.chemicalService
            .AddChemical(this.chemicalObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllChemicals();
                this.ClearForm(form);

                swal('Successful!', 'Chemical has been added!', 'success');
              },

              error: (error): void => {
                console.error('Failed to add chemical:', error);

                swal('Error!', 'Failed to add chemical.', 'error');
              },
            });
        }
      });
    }
    // UPDATE
    else {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Update this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          this.chemicalService
            .AddChemical(this.chemicalObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllChemicals();
                this.ClearForm(form);

                swal('Successful!', 'Chemical has been updated!', 'success');
              },

              error: (error): void => {
                console.error('Failed to update chemical:', error);

                swal('Error!', 'Failed to update chemical.', 'error');
              },
            });
        }
      });
    }
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
    this.chemicalObj = {};
    this.isEditChemical = false;
    this.statusValue = null;
    this.selectedStatusId = null;

    form.resetForm(); // Reset the form to its initial state
  }
}
