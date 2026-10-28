import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceContracService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  createServiceContract(serviceContract: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(
        this.baseUrl + '/service-contract-add',
        serviceContract
      );
    } else {
      return this.http.put(
        this.baseUrl + '/service-contract/' + serviceContract.id,
        serviceContract
      );
    }
  }

  GetAllServiceContracts(): Observable<any> {
    return this.http.get(this.baseUrl + '/service-contracts');
  }

  GetServiceContractById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + '/service-contract/' + ID);
  }

  DeleteServiceContractById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/service-contract/' + ID);
  }
}
