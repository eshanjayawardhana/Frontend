import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentRepresentation } from '../module/student-representation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl : string= 'http://localhost:8010/api/v1/student'; 

  constructor(
    private http:HttpClient
  ) { }

  createStudent(student:any,type:any):Observable<any>{
      if(type=='Add'){
        return this.http.post(this.baseUrl,student);
      }else{
        return this.http.put(this.baseUrl+"/"+student.id,student);
    }
        
  }

  GetAllStudents():Observable<any>{
    return this.http.get(this.baseUrl);
  }

  GetStudentsById(ID:any):Observable<any>{
    return this.http.get(this.baseUrl+"/"+ID);
  }

  DeleteStudentById(ID:any):Observable<any>{
    return this.http.delete(this.baseUrl+"/"+ID)
  }


}
