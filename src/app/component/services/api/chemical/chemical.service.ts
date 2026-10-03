import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChemicalService {

  private baseUrl: string = 'http://localhost:8010/api/v1';

    constructor(private http: HttpClient) {}

    AddChemical(chemical: any, type: any): Observable<any> {
      if (type == 'Add') {
        return this.http.post(this.baseUrl + '/chemical-add', chemical);
      } else {
        return this.http.put(
          this.baseUrl + '/chemical/' + chemical.id,
          chemical,
        );
      }
    }

    GetAllChemicals(): Observable<any> {
      return this.http.get(this.baseUrl + '/chemicals');
    }

    GetChemicalById(ID: any): Observable<any> {
      return this.http.get(this.baseUrl + '/chemical/' + ID);
    }

    DeleteChemicalById(ID: any): Observable<any> {
      return this.http.delete(this.baseUrl + '/chemical/' + ID);
    }
}
