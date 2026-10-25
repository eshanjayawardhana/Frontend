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
  customerTypes: string[] = ['Residential','Commercial','Industrial',];

  customerObj: CustomerRepresentation = { customerType: null as any, };
  customers: Array<any> = [];
  allStatus: any;
  selectedStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditCustomer: boolean = false;
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

  SaveCustomer(): void {
    this.customerObj.status = {
      id: Number(this.selectedStatusId),
    };

    const isUpdate = this.isEditCustomer;
    this.type = isUpdate ? 'Update' : 'Add';

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

            this.ClearForm();
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

  GetCustomerById(ID: any) {
    this.customerService.GetCustomerById(ID).subscribe((allData) => {
      this.customerObj = allData.data.dataList[0];

      this.isEditCustomer = true;

      this.selectedStatusId = allData.data.dataList[0].status.id;

      this.statusValue = allData.data.dataList[0].status.name;

      this.customerTypeValue = allData.data.dataList[0].customerType;

      this.customerObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the customer object
      };
    });
  }

  GetAllCustomers() {
    this.customerService.GetAllCustomers().subscribe({
      next: (allData) => {
        this.customers = allData?.data?.dataList || [];
        console.log('Customers:', this.customers);
      },
      error: (error) => {
        console.error('Failed to load customers:', error);
      },
    });
  }

  DeleteById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Customer?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Deleted!', 'Customer has been deleted!', 'success');
        this.customerService.DeleteCustomerById(ID).subscribe((allData) => {
          this.GetAllCustomers();
        });
      }
    });
  }

  GetAllCustomerStatus() {
    this.statusService.GetAllCustomerStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.customerObj.status = { id: statusId };
  }

  onChangeType($event: Event) {
    const selectedType = ($event.target as HTMLSelectElement).value;
    this.customerObj.customerType = selectedType;
  }

  ClearForm(): void {
    this.customerObj = {
      customerType: null as any,
    };

    this.isEditCustomer = false;
    this.statusValue = null;
    this.customerTypeValue = null;
    this.selectedStatusId = null;
  }
}
