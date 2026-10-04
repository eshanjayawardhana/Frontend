import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './component/student/student.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { ClassComponent } from './component/class/class.component';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { RegisterComponent } from './component/register/register.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { PrivilegeComponent } from './component/privilege/privilege.component';
import { QualificationComponent } from './component/qualification/qualification.component';
import { TechnicianComponent } from './component/technician/technician.component';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomerSiteComponent } from './component/customer-site/customer-site.component';
import { ChemicalComponent } from './component/chemical/chemical.component';
import { PestTypeComponent } from './component/pest-type/pest-type.component';
import { NotificationComponent } from './component/notification/notification.component';
import { ServiceTypeComponent } from './component/service-type/service-type.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: InstituteLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forbidden', component: ForbiddenComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
  { path: 'course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard] },
  {
    path: 'technician',
    component: TechnicianComponent,
    canActivate: [AuthGuard],
  },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
  {
    path: 'customer-site',
    component: CustomerSiteComponent,
    canActivate: [AuthGuard],
  },
  { path: 'chemical', component: ChemicalComponent, canActivate: [AuthGuard] },
  { path: 'pest-type', component: PestTypeComponent, canActivate: [AuthGuard] },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service-type',
    component: ServiceTypeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'qualification',
    component: QualificationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'class', component: ClassComponent, canActivate: [AuthGuard] },
  {
    path: 'privilege',
    component: PrivilegeComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
