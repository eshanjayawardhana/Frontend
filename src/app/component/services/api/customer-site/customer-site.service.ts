import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerSiteService {
  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  createCustomerSite(customerSite: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(this.baseUrl + '/customer-site-add', customerSite);
    } else {
      return this.http.put(
        this.baseUrl + '/customer-site/' + customerSite.id,
        customerSite,
      );
    }
  }

  GetAllCustomerSites(): Observable<any> {
    return this.http.get(this.baseUrl + '/customer-sites');
  }

  GetCustomerSitesById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + '/customer-site/' + ID);
  }

  DeleteCustomerSiteById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/customer-site/' + ID);
  }
}
