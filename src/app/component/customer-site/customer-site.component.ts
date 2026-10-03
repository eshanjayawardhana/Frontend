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
  allStatus: any;
  allCustomers: any;
  selectedStatusId: any = '';
  selectedCustomerId: any = '';

  // Search text for filtering customer sites
  searchText: string = '';
  allCustomerSites: Array<any> = [];
  selectedFilterStatusId: any = null;

  type: string;
  statusValue: any;
  isEditCustomerSite: boolean = false;
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
    this.canCreate = this.permissionHelper.has(AuthIds.CUSTOMER_SITE_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.CUSTOMER_SITE_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.CUSTOMER_SITE_DELETE);
    this.GetAllCustomerSitesStatus();
    this.GetAllCustomers();
    this.GetAllCustomerSites();
    this.selectedCustomerId = null;
    this.selectedStatusId = null;
  }

  SaveCustomerSite(form: any): void {
    // 1. Validate form
    if (form.invalid) {
      return;
    }

    // 2. Set status
    this.customerSiteObj.status = {
      id: Number(this.selectedStatusId),
    };

    // 3. Set customer
    this.customerSiteObj.customer = {
      id: Number(this.selectedCustomerId),
    };

    // 4. Decide Add or Update
    this.type = this.isEditCustomerSite == false ? 'Add' : 'Update';

    // ADD
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.customerSiteService
            .createCustomerSite(this.customerSiteObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllCustomerSites();
                this.ClearForm(form);

                swal('Successful!', 'Customer site has been added!', 'success');
              },

              error: (error): void => {
                console.error('Failed to add customer site:', error);

                swal('Error!', 'Failed to add customer site.', 'error');
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
          this.customerSiteService
            .createCustomerSite(this.customerSiteObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllCustomerSites();
                this.ClearForm(form);

                swal(
                  'Successful!',
                  'Customer site has been updated!',
                  'success',
                );
              },

              error: (error): void => {
                console.error('Failed to update customer site:', error);

                swal('Error!', 'Failed to update customer site.', 'error');
              },
            });
        }
      });
    }
  }

  GetCustomerSiteById(ID: any) {
    this.customerSiteService.GetCustomerSitesById(ID).subscribe((allData) => {
      this.customerSiteObj = allData.data.dataList[0];

      this.isEditCustomerSite = true;

      this.selectedStatusId = allData.data.dataList[0].status.id;
      this.selectedCustomerId = allData.data.dataList[0].customer.id;

      this.statusValue = allData.data.dataList[0].status.name;

      this.customerSiteObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the customer object
      };
      this.customerSiteObj.customer = {
        id: allData.data.dataList[0].customer.id, // Set the customer ID for the customer object
      };
    });
  }

  GetAllCustomerSites() {
    this.customerSiteService.GetAllCustomerSites().subscribe({
      next: (allData) => {
        this.customerSites = allData?.data?.dataList || [];
        this.allCustomerSites = [...this.customerSites];
        console.log('Customer Sites:', this.customerSites);
      },
      error: (error) => {
        console.error('Failed to load customer sites:', error);
      },
    });
  }

  DeleteCustomerSiteById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Customer Site?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.customerSiteService.DeleteCustomerSiteById(ID).subscribe({
          next: (allData) => {
            this.GetAllCustomerSites();

            swal(
              'Deleted!',
              'Customer Site has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete customer site:', error);

            swal('Error!', 'Failed to delete customer site.', 'error');
          },
        });
      }
    });
  }

  GetAllCustomerSitesStatus() {
    this.statusService.GetAllCustomerSiteStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
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

  SearchCustomerSites(): void {
    const search = this.searchText.toLowerCase().trim();

    this.customerSites = this.allCustomerSites.filter((site: any) => {
      // Search Fields
      const siteName = site.siteName?.toLowerCase() || '';

      const customerName = site.customer?.customerName?.toLowerCase() || '';

      const address = site.address?.toLowerCase() || '';

      const city = site.city?.toLowerCase() || '';

      const contactPerson = site.contactPerson?.toLowerCase() || '';

      const contactPhone = site.contactPhone?.toLowerCase() || '';

      const siteNotes = site.siteNotes?.toLowerCase() || '';

      const status = site.status?.name?.toLowerCase() || '';

      // Search Condition
      const matchesSearch =
        !search ||
        siteName.includes(search) ||
        customerName.includes(search) ||
        address.includes(search) ||
        city.includes(search) ||
        contactPerson.includes(search) ||
        contactPhone.includes(search) ||
        siteNotes.includes(search) ||
        status.includes(search);

      // Status Filter Condition
      const matchesStatus =
        this.selectedFilterStatusId === null ||
        this.selectedFilterStatusId === '' ||
        Number(site.status?.id) === Number(this.selectedFilterStatusId);

      // Final Result
      return matchesSearch && matchesStatus;
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.customerSiteObj.status = { id: statusId };
  }


  // onChangeCustomer(event: Event): void {
  //   const customerId = Number((event.target as HTMLSelectElement).value);
  //   this.customerSiteObj.customer = { id: customerId };
  // }

  ClearForm(form: any): void {
    this.customerSiteObj = {};
    this.isEditCustomerSite = false;
    this.statusValue = null;
    this.selectedStatusId = null;
    this.selectedCustomerId = null;

    form.resetForm(); // Reset the form to its initial state
  }
}
