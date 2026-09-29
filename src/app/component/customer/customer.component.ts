import { Component, OnInit } from '@angular/core';
import { TechnicianRepresentation } from '../services/api/module/technician-representation';
import { CustomerRepresentation } from '../services/api/module/customer-representation';
import { TechnicianService } from '../services/api/technician/technician.service';
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
  customerObj: CustomerRepresentation = { customerType: '' };
  customers: Array<any> = [];
  allStatus: any;
  selectedStatusId: any = '';

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
    this.type = this.isEditCustomer == false ? 'Add' : 'Update';
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.customerService
            .createCustomer(this.customerObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllCustomers();
              },
            });
          swal('Sucessfull!', 'Customer has been added!', 'success');
          this.ClearForm();
        }
      });
    } else {
      this.customerService
        .createCustomer(this.customerObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllCustomers();
          },
        });
      swal('Sucessfull!', 'Customer has been updated!', 'success');
      this.ClearForm();
    }
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
      customerType: '',
    };

    this.isEditCustomer = false;
    this.statusValue = null;
    this.customerTypeValue = null;
    this.selectedStatusId = '';
  }
}
