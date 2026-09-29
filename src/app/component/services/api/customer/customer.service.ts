import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

    constructor(private http: HttpClient) {}

    createCustomer(customer: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl + "/customer-add", customer);
      } else {
        return this.http.put(this.baseUrl + "/customer/" + customer.id, customer);
      }
    }

    GetAllCustomers(): Observable<any> {
      return this.http.get(this.baseUrl + "/customers");
    }

    GetCustomerById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/customer/"+ID);
    }

    DeleteCustomerById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/customer/"+ID)
    }
}
