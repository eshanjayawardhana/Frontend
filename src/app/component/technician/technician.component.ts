import { Component, OnInit } from '@angular/core';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { FormBuilder } from '@angular/forms';
import { TechnicianService } from '../services/api/technician/technician.service';
import { TechnicianRepresentation } from '../services/api/module/technician-representation';
import swal from 'sweetalert';
import { StatusService } from '../services/api/status/status.service';

import { UserAuthService } from '../services/api/user/user-auth.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss'],
})
export class TechnicianComponent implements OnInit {
  technicianObj: TechnicianRepresentation = {};
  technicians: Array<any> = [];
  allStatus: any;

  type: string;
  statusValue: any;
  isEditTechnician: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private technicianService: TechnicianService,
    private statusService: StatusService,
    private permissionHelper: PermissionHelperService,
    private userAuthService: UserAuthService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditTechnician = false;
    this.canCreate = this.permissionHelper.has(AuthIds.TECHNICIAN_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.TECHNICIAN_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.TECHNICIAN_DELETE);
    this.GetAllTechnicianStatus();
    this.GetAllTechnicians();
  }

  SaveTechnician(): void {
    this.type = this.isEditTechnician == false ? 'Add' : 'Update';
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          const userId = this.userAuthService.getUserId(); // Get the logged-in user's ID

          if (userId === null) {
            swal('Cannot save', 'No logged-in user was found.', 'error');
            return;
          }

          const technicianPayload = {
            ...this.technicianObj,
            user: { id: userId }, // Include the logged-in user's ID in the payload
          };

          console.log('Technician POST payload:', technicianPayload);

          this.technicianService
            .createTechnician(technicianPayload, 'Add')
            .subscribe({
              next: (result): void => {
                console.log('Technician response:', result);
                this.GetAllTechnicians();
                swal('Successful!', 'Technician has been added!', 'success');
              },
              error: (error): void => {
                console.error('Failed to add technician:', error);
                swal(
                  'Request failed',
                  'Technician could not be saved.',
                  'error',
                );
              },
            });
        }
      });
    } else {
      this.technicianService
        .createTechnician(this.technicianObj, this.type)
        .subscribe({
          next: (result): void => {
            this.GetAllTechnicians();
          },
        });
      swal('Sucessfull!', 'Technician has been updated!', 'success');
    }
  }

  GetTechnicianById(ID: any) {
    this.technicianService.GetTechniciansById(ID).subscribe((allData) => {
      this.technicianObj = allData.data.dataList[0];

      this.isEditTechnician = true;
      this.statusValue = allData.data.dataList[0].status.name;
      this.technicianObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the technician object
      };
    });
  }

  GetAllTechnicians() {
    this.technicianService.GetAllTechnicians().subscribe({
      next: (allData) => {
        this.technicians = allData?.data?.dataList || [];
        console.log('Technicians:', this.technicians);
      },
      error: (error) => {
        console.error('Failed to load technicians:', error);
      },
    });
  }

  DeleteById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Technician?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Deleted!', 'Technician has been deleted!', 'success');
        this.technicianService.DeleteTechnicianById(ID).subscribe((allData) => {
          this.GetAllTechnicians();
        });
      }
    });
  }

  GetAllTechnicianStatus() {
    this.statusService.GetAllTechnicianStatus().subscribe((allData) => {
      this.allStatus = allData.data.dataList;
    });
  }

  onChangeStatus(event: Event): void {
    const statusId = Number((event.target as HTMLSelectElement).value);
    this.technicianObj.status = { id: statusId };
  }
}
