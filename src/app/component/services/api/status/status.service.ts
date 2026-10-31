import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  GetAllStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/student-status`);
  }

  GetAllTechnicianStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/technician-status`);
  }

  GetAllCustomerStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer-status`);
  }

  GetAllCustomerSiteStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer-site-status`);
  }

  GetAllChemicalStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/chemical-status`);
  }

  GetAllServiceTypeStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/service-type-status`);
  }

  GetAllServiceRequestStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/service-request-status`);
  }

  GetAllInspectionStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inspection-status`);
  }

  GetAllTreatmentJobStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/treatment-job-status`);
  }

  GetAllServiceContractStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/service-contract-status`);
  }
}
