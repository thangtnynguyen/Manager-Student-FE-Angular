import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { ApiResult } from 'src/app/core/models/interfaces/common/api-result.interface';
import { Teacher } from 'src/app/core/models/teacher/teacher.model';

@Injectable({
  providedIn: 'root', 
})
export class TeacherService {
  private adminApiPrefix = PrefixApi.admin;

  constructor(private http: HttpClient) { }

  getTeachers(request: any = null): Observable<any> {
    return this.http.get<ApiResult<Teacher>>(`${this.adminApiPrefix}/teacher/get`, request);
  }

  createTeachers(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/teacher/create`, request);
  }

  getTeacherById(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/teacher/get-by-id?id=${request.id}`,{});
  }

  editTeacher(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/teacher/edit`, request);
  }

  deleteTeacher(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/teacher/delete`, request);
  }

  deleteMultipleTeacher(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/teacher/delete-multiple`, request);
  }
}

