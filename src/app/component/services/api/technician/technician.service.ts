import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {
  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  createTechnician(technician: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(this.baseUrl + "/technician", technician);
    } else {
      return this.http.put(this.baseUrl + "/technician/" + technician.id, technician);
    }
  }

  GetAllTechnicians(): Observable<any> {
    return this.http.get(this.baseUrl + "/technicians");
  }

  GetTechniciansById(ID:any):Observable<any>{
    return this.http.get(this.baseUrl+"/technician/"+ID);
  }

  DeleteTechnicianById(ID:any):Observable<any>{
    return this.http.delete(this.baseUrl+"/technician/"+ID)
  }
}
