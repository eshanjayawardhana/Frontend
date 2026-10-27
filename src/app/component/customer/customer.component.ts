import { Component, OnInit } from '@angular/core';
import { CustomerRepresentation } from '../services/api/module/customer-representation';
import { CustomerService } from '../services/api/customer/customer.service';
import { StatusService } from '../services/api/status/status.service';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  customerTypes: string[] = ['Residential', 'Commercial', 'Industrial'];

  customerObj: CustomerRepresentation = {
    customerType: null as any,
  };

  customers: Array<any> = [];
  allCustomers: Array<any> = [];

  allStatus: any;
  selectedStatusId: number | null = null;

  searchText = '';
  selectedFilterCustomerType: string | null = null;
  selectedFilterStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditCustomer = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  customerTypeValue: any;

  constructor(
    private customerService: CustomerService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditCustomer = false;

    this.canCreate = this.permissionHelper.has(AuthIds.CUSTOMER_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.CUSTOMER_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.CUSTOMER_DELETE);

    this.GetAllCustomerStatus();
    this.GetAllCustomers();
  }

  SaveCustomer(form: any): void {
    // Prevent saving invalid forms.
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // Preserve the existing status payload structure.
    this.customerObj.status = {
      id: Number(this.selectedStatusId),
    };

    const isUpdate = this.isEditCustomer;
    this.type = isUpdate ? 'Update' : 'Add';

    // Confirmation dialog.
    swal({
      title: isUpdate ? 'Update Customer?' : 'Add Customer?',
      text: isUpdate
        ? 'Are you sure you want to update this customer?'
        : 'Are you sure you want to add this customer?',
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

      this.customerService
        .createCustomer(this.customerObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllCustomers();

            swal(
              'Successful!',
              isUpdate
                ? 'Customer has been updated successfully!'
                : 'Customer has been added successfully!',
              'success',
            );

            this.ClearForm(form);
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} customer:`,
              error,
            );

            swal(
              'Request Failed',
              isUpdate
                ? 'Customer could not be updated. Please try again.'
                : 'Customer could not be added. Please try again.',
              'error',
            );
          },
        });
    });
  }

  GetCustomerById(ID: any): void {
    this.customerService.GetCustomerById(ID).subscribe({
      next: (allData) => {
        const customer = allData?.data?.dataList?.[0];

        if (!customer) {
          console.error('Customer not found.');
          return;
        }

        this.customerObj = { ...customer };

        this.isEditCustomer = true;
        this.selectedStatusId = customer.status?.id ?? null;
        this.statusValue = customer.status?.name ?? null;
        this.customerTypeValue = customer.customerType ?? null;

        // Preserve the existing status ID payload structure.
        this.customerObj.status = {
          id: customer.status?.id,
        };
      },
      error: (error) => {
        console.error('Failed to load customer:', error);
      },
    });
  }

  GetAllCustomers(): void {
    this.customerService.GetAllCustomers().subscribe({
      next: (allData) => {
        this.allCustomers = allData?.data?.dataList || [];
        this.SearchCustomers();
      },
      error: (error) => {
        console.error('Failed to load customers:', error);
      },
    });
  }

  SearchCustomers(): void {
    const search = (this.searchText || '').toLowerCase().trim();

    this.customers = this.allCustomers.filter((customer: any) => {
      const code = String(
        customer.customerCode ?? customer.id ?? '',
      ).toLowerCase();

      const name = String(customer.customerName ?? '').toLowerCase();
      const customerType = String(customer.customerType ?? '').toLowerCase();
      const email = String(customer.email ?? '').toLowerCase();
      const phone = String(customer.phone ?? '').toLowerCase();
      const nic = String(customer.nic ?? '').toLowerCase();
      const address = String(customer.billingAddress ?? '').toLowerCase();
      const statusName = String(customer.status?.name ?? '').toLowerCase();

      const matchesSearch =
        !search ||
        code.includes(search) ||
        name.includes(search) ||
        customerType.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        nic.includes(search) ||
        address.includes(search) ||
        statusName.includes(search);

      const matchesCustomerType =
        this.selectedFilterCustomerType == null ||
        customer.customerType === this.selectedFilterCustomerType;

      const matchesStatus =
        this.selectedFilterStatusId == null ||
        Number(customer.status?.id) === this.selectedFilterStatusId;

      return matchesSearch && matchesCustomerType && matchesStatus;
    });
  }

  ClearFilters(): void {
    this.searchText = '';
    this.selectedFilterCustomerType = null;
    this.selectedFilterStatusId = null;

    this.SearchCustomers();
  }

  DeleteById(ID: any): void {
    swal({
      title: 'Are you sure?',
      text: 'That you want to delete this customer?',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Yes, Delete'],
    }).then((willDelete) => {
      if (willDelete) {
        this.customerService.DeleteCustomerById(ID).subscribe({
          next: (allData) => {
            this.GetAllCustomers();

            swal(
              'Deleted!',
              'Customer has been deleted successfully!',
              'success',
            );
          },
          error: (error) => {
            console.error('Failed to delete customer:', error);
            swal('Error!', 'Customer could not be deleted.', 'error');
          },
        });
      }
    });
  }

  GetAllCustomerStatus(): void {
    this.statusService.GetAllCustomerStatus().subscribe({
      next: (allData) => {
        this.allStatus = allData?.data?.dataList || [];
      },
      error: (error) => {
        console.error('Failed to load customer statuses:', error);
      },
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.customerObj.status = { id: statusId };
  }

  onChangeType(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.customerObj.customerType = selectedType;
  }

  ClearForm(form?: any): void {
    this.customerObj = {
      customerType: null as any,
    };

    this.isEditCustomer = false;
    this.statusValue = null;
    this.customerTypeValue = null;
    this.selectedStatusId = null;

    if (form) {
      form.resetForm({
        customerName: '',
        customerType: null,
        email: '',
        phone: '',
        nic: '',
        billingAddress: '',
        status: null,
      });
    }
  }
}
