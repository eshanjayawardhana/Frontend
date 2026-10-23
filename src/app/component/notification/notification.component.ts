import { Component, OnInit } from '@angular/core';
import { NotificationRepresentation } from '../services/api/module/notification-representation';
import {
  AuthIds,
  PermissionHelperService,
} from '../services/permission-helper.service';
import { FormBuilder } from '@angular/forms';
import swal from 'sweetalert';
import { NotificationService } from '../services/api/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notificationObj: NotificationRepresentation = {
    recipientId: undefined,
    recipientType: '',
    message: '',
    type: '',
    sentDate: '',
    readStatus: null,
  };
  notifications: Array<any> = [];
  selectedNotificationId: any = '';

  // Search text for filtering notifications
  searchText: string = '';
  allNotifications: Array<any> = [];
  selectedFilterRecipientTypeId: string | null = null;
  selectedFilterNotificationTypeId: string | null = null;
  selectedFilterReadStatus: boolean | null = null;

  type: string;
  isEditNotification: boolean = false;
  dtDynamicVerticalScrollExample: any;

  canCreate = false;
  canUpdate = false;
  canDelete = false;

  constructor(
    private permissionHelper: PermissionHelperService,
    private notificationService: NotificationService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditNotification = false;
    this.canCreate = this.permissionHelper.has(AuthIds.NOTIFICATION_CREATE);
    this.canUpdate = this.permissionHelper.has(AuthIds.NOTIFICATION_UPDATE);
    this.canDelete = this.permissionHelper.has(AuthIds.NOTIFICATION_DELETE);
    this.GetAllNotifications();
  }

  SaveNotification(form: any): void {
    // Validate form
    if (form.invalid) {
      return;
    }

    // Decide Add or Update
    this.type = this.isEditNotification == false ? 'Add' : 'Update';

    // ADD
    if (this.type == 'Add') {
      swal({
        title: 'Are you sure?',
        text: 'That you want to Add this details?',
        icon: 'warning',
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.notificationService
            .createNotification(this.notificationObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllNotifications();
                this.ClearForm(form);

                swal('Successful!', 'Notification has been added!', 'success');
              },

              error: (error): void => {
                console.error('Failed to add notification:', error);

                swal('Error!', 'Failed to add notification.', 'error');
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
          this.notificationService
            .createNotification(this.notificationObj, this.type)
            .subscribe({
              next: (result): void => {
                this.GetAllNotifications();
                this.ClearForm(form);

                swal(
                  'Successful!',
                  'Notification has been updated!',
                  'success',
                );
              },

              error: (error): void => {
                console.error('Failed to update notification:', error);

                swal('Error!', 'Failed to update notification.', 'error');
              },
            });
        }
      });
    }
  }

  GetNotificationById(ID: any) {
    this.notificationService.GetNotificationById(ID).subscribe({
      next: (allData) => {
        const data = allData?.data?.dataList?.[0];

        if (!data) {
          console.error('Notification not found');
          return;
        }

        this.notificationObj = {
          id: data.id,
          recipientId: data.recipientId,
          recipientType: data.recipientType,
          message: data.message,
          type: data.type,
          sentDate: data.sentDate,
          readStatus: data.readStatus,
        };

        console.log('Edit Notification:', this.notificationObj);

        this.isEditNotification = true;
      },

      error: (error) => {
        console.error('Failed to load notification:', error);
      },
    });
  }

  GetAllNotifications(): void {
  this.notificationService.GetAllNotifications().subscribe({
    next: (allData) => {
      const data = allData?.data?.dataList || [];

      this.notifications = data;
      this.allNotifications = [...data];

      console.log('All Notifications:', this.allNotifications);
    },
    error: (error) => {
      console.error('Failed to load notifications:', error);
    },
  });
}

  DeleteNotificationById(ID: any) {
    swal({
      title: 'Are you sure',
      text: 'That you want to Delete this Notification?',
      icon: 'warning',
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.notificationService.DeleteNotificationById(ID).subscribe({
          next: (allData) => {
            this.GetAllNotifications();

            swal(
              'Deleted!',
              'Notification has been deleted successfully!',
              'success',
            );
          },

          error: (error) => {
            console.error('Failed to delete notification:', error);

            swal('Error!', 'Failed to delete notification.', 'error');
          },
        });
      }
    });
  }

  SearchNotifications(): void {
    const search = this.searchText.toLowerCase().trim();

    this.notifications = this.allNotifications.filter((notification: any) => {
      const recipientId =
        notification.recipientId?.toString().toLowerCase() || '';

      const recipientType = notification.recipientType?.toLowerCase() || '';

      const message = notification.message?.toLowerCase() || '';

      const type = notification.type?.toLowerCase() || '';

      const sentDate = notification.sentDate?.toLowerCase() || '';

      const readStatus =
        notification.readStatus?.toString().toLowerCase() || '';

      // Search bar
      const matchesSearch =
        !search ||
        recipientId.includes(search) ||
        recipientType.includes(search) ||
        message.includes(search) ||
        type.includes(search) ||
        sentDate.includes(search) ||
        readStatus.includes(search);

      // Recipient Type filter
      const matchesRecipientType =
        this.selectedFilterRecipientTypeId === null ||
        recipientType === this.selectedFilterRecipientTypeId.toLowerCase();

      // Notification Type filter
      const matchesNotificationType =
        this.selectedFilterNotificationTypeId === null ||
        type === this.selectedFilterNotificationTypeId.toLowerCase();

      // Read Status filter
      const matchesReadStatus =
        this.selectedFilterReadStatus === null ||
        notification.readStatus === this.selectedFilterReadStatus;

      return (
        matchesSearch &&
        matchesRecipientType &&
        matchesNotificationType &&
        matchesReadStatus
      );
    });
  }

  ClearForm(form: any): void {
  form.resetForm({
    recipientId: undefined,
    recipientType: '',
    message: '',
    type: '',
    sentDate: '',
    readStatus: null,
  });

  this.notificationObj = {
    recipientId: undefined,
    recipientType: '',
    message: '',
    type: '',
    sentDate: '',
    readStatus: null,
  };

  this.isEditNotification = false;
}
}
