import { Component, OnInit } from '@angular/core';
import { InspectionRepresentation } from '../services/api/module/inspection-representation';
import { InspectionService } from '../services/api/inspection/inspection.service';
import { StatusService } from '../services/api/status/status.service';
import { TechnicianService } from '../services/api/technician/technician.service';
import { CustomerSiteService } from './../services/api/customer-site/customer-site.service';

import { FormBuilder } from '@angular/forms';
import { ServiceRequestService } from '../services/api/service-request/service-request.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss'],
})
export class InspectionComponent implements OnInit {
  infestationLevel: string[] = ['Low', 'Medium', 'Severe'];

  inspectionObj: InspectionRepresentation = { infestationLevel: null as any };
  inspections: Array<any> = [];

  // objects from other modules
  allServiceRequests: any;
  allCustomerSites: any;
  allTechnicians: any;
  allStatus: any;

  selectedServiceRequestId: number | null = null;
  selectedCustomerSitesId: number | null = null;
  selectedTechniciansId: number | null = null;
  selectedStatusId: number | null = null;

  // Search text for filtering inspections
  searchText: string = '';
  allInspections: Array<any> = [];

  selectedFilterServiceRequestId: number | null = null;
  selectedFilterCustomerSitesId: number | null = null;
  selectedFilterTechniciansId: number | null = null;
  selectedFilterStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditInspection: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private inspectionService: InspectionService,
    private serviceRequestService: ServiceRequestService,
    private CustomerSiteService: CustomerSiteService,
    private technicianService: TechnicianService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditInspection = false;
    this.canCreate = this.permissionHelper.has(AuthIds.INSPECTIONS_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.INSPECTIONS_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.INSPECTIONS_DELETE);

    this.GetAllInspections();
    this.GetAllServiceRequests();
    this.GetAllCustomerSites();
    this.GetAllTechnicians();
    this.GetAllInspectionStatus();

    this.selectedServiceRequestId = null;
    this.selectedCustomerSitesId = null;
    this.selectedTechniciansId = null;
    this.selectedStatusId = null;
  }

  SaveInspection(form: any): void {
    if (form.invalid) {
      return;
    }

    // Set service request — unchanged
    this.inspectionObj.serviceRequest = {
      id: Number(this.selectedServiceRequestId),
    };

    // Set customer site — unchanged
    this.inspectionObj.customerSite = {
      id: Number(this.selectedCustomerSitesId),
    };

    // Set technician — unchanged
    this.inspectionObj.technician = {
      id: Number(this.selectedTechniciansId),
    };

    // Set status — unchanged
    this.inspectionObj.status = {
      id: Number(this.selectedStatusId),
    };

    // Decide Add or Update — unchanged
    this.type = this.isEditInspection == false ? 'Add' : 'Update';

    const isUpdate = this.type == 'Update';

    swal({
      title: isUpdate ? 'Update Inspection?' : 'Add Inspection?',
      text: isUpdate
        ? 'Are you sure you want to update this inspection?'
        : 'Are you sure you want to add this inspection?',
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

      this.inspectionService
        .createInspection(this.inspectionObj, this.type)
        .subscribe({
          next: (result): void => {
            if (isUpdate) {
              this.ClearForm(form);
              this.GetAllInspections();

              swal('Successful!', 'Inspection has been updated!', 'success');
            } else {
              this.GetAllInspections();
              this.ClearForm(form);

              swal('Successful!', 'Inspection has been added!', 'success');
            }
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} Inspection:`,
              error,
            );

            swal(
              'Error!',
              isUpdate
                ? 'Failed to update Inspection.'
                : 'Failed to add Inspection.',
              'error',
            );
          },
        });
    });
  }

  GetInspectionById(ID: any) {
    this.inspectionService.GetInspectionById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Inspection not found');
          return;
        }

        this.inspectionObj = data;

        // Set dropdown values
        this.selectedServiceRequestId = data.serviceRequest?.id ?? null;
        this.selectedCustomerSitesId = data.customerSite?.id ?? null;
        this.selectedTechniciansId = data.technician?.id ?? null;
        this.selectedStatusId = data.status?.id ?? null;

        // console.log('Edit Inspection:', this.inspectionObj);
        // console.log('InfestationLevel:', this.inspectionObj.infestationLevel);

        this.isEditInspection = true;
      },

      error: (error) => {
        console.error('Failed to load inspection:', error);
      },
    });
  }

  GetAllInspections() {
    this.inspectionService.GetAllInspections().subscribe({
      next: (allData) => {
        this.inspections = allData?.data?.dataList || [];
        this.allInspections = [...this.inspections];
        // console.log('Inspections:', this.inspections);
      },
      error: (error) => {
        console.error('Failed to load Inspections:', error);
      },
    });
  }

  DeleteInspectionById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Inspection?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.inspectionService.DeleteInspectionById(ID).subscribe({
          next: (allData) => {
            this.GetAllInspections();

            swal(
              'Deleted!',
              'Inspection has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete inspection:', error);

            swal('Error!', 'Failed to delete inspection.', 'error');
          },
        });
      }
    });
  }

  ////////// load data from other modules /////////////

  // 1. Service Requests
  GetAllServiceRequests() {
    this.serviceRequestService.GetAllServiceRequests().subscribe({
      next: (allData) => {
        this.allServiceRequests = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Service Requests:', error);
      },
    });
  }

  // 2. Customer Sites
  GetAllCustomerSites() {
    this.CustomerSiteService.GetAllCustomerSites().subscribe({
      next: (allData) => {
        this.allCustomerSites = allData?.data?.dataList || [];
        // console.log('Customer Sites:', this.allCustomerSites);
      },
      error: (error) => {
        console.error('Failed to load customer Sites:', error);
      },
    });
  }

  // 3. Technicians
  GetAllTechnicians() {
    this.technicianService.GetAllTechnicians().subscribe({
      next: (allData) => {
        this.allTechnicians = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load technicians:', error);
      },
    });
  }

  // 4. InspectionStatus
  GetAllInspectionStatus() {
    this.statusService.GetAllInspectionStatus().subscribe({
      next: (allData) => {
        this.allStatus = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load inspection status:', error);
      },
    });
  }

  // Search and Filter

  // Search and Filter
  SearchInspections(): void {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.inspections = this.allInspections.filter((type: any) => {
      // =========================
      // Search Fields
      // =========================
      const inspectionCode =
        type.inspectionCode?.toString().toLowerCase() || '';

      const inspectionDate =
        type.inspectionDate?.toString().toLowerCase() || '';

      const infestationLevel =
        type.infestationLevel?.toString().toLowerCase() || '';

      const affectedAreas = type.affectedAreas?.toString().toLowerCase() || '';

      const findings = type.findings?.toString().toLowerCase() || '';

      const recommendation =
        type.recommendation?.toString().toLowerCase() || '';

      const serviceRequest =
        type.serviceRequest?.requestCode?.toString().toLowerCase() || '';

      const customerSite =
        type.customerSite?.siteName?.toString().toLowerCase() || '';

      const technician =
        type.technician?.fullName?.toString().toLowerCase() || '';

      const status = type.status?.name?.toString().toLowerCase() || '';

      // =========================
      // Search Condition
      // =========================
      const matchesSearch =
        !search ||
        inspectionCode.includes(search) ||
        inspectionDate.includes(search) ||
        infestationLevel.includes(search) ||
        affectedAreas.includes(search) ||
        findings.includes(search) ||
        recommendation.includes(search) ||
        serviceRequest.includes(search) ||
        customerSite.includes(search) ||
        technician.includes(search) ||
        status.includes(search);

      // =========================
      // Service Request Filter
      // =========================
      const matchesServiceRequest =
        this.selectedFilterServiceRequestId == null ||
        Number(type.serviceRequest?.id) ===
          Number(this.selectedFilterServiceRequestId);

      // =========================
      // Customer Site Filter
      // =========================
      const matchesCustomerSite =
        this.selectedFilterCustomerSitesId == null ||
        Number(type.customerSite?.id) ===
          Number(this.selectedFilterCustomerSitesId);

      // =========================
      // Technician Filter
      // =========================
      const matchesTechnician =
        this.selectedFilterTechniciansId == null ||
        Number(type.technician?.id) ===
          Number(this.selectedFilterTechniciansId);

      // =========================
      // Status Filter
      // =========================
      const matchesStatus =
        this.selectedFilterStatusId == null ||
        Number(type.status?.id) === Number(this.selectedFilterStatusId);

      // =========================
      // Final Result
      // =========================
      return (
        matchesSearch &&
        matchesServiceRequest &&
        matchesCustomerSite &&
        matchesTechnician &&
        matchesStatus
      );
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.inspectionObj.status = { id: statusId };
  }

  onChangeType($event: Event) {
    const selectedType = ($event.target as HTMLSelectElement).value;
    this.inspectionObj.infestationLevel = selectedType;
  }

  ClearForm(form: any): void {
    this.inspectionObj = {
      infestationLevel: null as any,
    };

    this.isEditInspection = false;
    this.statusValue = null;

    this.selectedServiceRequestId = null;
    this.selectedCustomerSitesId = null;
    this.selectedTechniciansId = null;
    this.selectedStatusId = null;

    form.resetForm();
  }
}
