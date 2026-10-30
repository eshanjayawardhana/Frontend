import { CustomerSiteService } from './../services/api/customer-site/customer-site.service';
import { CustomerSiteComponent } from './../customer-site/customer-site.component';
import { CustomerService } from './../services/api/customer/customer.service';
import { Component, OnInit } from '@angular/core';
import { ServiceRequestRepresentation } from '../services/api/module/service-request-representation';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { StatusService } from '../services/api/status/status.service';
import { ServiceTypeService } from '../services/api/service-type/service-type.service';
import { PestTypeService } from '../services/api/pest-type/pest-type.service';
import { ServiceRequestService } from '../services/api/service-request/service-request.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
})
export class ServiceRequestComponent implements OnInit {
  // Priority options
  priorityOptions: string[] = ['Low', 'Normal', 'High'];

  serviceRerquestObj: ServiceRequestRepresentation = { priority: null as any };
  serviceRequests: Array<any> = [];

  // objects from other modules
  allCustomers: any;
  allCustomerSites: any;
  allPestTypes: any;
  allServiceTypes: any;
  allStatus: any;

  selectedStatusId: number | null = null;
  selectedPestTypeId: number | null = null;
  selectedServiceTypeId: number | null = null;
  selectedCustomerId: number | null = null;
  selectedCustomerSiteId: number | null = null;

  // Search text for filtering service requests
  searchText: string = '';
  allServiceRequests: Array<any> = [];

  selectedFilterStatusId: number | null = null;
  selectedFilterPestTypeId: number | null = null;
  selectedFilterServiceTypeId: number | null = null;
  selectedFilterCustomerId: number | null = null;
  selectedFilterCustomerSiteId: number | null = null;

  type: string;
  statusValue: any;
  isEditServiceRequest: boolean = false;
  dtDynamicVerticalScrollExample: any;

  // ServiceRequestColumns = [
  //   'requestCode',
  //   'requestDate',
  //   'preferredDate',
  //   'problemDescription',
  //   'priority',
  //   'customer',
  //   'customerSite',
  //   'pestType',
  //   'serviceType',
  //   'Actions',
  // ];

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private serviceTypeService: ServiceTypeService,
    private statusService: StatusService,
    private pestTypeService: PestTypeService,
    private serviceRequestService: ServiceRequestService,
    private customerService: CustomerService,
    private CustomerSiteService: CustomerSiteService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditServiceRequest = false;
    this.canCreate = this.permissionHelper.has(AuthIds.SERVICE_REQUEST_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.SERVICE_REQUEST_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.SERVICE_REQUEST_DELETE);

    this.GetAllServiceRequestStatus();
    this.GetAllPestTypes();
    this.GetAllServiceTypes();
    this.GetAllServiceRequests();
    this.GetAllCustomers();
    this.GetAllCustomerSites();

    this.selectedPestTypeId = null;
    this.selectedStatusId = null;
    this.selectedServiceTypeId = null;
    this.selectedCustomerId = null;
    this.selectedCustomerSiteId = null;
  }

  SaveServiceRequest(form: any): void {
    if (form.invalid) {
      return;
    }

    // Set status — unchanged
    this.serviceRerquestObj.status = {
      id: Number(this.selectedStatusId),
    };

    // Set customer — unchanged
    this.serviceRerquestObj.customer = {
      id: Number(this.selectedCustomerId),
    };

    // Set customer site — unchanged
    this.serviceRerquestObj.customerSite = {
      id: Number(this.selectedCustomerSiteId),
    };

    // Set pest type — unchanged
    this.serviceRerquestObj.pestType = {
      id: Number(this.selectedPestTypeId),
    };

    // Set service type — unchanged
    this.serviceRerquestObj.serviceType = {
      id: Number(this.selectedServiceTypeId),
    };

    // Decide Add or Update — unchanged
    this.type = this.isEditServiceRequest == false ? 'Add' : 'Update';

    const isUpdate = this.type == 'Update';

    swal({
      title: isUpdate ? 'Update Service Request?' : 'Add Service Request?',
      text: isUpdate
        ? 'Are you sure you want to update this service request?'
        : 'Are you sure you want to add this service request?',
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

      this.serviceRequestService
        .createServiceRequest(this.serviceRerquestObj, this.type)
        .subscribe({
          next: (result): void => {
            if (isUpdate) {
              this.ClearForm(form);
              this.GetAllServiceRequests();

              swal(
                'Successful!',
                'Service Request has been updated!',
                'success',
              );
            } else {
              this.GetAllServiceRequests();
              this.ClearForm(form);

              swal('Successful!', 'Service Request has been added!', 'success');
            }
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} Service Request:`,
              error,
            );

            swal(
              'Error!',
              isUpdate
                ? 'Failed to update Service Request.'
                : 'Failed to add Service Request.',
              'error',
            );
          },
        });
    });
  }

  GetServiceRequestById(ID: any) {
    this.serviceRequestService.GetServiceRequestById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Service Request not found');
          return;
        }

        this.serviceRerquestObj = data;

        // Set dropdown values
        this.selectedCustomerId = data.customer?.id ?? null;
        this.selectedCustomerSiteId = data.customerSite?.id ?? null;
        this.selectedPestTypeId = data.pestType?.id ?? null;
        this.selectedServiceTypeId = data.serviceType?.id ?? null;
        this.selectedStatusId = data.status?.id ?? null;

        console.log('Edit Service Request:', this.serviceRerquestObj);
        console.log('Priority:', this.serviceRerquestObj.priority);

        this.isEditServiceRequest = true;
      },

      error: (error) => {
        console.error('Failed to load service request:', error);
      },
    });
  }

  GetAllServiceRequests() {
    this.serviceRequestService.GetAllServiceRequests().subscribe({
      next: (allData) => {
        this.serviceRequests = allData?.data?.dataList || [];
        this.allServiceRequests = [...this.serviceRequests];
        console.log('Service Requests:', this.serviceRequests);
      },
      error: (error) => {
        console.error('Failed to load customer sites:', error);
      },
    });
  }

  DeleteServiceRequestById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Service Type?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.serviceRequestService.DeleteServiceRequestById(ID).subscribe({
          next: (allData) => {
            this.GetAllServiceRequests();

            swal(
              'Deleted!',
              'Service Request has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete service Request:', error);

            swal('Error!', 'Failed to delete service Request.', 'error');
          },
        });
      }
    });
  }

  GetAllCustomers() {
    this.customerService.GetAllCustomers().subscribe({
      next: (allData) => {
        this.allCustomers = allData?.data?.dataList || [];
        // console.log('Customers:', this.allCustomers);
      },
      error: (error) => {
        console.error('Failed to load customers:', error);
      },
    });
  }

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

  GetAllServiceTypes() {
    this.serviceTypeService.GetAllServiceTypes().subscribe({
      next: (allData) => {
        this.allServiceTypes = allData?.data?.dataList || [];
        // console.log('Service Types:', this.serviceTypes);
      },
      error: (error) => {
        console.error('Failed to load service types:', error);
      },
    });
  }

  GetAllServiceRequestStatus() {
    this.statusService.GetAllServiceRequestStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
    });
  }

  SearchServiceRequests(): void {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.serviceRequests = this.allServiceRequests.filter((type: any) => {
      
      // Search Fields
      const requestCode = type.requestCode?.toString().toLowerCase() || '';

      const requestDate = type.requestDate?.toString().toLowerCase() || '';

      const preferredDate = type.preferredDate?.toString().toLowerCase() || '';

      const problemDescription =
        type.problemDescription?.toString().toLowerCase() || '';

      const priority = type.priority?.toString().toLowerCase() || '';

      const customer =
        type.customer?.customerName?.toString().toLowerCase() || '';

      const customerSite =
        type.customerSite?.siteName?.toString().toLowerCase() || '';

      const pestType = type.pestType?.pestName?.toString().toLowerCase() || '';

      const serviceType =
        type.serviceType?.serviceName?.toString().toLowerCase() || '';

      const status = type.status?.name?.toString().toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        requestCode.includes(search) ||
        requestDate.includes(search) ||
        preferredDate.includes(search) ||
        problemDescription.includes(search) ||
        priority.includes(search) ||
        customer.includes(search) ||
        customerSite.includes(search) ||
        pestType.includes(search) ||
        serviceType.includes(search) ||
        status.includes(search);

      // Customer Filter
      const matchesCustomer =
        this.selectedFilterCustomerId == null ||
        Number(type.customer?.id) === Number(this.selectedFilterCustomerId);

      // Customer Site Filter
      const matchesCustomerSite =
        this.selectedFilterCustomerSiteId == null ||
        Number(type.customerSite?.id) ===
          Number(this.selectedFilterCustomerSiteId);

      // Pest Type Filter
      const matchesPestType =
        this.selectedFilterPestTypeId == null ||
        Number(type.pestType?.id) === Number(this.selectedFilterPestTypeId);

      // Service Type Filter
      const matchesServiceType =
        this.selectedFilterServiceTypeId == null ||
        Number(type.serviceType?.id) ===
          Number(this.selectedFilterServiceTypeId);

      // Status Filter
      const matchesStatus =
        this.selectedFilterStatusId == null ||
        Number(type.status?.id) === Number(this.selectedFilterStatusId);
      // Final Result
      return (
        matchesSearch &&
        matchesCustomer &&
        matchesCustomerSite &&
        matchesPestType &&
        matchesServiceType &&
        matchesStatus
      );
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.serviceRerquestObj.status = { id: statusId };
  }

  onChangeType($event: Event) {
    const selectedType = ($event.target as HTMLSelectElement).value;
    this.serviceRerquestObj.priority = selectedType;
  }

  ClearForm(form: any): void {
    this.serviceRerquestObj = {
      priority: null as any,
    };

    this.isEditServiceRequest = false;
    this.statusValue = null;

    this.selectedStatusId = null;
    this.selectedCustomerId = null;
    this.selectedPestTypeId = null;
    this.selectedCustomerSiteId = null;
    this.selectedServiceTypeId = null;

    form.resetForm();
  }
}
