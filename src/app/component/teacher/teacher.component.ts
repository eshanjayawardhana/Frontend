import { Component } from '@angular/core';
import { TeacherService } from '../services/api/teacher/teacher.service';
import { CourseService } from '../services/api/course/course.service';
import { QualificationService } from '../services/api/qualification/qualification.service';
import { TeacherRepresentation } from '../services/api/module/teacher-representation';
import swal from 'sweetalert';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent {

  teacherObj:TeacherRepresentation = {};
  teachers: Array<any> = [];

  type:string;
  allCourse:any;
  courseValue:any;
  allQualification:any;
  qualificationValue:any;
  isEditTeacher:boolean=false;
  

  constructor(
    private TeacherService:TeacherService,
    private CourseService:CourseService,
    private Qualification:QualificationService
  ){

  }
  ngOnInit(): void {
    this.isEditTeacher == false;
    this.GetAllCourse();
    this.GetAllQualifications();
    this.GetAllTeachers();
}

GetAllCourse(){
  this.CourseService.GetAllCourses().subscribe(allData=>{
    this.allCourse = allData.data.dataList; 
    
  })
}

GetAllQualifications(){
  this.Qualification.GetAllQualification().subscribe(allData=>{
    this.allQualification = allData.data.dataList;
  })
}

onChangeCourse(C:any):void{
  this.teacherObj.course = C.target.value;
  console.log(this.teacherObj.course);
  
}

onChangeQualification(Q:any):void{
  this.teacherObj.qualification = Q.target.value;
  console.log(this.teacherObj.qualification);
  
}

DeleteById(ID:any){
  
  swal({
    title: "Are you sure",
    text: "That you want to Delete this Teacher?",
    icon: "warning",
    dangerMode: true,
  })
  .then(willDelete => {
    if (willDelete) {
      swal("Deleted!", "Teacher has been deleted!", "success");
      this.TeacherService.DeleteTeacherById(ID).subscribe(allData=>{
        this.GetAllTeachers();
      })
    }
  });
}

GetTeacherById(ID:any){
  this.TeacherService.GetTeacherById(ID).subscribe(allData=>{ 
    this.teacherObj = allData.data.dataList[0];
  
    this.isEditTeacher = true;
    this.courseValue=allData.data.dataList[0].course.courseName;
    this.qualificationValue=allData.data.dataList[0].qualification.qualificationName;

    this.teacherObj.course = allData.data.dataList[0].course.courseName;
    this.teacherObj.qualification = allData.data.dataList[0].qualification.id;
    
  })
}

GetAllTeachers(){
  this.TeacherService.GetAllTeachers().subscribe(allData=>{
    this.teachers = allData.data.dataList; 
  })
}

SaveTeacher():void{

  this.type = this.isEditTeacher==false?'Add':'Update';
  if(this.type=='Add'){
    swal({
      title: "Are you sure?",
      text: "That you want to Add this details?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.TeacherService.createTeacher(this.teacherObj,this.type)
        .subscribe({
          next:(result):void=>{
              this.GetAllTeachers();   
          }
        });
        swal("Sucessfull!", "Teacher has been Adedd!", "success");
      }
     
    });
  }else{
    
    this.TeacherService.createTeacher(this.teacherObj,this.type)
        .subscribe({
          next:(result):void=>{
            this.GetAllTeachers();  
          }
        });
    swal("Sucessfull!", "Teacher has been updated!", "success");
  }
}


}
