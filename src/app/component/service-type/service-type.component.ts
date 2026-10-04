import { PestTypeComponent } from './../pest-type/pest-type.component';
import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/api/status/status.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { ServiceTypeService } from '../services/api/service-type/service-type.service';
import { CustomerService } from '../services/api/customer/customer.service';
import { FormBuilder } from '@angular/forms';
import { ServiceTypeRepresentation } from '../services/api/module/service-type-representation';
import { PestTypeService } from '../services/api/pest-type/pest-type.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.scss'],
})
export class ServiceTypeComponent implements OnInit {
  serviceTypeObj: ServiceTypeRepresentation = {};
  serviceTypes: Array<any> = [];
  allStatus: any;
  allPestTypes: any;
  selectedStatusId: any = '';
  selectedPestTypeId: any = '';

  // Search text for filtering customer sites
  searchText: string = '';
  allServiceTypes: Array<any> = [];
  selectedFilterStatusId: string | null = null;
  selectedFilterPestTypeId: string | null = null;

  type: string;
  statusValue: any;
  isEditServiceType: boolean = false;
  dtDynamicVerticalScrollExample: any;

  serviceTypeColumns = [
    'Service Code',
    'Service Name',
    'Description',
    'Base Price',
    'Estimated Duration',
    'Pest Type',
    'Status',
    'Actions',
  ];

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private serviceTypeService: ServiceTypeService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    private pestTypeService: PestTypeService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditServiceType = false;
    this.canCreate = this.permissionHelper.has(AuthIds.SERVICE_TYPE_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.SERVICE_TYPE_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.SERVICE_TYPE_DELETE);
    this.GetAllServiceTypesStatus();
    this.GetAllPestTypes();
    this.GetAllServiceTypes();
    this.selectedPestTypeId = null;
    this.selectedStatusId = null;
  }

  SaveServiceType(form: any): void {
    // 1. Validate form
    if (form.invalid) {
      return;
    }

    // 2. Set status
    this.serviceTypeObj.status = {
      id: Number(this.selectedStatusId),
    };

    // 3. Set pest type
    this.serviceTypeObj.pestType = {
      id: Number(this.selectedPestTypeId),
    };

    // 4. Decide Add or Update
    this.type = this.isEditServiceType == false ? 'Add' : 'Update';

    // ADD
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.serviceTypeService
            .createServiceType(this.serviceTypeObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllServiceTypes();
                this.ClearForm(form);

                swal('Successful!', 'Service type has been added!', 'success');
              },

              error: (error): void => {
                console.error('Failed to add service type:', error);

                swal('Error!', 'Failed to add service type.', 'error');
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
          this.serviceTypeService
            .createServiceType(this.serviceTypeObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllServiceTypes();
                this.ClearForm(form);

                swal(
                  'Successful!',
                  'Service type has been updated!',
                  'success',
                );
              },

              error: (error): void => {
                console.error('Failed to update service type:', error);

                swal('Error!', 'Failed to update service type.', 'error');
              },
            });
        }
      });
    }
  }

  GetServiceTypeById(ID: any) {
    this.serviceTypeService.GetServiceTypeById(ID).subscribe((allData) => {
      this.serviceTypeObj = allData.data.dataList[0];

      this.isEditServiceType = true;

      this.selectedStatusId = allData.data.dataList[0].status.id;
      this.selectedPestTypeId = allData.data.dataList[0].pestType.id;

      this.statusValue = allData.data.dataList[0].status.name;
      // this.pestTypeValue = allData.data.dataList[0].pestType.name;

      this.serviceTypeObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the service type object
      };
      this.serviceTypeObj.pestType = {
        id: allData.data.dataList[0].pestType.id, // Set the pest type ID for the service type object
      };
    });
  }

  GetAllServiceTypes() {
    this.serviceTypeService.GetAllServiceTypes().subscribe({
      next: (allData) => {
        this.serviceTypes = allData?.data?.dataList || [];
        this.allServiceTypes = [...this.serviceTypes];
        // console.log('Service Types:', this.serviceTypes);
      },
      error: (error) => {
        console.error('Failed to load service types:', error);
      },
    });
  }

  DeleteServiceTypeById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Service Type?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.serviceTypeService.DeleteServiceTypeById(ID).subscribe({
          next: (allData) => {
            this.GetAllServiceTypes();

            swal(
              'Deleted!',
              'Service Type has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete service type:', error);

            swal('Error!', 'Failed to delete service type.', 'error');
          },
        });
      }
    });
  }

  GetAllServiceTypesStatus() {
    this.statusService.GetAllServiceTypeStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
    });
  }

  GetAllPestTypes() {
    this.pestTypeService.GetAllPestTypes().subscribe({
      next: (allData) => {
        this.allPestTypes = allData?.data?.dataList || [];
        // console.log('Pest Types:', this.allPestTypes);
      },
      error: (error) => {
        console.error('Failed to load pest types:', error);
      },
    });
  }

  SearchServiceTypes(): void {
    const search = this.searchText.toLowerCase().trim();

    this.serviceTypes = this.allServiceTypes.filter((type: any) => {
      //Search Fields
      const serviceCode = type.serviceCode?.toLowerCase() || '';
      const serviceName = type.serviceName?.toLowerCase() || '';
      const description = type.description?.toLowerCase() || '';
      const basePrice = type.basePrice?.toString().toLowerCase() || '';
      const estimatedDurationHrs =
        type.estimatedDurationHrs?.toString().toLowerCase() || '';
      const pestType = type.pestType?.pestName?.toLowerCase() || '';
      const status = type.status?.name?.toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        serviceCode.includes(search) ||
        serviceName.includes(search) ||
        description.includes(search) ||
        basePrice.includes(search) ||
        estimatedDurationHrs.includes(search) ||
        pestType.includes(search) ||
        status.includes(search);

      // Status Filter Condition
      const matchesStatus =
        this.selectedFilterStatusId === null ||
        this.selectedFilterStatusId === '' ||
        Number(type.status?.id) === Number(this.selectedFilterStatusId);

      // Pest Type filter
      const matchesPestType =
        this.selectedFilterPestTypeId === null ||
        type.pestType?.id === this.selectedFilterPestTypeId;

      // Final Result
      return matchesSearch && matchesStatus && matchesPestType;
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.serviceTypeObj.status = { id: statusId };
  }

  formatDuration(hours: number): string {
    if (!hours) {
      return 'N/A';
    }

    const totalMinutes = Math.round(hours * 60);

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h > 0 && m > 0) {
      return `${h}h ${m}m`;
    }

    if (h > 0) {
      return `${h}h`;
    }

    return `${m}m`;
  }

  ClearForm(form: any): void {
    this.serviceTypeObj = {};
    this.isEditServiceType = false;
    this.statusValue = null;
    this.selectedStatusId = null;
    this.selectedPestTypeId = null;

    form.resetForm(); // Reset the form to its initial state
  }
}
