import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  createInspection(inspection: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(
        this.baseUrl + '/inspection-add',
        inspection
      );
    } else {
      return this.http.put(
        this.baseUrl + '/inspection/' + inspection.id,
        inspection
      );
    }
  }

  GetAllInspections(): Observable<any> {
    return this.http.get(this.baseUrl + '/inspections');
  }

  GetInspectionById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + '/inspection/' + ID);
  }

  DeleteInspectionById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/inspection/' + ID);
  }
}
