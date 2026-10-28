import { Component, OnInit } from '@angular/core';
import { TreatmentJobRepresentation } from '../services/api/module/treatment-job-representation';
import { TreatmentJobService } from '../services/api/treatment-job/treatment-job.service';
import { InspectionService } from '../services/api/inspection/inspection.service';
import { StatusService } from '../services/api/status/status.service';
import { TechnicianService } from '../services/api/technician/technician.service';
import { CustomerSiteService } from '../services/api/customer-site/customer-site.service';
import { FormBuilder } from '@angular/forms';
import { ServiceRequestService } from '../services/api/service-request/service-request.service';
import { ServiceTypeService } from '../services/api/service-type/service-type.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import swal from 'sweetalert';
import { ServiceContracService } from '../services/api/service-contract/service-contrac.service';

@Component({
  selector: 'app-treatment-job',
  templateUrl: './treatment-job.component.html',
  styleUrls: ['./treatment-job.component.scss']
})
export class TreatmentJobComponent implements OnInit {

  treatmentJobObj: TreatmentJobRepresentation = {};
  treatmentJobs: Array<any> = [];

  // Objects from other modules
  allServiceRequests: any;
  allInspections: any;
  allServiceContracts: any;
  allCustomerSites: any;
  allTechnicians: any;
  allServiceTypes: any;
  allStatus: any;

  // Selected dropdown values
  selectedServiceRequestId: number | null = null;
  selectedInspectionId: number | null = null;
  selectedServiceContractId: number | null = null;
  selectedCustomerSitesId: number | null = null;
  selectedTechniciansId: number | null = null;
  selectedServiceTypeId: number | null = null;
  selectedStatusId: number | null = null;

  // Search text for filtering Treatment Jobs
  searchText: string = '';
  allTreatmentJobs: Array<any> = [];

  // Selected filter values
  selectedFilterServiceRequestId: number | null = null;
  selectedFilterInspectionId: number | null = null;
  selectedFilterServiceContractId: number | null = null;
  selectedFilterCustomerSitesId: number | null = null;
  selectedFilterTechniciansId: number | null = null;
  selectedFilterServiceTypeId: number | null = null;
  selectedFilterStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditTreatmentJob: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private treatmentJobService: TreatmentJobService,
    private serviceRequestService: ServiceRequestService,
    private inspectionService: InspectionService,
    private serviceContractService: ServiceContracService,
    private CustomerSiteService: CustomerSiteService,
    private technicianService: TechnicianService,
    private serviceTypeService: ServiceTypeService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditTreatmentJob = false;

    // Load permissions
    this.canCreate = this.permissionHelper.has(AuthIds.TREATMENT_JOBS_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.TREATMENT_JOBS_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.TREATMENT_JOBS_DELETE);

    // Load Treatment Job data
    this.GetAllTreatmentJobs();

    // Load data from other modules
    this.GetAllServiceRequests();
    this.GetAllInspections();
    this.GetAllServiceContracts();
    this.GetAllCustomerSites();
    this.GetAllTechnicians();
    this.GetAllServiceTypes();
    this.GetAllTreatmentJobStatus();

    // Initialize selected dropdown values
    this.selectedServiceRequestId = null;
    this.selectedInspectionId = null;
    this.selectedServiceContractId = null;
    this.selectedCustomerSitesId = null;
    this.selectedTechniciansId = null;
    this.selectedServiceTypeId = null;
    this.selectedStatusId = null;
  }

  SaveTreatmentJob(form: any): void {
    if (form.invalid) {
      return;
    }

    // Set Service Request
    this.treatmentJobObj.serviceRequest = {
      id: Number(this.selectedServiceRequestId),
    };

    // Set Inspection
    this.treatmentJobObj.inspection = {
      id: Number(this.selectedInspectionId),
    };

    // Set Service Contract
    // Service Contract is optional
    this.treatmentJobObj.serviceContract = this.selectedServiceContractId == null
      ? undefined
      : { id: Number(this.selectedServiceContractId) };

    // Set Customer Site
    this.treatmentJobObj.customerSite = {
      id: Number(this.selectedCustomerSitesId),
    };

    // Set Technician
    this.treatmentJobObj.technician = {
      id: Number(this.selectedTechniciansId),
    };

    // Set Service Type
    this.treatmentJobObj.serviceType = {
      id: Number(this.selectedServiceTypeId),
    };

    // Set Status
    this.treatmentJobObj.status = {
      id: Number(this.selectedStatusId),
    };

    // Decide Add or Update
    this.type = this.isEditTreatmentJob == false ? 'Add' : 'Update';

    const isUpdate = this.type == 'Update';

    swal({
      title: isUpdate ? 'Update Treatment Job?' : 'Add Treatment Job?',
      text: isUpdate
        ? 'Are you sure you want to update this treatment job?'
        : 'Are you sure you want to add this treatment job?',
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

      this.treatmentJobService
        .createTreatmentJob(this.treatmentJobObj, this.type)
        .subscribe({
          next: (result): void => {
            if (isUpdate) {
              this.ClearForm(form);
              this.GetAllTreatmentJobs();

              swal(
                'Successful!',
                'Treatment Job has been updated!',
                'success'
              );
            } else {
              this.GetAllTreatmentJobs();
              this.ClearForm(form);

              swal(
                'Successful!',
                'Treatment Job has been added!',
                'success'
              );
            }
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} Treatment Job:`,
              error,
            );

            swal(
              'Error!',
              isUpdate
                ? 'Failed to update Treatment Job.'
                : 'Failed to add Treatment Job.',
              'error',
            );
          },
        });
    });
  }

  GetTreatmentJobById(ID: any) {
    this.treatmentJobService.GetTreatmentJobById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Treatment Job not found');
          return;
        }

        this.treatmentJobObj = data;

        // Set dropdown values
        this.selectedServiceRequestId = data.serviceRequest?.id ?? null;
        this.selectedInspectionId = data.inspection?.id ?? null;
        this.selectedServiceContractId = data.serviceContract?.id ?? null;
        this.selectedCustomerSitesId = data.customerSite?.id ?? null;
        this.selectedTechniciansId = data.technician?.id ?? null;
        this.selectedServiceTypeId = data.serviceType?.id ?? null;
        this.selectedStatusId = data.status?.id ?? null;

        // Enable edit mode
        this.isEditTreatmentJob = true;
      },

      error: (error) => {
        console.error('Failed to load Treatment Job:', error);
      },
    });
  }

  GetAllTreatmentJobs() {
    this.treatmentJobService.GetAllTreatmentJobs().subscribe({
      next: (allData) => {
        this.treatmentJobs = allData?.data?.dataList || [];
        this.allTreatmentJobs = [...this.treatmentJobs];

        // console.log('Treatment Jobs:', this.treatmentJobs);
      },
      error: (error) => {
        console.error('Failed to load Treatment Jobs:', error);
      },
    });
  }

  DeleteTreatmentJobById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Treatment Job?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.treatmentJobService.DeleteTreatmentJobById(ID).subscribe({
          next: (allData) => {
            this.GetAllTreatmentJobs();

            swal(
              'Deleted!',
              'Treatment Job has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete Treatment Job:', error);

            swal('Error!', 'Failed to delete Treatment Job.', 'error');
          },
        });
      }
    });
  }

  ////////// Load data from other modules /////////////

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

  // 2. Inspections
  GetAllInspections() {
    this.inspectionService.GetAllInspections().subscribe({
      next: (allData) => {
        this.allInspections = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Inspections:', error);
      },
    });
  }

  // 3. Service Contracts
  GetAllServiceContracts() {
    this.serviceContractService.GetAllServiceContracts().subscribe({
      next: (allData) => {
        this.allServiceContracts = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Service Contracts:', error);
      },
    });
  }

  // 4. Customer Sites
  GetAllCustomerSites() {
    this.CustomerSiteService.GetAllCustomerSites().subscribe({
      next: (allData) => {
        this.allCustomerSites = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Customer Sites:', error);
      },
    });
  }

  // 5. Technicians
  GetAllTechnicians() {
    this.technicianService.GetAllTechnicians().subscribe({
      next: (allData) => {
        this.allTechnicians = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Technicians:', error);
      },
    });
  }

  // 6. Service Types
  GetAllServiceTypes() {
    this.serviceTypeService.GetAllServiceTypes().subscribe({
      next: (allData) => {
        this.allServiceTypes = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Service Types:', error);
      },
    });
  }

  // 7. Treatment Job Status
  GetAllTreatmentJobStatus() {
    this.statusService.GetAllTreatmentJobStatus().subscribe({
      next: (allData) => {
        this.allStatus = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load Treatment Job status:', error);
      },
    });
  }

  // Search and Filter
  SearchTreatmentJobs(): void {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.treatmentJobs = this.allTreatmentJobs.filter((type: any) => {

      // =========================
      // Search Fields
      // =========================
      const jobCode = type.jobCode?.toString().toLowerCase() || '';

      const scheduledDate =
        type.scheduledDate?.toString().toLowerCase() || '';

      const completedDate =
        type.completedDate?.toString().toLowerCase() || '';

      const workDone = type.workDone?.toString().toLowerCase() || '';

      const hoursSpent = type.hoursSpent?.toString().toLowerCase() || '';

      const customerSignature =
        type.customerSignature?.toString().toLowerCase() || '';

      const serviceRequest =
        type.serviceRequest?.requestCode?.toString().toLowerCase() || '';

      const inspection =
        type.inspection?.inspectionCode?.toString().toLowerCase() || '';

      const serviceContract =
        type.serviceContract?.contractCode?.toString().toLowerCase() || '';

      const customerSite =
        type.customerSite?.siteName?.toString().toLowerCase() || '';

      const technician =
        type.technician?.fullName?.toString().toLowerCase() || '';

      const serviceType =
        type.serviceType?.serviceName?.toString().toLowerCase() || '';

      const status = type.status?.name?.toString().toLowerCase() || '';

      // =========================
      // Search Condition
      // =========================
      const matchesSearch =
        !search ||
        jobCode.includes(search) ||
        scheduledDate.includes(search) ||
        completedDate.includes(search) ||
        workDone.includes(search) ||
        hoursSpent.includes(search) ||
        customerSignature.includes(search) ||
        serviceRequest.includes(search) ||
        inspection.includes(search) ||
        serviceContract.includes(search) ||
        customerSite.includes(search) ||
        technician.includes(search) ||
        serviceType.includes(search) ||
        status.includes(search);

      // =========================
      // Service Request Filter
      // =========================
      const matchesServiceRequest =
        this.selectedFilterServiceRequestId == null ||
        Number(type.serviceRequest?.id) ===
          Number(this.selectedFilterServiceRequestId);

      // =========================
      // Inspection Filter
      // =========================
      const matchesInspection =
        this.selectedFilterInspectionId == null ||
        Number(type.inspection?.id) ===
          Number(this.selectedFilterInspectionId);

      // =========================
      // Service Contract Filter
      // =========================
      const matchesServiceContract =
        this.selectedFilterServiceContractId == null ||
        Number(type.serviceContract?.id) ===
          Number(this.selectedFilterServiceContractId);

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
      // Service Type Filter
      // =========================
      const matchesServiceType =
        this.selectedFilterServiceTypeId == null ||
        Number(type.serviceType?.id) ===
          Number(this.selectedFilterServiceTypeId);

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
        matchesInspection &&
        matchesServiceContract &&
        matchesCustomerSite &&
        matchesTechnician &&
        matchesServiceType &&
        matchesStatus
      );
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.treatmentJobObj.status = { id: statusId };
  }

  ClearForm(form: any): void {
    this.treatmentJobObj = {};

    this.isEditTreatmentJob = false;
    this.statusValue = null;

    this.selectedServiceRequestId = null;
    this.selectedInspectionId = null;
    this.selectedServiceContractId = null;
    this.selectedCustomerSitesId = null;
    this.selectedTechniciansId = null;
    this.selectedServiceTypeId = null;
    this.selectedStatusId = null;

    form.resetForm();
  }
}
