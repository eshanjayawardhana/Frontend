import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private baseUrl : string= 'http://localhost:8010/api/v1/student_has_course'; 
  private studentBaseUrl : string= 'http://localhost:8010/api/v1/student'; 

  constructor(
    private http:HttpClient
  ) { }

createClass(classObj:any, type:any):Observable<any>{
  if(type=='Add'){
    return this.http.post(this.baseUrl,classObj);
  }else{
    return this.http.put(this.baseUrl+"/"+classObj.id,classObj);
}
}

GetClassIdByCourseAndStudent(studentId:any,courseId:any):Observable<any>{
  return this.http.get(this.baseUrl+"/"+studentId+"/"+courseId);
}

GetClassById(ID:any):Observable<any>{
  return this.http.get(this.baseUrl+"/"+ID);
}

GetStudentForClass(ID:any):Observable<any>{
  return this.http.get(this.studentBaseUrl+"/getClass/"+ID);
}

DeleteClassById(ID:any):Observable<any>{
  return this.http.delete(this.baseUrl+"/"+ID)
}

}
