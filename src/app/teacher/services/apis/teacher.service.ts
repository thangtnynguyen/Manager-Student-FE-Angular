import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';
import { HttpTeacherNotLoadingService } from 'src/app/shared/services/https/http-teacher-not-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class TeacherService {
  constructor(private http: HttpTeacherLoadingService) { }

  // getTeachers(request: any = null): Observable<any> {
  //   return this.http.get('teacher/get', request);
  // }

  // createTeachers(request: any): Observable<any> {
  //   return this.http.post('teacher/create', request);
  // }

  getTeacherById(request: any): Observable<any> {
    return this.http.get(`teacher/get-by-id?id=${request.id}`,{});
  }

  getTeacherByUserId(request: any): Observable<any> {
    return this.http.get(`teacher/get-by-userId?id=${request.id}`,{});
  }


  editTeacher(request: any): Observable<any> {
    return this.http.post('teacher/edit', request);
  }

  deleteTeacher(request: any): Observable<any> {
    return this.http.post('teacher/delete', request);
  }

  // deleteMultipleTeacher(request: any): Observable<any> {
  //   return this.http.post('teacher/delete-multiple', request);
  // }
}

