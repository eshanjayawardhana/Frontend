import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

    constructor(private http: HttpClient) {}

    createServiceType(serviceType: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl + '/service-type', serviceType);
      } else {
        return this.http.put(
          this.baseUrl + '/service-type/' + serviceType.id,
          serviceType,
        );
      }
    }

    GetAllServiceTypes(): Observable<any> {
      return this.http.get(this.baseUrl + '/service-types');
    }

    GetServiceTypeById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + '/service-type/' + ID);
    }

    DeleteServiceTypeById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + '/service-type/' + ID);
    }
}
