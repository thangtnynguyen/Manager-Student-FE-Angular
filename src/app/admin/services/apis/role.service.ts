import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTeacherLoadingService } from 'src/app/shared/services/https/http-teacher-loading.service';




import { HttpClient } from '@angular/common/http';
import { PrefixApi } from 'src/app/core/constants/prefix-api.constant';
import { ApiResult } from 'src/app/core/models/interfaces/common/api-result.interface';



@Injectable({
  providedIn: 'root'
})
export class RoleService {
  

  private adminApiPrefix = PrefixApi.admin;

  constructor(private http: HttpClient) { }

  getRoles(request: any = null): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/role/get`, request);
  }

  createRole(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/role/create`, request);
  }

  getRoleById(request: any): Observable<any> {
    return this.http.get(`${this.adminApiPrefix}/role/get-by-id?id=${request.id}`, {});
  }

  editRole(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/role/edit`, request);
  }

  deleteRole(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/role/delete`, request);
  }

  deleteMultipleRole(request: any): Observable<any> {
    return this.http.post(`${this.adminApiPrefix}/role/delete-multiple`, request);
  }





  // constructor(private http: HttpTeacherLoadingService) { }

  // getRoles(request: any = null): Observable<any> {
  //   return this.http.get('role/get', request);
  // }
  // createRole(request: any): Observable<any> {
  //   return this.http.postFormData('role/create', request);
  // }
  // editRole(request: any): Observable<any> {
  //   return this.http.postFormData('role/edit', request);
  // }
  // deleteRole(request: any): Observable<any> {
  //   return this.http.post('role/delete', request);
  // }

  // deleteMultipleRole(request: any): Observable<any> {
  //   return this.http.post('role/delete-multiple', request);
  // }
}
