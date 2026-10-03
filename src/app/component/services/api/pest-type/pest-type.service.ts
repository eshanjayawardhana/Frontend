import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PestTypeService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

    constructor(private http: HttpClient) {}

    createPestType(pestType: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl + '/pest-type-add', pestType);
      } else {
        return this.http.put(
          this.baseUrl + '/pest-type/' + pestType.id,
          pestType,
        );
      }
    }

    GetAllPestTypes(): Observable<any> {
      return this.http.get(this.baseUrl + '/pest-types');
    }

    GetPestTypeById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + '/pest-type/' + ID);
    }

    DeletePestTypeById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + '/pest-type/' + ID);
    }
}
