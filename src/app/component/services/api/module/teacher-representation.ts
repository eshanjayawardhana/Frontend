import { CourseRepresentation } from "./course-representation";
import { QualificationRepresentation } from "./qualification-representation";

export interface TeacherRepresentation {
    id?:string,
    teacherCode?:string,
    teacherName?:string,
    course?:CourseRepresentation,
    qualification?:QualificationRepresentation,
}