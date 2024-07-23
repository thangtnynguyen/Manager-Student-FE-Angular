import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpStudentLoadingService } from 'src/app/shared/services/https/http-student-loading.service';
import { HttpAdminLoadingService } from 'src/app/shared/services/https/http-admin-loading.service';
import { HttpStudentNotLoadingService } from 'src/app/shared/services/https/http-student-not-loading.service';

import { HttpClient } from '@angular/common/http';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { ApiResult } from 'src/app/core/models/interfaces/common/api-result.interface';


@Injectable({
  providedIn: 'root',
})
export class StudentService {


  private adminApiPrefix = PrefixApi.admin;

  constructor(private http: HttpClient) { }

  getStudents(request: any = null): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/student/get`, request);
  }

  createStudents(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/student/create`, request);
  }

  getStudentById(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/student/get-by-id?id=${request.id}`, {});
  }

  editStudent(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/student/edit`, request);
  }

  deleteStudent(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/student/delete`, request);
  }

  deleteMultipleStudent(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/student/delete-multiple`, request);
  }


  // constructor(private httpAdminLoading: HttpAdminLoadingService) { }

  // getStudents(request: any = null): Observable<any> {
  //   return this.httpAdminLoading.get('student/get', request);
  // }

  // createStudents(request: any): Observable<any> {
  //   return this.httpAdminLoading.post('student/create', request);
  // }

  // getStudentById(request: any): Observable<any> {
  //   return this.httpAdminLoading.get(`student/get-by-id?id=${request.id}`,{});
  // }

  // editStudent(request: any): Observable<any> {
  //   return this.httpAdminLoading.post('student/edit', request);
  // }

  // deleteStudent(request: any): Observable<any> {
  //   return this.httpAdminLoading.post('student/delete', request);
  // }

  // deleteMultipleStudent(request: any): Observable<any> {
  //   return this.httpAdminLoading.post('student/delete-multiple', request);
  // }




}
