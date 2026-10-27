import { Component, OnInit } from '@angular/core';
import { CustomerSiteRepresentation } from '../services/api/module/customer-site-representation';
import { CustomerSiteService } from '../services/api/customer-site/customer-site.service';
import { StatusService } from '../services/api/status/status.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { CustomerService } from '../services/api/customer/customer.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-customer-site',
  templateUrl: './customer-site.component.html',
  styleUrls: ['./customer-site.component.scss'],
})
export class CustomerSiteComponent implements OnInit {
  customerSiteObj: CustomerSiteRepresentation = {};

  customerSites: Array<any> = [];
  allCustomerSites: Array<any> = [];

  allStatus: any[] = [];
  allCustomers: any[] = [];

  selectedStatusId: number | null = null;
  selectedCustomerId: number | null = null;

  searchText = '';
  selectedFilterStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditCustomerSite = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private customerSiteService: CustomerSiteService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    private customerService: CustomerService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditCustomerSite = false;

    this.canCreate = this.permissionHelper.has(
      AuthIds.CUSTOMER_SITE_CREATE,
    );
    this.canUpdate = this.permissionHelper.has(
      AuthIds.CUSTOMER_SITE_UPDATE,
    );
    this.canDelete = this.permissionHelper.has(
      AuthIds.CUSTOMER_SITE_DELETE,
    );

    this.GetAllCustomerSitesStatus();
    this.GetAllCustomers();
    this.GetAllCustomerSites();
  }

  SaveCustomerSite(form: any): void {
    // Stop submission if the form is invalid.
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // Preserve the existing status payload.
    this.customerSiteObj.status = {
      id: Number(this.selectedStatusId),
    };

    // Preserve the existing customer relationship payload.
    this.customerSiteObj.customer = {
      id: Number(this.selectedCustomerId),
    };

    this.type = this.isEditCustomerSite ? 'Update' : 'Add';

    const isUpdate = this.type === 'Update';

    swal({
      title: isUpdate ? 'Update Customer Site?' : 'Add Customer Site?',
      text: isUpdate
        ? 'Are you sure you want to update this customer site?'
        : 'Are you sure you want to add this customer site?',
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

      this.customerSiteService
        .createCustomerSite(this.customerSiteObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllCustomerSites();
            this.ClearForm(form);

            swal(
              'Successful!',
              isUpdate
                ? 'Customer site has been updated successfully!'
                : 'Customer site has been added successfully!',
              'success',
            );
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} customer site:`,
              error,
            );

            swal(
              'Error!',
              isUpdate
                ? 'Failed to update customer site.'
                : 'Failed to add customer site.',
              'error',
            );
          },
        });
    });
  }

  GetCustomerSiteById(ID: any): void {
    this.customerSiteService.GetCustomerSitesById(ID).subscribe({
      next: (allData) => {
        const site = allData?.data?.dataList?.[0];

        if (!site) {
          console.error('Customer site not found.');
          return;
        }

        this.customerSiteObj = { ...site };

        this.isEditCustomerSite = true;
        this.selectedStatusId = site.status?.id ?? null;
        this.selectedCustomerId = site.customer?.id ?? null;
        this.statusValue = site.status?.name ?? null;

        // Preserve the existing relationship structure.
        this.customerSiteObj.status = {
          id: site.status?.id,
        };

        this.customerSiteObj.customer = {
          id: site.customer?.id,
        };
      },

      error: (error) => {
        console.error('Failed to load customer site:', error);
      },
    });
  }

  GetAllCustomerSites(): void {
    this.customerSiteService.GetAllCustomerSites().subscribe({
      next: (allData) => {
        this.allCustomerSites = allData?.data?.dataList || [];
        this.SearchCustomerSites();
      },

      error: (error) => {
        console.error('Failed to load customer sites:', error);
      },
    });
  }

  DeleteCustomerSiteById(ID: any): void {
    swal({
      title: 'Delete Customer Site?',
      text: 'Are you sure you want to delete this customer site?',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Yes, Delete'],
    }).then((willDelete) => {
      if (!willDelete) {
        return;
      }

      this.customerSiteService.DeleteCustomerSiteById(ID).subscribe({
        next: (result) => {
          this.GetAllCustomerSites();

          swal(
            'Deleted!',
            'Customer site has been deleted successfully!',
            'success',
          );
        },

        error: (error) => {
          console.error('Failed to delete customer site:', error);

          swal(
            'Error!',
            'Failed to delete customer site.',
            'error',
          );
        },
      });
    });
  }

  GetAllCustomerSitesStatus(): void {
    this.statusService.GetAllCustomerSiteStatus().subscribe({
      next: (allData) => {
        this.allStatus = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load customer site statuses:', error);
      },
    });
  }

  GetAllCustomers(): void {
    this.customerService.GetAllCustomers().subscribe({
      next: (allData) => {
        this.allCustomers = allData?.data?.dataList || [];
      },

      error: (error) => {
        console.error('Failed to load customers:', error);
      },
    });
  }

  SearchCustomerSites(): void {
    const search = (this.searchText || '').toLowerCase().trim();

    this.customerSites = this.allCustomerSites.filter((site: any) => {
      const siteCode = String(site.siteCode ?? site.id ?? '').toLowerCase();

      const customerCode = String(
        site.customerCode ?? site.customer?.customerCode ?? site.customer?.id ?? '',
      ).toLowerCase();

      const siteName = String(site.siteName ?? '').toLowerCase();
      const customerName = String(
        site.customer?.customerName ?? '',
      ).toLowerCase();
      const address = String(site.address ?? '').toLowerCase();
      const city = String(site.city ?? '').toLowerCase();
      const contactPerson = String(site.contactPerson ?? '').toLowerCase();
      const contactPhone = String(site.contactPhone ?? '').toLowerCase();
      const siteNotes = String(site.siteNotes ?? '').toLowerCase();
      const statusName = String(site.status?.name ?? '').toLowerCase();

      const matchesSearch =
        !search ||
        siteCode.includes(search) ||
        customerCode.includes(search) ||
        siteName.includes(search) ||
        customerName.includes(search) ||
        address.includes(search) ||
        city.includes(search) ||
        contactPerson.includes(search) ||
        contactPhone.includes(search) ||
        siteNotes.includes(search) ||
        statusName.includes(search);

      const matchesStatus =
        this.selectedFilterStatusId == null ||
        Number(site.status?.id) === Number(this.selectedFilterStatusId);

      return matchesSearch && matchesStatus;
    });
  }

  ClearFilters(): void {
    this.searchText = '';
    this.selectedFilterStatusId = null;

    this.SearchCustomerSites();
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);

    this.customerSiteObj.status = {
      id: statusId,
    };
  }

  ClearForm(form?: any): void {
    this.customerSiteObj = {};

    this.isEditCustomerSite = false;
    this.statusValue = null;
    this.selectedStatusId = null;
    this.selectedCustomerId = null;

    if (form) {
      form.resetForm({
        customer: null,
        siteName: '',
        address: '',
        city: '',
        contactPerson: '',
        contactPhone: '',
        siteNotes: '',
        status: null,
      });
    }
  }
}
