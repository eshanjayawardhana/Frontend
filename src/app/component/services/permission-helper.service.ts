import { Injectable } from '@angular/core';
import { UserAuthService } from './api/user/user-auth.service';

/** Must match auth_id values in system_authentications (see schema.sql). */
export const AuthIds = {
  // Generic buttons (optional shared IDs)
  BUTTON_SAVE: 7,
  BUTTON_DELETE: 8,

  // Student module
  STUDENT_VIEW: 10,
  STUDENT_CREATE: 11,
  STUDENT_UPDATE: 12,
  STUDENT_DELETE: 13,

  // Course module
  COURSE_VIEW: 20,
  COURSE_CREATE: 21,
  COURSE_UPDATE: 22,
  COURSE_DELETE: 23,

  // Teacher module
  TEACHER_VIEW: 30,
  TEACHER_CREATE: 31,
  TEACHER_UPDATE: 32,
  TEACHER_DELETE: 33,

  // Technician module
  TECHNICIAN_VIEW: 40,
  TECHNICIAN_CREATE: 41,
  TECHNICIAN_UPDATE: 42,
  TECHNICIAN_DELETE: 43,

  // Customer module
  CUSTOMER_VIEW: 50,
  CUSTOMER_CREATE: 51,
  CUSTOMER_UPDATE: 52,
  CUSTOMER_DELETE: 53,

  // Customer Site module
  CUSTOMER_SITE_VIEW: 60,
  CUSTOMER_SITE_CREATE: 61,
  CUSTOMER_SITE_UPDATE: 62,
  CUSTOMER_SITE_DELETE: 63,

  // Chemical module
  CHEMICAL_VIEW: 70,
  CHEMICAL_CREATE: 71,
  CHEMICAL_UPDATE: 72,
  CHEMICAL_DELETE: 73,

  // Pest Type module
  PEST_TYPE_VIEW: 80,
  PEST_TYPE_CREATE: 81,
  PEST_TYPE_UPDATE: 82,
  PEST_TYPE_DELETE: 83,

  // Notification module
  NOTIFICATION_VIEW: 90,
  NOTIFICATION_CREATE: 91,
  NOTIFICATION_UPDATE: 92,
  NOTIFICATION_DELETE: 93,
} as const;

@Injectable({ providedIn: 'root' })
export class PermissionHelperService {

  constructor(private userAuthService: UserAuthService) { }

  /** True if the logged-in user has this privilege auth_id. */
  has(authId: number): boolean {
    return this.userAuthService.getAuthIds().includes(authId);
  }

  hasAny(...authIds: number[]): boolean {
    const mine = this.userAuthService.getAuthIds();
    return authIds.some(id => mine.includes(id));
  }
}
