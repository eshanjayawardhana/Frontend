import { Component, OnInit } from '@angular/core';
import { PestTypeRepresentation } from '../services/api/module/pest-type-representation';
import { PestTypeService } from '../services/api/pest-type/pest-type.service';
import { StatusService } from '../services/api/status/status.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-pest-type',
  templateUrl: './pest-type.component.html',
  styleUrls: ['./pest-type.component.scss'],
})
export class PestTypeComponent implements OnInit {
  pestTypeObj: PestTypeRepresentation = { severityLevel: '' };
  pestTypes: Array<any> = [];

  type: string;
  isEditPestType: boolean = false;
  dtDynamicVerticalScrollExample: any;

  // Search text for filtering pest types
  searchText: string = '';
  allPestTypes: Array<any> = [];

  canCreate = false;
  canUpdate = false;
  canDelete = false;
  severityLevelValue: any;
  selectedFilterSeverityLevelId: any = null;

  constructor(
    private pestTypeService: PestTypeService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditPestType = false;
    this.canCreate = this.permissionHelper.has(AuthIds.PEST_TYPE_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.PEST_TYPE_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.PEST_TYPE_DELETE);
    this.GetAllPestTypes();
  }

  SavePestType(form: any): void {
    // 1. Validate form
    if (form.invalid) {
      return;
    }
    // 4. Decide Add or Update
    this.type = this.isEditPestType == false ? 'Add' : 'Update';

    // ADD
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.pestTypeService
            .createPestType(this.pestTypeObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllPestTypes();
                this.ClearForm(form);

                swal('Successful!', 'Pest Type has been added!', 'success');
              },

              error: (error): void => {
                console.error('Failed to add pest type:', error);

                swal('Error!', 'Failed to add pest type.', 'error');
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
          this.pestTypeService
            .createPestType(this.pestTypeObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllPestTypes();
                this.ClearForm(form);

                swal('Successful!', 'Pest Type has been updated!', 'success');
              },

              error: (error): void => {
                console.error('Failed to update pest type:', error);

                swal('Error!', 'Failed to update pest type.', 'error');
              },
            });
        }
      });
    }
  }

  GetPestTypeById(ID: any) {
    this.pestTypeService.GetPestTypeById(ID).subscribe((allData) => {
      this.pestTypeObj = allData.data.dataList[0];
      this.severityLevelValue = allData.data.dataList[0].severityLevel;

      this.isEditPestType = true;
    });
  }

  GetAllPestTypes() {
    this.pestTypeService.GetAllPestTypes().subscribe({
      next: (allData) => {
        this.pestTypes = allData?.data?.dataList || [];
        this.allPestTypes = [...this.pestTypes];
        // console.log('Pest Types:', this.pestTypes);
      },
      error: (error) => {
        console.error('Failed to load pest types:', error);
      },
    });
  }

  DeletePestTypeById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Pest Type?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.pestTypeService.DeletePestTypeById(ID).subscribe({
          next: (allData) => {
            this.GetAllPestTypes();

            swal(
              'Deleted!',
              'Pest Type has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete pest type:', error);

            swal('Error!', 'Failed to delete pest type.', 'error');
          },
        });
      }
    });
  }

  SearchPestTypes(): void {
    const search = this.searchText.toLowerCase().trim();

    this.pestTypes = this.allPestTypes.filter((pestType: any) => {
      // Search Fields
      const pestName = pestType.pestName?.toLowerCase() || '';
      const description = pestType.description?.toLowerCase() || '';
      const severityLevel = pestType.severityLevel?.toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        pestName.includes(search) ||
        description.includes(search) ||
        severityLevel.includes(search);

      // Severity Level Filter Condition
      const matchesSeverityLevel =
        this.selectedFilterSeverityLevelId === null ||
        this.selectedFilterSeverityLevelId === '' ||
        pestType.severityLevel === this.selectedFilterSeverityLevelId;

      // Final Result
      return matchesSearch && matchesSeverityLevel;
    });
  }

  ClearForm(form: any): void {
    this.pestTypeObj = {
      severityLevel: '',
    };

    this.isEditPestType = false;
    this.severityLevelValue = null;

    form.resetForm({
      severityLevel: '',
    });
  }
}
