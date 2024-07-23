import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStudentLoadingService } from 'src/app/shared/services/https/http-student-loading.service';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';
import { HttpStudentNotLoadingService } from 'src/app/shared/services/https/http-student-not-loading.service';

@Injectable({
  providedIn: 'root', 
})
export class StudentService {
  constructor(private httpAdminLoading: HttpAdminLoadingService) { }

  getStudents(request: any = null): Observable<any> {
    return this.httpAdminLoading.get('student/get', request);
  }

  createStudents(request: any): Observable<any> {
    return this.httpAdminLoading.post('student/create', request);
  }

  getStudentById(request: any): Observable<any> {
    return this.httpAdminLoading.get(`student/get-by-id?id=${request.id}`,{});
  }

  editStudent(request: any): Observable<any> {
    return this.httpAdminLoading.post('student/edit', request);
  }

  deleteStudent(request: any): Observable<any> {
    return this.httpAdminLoading.post('student/delete', request);
  }

  deleteMultipleStudent(request: any): Observable<any> {
    return this.httpAdminLoading.post('student/delete-multiple', request);
  }
}
