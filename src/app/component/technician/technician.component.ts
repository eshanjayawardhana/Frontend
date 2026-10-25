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
  specializations: string[] = ['Termite', 'Fumigation', 'General'];

  technicianObj: TechnicianRepresentation = { specialization: null as any };
  technicians: Array<any> = [];
  allStatus: any;
  selectedStatusId: number | null = null;

  type: string;
  statusValue: any;
  isEditTechnician: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;
  technicianSpecializationValue: any;

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
    // Set technician status
    this.technicianObj.status = {
      id: Number(this.selectedStatusId),
    };

    this.type = this.isEditTechnician ? 'Update' : 'Add';

    const isUpdate = this.isEditTechnician;

    swal({
      title: isUpdate ? 'Update Technician?' : 'Add Technician?',
      text: isUpdate
        ? 'Are you sure you want to update this technician?'
        : 'Are you sure you want to add this technician?',
      icon: 'warning',
      buttons: ['Cancel', isUpdate ? 'Yes, Update' : 'Yes, Add'],
      dangerMode: false,
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }

      let technicianPayload: any = {
        ...this.technicianObj,
      };

      // Include logged-in user's ID only when adding
      if (!isUpdate) {
        const userId = this.userAuthService.getUserId();

        if (userId === null) {
          swal('Cannot Save', 'No logged-in user was found.', 'error');
          return;
        }

        technicianPayload = {
          ...technicianPayload,
          user: { id: userId },
        };
      }

      console.log('Technician payload:', technicianPayload);

      this.technicianService
        .createTechnician(technicianPayload, this.type)
        .subscribe({
          next: (result): void => {
            console.log('Technician response:', result);

            this.GetAllTechnicians();

            swal(
              'Successful!',
              isUpdate
                ? 'Technician has been updated successfully!'
                : 'Technician has been added successfully!',
              'success',
            );

            this.ClearForm();
          },

          error: (error): void => {
            console.error(
              `Failed to ${isUpdate ? 'update' : 'add'} technician:`,
              error,
            );

            swal(
              'Request Failed',
              isUpdate
                ? 'Technician could not be updated. Please try again.'
                : 'Technician could not be added. Please try again.',
              'error',
            );
          },
        });
    });
  }

  GetTechnicianById(ID: any) {
    this.technicianService.GetTechniciansById(ID).subscribe((allData) => {
      this.technicianObj = allData.data.dataList[0];

      this.isEditTechnician = true;
      this.statusValue = allData.data.dataList[0].status.name;
      this.selectedStatusId = allData.data.dataList[0].status.id;

      this.technicianObj.status = {
        id: allData.data.dataList[0].status.id, // Set the status ID for the technician object
      };

      this.technicianSpecializationValue =
        allData.data.dataList[0].specialization;
    });
  }

  GetAllTechnicians() {
    this.technicianService.GetAllTechnicians().subscribe({
      next: (allData) => {
        this.technicians = allData?.data?.dataList || [];
        // console.log('Technicians:', this.technicians);
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

  onChangeType($event: Event) {
    const selectedType = ($event.target as HTMLSelectElement).value;
    this.technicianObj.specialization = selectedType;
  }

  ClearForm(): void {
    this.technicianObj = {
      specialization: null as any,
    };

    this.isEditTechnician = false;
    this.statusValue = null;
    this.technicianSpecializationValue = null;
    this.selectedStatusId = null;
  }
}
