import { Component, OnInit } from '@angular/core';
import { ServiceContractRepresentation } from '../services/api/module/service-contract-representation';
import { StatusService } from '../services/api/status/status.service';
import { CustomerService } from '../services/api/customer/customer.service';
import { CustomerSiteService } from '../services/api/customer-site/customer-site.service';
import { ServiceTypeService } from '../services/api/service-type/service-type.service';
import { FormBuilder } from '@angular/forms';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import swal from 'sweetalert';
import { ServiceContracService } from '../services/api/service-contract/service-contrac.service';

@Component({
  selector: 'app-service-contract',
  templateUrl: './service-contract.component.html',
  styleUrls: ['./service-contract.component.scss'],
})
export class ServiceContractComponent implements OnInit {
  serviceContractObj: ServiceContractRepresentation = {};
  serviceContracts: Array<any> = [];

  // Objects from other modules
  allCustomers: any;
  allCustomerSites: any;
  allServiceTypes: any;
  allStatus: any;

  // Selected dropdown IDs
  selectedCustomerId: number | null = null;
  selectedCustomerSiteId: number | null = null;
  selectedServiceTypeId: number | null = null;
  selectedStatusId: number | null = null;

  // Search and filter
  searchText: string = '';
  allServiceContracts: Array<any> = [];

  selectedFilterCustomerId: number | null = null;
  selectedFilterCustomerSiteId: number | null = null;
  selectedFilterServiceTypeId: number | null = null;
  selectedFilterStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditServiceContract: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private serviceContractService: ServiceContracService,
    private customerService: CustomerService,
    private customerSiteService: CustomerSiteService,
    private serviceTypeService: ServiceTypeService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditServiceContract = false;

    // Permissions
    this.canCreate = this.permissionHelper.has(
      AuthIds.SERVICE_CONTRACTS_CREATE,
    );
    this.canUpdate = this.permissionHelper.has(
      AuthIds.SERVICE_CONTRACTS_UPDATE,
    );
    this.canDelete = this.permissionHelper.has(
      AuthIds.SERVICE_CONTRACTS_DELETE,
    );

    // Load data
    this.GetAllServiceContracts();
    this.GetAllCustomers();
    this.GetAllCustomerSites();
    this.GetAllServiceTypes();
    this.GetAllServiceContractStatus();

    // Reset selected dropdown IDs
    this.selectedCustomerId = null;
    this.selectedCustomerSiteId = null;
    this.selectedServiceTypeId = null;
    this.selectedStatusId = null;
  }

  SaveServiceContract(form: any): void {
    if (form.invalid) {
      return;
    }

    // Set customer
    this.serviceContractObj.customer = {
      id: Number(this.selectedCustomerId),
    } as any;

    // Set customer site
    this.serviceContractObj.customerSite = {
      id: Number(this.selectedCustomerSiteId),
    } as any;

    // Set service type
    this.serviceContractObj.serviceType = {
      id: Number(this.selectedServiceTypeId),
    } as any;

    // Set status
    this.serviceContractObj.status = {
      id: Number(this.selectedStatusId),
    } as any;

    // Decide Add or Update
    this.type = this.isEditServiceContract == false ? 'Add' : 'Update';

    const isUpdate = this.type == 'Update';

    swal({
      title: isUpdate ? 'Update Service Contract?' : 'Add Service Contract?',
      text: isUpdate
        ? 'Are you sure you want to update this service contract?'
        : 'Are you sure you want to add this service contract?',
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

      this.serviceContractService
        .createServiceContract(this.serviceContractObj, this.type)
        .subscribe({
          next: (result): void => {
            if (isUpdate) {
              this.ClearForm(form);
              this.GetAllServiceContracts();

              swal(
                'Successful!',
                'Service Contract has been updated!',
                'success',
              );
            } else {
              this.GetAllServiceContracts();
              this.ClearForm(form);

              swal(
                'Successful!',
                'Service Contract has been added!',
                'success',
              );
            }
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} Service Contract:`,
              error,
            );

            swal(
              'Error!',
              isUpdate
                ? 'Failed to update Service Contract.'
                : 'Failed to add Service Contract.',
              'error',
            );
          },
        });
    });
  }

  GetServiceContractById(ID: any): void {
    this.serviceContractService.GetServiceContractById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Service Contract not found');
          return;
        }

        this.serviceContractObj = data;

        // Set dropdown values
        this.selectedCustomerId = data.customer?.id ?? null;
        this.selectedCustomerSiteId = data.customerSite?.id ?? null;
        this.selectedServiceTypeId = data.serviceType?.id ?? null;
        this.selectedStatusId = data.status?.id ?? null;

        this.isEditServiceContract = true;
      },

      error: (error) => {
        console.error('Failed to load service contract:', error);
      },
    });
  }

  GetAllServiceContracts(): void {
    this.serviceContractService.GetAllServiceContracts().subscribe({
      next: (allData) => {
        this.serviceContracts = allData?.data?.dataList || [];
        this.allServiceContracts = [...this.serviceContracts];
      },

      error: (error) => {
        console.error('Failed to load Service Contracts:', error);
      },
    });
  }

  DeleteServiceContractById(ID: any): void {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Service Contract?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.serviceContractService.DeleteServiceContractById(ID).subscribe({
          next: (allData) => {
            this.GetAllServiceContracts();

            swal(
              'Deleted!',
              'Service Contract has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete service contract:', error);

            swal('Error!', 'Failed to delete service contract.', 'error');
          },
        });
      }
    });
  }

  ////////// Load data from other modules /////////////

  // 1. Customers
  GetAllCustomers(): void {
    this.customerService.GetAllCustomers().subscribe({
      next: (allData) => {
        this.allCustomers = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load Customers:', error);
      },
    });
  }

  // 2. Customer Sites
  GetAllCustomerSites(): void {
    this.customerSiteService.GetAllCustomerSites().subscribe({
      next: (allData) => {
        this.allCustomerSites = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load Customer Sites:', error);
      },
    });
  }

  // 3. Service Types
  GetAllServiceTypes(): void {
    this.serviceTypeService.GetAllServiceTypes().subscribe({
      next: (allData) => {
        this.allServiceTypes = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load Service Types:', error);
      },
    });
  }

  // 4. Service Contract Status
  GetAllServiceContractStatus(): void {
    this.statusService.GetAllServiceContractStatus().subscribe({
      next: (allData) => {
        this.allStatus = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load Service Contract status:', error);
      },
    });
  }

  // Search and Filter
  SearchServiceContracts(): void {
    const search = this.searchText?.toLowerCase().trim() || '';

    this.serviceContracts = this.allServiceContracts.filter((type: any) => {
      // Search Fields
      const contractCode = type.contractCode?.toString().toLowerCase() || '';

      const startDate = type.startDate?.toString().toLowerCase() || '';

      const endDate = type.endDate?.toString().toLowerCase() || '';

      const visitFrequency =
        type.visitFrequency?.toString().toLowerCase() || '';

      const contractAmount =
        type.contractAmount?.toString().toLowerCase() || '';

      const terms = type.terms?.toString().toLowerCase() || '';

      const customer =
        type.customer?.customerName?.toString().toLowerCase() || '';

      const customerSite =
        type.customerSite?.siteName?.toString().toLowerCase() || '';

      const serviceType =
        type.serviceType?.serviceName?.toString().toLowerCase() || '';

      const status = type.status?.name?.toString().toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        contractCode.includes(search) ||
        startDate.includes(search) ||
        endDate.includes(search) ||
        visitFrequency.includes(search) ||
        contractAmount.includes(search) ||
        terms.includes(search) ||
        customer.includes(search) ||
        customerSite.includes(search) ||
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
        matchesServiceType &&
        matchesStatus
      );
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);

    this.serviceContractObj.status = { id: statusId } as any;
  }

  ClearForm(form: any): void {
    this.serviceContractObj = {};

    this.isEditServiceContract = false;
    this.statusValue = null;

    this.selectedCustomerId = null;
    this.selectedCustomerSiteId = null;
    this.selectedServiceTypeId = null;
    this.selectedStatusId = null;

    form.resetForm();
  }
}
