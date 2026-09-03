import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl : string= 'http://localhost:8010/api/v1/course'; 

  constructor(
    private http:HttpClient
  ) { }

createCourse(course:any,type:any):Observable<any>{
    if(type=='Add'){
      return this.http.post(this.baseUrl,course);
    }else{
      return this.http.put(this.baseUrl+"/"+course.id,course);
  }
      
}

GetCourseById(ID:any):Observable<any>{
  return this.http.get(this.baseUrl+"/"+ID);
}

GetAllCourses():Observable<any>{
    return this.http.get(this.baseUrl);
}

DeleteCourseById(ID:any):Observable<any>{
  return this.http.delete(this.baseUrl+"/"+ID)
}
}
