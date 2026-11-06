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
  styleUrls: ['./treatment-job.component.scss'],
})
export class TreatmentJobComponent implements OnInit {
  treatmentJobObj: TreatmentJobRepresentation = {};
  treatmentJobs: Array<any> = [];

  // Objects from other modules
  allServiceRequests: any[] = [];
  allInspections: any[] = [];
  allServiceContracts: any[] = [];
  allCustomerSites: any[] = [];
  allTechnicians: any[] = [];
  allServiceTypes: any[] = [];
  allStatus: any[] = [];

  // Filtered records for dropdowns
  filteredServiceRequests: any[] = [];
  filteredInspections: any[] = [];
  filteredServiceContracts: any[] = [];
  filteredCustomerSites: any[] = [];
  filteredServiceTypes: any[] = [];

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

  selectedServiceRequestData: any = null;

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

    // Validate: Must select either Service Request OR Service Contract (not both, not neither)
    if (
      (this.selectedServiceRequestId == null &&
        this.selectedServiceContractId == null) ||
      (this.selectedServiceRequestId != null &&
        this.selectedServiceContractId != null)
    ) {
      swal(
        'Validation Error!',
        'Please select either a Service Request or a Service Contract.',
        'warning',
      );
      return;
    }

    // Set Service Request (null if Contract-based job)
    this.treatmentJobObj.serviceRequest =
      this.selectedServiceRequestId == null
        ? (null as any)
        : { id: Number(this.selectedServiceRequestId) };

    // Set Inspection
    this.treatmentJobObj.inspection = {
      id: Number(this.selectedInspectionId),
    };

    // Set Service Contract (null if One-time Service Request job)
    this.treatmentJobObj.serviceContract =
      this.selectedServiceContractId == null
        ? (null as any)
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

              swal('Successful!', 'Treatment Job has been updated!', 'success');
            } else {
              this.GetAllTreatmentJobs();
              this.ClearForm(form);

              swal('Successful!', 'Treatment Job has been added!', 'success');
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

        // Apply filtering based on active workflow
        if (this.selectedServiceRequestId !== null) {
          this.onServiceRequestChange(this.selectedServiceRequestId);
        } else if (this.selectedServiceContractId !== null) {
          this.onServiceContractChange(this.selectedServiceContractId);
        }

        // Preserve saved Inspection selection
        this.selectedInspectionId = data.inspection?.id ?? null;

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
        this.SearchTreatmentJobs(); // Apply search and filters after loading data
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
        // only return service requests that have status "New"
        this.allServiceRequests = allData?.data?.dataList.filter(
          (serviceRequest: any) =>
            serviceRequest.status?.name?.toLowerCase() === 'new',
        );
        this.filteredServiceRequests = [...this.allServiceRequests]; // Initialize filtered list
        // this.allServiceRequests = allData?.data?.dataList || [];
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
        // only return service requests that have status "Scheduled"
        this.allInspections = allData?.data?.dataList.filter(
          (inspection: any) =>
            inspection.status?.name?.toLowerCase() === 'scheduled',
        );
        this.filteredInspections = [...this.allInspections];
        // this.allInspections = allData?.data?.dataList || [];
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
        // only return service contracts that have status "Active"
        this.allServiceContracts = allData?.data?.dataList.filter(
          (serviceContract: any) =>
            serviceContract.status?.name?.toLowerCase() === 'active',
        );
        this.filteredServiceContracts = [...this.allServiceContracts];
        // this.allServiceContracts = allData?.data?.dataList || [];
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
        // only return customer sites that have status "Active"
        this.allCustomerSites = allData?.data?.dataList.filter(
          (customerSite: any) =>
            customerSite.status?.name?.toLowerCase() === 'active',
        );
        this.filteredCustomerSites = [...this.allCustomerSites];
        // this.allCustomerSites = allData?.data?.dataList || [];
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
        // only return technicians that have status "Active"
        this.allTechnicians = allData?.data?.dataList.filter(
          (technician: any) =>
            technician.status?.name?.toLowerCase() === 'active',
        );
        // this.allTechnicians = allData?.data?.dataList || [];
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
        // only return service types that have status "Active"
        this.allServiceTypes = allData?.data?.dataList.filter(
          (serviceType: any) =>
            serviceType.status?.name?.toLowerCase() === 'active',
        );
        this.filteredServiceTypes = [...this.allServiceTypes];
        // this.allServiceTypes = allData?.data?.dataList || [];
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

        // Set default status only in Add Mode
        if (!this.isEditTreatmentJob) {
          this.setDefaultStatus('In Progress');
        }

        // Table filter default status
        const activeStatus = this.allStatus.find(
          (status: any) => status.name?.toLowerCase() === 'in progress',
        );

        this.selectedFilterStatusId = activeStatus
          ? Number(activeStatus.id)
          : null;

        // Apply default filter
        this.SearchTreatmentJobs();
      },
      error: (error) => {
        console.error('Failed to load Treatment Job status:', error);
      },
    });
  }

  // 8. selected service request by id
  getCusDetailsBySelectedServiceReq(ID: any) {
    if (!ID) {
      this.selectedServiceRequestData = null;
      return;
    }

    this.serviceRequestService.GetServiceRequestById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Service Request not found');
          return;
        }

        this.selectedServiceRequestId = data.id ?? null;

        this.selectedServiceRequestData = data;
      },

      error: (error) => {
        console.error('Failed to load Service Request:', error);
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

      const scheduledDate = type.scheduledDate?.toString().toLowerCase() || '';

      const completedDate = type.completedDate?.toString().toLowerCase() || '';

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
        Number(type.inspection?.id) === Number(this.selectedFilterInspectionId);

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

  ///////// Dropdown Filtering Logic (Request / Contract / Site / Inspection / Service Type) ///////////////

  getEntitySiteId(item: any): number | null {
    const siteId =
      item?.customerSite?.id ?? item?.customerSiteId ?? item?.site_id;
    return siteId == null ? null : Number(siteId);
  }

  getEntityServiceTypeId(item: any): number | null {
    const serviceTypeId =
      item?.serviceType?.id ?? item?.serviceTypeId ?? item?.service_type_id;
    return serviceTypeId == null ? null : Number(serviceTypeId);
  }

  // Get Service Request ID from an Inspection object
  getInspectionRequestId(inspection: any): number | null {
    const reqId =
      inspection?.serviceRequest?.id ??
      inspection?.serviceRequestId ??
      inspection?.request_id;
    return reqId == null ? null : Number(reqId);
  }

  // Get Technician ID from an Inspection object
  getInspectionTechnicianId(inspection: any): number | null {
    const techId =
      inspection?.technician?.id ??
      inspection?.technicianId ??
      inspection?.technician_id;
    return techId == null ? null : Number(techId);
  }

  resetDropdownLists(): void {
    this.filteredServiceRequests = [...this.allServiceRequests];
    this.filteredServiceContracts = [...this.allServiceContracts];
    this.filteredInspections = [...this.allInspections];
    this.filteredCustomerSites = [...this.allCustomerSites];
    this.filteredServiceTypes = [...this.allServiceTypes];
  }

  // 1. Workflow A: Service Request Selected
  onServiceRequestChange(value: any): void {
    const requestId = value == null || value === '' ? null : Number(value);
    this.selectedServiceRequestId = requestId;

    // If cleared
    if (requestId === null) {
      this.selectedServiceRequestData = null;
      if (this.selectedServiceContractId === null) {
        this.resetDropdownLists();
        this.selectedCustomerSitesId = null;
        this.selectedServiceTypeId = null;
        this.selectedInspectionId = null;
        this.selectedTechniciansId = null;
      }
      return;
    }

    // Rule: Service Contract must be NULL when Service Request is selected
    this.selectedServiceContractId = null;

    // Load Service Request Details Card (Customer Site, Service Type, etc.)
    this.getCusDetailsBySelectedServiceReq(requestId);

    const selectedReq = this.allServiceRequests.find(
      (sr: any) => Number(sr.id) === requestId,
    );

    if (!selectedReq) {
      return;
    }

    const siteId = this.getEntitySiteId(selectedReq);
    const serviceTypeId = this.getEntityServiceTypeId(selectedReq);

    // Auto-select and lock Customer Site
    if (siteId !== null) {
      this.selectedCustomerSitesId = siteId;
      this.filteredCustomerSites = this.allCustomerSites.filter(
        (site: any) => Number(site.id) === siteId,
      );
    }

    // Auto-select and lock Service Type (prevents manual mismatch)
    if (serviceTypeId !== null) {
      this.selectedServiceTypeId = serviceTypeId;
      this.filteredServiceTypes = this.allServiceTypes.filter(
        (st: any) => Number(st.id) === serviceTypeId,
      );
    }

    // Filter Inspections linked to this Request (or Site)
    const reqInspections = this.allInspections.filter(
      (ins: any) => this.getInspectionRequestId(ins) === requestId,
    );

    this.filteredInspections =
      reqInspections.length > 0
        ? reqInspections
        : this.allInspections.filter(
            (ins: any) => this.getEntitySiteId(ins) === siteId,
          );

    // Auto-select Inspection and its Technician if 1 Inspection matches
    if (this.filteredInspections.length === 1) {
      const matchedInspection = this.filteredInspections[0];
      this.selectedInspectionId = Number(matchedInspection.id);
      this.selectedTechniciansId =
        this.getInspectionTechnicianId(matchedInspection);
    } else if (
      !this.filteredInspections.some(
        (ins: any) => Number(ins.id) === Number(this.selectedInspectionId),
      )
    ) {
      this.selectedInspectionId = null;
      this.selectedTechniciansId = null;
    }
  }

  // 2. Workflow B: Service Contract Selected
  onServiceContractChange(value: any): void {
    const contractId = value == null || value === '' ? null : Number(value);
    this.selectedServiceContractId = contractId;

    // If cleared
    if (contractId === null) {
      if (this.selectedServiceRequestId === null) {
        this.resetDropdownLists();
        this.selectedCustomerSitesId = null;
        this.selectedServiceTypeId = null;
        this.selectedInspectionId = null;
        this.selectedTechniciansId = null;
      }
      return;
    }

    // Rule: Service Request must be NULL when Service Contract is selected
    this.selectedServiceRequestId = null;
    this.selectedServiceRequestData = null;

    // Rule: Service Contract jobs do NOT come from an Inspection or a Request,
    // so clear Inspection and Technician so they don't pick wrong data from other requests!
    this.selectedInspectionId = null;
    this.selectedTechniciansId = null;

    const selectedContract = this.allServiceContracts.find(
      (sc: any) => Number(sc.id) === contractId,
    );

    if (!selectedContract) {
      return;
    }

    const siteId = this.getEntitySiteId(selectedContract);
    const serviceTypeId = this.getEntityServiceTypeId(selectedContract);

    // Auto-select and lock Customer Site
    if (siteId !== null) {
      this.selectedCustomerSitesId = siteId;
      this.filteredCustomerSites = this.allCustomerSites.filter(
        (site: any) => Number(site.id) === siteId,
      );
    }

    // Auto-select and lock Service Type (prevents manual mismatch)
    if (serviceTypeId !== null) {
      this.selectedServiceTypeId = serviceTypeId;
      this.filteredServiceTypes = this.allServiceTypes.filter(
        (st: any) => Number(st.id) === serviceTypeId,
      );
    }

    // For Contract-based jobs, we don't force inspections, but we can filter inspections for this site if needed
    this.filteredInspections = this.allInspections.filter(
      (ins: any) => this.getEntitySiteId(ins) === siteId,
    );
  }

  /// 3. Customer Site Selected -> Filter Requests, Contracts, and Inspections for that Site
  onCustomerSiteChange(value: any): void {
    const siteId = value == null || value === '' ? null : Number(value);
    this.selectedCustomerSitesId = siteId;

    if (siteId === null) {
      this.selectedServiceRequestId = null;
      this.selectedServiceContractId = null;
      this.selectedInspectionId = null;
      this.selectedServiceTypeId = null;
      this.selectedTechniciansId = null;
      this.selectedServiceRequestData = null;
      this.resetDropdownLists();
      return;
    }

    // Filter Requests, Contracts, and Inspections belonging to this Site
    this.filteredServiceRequests = this.allServiceRequests.filter(
      (sr: any) => this.getEntitySiteId(sr) === siteId,
    );

    this.filteredServiceContracts = this.allServiceContracts.filter(
      (sc: any) => this.getEntitySiteId(sc) === siteId,
    );

    this.filteredInspections = this.allInspections.filter(
      (ins: any) => this.getEntitySiteId(ins) === siteId,
    );

    // Case 1: Only 1 Service Request exists (and no Service Contracts) -> Auto-select Request workflow
    if (
      this.filteredServiceRequests.length === 1 &&
      this.filteredServiceContracts.length === 0
    ) {
      this.onServiceRequestChange(Number(this.filteredServiceRequests[0].id));
      return;
    }

    // Case 2: Only 1 Service Contract exists (and no Service Requests) -> Auto-select Contract workflow
    if (
      this.filteredServiceContracts.length === 1 &&
      this.filteredServiceRequests.length === 0
    ) {
      this.onServiceContractChange(Number(this.filteredServiceContracts[0].id));
      this.selectedInspectionId = null; // Contracts don't have inspections
      this.selectedTechniciansId = null; // Technicians must be chosen manually for contracts
      return;
    }

    // Case 3: Both exist or multiple exist -> Auto-select Inspection if only 1 inspection exists
    if (this.filteredInspections.length === 1) {
      const matchedInspection = this.filteredInspections[0];
      this.selectedInspectionId = Number(matchedInspection.id);
      this.selectedTechniciansId =
        this.getInspectionTechnicianId(matchedInspection);
    }
  }

  // 4. Inspection Selected -> Auto-select linked Service Request, Site, and Technician
  onInspectionChange(value: any): void {
    const inspectionId = value == null || value === '' ? null : Number(value);
    this.selectedInspectionId = inspectionId;

    if (inspectionId === null) {
      this.selectedTechniciansId = null;
      return;
    }

    const selectedInspection = this.allInspections.find(
      (ins: any) => Number(ins.id) === inspectionId,
    );

    if (!selectedInspection) {
      return;
    }

    const reqId = this.getInspectionRequestId(selectedInspection);
    const siteId = this.getEntitySiteId(selectedInspection);
    const techId = this.getInspectionTechnicianId(selectedInspection);

    // If Inspection has a linked Service Request and no Contract is active
    if (
      reqId !== null &&
      this.selectedServiceContractId === null &&
      this.allServiceRequests.some((sr: any) => Number(sr.id) === reqId)
    ) {
      this.onServiceRequestChange(reqId);
      this.selectedInspectionId = inspectionId;
    } else if (siteId !== null && this.selectedCustomerSitesId === null) {
      this.onCustomerSiteChange(siteId);
      this.selectedInspectionId = inspectionId;
    }

    // Auto-select Technician from the selected Inspection
    if (techId !== null) {
      this.selectedTechniciansId = techId;
    }
  }

  ClearTreatmentJobFilters(): void {
    this.searchText = '';
    this.selectedFilterServiceRequestId = null;
    this.selectedFilterInspectionId = null;
    this.selectedFilterServiceContractId = null;
    this.selectedFilterCustomerSitesId = null;
    this.selectedFilterTechniciansId = null;
    this.selectedFilterServiceTypeId = null;

    const activeStatus = this.allStatus?.find(
      (status: any) => status.name?.toLowerCase() === 'in progress',
    );

    this.selectedFilterStatusId = activeStatus ? Number(activeStatus.id) : null;

    this.SearchTreatmentJobs();
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.selectedStatusId = statusId;
    this.treatmentJobObj.status = { id: statusId };
  }

  //////// default status //////

  setDefaultStatus(statusName: string): void {
    const defaultStatus = this.allStatus?.find(
      (status: any) => status.name?.toLowerCase() === statusName.toLowerCase(),
    );

    this.selectedStatusId = defaultStatus ? Number(defaultStatus.id) : null;

    this.treatmentJobObj.status = defaultStatus
      ? { id: Number(defaultStatus.id) }
      : (null as any);
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

    this.selectedServiceRequestData = null;

    // Set default status
    this.setDefaultStatus('In Progress');

    // Reset all filtered dropdown lists
    this.resetDropdownLists();

    if (form) {
      form.resetForm({ statusId: this.selectedStatusId });
    }
  }
}
