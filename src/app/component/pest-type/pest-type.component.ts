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

  severityLevel: string[] = [
    'Low',
    'Medium',
    'High',
  ];

  pestTypeObj: PestTypeRepresentation = { severityLevel:null as any };
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
  selectedFilterSeverityLevelId: string | null = null;

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
  // 1. Validate form — unchanged
  if (form.invalid) {
    return;
  }

  // 2. Decide Add or Update — unchanged
  this.type = this.isEditPestType == false ? 'Add' : 'Update';

  const isUpdate = this.type == 'Update';

  // Confirmation dialog — consistent UI/UX
  swal({
    title: isUpdate ? 'Update Pest Type?' : 'Add Pest Type?',
    text: isUpdate
      ? 'Are you sure you want to update this pest type?'
      : 'Are you sure you want to add this pest type?',
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
    this.pestTypeService
      .createPestType(this.pestTypeObj, this.type)
      .subscribe({
        next: (result): void => {
          this.GetAllPestTypes();
          this.ClearForm(form);

          swal(
            'Successful!',
            isUpdate
              ? 'Pest Type has been updated successfully!'
              : 'Pest Type has been added successfully!',
            'success',
          );
        },

        error: (error): void => {
          console.error(
            `Failed to ${isUpdate ? 'update' : 'add'} pest type:`,
            error,
          );

          swal(
            'Error!',
            isUpdate
              ? 'Failed to update pest type.'
              : 'Failed to add pest type.',
            'error',
          );
        },
      });
  });
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
      severityLevel: null as any,
    };

    this.isEditPestType = false;
    this.severityLevelValue = null;

    form.resetForm({
      severityLevel: null as any,
    });
  }
}
