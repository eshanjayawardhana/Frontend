import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './component/student/student.component';
import { CourseComponent } from './component/course/course.component';
import { TeacherComponent } from './component/teacher/teacher.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ClassComponent } from './component/class/class.component';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { AuthGuard } from './component/auth/auth.guard';
import { AuthInterceptor } from './component/auth/auth.interceptor';
import { InstituteLoginComponent } from './component/institute-login/institute-login.component';
import { RegisterComponent } from './component/register/register.component';
import { PrivilegeComponent } from './component/privilege/privilege.component';
import { QualificationComponent } from './component/qualification/qualification.component';
import { TechnicianComponent } from './component/technician/technician.component';
import { CustomerComponent } from './component/customer/customer.component';
import { CustomerSiteComponent } from './component/customer-site/customer-site.component';
import { ChemicalComponent } from './component/chemical/chemical.component';
import { PestTypeComponent } from './component/pest-type/pest-type.component';
import { NotificationComponent } from './component/notification/notification.component';
import { ServiceTypeComponent } from './component/service-type/service-type.component';
import { ServiceRequestComponent } from './component/service-request/service-request.component';
import { PageHeaderComponent } from './component/page-header/page-header.component';
import { StatCardComponent } from './component/stat-card/stat-card.component';
import { StatusBadgeComponent } from './component/status-badge/status-badge.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InspectionComponent } from './component/inspection/inspection.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    CourseComponent,
    TeacherComponent,
    DashboardComponent,
    ClassComponent,
    ForbiddenComponent,
    InstituteLoginComponent,
    RegisterComponent,
    PrivilegeComponent,
    QualificationComponent,
    TechnicianComponent,
    CustomerComponent,
    CustomerSiteComponent,
    ChemicalComponent,
    PestTypeComponent,
    NotificationComponent,
    ServiceTypeComponent,
    ServiceRequestComponent,
    PageHeaderComponent,
    StatCardComponent,
    StatusBadgeComponent,
    InspectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [
    AuthGuard,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptor,
      multi:true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
