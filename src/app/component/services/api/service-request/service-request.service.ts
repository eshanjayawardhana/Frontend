import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

    constructor(private http: HttpClient) {}

    createServiceRequest(serviceRequest: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl + '/service-request-add', serviceRequest);
      } else {
        return this.http.put(
          this.baseUrl + '/service-request/' + serviceRequest.id,
          serviceRequest,
        );
      }
    }

    GetAllServiceRequests(): Observable<any> {
      return this.http.get(this.baseUrl + '/service-requests');
    }

    GetServiceRequestById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + '/service-request/' + ID);
    }

    DeleteServiceRequestById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + '/service-request/' + ID);
    }
}
