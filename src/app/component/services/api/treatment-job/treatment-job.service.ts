import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreatmentJobService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

  constructor(private http: HttpClient) {}

  createTreatmentJob(treatmentJob: any, type: any): Observable<any> {
    if (type == 'Add') {
      return this.http.post(
        this.baseUrl + '/treatment-job-add',
        treatmentJob
      );
    } else {
      return this.http.put(
        this.baseUrl + '/treatment-job/' + treatmentJob.id,
        treatmentJob
      );
    }
  }

  GetAllTreatmentJobs(): Observable<any> {
    return this.http.get(this.baseUrl + '/treatment-jobs');
  }

  GetTreatmentJobById(ID: any): Observable<any> {
    return this.http.get(this.baseUrl + '/treatment-job/' + ID);
  }

  DeleteTreatmentJobById(ID: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/treatment-job/' + ID);
  }
}
